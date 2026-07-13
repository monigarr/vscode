/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/common/modelClasses.ts
 * PURPOSE: MES model class constants for Open-Agent routing (not vendor model IDs).
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-12
 * UPDATED: 2026-07-12
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   import { ModelClass, MODEL_CLASSES } from './modelClasses.js';
 *
 * DEPENDENCIES:
 * - MES AI/MODEL_ROUTING.md class taxonomy
 *
 * SECURITY:
 * - Restricted/sensitive workloads must use local_private (or subclasses), not cloud classes.
 *
 * RISK CLASS: R1
 *
 * DATA HANDLING:
 * - Classification: Internal
 * - AI processing eligibility: Classes encode residency intent for the router.
 *
 * AI NOTES:
 * - Feature code and agents shall reference classes, never raw provider model IDs.
 *
 * OBSERVABILITY:
 * - Every model.call log must include the resolved model class.
 * =============================================================================
 */

export const MODEL_CLASSES = {
	fastCheap: 'class.fast_cheap',
	qualityBalanced: 'class.quality_balanced',
	qualityMax: 'class.quality_max',
	codeSpecialist: 'class.code_specialist',
	judge: 'class.judge',
	embed: 'class.embed',
	rerank: 'class.rerank',
	multimodal: 'class.multimodal',
	localPrivate: 'class.local_private',
	privateOnprem: 'class.private_onprem',
	sovereignCloud: 'class.sovereign_cloud',
} as const;

export type ModelClass = typeof MODEL_CLASSES[keyof typeof MODEL_CLASSES];

export function isModelClass(value: string): value is ModelClass {
	return (Object.values(MODEL_CLASSES) as string[]).includes(value);
}

export function isLocalPrivateClass(modelClass: ModelClass): boolean {
	switch (modelClass) {
		case MODEL_CLASSES.localPrivate:
		case MODEL_CLASSES.privateOnprem:
		case MODEL_CLASSES.sovereignCloud:
			return true;
		case MODEL_CLASSES.fastCheap:
		case MODEL_CLASSES.qualityBalanced:
		case MODEL_CLASSES.qualityMax:
		case MODEL_CLASSES.codeSpecialist:
		case MODEL_CLASSES.judge:
		case MODEL_CLASSES.embed:
		case MODEL_CLASSES.rerank:
		case MODEL_CLASSES.multimodal:
			return false;
		default: {
			const _exhaustive: never = modelClass;
			return _exhaustive;
		}
	}
}
