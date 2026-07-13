/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/test/browser/modelGatewayService.test.ts
 * PURPOSE: Unit tests for ModelGatewayService routing, enable-gate, and privacy fallbacks.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-12
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Run with the workbench browser unit-test harness targeting this file.
 *
 * SECURITY:
 * - Asserts API keys are not present in logged telemetry strings.
 *
 * RISK CLASS: R1
 * =============================================================================
 */

import * as assert from 'assert';
import { bufferToStream, VSBuffer } from '../../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Event } from '../../../../../base/common/event.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { IRequestService } from '../../../../../platform/request/common/request.js';
import { TestSecretStorageService } from '../../../../../platform/secrets/test/common/testSecretStorageService.js';
import { ModelGatewayService } from '../../browser/api/modelGatewayService.js';
import { OpenAgentSecrets } from '../../browser/api/openAgentSecrets.js';
import { MODEL_CLASSES } from '../../common/modelClasses.js';
import { OpenAgentConfigKeys, OPEN_AGENT_OPENAI_API_KEY_SECRET } from '../../common/openAgent.js';
import { OPENAI_COMPATIBLE_PROFILE_IDS } from '../../common/profiles.js';
import { PROVIDER_IDS } from '../../common/providers.js';
import { DEFAULT_ROUTING_TABLE, filterFallbacksForPrivacy, resolveRoute } from '../../common/routingConfig.js';

suite('Open-Agent - ModelGatewayService', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	function createGateway(config: Record<string, unknown>, requestImpl?: Partial<IRequestService>): { gateway: ModelGatewayService; logService: CapturingLogService; secrets: TestSecretStorageService } {
		const configurationService = new TestConfigurationService(config);
		const logService = new CapturingLogService();
		const secrets = store.add(new TestSecretStorageService());
		const requestService: IRequestService = {
			_serviceBrand: undefined,
			onDidCompleteRequest: Event.None,
			request: async () => { throw new Error('unexpected network call'); },
			resolveProxy: async () => undefined,
			lookupAuthorization: async () => undefined,
			lookupKerberosAuthorization: async () => undefined,
			loadCertificates: async () => [],
			...requestImpl,
		};
		const gateway = store.add(new ModelGatewayService(configurationService, logService, requestService, secrets));
		return { gateway, logService, secrets };
	}

	test('resolveRoute maps local_private to ollama profile on openai_compatible', () => {
		const resolved = resolveRoute(DEFAULT_ROUTING_TABLE, MODEL_CLASSES.localPrivate);
		assert.strictEqual(resolved.target.providerId, PROVIDER_IDS.openaiCompatible);
		assert.strictEqual(resolved.target.profileId, OPENAI_COMPATIBLE_PROFILE_IDS.ollama);
		assert.strictEqual(resolved.matchedRuleId, 'local_private_ollama');
	});

	test('filterFallbacksForPrivacy blocks cloud fallback for local_private', () => {
		const filtered = filterFallbacksForPrivacy(
			MODEL_CLASSES.localPrivate,
			[
				{ providerId: PROVIDER_IDS.openaiCompatible, profileId: OPENAI_COMPATIBLE_PROFILE_IDS.openai, providerModelId: 'gpt' },
				{ providerId: PROVIDER_IDS.openaiCompatible, profileId: OPENAI_COMPATIBLE_PROFILE_IDS.ollama, providerModelId: 'llama' },
			],
			DEFAULT_ROUTING_TABLE.constraints,
		);
		assert.deepStrictEqual(filtered.map(f => f.profileId), [OPENAI_COMPATIBLE_PROFILE_IDS.ollama]);
	});

	test('complete fails closed when openagent.enabled is false', async () => {
		const { gateway } = createGateway({ [OpenAgentConfigKeys.enabled]: false });
		await assert.rejects(
			() => gateway.complete({
				modelClass: MODEL_CLASSES.localPrivate,
				taskType: 'generate',
				messages: [{ role: 'user', content: 'hi' }],
			}, CancellationToken.None),
			/disabled/i,
		);
	});

	test('complete routes local_private to Ollama OpenAI-compatible /v1 and records gateway_request_id', async () => {
		const { gateway, logService } = createGateway(
			{ [OpenAgentConfigKeys.enabled]: true },
			{
				request: async (options) => {
					assert.ok(options.url?.includes('/v1/chat/completions'));
					assert.ok(!JSON.stringify(options).toLowerCase().includes('authorization'));
					return {
						res: { statusCode: 200, headers: {} },
						stream: bufferToStream(VSBuffer.fromString(JSON.stringify({
							choices: [{ message: { content: 'hello from ollama' }, finish_reason: 'stop' }],
							usage: { prompt_tokens: 3, completion_tokens: 5, total_tokens: 8 },
						}))),
					};
				},
			},
		);

		const response = await gateway.complete({
			modelClass: MODEL_CLASSES.localPrivate,
			taskType: 'generate',
			messages: [{ role: 'user', content: 'hi' }],
		}, CancellationToken.None);

		assert.strictEqual(response.result.text, 'hello from ollama');
		assert.strictEqual(response.providerId, PROVIDER_IDS.openaiCompatible);
		assert.strictEqual(response.profileId, OPENAI_COMPATIBLE_PROFILE_IDS.ollama);
		assert.ok(response.gatewayRequestId.length > 0);
		assert.ok(logService.infos.some(line => line.includes('gateway_request_id') && line.includes('model.call')));
		assert.ok(!logService.infos.some(line => line.includes('hello from ollama')));
	});

	test('complete for openai_compatible uses secret key and never logs it', async () => {
		const secretValue = 'sk-test-secret-do-not-log';
		const { gateway, logService, secrets } = createGateway(
			{ [OpenAgentConfigKeys.enabled]: true },
			{
				request: async (options) => {
					assert.ok(options.url?.includes('/chat/completions'));
					assert.strictEqual(options.headers?.['Authorization'], `Bearer ${secretValue}`);
					return {
						res: { statusCode: 200, headers: {} },
						stream: bufferToStream(VSBuffer.fromString(JSON.stringify({
							choices: [{ message: { content: 'cloud reply' }, finish_reason: 'stop' }],
							usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 },
						}))),
					};
				},
			},
		);
		await secrets.set(OPEN_AGENT_OPENAI_API_KEY_SECRET, secretValue);

		const response = await gateway.complete({
			modelClass: MODEL_CLASSES.codeSpecialist,
			taskType: 'generate',
			messages: [{ role: 'user', content: 'refactor' }],
		}, CancellationToken.None);

		assert.strictEqual(response.result.text, 'cloud reply');
		assert.strictEqual(response.providerId, PROVIDER_IDS.openaiCompatible);
		assert.ok(!logService.infos.some(line => line.includes(secretValue)));
	});

	test('OpenAgentSecrets set/get/delete roundtrip', async () => {
		const secrets = store.add(new TestSecretStorageService());
		const helper = new OpenAgentSecrets(secrets);
		await helper.setOpenAiApiKey('abc');
		assert.strictEqual(await helper.getOpenAiApiKey(), 'abc');
		await helper.deleteOpenAiApiKey();
		assert.strictEqual(await helper.getOpenAiApiKey(), undefined);
		await helper.setAnthropicApiKey('ant');
		assert.strictEqual(await helper.getAnthropicApiKey(), 'ant');
		await helper.deleteAnthropicApiKey();
		assert.strictEqual(await helper.getAnthropicApiKey(), undefined);
	});

	test('selecting LM Studio profile routes local_private and embed to LM Studio base URL', async () => {
		const seenUrls: string[] = [];
		const { gateway } = createGateway(
			{
				[OpenAgentConfigKeys.enabled]: true,
				[OpenAgentConfigKeys.openAiProfileId]: OPENAI_COMPATIBLE_PROFILE_IDS.lmstudio,
				[OpenAgentConfigKeys.openAiBaseUrl]: 'http://127.0.0.1:1234/v1',
			},
			{
				request: async (options) => {
					seenUrls.push(options.url ?? '');
					if (options.url?.includes('/embeddings')) {
						return {
							res: { statusCode: 200, headers: {} },
							stream: bufferToStream(VSBuffer.fromString(JSON.stringify({
								data: [{ embedding: [0.1, 0.2], index: 0 }],
								usage: { prompt_tokens: 1, total_tokens: 1 },
							}))),
						};
					}
					return {
						res: { statusCode: 200, headers: {} },
						stream: bufferToStream(VSBuffer.fromString(JSON.stringify({
							choices: [{ message: { content: 'from lmstudio' }, finish_reason: 'stop' }],
							usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
						}))),
					};
				},
			},
		);

		const chat = await gateway.complete({
			modelClass: MODEL_CLASSES.localPrivate,
			taskType: 'generate',
			messages: [{ role: 'user', content: 'hi' }],
		}, CancellationToken.None);
		assert.strictEqual(chat.profileId, OPENAI_COMPATIBLE_PROFILE_IDS.lmstudio);
		assert.ok(seenUrls.some(u => u.startsWith('http://127.0.0.1:1234/v1/chat/completions')));

		const embed = await gateway.embed({
			modelClass: MODEL_CLASSES.embed,
			taskType: 'embed',
			messages: [{ role: 'user', content: 'chunk' }],
		}, CancellationToken.None);
		assert.strictEqual(embed.profileId, OPENAI_COMPATIBLE_PROFILE_IDS.lmstudio);
		assert.ok(seenUrls.some(u => u.startsWith('http://127.0.0.1:1234/v1/embeddings')));
	});

	test('selecting LM Studio makes code_specialist primary local-first', async () => {
		const { gateway } = createGateway(
			{
				[OpenAgentConfigKeys.enabled]: true,
				[OpenAgentConfigKeys.openAiProfileId]: OPENAI_COMPATIBLE_PROFILE_IDS.lmstudio,
				[OpenAgentConfigKeys.openAiBaseUrl]: 'http://127.0.0.1:1234/v1',
			},
			{
				request: async (options) => {
					assert.ok(options.url?.startsWith('http://127.0.0.1:1234/v1/'));
					return {
						res: { statusCode: 200, headers: {} },
						stream: bufferToStream(VSBuffer.fromString(JSON.stringify({
							choices: [{ message: { content: 'compose' }, finish_reason: 'stop' }],
						}))),
					};
				},
			},
		);
		const response = await gateway.complete({
			modelClass: MODEL_CLASSES.codeSpecialist,
			taskType: 'generate',
			messages: [{ role: 'user', content: 'edit' }],
		}, CancellationToken.None);
		assert.strictEqual(response.profileId, OPENAI_COMPATIBLE_PROFILE_IDS.lmstudio);
	});
});

class CapturingLogService extends NullLogService {
	readonly infos: string[] = [];

	override info(message: string, ...args: unknown[]): void {
		this.infos.push([message, ...args].join(' '));
	}
}
