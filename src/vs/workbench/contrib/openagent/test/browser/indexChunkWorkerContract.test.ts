/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/test/browser/indexChunkWorkerContract.test.ts
 * PURPOSE: Contract tests for index chunk worker request/response shape.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Run with the workbench browser unit-test harness targeting this file.
 *
 * RISK CLASS: R0
 *
 * TESTING:
 * - Ensures $chunkSource handler (in-process) matches host expectations.
 * =============================================================================
 */

import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { create } from '../../browser/index/openAgentIndexChunkWorker.js';

suite('Open-Agent - index chunk worker contract', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('$chunkSource returns overlapping heuristic chunks', () => {
		const worker = create() as ReturnType<typeof create> & {
			$chunkSource: (req: {
				path: string;
				content: string;
				languageId: string;
			}) => Array<{ id: string; startLine: number }>;
		};
		const content = Array.from({ length: 40 }, (_, i) => `line ${i + 1}`).join('\n');
		const chunks = worker.$chunkSource({
			path: 'src/foo.ts',
			content,
			languageId: 'typescript',
		});
		assert.ok(chunks.length >= 2);
		assert.strictEqual(chunks[0].startLine, 1);
		assert.ok(chunks[0].id.includes('src/foo.ts'));
	});

	test('$chunkSource honors symbol ranges', () => {
		const worker = create() as ReturnType<typeof create> & {
			$chunkSource: (req: {
				path: string;
				content: string;
				languageId: string;
				symbols?: Array<{ name: string; startLine: number; endLine: number }>;
			}) => Array<{ text: string; startLine: number; endLine: number }>;
		};
		const content = ['function a() {', '  return 1;', '}', '', 'function b() {', '  return 2;', '}'].join('\n');
		const chunks = worker.$chunkSource({
			path: 'src/foo.ts',
			content,
			languageId: 'typescript',
			symbols: [
				{ name: 'a', startLine: 1, endLine: 3 },
				{ name: 'b', startLine: 5, endLine: 7 },
			],
		});
		assert.strictEqual(chunks.length, 2);
		assert.ok(chunks[0].text.includes(' a L'));
		assert.strictEqual(chunks[1].endLine, 7);
	});
});
