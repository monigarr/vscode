# Changelog — MoniGarr Engineering Standards (MES)

All notable changes to this documentation suite are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
MES itself is versioned with Semantic Versioning (`MAJOR.MINOR.PATCH`).

## [Unreleased]

### Added

- `Templates/README.md` — factory instantiation index.
- PRODUCTS lifecycle states; catalog inventory Accept disposition (GitHub-verified 2026-07-12).

### Changed

- High-impact templates polished to MES **1.1.1**: PRD Risk Class map + regulated profile; Architecture role Risk Class / `side_effect_class`; VERIFY MDES+MCR release gate + Risk Class on evals; Blueprint AUDIT rule reconciled + Risk Class on intake; Threat Model `side_effect_class` + document control; CONTRIBUTING template MDES+MCR+regulated bans.
- Remaining `Templates/*` MES Version stamps → **1.1.1**.
- `SYSTEM_CONTEXT.md` Document Status: PRODUCTS Bootstrap removed; template scaffold Accept rows expanded.
- PRODUCTS stub software entries filled from GitHub metadata (visibility + descriptions).

### MES v1.2 backlog (planned)

- PRODUCTS MES Declared campaign (per-product conformance)
- Remaining fill-in template depth where project instantiation needs it
- Optional Architecture handbook split **only if** ADR-0001 closure criteria met
- Hosted CI wiring for fragment + REFERENCES scripts beyond local shall-run
- Optional per-document deep MDES files beyond suite scorecards

## [1.1.1] — 2026-07-12

**Excellence 10 defense** and MES **1.1 line freeze**. Prior same-day Excellence claim superseded by defense evidence with per-document scores. No new architectural concepts introduced.

### Added

- Conformance states; MDES scoring-focus note; Architecture ownership banners (Parts I–XX) + v1.x handbook policy; RAG Retrieval Diagnostics; expanded AI agent templates; REGULATED_PROFILES adoption workflow; constitutional MDES/MCR evidence.
- **MDES Excellence 10** bar + 6/8/10 scoring rubrics (`MDES.md`); GLOSSARY **MDES Excellence 10**.
- MCR checklist #11 Regulated overlays; MOM Regulated Operations Overlay.
- REFERENCES: NIST SP 800-171, OWASP ASVS/API Top 10, EN 301 549, commercial assurance (informative), link-check SHALL; eCFR HIPAA / GovInfo HITECH / DOI NIST AI 600-1 permalinks.
- CONTRIBUTING: PHI/CUI PR bans; agents shall not Accept/Excellence without human confirmation; Material suite claim shall-run for fragment + REFERENCES scripts.
- DOCUMENTATION_STANDARDS: Foundation link-once rule; classification banners.
- PRODUCTS: CareerPilot illustrative-only note.
- Uniform **Regulated readiness** trigger blocks on published normative standards.
- `scripts/check-references-links.ps1`; filed [`MDES_REVIEWS/2026-07-12-references-linkcheck.md`](MDES_REVIEWS/2026-07-12-references-linkcheck.md) (35/35 OK).
- [`Governance/ADRS/ADR-0001-intentional-single-architecture-handbook.md`](Governance/ADRS/ADR-0001-intentional-single-architecture-handbook.md) (Accepted).
- Defense evidence: [`MDES_REVIEWS/2026-07-12-suite-mdes-excellence-defense.md`](MDES_REVIEWS/2026-07-12-suite-mdes-excellence-defense.md), [`…-mcr-excellence-defense.md`](MDES_REVIEWS/2026-07-12-suite-mcr-excellence-defense.md).

### Changed

- Suite disposition → **Conformant** + **MDES Excellence 10** on **defense** evidence (per-document scores; Suite Owner Accept 2026-07-12). Prior Excellence rollup **Superseded**.
- `MES_REVIEW_PROCESS.md` names Excellence 10; definition SoT remains `MDES.md`.
- GLOSSARY / SYSTEM_CONTEXT / MOM / OBSERVABILITY / ARCHITECTURE Part II / SECURITY coherence remediations (see constitutional + defense evidence).

### Fixed

- Retrieval Diagnostics ownership gap; Part XV vs TESTING dual-SoT; agent template stubs.
- Stale canvas xref in `MDES_REVIEWS/README.md`.
- REFERENCES URLs that failed automated link-check (WAF/SSL/permalink drift).

## [1.1.0] — 2026-07-12

Suite remediation (P0–P3) plus **P0 binding**, **P1 coherence**, **P2 completeness**, and **P3 longevity** passes (same calendar day). Constitutional and procedural docs aligned to **1.1.0**. Formal MDES + MCR evidence recorded 2026-07-12: **MDES Conformant** for published standards (Accept); PRODUCTS Bootstrap/Revise; some templates Revise; **Excellence not claimed** suite-wide. Evidence: [`MDES_REVIEWS/2026-07-12-suite-mdes.md`](MDES_REVIEWS/2026-07-12-suite-mdes.md), [`MDES_REVIEWS/2026-07-12-suite-mcr.md`](MDES_REVIEWS/2026-07-12-suite-mcr.md). Process: [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md).

### Added

- `MDES.md` integrated as documentation quality evaluation standard (scoring, thresholds, evidence, disposition); wired into SoT, Suite Map, MOM quality gates, CONTRIBUTING, CLAUDE, DOCUMENTATION_STANDARDS, Architecture Parts XVIII/XX.
- **MDES Excellence** thresholds (no criterion &lt; 9, avg ≥ 9.5) + annotated example evidence record.
- Glossary terms: **MDES**, **MDES Conformant**, **MDES Excellence**, **Risk Class (R0–R4)**, **Side-effect Class**, **Evidence Bundle**, **Material documentation change**, **Material risk**, **Model Gateway**, **Control Plane**, **ClassificationEnforcer**.
- Project scaffolds: `README_TEMPLATE`, `AI_GUIDELINES_TEMPLATE`, `TESTING_TEMPLATE`, `CONTRIBUTING_TEMPLATE`, `CLAUDE_TEMPLATE`, `RUNBOOK_TEMPLATE`, `ONBOARDING_TEMPLATE`, `SYSTEM_PROFILE_TEMPLATE`.
- `AI/INDEX.md` — AI discipline SoT ownership map.
- `scripts/check-fragment-citations.ps1` — quarantine guard against citing `Architecture/_part_*`.
- C4 Level 4 **KillSwitch** required pattern for write/irreversible AI egress.
- `SYSTEM_CONTEXT.md` Secondary Principles and Domain Source-of-Truth Registry.
- `Governance/MOM.md` M.O.M. ↔ M.I.L.E. Interlock section (links Architecture Part XX.5).
- Architecture Part II: Control Plane containers, ClassificationEnforcer, ModelGatewayClient, AuditEmitter, ComplianceReviewer, PolicyClient vs PDP naming, trust-boundary narrative requirement.
- `TESTING.md` Release Gate Hierarchy (golden vs continuous eval).
- `AI/REGULATED_PROFILES.md` — regulated-environment overlays (posture, not certification / ATO / HIPAA claim).
- `REFERENCES.md`: Maintenance section, MES Mapping Index, Healthcare Privacy Rule / Breach Notification starters; title reframed as External Reference Bibliography.
- PRIVACY template Annex A — HIPAA Privacy Rule tailoring starter; THREAT_MODEL AI-T007 PHI/regulated leakage.
- C4 Level 1 Trust Boundary Narrative; C4 Level 2 Control Plane container group (policy, registries, secrets/KMS).
- PRODUCTS catalog bootstrap banner, verification cadence, flagship entries verified 2026-07-12 (incl. AssetNav-AI slug).
- Expanded contract templates: `API_SPEC` (→ `API.md`), `DATA_MODEL`, `EVENT_MODEL`, `DOMAIN_MODEL`.
- `PRD_BROWNFIELD_TEMPLATE.md` intake-only note (prefer full PRD + AUDIT appendix for material brownfield).
- M.I.L.E. index note: discipline index + principles; detailed contracts in `AI/*`; prefer linking over duplicating.
- `Governance/ADR_GUIDE.md`: regulatory/privacy ADR trigger; Compliance Notes for classification/frameworks/accessibility; MDES bar before Accepted.

### Changed

- **P3 longevity:** fragment CI guard; AI/INDEX; Revision History on longevity-weak AI docs; KG harness pin; EVAL artifact retention; MEMORY PHI class; PROMPTS PHI redaction checklist; SUBAGENTS extended-chain label; SECURITY threat-model shall at R2+; OBSERVABILITY version-skew/drift alerts; ONCALL AI PIR fields; CODE_COMMENT `RISK CLASS`; C4 L4 kill-switch.
- **P2 completeness:** PRODUCTS flagship fill + AssetNav-AI URL + quarterly verification rules; contract templates expanded to DOCUMENTATION_STANDARDS bar; missing project scaffolds added; MDES Excellence operationalized; REFERENCES maintenance/mapping; PRIVACY HIPAA Privacy annex.
- **P1 coherence:** `ARCHITECTURE.md` Part II merged with C4 Level 1–3 enrichments (Control Plane, ClassificationEnforcer, PolicyClient/PDP naming).
- **P1 coherence:** AI First vs AI-Native relationship and preferred spellings in GLOSSARY.
- **P1 coherence:** Continuous vs golden eval hierarchy aligned across TESTING, MOM, RELEASE, ENGINEERING_STANDARDS.
- **P1 coherence:** Part XVI toolchain table framed as illustrative MoniGarr defaults (2026) with ADR escape; GLOSSARY DEVOPS index updated.
- **P1 coherence:** Part XVIII mandatory docs aligned to README minimum tree + MDES; Part XX inheritance checklist adds MDES + Risk Class / side-effect class.
- **P1 coherence:** ENGINEERING_STANDARDS Risk Class + MDES gates; CODING_STANDARDS `RISK CLASS` header field + reference-stack framing.
- **P0 binding:** Risk Class R0–R4 bound across MOM, CONTRIBUTING (replaces Low|Medium|High), ADR_GUIDE (quorum + template field), RELEASE_PROCESS, MILE Deploy, CLAUDE AI Constraints.
- **P0 binding:** Dual-control rule unified — R4 workflows **or** `irreversible` side-effect class at R3+ (`AI_GUIDELINES`, `TOOLS`, `LOOP_ENGINEERING`).
- **P0 binding:** Agent/loop contracts use `side_effect_class: read|draft|write|irreversible` (`AGENTS`, `LOOP`, `SUBAGENTS`); legacy `draft_only` spellings removed from templates.
- **P0 binding:** Single canonical minimum project repo tree — suite `README.md`; `ARCHITECTURE_TEMPLATE` §17 and `MOM_MILE_GREENFIELD_BLUEPRINT` §10 mirror it.
- **P0 binding:** Procedural doc headers under `AI/*`, `Engineering/*`, `Architecture/C4/*`, and selected Templates bumped to **1.1.0**; `ARCHITECTURE.md` handbook version **1.1.0**.
- Risk classes aligned suite-wide to **R0–R4** (Advisory → Irreversible/regulated) in ARCHITECTURE, GLOSSARY, AI_GUIDELINES, and HITL language; superseded prior R0–R3 framing in normative places.
- GreenField workflow confirmed as **8 steps**; architecture template long/short roles clarified (`ARCHITECTURE_TEMPLATE.md` panel-grade; `ARCHITECTURE_TEMPLATE_SHORTFORM.md` slide-form).
- `Architecture/_part_*.md` quarantined as build fragments (not published SoT); README Suite Layout notes fragments.
- `SYSTEM_CONTEXT.md` Document Status: MDES-oriented status + **MDES disposition** column (Integrated / Pending re-score / Bootstrap); honest pending re-score after 2026-07-12 remediations.
- DevOps / release language framed as vendor-example (GitHub Actions, Render, Terraform) without strengthening vendor lock-in.
- M.O.M. / M.I.L.E. crown-jewel sections lean toward links over duplicated lifecycle dumps where redundant with standing standards.
- Agent default vs extended team topology clarified (`AGENTS.md` defaults; `SUBAGENTS.md` extended Research/Reasoner).
- Golden eval gates vs continuous eval hierarchy clarified in MOM and RELEASE (continuous supplements golden).
- `AI_GUIDELINES.md`: duplicate Regulated Data Profiles section collapsed to summary + `REGULATED_PROFILES.md` ownership.
- C4 Level 3 Application Services: Policy Engine renamed to **PolicyClient** (PDP remains Control Plane).
- Root constitution headers: `README.md`, `SYSTEM_CONTEXT.md`, `MDES.md`, `GLOSSARY.md`, `CLAUDE.md`, `PRODUCTS.md`, `Governance/MILE.md`, `Governance/MOM.md`, `Governance/CONTRIBUTING.md`, `REFERENCES.md`, `CHANGELOG.md` → **1.1.0**.

### Fixed

- Misnamed architecture short-form template (`ARCHITECTURE_TEMPLATE_LONGFORM` → `ARCHITECTURE_TEMPLATE_SHORTFORM`) and broken self/README references.
- “Step X of 7” / Echelon remnants removed from templates and normative workflow text where found.
- ARCHITECTURE Document Control footer corrected: Parts I–XX complete in the single handbook file.
- Removed published build-seam artifact between Parts VII and VIII (`*End of Parts I–VII...*`).
- ARCHITECTURE conformance claim text updated from MES v1.0 to v1.1.
- Stale R0–R3 risk tables in normative handbook paths (and aligned quarantine fragment table in `_part_01.md` for rebuild hygiene).

### Notes

- Security, healthcare, accessibility, and federal references remain **posture / tailoring starters** — not certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.
- CareerPilot remains illustrative only (`Example (CareerPilot)`).

## [1.0.0] — 2026-07-12

### Added

- MES v1.0 constitution suite structure: `Governance/`, `Architecture/`, `AI/`, `Engineering/`, `Templates/`.
- Guiding statement and source-of-truth hierarchy in `SYSTEM_CONTEXT.md` and `README.md`.
- `Governance/MOM.md` and `Governance/MILE.md` as standing organizational standards.
- `Architecture/ARCHITECTURE.md` Parts I–XX (company-wide engineering handbook).
- C4 companion documents under `Architecture/C4/`.
- AI platform standards under `AI/` (guidelines, agents, RAG, evals, loops, harnesses, prompts, tools, memory, routing).
- Engineering standards under `Engineering/` (coding, testing, security, devops, observability, release, oncall, documentation).
- `Governance/ADR_GUIDE.md` and `Governance/CONTRIBUTING.md`.
- `GLOSSARY.md` for shared terminology.
- Expanded `CLAUDE.md` into the vendor-neutral Agent Operating Contract (mission, decision hierarchy, never/silently rules, evidence, ADR, refactoring, definition of success) while retaining the `CLAUDE.md` filename for Claude Code compatibility.
- `CLAUDE.md` agent operating notes for the MES suite.
- Project instantiation templates relocated to `Templates/`.
- MES Parts conformance checklist added to `Templates/ARCHITECTURE_TEMPLATE.md`.
- `Templates/SECURITY_REQUIREMENTS_DOCUMENTATION.md` marked as deprecated alias of the canonical security template.

### Changed

- Kit README reframed from flat template kit to MES v1.0 engineering constitution index.
- GreenField factory workflow aligned to the eight-step path documented in `README.md`.

### Notes

- CareerPilot appears only as illustrative examples (`Example (CareerPilot)`). This suite is product-agnostic.
- Security and compliance language defines posture and evidence requirements; it does not claim certification.
