/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/vectorStoreService.ts
 * PURPOSE: Workbench IVectorStoreService — remote Lance (desktop) or durable JSON / memory fallback.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Injected as IVectorStoreService; index engine calls upsert/search only.
 *
 * DEPENDENCIES:
 * - IConfigurationService, IFileService, IEnvironmentService, ILogService, IInstantiationService
 * - Optional IOpenAgentVectorStoreRemote (desktop shared-process)
 *
 * SECURITY:
 * - Vectors stay on local disk under workspaceStorageHome; no remote upload.
 *
 * RISK CLASS: R2
 *
 * DATA HANDLING:
 * - Classification: Internal workspace derivatives
 *
 * AI NOTES:
 * - Prefer shared-process Lance when IOpenAgentVectorStoreRemote is registered; else JSON fallback.
 *
 * OBSERVABILITY:
 * - Logs backendId on initialize.
 * =============================================================================
 */

import { VSBuffer } from '../../../../base/common/buffer.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { MemoryVectorStore } from '../common/memoryVectorStore.js';
import { OpenAgentConfigKeys } from '../common/openAgent.js';
import { IOpenAgentVectorStoreRemote } from '../common/openAgentVectorStoreRemote.js';
import { IVectorHit, IVectorQuery, IVectorRecord, IVectorStoreService } from '../common/vectorStore.js';

interface IPersistedPayload {
	readonly version: 1;
	readonly records: IVectorRecord[];
}

export class VectorStoreService extends Disposable implements IVectorStoreService {
	declare readonly _serviceBrand: undefined;

	private readonly _memory = new MemoryVectorStore();
	private _initialized = false;
	private _backendId = 'memory';
	private _persistUri: URI | undefined;
	private _remote: IOpenAgentVectorStoreRemote | undefined;
	private _useRemote = false;

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IEnvironmentService private readonly _environmentService: IEnvironmentService,
		@IFileService private readonly _fileService: IFileService,
		@ILogService private readonly _logService: ILogService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();
	}

	get backendId(): string {
		return this._backendId;
	}

	async initialize(): Promise<void> {
		if (this._initialized) {
			return;
		}
		await this._memory.initialize();
		const backend = this._configurationService.getValue<string>(OpenAgentConfigKeys.vectorStoreBackend) || 'lance';
		if (backend === 'lance') {
			const storageDir = URI.joinPath(this._environmentService.workspaceStorageHome, 'openagent').fsPath
				|| URI.joinPath(this._environmentService.workspaceStorageHome, 'openagent').path;
			this._remote = this._tryGetRemote();
			if (this._remote) {
				try {
					this._backendId = await this._remote.initialize(storageDir);
					this._useRemote = true;
					this._logService.info(`[openagent.vector] initialized remote vector store (${this._backendId})`);
					this._initialized = true;
					return;
				} catch (err) {
					this._logService.info(`[openagent.vector] remote Lance unavailable (${err instanceof Error ? err.message : String(err)}); using durable JSON fallback`);
					this._remote = undefined;
					this._useRemote = false;
				}
			}
			this._persistUri = URI.joinPath(this._environmentService.workspaceStorageHome, 'openagent', 'vectors.json');
			this._backendId = 'lance-fallback-json';
			try {
				const content = await this._fileService.readFile(this._persistUri);
				const parsed = JSON.parse(content.value.toString()) as IPersistedPayload;
				if (parsed.version === 1 && Array.isArray(parsed.records)) {
					await this._memory.upsert(parsed.records);
				}
			} catch {
				// first run
			}
			this._logService.info('[openagent.vector] initialized durable vector store (JSON fallback)');
		} else {
			this._backendId = 'memory';
			this._logService.info('[openagent.vector] initialized memory vector store');
		}
		this._initialized = true;
	}

	async upsert(records: readonly IVectorRecord[]): Promise<void> {
		await this._ensureReady();
		if (this._useRemote && this._remote) {
			await this._remote.upsert(records);
			return;
		}
		await this._memory.upsert(records);
		await this._persist();
	}

	async search(query: IVectorQuery): Promise<readonly IVectorHit[]> {
		await this._ensureReady();
		if (this._useRemote && this._remote) {
			return this._remote.search(query);
		}
		return this._memory.search(query);
	}

	async delete(ids: readonly string[]): Promise<void> {
		await this._ensureReady();
		if (this._useRemote && this._remote) {
			await this._remote.delete(ids);
			return;
		}
		await this._memory.delete(ids);
		await this._persist();
	}

	async compact(): Promise<void> {
		await this._ensureReady();
		if (this._useRemote && this._remote) {
			await this._remote.compact();
			return;
		}
		await this._memory.compact();
	}

	async shutdown(): Promise<void> {
		if (this._useRemote && this._remote) {
			await this._remote.shutdown();
		} else {
			await this._persist();
			await this._memory.shutdown();
		}
		this._initialized = false;
		this._useRemote = false;
	}

	override dispose(): void {
		void this.shutdown();
		super.dispose();
	}

	private _tryGetRemote(): IOpenAgentVectorStoreRemote | undefined {
		try {
			return this._instantiationService.invokeFunction(accessor => {
				// Desktop registers IOpenAgentVectorStoreRemote; web does not.
				const services = accessor as unknown as { get: (id: unknown) => unknown };
				return services.get(IOpenAgentVectorStoreRemote) as IOpenAgentVectorStoreRemote;
			});
		} catch {
			return undefined;
		}
	}

	private async _ensureReady(): Promise<void> {
		if (!this._initialized) {
			await this.initialize();
		}
	}

	private async _persist(): Promise<void> {
		if (!this._persistUri) {
			return;
		}
		const payload: IPersistedPayload = { version: 1, records: [...this._memory.exportRecords()] };
		await this._fileService.writeFile(this._persistUri, VSBuffer.fromString(JSON.stringify(payload)));
	}
}
