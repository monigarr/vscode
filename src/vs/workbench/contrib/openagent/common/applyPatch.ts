/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/common/applyPatch.ts
 * PURPOSE: Apply unified-diff patches to file contents (agent apply_patch tool).
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * SECURITY:
 * - Fail closed on malformed patches; never silently overwrite with raw patch text.
 * =============================================================================
 */

export class ApplyPatchError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ApplyPatchError';
	}
}

interface IHunk {
	readonly oldStart: number;
	readonly oldCount: number;
	readonly newStart: number;
	readonly newCount: number;
	readonly lines: readonly string[];
}

/**
 * Apply a unified diff (optionally with ---/+++ headers) to `original`.
 * Supports one or more @@ hunks. Throws ApplyPatchError on mismatch.
 */
export function applyUnifiedDiff(original: string, patch: string): string {
	const normalizedPatch = patch.replace(/\r\n/g, '\n').trim();
	if (!normalizedPatch) {
		throw new ApplyPatchError('Empty patch.');
	}

	// Whole-file replace convenience: if no @@ hunks, treat as full new content when marked.
	if (!normalizedPatch.includes('@@')) {
		throw new ApplyPatchError('Malformed patch: missing @@ hunk header. Use unified diff format.');
	}

	const hunks = parseHunks(normalizedPatch);
	if (!hunks.length) {
		throw new ApplyPatchError('Malformed patch: no hunks parsed.');
	}

	const origLines = original.replace(/\r\n/g, '\n').split('\n');
	// Preserve whether original ended with newline by tracking; split keeps trailing empty.
	const result: string[] = [];
	let cursor = 0; // 0-based index into origLines

	for (const hunk of hunks) {
		const oldStartIdx = Math.max(0, hunk.oldStart - 1);
		if (oldStartIdx < cursor) {
			throw new ApplyPatchError(`Hunk overlap or out-of-order at old line ${hunk.oldStart}.`);
		}
		result.push(...origLines.slice(cursor, oldStartIdx));
		cursor = oldStartIdx;

		for (const line of hunk.lines) {
			const tag = line[0];
			const body = line.slice(1);
			switch (tag) {
				case ' ': {
					const expected = origLines[cursor];
					if (expected === undefined || expected !== body) {
						throw new ApplyPatchError(`Context mismatch near line ${cursor + 1}.`);
					}
					result.push(body);
					cursor += 1;
					break;
				}
				case '-': {
					const expected = origLines[cursor];
					if (expected === undefined || expected !== body) {
						throw new ApplyPatchError(`Delete mismatch near line ${cursor + 1}.`);
					}
					cursor += 1;
					break;
				}
				case '+': {
					result.push(body);
					break;
				}
				case '\\': {
					// "\ No newline at end of file" — ignore
					break;
				}
				default:
					throw new ApplyPatchError(`Unknown hunk line prefix '${tag}'.`);
			}
		}
	}

	result.push(...origLines.slice(cursor));
	return result.join('\n');
}

function parseHunks(patch: string): IHunk[] {
	const lines = patch.split('\n');
	const hunks: IHunk[] = [];
	let i = 0;
	while (i < lines.length) {
		const header = lines[i];
		const m = /^@@\s+-(\d+)(?:,(\d+))?\s+\+(\d+)(?:,(\d+))?\s@@/.exec(header);
		if (!m) {
			i += 1;
			continue;
		}
		const oldStart = Number(m[1]);
		const oldCount = m[2] !== undefined ? Number(m[2]) : 1;
		const newStart = Number(m[3]);
		const newCount = m[4] !== undefined ? Number(m[4]) : 1;
		i += 1;
		const hunkLines: string[] = [];
		while (i < lines.length && !lines[i].startsWith('@@') && !lines[i].startsWith('diff ') && !lines[i].startsWith('---') && !lines[i].startsWith('+++')) {
			const line = lines[i];
			if (line.startsWith(' ') || line.startsWith('+') || line.startsWith('-') || line.startsWith('\\')) {
				hunkLines.push(line);
			} else if (line.length === 0) {
				// blank line inside hunk treated as context empty
				hunkLines.push(' ');
			} else {
				break;
			}
			i += 1;
		}
		hunks.push({ oldStart, oldCount, newStart, newCount, lines: hunkLines });
	}
	return hunks;
}

/**
 * Build a bounded textual diff snippet for @git context (not a full patch apply).
 */
export function boundedDiffSnippet(original: string, modified: string, maxLines = 40): string {
	if (original === modified) {
		return '';
	}
	const o = original.replace(/\r\n/g, '\n').split('\n');
	const m = modified.replace(/\r\n/g, '\n').split('\n');
	const lines: string[] = ['```diff'];
	let shown = 0;
	const limit = Math.max(o.length, m.length);
	for (let i = 0; i < limit && shown < maxLines; i++) {
		const ol = o[i];
		const ml = m[i];
		if (ol === ml) {
			if (ol !== undefined) {
				lines.push(` ${ol}`);
				shown += 1;
			}
			continue;
		}
		if (ol !== undefined) {
			lines.push(`-${ol}`);
			shown += 1;
		}
		if (ml !== undefined && shown < maxLines) {
			lines.push(`+${ml}`);
			shown += 1;
		}
	}
	if (shown >= maxLines) {
		lines.push('... (truncated)');
	}
	lines.push('```');
	return lines.join('\n');
}
