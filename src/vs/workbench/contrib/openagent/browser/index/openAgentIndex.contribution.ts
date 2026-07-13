/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/index/openAgentIndex.contribution.ts
 * PURPOSE: Register context index + vector store singletons.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Side-effect imported from openagent.contribution.ts; registers index service singleton.
 *
 * SECURITY:
 * - Index gated by openagent.enabled / openagent.index.enabled.
 *
 * RISK CLASS: R1
 *
 * AI NOTES:
 * - Registers context index singleton for mentions and @codebase.
 * =============================================================================
 */

import { InstantiationType, registerSingleton } from '../../../../../platform/instantiation/common/extensions.js';
import { IContextIndexService } from '../../common/contextIndex.js';
import { IVectorStoreService } from '../../common/vectorStore.js';
import { VectorStoreService } from '../vectorStoreService.js';
import { ContextIndexService } from './contextIndexService.js';

registerSingleton(IVectorStoreService, VectorStoreService, InstantiationType.Delayed);
registerSingleton(IContextIndexService, ContextIndexService, InstantiationType.Delayed);
