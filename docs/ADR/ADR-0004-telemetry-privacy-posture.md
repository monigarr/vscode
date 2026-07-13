# ADR-0004 — Upstream telemetry posture (sync-safe privacy)

**Status:** Accepted
**Date:** 2026-07-13
**Owner:** Monica Peters \<monigarr@MoniGarr.com\> / MoniGarr.com LLC
**Canonical Path:** `docs/ADR/ADR-0004-telemetry-privacy-posture.md`

---

## Context

PRD §4 requires that Open-Agent perform no outbound telemetry by default, use local logging for diagnostics, and require explicit opt-in for any outbound telemetry. Deleting the Code OSS `platform/telemetry` stack creates large merge conflicts with `main` and violates the sync policy (upstream → main → dev only).

## Decision

1. **Open-Agent slice:** Local redacted `model.call` logs only (`OpenAgentTelemetry` → `ILogService`). No remote upload from `contrib/openagent/`.
2. **Upstream telemetry code:** Do **not** delete or rewrite core telemetry modules. Preserve mergeability with microsoft/vscode.
3. **Open-Agent distribution default:** `product.json` sets `"enableTelemetry": false` so built Open-Agent / Code-OSS privacy distributions ship with product telemetry disabled at the product gate (`supportsTelemetry` / `IProductService.enableTelemetry`).
4. **Operator opt-in:** Users who want product telemetry must explicitly enable it (e.g. set `telemetry.telemetryLevel` away from `off` **and** rebuild/rebrand with `enableTelemetry: true`). Documented in SECURITY + RUNBOOK + TELEMETRY.md.
5. PRD wording prefers the privacy *behavior* guarantee over “strip source,” matching this ADR.

## Alternatives considered

- **Strip all telemetry sources** — rejected for merge/sync cost.
- **Marketplace extension only** — rejected for native fork vision (ADR-0001).

## Consequences

- Open-Agent distributions are fail-closed for outbound product telemetry by default.
- Docs must not claim “telemetry fully removed from the fork.”
- Upstream merges may need to re-assert `enableTelemetry: false` in `product.json` if conflicted.
