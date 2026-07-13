/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/composer/openAgentComposerViewPane.ts
 * PURPOSE: Dedicated Composer panel for multi-file edits with per-hunk Accept/Reject.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Instantiated by the views registry as OPEN_AGENT_COMPOSER_VIEW_ID.
 *
 * SECURITY:
 * - Writes only via IComposerService accept APIs after explicit user action.
 *
 * RISK CLASS: R2
 *
 * AI NOTES:
 * - Renders session hunks; Ctrl/Cmd+I also opens this view.
 * =============================================================================
 */

import './media/openAgentComposer.css';
import { $, append, clearNode } from '../../../../../base/browser/dom.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { ViewPane, IViewPaneOptions } from '../../../../browser/parts/views/viewPane.js';
import { IViewDescriptorService } from '../../../../common/views.js';
import { IComposerService } from '../../common/composer.js';
import { OpenAgentConfigKeys } from '../../common/openAgent.js';

export class OpenAgentComposerViewPane extends ViewPane {

	private readonly _sessionDisposables = this._register(new DisposableStore());
	private _list!: HTMLElement;
	private _status!: HTMLElement;
	private _input!: HTMLTextAreaElement;

	constructor(
		options: IViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@IComposerService private readonly _composer: IComposerService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);
		container.classList.add('openagent-composer');
		this._status = append(container, $('div.openagent-composer-status'));
		const form = append(container, $('div.openagent-composer-input-row'));
		this._input = append(form, $('textarea.openagent-composer-input')) as HTMLTextAreaElement;
		this._input.placeholder = localize('openAgent.composer.panelPlaceholder', "Describe multi-file changes…");
		this._input.rows = 3;
		const run = append(form, $('button.openagent-composer-run')) as HTMLButtonElement;
		run.textContent = localize('openAgent.composer.run', "Compose");
		run.onclick = () => void this._run();
		const actions = append(container, $('div.openagent-composer-actions'));
		const acceptAll = append(actions, $('button.openagent-composer-accept-all')) as HTMLButtonElement;
		acceptAll.textContent = localize('openAgent.composer.acceptAll', "Accept all");
		acceptAll.onclick = () => void this._acceptAll();
		this._list = append(container, $('div.openagent-composer-list'));
		this._sessionDisposables.add(this._composer.onDidChangeSession(() => this._renderSession()));
		this._renderSession();
	}

	async focusComposer(): Promise<void> {
		this._input?.focus();
	}

	private async _run(): Promise<void> {
		const prompt = this._input.value.trim();
		if (!prompt) {
			return;
		}
		if (!this.configurationService.getValue<boolean>(OpenAgentConfigKeys.enabled)) {
			this._status.textContent = localize('openAgent.composer.enableFirst', "Enable openagent.enabled first.");
			return;
		}
		this._status.textContent = localize('openAgent.composer.working', "Composing…");
		try {
			const session = await this._composer.createSession(prompt, CancellationToken.None);
			this._input.value = '';
			this._status.textContent = session.edits.length
				? localize('openAgent.composer.ready', "{0} file(s) proposed — review hunks below.", session.edits.length)
				: localize('openAgent.composer.noEdits', "Composer returned no file edits.");
			this._renderSession();
		} catch (err) {
			this._status.textContent = err instanceof Error ? err.message : String(err);
		}
	}

	private async _acceptAll(): Promise<void> {
		const session = this._composer.getActiveSession();
		if (!session) {
			return;
		}
		await this._composer.acceptAll(session.id);
		this._status.textContent = localize('openAgent.composer.acceptedAll', "Accepted all Composer edits.");
		this._renderSession();
	}

	private _renderSession(): void {
		clearNode(this._list);
		const session = this._composer.getActiveSession();
		if (!session) {
			append(this._list, $('p')).textContent = localize(
				'openAgent.composer.empty',
				"No active Composer session. Enter a prompt and click Compose.",
			);
			return;
		}
		for (const edit of session.edits) {
			const fileEl = append(this._list, $('div.openagent-composer-file'));
			const header = append(fileEl, $('div.openagent-composer-file-header'));
			header.textContent = edit.uri.path;
			const fileActions = append(fileEl, $('div.openagent-composer-file-actions'));
			const acceptFile = append(fileActions, $('button')) as HTMLButtonElement;
			acceptFile.textContent = localize('openAgent.composer.acceptFile', "Accept file");
			acceptFile.onclick = () => void this._composer.acceptEdit(session.id, edit.uri).then(() => this._renderSession());
			const rejectFile = append(fileActions, $('button')) as HTMLButtonElement;
			rejectFile.textContent = localize('openAgent.composer.rejectFile', "Reject file");
			rejectFile.onclick = () => void this._composer.rejectEdit(session.id, edit.uri).then(() => this._renderSession());

			for (const hunk of edit.hunks) {
				const hunkEl = append(fileEl, $('div.openagent-composer-hunk'));
				const meta = append(hunkEl, $('div.openagent-composer-hunk-meta'));
				const state = hunk.accepted === true ? 'accepted' : hunk.accepted === false ? 'rejected' : 'pending';
				meta.textContent = localize(
					'openAgent.composer.hunkMeta',
					"L{0}-{1} ({2})",
					hunk.startLineOriginal,
					hunk.endLineOriginal,
					state,
				);
				const preview = append(hunkEl, $('pre.openagent-composer-hunk-preview'));
				preview.textContent = hunk.proposedText.slice(0, 500) || hunk.originalText.slice(0, 500) || '(empty)';
				const hunkActions = append(hunkEl, $('div.openagent-composer-hunk-actions'));
				const acceptHunk = append(hunkActions, $('button')) as HTMLButtonElement;
				acceptHunk.textContent = localize('openAgent.composer.acceptHunk', "Accept hunk");
				acceptHunk.disabled = hunk.accepted === true;
				acceptHunk.onclick = () => void this._composer.acceptHunk(session.id, edit.uri, hunk.id).then(() => this._renderSession());
				const rejectHunk = append(hunkActions, $('button')) as HTMLButtonElement;
				rejectHunk.textContent = localize('openAgent.composer.rejectHunk', "Reject hunk");
				rejectHunk.disabled = hunk.accepted === false;
				rejectHunk.onclick = () => void this._composer.rejectHunk(session.id, edit.uri, hunk.id).then(() => this._renderSession());
			}
		}
	}
}
