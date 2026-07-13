/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/test/browser/openAiCompatibleProvider.test.ts
 * PURPOSE: Unit tests for OpenAI-compatible BYOK adapter request shaping.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-12
 * UPDATED: 2026-07-12
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Run with the workbench browser unit-test harness targeting this file.
 *
 * SECURITY:
 * - Asserts missing API key fails closed; Authorization header set when present.
 *
 * RISK CLASS: R1
 * =============================================================================
 */

import * as assert from 'assert';
import { bufferToStream, VSBuffer } from '../../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Event } from '../../../../../base/common/event.js';
import { IRequestOptions } from '../../../../../base/parts/request/common/request.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IRequestService } from '../../../../../platform/request/common/request.js';
import { OpenAiCompatibleProvider } from '../../browser/api/providers/openAiCompatibleProvider.js';

suite('Open-Agent - OpenAiCompatibleProvider', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function mockRequest(handler: (options: IRequestOptions) => { res: { statusCode: number; headers: Record<string, string> }; stream: ReturnType<typeof bufferToStream> }): IRequestService {
		return {
			_serviceBrand: undefined,
			onDidCompleteRequest: Event.None,
			request: async (options) => handler(options),
			resolveProxy: async () => undefined,
			lookupAuthorization: async () => undefined,
			lookupKerberosAuthorization: async () => undefined,
			loadCertificates: async () => [],
		};
	}

	test('complete fails closed without API key', async () => {
		const provider = new OpenAiCompatibleProvider(mockRequest(() => {
			throw new Error('should not call network');
		}));
		await assert.rejects(
			() => provider.complete({
				providerModelId: 'gpt-4o-mini',
				messages: [{ role: 'user', content: 'hi' }],
				baseUrl: 'https://api.openai.com/v1',
				timeoutMs: 5000,
			}, CancellationToken.None),
			/api key/i,
		);
	});

	test('complete posts chat/completions with Bearer token', async () => {
		let captured: IRequestOptions | undefined;
		const provider = new OpenAiCompatibleProvider(mockRequest(options => {
			captured = options;
			return {
				res: { statusCode: 200, headers: {} },
				stream: bufferToStream(VSBuffer.fromString(JSON.stringify({
					choices: [{ message: { content: 'ok' }, finish_reason: 'stop' }],
					usage: { prompt_tokens: 4, completion_tokens: 1, total_tokens: 5 },
				}))),
			};
		}));

		const result = await provider.complete({
			providerModelId: 'gpt-4o-mini',
			messages: [{ role: 'user', content: 'hi' }],
			baseUrl: 'https://example.proxy/v1/',
			timeoutMs: 5000,
			apiKey: 'sk-test',
		}, CancellationToken.None);

		assert.strictEqual(captured?.url, 'https://example.proxy/v1/chat/completions');
		assert.strictEqual(captured?.headers?.['Authorization'], 'Bearer sk-test');
		const body = JSON.parse(captured?.data ?? '{}');
		assert.strictEqual(body.model, 'gpt-4o-mini');
		assert.strictEqual(body.stream, false);
		assert.strictEqual(result.text, 'ok');
		assert.strictEqual(result.usage?.totalTokens, 5);
	});

	test('stream parses SSE data lines until [DONE]', async () => {
		const provider = new OpenAiCompatibleProvider(mockRequest(() => ({
			res: { statusCode: 200, headers: {} },
			stream: bufferToStream(VSBuffer.fromString([
				'data: {"choices":[{"delta":{"content":"A"}}]}',
				'data: {"choices":[{"delta":{"content":"B"}}]}',
				'data: [DONE]',
			].join('\n'))),
		})));

		const parts: string[] = [];
		let done = false;
		for await (const chunk of provider.stream({
			providerModelId: 'gpt-4o-mini',
			messages: [{ role: 'user', content: 'hi' }],
			baseUrl: 'https://api.openai.com/v1',
			timeoutMs: 5000,
			apiKey: 'sk-test',
			stream: true,
		}, CancellationToken.None)) {
			if (chunk.type === 'delta' && chunk.text) {
				parts.push(chunk.text);
			}
			if (chunk.type === 'done') {
				done = true;
			}
		}
		assert.deepStrictEqual(parts, ['A', 'B']);
		assert.strictEqual(done, true);
	});

	test('complete allows missing API key when requiresApiKey is false', async () => {
		let captured: IRequestOptions | undefined;
		const provider = new OpenAiCompatibleProvider(mockRequest(options => {
			captured = options;
			return {
				res: { statusCode: 200, headers: {} },
				stream: bufferToStream(VSBuffer.fromString(JSON.stringify({
					choices: [{ message: { content: 'local' }, finish_reason: 'stop' }],
				}))),
			};
		}));

		const result = await provider.complete({
			providerModelId: 'llama3.2',
			messages: [{ role: 'user', content: 'hi' }],
			baseUrl: 'http://127.0.0.1:11434/v1',
			timeoutMs: 5000,
			requiresApiKey: false,
		}, CancellationToken.None);

		assert.strictEqual(result.text, 'local');
		assert.ok(!captured?.headers?.['Authorization']);
	});

	test('embed posts /embeddings', async () => {
		let captured: IRequestOptions | undefined;
		const provider = new OpenAiCompatibleProvider(mockRequest(options => {
			captured = options;
			return {
				res: { statusCode: 200, headers: {} },
				stream: bufferToStream(VSBuffer.fromString(JSON.stringify({
					data: [{ embedding: [0.1, 0.2], index: 0 }],
					usage: { prompt_tokens: 2, total_tokens: 2 },
				}))),
			};
		}));

		const result = await provider.embed({
			providerModelId: 'nomic-embed-text',
			input: ['hello'],
			baseUrl: 'http://127.0.0.1:11434/v1',
			timeoutMs: 5000,
			requiresApiKey: false,
		}, CancellationToken.None);

		assert.strictEqual(captured?.url, 'http://127.0.0.1:11434/v1/embeddings');
		assert.deepStrictEqual(result.embeddings[0], [0.1, 0.2]);
	});
});
