/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/chat/openAgentChat.contribution.ts
 * PURPOSE: Register Open-Agent chat Activity Bar view + commands.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Side-effect imported from openagent.contribution.ts; registers chat view container.
 *
 * SECURITY:
 * - Chat gated by openagent.enabled / openagent.chat.enabled; no secrets in view registration.
 *
 * RISK CLASS: R2
 *
 * AI NOTES:
 * - Registers Auxiliary Bar chat view; inference via IModelGatewayService only.
 * =============================================================================
 */

import { Codicon } from '../../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { localize, localize2 } from '../../../../../nls.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { registerIcon } from '../../../../../platform/theme/common/iconRegistry.js';
import { ViewPaneContainer } from '../../../../browser/parts/views/viewPaneContainer.js';
import { IViewContainersRegistry, IViewDescriptor, IViewsRegistry, ViewContainerLocation, Extensions as ViewExtensions } from '../../../../common/views.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IViewsService } from '../../../../services/views/common/viewsService.js';
import { OPEN_AGENT_CHAT_VIEW_ID, OPEN_AGENT_VIEW_CONTAINER_ID } from '../../common/openAgent.js';
import { OpenAgentChatViewPane } from './openAgentChatViewPane.js';

const openAgentIcon = registerIcon('openagent-view-icon', Codicon.chatSparkle, localize('openAgentViewIcon', 'Open-Agent view icon'));

const openAgentContainer = Registry.as<IViewContainersRegistry>(ViewExtensions.ViewContainersRegistry).registerViewContainer({
	id: OPEN_AGENT_VIEW_CONTAINER_ID,
	title: localize2('openAgent.viewContainer', "Open-Agent"),
	icon: openAgentIcon,
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [OPEN_AGENT_VIEW_CONTAINER_ID, { mergeViewWithContainerWhenSingleView: true }]),
	storageId: OPEN_AGENT_VIEW_CONTAINER_ID,
	hideIfEmpty: false,
	order: 6,
}, ViewContainerLocation.AuxiliaryBar, { isDefault: false });

const chatViewDescriptor: IViewDescriptor = {
	id: OPEN_AGENT_CHAT_VIEW_ID,
	containerIcon: openAgentContainer.icon,
	containerTitle: openAgentContainer.title.value,
	singleViewPaneContainerTitle: openAgentContainer.title.value,
	name: localize2('openAgent.chat.view', "Chat"),
	canToggleVisibility: true,
	canMoveView: true,
	ctorDescriptor: new SyncDescriptor(OpenAgentChatViewPane),
	openCommandActionDescriptor: {
		id: 'openagent.chat.open',
		title: openAgentContainer.title,
		keybindings: {
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyL,
		},
		order: 1,
	},
};

Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry).registerViews([chatViewDescriptor], openAgentContainer);

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'openagent.chat.newSession',
			title: localize2('openAgent.chat.newSession', "Open-Agent: New Chat Session"),
			f1: true,
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		const viewsService = accessor.get(IViewsService);
		const view = await viewsService.openView<OpenAgentChatViewPane>(OPEN_AGENT_CHAT_VIEW_ID, true);
		view?.clearSession();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'openagent.chat.focus',
			title: localize2('openAgent.chat.focus', "Open-Agent: Focus Chat"),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyL,
			},
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		await accessor.get(IViewsService).openView(OPEN_AGENT_CHAT_VIEW_ID, true);
	}
});
