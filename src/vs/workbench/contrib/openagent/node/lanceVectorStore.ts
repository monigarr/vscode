/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/node/lanceVectorStore.ts
 * PURPOSE: LanceDB-backed IVectorStore with durable JSON fallback when native module is unavailable.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   const store = new LanceVectorStore(storagePath, logService);
 *   await store.initialize();
 *
 * DEPENDENCIES:
 * - Optional @lancedb/lancedb (dynamic import)
 * - node:fs/promises, node:path
 *
 * SECURITY:
 * - Persists only under the provided storage path; never uploads embeddings.
 *
 * RISK CLASS: R2
 *
 * DATA HANDLING:
 * - Classification: Internal workspace derivatives on local disk
 *
 * AI NOTES:
 * - Only this module may import LanceDB. All callers use IVectorStore.
 *
 * OBSERVABILITY:
 * - Logs backend mode (lance | lance-fallback-json) on initialize.
 * =============================================================================
 */

import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { ILogService } from '../../../platform/log/common/log.js';
import { MemoryVectorStore } from '../common/memoryVectorStore.js';
import { IVectorHit, IVectorQuery, IVectorRecord, IVectorStore } from '../common/vectorStore.js';

interface IPersistedPayload {
	readonly version: 1;
	readonly records: IVectorRecord[];
}

export class LanceVectorStore implements IVectorStore {
	private _inner: IVectorStore | undefined;
	private _mode: 'lance' | 'lance-fallback-json' = 'lance-fallback-json';
	private readonly _jsonPath: string;

	constructor(
		private readonly _storageDir: string,
		private readonly _logService: ILogService,
	) {
		this._jsonPath = join(_storageDir, 'openagent-vectors.json');
	}

	get mode(): string {
		return this._mode;
	}

	async initialize(): Promise<void> {
		await fs.mkdir(this._storageDir, { recursive: true });
		try {
			// Avoid static resolution of optional native dependency.
			const dynamicImport = new Function('specifier', 'return import(specifier)') as (specifier: string) => Promise<{
				connect: (uri: string) => Promise<{
					openTable: (name: string) => Promise<unknown>;
					createTable: (name: string, data: unknown[], opts?: { mode?: string }) => Promise<unknown>;
					tableNames: () => Promise<string[]>;
				}>;
			}>;
			const lancedb = await dynamicImport('@lancedb/lancedb');
			const db = await lancedb.connect(join(this._storageDir, 'lancedb'));
			this._inner = new NativeLanceAdapter(db, this._logService);
			await this._inner.initialize();
			this._mode = 'lance';
			this._logService.info('[openagent.vector] initialized LanceDB backend');
			return;
		} catch (err) {
			this._logService.info(`[openagent.vector] LanceDB unavailable (${err instanceof Error ? err.message : String(err)}); using durable JSON fallback`);
		}

		const memory = new MemoryVectorStore();
		await memory.initialize();
		try {
			const raw = await fs.readFile(this._jsonPath, 'utf8');
			const parsed = JSON.parse(raw) as IPersistedPayload;
			if (parsed.version === 1 && Array.isArray(parsed.records)) {
				await memory.upsert(parsed.records);
			}
		} catch {
			// first run or corrupt — start empty
		}
		this._inner = new PersistingMemoryAdapter(memory, this._jsonPath);
		this._mode = 'lance-fallback-json';
	}

	async upsert(records: readonly IVectorRecord[]): Promise<void> {
		await this._store().upsert(records);
	}

	async search(query: IVectorQuery): Promise<readonly IVectorHit[]> {
		return this._store().search(query);
	}

	async delete(ids: readonly string[]): Promise<void> {
		await this._store().delete(ids);
	}

	async compact(): Promise<void> {
		await this._store().compact();
	}

	async shutdown(): Promise<void> {
		if (this._inner) {
			await this._inner.shutdown();
			this._inner = undefined;
		}
	}

	private _store(): IVectorStore {
		if (!this._inner) {
			throw new Error('LanceVectorStore is not initialized.');
		}
		return this._inner;
	}
}

class PersistingMemoryAdapter implements IVectorStore {
	constructor(
		private readonly _memory: MemoryVectorStore,
		private readonly _jsonPath: string,
	) { }

	async initialize(): Promise<void> {
		await this._memory.initialize();
	}

	async upsert(records: readonly IVectorRecord[]): Promise<void> {
		await this._memory.upsert(records);
		await this._persist();
	}

	async search(query: IVectorQuery): Promise<readonly IVectorHit[]> {
		return this._memory.search(query);
	}

	async delete(ids: readonly string[]): Promise<void> {
		await this._memory.delete(ids);
		await this._persist();
	}

	async compact(): Promise<void> {
		await this._memory.compact();
	}

	async shutdown(): Promise<void> {
		await this._persist();
		await this._memory.shutdown();
	}

	private async _persist(): Promise<void> {
		const payload: IPersistedPayload = { version: 1, records: [...this._memory.exportRecords()] };
		await fs.writeFile(this._jsonPath, JSON.stringify(payload), 'utf8');
	}
}

class NativeLanceAdapter implements IVectorStore {
	private _table: {
		add: (rows: unknown[]) => Promise<void>;
		search: (vector: number[]) => { limit: (n: number) => { toArray: () => Promise<Array<Record<string, unknown>>> } };
		delete: (predicate: string) => Promise<void>;
	} | undefined;

	constructor(
		private readonly _db: {
			openTable: (name: string) => Promise<unknown>;
			createTable: (name: string, data: unknown[], opts?: { mode?: string }) => Promise<unknown>;
			tableNames: () => Promise<string[]>;
		},
		private readonly _logService: ILogService,
	) { }

	async initialize(): Promise<void> {
		const names = await this._db.tableNames();
		if (names.includes('chunks')) {
			this._table = await this._db.openTable('chunks') as typeof this._table;
		} else {
			this._table = await this._db.createTable('chunks', [{
				id: '__seed__',
				vector: [0],
				text: '',
				path: '',
				language: '',
			}], { mode: 'create' }) as typeof this._table;
			await this._table?.delete(`id = '__seed__'`);
		}
		this._logService.trace('[openagent.vector] Lance table ready');
	}

	async upsert(records: readonly IVectorRecord[]): Promise<void> {
		if (!this._table || !records.length) {
			return;
		}
		const ids = records.map(r => r.id);
		if (ids.length) {
			const quoted = ids.map(id => `'${id.replace(/'/g, "''")}'`).join(', ');
			await this._table.delete(`id IN (${quoted})`);
		}
		await this._table.add(records.map(record => ({
			id: record.id,
			vector: [...record.vector],
			text: record.text,
			path: String(record.metadata.path ?? ''),
			language: String(record.metadata.language ?? ''),
		})));
	}

	async search(query: IVectorQuery): Promise<readonly IVectorHit[]> {
		if (!this._table) {
			return [];
		}
		const rows = await this._table.search([...query.vector]).limit(query.limit).toArray();
		return rows
			.filter(row => {
				if (!query.filter) {
					return true;
				}
				for (const [key, value] of Object.entries(query.filter)) {
					if (row[key] !== value) {
						return false;
					}
				}
				return true;
			})
			.map(row => ({
				id: String(row.id ?? ''),
				score: typeof row._distance === 'number' ? 1 / (1 + row._distance) : Number(row.score ?? 0),
				text: String(row.text ?? ''),
				metadata: {
					path: String(row.path ?? ''),
					language: String(row.language ?? ''),
				},
			}));
	}

	async delete(ids: readonly string[]): Promise<void> {
		if (!this._table || !ids.length) {
			return;
		}
		const quoted = ids.map(id => `'${id.replace(/'/g, "''")}'`).join(', ');
		await this._table.delete(`id IN (${quoted})`);
	}

	async compact(): Promise<void> {
		// LanceDB handles compaction internally; no-op for adapter v1.
	}

	async shutdown(): Promise<void> {
		this._table = undefined;
	}
}
