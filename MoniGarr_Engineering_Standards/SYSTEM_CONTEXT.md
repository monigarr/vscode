# SYSTEM_CONTEXT — MoniGarr Engineering Standards (MES) v1.1

**Version:** 1.1.0  
**Status:** Active — Constitutional root document  
**Owner:** MoniGarr.com LLC / MoniGarr Engineering  
**Applies To:** All products, services, repositories, and AI coding agents across the MoniGarr portfolio  
**Last Updated:** 2026-07-12  
**See Also:** [`GLOSSARY.md`](GLOSSARY.md) · [`PRODUCTS.md`](PRODUCTS.md) · [`MDES.md`](MDES.md) · [`Governance/MOM.md`](Governance/MOM.md) · [`Governance/MILE.md`](Governance/MILE.md) · [`Architecture/ARCHITECTURE.md`](Architecture/ARCHITECTURE.md) · [`Governance/ADR_GUIDE.md`](Governance/ADR_GUIDE.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

This statement is the philosophical foundation for every document in the MoniGarr Engineering Standards suite. It must not be diluted, rebranded, or replaced by product-specific mission copy.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

MES defines human engineers, AI agents, governance, evidence, architecture, and operations inside a single constitutional framework — not coding rules alone.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`AI/REGULATED_PROFILES.md`](AI/REGULATED_PROFILES.md), map external authorities via [`REFERENCES.md`](REFERENCES.md), and follow the Regulated Operations Overlay in [`Governance/MOM.md`](Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## What This Suite Is

MES v1.1 is the **company-wide engineering constitution** for MoniGarr.com LLC. It defines how engineering is done across the organization so that every future project inherits the same standards for design, AI, evaluation, testing, security, documentation, and operations.

MES is suitable for onboarding:

- senior architects and principal engineers
- junior engineers
- AI coding agents (Codex, Cursor, Claude Code, Gemini CLI, and equivalents)

MES is **product-agnostic**. Product names such as CareerPilot appear only as labeled illustrations (`Example (CareerPilot)`). Portfolio inventory lives in [`PRODUCTS.md`](PRODUCTS.md).

---

## What This Suite Is Not

- Not a filled product PRD or product architecture for any single application
- Not a claim of SOC 2, FedRAMP, HIPAA, or other certification or authorization
- Not permission for unbounded AI autonomy in production
- Not a substitute for legal, privacy, contracting, or authorizing-official review on regulated systems
- Not a regulatory framework (see **Regulatory Independence**)

---

## Architectural Principles

MES architecture and delivery shall uphold:

1. **Value before velocity** — ship measurable customer, business, and engineering value.  
2. **Architecture before implementation** — PRD, architecture, domain/data models, and acceptance criteria precede production coding.  
3. **Documentation is product** — behavior and docs stay synchronized.  
4. **Evidence over assertion** — readiness claims require artifacts.  
5. **Deterministic systems govern probabilistic intelligence** — AI accelerates; proof and policy decide.  
6. **Boundaries and contracts are explicit** — ownership, interfaces, and non-goals are written.  
7. **Evaluation before confidence** — AI capabilities do not ship without measurable eval.  
8. **Handoff readiness** — humans and AI agents can run, test, and safely change the system from repository artifacts.  
9. **Security and privacy by design** — trust boundaries, least privilege, and classification are first-class.  
10. **Continuous improvement under change control** — learning is required; silent drift is forbidden.

### Secondary Principles

These strengthen the Factory Maxim and Architectural Principles for decade-long use:

1. **Evidence is superior to opinion** — assertions without artifacts are non-conformant for production claims.  
2. **Architecture is more valuable than implementation** — durable boundaries outlast framework choices.  
3. **Maintainability is more valuable than cleverness** — prefer clear, replaceable designs.  
4. **Governance enables speed** — quality gates and ADRs reduce rework and unblock safe autonomy.  
5. **AI remains bounded by deterministic control** — models propose; policy, schemas, tools, budgets, and HITL dispose.

Depth: [`Architecture/ARCHITECTURE.md`](Architecture/ARCHITECTURE.md) Part I · [`Governance/MOM.md`](Governance/MOM.md) · [`Governance/MILE.md`](Governance/MILE.md).

---

## Engineering Judgment

MES provides standards, gates, and guidance.

No document removes the responsibility for professional **engineering judgment**.

When standards conflict with operational reality, engineers **shall** document rationale through ADRs rather than blindly following process.

This protects against:

- AI agents  
- junior engineers  
- process zealots  

blindly following documents without understanding context, risk, or consequence.

Engineering judgment remains a human obligation. See [`GLOSSARY.md`](GLOSSARY.md) (**Engineering Judgment**).

---

## Human Authority

AI systems may generate recommendations, code, documentation, tests, evaluations, and analyses.

AI systems do **not** own:

- product decisions  
- security decisions  
- architectural authority  
- legal interpretation  
- budget authority  
- hiring authority  
- production accountability  

**Humans remain accountable.**

AI assists. Humans decide. See [`AI/AI_GUIDELINES.md`](AI/AI_GUIDELINES.md) · [`Governance/MILE.md`](Governance/MILE.md) · [`GLOSSARY.md`](GLOSSARY.md) (**Accountability**, **HITL**).

---

## Source-of-Truth Hierarchy

When documents conflict, resolve in this order:

1. **This file (`SYSTEM_CONTEXT.md`)** — suite foundation, scope, and conflict rules  
   - Documentation quality claims **shall** satisfy [`MDES.md`](MDES.md). MDES complements [`Engineering/DOCUMENTATION_STANDARDS.md`](Engineering/DOCUMENTATION_STANDARDS.md) writing rules and does **not** override constitutional content of `SYSTEM_CONTEXT.md`, `Governance/MOM.md`, or `Governance/MILE.md`.  
2. **`Governance/MOM.md`** — operating model, rituals, quality gates, lifecycle  
3. **`Governance/MILE.md`** — intelligence-led engineering discipline  
4. **`Architecture/ARCHITECTURE.md`** — normative architecture handbook (Parts I–XX)  
5. **`AI/*` and `Engineering/*`** — procedural depth for AI and engineering practices  
6. **`Templates/*`** — per-project instantiation scaffolds  
7. **Project repositories** — instantiated `PRD.md`, `ARCHITECTURE.md`, evidence packs  

### ADR Override Rule

**No lower document may contradict a higher document without an approved ADR.**

Within a product repository:

1. `PRD.md` wins for product intent  
2. Project `ARCHITECTURE.md` wins for system implementation boundaries  
3. `SECURITY.md` / `PRIVACY_DATA_GOVERNANCE.md` / `THREAT_MODEL.md` / `VERIFY.md` win for their domains  
4. Project docs must remain conformant to MES; deviations require an ADR  

ADR practice: [`Governance/ADR_GUIDE.md`](Governance/ADR_GUIDE.md).

### Domain Source-of-Truth Registry

| Domain | Canonical document |
|--------|-------------------|
| Terminology | [`GLOSSARY.md`](GLOSSARY.md) |
| Documentation quality evaluation | [`MDES.md`](MDES.md) |
| Documentation authoring | [`Engineering/DOCUMENTATION_STANDARDS.md`](Engineering/DOCUMENTATION_STANDARDS.md) |
| Documentation review process (MDES + MCR) | [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md) |
| Agent operating contract (this suite) | [`CLAUDE.md`](CLAUDE.md) |
| Portfolio inventory | [`PRODUCTS.md`](PRODUCTS.md) |
| External authorities (starters) | [`REFERENCES.md`](REFERENCES.md) |
| Risk Class R0–R4 + HITL policy | [`AI/AI_GUIDELINES.md`](AI/AI_GUIDELINES.md) (terms in GLOSSARY) |
| Side-effect class | [`AI/TOOLS.md`](AI/TOOLS.md) |
| AI concept ownership map | [`AI/INDEX.md`](AI/INDEX.md) |
| Testing procedure (project floors) | [`Engineering/TESTING.md`](Engineering/TESTING.md) — Architecture Part XV states portfolio ambition; Engineering defines operational floors |
| DevOps procedure (control points) | [`Engineering/DEVOPS.md`](Engineering/DEVOPS.md) — Architecture Part XVI states architectural control points; Engineering owns vendor-neutral procedures |
| Project minimum repo tree | [`README.md`](README.md) § Minimum Project Repository Standard |
| MDES / MCR evidence store | [`MDES_REVIEWS/`](MDES_REVIEWS/) |
| Documentation conformance states | [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md) § Disposition |

---

## Engineering Operating System

M.O.M. and M.I.L.E. together form the **MoniGarr Engineering Operating System**.

### M.O.M. — MoniGarr Operating Model

Governance, ADRs, engineering rituals, documentation standards, quality gates, and lifecycle management. Standing standard: [`Governance/MOM.md`](Governance/MOM.md).

### M.I.L.E. — MoniGarr Intelligence Led Engineering

How AI augments software engineering: agent orchestration, evaluation-first development, retrieval architecture, loop engineering, prompt lifecycle, human approval checkpoints, and continuous improvement through measurable quality metrics. Standing standard: [`Governance/MILE.md`](Governance/MILE.md).

Branding without enforceable gates is non-conformant. Crown-jewel synthesis: [`Architecture/ARCHITECTURE.md`](Architecture/ARCHITECTURE.md) Part XX.

---

## MES Conformance

A project is **MES-conformant** when:

- Required documents exist  
- Required quality gates pass  
- Required evidence artifacts exist  
- Required architecture mappings exist (MES Parts I–XX checklist)  
- Deviations are recorded through ADRs  

**Conformance is evidence-based, not declaration-based.**

Partial adoption **shall** be labeled “MES alignment in progress” with a visible gap list — not “MES conformant.” See [`GLOSSARY.md`](GLOSSARY.md) (**Conformance (MES)**, **Evidence**, **Evidence Pack**, **Quality Gate**).

---

## Version Governance

MES follows **Semantic Versioning** (`MAJOR.MINOR.PATCH`):

| Change type | Meaning |
|-------------|---------|
| **MAJOR** | Breaking governance changes (normative meaning shifts that invalidate prior conformance claims) |
| **MINOR** | New standards, sections, or guidance that extend MES without breaking prior normative meaning |
| **PATCH** | Clarifications, corrections, cross-links, and non-normative editorial fixes |

Projects **may** pin a MES version but **shall** declare the version used (e.g., in project `README.md`).

Suite history: [`CHANGELOG.md`](CHANGELOG.md).

---

## Regulatory Independence

MES supports regulated environments (including healthcare, tribal government, state government, federal government, and commercial enterprise).

**MES itself is not a regulatory framework.**

Projects remain responsible for satisfying applicable legal, contractual, privacy, accessibility, security, and compliance requirements — including agency security authority, Authorizing Official, legal, privacy, records, and contracting review where required.

Federal and framework references in templates are starter architecture language, not automatic compliance certification or ATO.

---

## Inheritance Rule

Every new MoniGarr repository shall inherit MES by:

1. Linking to this suite from the project `README.md` and declaring the MES version used  
2. Instantiating required project docs from `Templates/`  
3. Mapping project architecture to MES Parts I–XX  
4. Enforcing evaluation, security, and documentation quality gates before production  
5. Recording deviations with ADRs  

Onboarding is predictable whether the contributor is a senior architect, a junior engineer, or an AI coding agent.

---

## Suite Map

| Area | Path | Role |
|------|------|------|
| Entry | `README.md` | Index, reading order, factory workflow |
| Context | `SYSTEM_CONTEXT.md` | Constitutional root: foundation, SoT, conformance, versioning |
| Documentation quality | `MDES.md` | Documentation excellence evaluation (scoring, thresholds, evidence) |
| Review process | `Governance/MES_REVIEW_PROCESS.md` | MDES + MCR lifecycle, dispositions, acceptance → release |
| Evidence store | `MDES_REVIEWS/` | Filed MDES and MCR evidence artifacts |
| Changelog | `CHANGELOG.md` | MES version history |
| Glossary | `GLOSSARY.md` | Shared terminology |
| Products | `PRODUCTS.md` | Portfolio catalog: software, content, websites, channels |
| Governance | `Governance/MOM.md` | MoniGarr Operating Model |
| Governance | `Governance/MILE.md` | MoniGarr Intelligence Led Engineering |
| Governance | `Governance/ADR_GUIDE.md` | Architecture Decision Records |
| Governance | `Governance/ADRS/` | Suite ADR store (Accepted decisions) |
| Governance | `Governance/CONTRIBUTING.md` | Human + AI contributor contract |
| Governance | `Governance/MES_REVIEW_PROCESS.md` | Documentation excellence + suite coherence process |
| Architecture | `Architecture/ARCHITECTURE.md` | Parts I–XX constitution handbook |
| Architecture | `Architecture/C4/*` | C4 diagram companions |
| AI | `AI/*` | AI platform, agents, RAG, evals, loops, harnesses, regulated profiles |
| Engineering | `Engineering/*` | Coding, testing, security, devops, docs |
| Templates | `Templates/*` | GreenField / project fill-in templates |
| Agent notes | `CLAUDE.md` | Canonical Agent Operating Contract (vendor-neutral; Claude Code filename) |
| References | `REFERENCES.md` | External authority bibliography (posture starters, not certification) |

---

## Document Status (MES v1.1.1)

Suite remediations **P0–P3**, constitutional P0+P1, and **Excellence 10 defense** (per-document scores, regulated-readiness triggers, REFERENCES link-check, ADR-0001) completed **2026-07-12**. Suite Owner directed implementation of the defense plan; **Accept** recorded on defense evidence.

**Suite disposition:** **Conformant** + **MDES Excellence 10** for published constitutional, governance, architecture, AI, and engineering standards. **Exceptions:** fill-in templates remain Revise where scaffolds still need project-specific depth (expected); `_part_*` quarantine. `PRODUCTS.md` catalog inventory is **Accept** (verified 2026-07-12); per-product MES Declared remains In progress. Zero unresolved Material MCR findings. All twelve MDES criteria scored **10** (average **10.0**) on the Excellence-scored corpus with **per-document** scorecards.

**MES 1.1 line freeze:** Further normative work targets **MES v1.2** backlog (see [`CHANGELOG.md`](CHANGELOG.md) `[Unreleased]`).

**Prior evidence (Superseded):**

- [`MDES_REVIEWS/2026-07-12-suite-mdes.md`](MDES_REVIEWS/2026-07-12-suite-mdes.md)  
- [`MDES_REVIEWS/2026-07-12-suite-mcr.md`](MDES_REVIEWS/2026-07-12-suite-mcr.md)  
- [`MDES_REVIEWS/2026-07-12-suite-mdes-constitutional.md`](MDES_REVIEWS/2026-07-12-suite-mdes-constitutional.md)  
- [`MDES_REVIEWS/2026-07-12-suite-mcr-constitutional.md`](MDES_REVIEWS/2026-07-12-suite-mcr-constitutional.md)  
- [`MDES_REVIEWS/2026-07-12-suite-mdes-excellence.md`](MDES_REVIEWS/2026-07-12-suite-mdes-excellence.md)  
- [`MDES_REVIEWS/2026-07-12-suite-mcr-excellence.md`](MDES_REVIEWS/2026-07-12-suite-mcr-excellence.md)  

**Current evidence (required):**

- [`MDES_REVIEWS/2026-07-12-suite-mdes-excellence-defense.md`](MDES_REVIEWS/2026-07-12-suite-mdes-excellence-defense.md)  
- [`MDES_REVIEWS/2026-07-12-suite-mcr-excellence-defense.md`](MDES_REVIEWS/2026-07-12-suite-mcr-excellence-defense.md)  
- [`MDES_REVIEWS/2026-07-12-references-linkcheck.md`](MDES_REVIEWS/2026-07-12-references-linkcheck.md)  
- [`Governance/ADRS/ADR-0001-intentional-single-architecture-handbook.md`](Governance/ADRS/ADR-0001-intentional-single-architecture-handbook.md)  
- Process: [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md)  

| Document | Status | MDES disposition |
|----------|--------|------------------|
| `SYSTEM_CONTEXT.md` | Complete (constitutional) | Accept |
| `README.md` | Complete | Accept |
| `CHANGELOG.md` | Complete | Accept |
| `GLOSSARY.md` | Complete — lexicon + states | Accept |
| `MDES.md` | Complete (constitutional — documentation quality evaluation) | Accept |
| `MDES_REVIEWS/` | Evidence store | Operational |
| `REFERENCES.md` | Complete — link-check evidence filed | Accept |
| `PRODUCTS.md` | Living catalog — inventory verified 2026-07-12; Declared per-product In progress | Accept (catalog inventory) |
| `Governance/MES_REVIEW_PROCESS.md` | Complete (MDES + MCR + Excellence 10 + conformance states) | Accept |
| `Governance/MOM.md` | Complete — measurable gates + regulated overlay | Accept |
| `Governance/MILE.md` | Complete | Accept |
| `Governance/ADR_GUIDE.md` | Complete — suite ADR path `Governance/ADRS/` | Accept |
| `Governance/ADRS/ADR-0001-…` | Accepted — intentional handbook | Accept |
| `Governance/CONTRIBUTING.md` | Complete — fragment + REFERENCES check shall-run | Accept |
| `Architecture/ARCHITECTURE.md` | Complete (Parts I–XX) — ownership banners; ADR-0001 | Accept |
| `Architecture/C4/*` | Complete | Accept |
| `Architecture/_part_*.md` | Build fragments — not published; fragment guard present | Quarantine OK |
| `AI/INDEX.md` | Complete (AI SoT ownership map) | Accept |
| `AI/*` | Complete | Accept |
| `AI/RAG.md` | Complete — Retrieval Diagnostics | Accept |
| `AI/REGULATED_PROFILES.md` | Complete — adoption workflow | Accept |
| `Engineering/*` | Complete | Accept |
| `Engineering/TESTING.md` | Complete — SoT hierarchy vs Part XV | Accept |
| `Engineering/SECURITY.md` | Complete | Accept |
| `Engineering/OBSERVABILITY.md` | Complete — SLO example shape | Accept |
| `Templates/README.md` | Instantiation index | Accept (index) |
| `Templates/*` | Scaffolds at 1.1.1; high-impact Risk Class / MDES+MCR wired | Mixed Accept/Revise |
| `Templates/MOM_MILE_GREENFIELD_BLUEPRINT.md` | AUDIT rule reconciled; Risk Class on intake | Accept (scaffold) |
| `Templates/PRD_TEMPLATE.md` | Risk Class map + regulated profile | Accept (scaffold) |
| `Templates/ARCHITECTURE_TEMPLATE.md` | Risk Class / side_effect_class on roles | Accept (scaffold) |
| `Templates/VERIFY_TEMPLATE.md` | MDES + MCR release gate | Accept (scaffold) |
| `Templates/THREAT_MODEL_TEMPLATE.md` | side_effect_class + document control | Accept (scaffold) |
| `Templates/CONTRIBUTING_TEMPLATE.md` | MDES + MCR + regulated bans | Accept (scaffold) |
| `Templates/AI_GUIDELINES_TEMPLATE.md` | Expanded minimum viable | Accept (scaffold) |
| `Templates/CLAUDE_TEMPLATE.md` | Expanded minimum viable | Accept (scaffold) |
| `CLAUDE.md` | Complete (constitutional — agent operating contract) | Accept |
| `scripts/check-fragment-citations.ps1` | Suite hygiene guard | Operational |
| `scripts/check-references-links.ps1` | REFERENCES HTTPS link-check | Operational |

**Suite claim:** **Conformant** + **MDES Excellence 10** (MES **1.1.1**) — Suite Owner Accept on defense evidence 2026-07-12 (all criteria 10 / avg 10.0; per-document scorecards). Named exceptions: remaining fill-in template depth; `_part_*` quarantine. PRODUCTS catalog inventory Accept; product Declared separate.

---

## Normative Language

| Term | Meaning |
|------|---------|
| **shall / must** | Mandatory for MES conformance |
| **should** | Strong default; deviation requires ADR |
| **may** | Optional |
| **Example (CareerPilot)** | Illustrative only; not a product requirement of MES |
