/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/common/agentLoop.ts
 * PURPOSE: Autonomous ReAct agent loop contracts and tool ids.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   import { IAgentLoopService, AGENT_TOOL_IDS } from './agentLoop.js';
 *   await agentLoop.run('fix the failing unit test', token);
 *
 * SECURITY:
 * - write_file / apply_patch / run_terminal require HITL approval before execution.
 *
 * RISK CLASS: R3
 *
 * AI NOTES:
 * - Model proposes tools; deterministic code executes them. Do not trust model self-authorization.
 * =============================================================================
 */

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const AGENT_TOOL_IDS = {
	readFile: 'read_file',
	writeFile: 'write_file',
	applyPatch: 'apply_patch',
	runTerminal: 'run_terminal',
	searchCodebase: 'search_codebase',
} as const;

export type AgentToolId = typeof AGENT_TOOL_IDS[keyof typeof AGENT_TOOL_IDS];

export interface IAgentStep {
	readonly thought: string;
	readonly tool?: AgentToolId;
	readonly args?: Readonly<Record<string, string>>;
	readonly observation?: string;
}

export interface IAgentRunResult {
	readonly steps: readonly IAgentStep[];
	readonly finalText: string;
}

export interface IAgentRunOptions {
	readonly onStep?: (step: IAgentStep) => void;
	/** Return false to deny the tool; fail closed. */
	readonly approveTool?: (tool: AgentToolId, args: Readonly<Record<string, string>>) => Promise<boolean>;
}

export const IAgentLoopService = createDecorator<IAgentLoopService>('openAgentAgentLoopService');

export interface IAgentLoopService {
	readonly _serviceBrand: undefined;
	run(goal: string, token: CancellationToken, options?: IAgentRunOptions): Promise<IAgentRunResult>;
}

export function toolRequiresHitl(tool: AgentToolId): boolean {
	switch (tool) {
		case AGENT_TOOL_IDS.writeFile:
		case AGENT_TOOL_IDS.applyPatch:
		case AGENT_TOOL_IDS.runTerminal:
			return true;
		case AGENT_TOOL_IDS.readFile:
		case AGENT_TOOL_IDS.searchCodebase:
			return false;
		default: {
			const _exhaustive: never = tool;
			return _exhaustive;
		}
	}
}
