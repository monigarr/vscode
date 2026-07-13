/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/index/openAgentIndexChunkWorker.ts
 * PURPOSE: Web-worker request handler that runs AST/heuristic chunking off the UI thread.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   bootstrapWebWorker(create) from openAgentIndexChunkWorkerMain.ts
 *
 * SECURITY:
 * - Pure transform of source text; no network or filesystem access in worker.
 *
 * RISK CLASS: R0
 *
 * AI NOTES:
 * - Host still owns embed() + vector upsert; worker only chunks.
 * =============================================================================
 */

import { IWebWorkerServerRequestHandler } from '../../../../../base/common/worker/webWorker.js';
import { chunkSource, IChunkSymbol, ITextChunk } from './chunker.js';

export interface IOpenAgentIndexChunkRequest {
	readonly path: string;
	readonly content: string;
	readonly languageId: string;
	readonly symbols?: readonly IChunkSymbol[];
}

export interface IOpenAgentIndexChunkWorker {
	$chunkSource(request: IOpenAgentIndexChunkRequest): ITextChunk[];
}

export function create(): IWebWorkerServerRequestHandler {
	return new OpenAgentIndexChunkWorker();
}

class OpenAgentIndexChunkWorker implements IWebWorkerServerRequestHandler, IOpenAgentIndexChunkWorker {
	_requestHandlerBrand: void = undefined;

	$chunkSource(request: IOpenAgentIndexChunkRequest): ITextChunk[] {
		return chunkSource(request.path, request.content, request.languageId, request.symbols);
	}
}
