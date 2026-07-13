/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/common/composer.ts
 * PURPOSE: Multi-file Composer edit proposal types with per-hunk accept/reject.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   import { IComposerService } from './composer.js';
 *   const session = await composer.createSession(prompt, token);
 *
 * SECURITY:
 * - Proposed edits must be accepted by the user before workspace writes.
 *
 * RISK CLASS: R2
 *
 * AI NOTES:
 * - Composer output is draft until accept/reject (file or hunk).
 * =============================================================================
 */

import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';

export interface IComposerHunk {
	readonly id: string;
	readonly startLineOriginal: number;
	readonly endLineOriginal: number;
	readonly originalText: string;
	readonly proposedText: string;
	readonly accepted: boolean | undefined;
}

export interface IComposerFileEdit {
	readonly uri: URI;
	readonly original: string;
	readonly proposed: string;
	readonly accepted: boolean;
	readonly hunks: readonly IComposerHunk[];
}

export interface IComposerSession {
	readonly id: string;
	readonly prompt: string;
	readonly edits: readonly IComposerFileEdit[];
}

export const IComposerService = createDecorator<IComposerService>('openAgentComposerService');

export interface IComposerService {
	readonly _serviceBrand: undefined;
	readonly onDidChangeSession: Event<string>;

	createSession(prompt: string, token: CancellationToken): Promise<IComposerSession>;
	acceptEdit(sessionId: string, uri: URI): Promise<void>;
	rejectEdit(sessionId: string, uri: URI): Promise<void>;
	acceptHunk(sessionId: string, uri: URI, hunkId: string): Promise<void>;
	rejectHunk(sessionId: string, uri: URI, hunkId: string): Promise<void>;
	acceptAll(sessionId: string): Promise<void>;
	getSession(sessionId: string): IComposerSession | undefined;
	getActiveSession(): IComposerSession | undefined;
}
