/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/openagent.contribution.ts
 * PURPOSE: Register Open-Agent singletons, settings schema, and UI contributions.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-12
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Side-effect imported from workbench.common.main.ts (trailing contributions import).
 *
 * DEPENDENCIES:
 * - IModelGatewayService / ModelGatewayService
 * - configuration registry; feature contributions imported below
 *
 * SECURITY:
 * - openagent.enabled defaults to false (fail closed).
 * - API keys are not configuration properties; use SecretStorage.
 *
 * RISK CLASS: R2
 *
 * DATA HANDLING:
 * - Classification: Internal settings only
 *
 * AI NOTES:
 * - Registers gateway first; chat/composer/inline/agent contributions load after.
 *
 * OBSERVABILITY:
 * - No startup network calls; Delayed singleton instantiation.
 * =============================================================================
 */

import { localize } from '../../../../nls.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions, ConfigurationScope } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IModelGatewayService } from '../common/modelGateway.js';
import {
	OPEN_AGENT_DEFAULT_AGENT_MAX_STEPS,
	OPEN_AGENT_DEFAULT_AGENT_TERMINAL_TIMEOUT_MS,
	OPEN_AGENT_DEFAULT_ANTHROPIC_BASE_URL,
	OPEN_AGENT_DEFAULT_ANTHROPIC_MODEL,
	OPEN_AGENT_DEFAULT_EMBED_MODEL,
	OPEN_AGENT_DEFAULT_INLINE_DEBOUNCE_MS,
	OPEN_AGENT_DEFAULT_MAPPING_VERSION,
	OPEN_AGENT_DEFAULT_OLLAMA_BASE_URL,
	OPEN_AGENT_DEFAULT_OLLAMA_MODEL,
	OPEN_AGENT_DEFAULT_OPENAI_BASE_URL,
	OPEN_AGENT_DEFAULT_OPENAI_MODEL,
	OPEN_AGENT_DEFAULT_TIMEOUT_MS,
	OPEN_AGENT_ENABLED_DEFAULT,
	OpenAgentConfigKeys,
} from '../common/openAgent.js';
import { OPENAI_COMPATIBLE_PROFILE_IDS } from '../common/profiles.js';
import { ModelGatewayService } from './api/modelGatewayService.js';
import './openAgentSettingsCommands.js';
import './chat/openAgentChat.contribution.js';
import './inline/openAgentInline.contribution.js';
import './composer/openAgentComposer.contribution.js';
import './agent/openAgentAgent.contribution.js';
import './index/openAgentIndex.contribution.js';

registerSingleton(IModelGatewayService, ModelGatewayService, InstantiationType.Delayed);

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	id: 'openagent',
	order: 1000,
	title: localize('openAgentConfigurationTitle', "Open-Agent"),
	type: 'object',
	properties: {
		[OpenAgentConfigKeys.enabled]: {
			type: 'boolean',
			default: OPEN_AGENT_ENABLED_DEFAULT,
			description: localize('openagent.enabled', "Enable the Open-Agent Unified AI Model Gateway. When disabled, inference requests fail closed."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.chatEnabled]: {
			type: 'boolean',
			default: true,
			description: localize('openagent.chat.enabled', "Enable the Open-Agent chat sidebar when the gateway is enabled."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.inlineEnabled]: {
			type: 'boolean',
			default: true,
			description: localize('openagent.inline.enabled', "Enable Open-Agent inline ghost-text completions."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.indexEnabled]: {
			type: 'boolean',
			default: true,
			description: localize('openagent.index.enabled', "Enable workspace indexing for @codebase semantic search."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.composerEnabled]: {
			type: 'boolean',
			default: true,
			description: localize('openagent.composer.enabled', "Enable Open-Agent multi-file Composer."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.agentEnabled]: {
			type: 'boolean',
			default: true,
			description: localize('openagent.agent.enabled', "Enable the Open-Agent autonomous tool loop."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.ollamaBaseUrl]: {
			type: 'string',
			default: OPEN_AGENT_DEFAULT_OLLAMA_BASE_URL,
			description: localize('openagent.ollama.baseUrl', "Base URL for the local Ollama server (OpenAI-compatible /v1 is appended)."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.ollamaDefaultModel]: {
			type: 'string',
			default: OPEN_AGENT_DEFAULT_OLLAMA_MODEL,
			description: localize('openagent.ollama.defaultModel', "Default model id for the local Ollama profile."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.openAiBaseUrl]: {
			type: 'string',
			default: OPEN_AGENT_DEFAULT_OPENAI_BASE_URL,
			description: localize('openagent.openai.baseUrl', "Base URL for OpenAI or custom OpenAI-compatible cloud endpoints."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.openAiDefaultModel]: {
			type: 'string',
			default: OPEN_AGENT_DEFAULT_OPENAI_MODEL,
			description: localize('openagent.openai.defaultModel', "Default model id for cloud OpenAI-compatible profiles."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.openAiProfileId]: {
			type: 'string',
			enum: Object.values(OPENAI_COMPATIBLE_PROFILE_IDS),
			default: OPENAI_COMPATIBLE_PROFILE_IDS.openai,
			description: localize('openagent.openai.profileId', "Default OpenAI-compatible profile (ollama, lmstudio, lmlink, openai, huggingface_compatible, kaggle_compatible, …). Prefer Open-Agent: Select Model Profile."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.anthropicBaseUrl]: {
			type: 'string',
			default: OPEN_AGENT_DEFAULT_ANTHROPIC_BASE_URL,
			description: localize('openagent.anthropic.baseUrl', "Base URL for the Anthropic Messages API."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.anthropicDefaultModel]: {
			type: 'string',
			default: OPEN_AGENT_DEFAULT_ANTHROPIC_MODEL,
			description: localize('openagent.anthropic.defaultModel', "Default Anthropic model id for quality_max routes."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.embedModel]: {
			type: 'string',
			default: OPEN_AGENT_DEFAULT_EMBED_MODEL,
			description: localize('openagent.embed.model', "Embedding model id used for workspace indexing."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.vectorStoreBackend]: {
			type: 'string',
			enum: ['lance', 'memory'],
			default: 'lance',
			description: localize('openagent.vectorStore.backend', "Vector store backend. LanceDB is preferred; memory is for tests/dev fallback."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.routingMappingVersion]: {
			type: 'string',
			default: OPEN_AGENT_DEFAULT_MAPPING_VERSION,
			description: localize('openagent.routing.mappingVersion', "Version string recorded on every model.call for the active class→provider mapping."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.requestTimeoutMs]: {
			type: 'number',
			default: OPEN_AGENT_DEFAULT_TIMEOUT_MS,
			minimum: 1000,
			description: localize('openagent.requestTimeoutMs', "HTTP timeout in milliseconds for Model Gateway provider calls."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.inlineDebounceMs]: {
			type: 'number',
			default: OPEN_AGENT_DEFAULT_INLINE_DEBOUNCE_MS,
			minimum: 50,
			description: localize('openagent.inline.debounceMs', "Idle debounce before requesting inline completions."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.agentMaxSteps]: {
			type: 'number',
			default: OPEN_AGENT_DEFAULT_AGENT_MAX_STEPS,
			minimum: 1,
			maximum: 50,
			description: localize('openagent.agent.maxSteps', "Maximum tool-loop steps per autonomous agent run."),
			scope: ConfigurationScope.APPLICATION,
		},
		[OpenAgentConfigKeys.agentTerminalTimeoutMs]: {
			type: 'number',
			default: OPEN_AGENT_DEFAULT_AGENT_TERMINAL_TIMEOUT_MS,
			minimum: 1000,
			maximum: 120000,
			description: localize('openagent.agent.terminalTimeoutMs', "Max time to capture terminal output for agent run_terminal tool."),
			scope: ConfigurationScope.APPLICATION,
		},
	},
});
