/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/composer/composerService.ts
 * PURPOSE: Composer multi-file edit proposals with file- and hunk-level accept/reject.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   registerSingleton(IComposerService, ComposerService, InstantiationType.Delayed);
 *   const session = await composerService.createSession(prompt, token);
 *
 * SECURITY:
 * - Writes only after accept APIs; do not auto-apply model proposals.
 *
 * RISK CLASS: R2
 *
 * AI NOTES:
 * - Multi-file proposals via gateway; hunk-level HITL in Composer panel.
 * =============================================================================
 */

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IComposerFileEdit, IComposerHunk, IComposerService, IComposerSession } from '../../common/composer.js';
import { IContextIndexService } from '../../common/contextIndex.js';
import { MODEL_CLASSES } from '../../common/modelClasses.js';
import { IModelGatewayService } from '../../common/modelGateway.js';
import { OpenAgentConfigKeys } from '../../common/openAgent.js';

interface IMutableHunk extends IComposerHunk {
	accepted: boolean | undefined;
}

interface IMutableEdit {
	uri: URI;
	original: string;
	proposed: string;
	accepted: boolean;
	hunks: IMutableHunk[];
}

interface IMutableSession {
	id: string;
	prompt: string;
	edits: IMutableEdit[];
}

const FILE_BLOCK_RE = /```(?:[\w.+-]*)?(?:\s+)?(?:file|path)?(?:=|\s)?([^\n`]+\.[A-Za-z0-9]+)\n([\s\S]*?)```/g;

export class ComposerService extends Disposable implements IComposerService {
	declare readonly _serviceBrand: undefined;

	private readonly _sessions = new Map<string, IMutableSession>();
	private _activeSessionId: string | undefined;
	private readonly _onDidChangeSession = this._register(new Emitter<string>());
	readonly onDidChangeSession: Event<string> = this._onDidChangeSession.event;

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IModelGatewayService private readonly _modelGateway: IModelGatewayService,
		@IContextIndexService private readonly _contextIndex: IContextIndexService,
		@IFileService private readonly _fileService: IFileService,
		@IWorkspaceContextService private readonly _workspaceService: IWorkspaceContextService,
		@IEditorService private readonly _editorService: IEditorService,
	) {
		super();
	}

	async createSession(prompt: string, token: CancellationToken): Promise<IComposerSession> {
		if (!this._configurationService.getValue<boolean>(OpenAgentConfigKeys.enabled)
			|| this._configurationService.getValue<boolean>(OpenAgentConfigKeys.composerEnabled) === false) {
			throw new Error('Open-Agent Composer is disabled.');
		}

		const blocks = await this._contextIndex.resolveMentions(prompt, token);
		const context = blocks.map(b => `### ${b.title}\n${b.body}`).join('\n\n');
		const response = await this._modelGateway.complete({
			modelClass: MODEL_CLASSES.codeSpecialist,
			taskType: 'generate',
			messages: [
				{
					role: 'system',
					content: [
						'You are Open-Agent Composer. Propose multi-file edits.',
						'For each file, emit a fenced code block starting with: ```ts path/to/file.ts',
						'Put the FULL new file contents inside the fence. No partial patches.',
					].join('\n'),
				},
				{
					role: 'user',
					content: `${context ? context + '\n\n' : ''}Composer request:\n${prompt}`,
				},
			],
		}, token);

		const edits: IMutableEdit[] = [];
		FILE_BLOCK_RE.lastIndex = 0;
		let match: RegExpExecArray | null;
		while ((match = FILE_BLOCK_RE.exec(response.result.text)) !== null) {
			const rel = match[1].trim().replace(/^file=/, '').replace(/^path=/, '');
			const proposed = match[2];
			const uri = this._toUri(rel);
			if (!uri) {
				continue;
			}
			let original = '';
			try {
				original = (await this._fileService.readFile(uri)).value.toString();
			} catch {
				original = '';
			}
			edits.push({
				uri,
				original,
				proposed,
				accepted: false,
				hunks: computeHunks(original, proposed),
			});
		}

		const session: IMutableSession = { id: generateUuid(), prompt, edits };
		this._sessions.set(session.id, session);
		this._activeSessionId = session.id;

		for (const edit of edits) {
			await this._editorService.openEditor({
				original: { resource: undefined, contents: edit.original },
				modified: { resource: undefined, contents: edit.proposed },
				label: `Open-Agent: ${edit.uri.path}`,
				options: { pinned: true },
			});
		}

		this._onDidChangeSession.fire(session.id);
		return this._toPublic(session);
	}

	async acceptEdit(sessionId: string, uri: URI): Promise<void> {
		const session = this._sessions.get(sessionId);
		if (!session) {
			throw new Error('Unknown Composer session');
		}
		const edit = session.edits.find(e => e.uri.toString() === uri.toString());
		if (!edit) {
			return;
		}
		await this._fileService.writeFile(uri, VSBuffer.fromString(edit.proposed));
		edit.accepted = true;
		for (const hunk of edit.hunks) {
			hunk.accepted = true;
		}
		this._onDidChangeSession.fire(sessionId);
	}

	async rejectEdit(sessionId: string, uri: URI): Promise<void> {
		const session = this._sessions.get(sessionId);
		if (!session) {
			return;
		}
		session.edits = session.edits.filter(e => e.uri.toString() !== uri.toString());
		this._onDidChangeSession.fire(sessionId);
	}

	async acceptHunk(sessionId: string, uri: URI, hunkId: string): Promise<void> {
		const session = this._sessions.get(sessionId);
		const edit = session?.edits.find(e => e.uri.toString() === uri.toString());
		const hunk = edit?.hunks.find(h => h.id === hunkId);
		if (!session || !edit || !hunk) {
			return;
		}
		hunk.accepted = true;
		edit.proposed = rebuildProposedFromHunks(edit.original, edit.hunks);
		if (edit.hunks.every(h => h.accepted === true)) {
			await this._fileService.writeFile(uri, VSBuffer.fromString(edit.proposed));
			edit.accepted = true;
		}
		this._onDidChangeSession.fire(sessionId);
	}

	async rejectHunk(sessionId: string, uri: URI, hunkId: string): Promise<void> {
		const session = this._sessions.get(sessionId);
		const edit = session?.edits.find(e => e.uri.toString() === uri.toString());
		const hunk = edit?.hunks.find(h => h.id === hunkId);
		if (!session || !edit || !hunk) {
			return;
		}
		hunk.accepted = false;
		edit.proposed = rebuildProposedFromHunks(edit.original, edit.hunks);
		if (edit.hunks.every(h => h.accepted === false)) {
			session.edits = session.edits.filter(e => e.uri.toString() !== uri.toString());
		}
		this._onDidChangeSession.fire(sessionId);
	}

	async acceptAll(sessionId: string): Promise<void> {
		const session = this._sessions.get(sessionId);
		if (!session) {
			return;
		}
		for (const edit of [...session.edits]) {
			if (!edit.accepted) {
				await this.acceptEdit(sessionId, edit.uri);
			}
		}
	}

	getSession(sessionId: string): IComposerSession | undefined {
		const session = this._sessions.get(sessionId);
		return session ? this._toPublic(session) : undefined;
	}

	getActiveSession(): IComposerSession | undefined {
		return this._activeSessionId ? this.getSession(this._activeSessionId) : undefined;
	}

	private _toPublic(session: IMutableSession): IComposerSession {
		return {
			id: session.id,
			prompt: session.prompt,
			edits: session.edits.map(edit => ({
				uri: edit.uri,
				original: edit.original,
				proposed: edit.proposed,
				accepted: edit.accepted,
				hunks: edit.hunks.map(h => ({ ...h })),
			})),
		};
	}

	private _toUri(rel: string): URI | undefined {
		const folders = this._workspaceService.getWorkspace().folders;
		if (!folders.length) {
			return undefined;
		}
		if (rel.includes('://')) {
			return URI.parse(rel);
		}
		return URI.joinPath(folders[0].uri, rel.replace(/^[\\/]+/, ''));
	}
}

/** Export for unit tests — line-oriented hunk split. */
export function computeHunks(original: string, proposed: string): IMutableHunk[] {
	const origLines = original.split(/\r?\n/);
	const propLines = proposed.split(/\r?\n/);
	if (original === proposed) {
		return [];
	}
	if (!original) {
		return [{
			id: generateUuid(),
			startLineOriginal: 1,
			endLineOriginal: 1,
			originalText: '',
			proposedText: proposed,
			accepted: undefined,
		}];
	}
	// Simple whole-file hunk plus optional mid-file splits on large diffs.
	const hunks: IMutableHunk[] = [];
	const maxBlock = 40;
	let o = 0;
	let p = 0;
	while (o < origLines.length || p < propLines.length) {
		while (o < origLines.length && p < propLines.length && origLines[o] === propLines[p]) {
			o += 1;
			p += 1;
		}
		if (o >= origLines.length && p >= propLines.length) {
			break;
		}
		const oStart = o;
		const pStart = p;
		let oEnd = Math.min(origLines.length, oStart + maxBlock);
		let pEnd = Math.min(propLines.length, pStart + maxBlock);
		// Grow until next matching line or end.
		while (oEnd < origLines.length && pEnd < propLines.length && origLines[oEnd] !== propLines[pEnd]) {
			oEnd += 1;
			pEnd += 1;
			if (oEnd - oStart > maxBlock * 3) {
				break;
			}
		}
		hunks.push({
			id: generateUuid(),
			startLineOriginal: oStart + 1,
			endLineOriginal: Math.max(oStart + 1, oEnd),
			originalText: origLines.slice(oStart, oEnd).join('\n'),
			proposedText: propLines.slice(pStart, pEnd).join('\n'),
			accepted: undefined,
		});
		o = oEnd;
		p = pEnd;
	}
	return hunks.length ? hunks : [{
		id: generateUuid(),
		startLineOriginal: 1,
		endLineOriginal: Math.max(1, origLines.length),
		originalText: original,
		proposedText: proposed,
		accepted: undefined,
	}];
}

function rebuildProposedFromHunks(original: string, hunks: readonly IMutableHunk[]): string {
	// Apply accepted hunks in order; pending hunks keep proposed; rejected keep original.
	if (!hunks.length) {
		return original;
	}
	const parts: string[] = [];
	let cursor = 1;
	const origLines = original.split(/\r?\n/);
	for (const hunk of hunks) {
		if (hunk.startLineOriginal > cursor) {
			parts.push(origLines.slice(cursor - 1, hunk.startLineOriginal - 1).join('\n'));
		}
		if (hunk.accepted === false) {
			parts.push(hunk.originalText);
		} else {
			// accepted or pending — use proposed until rejected
			parts.push(hunk.proposedText);
		}
		cursor = hunk.endLineOriginal + 1;
	}
	if (cursor <= origLines.length) {
		parts.push(origLines.slice(cursor - 1).join('\n'));
	}
	return parts.filter((p, i) => p.length || i === 0).join('\n');
}
