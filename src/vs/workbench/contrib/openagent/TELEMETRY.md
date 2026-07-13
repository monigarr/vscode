/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/TELEMETRY.md
 * PURPOSE: Open-Agent telemetry posture (local-only; outbound off by default).
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Product reference for Open-Agent telemetry; linked from docs/SECURITY.md and docs/RUNBOOK.md.
 * =============================================================================
 */

# Open-Agent Telemetry

**See Also:** [`docs/SECURITY.md`](../../../../../docs/SECURITY.md) · [`docs/RUNBOOK.md`](../../../../../docs/RUNBOOK.md) · [`docs/ADR/ADR-0004-telemetry-privacy-posture.md`](../../../../../docs/ADR/ADR-0004-telemetry-privacy-posture.md) · [`docs/current/API.md`](../../../../../docs/current/API.md)

## Privacy guarantee (PRD §4)

Open-Agent performs **no outbound telemetry by default**. Local logging is used for diagnostics. Any outbound product telemetry requires **explicit user / distributor opt-in** and is **disabled in Open-Agent distributions**.

Upstream Code OSS telemetry *infrastructure* remains in the tree for mergeability (ADR-0004). It is not deleted.

## Product distribution default

| Control | Open-Agent value | Effect |
|---------|------------------|--------|
| `product.json` → `enableTelemetry` | `false` | Product gate disables outbound telemetry for built distributions |
| Setting `telemetry.telemetryLevel` | Prefer `off` | Operator confirmation; see RUNBOOK |
| Open-Agent `model.call` | Local `ILogService` only | Never uploads prompts, completions, or API keys |

## Open-Agent feature slice

Open-Agent feature code emits **local redacted logs only** via `ILogService`:

- Event name: `model.call`
- Includes: gateway request id, routing metadata, provider/profile ids, latency, token counts, success/error codes
- **Never** includes: prompts, completions, API keys, Authorization headers, raw file contents

There is **no remote upload** path in `contrib/openagent/`.

## Explicit opt-in (not the default)

To enable upstream product telemetry in a custom build (not recommended for privacy deployments):

1. Set `enableTelemetry` to `true` in a branded `product.json` (and supply any required AI/Aria keys per Code OSS).
2. Ensure `telemetry.telemetryLevel` is not `off`.
3. Document the change for operators — never silently re-enable in Open-Agent privacy SKUs.

## Feature flags

| Key | Default | Purpose |
|-----|---------|---------|
| `openagent.enabled` | `false` | Master gateway gate |
| `openagent.chat.enabled` | `true` | Chat sidebar |
| `openagent.inline.enabled` | `true` | Ghost-text completions |
| `openagent.index.enabled` | `true` | Workspace indexing |
| `openagent.composer.enabled` | `true` | Multi-file Composer |
| `openagent.agent.enabled` | `true` | Autonomous tool loop |
