/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/test/browser/contextMentions.test.ts
 * PURPOSE: Unit tests for @ mention parsing (production parser).
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 * =============================================================================
 */

import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { parseOpenAgentMentions } from '../../common/mentions.js';

suite('Open-Agent - mention parsing', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('parses mixed @ mentions with args', () => {
		const mentions = parseOpenAgentMentions('See @file(src/a.ts) and @codebase(auth) @git');
		assert.deepStrictEqual(mentions.map(m => m.kind), ['file', 'codebase', 'git']);
		assert.strictEqual(mentions[0].arg, 'src/a.ts');
		assert.strictEqual(mentions[1].arg, 'auth');
	});
});
