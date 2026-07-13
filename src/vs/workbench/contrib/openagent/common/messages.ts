/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/common/messages.ts
 * PURPOSE: Normalized chat message and stream chunk types for the Model Gateway.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-12
 * UPDATED: 2026-07-12
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   import { IOpenAgentChatMessage, IOpenAgentStreamChunk } from './messages.js';
 *
 * DEPENDENCIES:
 * - None
 *
 * SECURITY:
 * - Message content may contain source code; never log raw message bodies by default.
 *
 * RISK CLASS: R2
 *
 * DATA HANDLING:
 * - Classification: Internal / user workspace content
 * - Redaction: Telemetry must redact prompts and completions unless explicitly opted in.
 *
 * AI NOTES:
 * - Provider adapters map these normalized types to vendor wire formats.
 *
 * OBSERVABILITY:
 * - Stream chunks are not logged; only token/latency aggregates at call end.
 * =============================================================================
 */

export type OpenAgentMessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface IOpenAgentChatMessage {
	readonly role: OpenAgentMessageRole;
	readonly content: string;
	readonly name?: string;
}

export interface IOpenAgentUsage {
	readonly promptTokens?: number;
	readonly completionTokens?: number;
	readonly totalTokens?: number;
}

export interface IOpenAgentStreamChunk {
	readonly type: 'delta' | 'done' | 'error';
	readonly text?: string;
	readonly usage?: IOpenAgentUsage;
	readonly errorMessage?: string;
}

export interface IOpenAgentCompletionResult {
	readonly text: string;
	readonly finishReason?: string;
	readonly usage?: IOpenAgentUsage;
}

export interface IOpenAgentEmbeddingResult {
	readonly embeddings: readonly (readonly number[])[];
	readonly usage?: IOpenAgentUsage;
}
