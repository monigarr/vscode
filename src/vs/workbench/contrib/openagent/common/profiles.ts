/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/common/profiles.ts
 * PURPOSE: OpenAI-compatible configuration profiles (vendor-neutral protocol pins).
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   const profile = getOpenAiCompatibleProfile('ollama');
 *
 * DEPENDENCIES:
 * - openAgent defaults
 *
 * SECURITY:
 * - Profiles declare residency and whether an API key is required.
 * - Secret key ids reference SecretStorage; values never live here.
 *
 * RISK CLASS: R1
 *
 * DATA HANDLING:
 * - Classification: Internal
 *
 * AI NOTES:
 * - One protocol adapter + many profiles; do not add company-specific adapters.
 *
 * OBSERVABILITY:
 * - Routing/telemetry should log profileId, never credentials.
 * =============================================================================
 */

import {
	OPEN_AGENT_DEFAULT_OLLAMA_BASE_URL,
	OPEN_AGENT_DEFAULT_OLLAMA_MODEL,
	OPEN_AGENT_DEFAULT_OPENAI_BASE_URL,
	OPEN_AGENT_DEFAULT_OPENAI_MODEL,
	OPEN_AGENT_OPENAI_API_KEY_SECRET,
} from './openAgent.js';

export type ProfileResidency = 'local' | 'cloud';

export const OPENAI_COMPATIBLE_PROFILE_IDS = {
	ollama: 'ollama',
	openai: 'openai',
	openrouter: 'openrouter',
	deepseek: 'deepseek',
	groq: 'groq',
	together: 'together',
	fireworks: 'fireworks',
	lmstudio: 'lmstudio',
	lmlink: 'lmlink',
	llamacpp: 'llamacpp',
	huggingfaceCompatible: 'huggingface_compatible',
	kaggleCompatible: 'kaggle_compatible',
	custom: 'custom',
} as const;

export type OpenAiCompatibleProfileId = typeof OPENAI_COMPATIBLE_PROFILE_IDS[keyof typeof OPENAI_COMPATIBLE_PROFILE_IDS];

export interface IOpenAiCompatibleProfile {
	readonly id: OpenAiCompatibleProfileId;
	readonly displayName: string;
	readonly baseUrl: string;
	readonly defaultModel: string;
	readonly secretKeyId?: string;
	readonly residency: ProfileResidency;
	readonly requiresApiKey: boolean;
	readonly healthPath: string;
}

export const BUILTIN_OPENAI_COMPATIBLE_PROFILES: readonly IOpenAiCompatibleProfile[] = [
	{
		id: OPENAI_COMPATIBLE_PROFILE_IDS.ollama,
		displayName: 'Ollama (local OpenAI-compatible)',
		baseUrl: `${OPEN_AGENT_DEFAULT_OLLAMA_BASE_URL}/v1`,
		defaultModel: OPEN_AGENT_DEFAULT_OLLAMA_MODEL,
		residency: 'local',
		requiresApiKey: false,
		healthPath: '/models',
	},
	{
		id: OPENAI_COMPATIBLE_PROFILE_IDS.openai,
		displayName: 'OpenAI',
		baseUrl: OPEN_AGENT_DEFAULT_OPENAI_BASE_URL,
		defaultModel: OPEN_AGENT_DEFAULT_OPENAI_MODEL,
		secretKeyId: OPEN_AGENT_OPENAI_API_KEY_SECRET,
		residency: 'cloud',
		requiresApiKey: true,
		healthPath: '/models',
	},
	{
		id: OPENAI_COMPATIBLE_PROFILE_IDS.openrouter,
		displayName: 'OpenRouter',
		baseUrl: 'https://openrouter.ai/api/v1',
		defaultModel: 'openrouter/auto',
		secretKeyId: OPEN_AGENT_OPENAI_API_KEY_SECRET,
		residency: 'cloud',
		requiresApiKey: true,
		healthPath: '/models',
	},
	{
		id: OPENAI_COMPATIBLE_PROFILE_IDS.deepseek,
		displayName: 'DeepSeek',
		baseUrl: 'https://api.deepseek.com/v1',
		defaultModel: 'deepseek-chat',
		secretKeyId: OPEN_AGENT_OPENAI_API_KEY_SECRET,
		residency: 'cloud',
		requiresApiKey: true,
		healthPath: '/models',
	},
	{
		id: OPENAI_COMPATIBLE_PROFILE_IDS.groq,
		displayName: 'Groq',
		baseUrl: 'https://api.groq.com/openai/v1',
		defaultModel: 'llama-3.3-70b-versatile',
		secretKeyId: OPEN_AGENT_OPENAI_API_KEY_SECRET,
		residency: 'cloud',
		requiresApiKey: true,
		healthPath: '/models',
	},
	{
		id: OPENAI_COMPATIBLE_PROFILE_IDS.together,
		displayName: 'Together',
		baseUrl: 'https://api.together.xyz/v1',
		defaultModel: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
		secretKeyId: OPEN_AGENT_OPENAI_API_KEY_SECRET,
		residency: 'cloud',
		requiresApiKey: true,
		healthPath: '/models',
	},
	{
		id: OPENAI_COMPATIBLE_PROFILE_IDS.fireworks,
		displayName: 'Fireworks',
		baseUrl: 'https://api.fireworks.ai/inference/v1',
		defaultModel: 'accounts/fireworks/models/llama-v3p1-8b-instruct',
		secretKeyId: OPEN_AGENT_OPENAI_API_KEY_SECRET,
		residency: 'cloud',
		requiresApiKey: true,
		healthPath: '/models',
	},
	{
		id: OPENAI_COMPATIBLE_PROFILE_IDS.lmstudio,
		displayName: 'LM Studio (local)',
		baseUrl: 'http://127.0.0.1:1234/v1',
		defaultModel: 'local-model',
		residency: 'local',
		requiresApiKey: false,
		healthPath: '/models',
	},
	{
		id: OPENAI_COMPATIBLE_PROFILE_IDS.lmlink,
		displayName: 'LM Link (remote-local mesh)',
		baseUrl: 'http://127.0.0.1:1234/v1',
		defaultModel: 'local-model',
		residency: 'local',
		requiresApiKey: false,
		healthPath: '/models',
	},
	{
		id: OPENAI_COMPATIBLE_PROFILE_IDS.llamacpp,
		displayName: 'llama.cpp server (local)',
		baseUrl: 'http://127.0.0.1:8080/v1',
		defaultModel: 'local-model',
		residency: 'local',
		requiresApiKey: false,
		healthPath: '/models',
	},
	{
		id: OPENAI_COMPATIBLE_PROFILE_IDS.huggingfaceCompatible,
		displayName: 'Hugging Face (OpenAI-compatible)',
		baseUrl: 'https://router.huggingface.co/v1',
		defaultModel: 'HuggingFaceH4/zephyr-7b-beta',
		secretKeyId: OPEN_AGENT_OPENAI_API_KEY_SECRET,
		residency: 'cloud',
		requiresApiKey: true,
		healthPath: '/models',
	},
	{
		id: OPENAI_COMPATIBLE_PROFILE_IDS.kaggleCompatible,
		displayName: 'Kaggle (OpenAI-compatible)',
		baseUrl: 'https://www.kaggle.com/api/v1',
		defaultModel: 'kaggle-model',
		secretKeyId: OPEN_AGENT_OPENAI_API_KEY_SECRET,
		residency: 'cloud',
		requiresApiKey: true,
		healthPath: '/models',
	},
	{
		id: OPENAI_COMPATIBLE_PROFILE_IDS.custom,
		displayName: 'Custom OpenAI-compatible',
		baseUrl: OPEN_AGENT_DEFAULT_OPENAI_BASE_URL,
		defaultModel: OPEN_AGENT_DEFAULT_OPENAI_MODEL,
		secretKeyId: OPEN_AGENT_OPENAI_API_KEY_SECRET,
		residency: 'cloud',
		requiresApiKey: true,
		healthPath: '/models',
	},
];

const PROFILE_BY_ID = new Map<string, IOpenAiCompatibleProfile>(
	BUILTIN_OPENAI_COMPATIBLE_PROFILES.map(profile => [profile.id, profile]),
);

export function isOpenAiCompatibleProfileId(value: string): value is OpenAiCompatibleProfileId {
	return PROFILE_BY_ID.has(value);
}

export function getOpenAiCompatibleProfile(id: string): IOpenAiCompatibleProfile {
	const profile = PROFILE_BY_ID.get(id);
	if (!profile) {
		throw new Error(`Unknown OpenAI-compatible profile '${id}'.`);
	}
	return profile;
}

export function isLocalResidencyProfile(profile: IOpenAiCompatibleProfile): boolean {
	return profile.residency === 'local';
}

export function isLocalOpenAiCompatibleProfileId(id: string): boolean {
	if (!isOpenAiCompatibleProfileId(id)) {
		return false;
	}
	return isLocalResidencyProfile(getOpenAiCompatibleProfile(id));
}

/**
 * Whether `openagent.openai.profileId` should retarget this openai-compatible route pin.
 * Local selection drives local_private / embed / code_specialist pins; cloud selection drives cloud pins.
 */
export function shouldOverrideProfilePin(
	selectedProfileId: OpenAiCompatibleProfileId,
	pinnedProfileId: OpenAiCompatibleProfileId | undefined,
): boolean {
	const selectedLocal = isLocalOpenAiCompatibleProfileId(selectedProfileId);
	if (!pinnedProfileId) {
		return true;
	}
	const pinnedLocal = isLocalOpenAiCompatibleProfileId(pinnedProfileId);
	if (selectedLocal) {
		// Local picker retargets local pins and cloud coding pins (local-first code_specialist).
		return pinnedLocal || pinnedProfileId === OPENAI_COMPATIBLE_PROFILE_IDS.openai
			|| pinnedProfileId === OPENAI_COMPATIBLE_PROFILE_IDS.custom
			|| pinnedProfileId === OPENAI_COMPATIBLE_PROFILE_IDS.huggingfaceCompatible
			|| pinnedProfileId === OPENAI_COMPATIBLE_PROFILE_IDS.kaggleCompatible;
	}
	// Cloud picker only retargets non-local pins.
	return !pinnedLocal;
}
