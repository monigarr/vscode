/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/test/browser/contextMentions.test.ts
 * PURPOSE: Unit tests for @ mention parsing.
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
 * - Unit coverage for @ mention parsing/resolution helpers.
 * =============================================================================
 */

import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('Open-Agent - mention parsing', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function parseMentions(text: string) {
		const mentions: Array<{ kind: string; raw: string; arg?: string }> = [];
		const re = /@(file|folder|git|codebase)(?:\(([^)]+)\))?/g;
		let match: RegExpExecArray | null;
		while ((match = re.exec(text)) !== null) {
			mentions.push({ kind: match[1], raw: match[0], arg: match[2] });
		}
		return mentions;
	}

	test('parses mixed @ mentions with args', () => {
		const mentions = parseMentions('See @file(src/a.ts) and @codebase(auth) @git');
		assert.deepStrictEqual(mentions.map(m => m.kind), ['file', 'codebase', 'git']);
		assert.strictEqual(mentions[0].arg, 'src/a.ts');
		assert.strictEqual(mentions[1].arg, 'auth');
	});
});
