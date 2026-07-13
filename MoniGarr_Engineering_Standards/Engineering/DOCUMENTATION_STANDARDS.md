# DOCUMENTATION_STANDARDS — Humans and AI Agents

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All Products, Services, Repositories, MES Suite Documents  
**Canonical Path:** `Engineering/DOCUMENTATION_STANDARDS.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) · [`../Governance/MOM.md`](../Governance/MOM.md) · [`../Governance/MILE.md`](../Governance/MILE.md) · [`../Governance/ADR_GUIDE.md`](../Governance/ADR_GUIDE.md) · [`../Governance/CONTRIBUTING.md`](../Governance/CONTRIBUTING.md) · [`ENGINEERING_STANDARDS.md`](ENGINEERING_STANDARDS.md) · [`CODING_STANDARDS.md`](CODING_STANDARDS.md) · [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) · [`../GLOSSARY.md`](../GLOSSARY.md) · [`../MDES.md`](../MDES.md) · [`../Templates/`](../Templates/)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Normative Language

| Term | Meaning |
|------|---------|
| **shall / must** | Mandatory for MES conformance |
| **should** | Strong default; deviation requires an ADR |
| **may** | Optional |
| **Example (CareerPilot)** | Illustrative only |

This standard is **company-wide**. Documentation that only makes sense inside one person’s head is non-conformant for production systems.

---

## Purpose

Documentation is a first-class engineering deliverable. It enables:

- Safe onboarding of humans and AI agents  
- Auditable decisions  
- Operable production systems  
- Transfer of ownership without tribal knowledge  

Undocumented behavior is unfinished behavior.

---

## Documentation Principles

1. **Single source of truth** — chat is not SoT; repository artifacts are.  
2. **Proximity** — docs live with the system they describe.  
3. **Currency** — behavior changes update docs in the same change set when practical.  
4. **Audience clarity** — state whether a doc is for operators, developers, auditors, or agents.  
5. **Evidence over slogans** — claims link to commands, reports, or ADRs.  
6. **Handoff readiness** — a new qualified reader can run, test, and change the system from docs alone.  
7. **Normative honesty** — use shall/should/may deliberately; do not invent certification claims.

---

## Documentation Quality Evaluation

Authoring rules for documentation live in this file.

**Evaluation and scoring** live in [`../MDES.md`](../MDES.md).

Normative MES document changes **shall** include MDES criterion scores in the PR (or linked review artifact). Passing thresholds, evidence fields, and disposition values are defined by MDES — not restated here.

---

## Required Project Documents (Minimum)

MES-conformant production repositories **shall** maintain or clearly inherit the **canonical** project tree in [`../README.md`](../README.md) Â§ Minimum Project Repository Standard.

Do not invent an alternate minimum inventory in this file. Conditional artifacts (`PRIVACY_DATA_GOVERNANCE.md`, `THREAT_MODEL.md`) follow the README factory workflow and [`SECURITY.md`](SECURITY.md) threat-model triggers.

Greenfield projects **should** instantiate from [`../Templates/`](../Templates/).

Documentation quality evaluation: [`../MDES.md`](../MDES.md). Suite review process (MDES + MCR): [`../Governance/MES_REVIEW_PROCESS.md`](../Governance/MES_REVIEW_PROCESS.md).

---

## Document Header Convention

Normative engineering documents **shall** include:

- Title and short purpose  
- MES Version (when MES-owned) or project Version  
- Status  
- Owner  
- Applies To / Scope  
- Canonical Path  
- See Also links (at minimum Architecture and M.O.M. when applicable)  
- Foundation quote for MES suite documents  

Project docs **should** include Created / Last Updated dates and classification when relevant.

---

## README Standard

Every repository README **shall** answer:

1. What is this system and who is it for?  
2. How do I run it locally?  
3. How do I test / verify it?  
4. Where is architecture / security / ops documentation?  
5. How does this relate to MES (link)?  
6. What are major constraints (AI bounds, data class, environments)?  

README is an entrypoint, not a dumping ground. Deep content belongs in dedicated docs.

---

## Architecture Documentation

Project `ARCHITECTURE.md` **shall**:

- Describe boundaries, containers, major components, and data flows  
- Map conformance to [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Parts as applicable  
- Call out AI control planes, retrieval, evals, and HITL when present  
- Reference C4 companions when diagrams exist  

Diagrams **should** prefer C4 levels for progressive zoom. Keep diagrams versioned with the repo.

---

## ADR Documentation

Significant decisions **shall** follow [`../Governance/ADR_GUIDE.md`](../Governance/ADR_GUIDE.md):

- Context  
- Decision  
- Alternatives  
- Consequences  
- Status  

ADRs are permanent history; supersede rather than silently rewrite past decisions.

---

## API & Contract Documentation

Public or cross-team APIs **shall** have:

- Machine-readable schema (OpenAPI, JSON Schema, protobuf, etc.)  
- Human-readable narrative for auth, errors, idempotency, and rate limits  
- Versioning policy  

Generated OpenAPI alone is insufficient when semantic constraints are not expressible in schema.

---

## Code-Adjacent Documentation

- Public modules **should** have headers per [`../Templates/CODE_COMMENT_HEADER_TEMPLATE.md`](../Templates/CODE_COMMENT_HEADER_TEMPLATE.md).  
- Comments explain *why* and non-obvious constraints; they do not narrate obvious syntax.  
- Do not leave stale comments that contradict code.  
- TODO comments **shall** include owner and intent when they survive a PR.

---

## AI / Prompt / Eval Documentation

When AI is in scope, projects **shall** document:

- Agent purposes, tools, and escalation rules  
- Prompt versioning location and change process  
- Retrieval corpora, freshness, and access controls  
- Golden datasets and eval thresholds  
- Known failure modes and HITL checkpoints  

**Example (CareerPilot):** Document which recommendation claims require provenance citations and which actions require human approval before customer-visible send — illustrative only.

Prefer dedicated AI docs under project `docs/` or MES `AI/` patterns over burying prompts in undocumented strings.

---

## Operational Documentation

Operable systems **shall** provide:

- Health endpoints and meaning of statuses  
- Common failure modes and mitigations  
- Rollback procedure  
- Escalation contacts / on-call map  
- Backup/restore expectations for durable data  

Link to [`ONCALL.md`](ONCALL.md) and project runbooks.

---

## Documentation for AI Coding Agents

Agents are first-class readers. Docs **shall**:

- Prefer explicit paths and commands over vague references  
- State invariants and forbidden actions clearly  
- Avoid contradictory guidance across README, CONTRIBUTING, and architecture  
- Use glossary terms from [`../GLOSSARY.md`](../GLOSSARY.md)  

If an agent cannot determine the source of truth, humans **shall** fix the docs — not invent a third informal rule in chat.

---

## Style & Writing Rules

- Prefer short paragraphs and scannable tables.  
- Use active voice for requirements (“Engineers shall…”).  
- Define acronyms on first use or link glossary.  
- Prefer absolute repo-relative links for internal docs.  
- Do not claim certifications, ATOs, or compliance attestations unless true and evidenced.  
- Mark illustrations as `Example (CareerPilot)` or equivalent.  
- **Foundation / Factory Maxim:** MES suite documents **should** include the Foundation blockquote and Factory Maxim once near the top **or** link [`../GLOSSARY.md`](../GLOSSARY.md) (**Factory Maxim**) after the first occurrence in a change set. Do not invent alternate maxim wording. New sections **shall not** restate the full Foundation essay when a link suffices.  
- Classification banners **shall** appear on docs containing CUI/PHI handling instructions when distributed outside the repository.

---

## Documentation Lifecycle

| Event | Documentation action |
|-------|----------------------|
| New feature | Update PRD acceptance, architecture if needed, VERIFY, user-facing docs |
| Behavior change | Update API/docs/tests in same PR when practical |
| Incident | Update runbooks and postmortem links |
| Deprecation | Document timeline, migration, and removal gate |
| MES version bump | Update suite CHANGELOG and affected normative docs |

Orphan docs that no longer match reality **shall** be fixed or explicitly marked obsolete.

---

## Templates & Instantiation

Use templates under [`../Templates/`](../Templates/) for:

- PRD, Architecture, Security Requirements, Threat Model  
- Privacy / Data Governance  
- VERIFY, AUDIT, PRESEARCH  
- MOM/MILE greenfield blueprint  

Templates are starters. Tailor to mission and risk; do not delete whole domains solely for convenience.

---

## Diagrams & Visual Artifacts

- Prefer checked-in source (Mermaid, Structurizr, PlantUML, draw.io XML) over opaque binaries when practical.  
- Exported images **may** accompany source for readability.  
- Diagrams **shall** match the architecture narrative; stale diagrams are defects.

---

## Localization & Audience Variants

- Customer-facing help content **should** be separated from internal engineering docs.  
- Do not mix secret operational detail into public docs.  
- Internal docs **may** include deeper failure-mode detail for on-call.

---

## Quality Bar for “Done” Documentation

A change is not documentation-complete until:

- [ ] A new engineer can find how to run and verify  
- [ ] Architecture boundaries remain accurate  
- [ ] Public contracts match implementation  
- [ ] AI bounds and eval gates are stated when applicable  
- [ ] Ops/rollback notes exist for production-impacting changes  
- [ ] Links resolve  

---

## Anti-Patterns

- README walls of unprioritized history  
- Architecture docs that only list technologies  
- “Docs later” for production paths  
- Conflicting SoT across Notion/Slack/repo  
- Marketing language pretending to be security certification  
- Undocumented prompt/model drifts  

---

## Conformance Checklist

- [ ] Minimum project docs present or inherited  
- [ ] MES Foundation and normative language used in suite docs  
- [ ] See Also links include Architecture and M.O.M. where applicable  
- [ ] CareerPilot (or other products) appear only as examples  
- [ ] VERIFY/evidence commands kept current  
- [ ] Agent-readable entrypoints exist  

---

## See Also

- [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md)  
- [`../Governance/MOM.md`](../Governance/MOM.md)  
- [`../MDES.md`](../MDES.md)  
- [`ENGINEERING_STANDARDS.md`](ENGINEERING_STANDARDS.md) · [`CODING_STANDARDS.md`](CODING_STANDARDS.md) · [`TESTING.md`](TESTING.md) · [`RELEASE_PROCESS.md`](RELEASE_PROCESS.md)
