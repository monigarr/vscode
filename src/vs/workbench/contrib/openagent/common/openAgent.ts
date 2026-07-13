/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/common/openAgent.ts
 * PURPOSE: Feature identifiers and configuration keys for the Open-Agent contrib.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-12
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   import { OpenAgentConfigKeys, OPEN_AGENT_ENABLED_DEFAULT } from './openAgent.js';
 *
 * DEPENDENCIES:
 * - None (constants only)
 *
 * SECURITY:
 * - Configuration keys must never store API secrets; secrets use SecretStorage.
 *
 * RISK CLASS: R1
 *
 * DATA HANDLING:
 * - Classification: Internal
 * - Retention: N/A (constants)
 *
 * AI NOTES:
 * - Feature flags gate gateway and product surfaces independently.
 *
 * OBSERVABILITY:
 * - Config keys appear in settings; no runtime telemetry from this module.
 * =============================================================================
 */

export const OPEN_AGENT_CONTRIB_ID = 'openagent';

export const OpenAgentConfigKeys = {
	enabled: 'openagent.enabled',
	chatEnabled: 'openagent.chat.enabled',
	inlineEnabled: 'openagent.inline.enabled',
	indexEnabled: 'openagent.index.enabled',
	composerEnabled: 'openagent.composer.enabled',
	agentEnabled: 'openagent.agent.enabled',
	ollamaBaseUrl: 'openagent.ollama.baseUrl',
	ollamaDefaultModel: 'openagent.ollama.defaultModel',
	openAiBaseUrl: 'openagent.openai.baseUrl',
	openAiDefaultModel: 'openagent.openai.defaultModel',
	openAiProfileId: 'openagent.openai.profileId',
	anthropicBaseUrl: 'openagent.anthropic.baseUrl',
	anthropicDefaultModel: 'openagent.anthropic.defaultModel',
	embedModel: 'openagent.embed.model',
	vectorStoreBackend: 'openagent.vectorStore.backend',
	routingMappingVersion: 'openagent.routing.mappingVersion',
	requestTimeoutMs: 'openagent.requestTimeoutMs',
	inlineDebounceMs: 'openagent.inline.debounceMs',
	agentMaxSteps: 'openagent.agent.maxSteps',
	agentTerminalTimeoutMs: 'openagent.agent.terminalTimeoutMs',
} as const;

export type OpenAgentConfigKey = typeof OpenAgentConfigKeys[keyof typeof OpenAgentConfigKeys];

/** Feature off by default until explicitly enabled. */
export const OPEN_AGENT_ENABLED_DEFAULT = false;

export const OPEN_AGENT_DEFAULT_OLLAMA_BASE_URL = 'http://127.0.0.1:11434';
export const OPEN_AGENT_DEFAULT_OLLAMA_MODEL = 'llama3.2';
export const OPEN_AGENT_DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1';
export const OPEN_AGENT_DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';
export const OPEN_AGENT_DEFAULT_ANTHROPIC_BASE_URL = 'https://api.anthropic.com';
export const OPEN_AGENT_DEFAULT_ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';
export const OPEN_AGENT_DEFAULT_EMBED_MODEL = 'nomic-embed-text';
export const OPEN_AGENT_DEFAULT_MAPPING_VERSION = 'mapping.v2';
export const OPEN_AGENT_DEFAULT_TIMEOUT_MS = 60_000;
export const OPEN_AGENT_DEFAULT_INLINE_DEBOUNCE_MS = 100;
export const OPEN_AGENT_DEFAULT_AGENT_MAX_STEPS = 12;
export const OPEN_AGENT_DEFAULT_AGENT_TERMINAL_TIMEOUT_MS = 8000;

/** SecretStorage keys for BYOK credentials. */
export const OPEN_AGENT_OPENAI_API_KEY_SECRET = 'openagent.openai.apiKey';
export const OPEN_AGENT_ANTHROPIC_API_KEY_SECRET = 'openagent.anthropic.apiKey';

export const OPEN_AGENT_VIEW_CONTAINER_ID = 'workbench.view.openagent';
export const OPEN_AGENT_CHAT_VIEW_ID = 'workbench.view.openagent.chat';
export const OPEN_AGENT_COMPOSER_VIEW_ID = 'workbench.view.openagent.composer';
