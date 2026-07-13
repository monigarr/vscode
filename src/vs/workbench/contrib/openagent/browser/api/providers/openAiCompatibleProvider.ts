/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/api/providers/openAiCompatibleProvider.ts
 * PURPOSE: OpenAI-compatible protocol adapter (profiles for Ollama, OpenAI, etc.).
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-12
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Registered by ModelGatewayService; credentials supplied per-request from SecretStorage.
 *
 * DEPENDENCIES:
 * - IRequestService, asJson
 *
 * SECURITY:
 * - Bearer token only in Authorization header when required; never logged.
 * - Local profiles may omit API key.
 *
 * RISK CLASS: R2
 *
 * DATA HANDLING:
 * - Classification: Workspace content may egress to configured endpoint.
 *
 * AI NOTES:
 * - Implements /chat/completions and /embeddings (OpenAI-compatible).
 *
 * OBSERVABILITY:
 * - Health via GET /models; failures report status only.
 * =============================================================================
 */

import { VSBuffer, VSBufferReadableStream } from '../../../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { listenStream } from '../../../../../../base/common/stream.js';
import { asJson, IRequestService } from '../../../../../../platform/request/common/request.js';
import { IOpenAgentChatMessage, IOpenAgentCompletionResult, IOpenAgentEmbeddingResult, IOpenAgentStreamChunk, IOpenAgentUsage } from '../../../common/messages.js';
import { IModelProviderAdapter, IProviderCompleteRequest, IProviderEmbedRequest, IProviderStreamRequest, PROVIDER_IDS, ProviderId } from '../../../common/providers.js';

interface IOpenAiChatCompletionResponse {
	readonly choices?: Array<{
		readonly message?: { readonly content?: string };
		readonly finish_reason?: string;
		readonly delta?: { readonly content?: string };
	}>;
	readonly usage?: {
		readonly prompt_tokens?: number;
		readonly completion_tokens?: number;
		readonly total_tokens?: number;
	};
}

interface IOpenAiEmbeddingResponse {
	readonly data?: Array<{ readonly embedding?: number[]; readonly index?: number }>;
	readonly usage?: {
		readonly prompt_tokens?: number;
		readonly total_tokens?: number;
	};
}

function trimTrailingSlash(url: string): string {
	return url.replace(/\/+$/, '');
}

function toOpenAiMessages(messages: readonly IOpenAgentChatMessage[]): Array<{ role: string; content: string; name?: string }> {
	return messages.map(message => ({
		role: message.role,
		content: message.content,
		name: message.name,
	}));
}

function usageFromOpenAi(usage: IOpenAiChatCompletionResponse['usage']): IOpenAgentUsage | undefined {
	if (!usage) {
		return undefined;
	}
	return {
		promptTokens: usage.prompt_tokens,
		completionTokens: usage.completion_tokens,
		totalTokens: usage.total_tokens,
	};
}

function authHeaders(apiKey: string | undefined): Record<string, string> {
	const headers: Record<string, string> = { 'Content-Type': 'application/json' };
	if (apiKey) {
		headers['Authorization'] = `Bearer ${apiKey}`;
	}
	return headers;
}

function assertApiKeyIfRequired(request: { requiresApiKey?: boolean; apiKey?: string }): void {
	if (request.requiresApiKey !== false && !request.apiKey) {
		throw new Error('OpenAI-compatible provider requires an API key in SecretStorage (openagent.openai.apiKey).');
	}
}

async function* iterateSseDataLines(stream: VSBufferReadableStream, token: CancellationToken): AsyncIterable<string> {
	const queue: string[] = [];
	let pending = '';
	let done = false;
	let error: Error | undefined;
	let wake: (() => void) | undefined;

	const signal = () => {
		wake?.();
		wake = undefined;
	};

	listenStream(stream, {
		onData: (chunk: VSBuffer) => {
			pending += chunk.toString();
			let idx: number;
			while ((idx = pending.indexOf('\n')) >= 0) {
				const raw = pending.slice(0, idx).replace(/\r$/, '');
				pending = pending.slice(idx + 1);
				const trimmed = raw.trim();
				if (!trimmed || trimmed.startsWith(':')) {
					continue;
				}
				if (trimmed.startsWith('data:')) {
					queue.push(trimmed.slice(5).trim());
				}
			}
			signal();
		},
		onError: (err: Error) => {
			error = err;
			done = true;
			signal();
		},
		onEnd: () => {
			done = true;
			signal();
		},
	}, token);

	while (!done || queue.length > 0) {
		if (token.isCancellationRequested) {
			throw new Error('Cancelled');
		}
		if (queue.length === 0) {
			if (done) {
				break;
			}
			await new Promise<void>(resolve => { wake = resolve; });
			continue;
		}
		yield queue.shift()!;
	}

	if (error) {
		throw error;
	}
}

export class OpenAiCompatibleProvider implements IModelProviderAdapter {
	readonly id: ProviderId = PROVIDER_IDS.openaiCompatible;

	constructor(
		private readonly _requestService: IRequestService,
	) { }

	async healthCheck(baseUrl: string, token: CancellationToken, apiKey?: string): Promise<boolean> {
		const url = `${trimTrailingSlash(baseUrl)}/models`;
		try {
			const context = await this._requestService.request({
				type: 'GET',
				url,
				timeout: 5_000,
				headers: authHeaders(apiKey),
				callSite: 'openagent.openai.healthCheck',
			}, token);
			return context.res.statusCode !== undefined && context.res.statusCode >= 200 && context.res.statusCode < 300;
		} catch {
			return false;
		}
	}

	async complete(request: IProviderCompleteRequest, token: CancellationToken): Promise<IOpenAgentCompletionResult> {
		assertApiKeyIfRequired(request);
		const url = `${trimTrailingSlash(request.baseUrl)}/chat/completions`;
		const payload = {
			model: request.providerModelId,
			messages: toOpenAiMessages(request.messages),
			stream: false,
			temperature: request.temperature,
			max_tokens: request.maxTokens,
		};
		const context = await this._requestService.request({
			type: 'POST',
			url,
			timeout: request.timeoutMs,
			data: JSON.stringify(payload),
			headers: authHeaders(request.apiKey),
			callSite: 'openagent.openai.complete',
		}, token);
		const json = await asJson<IOpenAiChatCompletionResponse>(context);
		if (!json) {
			throw new Error('OpenAI-compatible endpoint returned empty chat completion.');
		}
		const choice = json.choices?.[0];
		return {
			text: choice?.message?.content ?? '',
			finishReason: choice?.finish_reason,
			usage: usageFromOpenAi(json.usage),
		};
	}

	async *stream(request: IProviderStreamRequest, token: CancellationToken): AsyncIterable<IOpenAgentStreamChunk> {
		assertApiKeyIfRequired(request);
		const url = `${trimTrailingSlash(request.baseUrl)}/chat/completions`;
		const payload = {
			model: request.providerModelId,
			messages: toOpenAiMessages(request.messages),
			stream: true,
			temperature: request.temperature,
			max_tokens: request.maxTokens,
		};
		const context = await this._requestService.request({
			type: 'POST',
			url,
			timeout: request.timeoutMs,
			data: JSON.stringify(payload),
			headers: authHeaders(request.apiKey),
			callSite: 'openagent.openai.stream',
		}, token);

		if (context.res.statusCode !== undefined && (context.res.statusCode < 200 || context.res.statusCode >= 300)) {
			throw new Error(`OpenAI-compatible stream failed with status ${context.res.statusCode}`);
		}

		let lastUsage: IOpenAgentUsage | undefined;
		for await (const data of iterateSseDataLines(context.stream, token)) {
			if (data === '[DONE]') {
				yield { type: 'done', usage: lastUsage };
				return;
			}
			let parsed: IOpenAiChatCompletionResponse;
			try {
				parsed = JSON.parse(data) as IOpenAiChatCompletionResponse;
			} catch {
				continue;
			}
			if (parsed.usage) {
				lastUsage = usageFromOpenAi(parsed.usage);
			}
			const delta = parsed.choices?.[0]?.delta?.content;
			if (delta) {
				yield { type: 'delta', text: delta };
			}
		}
		yield { type: 'done', usage: lastUsage };
	}

	async embed(request: IProviderEmbedRequest, token: CancellationToken): Promise<IOpenAgentEmbeddingResult> {
		assertApiKeyIfRequired(request);
		const url = `${trimTrailingSlash(request.baseUrl)}/embeddings`;
		const payload = {
			model: request.providerModelId,
			input: request.input.length === 1 ? request.input[0] : [...request.input],
		};
		const context = await this._requestService.request({
			type: 'POST',
			url,
			timeout: request.timeoutMs,
			data: JSON.stringify(payload),
			headers: authHeaders(request.apiKey),
			callSite: 'openagent.openai.embed',
		}, token);
		const json = await asJson<IOpenAiEmbeddingResponse>(context);
		if (!json?.data?.length) {
			throw new Error('OpenAI-compatible endpoint returned empty embeddings.');
		}
		const sorted = [...json.data].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
		return {
			embeddings: sorted.map(item => item.embedding ?? []),
			usage: json.usage ? {
				promptTokens: json.usage.prompt_tokens,
				totalTokens: json.usage.total_tokens,
			} : undefined,
		};
	}
}
