/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/common/modelGateway.ts
 * PURPOSE: IModelGatewayService — sole DI client contract for model inference egress.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-12
 * UPDATED: 2026-07-12
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   constructor(@IModelGatewayService private readonly modelGateway: IModelGatewayService) {}
 *   const result = await this.modelGateway.complete(request, token);
 *
 * DEPENDENCIES:
 * - platform/instantiation createDecorator
 * - modelClasses, messages
 *
 * SECURITY:
 * - Feature code shall call only this service; never provider SDKs or adapters.
 * - API keys must not appear on this public request interface.
 *
 * RISK CLASS: R2
 *
 * DATA HANDLING:
 * - Classification: Internal / workspace content in messages
 * - sensitivity field reserved for future ClassificationEnforcer
 *
 * AI NOTES:
 * - Requests use MES model classes; gateway resolves provider pins via routing table.
 *
 * OBSERVABILITY:
 * - Responses include gatewayRequestId for product → agent → model correlation.
 * =============================================================================
 */

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ModelClass } from './modelClasses.js';
import { IOpenAgentChatMessage, IOpenAgentCompletionResult, IOpenAgentEmbeddingResult, IOpenAgentStreamChunk, IOpenAgentUsage } from './messages.js';
import { OpenAiCompatibleProfileId } from './profiles.js';
import { ProviderId } from './providers.js';

export type ModelGatewayTaskType = 'generate' | 'embed' | 'rerank' | 'classify' | 'judge';

export interface IModelGatewayBudget {
	readonly maxTokens?: number;
	readonly maxCostUsd?: number;
}

export interface IModelGatewayPin {
	readonly providerModelId?: string;
	readonly providerId?: ProviderId;
	readonly profileId?: OpenAiCompatibleProfileId;
	readonly mappingVersion?: string;
}

export interface IModelGatewayRequest {
	readonly traceId?: string;
	readonly agentId?: string;
	readonly agentVersion?: string;
	readonly modelClass: ModelClass;
	readonly taskType: ModelGatewayTaskType;
	readonly messages: readonly IOpenAgentChatMessage[];
	readonly temperature?: number;
	readonly sensitivity?: string;
	readonly budget?: IModelGatewayBudget;
	readonly pin?: IModelGatewayPin;
}

export interface IModelGatewayMeta {
	readonly gatewayRequestId: string;
	readonly providerModelId: string;
	readonly providerId: ProviderId;
	readonly profileId?: OpenAiCompatibleProfileId;
	readonly modelClass: ModelClass;
	readonly routingTableId: string;
	readonly matchedRuleId: string;
	readonly fallbackDepth: number;
	readonly mappingVersion: string;
	readonly latencyMs: number;
	readonly usage?: IOpenAgentUsage;
}

export interface IModelGatewayEmbeddingResponse extends IModelGatewayMeta {
	readonly result: IOpenAgentEmbeddingResult;
}

export interface IModelGatewayCompletionResponse extends IModelGatewayMeta {
	readonly result: IOpenAgentCompletionResult;
}

export interface IModelGatewayStreamEvent {
	readonly meta: IModelGatewayMeta;
	readonly chunk: IOpenAgentStreamChunk;
}

export const IModelGatewayService = createDecorator<IModelGatewayService>('openAgentModelGatewayService');

export interface IModelGatewayService {
	readonly _serviceBrand: undefined;

	/**
	 * Non-streaming completion through the Unified AI Model Gateway.
	 */
	complete(request: IModelGatewayRequest, token: CancellationToken): Promise<IModelGatewayCompletionResponse>;

	/**
	 * Streaming completion. Final event has chunk.type === 'done' with filled meta usage/latency.
	 */
	stream(request: IModelGatewayRequest, token: CancellationToken): AsyncIterable<IModelGatewayStreamEvent>;

	/**
	 * Embedding vectors through OpenAI-compatible /embeddings (or profile equivalent).
	 */
	embed(request: IModelGatewayRequest, token: CancellationToken): Promise<IModelGatewayEmbeddingResponse>;
}
