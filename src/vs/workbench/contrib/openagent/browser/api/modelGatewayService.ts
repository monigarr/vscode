/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/api/modelGatewayService.ts
 * PURPOSE: Unified AI Model Gateway — sole production egress for inference.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-12
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Injected as IModelGatewayService; UI/agents call complete()/stream()/embed() only.
 *
 * DEPENDENCIES:
 * - IConfigurationService, ILogService, IRequestService, ISecretStorageService
 * - Protocol adapters (OpenAI-compatible, Anthropic)
 *
 * SECURITY:
 * - No provider HTTP outside adapters.
 * - BYOK keys resolved via OpenAgentSecrets only.
 * - Feature disabled (openagent.enabled=false) fails closed.
 *
 * RISK CLASS: R2
 *
 * DATA HANDLING:
 * - Classification: Workspace content in messages; redacted model.call logs only.
 * - Privacy: local_private classes cannot fall back across privacy boundary.
 *
 * AI NOTES:
 * - Routes by MES model class via versioned routing table.
 * - Protocol allowlist: openai_compatible + anthropic; vendors are profiles.
 *
 * OBSERVABILITY:
 * - Emits gateway_request_id, routing_table_id, mapping_version, fallback_depth, profile_id.
 *
 * PERFORMANCE:
 * - Circuit breaker skips unhealthy routes; ordered finite fallbacks.
 * =============================================================================
 */

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IRequestService } from '../../../../../platform/request/common/request.js';
import { ISecretStorageService } from '../../../../../platform/secrets/common/secrets.js';
import {
	IModelGatewayCompletionResponse,
	IModelGatewayEmbeddingResponse,
	IModelGatewayMeta,
	IModelGatewayRequest,
	IModelGatewayService,
	IModelGatewayStreamEvent,
} from '../../common/modelGateway.js';
import {
	OPEN_AGENT_DEFAULT_ANTHROPIC_BASE_URL,
	OPEN_AGENT_DEFAULT_ANTHROPIC_MODEL,
	OPEN_AGENT_DEFAULT_EMBED_MODEL,
	OPEN_AGENT_DEFAULT_MAPPING_VERSION,
	OPEN_AGENT_DEFAULT_OLLAMA_BASE_URL,
	OPEN_AGENT_DEFAULT_OLLAMA_MODEL,
	OPEN_AGENT_DEFAULT_OPENAI_BASE_URL,
	OPEN_AGENT_DEFAULT_OPENAI_MODEL,
	OPEN_AGENT_DEFAULT_TIMEOUT_MS,
	OpenAgentConfigKeys,
} from '../../common/openAgent.js';
import { MODEL_CLASSES } from '../../common/modelClasses.js';
import {
	getOpenAiCompatibleProfile,
	IOpenAiCompatibleProfile,
	isLocalOpenAiCompatibleProfileId,
	isOpenAiCompatibleProfileId,
	OPENAI_COMPATIBLE_PROFILE_IDS,
	OpenAiCompatibleProfileId,
	shouldOverrideProfilePin,
} from '../../common/profiles.js';
import { PROVIDER_IDS, ProviderId } from '../../common/providers.js';
import {
	circuitKeyFor,
	DEFAULT_ROUTING_TABLE,
	filterFallbacksForPrivacy,
	IResolvedRoute,
	IRoutingTarget,
	resolveRoute,
	withMappingVersion,
} from '../../common/routingConfig.js';
import { CircuitBreaker } from './circuitBreaker.js';
import { OpenAgentSecrets } from './openAgentSecrets.js';
import { OpenAgentTelemetry } from './openAgentTelemetry.js';
import { AnthropicProvider } from './providers/anthropicProvider.js';
import { OpenAiCompatibleProvider } from './providers/openAiCompatibleProvider.js';
import { ProviderRegistry } from './providerRegistry.js';

const ALLOWED_PROVIDERS: readonly ProviderId[] = [PROVIDER_IDS.openaiCompatible, PROVIDER_IDS.anthropic];

export class ModelGatewayService extends Disposable implements IModelGatewayService {
	declare readonly _serviceBrand: undefined;

	private readonly _registry = new ProviderRegistry();
	private readonly _breaker = new CircuitBreaker();
	private readonly _secrets: OpenAgentSecrets;
	private readonly _telemetry: OpenAgentTelemetry;

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILogService private readonly _logService: ILogService,
		@IRequestService requestService: IRequestService,
		@ISecretStorageService secretStorageService: ISecretStorageService,
	) {
		super();
		this._secrets = new OpenAgentSecrets(secretStorageService);
		this._telemetry = new OpenAgentTelemetry(this._logService);
		this._registry.register(new OpenAiCompatibleProvider(requestService));
		this._registry.register(new AnthropicProvider(requestService));
	}

	async complete(request: IModelGatewayRequest, token: CancellationToken): Promise<IModelGatewayCompletionResponse> {
		this._assertEnabled();
		const gatewayRequestId = generateUuid();
		const started = Date.now();
		const route = this._resolveRoute(request);
		const candidates = this._buildCandidates(request, route);

		let fallbackDepth = 0;
		let lastError: Error | undefined;

		for (const candidate of candidates) {
			if (!this._isProviderAllowed(candidate.providerId)) {
				continue;
			}
			const key = circuitKeyFor(candidate);
			if (!this._breaker.allow(key)) {
				this._logService.trace(`[openagent.gateway] circuit open for ${key}`);
				continue;
			}

			try {
				const adapter = this._registry.get(candidate.providerId);
				const profile = this._profileFor(candidate);
				const result = await adapter.complete({
					providerModelId: candidate.providerModelId,
					messages: request.messages,
					temperature: request.temperature,
					maxTokens: request.budget?.maxTokens,
					apiKey: await this._apiKeyFor(candidate),
					baseUrl: this._baseUrlFor(candidate),
					timeoutMs: this._timeoutMs(),
					requiresApiKey: profile?.requiresApiKey ?? true,
					profileId: candidate.profileId,
				}, token);

				const latencyMs = Date.now() - started;
				const meta = this._meta(gatewayRequestId, request, route, candidate, fallbackDepth, latencyMs, result.usage);
				this._breaker.recordSuccess(key);
				this._telemetry.logModelCall({
					...meta,
					traceId: request.traceId,
					agentId: request.agentId,
					success: true,
					sensitivityDecision: request.sensitivity ?? 'unspecified',
					taskType: request.taskType,
				});
				return { ...meta, result };
			} catch (err) {
				lastError = err instanceof Error ? err : new Error(String(err));
				this._breaker.recordFailure(key);
				fallbackDepth += 1;
			}
		}

		const latencyMs = Date.now() - started;
		const failedTarget = candidates[0] ?? route.target;
		this._telemetry.logModelCall({
			gatewayRequestId,
			traceId: request.traceId,
			agentId: request.agentId,
			routingTableId: route.routingTableId,
			matchedRuleId: route.matchedRuleId,
			modelClass: request.modelClass,
			providerId: failedTarget.providerId,
			providerModelId: failedTarget.providerModelId,
			mappingVersion: route.mappingVersion,
			fallbackDepth,
			latencyMs,
			success: false,
			errorCode: lastError?.name ?? 'ProviderError',
			sensitivityDecision: request.sensitivity ?? 'unspecified',
			taskType: request.taskType,
		});
		throw lastError ?? new Error('Open-Agent Model Gateway: no healthy provider available.');
	}

	async *stream(request: IModelGatewayRequest, token: CancellationToken): AsyncIterable<IModelGatewayStreamEvent> {
		this._assertEnabled();
		const gatewayRequestId = generateUuid();
		const started = Date.now();
		const route = this._resolveRoute(request);
		const candidates = this._buildCandidates(request, route);

		let fallbackDepth = 0;
		let lastError: Error | undefined;

		for (const candidate of candidates) {
			if (!this._isProviderAllowed(candidate.providerId)) {
				continue;
			}
			const key = circuitKeyFor(candidate);
			if (!this._breaker.allow(key)) {
				continue;
			}

			try {
				const adapter = this._registry.get(candidate.providerId);
				const profile = this._profileFor(candidate);
				const providerStream = adapter.stream({
					providerModelId: candidate.providerModelId,
					messages: request.messages,
					temperature: request.temperature,
					maxTokens: request.budget?.maxTokens,
					apiKey: await this._apiKeyFor(candidate),
					baseUrl: this._baseUrlFor(candidate),
					timeoutMs: this._timeoutMs(),
					requiresApiKey: profile?.requiresApiKey ?? true,
					profileId: candidate.profileId,
					stream: true,
				}, token);

				let finalUsage = undefined as IModelGatewayMeta['usage'];
				for await (const chunk of providerStream) {
					if (chunk.usage) {
						finalUsage = chunk.usage;
					}
					const latencyMs = Date.now() - started;
					const meta = this._meta(gatewayRequestId, request, route, candidate, fallbackDepth, latencyMs, finalUsage);
					yield { meta, chunk };
					if (chunk.type === 'done') {
						this._breaker.recordSuccess(key);
						this._telemetry.logModelCall({
							...meta,
							traceId: request.traceId,
							agentId: request.agentId,
							success: true,
							sensitivityDecision: request.sensitivity ?? 'unspecified',
							taskType: request.taskType,
						});
						return;
					}
					if (chunk.type === 'error') {
						throw new Error(chunk.errorMessage ?? 'Provider stream error');
					}
				}

				const latencyMs = Date.now() - started;
				const meta = this._meta(gatewayRequestId, request, route, candidate, fallbackDepth, latencyMs, finalUsage);
				this._breaker.recordSuccess(key);
				this._telemetry.logModelCall({
					...meta,
					traceId: request.traceId,
					agentId: request.agentId,
					success: true,
					sensitivityDecision: request.sensitivity ?? 'unspecified',
					taskType: request.taskType,
				});
				yield { meta, chunk: { type: 'done', usage: finalUsage } };
				return;
			} catch (err) {
				lastError = err instanceof Error ? err : new Error(String(err));
				this._breaker.recordFailure(key);
				fallbackDepth += 1;
			}
		}

		const latencyMs = Date.now() - started;
		const failedTarget = candidates[0] ?? route.target;
		const meta = this._meta(gatewayRequestId, request, route, failedTarget, fallbackDepth, latencyMs);
		this._telemetry.logModelCall({
			...meta,
			traceId: request.traceId,
			agentId: request.agentId,
			success: false,
			errorCode: lastError?.name ?? 'ProviderError',
			sensitivityDecision: request.sensitivity ?? 'unspecified',
			taskType: request.taskType,
		});
		yield {
			meta,
			chunk: { type: 'error', errorMessage: lastError?.message ?? 'Open-Agent Model Gateway: no healthy provider available.' },
		};
	}

	async embed(request: IModelGatewayRequest, token: CancellationToken): Promise<IModelGatewayEmbeddingResponse> {
		this._assertEnabled();
		const gatewayRequestId = generateUuid();
		const started = Date.now();
		const route = this._resolveRoute(request);
		const candidates = this._buildCandidates(request, route);

		let fallbackDepth = 0;
		let lastError: Error | undefined;

		const inputs = request.messages.map(message => message.content).filter(Boolean);
		if (!inputs.length) {
			throw new Error('Open-Agent embed requires at least one message content string.');
		}

		for (const candidate of candidates) {
			if (candidate.providerId !== PROVIDER_IDS.openaiCompatible) {
				continue;
			}
			const key = circuitKeyFor(candidate);
			if (!this._breaker.allow(key)) {
				continue;
			}
			try {
				const adapter = this._registry.get(candidate.providerId);
				if (!adapter.embed) {
					throw new Error(`Provider ${candidate.providerId} does not support embeddings.`);
				}
				const profile = this._profileFor(candidate);
				const result = await adapter.embed({
					providerModelId: this._configurationService.getValue<string>(OpenAgentConfigKeys.embedModel)
						|| candidate.providerModelId
						|| OPEN_AGENT_DEFAULT_EMBED_MODEL,
					input: inputs,
					apiKey: await this._apiKeyFor(candidate),
					baseUrl: this._baseUrlFor(candidate),
					timeoutMs: this._timeoutMs(),
					requiresApiKey: profile?.requiresApiKey ?? true,
					profileId: candidate.profileId,
				}, token);

				const latencyMs = Date.now() - started;
				const meta = this._meta(gatewayRequestId, request, route, candidate, fallbackDepth, latencyMs, result.usage);
				this._breaker.recordSuccess(key);
				this._telemetry.logModelCall({
					...meta,
					traceId: request.traceId,
					agentId: request.agentId,
					success: true,
					sensitivityDecision: request.sensitivity ?? 'unspecified',
					taskType: 'embed',
				});
				return { ...meta, result };
			} catch (err) {
				lastError = err instanceof Error ? err : new Error(String(err));
				this._breaker.recordFailure(key);
				fallbackDepth += 1;
			}
		}

		throw lastError ?? new Error('Open-Agent Model Gateway: no healthy embedding provider available.');
	}

	get secrets(): OpenAgentSecrets {
		return this._secrets;
	}

	get registry(): ProviderRegistry {
		return this._registry;
	}

	get circuitBreaker(): CircuitBreaker {
		return this._breaker;
	}

	private _assertEnabled(): void {
		const enabled = this._configurationService.getValue<boolean>(OpenAgentConfigKeys.enabled);
		if (!enabled) {
			throw new Error('Open-Agent Model Gateway is disabled. Set openagent.enabled to true.');
		}
	}

	private _resolveRoute(request: IModelGatewayRequest): IResolvedRoute {
		const mappingVersion = this._configurationService.getValue<string>(OpenAgentConfigKeys.routingMappingVersion)
			|| OPEN_AGENT_DEFAULT_MAPPING_VERSION;
		const table = withMappingVersion(DEFAULT_ROUTING_TABLE, mappingVersion);
		const resolved = resolveRoute(table, request.modelClass);

		if (request.pin?.providerId || request.pin?.providerModelId || request.pin?.profileId) {
			return {
				...resolved,
				mappingVersion: request.pin.mappingVersion ?? resolved.mappingVersion,
				target: {
					providerId: request.pin.providerId ?? resolved.target.providerId,
					providerModelId: request.pin.providerModelId ?? resolved.target.providerModelId,
					profileId: request.pin.profileId ?? resolved.target.profileId,
				},
			};
		}
		return resolved;
	}

	private _buildCandidates(request: IModelGatewayRequest, route: IResolvedRoute): IRoutingTarget[] {
		const ollamaModel = this._configurationService.getValue<string>(OpenAgentConfigKeys.ollamaDefaultModel)
			|| OPEN_AGENT_DEFAULT_OLLAMA_MODEL;
		const openAiModel = this._configurationService.getValue<string>(OpenAgentConfigKeys.openAiDefaultModel)
			|| OPEN_AGENT_DEFAULT_OPENAI_MODEL;
		const anthropicModel = this._configurationService.getValue<string>(OpenAgentConfigKeys.anthropicDefaultModel)
			|| OPEN_AGENT_DEFAULT_ANTHROPIC_MODEL;
		const embedModel = this._configurationService.getValue<string>(OpenAgentConfigKeys.embedModel)
			|| OPEN_AGENT_DEFAULT_EMBED_MODEL;
		const selectedRaw = this._configurationService.getValue<string>(OpenAgentConfigKeys.openAiProfileId)
			|| OPENAI_COMPATIBLE_PROFILE_IDS.openai;
		const selectedProfileId: OpenAiCompatibleProfileId = isOpenAiCompatibleProfileId(selectedRaw)
			? selectedRaw
			: OPENAI_COMPATIBLE_PROFILE_IDS.openai;
		const selectedLocal = isLocalOpenAiCompatibleProfileId(selectedProfileId);
		const selectedProfile = getOpenAiCompatibleProfile(selectedProfileId);

		const applyConfiguredModel = (target: IRoutingTarget, isPrimary: boolean): IRoutingTarget => {
			if (request.pin?.providerModelId && target.providerId === (request.pin.providerId ?? target.providerId)) {
				return target;
			}
			switch (target.providerId) {
				case PROVIDER_IDS.openaiCompatible: {
					let resolvedProfileId = (target.profileId ?? selectedProfileId) as OpenAiCompatibleProfileId;
					let overrode = false;
					if (shouldOverrideProfilePin(selectedProfileId, target.profileId)) {
						const retargetPrimary = isPrimary && (
							request.modelClass === MODEL_CLASSES.localPrivate
							|| request.modelClass === MODEL_CLASSES.privateOnprem
							|| request.modelClass === MODEL_CLASSES.embed
							|| request.modelClass === MODEL_CLASSES.codeSpecialist
							|| (target.profileId !== undefined && isLocalOpenAiCompatibleProfileId(target.profileId))
						);
						const retargetFallbackLocal = !isPrimary && selectedLocal
							&& target.profileId !== undefined
							&& isLocalOpenAiCompatibleProfileId(target.profileId);
						const retargetCloud = !selectedLocal && shouldOverrideProfilePin(selectedProfileId, target.profileId);
						if (retargetPrimary || retargetFallbackLocal || retargetCloud) {
							resolvedProfileId = selectedProfileId;
							overrode = true;
						}
					}
					const local = isLocalOpenAiCompatibleProfileId(resolvedProfileId);
					let providerModelId = target.providerModelId;
					if (overrode) {
						providerModelId = request.modelClass === MODEL_CLASSES.embed
							? (embedModel || selectedProfile.defaultModel)
							: (selectedProfile.defaultModel || (local ? ollamaModel : openAiModel));
					} else if (!providerModelId) {
						providerModelId = local ? ollamaModel : openAiModel;
					}
					return {
						...target,
						profileId: resolvedProfileId,
						providerModelId,
					};
				}
				case PROVIDER_IDS.anthropic:
					return { ...target, providerModelId: anthropicModel };
				default: {
					const _exhaustive: never = target.providerId;
					return _exhaustive;
				}
			}
		};

		let primary = applyConfiguredModel(route.target, true);
		let fallbacks = route.fallbacks.map(f => applyConfiguredModel(f, false));

		// When local profile is selected for code_specialist, keep original cloud pin as a privacy-allowed fallback.
		if (
			selectedLocal
			&& request.modelClass === MODEL_CLASSES.codeSpecialist
			&& route.target.profileId
			&& !isLocalOpenAiCompatibleProfileId(route.target.profileId)
			&& primary.profileId === selectedProfileId
		) {
			fallbacks = [
				{
					providerId: route.target.providerId,
					profileId: route.target.profileId,
					providerModelId: openAiModel,
				},
				...fallbacks,
			];
		}

		fallbacks = filterFallbacksForPrivacy(
			request.modelClass,
			fallbacks,
			DEFAULT_ROUTING_TABLE.constraints,
		);
		return [primary, ...fallbacks];
	}

	private _isProviderAllowed(providerId: ProviderId): boolean {
		return ALLOWED_PROVIDERS.includes(providerId);
	}

	private _profileFor(target: IRoutingTarget): IOpenAiCompatibleProfile | undefined {
		if (target.providerId !== PROVIDER_IDS.openaiCompatible || !target.profileId) {
			return undefined;
		}
		return getOpenAiCompatibleProfile(target.profileId);
	}

	private _baseUrlFor(target: IRoutingTarget): string {
		switch (target.providerId) {
			case PROVIDER_IDS.openaiCompatible: {
				const profile = this._profileFor(target);
				if (target.profileId === OPENAI_COMPATIBLE_PROFILE_IDS.ollama) {
					const configured = this._configurationService.getValue<string>(OpenAgentConfigKeys.ollamaBaseUrl)
						|| OPEN_AGENT_DEFAULT_OLLAMA_BASE_URL;
					return `${configured.replace(/\/+$/, '')}/v1`;
				}
				const configuredOpenAiBase = this._configurationService.getValue<string>(OpenAgentConfigKeys.openAiBaseUrl);
				// Prefer configured base URL for LM Studio / LM Link / llama.cpp / HF / Kaggle / cloud / custom.
				if (configuredOpenAiBase?.trim()
					&& (
						target.profileId === OPENAI_COMPATIBLE_PROFILE_IDS.openai
						|| target.profileId === OPENAI_COMPATIBLE_PROFILE_IDS.custom
						|| target.profileId === OPENAI_COMPATIBLE_PROFILE_IDS.lmlink
						|| target.profileId === OPENAI_COMPATIBLE_PROFILE_IDS.lmstudio
						|| target.profileId === OPENAI_COMPATIBLE_PROFILE_IDS.llamacpp
						|| target.profileId === OPENAI_COMPATIBLE_PROFILE_IDS.huggingfaceCompatible
						|| target.profileId === OPENAI_COMPATIBLE_PROFILE_IDS.kaggleCompatible
						|| target.profileId === OPENAI_COMPATIBLE_PROFILE_IDS.openrouter
						|| target.profileId === OPENAI_COMPATIBLE_PROFILE_IDS.deepseek
						|| target.profileId === OPENAI_COMPATIBLE_PROFILE_IDS.groq
						|| target.profileId === OPENAI_COMPATIBLE_PROFILE_IDS.together
						|| target.profileId === OPENAI_COMPATIBLE_PROFILE_IDS.fireworks
					)) {
					return configuredOpenAiBase.replace(/\/+$/, '');
				}
				return profile?.baseUrl || OPEN_AGENT_DEFAULT_OPENAI_BASE_URL;
			}
			case PROVIDER_IDS.anthropic:
				return this._configurationService.getValue<string>(OpenAgentConfigKeys.anthropicBaseUrl)
					|| OPEN_AGENT_DEFAULT_ANTHROPIC_BASE_URL;
			default: {
				const _exhaustive: never = target.providerId;
				return _exhaustive;
			}
		}
	}

	private async _apiKeyFor(target: IRoutingTarget): Promise<string | undefined> {
		switch (target.providerId) {
			case PROVIDER_IDS.openaiCompatible: {
				const profile = this._profileFor(target);
				if (profile && !profile.requiresApiKey) {
					return undefined;
				}
				return this._secrets.getOpenAiApiKey();
			}
			case PROVIDER_IDS.anthropic:
				return this._secrets.getAnthropicApiKey();
			default: {
				const _exhaustive: never = target.providerId;
				return _exhaustive;
			}
		}
	}

	private _timeoutMs(): number {
		return this._configurationService.getValue<number>(OpenAgentConfigKeys.requestTimeoutMs)
			|| OPEN_AGENT_DEFAULT_TIMEOUT_MS;
	}

	private _meta(
		gatewayRequestId: string,
		request: IModelGatewayRequest,
		route: IResolvedRoute,
		target: IRoutingTarget,
		fallbackDepth: number,
		latencyMs: number,
		usage?: IModelGatewayMeta['usage'],
	): IModelGatewayMeta {
		return {
			gatewayRequestId,
			providerModelId: target.providerModelId,
			providerId: target.providerId,
			profileId: target.profileId,
			modelClass: request.modelClass,
			routingTableId: route.routingTableId,
			matchedRuleId: route.matchedRuleId,
			fallbackDepth,
			mappingVersion: route.mappingVersion,
			latencyMs,
			usage,
		};
	}
}
