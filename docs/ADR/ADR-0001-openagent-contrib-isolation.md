# ADR-0001 — Open-Agent contrib isolation for upstream merge safety

**Status:** Accepted
**Date:** 2026-07-13
**Owner:** Monica Peters \<monigarr@MoniGarr.com\> / MoniGarr.com LLC
**Canonical Path:** `docs/ADR/ADR-0001-openagent-contrib-isolation.md`

---

## Context

Open-Agent is a long-lived downstream fork of `microsoft/vscode`. Custom AI features must not create large merge conflicts when pulling upstream. PRD non-functional requirements require isolation under `/src/vs/workbench/contrib/openagent/`.

## Decision

1. All Open-Agent product code **shall** live under `src/vs/workbench/contrib/openagent/`.
2. The only intentional core wiring is a side-effect import from `src/vs/workbench/workbench.common.main.ts`.
3. Prefer VS Code DI services (`IFileService`, `ITerminalService`, configuration registry, SecretStorage) over editing core editor/workbench layout modules.
4. UI surfaces **shall** call `IModelGatewayService` for model egress rather than vendor SDKs.

## Alternatives considered

- **Patch core inline completions / editor deeply** — rejected due to upstream merge cost.
- **Ship solely as a Marketplace extension** — rejected for v1 product vision (native fork surfaces); may revisit with ADR.

## Consequences

- Faster upstream merges; clearer ownership boundary for humans and AI agents.
- Some advanced interception features (provider priority inside core) are harder and must be designed carefully.
- Contributors must resist “quick” edits outside the contrib folder.
