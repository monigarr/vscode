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
| 3.1 Indexing & `@` mentions | **Implemented** | Symbol chunking on web worker; watchers; `@git` via SCM; Lance IPC + JSON fallback |
| 3.2 Inline ghost text | **Implemented** | Streaming `stream()`; debounce default 100ms; `groupId`/`excludesGroupIds` |
| 3.3 Chat & Composer | **Implemented** | Chat OK; Composer ViewPane with per-hunk Accept/Reject |
| 3.4 Agent loop | **Implemented** | HITL on write/shell; terminal `onData`; `/agent` in chat; stall escalation |
| 3.5 BYOK gateway | **Implemented** | LM Link + LM Studio picker; HF/Kaggle-compatible profiles |
| 4 Maintainability isolation | **Implemented** | Contrib isolation; ADR-0003 minimal shared-process wiring |
| 4 Autocomplete \<150ms + workers | **Implemented** | Debounce 100ms + streaming; chunking on `IWebWorkerService` worker (embed/upsert remain host-side by design) |
| 4 Telemetry / privacy | **Implemented** | No outbound by default (`product.json` `enableTelemetry: false`); local `model.call`; upstream code intact (ADR-0004); PRD wording revised |

---

## Waves 1–4 verification (2026-07-13)

Static evidence check (no rewrite). Unit harness not executed in this pass — `node_modules` absent; re-run `npm run test-browser` targeting `openagent/test/browser` after install.

| Pillar | Code evidence | Tests | Docs |
|--------|---------------|-------|------|
| 3.1 | `chunker.ts`, `openAgentIndexChunkClient.ts`, `contextIndexService.ts`, Lance remote | `chunker.test.ts`, `indexChunkWorkerContract.test.ts` | FEATURES / ARCHITECTURE |
| 3.2 | `openAgentInlineCompletions.ts` (`stream`, `groupId`, debounce 100) | provider/gateway suites | FEATURES |
| 3.3 | `openAgentComposerViewPane.ts`, `composerService.acceptHunk` | `composerHunks.test.ts` | FEATURES |
| 3.4 | `agentLoopService.ts` HITL + `onData`; chat `/agent` | — | SECURITY / FEATURES |
| 3.5 | `profiles.ts` lmlink/kaggle; `openAgentSettingsCommands.ts` | `routingEval.test.ts` | RUNBOOK |
| Isolation | `workbench.common.main.ts`, `workbench.desktop.main.ts`, `sharedProcessMain.ts` only | — | ADR-0001 / 0003 |
| Telemetry | `product.json` `enableTelemetry: false`; `OpenAgentTelemetry` | — | ADR-0004 / TELEMETRY.md |

### Follow-ups (not blockers)

- Re-assert `enableTelemetry: false` if upstream `product.json` merge conflicts.
- Optional: move embed batching further off-host if latency requires it (chunk worker already satisfies PRD “heavy processing” for indexing transforms).

---

## 3.1 Deep IDE Workspace Indexing & Semantic Search

| Field | Value |
|-------|-------|
| **Status** | Implemented |
| **Key files** | `browser/index/contextIndexService.ts`, `chunker.ts`, `openAgentIndexChunkClient.ts`, `openAgentIndexChunkWorker*.ts`, `browser/vectorStoreService.ts`, `node/lanceVectorStore.ts`, `node/openAgentVectorStoreRemoteService.ts`, `electron-browser/openAgentVectorStore.contribution.ts` |
| **Evidence** | Document-symbol chunking on web worker (sync fallback); file watchers; `@git` from SCM; Lance via shared-process (ADR-0003) |

## 3.2 Native Inline Code Generation

| Field | Value |
|-------|-------|
| **Status** | Implemented |
| **Key files** | `browser/inline/openAgentInlineCompletions.ts` |
| **Evidence** | Gateway `stream()` + `onDidChangeInlineCompletions`; `debounceDelayMs` default 100; provider priority via public APIs |

## 3.3 Embedded AI Chat & Multi-File Composer

| Field | Value |
|-------|-------|
| **Status** | Implemented |
| **Key files** | `browser/chat/*`, `browser/composer/openAgentComposerViewPane.ts`, `browser/composer/composerService.ts` |
| **Evidence** | Composer view registered; per-hunk accept/reject; Ctrl/Cmd+I focuses Composer |

## 3.4 Autonomous Agent Execution Loop

| Field | Value |
|-------|-------|
| **Status** | Implemented |
| **Key files** | `browser/agent/agentLoopService.ts`, `browser/chat/openAgentChatViewPane.ts`, `common/agentLoop.ts` |
| **Evidence** | HITL for write/shell; terminal `onData` capture; chat `/agent`; max steps + stall escalate |

## 3.5 Pluggable BYOK & Local AI Gateway

| Field | Value |
|-------|-------|
| **Status** | Implemented |
| **Key files** | `common/profiles.ts`, `browser/openAgentSettingsCommands.ts`, gateway/providers |
| **Evidence** | `lmlink` + `kaggle_compatible`; F1 profile / LM Link commands |

## §4 Telemetry / privacy

| Field | Value |
|-------|-------|
| **Status** | Implemented (revised PRD meaning) |
| **Key files** | `product.json` (`enableTelemetry: false`), `browser/api/openAgentTelemetry.ts`, `TELEMETRY.md`, ADR-0004 |
| **Evidence** | Outbound off by default for Open-Agent distributions; local diagnostics only; upstream telemetry sources not deleted |

---

## Wiring evidence

- Workbench import: `workbench.common.main.ts` → `contrib/openagent/browser/openagent.contribution.js`
- Desktop Lance: `workbench.desktop.main.ts` → `contrib/openagent/electron-browser/openAgentVectorStore.contribution.js`
- Shared process: `sharedProcessMain.ts` channel `openAgentVectorStore` (ADR-0003)

## How to update this file

When a PRD gap closes, update the pillar row to **Implemented**, list evidence files, remove the gap, and sync [`../target/ROADMAP.md`](../target/ROADMAP.md). Never mark Implemented without code.
