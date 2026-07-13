/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/node/openAgentVectorStoreRemoteService.ts
 * PURPOSE: Shared-process Lance vector store service proxied to the workbench.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Registered in sharedProcessMain; browser talks via IOpenAgentVectorStoreRemote.
 *
 * DEPENDENCIES:
 * - LanceVectorStore, ILogService
 *
 * SECURITY:
 * - Persists only under caller-provided storageDir; no network upload.
 *
 * RISK CLASS: R2
 *
 * DATA HANDLING:
 * - Classification: Internal workspace derivatives on local disk
 *
 * AI NOTES:
 * - Sole shared-process owner of LanceVectorStore for Open-Agent.
 * =============================================================================
 */

import { ILogService } from '../../../platform/log/common/log.js';
import { IOpenAgentVectorStoreRemote } from '../common/openAgentVectorStoreRemote.js';
import { IVectorHit, IVectorQuery, IVectorRecord } from '../common/vectorStore.js';
import { LanceVectorStore } from './lanceVectorStore.js';

export class OpenAgentVectorStoreRemoteService implements IOpenAgentVectorStoreRemote {
	declare readonly _serviceBrand: undefined;

	private _store: LanceVectorStore | undefined;
	private _storageDir: string | undefined;

	constructor(
		@ILogService private readonly _logService: ILogService,
	) { }

	async initialize(storageDir: string): Promise<string> {
		if (this._store && this._storageDir === storageDir) {
			return this._store.mode;
		}
		if (this._store) {
			await this._store.shutdown();
			this._store = undefined;
		}
		this._storageDir = storageDir;
		this._store = new LanceVectorStore(storageDir, this._logService);
		await this._store.initialize();
		this._logService.info(`[openagent.vector.remote] initialized (${this._store.mode}) at ${storageDir}`);
		return this._store.mode;
	}

	async upsert(records: readonly IVectorRecord[]): Promise<void> {
		await this._requireStore().upsert(records);
	}

	async search(query: IVectorQuery): Promise<readonly IVectorHit[]> {
		return this._requireStore().search(query);
	}

	async delete(ids: readonly string[]): Promise<void> {
		await this._requireStore().delete(ids);
	}

	async compact(): Promise<void> {
		await this._requireStore().compact();
	}

	async shutdown(): Promise<void> {
		if (this._store) {
			await this._store.shutdown();
			this._store = undefined;
			this._storageDir = undefined;
		}
	}

	private _requireStore(): LanceVectorStore {
		if (!this._store) {
			throw new Error('OpenAgentVectorStoreRemoteService is not initialized.');
		}
		return this._store;
	}
}
