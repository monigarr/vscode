# Open-Agent VERIFY Checklist

**Status:** Active
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Updated:** 2026-07-13
**Canonical Path:** `docs/VERIFY.md`
**See Also:** [`TESTING.md`](TESTING.md) · [`RUNBOOK.md`](RUNBOOK.md)

Local / PR verification before claiming an Open-Agent change is ready.

---

## Mandatory (every Open-Agent PR)

- [ ] Changes confined to `src/vs/workbench/contrib/openagent/` (and docs), except intentional wiring: `workbench.common.main.ts`, `workbench.desktop.main.ts` (Lance contrib import), and `sharedProcessMain.ts` channel (ADR-0003)
- [ ] MES file headers present: AUTHOR with `monigarr@MoniGarr.com`, PURPOSE, USAGE example
- [ ] `docs/current/` updated if user-visible or API behavior changed
- [ ] `docs/current/IMPLEMENTATION_STATUS.md` updated if a PRD gap closed or opened
- [ ] No secrets committed
- [ ] Unit tests added/updated for logic changes; relevant openagent tests run locally
- [ ] Routing eval: `test/browser/routingEval.test.ts` green when touching routing/profiles
- [ ] Profile override: `modelGatewayService.test.ts` LM Studio local_private / embed / code_specialist cases green when touching gateway routing
- [ ] `applyPatch.test.ts` green when touching `common/applyPatch.ts` or agent `apply_patch`

## 2026-07-13 PRD closure note

Unit tests for profile-driven LM Studio routing, `applyUnifiedDiff`, and production mention parsing were added under `src/vs/workbench/contrib/openagent/test/browser/`. This machine did not have `node_modules` installed during the closure pass — re-run after `npm ci` / `npm install`:

```bash
npm run test-browser-no-install -- --grep Open-Agent
```

(or the repo’s equivalent mocha filter for `openagent/test/browser`).

## Gateway / provider PRs

- [ ] Fail-closed when `openagent.enabled` is false
- [ ] No API key on request DTOs or logs
- [ ] Circuit breaker / timeout behavior covered or manually verified

## UI PRs (chat / inline / composer)

- [ ] Feature flags respected
- [ ] Manual smoke: enable Open-Agent, send one local or BYOK request
- [ ] Diff/accept paths do not auto-write without user action (Composer)

## Agent PRs

- [ ] Max steps enforced
- [ ] HITL required for write_file / apply_patch / run_terminal
- [ ] Terminal tool bounded by `openagent.agent.terminalTimeoutMs`

## Docs-only PRs

- [ ] `current/` claims match code
- [ ] `target/` changes do not silently rewrite as-built status

## Inline performance (optional measurement)

- [ ] With a healthy local model, note p95 time from idle → first ghost-text delta; target under 150ms debounce path (`openagent.inline.debounceMs` default 100)

## Privacy distribution

- [ ] `product.json` has `enableTelemetry: false` for Open-Agent privacy builds
- [ ] TELEMETRY.md / SECURITY / RUNBOOK match ADR-0004 (no core telemetry deletion)
