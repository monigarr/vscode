/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/test/browser/memoryVectorStore.test.ts
 * PURPOSE: Unit tests for MemoryVectorStore cosine search + filters.
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
 * - Unit coverage for in-memory vector store operations.
 * =============================================================================
 */

import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { MemoryVectorStore } from '../../common/memoryVectorStore.js';

suite('Open-Agent - MemoryVectorStore', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('upsert and cosine search return nearest neighbor', async () => {
		const store = new MemoryVectorStore();
		await store.initialize();
		await store.upsert([
			{ id: 'a', vector: [1, 0], text: 'alpha', metadata: { path: 'a.ts', language: 'typescript' } },
			{ id: 'b', vector: [0, 1], text: 'beta', metadata: { path: 'b.ts', language: 'typescript' } },
		]);
		const hits = await store.search({ vector: [0.9, 0.1], limit: 1 });
		assert.strictEqual(hits[0].id, 'a');
		assert.ok(hits[0].score > 0.5);
	});

	test('metadata filter excludes non-matching rows', async () => {
		const store = new MemoryVectorStore();
		await store.initialize();
		await store.upsert([
			{ id: 'a', vector: [1, 0], text: 'alpha', metadata: { language: 'typescript' } },
			{ id: 'b', vector: [1, 0], text: 'beta', metadata: { language: 'python' } },
		]);
		const hits = await store.search({ vector: [1, 0], limit: 5, filter: { language: 'python' } });
		assert.strictEqual(hits.length, 1);
		assert.strictEqual(hits[0].id, 'b');
	});
});
