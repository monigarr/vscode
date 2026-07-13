/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/electron-browser/openAgentVectorStore.contribution.ts
 * PURPOSE: Register shared-process remote proxy for Lance vector store (desktop only).
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Side-effect imported from workbench.desktop.main.ts.
 *
 * SECURITY:
 * - Desktop-only wiring; web builds keep JSON fallback in VectorStoreService.
 *
 * RISK CLASS: R2
 *
 * AI NOTES:
 * - Pairs with sharedProcessMain channel registration (ADR-0003).
 * =============================================================================
 */

import { registerSharedProcessRemoteService } from '../../../../platform/ipc/electron-browser/services.js';
import { IOpenAgentVectorStoreRemote, OPEN_AGENT_VECTOR_STORE_CHANNEL } from '../common/openAgentVectorStoreRemote.js';

registerSharedProcessRemoteService(IOpenAgentVectorStoreRemote, OPEN_AGENT_VECTOR_STORE_CHANNEL);
