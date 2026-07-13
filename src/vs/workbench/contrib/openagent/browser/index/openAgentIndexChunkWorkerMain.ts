/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/index/openAgentIndexChunkWorkerMain.ts
 * PURPOSE: ESM entrypoint for the Open-Agent index chunk web worker.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Loaded via WebWorkerDescriptor esmModuleLocation pointing at this Main.js.
 *
 * RISK CLASS: R0
 * =============================================================================
 */

import { create } from './openAgentIndexChunkWorker.js';
import { bootstrapWebWorker } from '../../../../../base/common/worker/webWorkerBootstrap.js';

bootstrapWebWorker(create);
