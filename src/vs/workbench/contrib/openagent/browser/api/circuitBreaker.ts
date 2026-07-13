/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/browser/api/circuitBreaker.ts
 * PURPOSE: Per-route circuit breaker for Model Gateway provider failover.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-12
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   if (!breaker.allow(circuitKey)) { try fallback }
 *   breaker.recordSuccess(circuitKey) / recordFailure(circuitKey)
 *
 * DEPENDENCIES:
 * - None
 *
 * SECURITY:
 * - Failures must not include secret material in stored state.
 *
 * RISK CLASS: R1
 *
 * DATA HANDLING:
 * - Classification: Internal (provider health only)
 *
 * AI NOTES:
 * - Keys are protocol or protocol:profile (see circuitKeyFor).
 *
 * OBSERVABILITY:
 * - Callers should log open/half-open transitions with circuit key.
 *
 * PERFORMANCE:
 * - O(1) lookups; in-memory only.
 * =============================================================================
 */

export type CircuitState = 'closed' | 'open' | 'half_open';

interface ICircuitEntry {
	failures: number;
	state: CircuitState;
	openedAtMs: number;
}

export interface ICircuitBreakerOptions {
	readonly failureThreshold: number;
	readonly resetTimeoutMs: number;
}

const DEFAULT_OPTIONS: ICircuitBreakerOptions = {
	failureThreshold: 3,
	resetTimeoutMs: 30_000,
};

export class CircuitBreaker {
	private readonly _entries = new Map<string, ICircuitEntry>();
	private readonly _options: ICircuitBreakerOptions;

	constructor(options?: Partial<ICircuitBreakerOptions>) {
		this._options = { ...DEFAULT_OPTIONS, ...options };
	}

	allow(circuitKey: string, nowMs: number = Date.now()): boolean {
		const entry = this._entries.get(circuitKey);
		if (!entry || entry.state === 'closed') {
			return true;
		}
		if (entry.state === 'open') {
			if (nowMs - entry.openedAtMs >= this._options.resetTimeoutMs) {
				entry.state = 'half_open';
				return true;
			}
			return false;
		}
		return true;
	}

	recordSuccess(circuitKey: string): void {
		this._entries.set(circuitKey, { failures: 0, state: 'closed', openedAtMs: 0 });
	}

	recordFailure(circuitKey: string, nowMs: number = Date.now()): void {
		const existing = this._entries.get(circuitKey) ?? { failures: 0, state: 'closed' as CircuitState, openedAtMs: 0 };
		const failures = existing.failures + 1;
		if (failures >= this._options.failureThreshold || existing.state === 'half_open') {
			this._entries.set(circuitKey, { failures, state: 'open', openedAtMs: nowMs });
			return;
		}
		this._entries.set(circuitKey, { failures, state: 'closed', openedAtMs: 0 });
	}

	getState(circuitKey: string): CircuitState {
		return this._entries.get(circuitKey)?.state ?? 'closed';
	}
}
