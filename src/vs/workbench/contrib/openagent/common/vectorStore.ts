/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/common/vectorStore.ts
 * PURPOSE: IVectorStore port — sole storage contract for Open-Agent embeddings.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   constructor(@IVectorStoreService private readonly vectorStore: IVectorStoreService) {}
 *
 * DEPENDENCIES:
 * - platform/instantiation createDecorator
 *
 * SECURITY:
 * - Store holds workspace-derived embeddings; never leave the workstation.
 *
 * RISK CLASS: R2
 *
 * DATA HANDLING:
 * - Classification: Internal workspace derivatives
 *
 * AI NOTES:
 * - Feature code depends only on IVectorStore; never import LanceDB directly.
 *
 * OBSERVABILITY:
 * - Implementations should log backend id on initialize/shutdown.
 * =============================================================================
 */

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export interface IVectorRecord {
	readonly id: string;
	readonly vector: readonly number[];
	readonly text: string;
	readonly metadata: Readonly<Record<string, string | number | boolean>>;
}

export interface IVectorQuery {
	readonly vector: readonly number[];
	readonly limit: number;
	readonly filter?: Readonly<Record<string, string | number | boolean>>;
}

export interface IVectorHit {
	readonly id: string;
	readonly score: number;
	readonly text: string;
	readonly metadata: Readonly<Record<string, string | number | boolean>>;
}

export interface IVectorStore {
	initialize(): Promise<void>;
	upsert(records: readonly IVectorRecord[]): Promise<void>;
	search(query: IVectorQuery): Promise<readonly IVectorHit[]>;
	delete(ids: readonly string[]): Promise<void>;
	compact(): Promise<void>;
	shutdown(): Promise<void>;
}

export const IVectorStoreService = createDecorator<IVectorStoreService>('openAgentVectorStoreService');

export interface IVectorStoreService extends IVectorStore {
	readonly _serviceBrand: undefined;
	readonly backendId: string;
}
