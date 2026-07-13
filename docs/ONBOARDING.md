# Open-Agent Onboarding

**Status:** Active
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Updated:** 2026-07-13
**Canonical Path:** `docs/ONBOARDING.md`
**See Also:** [`README.md`](README.md) · [`CONTRIBUTING.md`](CONTRIBUTING.md) · [`RUNBOOK.md`](RUNBOOK.md)

Day-1 path for humans and coding agents.

---

## Prerequisites

- Access to this repository (VS Code / Code OSS fork; work on branch **`dev`**)
- Node.js toolchain required by upstream VS Code build docs
- Optional local inference: [Ollama](https://ollama.com/) and/or [LM Studio](https://lmstudio.ai/docs/app) (+ [LM Link](https://lmstudio.ai/link) for remote-local)
- Optional BYOK: OpenAI-compatible and/or Anthropic keys in SecretStorage
- Read MES agent contract: [`../MoniGarr_Engineering_Standards/CLAUDE.md`](../MoniGarr_Engineering_Standards/CLAUDE.md)

## Truth model (30 seconds)

| Question | Doc |
|----------|-----|
| What exists today? | [`current/`](current/) |
| What are we building? | [`target/`](target/) |
| Progress? | [`current/IMPLEMENTATION_STATUS.md`](current/IMPLEMENTATION_STATUS.md) |
| How do I enable it? | [`RUNBOOK.md`](RUNBOOK.md) |

Waves 0–4 are Implemented as of 2026-07-13 — still verify claims against code before treating a detail as shipped.

---

## Day 1 — Software engineer

1. Read [`README.md`](README.md) (hub + truth model + branch policy).
2. Skim [`target/PRD.md`](target/PRD.md) for product intent (do not treat as shipped line-by-line).
3. Read [`current/ARCHITECTURE.md`](current/ARCHITECTURE.md) and [`current/IMPLEMENTATION_STATUS.md`](current/IMPLEMENTATION_STATUS.md).
4. Open `src/vs/workbench/contrib/openagent/` — start at `browser/openagent.contribution.ts`.
5. Note allowed outside-contrib wiring: `workbench.common.main.ts`, `workbench.desktop.main.ts`, `sharedProcessMain.ts` (ADR-0001 / ADR-0003).
6. Follow [`TESTING.md`](TESTING.md) / [`VERIFY.md`](VERIFY.md) for a first safe verification.
7. First safe change: docs typo or a unit test under `openagent/test/` (no provider network required for most unit tests).

## Day 1 — Project / product manager

1. Read [`target/PRD.md`](target/PRD.md) and [`target/ROADMAP.md`](target/ROADMAP.md).
2. Compare against [`current/FEATURES.md`](current/FEATURES.md) and the status matrix.
3. Use status language only: Implemented / Partial / Stub / Missing.
4. Escalate product decisions to humans — AI agents do not own roadmap priority.

## Day 1 — Operator

1. Build/run Code OSS from this repo on **`dev`**.
2. Follow [`RUNBOOK.md`](RUNBOOK.md): set `openagent.enabled`, pick LM Studio / Ollama / LM Link / BYOK.
3. Confirm health-check notification after **Open-Agent: Select Model Profile**.

## Day 1 — AI coding agent

1. Load [`../MoniGarr_Engineering_Standards/CLAUDE.md`](../MoniGarr_Engineering_Standards/CLAUDE.md) and [`AI_ENGINEERING_GUIDELINES.md`](AI_ENGINEERING_GUIDELINES.md).
2. Respect Risk Class and fail-closed `openagent.enabled`.
3. Prefer editing only `src/vs/workbench/contrib/openagent/` (+ allowed wiring files if unavoidable).
4. Every new/changed `.ts` file **shall** carry a MES header with AUTHOR email and `USAGE` — see [`CONTRIBUTING.md`](CONTRIBUTING.md).
5. When behavior changes, update `current/` docs and status in the same change set.
6. Do not invent shipped features; check [`current/IMPLEMENTATION_STATUS.md`](current/IMPLEMENTATION_STATUS.md).
7. Sync policy: upstream → `main` → merge into `dev`; never merge `dev` into `main`.

## Architecture tour

| Concern | Where |
|---------|-------|
| Trust / fail-closed | `openagent.enabled` default false; [`SECURITY.md`](SECURITY.md) |
| Profile → routing | `openagent.openai.profileId` override in gateway; [`current/API.md`](current/API.md) |
| Deterministic vs intelligence | Gateway + routing are deterministic policy; model output is probabilistic |
| Secrets | SecretStorage keys in `common/openAgent.ts` |
| Telemetry | [`../src/vs/workbench/contrib/openagent/TELEMETRY.md`](../src/vs/workbench/contrib/openagent/TELEMETRY.md) |
| Prompts / evals | Evolving; follow MES [`AI/`](../MoniGarr_Engineering_Standards/AI/) when adding evals |

## First safe change

Suggested starter: improve a unit test assertion or a `USAGE` header example under `contrib/openagent/`, with PR checklist from [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`VERIFY.md`](VERIFY.md).
