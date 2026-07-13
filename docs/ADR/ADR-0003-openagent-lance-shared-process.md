# ADR-0003 — Shared-process Lance vector store channel (minimal outside-contrib wiring)

**Status:** Accepted
**Date:** 2026-07-13
**Owner:** Monica Peters \<monigarr@MoniGarr.com\> / MoniGarr.com LLC
**Canonical Path:** `docs/ADR/ADR-0003-openagent-lance-shared-process.md`

---

## Context

PRD §3.1 requires a local vector database (LanceDB) in the product path. LanceDB is a Node native module and must not be imported from the browser workbench layer. ADR-0001 requires Open-Agent product code under `contrib/openagent/`, with minimal core wiring.

## Decision

1. Implement `LanceVectorStore` and `OpenAgentVectorStoreRemoteService` under `contrib/openagent/node/`.
2. Expose `IOpenAgentVectorStoreRemote` over the shared-process channel `openAgentVectorStore`.
3. Allow **two** outside-contrib touch points (same pattern as chat `ILocalGitService`):
   - Register service + channel in `code/electron-utility/sharedProcess/sharedProcessMain.ts`
   - Side-effect import `contrib/openagent/electron-browser/openAgentVectorStore.contribution.ts` from `workbench.desktop.main.ts`
4. Browser `VectorStoreService` prefers the remote when registered; otherwise durable JSON / memory fallback (web + tests).

## Alternatives considered

- **JSON-only forever** — rejected; PRD requires Lance in product path when native module is available.
- **Extension-host native** — rejected for v1; shared process already hosts Node services and matches git IPC.

## Consequences

- Desktop builds can use Lance (or node JSON fallback inside LanceVectorStore).
- Future upstream merges must re-apply the two wiring lines if conflicted; keep them tiny and documented.
- Web/browser unit tests continue without Lance.
