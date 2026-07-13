/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/common/routingConfig.ts
 * PURPOSE: Versioned routing table types and default Open-Agent mapping skeleton.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-12
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   const resolved = resolveRoute(DEFAULT_ROUTING_TABLE, modelClass);
 *
 * DEPENDENCIES:
 * - modelClasses, providers, profiles
 *
 * SECURITY:
 * - disallow_fallback_across_privacy_boundary prevents local → cloud fallback.
 *
 * RISK CLASS: R2
 *
 * DATA HANDLING:
 * - Classification: Internal
 * - Residency: local_private classes pin to local OpenAI-compatible profiles.
 *
 * AI NOTES:
 * - Agents declare model classes; this table maps class → protocol + profile pin.
 *
 * OBSERVABILITY:
 * - Traces must include routingTableId, mappingVersion, matchedRuleId, fallbackDepth.
 * =============================================================================
 */

import { isLocalPrivateClass, MODEL_CLASSES, ModelClass } from './modelClasses.js';
import {
	OPEN_AGENT_DEFAULT_ANTHROPIC_MODEL,
	OPEN_AGENT_DEFAULT_EMBED_MODEL,
	OPEN_AGENT_DEFAULT_MAPPING_VERSION,
	OPEN_AGENT_DEFAULT_OLLAMA_MODEL,
	OPEN_AGENT_DEFAULT_OPENAI_MODEL,
} from './openAgent.js';
import { getOpenAiCompatibleProfile, OPENAI_COMPATIBLE_PROFILE_IDS, OpenAiCompatibleProfileId } from './profiles.js';
import { PROVIDER_IDS, ProviderId } from './providers.js';

export interface IRoutingTarget {
	readonly providerId: ProviderId;
	readonly providerModelId: string;
	readonly profileId?: OpenAiCompatibleProfileId;
}

export interface IRoutingRule {
	readonly ruleId: string;
	readonly modelClass: ModelClass | 'default';
	readonly target: IRoutingTarget;
	readonly fallbacks?: readonly IRoutingTarget[];
}

export interface IRoutingConstraints {
	readonly disallowFallbackAcrossPrivacyBoundary: boolean;
}

export interface IRoutingTable {
	readonly routingTableId: string;
	readonly mappingVersion: string;
	readonly rules: readonly IRoutingRule[];
	readonly constraints: IRoutingConstraints;
}

export interface IResolvedRoute {
	readonly routingTableId: string;
	readonly mappingVersion: string;
	readonly matchedRuleId: string;
	readonly modelClass: ModelClass;
	readonly target: IRoutingTarget;
	readonly fallbacks: readonly IRoutingTarget[];
}

export const DEFAULT_ROUTING_TABLE: IRoutingTable = {
	routingTableId: 'routing.openagent.v2',
	mappingVersion: OPEN_AGENT_DEFAULT_MAPPING_VERSION,
	constraints: {
		disallowFallbackAcrossPrivacyBoundary: true,
	},
	rules: [
		{
			ruleId: 'local_private_ollama',
			modelClass: MODEL_CLASSES.localPrivate,
			target: {
				providerId: PROVIDER_IDS.openaiCompatible,
				profileId: OPENAI_COMPATIBLE_PROFILE_IDS.ollama,
				providerModelId: OPEN_AGENT_DEFAULT_OLLAMA_MODEL,
			},
		},
		{
			ruleId: 'private_onprem_ollama',
			modelClass: MODEL_CLASSES.privateOnprem,
			target: {
				providerId: PROVIDER_IDS.openaiCompatible,
				profileId: OPENAI_COMPATIBLE_PROFILE_IDS.ollama,
				providerModelId: OPEN_AGENT_DEFAULT_OLLAMA_MODEL,
			},
		},
		{
			ruleId: 'embed_local_ollama',
			modelClass: MODEL_CLASSES.embed,
			target: {
				providerId: PROVIDER_IDS.openaiCompatible,
				profileId: OPENAI_COMPATIBLE_PROFILE_IDS.ollama,
				providerModelId: OPEN_AGENT_DEFAULT_EMBED_MODEL,
			},
		},
		{
			ruleId: 'code_specialist_openai',
			modelClass: MODEL_CLASSES.codeSpecialist,
			target: {
				providerId: PROVIDER_IDS.openaiCompatible,
				profileId: OPENAI_COMPATIBLE_PROFILE_IDS.openai,
				providerModelId: OPEN_AGENT_DEFAULT_OPENAI_MODEL,
			},
			fallbacks: [
				{
					providerId: PROVIDER_IDS.openaiCompatible,
					profileId: OPENAI_COMPATIBLE_PROFILE_IDS.ollama,
					providerModelId: OPEN_AGENT_DEFAULT_OLLAMA_MODEL,
				},
			],
		},
		{
			ruleId: 'quality_max_anthropic',
			modelClass: MODEL_CLASSES.qualityMax,
			target: {
				providerId: PROVIDER_IDS.anthropic,
				providerModelId: OPEN_AGENT_DEFAULT_ANTHROPIC_MODEL,
			},
			fallbacks: [
				{
					providerId: PROVIDER_IDS.openaiCompatible,
					profileId: OPENAI_COMPATIBLE_PROFILE_IDS.openai,
					providerModelId: OPEN_AGENT_DEFAULT_OPENAI_MODEL,
				},
			],
		},
		{
			ruleId: 'default_openai',
			modelClass: 'default',
			target: {
				providerId: PROVIDER_IDS.openaiCompatible,
				profileId: OPENAI_COMPATIBLE_PROFILE_IDS.openai,
				providerModelId: OPEN_AGENT_DEFAULT_OPENAI_MODEL,
			},
			fallbacks: [
				{
					providerId: PROVIDER_IDS.openaiCompatible,
					profileId: OPENAI_COMPATIBLE_PROFILE_IDS.ollama,
					providerModelId: OPEN_AGENT_DEFAULT_OLLAMA_MODEL,
				},
			],
		},
	],
};

export function resolveRoute(table: IRoutingTable, modelClass: ModelClass): IResolvedRoute {
	const exact = table.rules.find(rule => rule.modelClass === modelClass);
	const fallbackRule = table.rules.find(rule => rule.modelClass === 'default');
	const matched = exact ?? fallbackRule;
	if (!matched) {
		throw new Error(`Open-Agent routing table ${table.routingTableId} has no rule for ${modelClass} and no default.`);
	}

	return {
		routingTableId: table.routingTableId,
		mappingVersion: table.mappingVersion,
		matchedRuleId: matched.ruleId,
		modelClass,
		target: matched.target,
		fallbacks: matched.fallbacks ?? [],
	};
}

export function isLocalRoutingTarget(target: IRoutingTarget): boolean {
	if (target.providerId === PROVIDER_IDS.anthropic) {
		return false;
	}
	if (!target.profileId) {
		return false;
	}
	return getOpenAiCompatibleProfile(target.profileId).residency === 'local';
}

export function filterFallbacksForPrivacy(
	modelClass: ModelClass,
	candidates: readonly IRoutingTarget[],
	constraints: IRoutingConstraints,
): readonly IRoutingTarget[] {
	if (!constraints.disallowFallbackAcrossPrivacyBoundary || !isLocalPrivateClass(modelClass)) {
		return candidates;
	}
	return candidates.filter(candidate => isLocalRoutingTarget(candidate));
}

export function withMappingVersion(table: IRoutingTable, mappingVersion: string): IRoutingTable {
	return {
		...table,
		mappingVersion,
	};
}

export function circuitKeyFor(target: IRoutingTarget): string {
	return target.profileId ? `${target.providerId}:${target.profileId}` : target.providerId;
}
