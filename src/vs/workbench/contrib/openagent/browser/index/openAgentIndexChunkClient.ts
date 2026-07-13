/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/index/openAgentIndexChunkClient.ts
 * PURPOSE: Host-side client that runs chunkSource on a background web worker.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   const client = instantiationService.createInstance(OpenAgentIndexChunkClient);
 *   const chunks = await client.chunkSource(...);
 *
 * SECURITY:
 * - Sends workspace file text to an in-process worker only; no network.
 *
 * RISK CLASS: R1
 *
 * AI NOTES:
 * - Falls back to synchronous chunkSource if worker creation fails (tests / restricted envs).
 * =============================================================================
 */

import { FileAccess } from '../../../../../base/common/network.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IWebWorkerClient } from '../../../../../base/common/worker/webWorker.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IWebWorkerService } from '../../../../../platform/webWorker/browser/webWorkerService.js';
import { WebWorkerDescriptor } from '../../../../../platform/webWorker/browser/webWorkerDescriptor.js';
import { chunkSource, IChunkSymbol, ITextChunk } from './chunker.js';
import { IOpenAgentIndexChunkWorker } from './openAgentIndexChunkWorker.js';

export class OpenAgentIndexChunkClient extends Disposable {
	private _client: IWebWorkerClient<IOpenAgentIndexChunkWorker> | undefined;
	private _failed = false;

	constructor(
		@IWebWorkerService private readonly _webWorkerService: IWebWorkerService,
		@ILogService private readonly _logService: ILogService,
	) {
		super();
	}

	async chunkSource(
		path: string,
		content: string,
		languageId: string,
		symbols?: readonly IChunkSymbol[],
	): Promise<ITextChunk[]> {
		const worker = this._ensureWorker();
		if (!worker) {
			return chunkSource(path, content, languageId, symbols);
		}
		try {
			return await worker.proxy.$chunkSource({ path, content, languageId, symbols });
		} catch (err) {
			this._logService.trace(`[openagent.index] worker chunk failed; sync fallback: ${err instanceof Error ? err.message : String(err)}`);
			return chunkSource(path, content, languageId, symbols);
		}
	}

	private _ensureWorker(): IWebWorkerClient<IOpenAgentIndexChunkWorker> | undefined {
		if (this._failed) {
			return undefined;
		}
		if (this._client) {
			return this._client;
		}
		try {
			this._client = this._register(this._webWorkerService.createWorkerClient<IOpenAgentIndexChunkWorker>(
				new WebWorkerDescriptor({
					esmModuleLocation: FileAccess.asBrowserUri('vs/workbench/contrib/openagent/browser/index/openAgentIndexChunkWorkerMain.js'),
					label: 'OpenAgentIndexChunkWorker',
				}),
			));
			return this._client;
		} catch (err) {
			this._failed = true;
			this._logService.info(`[openagent.index] web worker unavailable (${err instanceof Error ? err.message : String(err)}); using sync chunker`);
			return undefined;
		}
	}
}
