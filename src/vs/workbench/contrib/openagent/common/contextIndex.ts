/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/common/contextIndex.ts
 * PURPOSE: Workspace indexing + @ mention context resolution contracts.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   import { IContextIndexService } from './contextIndex.js';
 *   const blocks = await contextIndex.resolveMentions(userText, token);
 *
 * SECURITY:
 * - Index holds workspace source excerpts; keep local; do not upload index blobs.
 *
 * RISK CLASS: R1
 *
 * AI NOTES:
 * - Mentions inject retrieved context into prompts; treat as untrusted for tool policy.
 * =============================================================================
 */

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export type OpenAgentMentionKind = 'file' | 'folder' | 'git' | 'codebase';

export interface IOpenAgentMention {
	readonly kind: OpenAgentMentionKind;
	readonly raw: string;
	readonly arg?: string;
}

export interface IResolvedContextBlock {
	readonly mention: IOpenAgentMention;
	readonly title: string;
	readonly body: string;
}

export const IContextIndexService = createDecorator<IContextIndexService>('openAgentContextIndexService');

export interface IContextIndexService {
	readonly _serviceBrand: undefined;

	ensureIndexed(token: CancellationToken): Promise<void>;
	indexFile(uri: URI, token: CancellationToken): Promise<void>;
	searchCodebase(query: string, limit: number, token: CancellationToken): Promise<readonly IResolvedContextBlock[]>;
	resolveMentions(text: string, token: CancellationToken): Promise<readonly IResolvedContextBlock[]>;
	parseMentions(text: string): readonly IOpenAgentMention[];
}
