# MDES — MoniGarr Documentation Excellence Standard

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All documents contained within the MoniGarr Engineering Standards (MES) suite and all documentation produced by MES-conformant projects.  
**Canonical Path:** `MDES.md`  
**See Also:** [`SYSTEM_CONTEXT.md`](SYSTEM_CONTEXT.md) · [`Engineering/DOCUMENTATION_STANDARDS.md`](Engineering/DOCUMENTATION_STANDARDS.md) · [`GLOSSARY.md`](GLOSSARY.md) · [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md) · [`Governance/MOM.md`](Governance/MOM.md) · [`Governance/CONTRIBUTING.md`](Governance/CONTRIBUTING.md) · [`CHANGELOG.md`](CHANGELOG.md) · [`CLAUDE.md`](CLAUDE.md) · [`MDES_REVIEWS/README.md`](MDES_REVIEWS/README.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

Documentation is a first-class engineering artifact.

Poor documentation increases operational risk, slows engineering velocity, weakens AI performance, increases maintenance cost, and reduces organizational knowledge over time.

The purpose of MDES is to ensure every document produced by MoniGarr Engineering meets a consistent, measurable, evidence-based quality standard suitable for long-lived enterprise software systems.

MDES evaluates documentation using objective engineering criteria rather than subjective writing preferences.

### Scoring focus (coherence vs inventiveness)

MDES criterion scores measure **documentation fitness and suite coherence** — not the inventiveness of the underlying engineering ideas. A suite may contain excellent architecture and AI-native design while still scoring lower on Internal Consistency or Cross-Reference Integrity until ownership and SoT boundaries are explicit. Reviewers **shall** not treat a mid-8s coherence score as evidence that engineering concepts are weak; they **shall** treat it as a signal to refine constitutional cross-links, ownership, and drift control.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`AI/REGULATED_PROFILES.md`](AI/REGULATED_PROFILES.md), map external authorities via [`REFERENCES.md`](REFERENCES.md), and follow the Regulated Operations Overlay in [`Governance/MOM.md`](Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

MDES defines:

- documentation quality expectations
- evaluation methodology
- scoring criteria
- evidence requirements
- ownership
- review cadence
- acceptance thresholds
- continuous improvement practices

MDES applies equally to documentation written by:

- human engineers
- architects
- technical writers
- AI coding agents
- documentation generation systems

---

## Principles

Documentation shall be:

- technically correct
- internally consistent
- maintainable
- discoverable
- version controlled
- evidence-based
- architecture aligned
- product agnostic where appropriate
- understandable by both humans and AI agents

Documentation exists to reduce uncertainty.

---

## Evaluation Lifecycle

Documentation is evaluated during:

| Phase | Required |
|---------|----------|
| Initial authoring | Yes |
| Pull Request Review | Yes |
| Architecture Review | Yes |
| Major Release | Yes |
| Annual Governance Review | Yes |

Material changes shall be re-evaluated before release.

---

## Evaluation Criteria

Each criterion is scored from 0–10.

A score of **10** represents enterprise-quality documentation suitable for regulated industries and long-lived software systems.

| Criterion | Description |
|------------|-------------|
| Technical Accuracy | Information is correct, current, and technically precise. |
| Internal Consistency | Terminology, definitions, and guidance remain consistent across MES. |
| Architectural Rigor | Documentation reinforces architectural principles and system boundaries. |
| AI-Agent Operability | AI agents can reliably understand, navigate, and follow the document. |
| Enterprise Readiness | Appropriate for enterprise engineering organizations. |
| Government Readiness | Appropriate for government engineering environments. |
| Healthcare Readiness | Appropriate for regulated healthcare environments. |
| Maintainability | Easy to update without introducing inconsistencies. |
| Cross-Reference Integrity | References remain accurate, canonical, and current. |
| Evidence-Based Guidance | Engineering recommendations are measurable and supported by evidence. |
| Vendor Neutrality | Guidance avoids unnecessary vendor dependence. |
| Longevity | Expected to remain useful for ten years or longer with routine maintenance. |

---

## Scoring Scale

| Score | Interpretation |
|---------|---------------|
| 10 | Exemplary enterprise standard |
| 9 | Production quality |
| 8 | Acceptable with minor improvements |
| 7 | Requires revision before approval |
| 6 or below | Not suitable for MES publication |

---

## Scoring Rubrics (6 / 8 / 10)

Reviewers **shall** use these anchors. Intermediate scores (7, 9) interpolate.

| Criterion | 6 — Not ready | 8 — Conformant floor | 10 — Exemplary |
|-----------|---------------|----------------------|----------------|
| Technical Accuracy | Material errors or outdated guidance | Correct for current MES version; minor gaps | Precise, current, no known material errors; edge cases addressed |
| Internal Consistency | Contradicts glossary or peer docs | Aligned; residual duplication controlled by links | Single SoT per concept; no conflicting shall/must |
| Architectural Rigor | Boundaries vague or missing | Boundaries and ownership clear | Contracts, planes, and hierarchy explicit and agent-operable |
| AI-Agent Operability | Ambiguous navigation or conflicting rules | Agents can follow with occasional clarification | Ownership maps, enums, and read-orders make correct action default |
| Enterprise Readiness | Missing gates, ownership, or evidence language | Usable in large eng orgs | Measurable gates, Evidence Pack, ADR, and release discipline complete |
| Government Readiness | No authority mapping or over-claims certification | Posture + REFERENCES pointers; honest non-ATO | Regulated overlays, CUI/privacy triggers, MCR regulated check, PR data bans |
| Healthcare Readiness | Silent on PHI or false HIPAA claims | HIPAA starters + REGULATED_PROFILES; no false cert | PHI adoption workflow, fixture rules, DSAR surfaces, annex cross-links |
| Maintainability | Duplication and drift likely | Updateable with care | Ownership banners, link-to-owner, version policy, intentional structure |
| Cross-Reference Integrity | Broken or quarantined citations | Valid paths; minor stale risk | Canonical links; fragment quarantine enforced; bibliography maintained |
| Evidence-Based Guidance | Opinion without artifacts | Measurable recommendations | Gates map to Evidence Pack fields; thresholds and owners named |
| Vendor Neutrality | Vendor framed as mandatory | Reference vendors with ADR escape | Control points vendor-neutral; brands illustrative only |
| Longevity | Trend-tied or brittle | Decade-usable with maintenance | Principles and contracts outlast tooling; illustrative stacks dated |

---

## Passing Thresholds

A document may be considered **MDES Conformant** only when:

- no criterion scores below **8**
- average score is **9.0 or higher**
- no unresolved contradictions exist
- required cross references are valid
- terminology conforms to GLOSSARY.md
- normative language is consistent
- reviewer findings are resolved or documented through ADRs

**Conditionally Conformant** applies when MDES thresholds are met (or nearly met with named gaps) **and** Material suite-coherence findings remain open with owners and closure criteria. Full state definitions: [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md) § Disposition.

Conformance is evidence-based, not declaration-based.

---

## MDES Excellence Thresholds

**MDES Conformant** (above) is the publication bar.

**MDES Excellence** is a stricter optional recognition:

- no criterion scores below **9**
- average score is **9.5 or higher**
- no unresolved contradictions
- required cross references valid
- glossary-aligned terminology
- reviewer findings resolved (no open Revise items on published standards claiming Excellence)

**MDES Excellence 10** (exemplary suite or document recognition):

- every criterion scores **10**
- average is **10.0**
- same contradiction / xref / glossary / finding rules as Excellence
- filed evidence lists criterion scores explicitly
- named Bootstrap / scaffold exceptions remain allowed and **shall not** be scored as if they were published SoT

If Excellence language is used without meeting these thresholds, prefer **MDES Conformant** only. Do not treat Excellence as a marketing badge.

---

## Required Evidence

Every MDES review shall record:

| Field | Value |
|-------|-------|
| Evaluation date | |
| MES version | |
| Reviewer | |
| Document path / version | |
| Criterion scores (0–10 each) | |
| Identified weaknesses | |
| Recommended improvements | |
| Disposition | **Accept** \| **Conditionally Accept** \| **Revise** \| **ADR required** \| **Bootstrap** |

Evidence may be recorded within review comments, pull requests, review reports, or project verification artifacts.

**Suite evidence store:** Material MES suite evaluations **shall** be filed under [`MDES_REVIEWS/`](MDES_REVIEWS/) and linked from [`SYSTEM_CONTEXT.md`](SYSTEM_CONTEXT.md) Document Status within the same change set that claims Accept / Conformant. Process: [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md).

**Complementary gate:** MDES scores a document in isolation. **MES Coherence Review (MCR)** verifies suite integrity (SoT, terminology, enums, cross-refs, hierarchy, contradictions). Both gates are required for suite Conformant claims.

### Example Evidence Record (annotated)

| Field | Example value |
|-------|----------------|
| Evaluation date | 2026-07-12 |
| MES version | 1.1.0 |
| Reviewer | A. Architect (human) |
| Document path / version | `Engineering/SECURITY.md` @ commit `abc1234` |
| Criterion scores | Accuracy 9, Consistency 9, Arch rigor 9, AI operability 9, Enterprise 9, Gov 8, Health 8, Maintainability 9, XRef 9, Evidence 9, Vendor neutrality 9, Longevity 9 → **avg 8.9** |
| Identified weaknesses | Healthcare readiness at floor (8); add PHI trigger cross-link |
| Recommended improvements | One paragraph linking REGULATED_PROFILES PHI overlay |
| Disposition | **Revise** (avg &lt; 9.0) → after fix → **Accept** |

AI agents may draft this table; they **shall not** set disposition to Accept without human confirmation.

---

## Ownership

Authors are responsible for technical correctness.

Reviewers are responsible for MDES evaluation.

Architects are responsible for architectural consistency.

Final approval remains a human responsibility.

AI agents may assist but shall not self-certify documentation quality.

---

## Continuous Improvement

MDES evolves using the same governance process as MES.

Changes to evaluation criteria require:

- Architecture Decision Record (ADR)
- CHANGELOG update
- cross-document review
- version increment

---

## Relationships

MDES complements, but does not replace:

- [`SYSTEM_CONTEXT.md`](SYSTEM_CONTEXT.md)
- [`GLOSSARY.md`](GLOSSARY.md)
- [`Engineering/DOCUMENTATION_STANDARDS.md`](Engineering/DOCUMENTATION_STANDARDS.md)
- [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md) (MDES + MCR lifecycle)
- [`Governance/MOM.md`](Governance/MOM.md) (M.O.M.)
- [`Governance/MILE.md`](Governance/MILE.md) (M.I.L.E.)
- [`CLAUDE.md`](CLAUDE.md)

MDES defines **how documentation quality is evaluated**.

MES_REVIEW_PROCESS defines **how MDES and MCR reviews run through acceptance and release**.

DOCUMENTATION_STANDARDS defines **how documentation is written**.

---

## Government / Healthcare Readiness (Operationalization)

Enterprise / Government / Healthcare readiness criteria score fitness of the *documentation*, not certification of a product.

- Map external authorities and framework pointers via [`REFERENCES.md`](REFERENCES.md).  
- Healthcare readiness uses HIPAA/HITECH as **project tailoring starters**, not certification or covered-entity attestation.  
- Accessibility expectations (Section 508 / WCAG) are operationalized through Architecture Part XV and project accessibility evidence — not claimed by MDES alone.  
- Score **≥ 9** for Government or Healthcare readiness requires explicit [`AI/REGULATED_PROFILES.md`](AI/REGULATED_PROFILES.md) and/or [`REFERENCES.md`](REFERENCES.md) pointers when the document touches PHI, CUI, sovereign/community data, or accessibility normatively.  
- Score **10** additionally requires: regulated adoption/trigger language, honest non-certification posture, and MCR regulated-overlay check where applicable ([`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md)).

---

## Review Checklist

Every review **shall** address:

□ Is the document technically correct?

□ Does it contradict any other MES document?

□ Does terminology match the glossary?

□ Are architecture boundaries preserved?

□ Are security and governance statements accurate?

□ Can an AI agent correctly interpret the document?

□ Is every recommendation measurable?

□ Is every cross-reference valid?

□ Does the document avoid unnecessary duplication?

□ Is the document suitable for enterprise, government, and healthcare organizations?

□ Will this document still make sense in ten years?

---

## Definition of Excellence

Documentation achieves **MDES Excellence** when it meets the **MDES Excellence Thresholds** above and:

- reduces ambiguity
- improves engineering quality
- strengthens governance
- enables safe AI collaboration
- supports long-term maintenance
- remains useful independent of vendors, products, or technology trends

Excellent documentation compounds organizational knowledge over time. Excellence without recorded criterion scores is non-conformant as a claim.