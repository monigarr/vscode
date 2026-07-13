/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/common/openAgentVectorStoreRemote.ts
 * PURPOSE: IPC contract for Lance-backed vector store in the shared process.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   registerSharedProcessRemoteService(IOpenAgentVectorStoreRemote, 'openAgentVectorStore');
 *
 * SECURITY:
 * - Vectors stay on local disk; channel only reachable from workbench ↔ shared process.
 *
 * RISK CLASS: R2
 *
 * DATA HANDLING:
 * - Classification: Internal workspace derivatives
 *
 * AI NOTES:
 * - Browser must never import @lancedb/lancedb; use this remote port instead.
 * =============================================================================
 */

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IVectorHit, IVectorQuery, IVectorRecord } from './vectorStore.js';

export const OPEN_AGENT_VECTOR_STORE_CHANNEL = 'openAgentVectorStore';

export const IOpenAgentVectorStoreRemote = createDecorator<IOpenAgentVectorStoreRemote>('openAgentVectorStoreRemote');

export interface IOpenAgentVectorStoreRemote {
	readonly _serviceBrand: undefined;

	initialize(storageDir: string): Promise<string>;
	upsert(records: readonly IVectorRecord[]): Promise<void>;
	search(query: IVectorQuery): Promise<readonly IVectorHit[]>;
	delete(ids: readonly string[]): Promise<void>;
	compact(): Promise<void>;
	shutdown(): Promise<void>;
}
