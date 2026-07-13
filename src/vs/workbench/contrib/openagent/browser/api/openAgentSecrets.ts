/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/api/openAgentSecrets.ts
 * PURPOSE: BYOK secret resolve/store via ISecretStorageService for Open-Agent.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-12
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   const key = await secrets.getOpenAiApiKey();
 *   await secrets.setAnthropicApiKey(value);
 *
 * DEPENDENCIES:
 * - ISecretStorageService
 * - openAgent secret key constants
 *
 * SECURITY:
 * - API keys never enter source, logs, or model context via this module.
 * - Empty string deletes the stored secret.
 *
 * RISK CLASS: R2
 *
 * DATA HANDLING:
 * - Classification: Secret credential
 *
 * AI NOTES:
 * - Only Model Gateway adapters may consume resolved keys.
 *
 * OBSERVABILITY:
 * - Log presence/absence of keys only — never values.
 * =============================================================================
 */

import { ISecretStorageService } from '../../../../../platform/secrets/common/secrets.js';
import { OPEN_AGENT_ANTHROPIC_API_KEY_SECRET, OPEN_AGENT_OPENAI_API_KEY_SECRET } from '../../common/openAgent.js';

export class OpenAgentSecrets {
	constructor(
		private readonly _secretStorageService: ISecretStorageService,
	) { }

	async getOpenAiApiKey(): Promise<string | undefined> {
		return this._secretStorageService.get(OPEN_AGENT_OPENAI_API_KEY_SECRET);
	}

	async setOpenAiApiKey(value: string): Promise<void> {
		if (!value) {
			await this._secretStorageService.delete(OPEN_AGENT_OPENAI_API_KEY_SECRET);
			return;
		}
		await this._secretStorageService.set(OPEN_AGENT_OPENAI_API_KEY_SECRET, value);
	}

	async deleteOpenAiApiKey(): Promise<void> {
		await this._secretStorageService.delete(OPEN_AGENT_OPENAI_API_KEY_SECRET);
	}

	async getAnthropicApiKey(): Promise<string | undefined> {
		return this._secretStorageService.get(OPEN_AGENT_ANTHROPIC_API_KEY_SECRET);
	}

	async setAnthropicApiKey(value: string): Promise<void> {
		if (!value) {
			await this._secretStorageService.delete(OPEN_AGENT_ANTHROPIC_API_KEY_SECRET);
			return;
		}
		await this._secretStorageService.set(OPEN_AGENT_ANTHROPIC_API_KEY_SECRET, value);
	}

	async deleteAnthropicApiKey(): Promise<void> {
		await this._secretStorageService.delete(OPEN_AGENT_ANTHROPIC_API_KEY_SECRET);
	}
}
