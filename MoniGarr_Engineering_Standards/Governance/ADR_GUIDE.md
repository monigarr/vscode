# Architecture Decision Records (ADR) Guide

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All Products, Services, Repositories, AI Agents  
**Canonical Path:** `Governance/ADR_GUIDE.md`  
**See Also:** [`MOM.md`](MOM.md) · [`MILE.md`](MILE.md) · [`CONTRIBUTING.md`](CONTRIBUTING.md) · [`MES_REVIEW_PROCESS.md`](MES_REVIEW_PROCESS.md) · [`ADRS/README.md`](ADRS/README.md) · [`../MDES.md`](../MDES.md) · [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) · [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`MOM.md`](MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

This guide defines how MoniGarr records, reviews, supersedes, and navigates Architecture Decision Records (ADRs).

ADRs are the durable memory of *why* the system is the way it is. Code shows *what*. ADRs preserve intent, rejected alternatives, and consequences so future humans and AI agents can change systems without re-learning history from chat logs.

---

## When an ADR Is Required

Write an ADR when a decision is:

| Trigger | Examples |
|---------|----------|
| Structural | New service boundary, monorepo vs multi-repo, sync vs async integration |
| Technological | Language/runtime, primary datastore, message bus, auth protocol |
| Security / trust | Trust boundary, secret store, encryption approach, AI tool policy |
| AI platform | Model routing, RAG vs GraphRAG default, agent team topology, eval gate thresholds |
| Operational | Hosting platform, CI/CD shape, backup/DR strategy, on-call model |
| Conformance | Any intentional deviation from MES, M.O.M., or M.I.L.E. |
| Regulatory / privacy | Authorization boundary change, data classification posture, privacy impact, accessibility impact |
| Documentation / SoT | Terminology conflicts, MDES criterion changes, Material MCR contradictions between MES documents |

Do **not** require an ADR for trivial local refactors, typo fixes, or choices fully constrained by an existing accepted ADR.

**Rule:** If a future engineer would ask “why did we do it this way?” — record an ADR.

---

## Repository Layout

**MES suite ADRs** (this repository) live under:

```text
Governance/ADRS/
├── README.md
├── ADR-0001-....md
└── ...
```

**Product / service repositories** that inherit MES **shall** use:

```text
docs/
└── ADRS/
    ├── README.md                 # Index: ID, title, status, date, supersedes
    ├── ADR-0001-record-architecture-decisions.md
    ├── ADR-0002-....md
    └── ...
```

Also maintain a root or docs index pointer:

- `DECISIONS.md` — short index linking to `docs/ADRS/`
- Project `ARCHITECTURE.md` — links material ADRs in relevant sections

Number ADRs sequentially with zero-padded IDs: `ADR-NNNN`.

---

## Status Lifecycle

| Status | Meaning |
|--------|---------|
| **Proposed** | Draft under review; not yet binding |
| **Accepted** | Binding for the system until superseded or deprecated |
| **Deprecated** | No longer recommended; may still describe live legacy behavior |
| **Superseded** | Replaced by a newer ADR (must cite successor) |
| **Rejected** | Considered and explicitly not chosen (preserve for history) |

Only **Accepted** ADRs are normative for implementation. Superseded ADRs remain in the repository; they are never deleted.

---

## ADR Template

Use this structure for every ADR:

```markdown
# ADR-NNNN: [Short imperative or noun-phrase title]

**Status:** Proposed | Accepted | Deprecated | Superseded | Rejected  
**Date:** YYYY-MM-DD  
**Deciders:** [Names / roles]  
**Consulted:** [Optional]  
**Tags:** [architecture | security | ai | data | devops | ...]  
**Supersedes:** ADR-XXXX (if any)  
**Superseded by:** ADR-YYYY (when applicable)  
**Related:** [links to PRD, architecture sections, threats, evals]

---

## Context

What force is driving the decision? Include:

- Problem statement
- Constraints (time, cost, compliance, team skill, MES requirements)
- Assumptions
- Non-goals

## Decision Drivers

Bullet the criteria that matter most (ordered when ranking matters):

1. Maintainability
2. Reliability
3. Security / data posture
4. Observability
5. Cost / operational burden
6. ...

## Options Considered

### Option A — [Name]

- Summary
- Pros
- Cons
- Risks

### Option B — [Name]

- Summary
- Pros
- Cons
- Risks

### Option C — [Name] (optional)

...

## Decision

State the chosen option in one or two clear sentences.

We will **[chosen option]** because **[primary reasons]**.

## Consequences

### Positive

- ...

### Negative / Trade-offs

- ...

### Follow-up work

- [ ] Docs to update
- [ ] Tests / evals to add
- [ ] Migrations / runbooks
- [ ] Security / privacy review if needed

## Compliance Notes

- MES Parts affected: [e.g., III, VIII, XII]
- Risk Class (R0–R4): [class] — see [`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md) / [`../GLOSSARY.md`](../GLOSSARY.md#risk-class)
- Side-effect class (if tools/agents): read | draft | write | irreversible | N/A
- HITL / approval required before production? [Yes/No + who + Evidence Pack link for R3+]
- Eval / golden-set impact? [Yes/No]
- Data classification / privacy impact: [None / Internal / PII / CUI / PHI / Sovereign — details]
- Applicable control frameworks (starter language only): [800-53 families / HIPAA safeguards / tribal governance — project-specific; not certification]
- Accessibility impact: [None / WCAG-relevant / Section 508-relevant]

## References

- Links to RFCs, vendor docs, incident reports, prior ADRs
- MDES review disposition when the ADR itself is a normative documentation decision: [Accept / Revise / ADR required]
```

---

## Writing Quality Bar

An ADR **shall**:

1. Be understandable without reading the PR discussion thread  
2. Name at least two real options (or explain why only one was viable)  
3. Record consequences, not only benefits  
4. Use normative language carefully (`shall` / `should` / `may`)  
5. Avoid dumping implementation detail that belongs in code or runbooks  
6. Meet [`MDES.md`](../MDES.md) thresholds before status **Accepted** when the ADR is normative for MES or project architecture documentation  
7. Stay under ~2 pages unless the decision is unusually complex  

An ADR **should** include diagrams when boundaries or data flows change.

An ADR **must not** contain secrets, credentials, production customer data, or unredacted prompts with sensitive content.

---

## Review Process

1. **Author** opens a PR containing the ADR under `docs/ADRS/` with status `Proposed`.  
2. **Index update** — add the row to `docs/ADRS/README.md` and `DECISIONS.md`.  
3. **Reviewers** — at least one human engineer with architecture or domain ownership. **Risk-based quorum:** R3 decisions require architecture (or domain) owner + security/AI owner when trust boundaries, prompts, models, or data classification change; **R4 requires dual-control or designated approver** per [`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md). For AI-, security-, or privacy-impacting decisions, include the relevant owner.  
4. **AI coding agents** may draft ADRs and suggest options; they **shall not** mark an ADR `Accepted` without human confirmation.  
5. On merge approval, status becomes `Accepted` (or `Rejected` if the decision is to not proceed).  
6. Update `ARCHITECTURE.md` / security / eval docs if the decision changes system behavior.

### Review Checklist

- [ ] Context is sufficient for someone new in 6 months  
- [ ] Options are fair (not strawmen)  
- [ ] Risk Class (R0–R4) declared and reviewer quorum met  
- [ ] Decision aligns with M.O.M. decision framework (simplicity → maintainability → reliability → observability → security → extensibility → business value)  
- [ ] MES deviations are explicit  
- [ ] Consequences and follow-ups are actionable  
- [ ] No secrets or sensitive payloads  

---

## Supersession

When a prior decision is replaced:

1. Create a new ADR (`ADR-NNNN`) that references the old one under **Supersedes**.  
2. Change the old ADR status to `Superseded` and set **Superseded by** to the new ID.  
3. Do not rewrite history in the old ADR body except for the status/supersession header fields.  
4. Update indexes and any architecture sections that cited the old decision.  
5. If migration is required, list it under Consequences → Follow-up work and track completion in the project issue tracker.

Partial supersession is allowed: state which parts remain in force.

---

## Relationship to Other Artifacts

| Artifact | Relationship to ADRs |
|----------|----------------------|
| `PRD.md` | Product intent; ADRs record *how* we realize intent |
| `ARCHITECTURE.md` | Living system design; ADRs explain irreversible or costly choices |
| `SECURITY.md` / threat model | Security decisions that change posture require ADRs |
| `VERIFY.md` / evals | Threshold or harness strategy changes require ADRs when they gate releases |
| Chat / agent transcripts | Non-durable; must be distilled into ADRs when decisions stick |

---

## AI Agent Rules for ADRs

AI coding agents (Codex, Cursor, Claude Code, Gemini CLI, and equivalents) **shall**:

- Propose ADRs for significant decisions before large implementation PRs  
- Search existing `docs/ADRS/` before inventing a new pattern  
- Prefer citing and extending Accepted ADRs over silent contradiction  
- Leave status as `Proposed` until a human accepts  

Agents **must not**:

- Delete or silently rewrite Accepted ADRs  
- Treat chat agreement as an Accepted ADR  
- Accept MES deviations without an ADR  

---

## Example (CareerPilot) — Illustrative Only

**Example (CareerPilot):** An ADR titled `ADR-0014-use-graphrag-for-role-taxonomy` might record why CareerPilot grounds role recommendations in a knowledge graph plus hybrid retrieval rather than prompt-only classification — including rejected options (flat embeddings only; single LLM classifier), eval impact (golden set for role mapping), and HITL for publishing taxonomy changes. This example is not a MES product requirement.

---

## Minimal First ADR

Every new repository **should** start with:

`ADR-0001: Record architecture decisions`

Accepting that ADR establishes the practice. Subsequent ADRs follow this guide.

---

## Conformance

Projects claiming MES conformance **shall** maintain an ADR index, use this template (or a documented equivalent covering the same sections), and record MES deviations as ADRs.

See Also: [`MOM.md`](MOM.md) Decision Framework (human design options) · [`../CLAUDE.md`](../CLAUDE.md) Decision Hierarchy (agent execution) · [`MES_REVIEW_PROCESS.md`](MES_REVIEW_PROCESS.md) · [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) · [`CONTRIBUTING.md`](CONTRIBUTING.md)
