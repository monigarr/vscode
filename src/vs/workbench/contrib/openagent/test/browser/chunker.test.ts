/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/test/browser/chunker.test.ts
 * PURPOSE: Unit tests for source chunker.
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
 * - Unit coverage for chunkSource overlapping windows.
 * =============================================================================
 */

import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { chunkSource } from '../../browser/index/chunker.js';

suite('Open-Agent - chunker', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('chunks non-empty source into overlapping windows', () => {
		const content = Array.from({ length: 40 }, (_, i) => `line ${i + 1}`).join('\n');
		const chunks = chunkSource('src/foo.ts', content, 'typescript');
		assert.ok(chunks.length >= 2);
		assert.ok(chunks[0].text.includes('src/foo.ts'));
		assert.strictEqual(chunks[0].startLine, 1);
	});

	test('prefers document-symbol ranges when provided', () => {
		const content = [
			'function a() {',
			'  return 1;',
			'}',
			'',
			'function b() {',
			'  return 2;',
			'}',
		].join('\n');
		const chunks = chunkSource('src/foo.ts', content, 'typescript', [
			{ name: 'a', startLine: 1, endLine: 3 },
			{ name: 'b', startLine: 5, endLine: 7 },
		]);
		assert.strictEqual(chunks.length, 2);
		assert.ok(chunks[0].text.includes(' a L'));
		assert.ok(chunks[1].text.includes(' b L'));
		assert.strictEqual(chunks[0].startLine, 1);
		assert.strictEqual(chunks[1].endLine, 7);
	});
});
