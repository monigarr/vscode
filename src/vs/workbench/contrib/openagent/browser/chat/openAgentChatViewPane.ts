/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/chat/openAgentChatViewPane.ts
 * PURPOSE: Open-Agent chat sidebar ViewPane with streaming, @ mentions, and agent mode.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Instantiated by the views registry as OPEN_AGENT_CHAT_VIEW_ID when chat is enabled.
 *
 * SECURITY:
 * - Streams model output to UI; agent write/shell tools go through HITL.
 * - Never log prompts or API keys.
 *
 * RISK CLASS: R2
 *
 * AI NOTES:
 * - Prefix with /agent to run IAgentLoopService from chat; otherwise gateway.stream.
 * =============================================================================
 */

import './media/openAgentChat.css';
import { $, append, clearNode } from '../../../../../base/browser/dom.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
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
import { IAgentLoopService } from '../../common/agentLoop.js';
import { IContextIndexService } from '../../common/contextIndex.js';
import { MODEL_CLASSES } from '../../common/modelClasses.js';
import { IModelGatewayService } from '../../common/modelGateway.js';
import { IOpenAgentChatMessage } from '../../common/messages.js';
import { OpenAgentConfigKeys } from '../../common/openAgent.js';

export class OpenAgentChatViewPane extends ViewPane {

	private readonly _session = this._register(new DisposableStore());
	private _transcript!: HTMLElement;
	private _input!: HTMLTextAreaElement;
	private _status!: HTMLElement;
	private _messages: IOpenAgentChatMessage[] = [];
	private _cts: CancellationTokenSource | undefined;

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
		@IModelGatewayService private readonly _modelGateway: IModelGatewayService,
		@IContextIndexService private readonly _contextIndex: IContextIndexService,
		@IAgentLoopService private readonly _agentLoop: IAgentLoopService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);
		container.classList.add('openagent-chat');
		this._transcript = append(container, $('div.openagent-chat-transcript'));
		this._status = append(container, $('div.openagent-chat-status'));
		const form = append(container, $('div.openagent-chat-input-row'));
		this._input = append(form, $('textarea.openagent-chat-input')) as HTMLTextAreaElement;
		this._input.placeholder = localize('openAgent.chat.placeholder', "Ask Open-Agent… use @file @folder @git @codebase — or /agent <goal>");
		this._input.rows = 3;
		const send = append(form, $('button.openagent-chat-send')) as HTMLButtonElement;
		send.textContent = localize('openAgent.chat.send', "Send");
		this._session.add({ dispose: () => { /* noop for elements */ } });
		send.onclick = () => void this._send();
		this._input.onkeydown = (e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				void this._send();
			}
		};
		this._renderWelcome();
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
	}

	clearSession(): void {
		this._cts?.cancel();
		this._cts?.dispose();
		this._cts = undefined;
		this._messages = [];
		clearNode(this._transcript);
		this._status.textContent = '';
		this._renderWelcome();
	}

	private _renderWelcome(): void {
		const enabled = this.configurationService.getValue<boolean>(OpenAgentConfigKeys.enabled);
		const chatEnabled = this.configurationService.getValue<boolean>(OpenAgentConfigKeys.chatEnabled) !== false;
		if (!enabled || !chatEnabled) {
			append(this._transcript, $('p')).textContent = localize(
				'openAgent.chat.disabled',
				"Open-Agent is disabled. Set openagent.enabled to true in Settings, then send a message.",
			);
		}
	}

	private async _send(): Promise<void> {
		const text = this._input.value.trim();
		if (!text) {
			return;
		}
		if (!this.configurationService.getValue<boolean>(OpenAgentConfigKeys.enabled)) {
			this._status.textContent = localize('openAgent.chat.enableFirst', "Enable openagent.enabled first.");
			return;
		}
		this._input.value = '';
		this._appendBubble('user', text);
		this._cts?.cancel();
		this._cts?.dispose();
		this._cts = new CancellationTokenSource();
		const token = this._cts.token;

		const agentMatch = /^\/agent\s+([\s\S]+)$/i.exec(text);
		if (agentMatch) {
			await this._runAgent(agentMatch[1].trim(), token);
			return;
		}

		try {
			const blocks = await this._contextIndex.resolveMentions(text, token);
			const contextPrefix = blocks.length
				? blocks.map(block => `### ${block.title}\n${block.body}`).join('\n\n') + '\n\n'
				: '';
			const userContent = contextPrefix ? `${contextPrefix}User request:\n${text}` : text;
			this._messages.push({ role: 'user', content: userContent });
			const assistantEl = this._appendBubble('assistant', '');
			let assistantText = '';
			this._status.textContent = localize('openAgent.chat.streaming', "Streaming…");

			for await (const event of this._modelGateway.stream({
				modelClass: MODEL_CLASSES.localPrivate,
				taskType: 'generate',
				messages: [
					{ role: 'system', content: 'You are Open-Agent, a privacy-first coding assistant inside VS Code. Prefer concise, actionable answers.' },
					...this._messages,
				],
			}, token)) {
				if (event.chunk.type === 'delta' && event.chunk.text) {
					assistantText += event.chunk.text;
					assistantEl.textContent = assistantText;
					this._transcript.scrollTop = this._transcript.scrollHeight;
				}
				if (event.chunk.type === 'error') {
					throw new Error(event.chunk.errorMessage || 'Stream error');
				}
			}
			this._messages.push({ role: 'assistant', content: assistantText });
			this._status.textContent = '';
		} catch (err) {
			this._status.textContent = err instanceof Error ? err.message : String(err);
		}
	}

	private async _runAgent(goal: string, token: CancellationTokenSource['token']): Promise<void> {
		if (this.configurationService.getValue<boolean>(OpenAgentConfigKeys.agentEnabled) === false) {
			this._status.textContent = localize('openAgent.chat.agentDisabled', "Agent is disabled (openagent.agent.enabled).");
			return;
		}
		this._status.textContent = localize('openAgent.chat.agentRunning', "Agent running…");
		const stepsEl = this._appendBubble('assistant', localize('openAgent.chat.agentStart', "Agent started…"));
		try {
			const result = await this._agentLoop.run(goal, token, {
				onStep: (step) => {
					const line = [
						step.thought ? `Thought: ${step.thought}` : '',
						step.tool ? `Tool: ${step.tool}` : '',
						step.observation ? `Obs: ${step.observation.slice(0, 400)}` : '',
					].filter(Boolean).join('\n');
					stepsEl.textContent = `${stepsEl.textContent}\n\n${line}`.trim();
					this._transcript.scrollTop = this._transcript.scrollHeight;
				},
			});
			this._appendBubble('assistant', result.finalText);
			this._messages.push({ role: 'user', content: `/agent ${goal}` });
			this._messages.push({ role: 'assistant', content: result.finalText });
			this._status.textContent = '';
		} catch (err) {
			this._status.textContent = err instanceof Error ? err.message : String(err);
		}
	}

	private _appendBubble(role: 'user' | 'assistant', text: string): HTMLElement {
		const el = append(this._transcript, $(`div.openagent-chat-bubble.${role}`));
		el.textContent = text;
		this._transcript.scrollTop = this._transcript.scrollHeight;
		return el;
	}
}
