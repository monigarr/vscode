/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/agent/agentLoopService.ts
 * PURPOSE: ReAct agent loop with HITL, terminal log observation, and step budgets.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   registerSingleton(IAgentLoopService, AgentLoopService, InstantiationType.Delayed);
 *   await agentLoopService.run(goal, token, { approveTool, onStep });
 *
 * SECURITY:
 * - write_file / apply_patch / run_terminal require explicit HITL approval (dialog or callback).
 *
 * RISK CLASS: R3
 *
 * AI NOTES:
 * - ReAct loop with max steps; escalate when observations stall; terminal onData capture.
 * =============================================================================
 */

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { ITerminalService } from '../../../terminal/browser/terminal.js';
import { AGENT_TOOL_IDS, AgentToolId, IAgentLoopService, IAgentRunOptions, IAgentRunResult, IAgentStep, toolRequiresHitl } from '../../common/agentLoop.js';
import { IContextIndexService } from '../../common/contextIndex.js';
import { MODEL_CLASSES } from '../../common/modelClasses.js';
import { IModelGatewayService } from '../../common/modelGateway.js';
import { IOpenAgentChatMessage } from '../../common/messages.js';
import { OPEN_AGENT_DEFAULT_AGENT_MAX_STEPS, OPEN_AGENT_DEFAULT_AGENT_TERMINAL_TIMEOUT_MS, OpenAgentConfigKeys } from '../../common/openAgent.js';

interface IParsedAction {
	readonly thought: string;
	readonly tool?: AgentToolId;
	readonly args: Record<string, string>;
	readonly final?: string;
}

const ACTION_RE = /ACTION:\s*(\w+)\s*\nARGS:\s*(\{[\s\S]*?\})\s*(?:\n|$)/i;
const FINAL_RE = /FINAL:\s*([\s\S]+)$/i;
const THOUGHT_RE = /THOUGHT:\s*([\s\S]*?)(?=\nACTION:|\nFINAL:|$)/i;
const TERMINAL_OUTPUT_CAP = 8000;

export class AgentLoopService extends Disposable implements IAgentLoopService {
	declare readonly _serviceBrand: undefined;

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IModelGatewayService private readonly _modelGateway: IModelGatewayService,
		@IContextIndexService private readonly _contextIndex: IContextIndexService,
		@IFileService private readonly _fileService: IFileService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@IWorkspaceContextService private readonly _workspaceService: IWorkspaceContextService,
		@IDialogService private readonly _dialogService: IDialogService,
		@ILogService private readonly _logService: ILogService,
	) {
		super();
	}

	async run(goal: string, token: CancellationToken, options?: IAgentRunOptions): Promise<IAgentRunResult> {
		if (!this._configurationService.getValue<boolean>(OpenAgentConfigKeys.enabled)
			|| this._configurationService.getValue<boolean>(OpenAgentConfigKeys.agentEnabled) === false) {
			throw new Error('Open-Agent agent loop is disabled.');
		}

		const maxSteps = this._configurationService.getValue<number>(OpenAgentConfigKeys.agentMaxSteps)
			|| OPEN_AGENT_DEFAULT_AGENT_MAX_STEPS;
		const steps: IAgentStep[] = [];
		const messages: IOpenAgentChatMessage[] = [
			{
				role: 'system',
				content: [
					'You are Open-Agent, an autonomous coding agent with a ReAct loop.',
					'Respond using exactly one of these forms per turn:',
					'THOUGHT: ...',
					'ACTION: read_file|write_file|apply_patch|run_terminal|search_codebase',
					'ARGS: {"path":"...","content":"...","command":"...","query":"..."}',
					'OR',
					'THOUGHT: ...',
					'FINAL: <answer to the user>',
					'Prefer local files and terminal verification. After a failing terminal command, diagnose and patch.',
					'If you are stuck repeating the same observation, escalate with FINAL explaining what is ambiguous.',
				].join('\n'),
			},
			{ role: 'user', content: goal },
		];

		let lastObservation: string | undefined;
		let stallCount = 0;

		for (let i = 0; i < maxSteps; i++) {
			if (token.isCancellationRequested) {
				break;
			}
			const response = await this._modelGateway.complete({
				modelClass: MODEL_CLASSES.localPrivate,
				taskType: 'generate',
				agentId: 'openagent.agentLoop',
				messages,
			}, token);
			const parsed = this._parse(response.result.text);
			if (parsed.final) {
				const step: IAgentStep = { thought: parsed.thought, observation: parsed.final };
				steps.push(step);
				options?.onStep?.(step);
				return { steps, finalText: parsed.final };
			}
			if (!parsed.tool) {
				const step: IAgentStep = { thought: parsed.thought || response.result.text, observation: 'No ACTION/FINAL parsed.' };
				steps.push(step);
				options?.onStep?.(step);
				messages.push({ role: 'assistant', content: response.result.text });
				messages.push({ role: 'user', content: 'Please respond with ACTION/ARGS or FINAL in the required format.' });
				continue;
			}

			if (toolRequiresHitl(parsed.tool)) {
				const approved = await this._approve(parsed.tool, parsed.args, options);
				if (!approved) {
					const step: IAgentStep = {
						thought: parsed.thought,
						tool: parsed.tool,
						args: parsed.args,
						observation: 'DENIED: user rejected this tool call. Escalate with FINAL or choose a safer read-only tool.',
					};
					steps.push(step);
					options?.onStep?.(step);
					messages.push({ role: 'assistant', content: response.result.text });
					messages.push({ role: 'user', content: `OBSERVATION:\n${step.observation}` });
					continue;
				}
			}

			const observation = await this._executeTool(parsed.tool, parsed.args, token);
			const step: IAgentStep = { thought: parsed.thought, tool: parsed.tool, args: parsed.args, observation };
			steps.push(step);
			options?.onStep?.(step);

			if (observation === lastObservation) {
				stallCount += 1;
			} else {
				stallCount = 0;
			}
			lastObservation = observation;

			if (stallCount >= 2) {
				const escalate = 'Agent stalled on repeated identical observations. Escalate: clarify the goal or inspect manually.';
				const escalateStep: IAgentStep = { thought: 'Ambiguity / no progress', observation: escalate };
				steps.push(escalateStep);
				options?.onStep?.(escalateStep);
				return { steps, finalText: escalate };
			}

			messages.push({ role: 'assistant', content: response.result.text });
			messages.push({ role: 'user', content: `OBSERVATION:\n${observation}` });
		}

		return {
			steps,
			finalText: steps.length ? (steps[steps.length - 1].observation || 'Agent stopped at step budget.') : 'Agent produced no steps.',
		};
	}

	private async _approve(
		tool: AgentToolId,
		args: Record<string, string>,
		options?: IAgentRunOptions,
	): Promise<boolean> {
		if (options?.approveTool) {
			return options.approveTool(tool, args);
		}
		const detail = tool === AGENT_TOOL_IDS.runTerminal
			? `Command: ${args.command ?? ''}`
			: `Path: ${args.path ?? ''}`;
		const result = await this._dialogService.confirm({
			message: `Open-Agent agent wants to run ${tool}`,
			detail: `${detail}\n\nAllow this action?`,
			primaryButton: 'Allow',
			cancelButton: 'Deny',
		});
		return result.confirmed;
	}

	private _parse(text: string): IParsedAction {
		const thought = THOUGHT_RE.exec(text)?.[1]?.trim() ?? '';
		const final = FINAL_RE.exec(text)?.[1]?.trim();
		if (final) {
			return { thought, args: {}, final };
		}
		const action = ACTION_RE.exec(text);
		if (!action) {
			return { thought, args: {} };
		}
		const tool = action[1].toLowerCase() as AgentToolId;
		let args: Record<string, string> = {};
		try {
			args = JSON.parse(action[2]) as Record<string, string>;
		} catch {
			args = {};
		}
		const allowed = new Set<string>(Object.values(AGENT_TOOL_IDS));
		if (!allowed.has(tool)) {
			return { thought, args: {} };
		}
		return { thought, tool, args };
	}

	private async _executeTool(tool: AgentToolId, args: Record<string, string>, token: CancellationToken): Promise<string> {
		try {
			switch (tool) {
				case AGENT_TOOL_IDS.readFile: {
					const uri = this._toUri(args.path);
					if (!uri) {
						return 'Error: missing path';
					}
					const file = await this._fileService.readFile(uri);
					return file.value.toString().slice(0, 12000);
				}
				case AGENT_TOOL_IDS.writeFile:
				case AGENT_TOOL_IDS.applyPatch: {
					const uri = this._toUri(args.path);
					if (!uri) {
						return 'Error: missing path';
					}
					const content = args.content ?? args.patch ?? '';
					await this._fileService.writeFile(uri, VSBuffer.fromString(content));
					return `Wrote ${uri.toString()} (${content.length} chars)`;
				}
				case AGENT_TOOL_IDS.runTerminal: {
					const command = args.command;
					if (!command) {
						return 'Error: missing command';
					}
					return this._runTerminalWithCapture(command, token);
				}
				case AGENT_TOOL_IDS.searchCodebase: {
					const query = args.query || args.path || '';
					const hits = await this._contextIndex.searchCodebase(query, 5, token);
					if (!hits.length) {
						return 'No codebase hits.';
					}
					return hits.map(h => `## ${h.title}\n${h.body}`).join('\n\n').slice(0, 12000);
				}
				default: {
					const _exhaustive: never = tool;
					return _exhaustive;
				}
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			this._logService.info(`[openagent.agent] tool ${tool} failed: ${message}`);
			return `Error: ${message}`;
		}
	}

	private async _runTerminalWithCapture(command: string, token: CancellationToken): Promise<string> {
		const timeoutMs = this._configurationService.getValue<number>(OpenAgentConfigKeys.agentTerminalTimeoutMs)
			|| OPEN_AGENT_DEFAULT_AGENT_TERMINAL_TIMEOUT_MS;
		const instance = await this._terminalService.createTerminal({
			config: { name: 'Open-Agent Agent' },
		});
		await this._terminalService.setActiveInstance(instance);
		let buffer = '';
		const disposable = instance.onData(data => {
			buffer += data;
			if (buffer.length > TERMINAL_OUTPUT_CAP) {
				buffer = buffer.slice(-TERMINAL_OUTPUT_CAP);
			}
		});
		try {
			instance.sendText(command, true);
			const started = Date.now();
			while (Date.now() - started < timeoutMs) {
				if (token.isCancellationRequested) {
					break;
				}
				await new Promise(resolve => setTimeout(resolve, 200));
				// Quiet period: if we have output and no new data for 600ms after first chunk, stop early.
				if (buffer.length > 0) {
					const quietStart = buffer.length;
					await new Promise(resolve => setTimeout(resolve, 600));
					if (buffer.length === quietStart) {
						break;
					}
				}
			}
			const selection = instance.selection || '';
			const combined = (buffer || selection).slice(0, TERMINAL_OUTPUT_CAP);
			return `Ran command: ${command}\nTerminal output:\n${combined || '(no output captured within timeout)'}`;
		} finally {
			disposable.dispose();
		}
	}

	private _toUri(path: string | undefined): URI | undefined {
		if (!path) {
			return undefined;
		}
		const folders = this._workspaceService.getWorkspace().folders;
		if (!folders.length) {
			return undefined;
		}
		if (path.includes('://')) {
			return URI.parse(path);
		}
		return URI.joinPath(folders[0].uri, path.replace(/^[\\/]+/, ''));
	}
}
