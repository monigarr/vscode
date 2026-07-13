/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/test/browser/composerHunks.test.ts
 * PURPOSE: Unit tests for Composer hunk computation.
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
 * - Unit coverage for computeHunks on multi-line diffs.
 * =============================================================================
 */

import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { computeHunks } from '../../browser/composer/composerService.js';

suite('Open-Agent - composer hunks', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('produces hunks when files differ', () => {
		const original = ['a', 'b', 'c', 'd'].join('\n');
		const proposed = ['a', 'B', 'c', 'D'].join('\n');
		const hunks = computeHunks(original, proposed);
		assert.ok(hunks.length >= 1);
		assert.ok(hunks.every(h => typeof h.id === 'string' && h.id.length > 0));
	});

	test('empty original yields single create hunk', () => {
		const hunks = computeHunks('', 'hello\nworld');
		assert.strictEqual(hunks.length, 1);
		assert.strictEqual(hunks[0].proposedText, 'hello\nworld');
	});
});
