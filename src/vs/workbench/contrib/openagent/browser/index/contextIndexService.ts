/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/index/contextIndexService.ts
 * PURPOSE: Workspace index engine — AST chunk, embed, incremental watchers, @ mention resolution.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   registerSingleton(IContextIndexService, ContextIndexService, InstantiationType.Delayed);
 *   await contextIndex.ensureIndexed(token);
 *
 * SECURITY:
 * - Reads workspace files for indexing; embeddings via gateway when enabled.
 *
 * RISK CLASS: R1
 *
 * AI NOTES:
 * - Uses document symbols for AST-aware chunks; SCM for @git; file watchers for incremental index.
 * - Chunking runs on IWebWorkerService-backed worker; embed + upsert stay on host.
 * =============================================================================
 */

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { RunOnceScheduler } from '../../../../../base/common/async.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { DocumentSymbol } from '../../../../../editor/common/languages.js';
import { IOutlineModelService } from '../../../../../editor/contrib/documentSymbols/browser/outlineModel.js';
import { ITextModelService } from '../../../../common/services/resolverService.js';
import { ISCMProvider, ISCMResource, ISCMService } from '../../../scm/common/scm.js';
import { boundedDiffSnippet } from '../../common/applyPatch.js';
import { parseOpenAgentMentions } from '../../common/mentions.js';
import { IContextIndexService, IOpenAgentMention, IResolvedContextBlock } from '../../common/contextIndex.js';
import { MODEL_CLASSES } from '../../common/modelClasses.js';
import { IModelGatewayService } from '../../common/modelGateway.js';
import { OpenAgentConfigKeys } from '../../common/openAgent.js';
import { IVectorStoreService } from '../../common/vectorStore.js';
import { IChunkSymbol } from './chunker.js';
import { OpenAgentIndexChunkClient } from './openAgentIndexChunkClient.js';

const INDEXABLE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.py', '.rs', '.go', '.java', '.cs', '.md', '.json', '.yml', '.yaml']);
const GIT_CONTEXT_MAX_CHARS = 6000;

export class ContextIndexService extends Disposable implements IContextIndexService {
	declare readonly _serviceBrand: undefined;

	private _indexing: Promise<void> | undefined;
	private readonly _pendingReindex = new Set<string>();
	private readonly _pendingDelete = new Set<string>();
	private readonly _reindexScheduler: RunOnceScheduler;
	private readonly _chunkClient: OpenAgentIndexChunkClient;

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IFileService private readonly _fileService: IFileService,
		@IWorkspaceContextService private readonly _workspaceService: IWorkspaceContextService,
		@IModelGatewayService private readonly _modelGateway: IModelGatewayService,
		@IVectorStoreService private readonly _vectorStore: IVectorStoreService,
		@ITextModelService private readonly _textModelService: ITextModelService,
		@IOutlineModelService private readonly _outlineModelService: IOutlineModelService,
		@ISCMService private readonly _scmService: ISCMService,
		@ILogService private readonly _logService: ILogService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();
		this._chunkClient = this._register(instantiationService.createInstance(OpenAgentIndexChunkClient));
		this._reindexScheduler = this._register(new RunOnceScheduler(() => void this._flushPending(), 400));
		this._register(this._fileService.onDidFilesChange(e => {
			if (!this._isIndexEnabled()) {
				return;
			}
			for (const uri of e.rawAdded) {
				this._queueReindex(uri);
			}
			for (const uri of e.rawUpdated) {
				this._queueReindex(uri);
			}
			for (const uri of e.rawDeleted) {
				this._pendingDelete.add(uri.toString());
				this._pendingReindex.delete(uri.toString());
			}
			if (this._pendingReindex.size || this._pendingDelete.size) {
				this._reindexScheduler.schedule();
			}
		}));
	}

	parseMentions(text: string): readonly IOpenAgentMention[] {
		return parseOpenAgentMentions(text);
	}

	async ensureIndexed(token: CancellationToken): Promise<void> {
		if (!this._isIndexEnabled()) {
			return;
		}
		if (!this._indexing) {
			this._indexing = this._indexWorkspace(token).finally(() => { this._indexing = undefined; });
		}
		await this._indexing;
	}

	async indexFile(uri: URI, token: CancellationToken): Promise<void> {
		if (!this._isIndexEnabled() || token.isCancellationRequested) {
			return;
		}
		const path = uri.path;
		const ext = path.slice(path.lastIndexOf('.')).toLowerCase();
		if (!INDEXABLE_EXTS.has(ext)) {
			return;
		}
		try {
			const ref = await this._textModelService.createModelReference(uri);
			try {
				const model = ref.object.textEditorModel;
				const symbols = await this._loadSymbols(model, token);
				const chunks = await this._chunkClient.chunkSource(
					uri.fsPath || uri.path,
					model.getValue(),
					model.getLanguageId(),
					symbols,
				);
				if (!chunks.length) {
					return;
				}
				await this._vectorStore.initialize();
				const embed = await this._modelGateway.embed({

					modelClass: MODEL_CLASSES.embed,
					taskType: 'embed',
					messages: chunks.map(chunk => ({ role: 'user', content: chunk.text })),
				}, token);
				const records = chunks.map((chunk, index) => ({
					id: chunk.id,
					vector: embed.result.embeddings[index] ?? [],
					text: chunk.text,
					metadata: {
						path: uri.toString(),
						language: model.getLanguageId(),
						startLine: chunk.startLine,
						endLine: chunk.endLine,
					},
				})).filter(record => record.vector.length > 0);
				await this._vectorStore.upsert(records);
			} finally {
				ref.dispose();
			}
		} catch (err) {
			this._logService.trace(`[openagent.index] skip ${uri.toString()}: ${err instanceof Error ? err.message : String(err)}`);
		}
	}

	async searchCodebase(query: string, limit: number, token: CancellationToken): Promise<readonly IResolvedContextBlock[]> {
		await this.ensureIndexed(token);
		const embed = await this._modelGateway.embed({
			modelClass: MODEL_CLASSES.embed,
			taskType: 'embed',
			messages: [{ role: 'user', content: query }],
		}, token);
		const vector = embed.result.embeddings[0] ?? [];
		if (!vector.length) {
			return [];
		}
		const hits = await this._vectorStore.search({ vector, limit });
		return hits.map(hit => ({
			mention: { kind: 'codebase', raw: '@codebase' },
			title: String(hit.metadata.path ?? hit.id),
			body: hit.text,
		}));
	}

	async resolveMentions(text: string, token: CancellationToken): Promise<readonly IResolvedContextBlock[]> {
		const mentions = this.parseMentions(text);
		const blocks: IResolvedContextBlock[] = [];
		for (const mention of mentions) {
			if (token.isCancellationRequested) {
				break;
			}
			switch (mention.kind) {
				case 'file': {
					const uri = this._resolveWorkspaceUri(mention.arg);
					if (!uri) {
						break;
					}
					try {
						const file = await this._fileService.readFile(uri);
						blocks.push({
							mention,
							title: uri.toString(),
							body: file.value.toString().slice(0, 8000),
						});
					} catch {
						// ignore missing
					}
					break;
				}
				case 'folder': {
					const uri = this._resolveWorkspaceUri(mention.arg);
					if (!uri) {
						break;
					}
					try {
						const stat = await this._fileService.resolve(uri);
						const names = (stat.children ?? []).slice(0, 80).map(child => child.name).join('\n');
						blocks.push({ mention, title: uri.toString(), body: names });
					} catch {
						// ignore
					}
					break;
				}
				case 'git': {
					blocks.push({
						mention,
						title: 'git',
						body: await this._buildGitContext(),
					});
					break;
				}
				case 'codebase': {
					const query = mention.arg || text.replace(/@(file|folder|git|codebase)(?:\([^)]+\))?/g, '').trim() || 'architecture overview';
					blocks.push(...await this.searchCodebase(query, 6, token));
					break;
				}
				default: {
					const _exhaustive: never = mention.kind;
					return _exhaustive;
				}
			}
		}
		return blocks;
	}

	private async _buildGitContext(): Promise<string> {
		const lines: string[] = [];
		let diffBudget = GIT_CONTEXT_MAX_CHARS;
		let filesWithDiff = 0;
		const maxDiffFiles = 8;

		for (const repo of this._scmService.repositories) {
			const provider = repo.provider;
			lines.push(`Repository: ${provider.label}${provider.rootUri ? ` (${provider.rootUri.fsPath || provider.rootUri.path})` : ''}`);
			for (const group of provider.groups) {
				const resources = group.resources.slice(0, 40);
				if (!resources.length) {
					continue;
				}
				lines.push(`${group.label}:`);
				for (const resource of resources) {
					const pathLabel = resource.sourceUri.fsPath || resource.sourceUri.path;
					lines.push(`  - ${pathLabel}`);
					if (filesWithDiff >= maxDiffFiles || diffBudget <= 0) {
						continue;
					}
					const snippet = await this._diffSnippetForResource(provider, resource);
					if (snippet) {
						const clipped = snippet.slice(0, Math.min(1200, diffBudget));
						lines.push(clipped);
						diffBudget -= clipped.length;
						filesWithDiff += 1;
					}
				}
			}
		}
		if (!lines.length) {
			return 'No SCM repositories reported changes. Open a git workspace or stage files in Source Control.';
		}
		return lines.join('\n').slice(0, GIT_CONTEXT_MAX_CHARS);
	}

	private async _diffSnippetForResource(
		provider: ISCMProvider,
		resource: ISCMResource,
	): Promise<string | undefined> {
		try {
			let original = '';
			const originalUri = resource.multiDiffEditorOriginalUri
				?? await provider.getOriginalResource(resource.sourceUri);
			if (originalUri) {
				try {
					original = (await this._fileService.readFile(originalUri)).value.toString();
				} catch {
					original = '';
				}
			}
			const modifiedUri = resource.multiDiffEditorModifiedUri ?? resource.sourceUri;
			let modified = '';
			try {
				modified = (await this._fileService.readFile(modifiedUri)).value.toString();
			} catch {
				return undefined;
			}
			const snippet = boundedDiffSnippet(original, modified, 30);
			return snippet || undefined;
		} catch {
			return undefined;
		}
	}

	private async _loadSymbols(model: Parameters<IOutlineModelService['getOrCreate']>[0], token: CancellationToken): Promise<IChunkSymbol[] | undefined> {
		try {
			const outline = await this._outlineModelService.getOrCreate(model, token);
			const symbols = outline.asListOfDocumentSymbols();
			if (!symbols.length) {
				return undefined;
			}
			return symbols.map(s => this._toChunkSymbol(s));
		} catch {
			return undefined;
		}
	}

	private _toChunkSymbol(symbol: DocumentSymbol): IChunkSymbol {
		return {
			name: symbol.name,
			startLine: symbol.range.startLineNumber,
			endLine: symbol.range.endLineNumber,
			children: symbol.children?.map(child => this._toChunkSymbol(child)),
		};
	}

	private _queueReindex(uri: URI): void {
		const path = uri.path;
		const ext = path.slice(path.lastIndexOf('.')).toLowerCase();
		if (!INDEXABLE_EXTS.has(ext)) {
			return;
		}
		this._pendingDelete.delete(uri.toString());
		this._pendingReindex.add(uri.toString());
	}

	private async _flushPending(): Promise<void> {
		if (!this._isIndexEnabled()) {
			this._pendingReindex.clear();
			this._pendingDelete.clear();
			return;
		}
		const toDelete = [...this._pendingDelete];
		const toIndex = [...this._pendingReindex];
		this._pendingDelete.clear();
		this._pendingReindex.clear();
		for (const id of toDelete) {
			try {
				// Best-effort: delete by searching metadata path match is not in API;
				// delete ids that start with path is unsupported — compact after upsert of replacements.
				await this._vectorStore.delete([id]);
			} catch {
				// ignore
			}
			await this._yieldToEventLoop();
		}
		for (const uriStr of toIndex) {
			try {
				await this.indexFile(URI.parse(uriStr), CancellationToken.None);
			} catch {
				// ignore
			}
			await this._yieldToEventLoop();
		}
	}

	/** Keep host responsive between embed/upsert batches (chunking itself is on the worker). */
	private _yieldToEventLoop(): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, 0));
	}

	private _isIndexEnabled(): boolean {
		return !!this._configurationService.getValue<boolean>(OpenAgentConfigKeys.enabled)
			&& this._configurationService.getValue<boolean>(OpenAgentConfigKeys.indexEnabled) !== false;
	}

	private async _indexWorkspace(token: CancellationToken): Promise<void> {
		await this._vectorStore.initialize();
		const folders = this._workspaceService.getWorkspace().folders;
		for (const folder of folders) {
			if (token.isCancellationRequested) {
				return;
			}
			await this._walk(folder.uri, token, 0);
		}
	}

	private async _walk(dir: URI, token: CancellationToken, depth: number): Promise<void> {
		if (depth > 8 || token.isCancellationRequested) {
			return;
		}
		let stat;
		try {
			stat = await this._fileService.resolve(dir);
		} catch {
			return;
		}
		for (const child of stat.children ?? []) {
			if (token.isCancellationRequested) {
				return;
			}
			const name = child.name;
			if (name === 'node_modules' || name === '.git' || name === 'out' || name === 'dist' || name.startsWith('.')) {
				continue;
			}
			if (child.isDirectory) {
				await this._walk(child.resource, token, depth + 1);
			} else {
				await this.indexFile(child.resource, token);
				await this._yieldToEventLoop();
			}
		}
	}

	private _resolveWorkspaceUri(arg: string | undefined): URI | undefined {
		if (!arg) {
			return undefined;
		}
		const folders = this._workspaceService.getWorkspace().folders;
		if (!folders.length) {
			return undefined;
		}
		if (arg.includes('://')) {
			return URI.parse(arg);
		}
		return URI.joinPath(folders[0].uri, arg.replace(/^[\\/]+/, ''));
	}
}
