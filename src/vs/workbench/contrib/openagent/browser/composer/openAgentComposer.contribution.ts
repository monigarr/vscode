/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/composer/openAgentComposer.contribution.ts
 * PURPOSE: Register Composer service, panel view, and Ctrl/Cmd+I command.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Side-effect imported from openagent.contribution.ts.
 *
 * SECURITY:
 * - Composer gated by openagent.enabled / openagent.composer.enabled.
 *
 * RISK CLASS: R2
 *
 * AI NOTES:
 * - Registers Composer ViewPane + Ctrl/Cmd+I focus/open command.
 * =============================================================================
 */

import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { localize2 } from '../../../../../nls.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../../platform/instantiation/common/extensions.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { IViewContainersRegistry, IViewDescriptor, IViewsRegistry, Extensions as ViewExtensions } from '../../../../common/views.js';
import { IViewsService } from '../../../../services/views/common/viewsService.js';
import { IComposerService } from '../../common/composer.js';
import { OPEN_AGENT_COMPOSER_VIEW_ID, OPEN_AGENT_VIEW_CONTAINER_ID } from '../../common/openAgent.js';
import { ComposerService } from './composerService.js';
import { OpenAgentComposerViewPane } from './openAgentComposerViewPane.js';

registerSingleton(IComposerService, ComposerService, InstantiationType.Delayed);

const container = Registry.as<IViewContainersRegistry>(ViewExtensions.ViewContainersRegistry).get(OPEN_AGENT_VIEW_CONTAINER_ID);

if (container) {
	const composerViewDescriptor: IViewDescriptor = {
		id: OPEN_AGENT_COMPOSER_VIEW_ID,
		containerIcon: container.icon,
		containerTitle: container.title.value,
		singleViewPaneContainerTitle: container.title.value,
		name: localize2('openAgent.composer.view', "Composer"),
		canToggleVisibility: true,
		canMoveView: true,
		ctorDescriptor: new SyncDescriptor(OpenAgentComposerViewPane),
		order: 2,
		openCommandActionDescriptor: {
			id: 'openagent.composer.focusView',
			title: localize2('openAgent.composer.focusView', "Open-Agent: Focus Composer"),
			order: 2,
		},
	};
	Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry).registerViews([composerViewDescriptor], container);
}

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'openagent.composer.open',
			title: localize2('openAgent.composer.open', "Open-Agent: Composer"),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyI,
			},
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		const viewsService = accessor.get(IViewsService);
		const view = await viewsService.openView<OpenAgentComposerViewPane>(OPEN_AGENT_COMPOSER_VIEW_ID, true);
		await view?.focusComposer();
	}
});
