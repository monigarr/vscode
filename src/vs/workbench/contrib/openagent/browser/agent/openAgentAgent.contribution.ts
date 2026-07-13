/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/agent/openAgentAgent.contribution.ts
 * PURPOSE: Register agent loop service + command palette entry.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Side-effect imported from openagent.contribution.ts; registers agent commands.
 *
 * SECURITY:
 * - Agent commands gated by openagent.enabled and openagent.agent.enabled.
 *
 * RISK CLASS: R3
 *
 * AI NOTES:
 * - Registers palette/commands only; execution lives in AgentLoopService.
 * =============================================================================
 */

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { InstantiationType, registerSingleton } from '../../../../../platform/instantiation/common/extensions.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { IAgentLoopService } from '../../common/agentLoop.js';
import { AgentLoopService } from './agentLoopService.js';

registerSingleton(IAgentLoopService, AgentLoopService, InstantiationType.Delayed);

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'openagent.agent.run',
			title: localize2('openAgent.agent.run', "Open-Agent: Run Agent"),
			f1: true,
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		const quick = accessor.get(IQuickInputService);
		const agent = accessor.get(IAgentLoopService);
		const notify = accessor.get(INotificationService);
		const goal = await quick.input({
			prompt: localize('openAgent.agent.goal', "Agent goal"),
			placeHolder: localize('openAgent.agent.placeholder', "e.g. Create hello.ts and run a typecheck"),
		});
		if (!goal?.trim()) {
			return;
		}
		try {
			const result = await agent.run(goal.trim(), CancellationToken.None);
			notify.info(localize(
				'openAgent.agent.done',
				"Agent finished ({0} steps): {1}",
				result.steps.length,
				result.finalText.slice(0, 240),
			));
		} catch (err) {
			notify.error(err instanceof Error ? err.message : String(err));
		}
	}
});
