/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/common/memoryVectorStore.ts
 * PURPOSE: In-memory IVectorStore for tests and LanceDB fallback.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   const store = new MemoryVectorStore();
 *   await store.initialize();
 *
 * DEPENDENCIES:
 * - vectorStore types
 *
 * SECURITY:
 * - Process-local only; no disk persistence.
 *
 * RISK CLASS: R1
 *
 * DATA HANDLING:
 * - Classification: Internal
 *
 * AI NOTES:
 * - Cosine similarity; suitable for small workspaces and unit tests.
 *
 * OBSERVABILITY:
 * - No remote telemetry.
 * =============================================================================
 */

import { IVectorHit, IVectorQuery, IVectorRecord, IVectorStore } from './vectorStore.js';

function cosine(a: readonly number[], b: readonly number[]): number {
	const n = Math.min(a.length, b.length);
	if (n === 0) {
		return 0;
	}
	let dot = 0;
	let na = 0;
	let nb = 0;
	for (let i = 0; i < n; i++) {
		dot += a[i] * b[i];
		na += a[i] * a[i];
		nb += b[i] * b[i];
	}
	const denom = Math.sqrt(na) * Math.sqrt(nb);
	return denom === 0 ? 0 : dot / denom;
}

function matchesFilter(metadata: Readonly<Record<string, string | number | boolean>>, filter?: Readonly<Record<string, string | number | boolean>>): boolean {
	if (!filter) {
		return true;
	}
	for (const [key, value] of Object.entries(filter)) {
		if (metadata[key] !== value) {
			return false;
		}
	}
	return true;
}

export class MemoryVectorStore implements IVectorStore {
	private readonly _records = new Map<string, IVectorRecord>();
	private _ready = false;

	async initialize(): Promise<void> {
		this._ready = true;
	}

	async upsert(records: readonly IVectorRecord[]): Promise<void> {
		this._assertReady();
		for (const record of records) {
			this._records.set(record.id, record);
		}
	}

	async search(query: IVectorQuery): Promise<readonly IVectorHit[]> {
		this._assertReady();
		const hits: IVectorHit[] = [];
		for (const record of this._records.values()) {
			if (!matchesFilter(record.metadata, query.filter)) {
				continue;
			}
			hits.push({
				id: record.id,
				score: cosine(query.vector, record.vector),
				text: record.text,
				metadata: record.metadata,
			});
		}
		hits.sort((a, b) => b.score - a.score);
		return hits.slice(0, Math.max(0, query.limit));
	}

	async delete(ids: readonly string[]): Promise<void> {
		this._assertReady();
		for (const id of ids) {
			this._records.delete(id);
		}
	}

	async compact(): Promise<void> {
		this._assertReady();
	}

	async shutdown(): Promise<void> {
		this._records.clear();
		this._ready = false;
	}

	exportRecords(): readonly IVectorRecord[] {
		return [...this._records.values()];
	}

	private _assertReady(): void {
		if (!this._ready) {
			throw new Error('MemoryVectorStore is not initialized.');
		}
	}
}
