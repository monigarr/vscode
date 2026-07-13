# ADR-0002 — Split as-built docs (`current/`) from target docs (`target/`)

**Status:** Accepted
**Date:** 2026-07-13
**Owner:** Monica Peters \<monigarr@MoniGarr.com\> / MoniGarr.com LLC
**Canonical Path:** `docs/ADR/ADR-0002-docs-current-vs-target.md`

---

## Context

Open-Agent evolves rapidly with AI coding agents. Mixing aspirational PRD/architecture with as-built behavior causes documentation drift and false “shipped” claims. MES requires evidence-based status language.

## Decision

1. Maintain `docs/current/` as the **as-built** source of truth (must match code).
2. Maintain `docs/target/` as the **aspirational** PRD, architecture, and roadmap.
3. Measure progress in `docs/current/IMPLEMENTATION_STATUS.md` using Implemented | Partial | Stub | Missing.
4. Keep repository-root `PRD.md` / `ARCHITECTURE.md` as thin pointers to `docs/target/` (and current architecture pointer) to avoid dual SoT.

## Alternatives considered

- **Single ARCHITECTURE.md** mixing target and current — rejected; high drift risk under agentic edits.
- **Docs only in MES suite** — rejected; product needs a local onboarding pack for this fork.

## Consequences

- Contributors and agents always know which question a doc answers.
- Slightly more files to update when intent and implementation both change.
- Enables measurable migration of features from target → current.
