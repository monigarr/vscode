/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/common/mentions.ts
 * PURPOSE: Pure @mention parser shared by ContextIndexService and unit tests.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 * =============================================================================
 */

import { IOpenAgentMention } from './contextIndex.js';

export function parseOpenAgentMentions(text: string): readonly IOpenAgentMention[] {
	const mentions: IOpenAgentMention[] = [];
	const re = /@(file|folder|git|codebase)(?:\(([^)]+)\))?/g;
	let match: RegExpExecArray | null;
	while ((match = re.exec(text)) !== null) {
		mentions.push({
			kind: match[1] as IOpenAgentMention['kind'],
			raw: match[0],
			arg: match[2],
		});
	}
	return mentions;
}
