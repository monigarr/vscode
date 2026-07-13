/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/inline/openAgentInline.contribution.ts
 * PURPOSE: Register inline completions provider + Ctrl/Cmd+K trigger command.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Side-effect imported from openagent.contribution.ts; registers inline completion provider.
 *
 * SECURITY:
 * - Inline gated by openagent.enabled / openagent.inline.enabled.
 *
 * RISK CLASS: R1
 *
 * AI NOTES:
 * - Registers InlineCompletionsProvider contribution.
 * =============================================================================
 */

import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { localize2 } from '../../../../../nls.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../../common/contributions.js';
import { OpenAgentInlineCompletionsProvider } from './openAgentInlineCompletions.js';

class OpenAgentInlineContribution extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.openagent.inline';

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();
		this._register(instantiationService.createInstance(OpenAgentInlineCompletionsProvider));
	}
}

registerWorkbenchContribution2(OpenAgentInlineContribution.ID, OpenAgentInlineContribution, WorkbenchPhase.AfterRestored);

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'openagent.inline.trigger',
			title: localize2('openAgent.inline.trigger', "Open-Agent: Trigger Inline Completion"),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyK,
			},
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		const editor = accessor.get(ICodeEditorService).getFocusedCodeEditor();
		await editor?.getAction('editor.action.inlineSuggest.trigger')?.run();
	}
});
