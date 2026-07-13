# MES Review Process — Documentation Excellence and Suite Coherence

**MES Version:** 1.1.0  
**Status:** Engineering Standard — Governance process  
**Owner:** MoniGarr Engineering  
**Applies To:** All documents in the MoniGarr Engineering Standards (MES) suite and material documentation in MES-conformant projects  
**Canonical Path:** `Governance/MES_REVIEW_PROCESS.md`  
**See Also:** [`../MDES.md`](../MDES.md) · [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) · [`MOM.md`](MOM.md) · [`ADR_GUIDE.md`](ADR_GUIDE.md) · [`CONTRIBUTING.md`](CONTRIBUTING.md) · [`../MDES_REVIEWS/README.md`](../MDES_REVIEWS/README.md) · [`../GLOSSARY.md`](../GLOSSARY.md) · [`../CHANGELOG.md`](../CHANGELOG.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

Documentation quality without suite coherence produces excellent islands and a broken constitution. Suite coherence without document excellence produces consistent mediocrity. MES requires both.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`MOM.md`](MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

This standard defines the **governance lifecycle** for MES documentation:

```text
Review → Score → Disposition → Evidence → Approval → Release
```

It establishes two complementary gates:

| Gate | Question | Canonical standard |
|------|----------|--------------------|
| **MDES** — MoniGarr Documentation Excellence Standard | Is this document excellent on its own? | [`../MDES.md`](../MDES.md) |
| **MCR** — MES Coherence Review | Does this document remain consistent with every other document in the suite? | This file (§ MES Coherence Review) |

Large engineering organizations separate document excellence from system-of-systems integrity. MES adopts that model so audits remain tractable as the suite grows.

---

## Normative Language

| Term | Meaning |
|------|---------|
| **shall / must** | Mandatory for MES conformance |
| **should** | Strong default; deviation requires ADR |
| **may** | Optional |

---

## Roles

| Role | Responsibility |
|------|----------------|
| **Author** | Technical correctness of the changed document(s) |
| **MDES Reviewer** | Scores MDES criteria; proposes disposition |
| **MCR Reviewer** | Checks suite coherence (SoT, terminology, cross-refs, enums, hierarchy) |
| **Architect** | Architectural consistency; ADR requirements |
| **Suite Owner** | Final human approval for MES suite release claims |
| **AI agent** | May draft scores, evidence tables, and finding lists; **shall not** Accept without human confirmation |

One human **may** hold multiple roles on small changes. Material suite releases **should** separate MDES Reviewer from Author.

---

## Cadence

| Trigger | MDES | MCR | Required |
|---------|------|-----|----------|
| Initial authoring of a normative MES doc | Yes | Yes (delta scope) | Yes |
| Pull request with material documentation change | Yes | Yes (touched domains + dependents) | Yes |
| Architecture review | Yes (affected Parts) | Yes | Yes |
| Minor / patch MES release | Spot-check changed docs | Delta MCR | Yes |
| Major MES release | Full published corpus | Full suite MCR | Yes |
| Annual governance review | Sample + high-risk docs | Full suite MCR | Yes |
| Cosmetic-only change (typo, dead link fix with no meaning change) | No | Cross-ref check only | Optional MDES |

**Material documentation change** is defined in [`../GLOSSARY.md`](../GLOSSARY.md).

---

## End-to-End Lifecycle

### 1. Review

Identify scope:

- Documents authored or materially edited  
- Documents that **depend on** changed terminology, enums, SoT ownership, or hierarchy  
- Whether the change is suite-level or project-level  

### 2. Score (MDES)

Apply [`../MDES.md`](../MDES.md) criteria (0–10 each). Record scores in an evidence artifact under [`../MDES_REVIEWS/`](../MDES_REVIEWS/).

### 3. Coherence check (MCR)

Apply the **MCR checklist** below. Record findings in the same batch evidence file or a paired `*-mcr.md` artifact.

### 4. Disposition

Document and suite claims use explicit **conformance states**. Reviewer dispositions map to those states.

#### Conformance States (normative)

| State | Meaning |
|-------|---------|
| **Draft** | Under active development; not formally evaluated |
| **Review** | Under formal MDES and/or MCR review |
| **Conditionally Conformant** | Suitable for use; identified constitutional or Material issues remain open with owners and closure criteria |
| **Conformant** | Meets all mandatory MDES and MCR requirements with filed evidence |
| **Superseded** | Replaced by a newer evidence review or document version |
| **Archived** | Retained for historical reference only |

#### Reviewer dispositions

| Disposition | Meaning | Typical resulting state |
|-------------|---------|-------------------------|
| **Accept** | MDES thresholds met **and** MCR has no unresolved Material findings | **Conformant** (or remains Conditionally Conformant if suite-level P0 backlog is named elsewhere) |
| **Conditionally Accept** | Suitable for use; Material or Major findings tracked with owners and closure plan | **Conditionally Conformant** |
| **Revise** | Fix required before merge / release claim | **Review** or **Draft** until re-scored |
| **ADR required** | Contradiction or intentional deviation needs an Architecture Decision Record | **Review** until ADR Accepted |
| **Bootstrap** | Living catalog or incomplete inventory; verify before rely (not Conformant as SoT) | Bootstrap catalog (not Conformant) |

**MDES Conformant** (document) requires MDES thresholds **and** no unresolved MCR Material findings for the document’s claimed scope.

**Suite Conditionally Conformant** is allowed when published standards remain production-quality and every open Material/P0 constitutional finding is named in filed evidence with closure criteria. Suite **Conformant** requires those findings closed.

### 5. Evidence

Evidence **shall** be linkable from:

- the PR description, **or**  
- [`../MDES_REVIEWS/`](../MDES_REVIEWS/) with a path cited in [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) Document Status (suite) or project `VERIFY.md` (projects)

Evidence **shall** include: evaluation date, MES version, reviewer, document path, criterion scores, MCR findings summary, disposition.

AI agents may draft evidence tables; humans **shall** confirm Accept dispositions.

### 6. Approval

Human Suite Owner (or delegated architect) approves Accept for MES suite claims. Project owners approve project documentation gates.

### 7. Release

Update [`../CHANGELOG.md`](../CHANGELOG.md). Bump MES version per [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) Version Governance. Refresh Document Status when suite disposition changes.

---

## MDES Workflow (Summary)

Full criteria and thresholds: [`../MDES.md`](../MDES.md).

**MDES Conformant:** no criterion below **8**, average **≥ 9.0**, no unresolved contradictions, valid cross-references, glossary-aligned terminology, findings resolved or ADR-documented.

**MDES Excellence (optional):** no criterion below **9**, average **≥ 9.5**, same contradiction/xref rules. Do not claim Excellence without recorded scores.

**MDES Excellence 10 (optional exemplary):** every criterion scores **10**, average **10.0**, same contradiction / xref / glossary / finding rules as Excellence. Definition and rubrics: [`../MDES.md`](../MDES.md) (SoT). Do not claim Excellence 10 without filed per-criterion scores and human confirmation.

MDES answers: *Is this document excellent on its own?*

---

## MES Coherence Review (MCR)

**MCR** answers: *Does this document remain internally consistent with every other document in the suite?*

MCR does **not** re-score writing quality. MCR verifies **suite integrity**.

### MCR Checklist

Every MCR **shall** address:

| # | Check | Fail condition |
|---|-------|----------------|
| 1 | **Source-of-Truth integrity** | Document contradicts a higher SoT without ADR ([`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md)) |
| 2 | **Terminology consistency** | Term conflicts with [`../GLOSSARY.md`](../GLOSSARY.md) or Domain SoT Registry |
| 3 | **Canonical enums** | Drift in Risk Class, `side_effect_class`, HITL, gate outcomes, or other normative enums |
| 4 | **Ownership map** | Concept redefined outside owner listed in [`../AI/INDEX.md`](../AI/INDEX.md) or Domain Registry |
| 5 | **Cross-reference validity** | Broken paths, stale anchors, citations of quarantined `Architecture/_part_*` |
| 6 | **Hierarchy alignment** | Project/minimum inventories diverge from README canonical tree without ADR |
| 7 | **Absence of contradictory guidance** | Two normative docs give incompatible shall/must for the same decision |
| 8 | **Decision-framework scope** | Agent vs human decision rules mixed without the split in § Decision Authority |
| 9 | **Duplication control** | Full tables/procedures duplicated instead of link-to-owner |
| 10 | **Version / metadata stamps** | Document Control or headers disagree with suite MES version without rationale |
| 11 | **Regulated overlays** | PHI / CUI / sovereign / accessibility normative claims lack pointers to [`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md) and/or [`../REFERENCES.md`](../REFERENCES.md) when those domains apply |

### MCR Finding Severity

| Severity | Meaning | Release impact |
|----------|---------|----------------|
| **Material** | Contradicts SoT, breaks enum, or invalidates conformance claims | Blocks Accept / suite Conformant claim |
| **Major** | Drift that will confuse agents or auditors | Blocks major release; may Accept with tracked Revise for patch |
| **Minor** | Clarity, optional depth, non-normative polish | Does not block Accept |

### MCR Scope Modes

| Mode | When | Depth |
|------|------|-------|
| **Delta** | Single PR / small change set | Changed docs + direct dependents |
| **Domain** | AI, Engineering, Architecture, Governance cluster | All docs in cluster + SoT parents |
| **Full suite** | Major release, annual review | All published standards (templates optional) |

---

## Decision Authority (Normative Split)

Two complementary decision frameworks exist in MES. They are **not** alternatives for the same actor in the same moment.

| Framework | Canonical doc | Governs | Does not govern |
|-----------|---------------|---------|-----------------|
| **Agent Decision Hierarchy** | [`../CLAUDE.md`](../CLAUDE.md) | AI-agent **execution** decisions when goals conflict during implementation | Human design option selection among already-viable architectures |
| **Human Decision Framework** | [`MOM.md`](MOM.md) | Human **architectural and design** decisions when multiple viable solutions exist | Unbounded agent autonomy when Safety/Correctness/Security conflict |

When an agent faces a value conflict during implementation, CLAUDE hierarchy wins.  
When humans choose among sound designs, MOM Decision Framework wins.  
Significant choices remain ADRs ([`ADR_GUIDE.md`](ADR_GUIDE.md)).

---

## Acceptance Process

A document (or suite claim) may be **Accepted** only when:

1. MDES scores meet Conformant thresholds (or Excellence if claimed).  
2. MCR has **zero unresolved Material** findings.  
3. Evidence artifact is filed and linkable.  
4. Human reviewer confirms disposition (AI draft insufficient).  
5. Required ADRs are Accepted or explicitly tracked.

A suite may claim **MDES Conformant** only when:

1. Every published constitutional, governance, architecture, AI, and engineering standard has Accept (or Quarantine OK for build fragments).  
2. Exceptions (Bootstrap catalogs, fill-in templates) are named.  
3. Suite MDES + MCR evidence exists under [`../MDES_REVIEWS/`](../MDES_REVIEWS/).  
4. [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) Document Status cites that evidence.  
5. Zero unresolved Material MCR findings.

A suite may claim **Conditionally Conformant** when items 1–4 hold, Material/P0 constitutional findings remain open, and each finding is named in filed evidence with owner and closure criteria. Conditionally Conformant **shall not** be marketed as Conformant.

**MDES Excellence** and **MDES Excellence 10** are **not** implied by Conformant or Conditionally Conformant. Claims require thresholds in [`../MDES.md`](../MDES.md) plus filed evidence under [`../MDES_REVIEWS/`](../MDES_REVIEWS/).

---

## Evidence Storage

| Artifact | Path |
|----------|------|
| Index / how to file | [`../MDES_REVIEWS/README.md`](../MDES_REVIEWS/README.md) |
| Suite MDES evidence | `MDES_REVIEWS/YYYY-MM-DD-suite-mdes.md` |
| Suite MCR evidence | `MDES_REVIEWS/YYYY-MM-DD-suite-mcr.md` |
| Per-document evidence (optional) | `MDES_REVIEWS/<DOC_STEM>_MDES_vX.Y.md` |

Project repositories **should** mirror this under `docs/mdes-reviews/` or attach tables in PRs per CONTRIBUTING.

---

## Relationship to Other Standards

| Document | Role |
|----------|------|
| [`../MDES.md`](../MDES.md) | **What** excellence criteria and thresholds are |
| **This file** | **How** reviews run; **MCR** definition; acceptance → release |
| [`../Engineering/DOCUMENTATION_STANDARDS.md`](../Engineering/DOCUMENTATION_STANDARDS.md) | **How** documents are authored |
| [`MOM.md`](MOM.md) | Operating rituals and quality gates (invokes this process) |
| [`ADR_GUIDE.md`](ADR_GUIDE.md) | Resolves Material MCR contradictions |

---

## Continuous Improvement

Changes to MDES criteria or MCR checklist **shall** require:

- ADR (when normative meaning shifts)  
- CHANGELOG entry  
- Cross-document MCR of dependent docs  
- Version increment per suite policy  

---

## Checklist (Reviewers)

□ Scope identified (docs + dependents)  
□ MDES scores recorded  
□ MCR checklist completed  
□ Disposition set (Accept / Conditionally Accept / Revise / ADR / Bootstrap)  
□ Evidence filed under `MDES_REVIEWS/` or linked from PR  
□ Human confirmed Accept or Conditionally Accept  
□ CHANGELOG / Document Status updated if suite claim changes  
□ Quarantine fragments not cited as SoT  
□ Conformance state recorded (Draft / Review / Conditionally Conformant / Conformant / Superseded / Archived)  
