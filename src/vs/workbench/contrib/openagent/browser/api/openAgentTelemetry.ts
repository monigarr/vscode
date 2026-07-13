/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/api/openAgentTelemetry.ts
 * PURPOSE: Local redacted model.call logging with gateway_request_id correlation.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-12
 * UPDATED: 2026-07-12
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   telemetry.logModelCall({ gatewayRequestId, ... });
 *
 * DEPENDENCIES:
 * - ILogService
 *
 * SECURITY:
 * - Never logs prompts, completions, API keys, or Authorization headers.
 * - Telemetry is local logging only; no remote upload in this foundation slice.
 *
 * RISK CLASS: R1
 *
 * DATA HANDLING:
 * - Classification: Internal operational metadata
 * - Redaction: Prompt/response bodies omitted by design
 *
 * AI NOTES:
 * - Emits MES-required model.call fields for routing auditability.
 *
 * OBSERVABILITY:
 * - Structured JSON-ish line via ILogService.info under [openagent.model.call].
 * =============================================================================
 */

import { ILogService } from '../../../../../platform/log/common/log.js';
import { ModelClass } from '../../common/modelClasses.js';
import { IOpenAgentUsage } from '../../common/messages.js';
import { ProviderId } from '../../common/providers.js';

export interface IModelCallTelemetryEvent {
	readonly gatewayRequestId: string;
	readonly traceId?: string;
	readonly agentId?: string;
	readonly routingTableId: string;
	readonly matchedRuleId: string;
	readonly modelClass: ModelClass;
	readonly providerId: ProviderId;
	readonly profileId?: string;
	readonly providerModelId: string;
	readonly mappingVersion: string;
	readonly fallbackDepth: number;
	readonly latencyMs: number;
	readonly success: boolean;
	readonly errorCode?: string;
	readonly sensitivityDecision?: string;
	readonly usage?: IOpenAgentUsage;
	readonly taskType: string;
}

export class OpenAgentTelemetry {
	constructor(
		private readonly _logService: ILogService,
	) { }

	logModelCall(event: IModelCallTelemetryEvent): void {
		// Deliberately omit prompts/completions/secrets.
		this._logService.info('[openagent.model.call]', JSON.stringify({
			event: 'model.call',
			gateway_request_id: event.gatewayRequestId,
			trace_id: event.traceId,
			agent_id: event.agentId,
			routing_table_id: event.routingTableId,
			matched_rule_id: event.matchedRuleId,
			model_class: event.modelClass,
			provider_id: event.providerId,
			profile_id: event.profileId,
			provider_model_id: event.providerModelId,
			mapping_version: event.mappingVersion,
			fallback_depth: event.fallbackDepth,
			latency_ms: event.latencyMs,
			success: event.success,
			error_code: event.errorCode,
			sensitivity_decision: event.sensitivityDecision ?? 'unspecified',
			task_type: event.taskType,
			prompt_tokens: event.usage?.promptTokens,
			completion_tokens: event.usage?.completionTokens,
			total_tokens: event.usage?.totalTokens,
		}));
	}
}
