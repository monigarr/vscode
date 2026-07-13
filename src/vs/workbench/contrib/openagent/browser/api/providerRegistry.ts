/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/api/providerRegistry.ts
 * PURPOSE: Lookup registry for Model Gateway provider adapters by ProviderId.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-12
 * UPDATED: 2026-07-12
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   registry.register(adapter);
 *   const adapter = registry.get(PROVIDER_IDS.ollama);
 *
 * DEPENDENCIES:
 * - providers.IModelProviderAdapter
 *
 * SECURITY:
 * - Registry is internal to the gateway; do not expose adapters to UI modules.
 *
 * RISK CLASS: R1
 *
 * DATA HANDLING:
 * - Classification: Internal
 *
 * AI NOTES:
 * - New provider families register here; feature code still goes through IModelGatewayService.
 *
 * OBSERVABILITY:
 * - Missing adapter throws with provider id only.
 * =============================================================================
 */

import { IModelProviderAdapter, ProviderId } from '../../common/providers.js';

export class ProviderRegistry {
	private readonly _adapters = new Map<ProviderId, IModelProviderAdapter>();

	register(adapter: IModelProviderAdapter): void {
		this._adapters.set(adapter.id, adapter);
	}

	get(providerId: ProviderId): IModelProviderAdapter {
		const adapter = this._adapters.get(providerId);
		if (!adapter) {
			throw new Error(`Open-Agent Model Gateway: no adapter registered for provider '${providerId}'.`);
		}
		return adapter;
	}

	has(providerId: ProviderId): boolean {
		return this._adapters.has(providerId);
	}

	list(): readonly ProviderId[] {
		return [...this._adapters.keys()];
	}
}
