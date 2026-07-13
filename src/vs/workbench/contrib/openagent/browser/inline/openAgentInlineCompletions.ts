/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/inline/openAgentInlineCompletions.ts
 * PURPOSE: Streaming ghost-text inline completions via Model Gateway with provider priority.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Registered via InlineCompletionsProvider; triggered on idle debounce or inlineSuggest.trigger.
 *
 * SECURITY:
 * - Sends local buffer context to gateway; no API keys in provider.
 *
 * RISK CLASS: R1
 *
 * AI NOTES:
 * - Streams via gateway.stream(); debounceDelayMs from config (default 100ms, PRD <150ms).
 * - groupId/excludesGroupIds prioritize Open-Agent without core patches.
 * =============================================================================
 */

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ILanguageFeaturesService } from '../../../../../editor/common/services/languageFeatures.js';
import { InlineCompletionsProvider, InlineCompletion, InlineCompletions, InlineCompletionContext, InlineCompletionsDisposeReason } from '../../../../../editor/common/languages.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { MODEL_CLASSES } from '../../common/modelClasses.js';
import { IModelGatewayService } from '../../common/modelGateway.js';
import { OPEN_AGENT_DEFAULT_INLINE_DEBOUNCE_MS, OpenAgentConfigKeys } from '../../common/openAgent.js';

export const OPEN_AGENT_INLINE_GROUP_ID = 'openagent';

interface IStreamingCompletions extends InlineCompletions {
	readonly items: readonly InlineCompletion[];
	readonly sessionId: string;
}

export class OpenAgentInlineCompletionsProvider extends Disposable implements InlineCompletionsProvider {
	readonly groupId = OPEN_AGENT_INLINE_GROUP_ID;
	/** Prefer Open-Agent over other AI ghost-text providers when enabled. */
	readonly excludesGroupIds = ['github.copilot', 'copilot', 'githubCopilot'];
	readonly displayName = 'Open-Agent';
	debounceDelayMs: number = OPEN_AGENT_DEFAULT_INLINE_DEBOUNCE_MS;

	private readonly _onDidChangeInlineCompletions = this._register(new Emitter<void>());
	readonly onDidChangeInlineCompletions: Event<void> = this._onDidChangeInlineCompletions.event;

	private _latest: IStreamingCompletions | undefined;
	private _streamGeneration = 0;

	constructor(
		@IModelGatewayService private readonly _modelGateway: IModelGatewayService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
	) {
		super();
		this._syncDebounceFromConfig();
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(OpenAgentConfigKeys.inlineDebounceMs)) {
				this._syncDebounceFromConfig();
			}
		}));
		this._register(languageFeaturesService.inlineCompletionsProvider.register({ pattern: '**' }, this));
	}

	async provideInlineCompletions(
		model: ITextModel,
		position: Position,
		_context: InlineCompletionContext,
		token: CancellationToken,
	): Promise<InlineCompletions | undefined> {
		if (!this._configurationService.getValue<boolean>(OpenAgentConfigKeys.enabled)
			|| this._configurationService.getValue<boolean>(OpenAgentConfigKeys.inlineEnabled) === false) {
			return undefined;
		}

		const generation = ++this._streamGeneration;
		const sessionId = `oa-inline-${generation}`;
		const prefix = model.getValueInRange(new Range(Math.max(1, position.lineNumber - 40), 1, position.lineNumber, position.column));
		const suffix = model.getValueInRange(new Range(position.lineNumber, position.column, Math.min(model.getLineCount(), position.lineNumber + 20), Number.MAX_SAFE_INTEGER));
		const language = model.getLanguageId();
		const range = new Range(position.lineNumber, position.column, position.lineNumber, position.column);

		let insertText = '';
		this._latest = { items: [], sessionId };

		try {
			for await (const event of this._modelGateway.stream({
				modelClass: MODEL_CLASSES.localPrivate,
				taskType: 'generate',
				temperature: 0.2,
				budget: { maxTokens: 128 },
				messages: [
					{
						role: 'system',
						content: 'You are a code completion engine. Return only the code to insert at the cursor. No markdown fences, no explanations.',
					},
					{
						role: 'user',
						content: `Language: ${language}\nPREFIX:\n${prefix}\nSUFFIX:\n${suffix}\nComplete the next tokens at the cursor.`,
					},
				],
			}, token)) {
				if (generation !== this._streamGeneration || token.isCancellationRequested) {
					return this._latest;
				}
				if (event.chunk.type === 'delta' && event.chunk.text) {
					insertText += event.chunk.text;
					const cleaned = insertText.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
					const item: InlineCompletion = { insertText: cleaned, range };
					this._latest = { items: cleaned ? [item] : [], sessionId };
					this._onDidChangeInlineCompletions.fire();
				}
				if (event.chunk.type === 'error') {
					return undefined;
				}
			}

			const cleaned = insertText.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trimEnd();
			if (!cleaned || token.isCancellationRequested || generation !== this._streamGeneration) {
				return undefined;
			}
			const item: InlineCompletion = { insertText: cleaned, range };
			this._latest = { items: [item], sessionId };
			return this._latest;
		} catch {
			return undefined;
		}
	}

	disposeInlineCompletions(_completions: InlineCompletions, _reason: InlineCompletionsDisposeReason): void {
		// stream generation bump cancels stale updates
	}

	private _syncDebounceFromConfig(): void {
		const configured = this._configurationService.getValue<number>(OpenAgentConfigKeys.inlineDebounceMs);
		this.debounceDelayMs = typeof configured === 'number' && configured >= 50
			? configured
			: OPEN_AGENT_DEFAULT_INLINE_DEBOUNCE_MS;
	}
}
