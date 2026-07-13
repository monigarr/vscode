# Contributing to Open-Agent

**Status:** Active
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Updated:** 2026-07-13
**Canonical Path:** `docs/CONTRIBUTING.md`
**See Also:** [`../MoniGarr_Engineering_Standards/Governance/CONTRIBUTING.md`](../MoniGarr_Engineering_Standards/Governance/CONTRIBUTING.md) · [`VERIFY.md`](VERIFY.md) · [`ENGINEERING_STANDARDS.md`](ENGINEERING_STANDARDS.md)

---

## Branch & sync policy

| Rule | Detail |
|------|--------|
| Feature branch | Do Open-Agent work on **`dev`** (or a topic branch merged into `dev`) |
| Mirror branch | **`main`** tracks upstream Microsoft VS Code only |
| Sync direction | `upstream/main` → local `main` → `origin/main` → **merge into `dev`** |
| Forbidden | Merging `dev` into `main` (keeps the upstream mirror clean) |

On conflict while merging `main` into `dev`, preserve:

- `product.json` → `"enableTelemetry": false`
- Open-Agent import at end of `workbench.common.main.ts`
- Lance wiring in `workbench.desktop.main.ts` and `sharedProcessMain.ts`

## Scope of contributions

Prefer changes inside:

```text
src/vs/workbench/contrib/openagent/
docs/
```

Allowed minimal core touch (ADR-0001 / ADR-0003):

- `src/vs/workbench/workbench.common.main.ts` — contrib side-effect import
- `src/vs/workbench/workbench.desktop.main.ts` — desktop Lance contrib import
- `src/vs/code/electron-utility/sharedProcess/sharedProcessMain.ts` — vector store IPC channel

Avoid editing `src/vs/editor/common/` or core workbench layout files. Use DI services instead ([ADR-0001](ADR/ADR-0001-openagent-contrib-isolation.md)).

## Documentation dual-update

| Change type | Update |
|-------------|--------|
| Ship / change behavior | `docs/current/*` + status matrix |
| Change product intent | `docs/target/PRD.md` or `ARCHITECTURE.md` + roadmap |
| Architectural decision | New/superseding ADR under `docs/ADR/` |

Do not write aspirational text into `docs/current/`.

## MES code comment headers (required)

Every Open-Agent `.ts` file **shall** start with a MES header per [`../MoniGarr_Engineering_Standards/Templates/CODE_COMMENT_HEADER_TEMPLATE.md`](../MoniGarr_Engineering_Standards/Templates/CODE_COMMENT_HEADER_TEMPLATE.md).

Required identity fields:

```text
OWNER: MoniGarr.com LLC
AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
```

**USAGE is mandatory** — include a concrete import, DI injection, side-effect import, or test invocation example so humans and AI agents can onboard from the file itself.

Also include: `PURPOSE`, `CREATED`, `UPDATED`, `DEPENDENCIES`, `SECURITY`, `RISK CLASS` (AI modules), `DATA HANDLING` / `AI NOTES` when applicable.

## PR checklist

Use [`VERIFY.md`](VERIFY.md). Humans remain accountable for merge decisions.

## AI agents

Follow [`AI_ENGINEERING_GUIDELINES.md`](AI_ENGINEERING_GUIDELINES.md) and MES `CLAUDE.md`. Do not silently broaden tool permissions or weaken fail-closed defaults.
