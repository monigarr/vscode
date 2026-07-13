/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/test/browser/applyPatch.test.ts
 * PURPOSE: Unit tests for unified-diff apply_patch helper.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 * =============================================================================
 */

import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ApplyPatchError, applyUnifiedDiff, boundedDiffSnippet } from '../../common/applyPatch.js';

suite('Open-Agent - applyUnifiedDiff', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('applies a simple unified hunk', () => {
		const original = ['alpha', 'beta', 'gamma'].join('\n');
		const patch = [
			'--- a/file',
			'+++ b/file',
			'@@ -1,3 +1,3 @@',
			' alpha',
			'-beta',
			'+BETA',
			' gamma',
		].join('\n');
		assert.strictEqual(applyUnifiedDiff(original, patch), ['alpha', 'BETA', 'gamma'].join('\n'));
	});

	test('rejects malformed patch without hunks', () => {
		assert.throws(() => applyUnifiedDiff('a\nb', 'not a patch'), ApplyPatchError);
	});

	test('rejects context mismatch', () => {
		const patch = [
			'@@ -1,2 +1,2 @@',
			' nope',
			'-x',
			'+y',
		].join('\n');
		assert.throws(() => applyUnifiedDiff('a\nb', patch), /mismatch/i);
	});

	test('boundedDiffSnippet marks changed lines', () => {
		const snippet = boundedDiffSnippet('a\nb\n', 'a\nc\n', 10);
		assert.ok(snippet.includes('-b'));
		assert.ok(snippet.includes('+c'));
	});
});
