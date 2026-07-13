# Implementation Status: Open-Agent vs PRD

**Status:** Current (progress SoT)
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Canonical Path:** `docs/current/IMPLEMENTATION_STATUS.md`
**Updated:** 2026-07-13
**See Also:** [`../target/PRD.md`](../target/PRD.md) · [`../target/ROADMAP.md`](../target/ROADMAP.md) · [`FEATURES.md`](FEATURES.md)

> Status vocabulary: **Implemented** | **Partial** | **Stub** | **Missing**. Claims require code evidence under `src/vs/workbench/contrib/openagent/`.

---

## Summary matrix

| PRD pillar | Status | Headline |
|------------|--------|----------|
| 3.1 Indexing & `@` mentions | **Implemented** | Symbol chunking on web worker; watchers; `@git` with bounded SCM diffs; Lance IPC + JSON fallback |
| 3.2 Inline ghost text | **Implemented** | Streaming `stream()`; debounce default 100ms; `groupId`/`excludesGroupIds` |
| 3.3 Chat & Composer | **Implemented** | Chat OK; Composer ViewPane hunk HITL synced to TextDiffEditor models |
| 3.4 Agent loop | **Implemented** | HITL on write/shell/patch; real unified-diff `apply_patch`; terminal `onData`; `/agent` |
| 3.5 BYOK gateway | **Implemented** | Profile picker drives local/embed/code_specialist routing; LM Studio base URL + health check |
| 4 Maintainability isolation | **Implemented** | Contrib isolation; ADR-0003 minimal shared-process wiring |
| 4 Autocomplete \<150ms + workers | **Implemented** | Debounce 100ms + streaming; chunking on `IWebWorkerService` worker (embed/upsert remain host-side by design) |
| 4 Telemetry / privacy | **Implemented** | No outbound by default (`product.json` `enableTelemetry: false`); local `model.call`; upstream code intact (ADR-0004) |

---

## Gaps closed (2026-07-13 PRD closure)

| Gap | Evidence |
|-----|----------|
| Profile picker did not drive egress | `modelGatewayService._buildCandidates` + `shouldOverrideProfilePin` |
| LM Studio base URL ignored | `_baseUrlFor` reads `openagent.openai.baseUrl` for lmstudio/lmlink/etc. |
| Health checks unused | `openAgentSettingsCommands` probes `/models` after pick |
| LM Studio embeddings Partial | Embed class follows selected local profile; tests in `modelGatewayService.test.ts` |
| `@git` paths only | `_buildGitContext` adds bounded diffs via `getOriginalResource` / multi-diff URIs |
| Composer diff buffers detached | `IModelService` models shared with opened diff editors |
| `apply_patch` aliased write | `common/applyPatch.ts` + agent tool path |

### Follow-ups (not blockers)

- Re-assert `enableTelemetry: false` if upstream `product.json` merge conflicts.
- Optional: move embed batching further off-host if latency requires it.
- Run `npm run test-browser-no-install -- --grep Open-Agent` after installing deps (VERIFY).

---

## Wiring evidence

- Workbench import: `workbench.common.main.ts` → `contrib/openagent/browser/openagent.contribution.js`
- Desktop Lance: `workbench.desktop.main.ts` → `contrib/openagent/electron-browser/openAgentVectorStore.contribution.js`
- Shared process: `sharedProcessMain.ts` channel `openAgentVectorStore` (ADR-0003)

## How to update this file

When a PRD gap closes, update the pillar row to **Implemented**, list evidence files, remove the gap, and sync [`../target/ROADMAP.md`](../target/ROADMAP.md). Never mark Implemented without code.
