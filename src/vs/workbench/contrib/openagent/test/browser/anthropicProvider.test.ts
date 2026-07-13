/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/test/browser/anthropicProvider.test.ts
 * PURPOSE: Unit tests for Anthropic Messages API adapter request shaping.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Run with the workbench browser unit-test harness targeting this file.
 *
 * SECURITY:
 * - Asserts missing API key fails closed; x-api-key header set when present.
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
import { AnthropicProvider } from '../../browser/api/providers/anthropicProvider.js';

suite('Open-Agent - AnthropicProvider', () => {
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
		const provider = new AnthropicProvider(mockRequest(() => {
			throw new Error('should not call network');
		}));
		await assert.rejects(
			() => provider.complete({
				providerModelId: 'claude-sonnet-4-20250514',
				messages: [{ role: 'user', content: 'hi' }],
				baseUrl: 'https://api.anthropic.com',
				timeoutMs: 5000,
			}, CancellationToken.None),
			/api key/i,
		);
	});

	test('complete posts /v1/messages with x-api-key', async () => {
		let captured: IRequestOptions | undefined;
		const provider = new AnthropicProvider(mockRequest(options => {
			captured = options;
			return {
				res: { statusCode: 200, headers: {} },
				stream: bufferToStream(VSBuffer.fromString(JSON.stringify({
					content: [{ type: 'text', text: 'ok' }],
					stop_reason: 'end_turn',
					usage: { input_tokens: 2, output_tokens: 1 },
				}))),
			};
		}));

		const result = await provider.complete({
			providerModelId: 'claude-sonnet-4-20250514',
			messages: [
				{ role: 'system', content: 'be brief' },
				{ role: 'user', content: 'hi' },
			],
			baseUrl: 'https://api.anthropic.com/',
			timeoutMs: 5000,
			apiKey: 'sk-ant-test',
		}, CancellationToken.None);

		assert.strictEqual(captured?.url, 'https://api.anthropic.com/v1/messages');
		assert.strictEqual(captured?.headers?.['x-api-key'], 'sk-ant-test');
		const body = JSON.parse(captured?.data ?? '{}');
		assert.strictEqual(body.system, 'be brief');
		assert.strictEqual(body.messages[0].role, 'user');
		assert.strictEqual(result.text, 'ok');
		assert.strictEqual(result.usage?.totalTokens, 3);
	});
});
