# ADR-0001: Intentional single-file Architecture handbook

**Status:** Accepted  
**Date:** 2026-07-12  
**Deciders:** Suite Owner (MoniGarr Engineering)  
**Consulted:** Architecture maintainers  
**Tags:** documentation | maintainability | architecture | mes  
**Supersedes:** —  
**Superseded by:** —  
**Related:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) · [`../MDES.md`](../MDES.md) · [`MES_REVIEW_PROCESS.md`](MES_REVIEW_PROCESS.md) · [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md)

---

## Context

[`Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) is a large Parts I–XX handbook (~3,900 lines). Residual maintainability finding R1 (constitutional MDES/MCR, 2026-07-12) noted monolith risk. Splitting Parts into separate files would be a structural change with broad cross-reference impact.

MDES Maintainability score **10** requires intentional structure, ownership, and update discipline—not necessarily physical file fragmentation.

## Decision

**Keep a single published handbook file** `Architecture/ARCHITECTURE.md` as the Architecture source of truth for MES v1.1.x.

Maintainability controls (normative):

1. **Ownership banners** on each Part (Canonical owner + link-to-owner).  
2. **Link-to-owner** — engineering/AI procedural depth lives in `Engineering/*` and `AI/*`; the handbook summarizes and points.  
3. **Quarantine** — `Architecture/_part_*.md` remain build fragments, not published SoT; `scripts/check-fragment-citations.ps1` enforces this.  
4. **Version policy** — handbook MES version tracks suite PATCH/MINOR; Material Part edits require MDES + MCR per [`MES_REVIEW_PROCESS.md`](MES_REVIEW_PROCESS.md).

## Consequences

### Positive

- One navigable SoT for agents and humans.  
- Avoids dual-SoT drift between split Part files and an index.  
- Closes R1 for Excellence scoring without introducing new architectural concepts.

### Negative / residual

- Large-file editing friction remains.  
- Future split may still be justified by measured maintainability data (edit conflict rate, review latency).

## Alternatives considered

| Alternative | Why not now |
|-------------|-------------|
| Light split (high-churn Parts → owned files) | Cross-ref churn; deferred to MES v1.2 backlog with closure criteria |
| Full Part-by-Part split | Largest change set; expands surface area beyond constitutional convergence |

## Closure criteria for revisiting (MES v1.2 backlog)

Reopen split only if **two or more** hold:

- Repeated Material MCR findings caused by handbook merge conflicts or Part dual-edits  
- Measured review latency for Architecture PRs exceeds suite norms for two consecutive MINORs  
- Suite Owner explicitly prioritizes split in a versioned release plan

## Compliance

This ADR is **Accepted** and binding for MES v1.1.x. Deviations require a superseding ADR.
