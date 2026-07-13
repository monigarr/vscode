/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/api/providers/anthropicProvider.ts
 * PURPOSE: Anthropic Messages API protocol adapter for Open-Agent Model Gateway.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Registered by ModelGatewayService; API key from SecretStorage.
 *
 * DEPENDENCIES:
 * - IRequestService, asJson
 *
 * SECURITY:
 * - x-api-key header only; never logged.
 * - Missing API key fails closed before network call.
 *
 * RISK CLASS: R2
 *
 * DATA HANDLING:
 * - Classification: Workspace content may egress to Anthropic when user opts in.
 *
 * AI NOTES:
 * - Distinct protocol from OpenAI-compatible (system, content blocks, SSE event types).
 *
 * OBSERVABILITY:
 * - Health via lightweight models probe when available; failures report status only.
 * =============================================================================
 */

import { VSBuffer, VSBufferReadableStream } from '../../../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { listenStream } from '../../../../../../base/common/stream.js';
import { asJson, IRequestService } from '../../../../../../platform/request/common/request.js';
import { IOpenAgentChatMessage, IOpenAgentCompletionResult, IOpenAgentStreamChunk, IOpenAgentUsage } from '../../../common/messages.js';
import { IModelProviderAdapter, IProviderCompleteRequest, IProviderStreamRequest, PROVIDER_IDS, ProviderId } from '../../../common/providers.js';

interface IAnthropicMessageResponse {
	readonly content?: Array<{ readonly type?: string; readonly text?: string }>;
	readonly stop_reason?: string;
	readonly usage?: {
		readonly input_tokens?: number;
		readonly output_tokens?: number;
	};
}

interface IAnthropicSseEvent {
	readonly type?: string;
	readonly delta?: { readonly type?: string; readonly text?: string };
	readonly message?: IAnthropicMessageResponse;
	readonly usage?: IAnthropicMessageResponse['usage'];
}

function trimTrailingSlash(url: string): string {
	return url.replace(/\/+$/, '');
}

function anthropicHeaders(apiKey: string): Record<string, string> {
	return {
		'Content-Type': 'application/json',
		'x-api-key': apiKey,
		'anthropic-version': '2023-06-01',
	};
}

function splitSystem(messages: readonly IOpenAgentChatMessage[]): { system?: string; messages: Array<{ role: 'user' | 'assistant'; content: string }> } {
	const systemParts: string[] = [];
	const out: Array<{ role: 'user' | 'assistant'; content: string }> = [];
	for (const message of messages) {
		if (message.role === 'system') {
			systemParts.push(message.content);
			continue;
		}
		const role = message.role === 'assistant' ? 'assistant' : 'user';
		out.push({ role, content: message.content });
	}
	return {
		system: systemParts.length ? systemParts.join('\n\n') : undefined,
		messages: out,
	};
}

function usageFromAnthropic(usage: IAnthropicMessageResponse['usage']): IOpenAgentUsage | undefined {
	if (!usage) {
		return undefined;
	}
	const promptTokens = usage.input_tokens;
	const completionTokens = usage.output_tokens;
	const totalTokens = (promptTokens ?? 0) + (completionTokens ?? 0);
	return { promptTokens, completionTokens, totalTokens: totalTokens || undefined };
}

function textFromContent(content: IAnthropicMessageResponse['content']): string {
	if (!content?.length) {
		return '';
	}
	return content.filter(block => block.type === 'text' && block.text).map(block => block.text!).join('');
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
				if (!trimmed || trimmed.startsWith(':') || trimmed.startsWith('event:')) {
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

export class AnthropicProvider implements IModelProviderAdapter {
	readonly id: ProviderId = PROVIDER_IDS.anthropic;

	constructor(
		private readonly _requestService: IRequestService,
	) { }

	async healthCheck(baseUrl: string, token: CancellationToken, apiKey?: string): Promise<boolean> {
		if (!apiKey) {
			return false;
		}
		const url = `${trimTrailingSlash(baseUrl)}/v1/models`;
		try {
			const context = await this._requestService.request({
				type: 'GET',
				url,
				timeout: 5_000,
				headers: anthropicHeaders(apiKey),
				callSite: 'openagent.anthropic.healthCheck',
			}, token);
			return context.res.statusCode !== undefined && context.res.statusCode >= 200 && context.res.statusCode < 300;
		} catch {
			return false;
		}
	}

	async complete(request: IProviderCompleteRequest, token: CancellationToken): Promise<IOpenAgentCompletionResult> {
		if (!request.apiKey) {
			throw new Error('Anthropic provider requires an API key in SecretStorage (openagent.anthropic.apiKey).');
		}
		const url = `${trimTrailingSlash(request.baseUrl)}/v1/messages`;
		const split = splitSystem(request.messages);
		const payload = {
			model: request.providerModelId,
			max_tokens: request.maxTokens ?? 4096,
			temperature: request.temperature,
			system: split.system,
			messages: split.messages,
			stream: false,
		};
		const context = await this._requestService.request({
			type: 'POST',
			url,
			timeout: request.timeoutMs,
			data: JSON.stringify(payload),
			headers: anthropicHeaders(request.apiKey),
			callSite: 'openagent.anthropic.complete',
		}, token);
		const json = await asJson<IAnthropicMessageResponse>(context);
		if (!json) {
			throw new Error('Anthropic endpoint returned empty message response.');
		}
		return {
			text: textFromContent(json.content),
			finishReason: json.stop_reason,
			usage: usageFromAnthropic(json.usage),
		};
	}

	async *stream(request: IProviderStreamRequest, token: CancellationToken): AsyncIterable<IOpenAgentStreamChunk> {
		if (!request.apiKey) {
			throw new Error('Anthropic provider requires an API key in SecretStorage (openagent.anthropic.apiKey).');
		}
		const url = `${trimTrailingSlash(request.baseUrl)}/v1/messages`;
		const split = splitSystem(request.messages);
		const payload = {
			model: request.providerModelId,
			max_tokens: request.maxTokens ?? 4096,
			temperature: request.temperature,
			system: split.system,
			messages: split.messages,
			stream: true,
		};
		const context = await this._requestService.request({
			type: 'POST',
			url,
			timeout: request.timeoutMs,
			data: JSON.stringify(payload),
			headers: anthropicHeaders(request.apiKey),
			callSite: 'openagent.anthropic.stream',
		}, token);

		if (context.res.statusCode !== undefined && (context.res.statusCode < 200 || context.res.statusCode >= 300)) {
			throw new Error(`Anthropic stream failed with status ${context.res.statusCode}`);
		}

		let lastUsage: IOpenAgentUsage | undefined;
		for await (const data of iterateSseDataLines(context.stream, token)) {
			let parsed: IAnthropicSseEvent;
			try {
				parsed = JSON.parse(data) as IAnthropicSseEvent;
			} catch {
				continue;
			}
			if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
				yield { type: 'delta', text: parsed.delta.text };
			}
			if (parsed.type === 'message_delta' && parsed.usage) {
				lastUsage = usageFromAnthropic(parsed.usage);
			}
			if (parsed.type === 'message_stop') {
				yield { type: 'done', usage: lastUsage };
				return;
			}
		}
		yield { type: 'done', usage: lastUsage };
	}
}
