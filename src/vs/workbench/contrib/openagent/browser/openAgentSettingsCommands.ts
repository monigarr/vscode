/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/openAgentSettingsCommands.ts
 * PURPOSE: Discoverable commands to pick LM Studio / LM Link / cloud profiles without raw JSON.
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
 * - Never writes API keys to settings JSON; only profile id and base URL.
 *
 * RISK CLASS: R1
 *
 * AI NOTES:
 * - Profile picker for LM Studio local vs LM Link mesh vs cloud BYOK.
 * =============================================================================
 */

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { localize, localize2 } from '../../../../nls.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IRequestService } from '../../../../platform/request/common/request.js';
import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { OpenAgentConfigKeys } from '../common/openAgent.js';
import { BUILTIN_OPENAI_COMPATIBLE_PROFILES, getOpenAiCompatibleProfile, OPENAI_COMPATIBLE_PROFILE_IDS } from '../common/profiles.js';
import { OpenAgentSecrets } from './api/openAgentSecrets.js';
import { OpenAiCompatibleProvider } from './api/providers/openAiCompatibleProvider.js';

async function probeProfileHealth(
	accessor: ServicesAccessor,
	profileId: string,
	baseUrl: string,
): Promise<void> {
	const notify = accessor.get(INotificationService);
	const requestService = accessor.get(IRequestService);
	const secrets = new OpenAgentSecrets(accessor.get(ISecretStorageService));
	const profile = getOpenAiCompatibleProfile(profileId);
	const provider = new OpenAiCompatibleProvider(requestService);
	const apiKey = profile.requiresApiKey ? await secrets.getOpenAiApiKey() : undefined;
	const ok = await provider.healthCheck(baseUrl, CancellationToken.None, apiKey);
	if (ok) {
		notify.info(localize('openAgent.settings.healthOk', "Open-Agent health check OK for {0}", profile.displayName));
	} else {
		notify.notify({
			severity: Severity.Warning,
			message: localize('openAgent.settings.healthFail', "Open-Agent health check failed for {0} at {1}. Settings were saved; start the server or fix the URL.", profile.displayName, baseUrl),
		});
	}
}

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'openagent.settings.pickProfile',
			title: localize2('openAgent.settings.pickProfile', "Open-Agent: Select Model Profile"),
			f1: true,
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		const quick = accessor.get(IQuickInputService);
		const config = accessor.get(IConfigurationService);
		const notify = accessor.get(INotificationService);

		const items = BUILTIN_OPENAI_COMPATIBLE_PROFILES.map(profile => ({
			id: profile.id,
			label: profile.displayName,
			description: `${profile.residency} · ${profile.baseUrl}`,
			detail: profile.id === OPENAI_COMPATIBLE_PROFILE_IDS.lmlink
				? localize('openAgent.settings.lmlinkHint', "Set base URL to your LM Link–reachable OpenAI-compatible endpoint")
				: profile.requiresApiKey
					? localize('openAgent.settings.needsKey', "Requires SecretStorage API key")
					: localize('openAgent.settings.localNoKey', "Local / no API key required"),
		}));

		const pick = await quick.pick(items, {
			placeHolder: localize('openAgent.settings.pickPlaceholder', "Select LM Studio, LM Link, Ollama, or cloud profile"),
		});
		if (!pick) {
			return;
		}

		await config.updateValue(OpenAgentConfigKeys.openAiProfileId, pick.id);
		const profile = getOpenAiCompatibleProfile(pick.id);
		let baseUrl = profile.baseUrl;

		if (pick.id === OPENAI_COMPATIBLE_PROFILE_IDS.lmlink || pick.id === OPENAI_COMPATIBLE_PROFILE_IDS.custom) {
			const input = await quick.input({
				prompt: localize('openAgent.settings.baseUrl', "OpenAI-compatible base URL"),
				value: profile.baseUrl,
				placeHolder: 'http://<lm-link-host>:1234/v1',
			});
			if (input?.trim()) {
				baseUrl = input.trim().replace(/\/$/, '');
				await config.updateValue(OpenAgentConfigKeys.openAiBaseUrl, baseUrl);
			}
		} else if (
			pick.id === OPENAI_COMPATIBLE_PROFILE_IDS.lmstudio
			|| pick.id === OPENAI_COMPATIBLE_PROFILE_IDS.llamacpp
			|| pick.id === OPENAI_COMPATIBLE_PROFILE_IDS.huggingfaceCompatible
			|| pick.id === OPENAI_COMPATIBLE_PROFILE_IDS.kaggleCompatible
		) {
			await config.updateValue(OpenAgentConfigKeys.openAiBaseUrl, profile.baseUrl);
			baseUrl = profile.baseUrl;
		}

		notify.info(localize('openAgent.settings.profileSet', "Open-Agent profile set to {0}", profile.displayName));
		await probeProfileHealth(accessor, pick.id, baseUrl);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'openagent.settings.configureLmLink',
			title: localize2('openAgent.settings.configureLmLink', "Open-Agent: Configure LM Link Endpoint"),
			f1: true,
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		const quick = accessor.get(IQuickInputService);
		const config = accessor.get(IConfigurationService);
		const notify = accessor.get(INotificationService);
		const profile = getOpenAiCompatibleProfile(OPENAI_COMPATIBLE_PROFILE_IDS.lmlink);
		const baseUrl = await quick.input({
			prompt: localize('openAgent.settings.lmlinkUrl', "LM Link–reachable OpenAI-compatible base URL (no MoniGarr proxy)"),
			value: config.getValue<string>(OpenAgentConfigKeys.openAiBaseUrl) || profile.baseUrl,
			placeHolder: 'http://192.168.x.x:1234/v1',
		});
		if (!baseUrl?.trim()) {
			return;
		}
		const normalized = baseUrl.trim().replace(/\/$/, '');
		await config.updateValue(OpenAgentConfigKeys.openAiProfileId, OPENAI_COMPATIBLE_PROFILE_IDS.lmlink);
		await config.updateValue(OpenAgentConfigKeys.openAiBaseUrl, normalized);
		notify.info(localize('openAgent.settings.lmlinkSet', "LM Link profile configured. Traffic stays on your private mesh."));
		await probeProfileHealth(accessor, OPENAI_COMPATIBLE_PROFILE_IDS.lmlink, normalized);
	}
});
