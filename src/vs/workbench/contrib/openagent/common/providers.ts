/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/common/providers.ts
 * PURPOSE: Provider identity and Model Gateway adapter port (hexagonal boundary).
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-12
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Adapters implement IModelProviderAdapter; only ModelGatewayService may call them.
 *
 * DEPENDENCIES:
 * - CancellationToken, messages types
 *
 * SECURITY:
 * - Adapters receive materialized credentials from the secrets broker, never from prompts.
 * - Feature / UI code shall not import or invoke adapters directly.
 *
 * RISK CLASS: R2
 *
 * DATA HANDLING:
 * - Classification: Internal
 * - Network egress occurs only inside adapters under gateway policy.
 *
 * AI NOTES:
 * - Two protocol adapters only: openai_compatible + anthropic.
 * - Vendors are configuration profiles on openai_compatible.
 *
 * OBSERVABILITY:
 * - Health checks must not log secrets; failures report provider id only.
 * =============================================================================
 */

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IOpenAgentChatMessage, IOpenAgentCompletionResult, IOpenAgentEmbeddingResult, IOpenAgentStreamChunk } from './messages.js';
import { OpenAiCompatibleProfileId } from './profiles.js';

export const PROVIDER_IDS = {
	openaiCompatible: 'openai_compatible',
	anthropic: 'anthropic',
} as const;

export type ProviderId = typeof PROVIDER_IDS[keyof typeof PROVIDER_IDS];

export function isProviderId(value: string): value is ProviderId {
	return (Object.values(PROVIDER_IDS) as string[]).includes(value);
}

export interface IProviderCompleteRequest {
	readonly providerModelId: string;
	readonly messages: readonly IOpenAgentChatMessage[];
	readonly temperature?: number;
	readonly maxTokens?: number;
	readonly apiKey?: string;
	readonly baseUrl: string;
	readonly timeoutMs: number;
	readonly requiresApiKey?: boolean;
	readonly profileId?: OpenAiCompatibleProfileId;
}

export interface IProviderStreamRequest extends IProviderCompleteRequest {
	readonly stream: true;
}

export interface IProviderEmbedRequest {
	readonly providerModelId: string;
	readonly input: readonly string[];
	readonly apiKey?: string;
	readonly baseUrl: string;
	readonly timeoutMs: number;
	readonly requiresApiKey?: boolean;
	readonly profileId?: OpenAiCompatibleProfileId;
}

export interface IModelProviderAdapter {
	readonly id: ProviderId;

	healthCheck(baseUrl: string, token: CancellationToken, apiKey?: string): Promise<boolean>;

	complete(request: IProviderCompleteRequest, token: CancellationToken): Promise<IOpenAgentCompletionResult>;

	stream(request: IProviderStreamRequest, token: CancellationToken): AsyncIterable<IOpenAgentStreamChunk>;

	embed?(request: IProviderEmbedRequest, token: CancellationToken): Promise<IOpenAgentEmbeddingResult>;
}
