/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/index/chunker.ts
 * PURPOSE: AST-aware (document-symbol) chunking with heuristic fallback for workspace indexing.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   import { chunkSource } from './chunker.js';
 *   const chunks = chunkSource(path, content, languageId, symbols);
 *
 * SECURITY:
 * - Pure transform of source text; no network.
 *
 * RISK CLASS: R0
 *
 * AI NOTES:
 * - Prefer document-symbol ranges (VS Code outline) when available; fall back to heuristic.
 * =============================================================================
 */

export interface ITextChunk {
	readonly id: string;
	readonly text: string;
	readonly startLine: number;
	readonly endLine: number;
}

/** Minimal symbol shape — compatible with DocumentSymbol line ranges (1-based inclusive). */
export interface IChunkSymbol {
	readonly name: string;
	readonly startLine: number;
	readonly endLine: number;
	readonly children?: readonly IChunkSymbol[];
}

const MAX_CHARS = 1200;
const OVERLAP_LINES = 2;

export function chunkSource(
	path: string,
	content: string,
	languageId: string,
	symbols?: readonly IChunkSymbol[],
): ITextChunk[] {
	const lines = content.split(/\r?\n/);
	if (symbols?.length) {
		const fromSymbols = chunkBySymbols(path, languageId, lines, symbols);
		if (fromSymbols.length) {
			return fromSymbols;
		}
	}
	return chunkHeuristic(path, languageId, lines);
}

function chunkBySymbols(
	path: string,
	languageId: string,
	lines: string[],
	symbols: readonly IChunkSymbol[],
): ITextChunk[] {
	const leaves = flattenSymbols(symbols);
	const chunks: ITextChunk[] = [];
	for (const symbol of leaves) {
		const start = Math.max(1, Math.min(symbol.startLine, lines.length));
		const end = Math.max(start, Math.min(symbol.endLine, lines.length));
		const slice = lines.slice(start - 1, end).join('\n');
		if (!slice.trim()) {
			continue;
		}
		if (slice.length <= MAX_CHARS) {
			chunks.push(makeChunk(path, languageId, lines, start, end, symbol.name));
			continue;
		}
		// Oversized symbol: heuristic within the symbol range.
		const local = lines.slice(start - 1, end);
		const localChunks = chunkHeuristic(`${path}#${symbol.name}`, languageId, local);
		for (const chunk of localChunks) {
			chunks.push({
				...chunk,
				id: `${path}:${start + chunk.startLine - 1}-${start + chunk.endLine - 1}`,
				startLine: start + chunk.startLine - 1,
				endLine: start + chunk.endLine - 1,
				text: `// ${path} (${languageId}) ${symbol.name} L${start + chunk.startLine - 1}-${start + chunk.endLine - 1}\n${local.slice(chunk.startLine - 1, chunk.endLine).join('\n')}`,
			});
		}
	}
	return chunks;
}

function flattenSymbols(symbols: readonly IChunkSymbol[]): IChunkSymbol[] {
	const out: IChunkSymbol[] = [];
	const visit = (list: readonly IChunkSymbol[]) => {
		for (const symbol of list) {
			if (symbol.children?.length) {
				visit(symbol.children);
			} else {
				out.push(symbol);
			}
		}
	};
	visit(symbols);
	return out;
}

function chunkHeuristic(path: string, languageId: string, lines: string[]): ITextChunk[] {
	const chunks: ITextChunk[] = [];
	let start = 0;
	while (start < lines.length) {
		let end = start;
		let size = 0;
		while (end < lines.length && size + lines[end].length + 1 <= MAX_CHARS) {
			size += lines[end].length + 1;
			end += 1;
			if (end - start > 8 && (lines[end - 1].trim() === '' || /^(}|]|\)|;)\s*$/.test(lines[end - 1]))) {
				break;
			}
		}
		if (end === start) {
			end = Math.min(lines.length, start + 1);
		}
		const slice = lines.slice(start, end).join('\n');
		if (slice.trim()) {
			chunks.push(makeChunk(path, languageId, lines, start + 1, end));
		}
		if (end >= lines.length) {
			break;
		}
		start = Math.max(start + 1, end - OVERLAP_LINES);
	}
	return chunks;
}

function makeChunk(
	path: string,
	languageId: string,
	lines: string[],
	startLine: number,
	endLine: number,
	symbolName?: string,
): ITextChunk {
	const slice = lines.slice(startLine - 1, endLine).join('\n');
	const label = symbolName ? ` ${symbolName}` : '';
	return {
		id: `${path}:${startLine}-${endLine}`,
		text: `// ${path} (${languageId})${label} L${startLine}-${endLine}\n${slice}`,
		startLine,
		endLine,
	};
}
