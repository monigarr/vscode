# MoniGarr Engineering Standards (MES) v1.1

**Owner:** Monica Peters / MoniGarr.com LLC  
**Version:** 1.1.0  
**Status:** Active  
**Last updated:** 2026-07-12  
**Classification:** Internal engineering constitution / Project-adaptable

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

This repository is the version-controlled **MoniGarr Engineering Standards (MES)** suite — the constitution for how MoniGarr designs, builds, evaluates, deploys, operates, and improves software across the entire company portfolio.

It is written for both human engineers and AI coding agents (Codex, Cursor, Claude Code, Gemini CLI, and equivalents).

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`AI/REGULATED_PROFILES.md`](AI/REGULATED_PROFILES.md), map external authorities via [`REFERENCES.md`](REFERENCES.md), and follow the Regulated Operations Overlay in [`Governance/MOM.md`](Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Start Here

| Audience | Reading order |
|----------|----------------|
| New human engineer | `SYSTEM_CONTEXT.md` → `Governance/MOM.md` → `Governance/MILE.md` → `Architecture/ARCHITECTURE.md` Part I & XX → `Governance/CONTRIBUTING.md` |
| AI coding agent | `SYSTEM_CONTEXT.md` → `Governance/CONTRIBUTING.md` → `AI/AI_GUIDELINES.md` → `Architecture/ARCHITECTURE.md` Parts III, VIII–XIII → project templates as needed |
| Architect / tech lead | `Architecture/ARCHITECTURE.md` (all parts) → `Governance/ADR_GUIDE.md` → `Engineering/*` |
| GreenField project kickoff | Eight-step factory workflow below → instantiate from `Templates/` |
| Documentation reviewer | [`MDES.md`](MDES.md) → [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md) → [`Engineering/DOCUMENTATION_STANDARDS.md`](Engineering/DOCUMENTATION_STANDARDS.md) → target doc |
| Brownfield / audit | [`Templates/AUDIT_TEMPLATE.md`](Templates/AUDIT_TEMPLATE.md) → [`Templates/PRESEARCH_TEMPLATE.md`](Templates/PRESEARCH_TEMPLATE.md) → gap list → factory step 2+ |
| Regulated / gov / healthcare | [`REFERENCES.md`](REFERENCES.md) → [`AI/REGULATED_PROFILES.md`](AI/REGULATED_PROFILES.md) → security/privacy templates |

Full context and conflict rules: [`SYSTEM_CONTEXT.md`](SYSTEM_CONTEXT.md).  
Shared terms: [`GLOSSARY.md`](GLOSSARY.md).  
Product portfolio: [`PRODUCTS.md`](PRODUCTS.md).  
Version history: [`CHANGELOG.md`](CHANGELOG.md).  
Documentation quality: [`MDES.md`](MDES.md).  
Review process (MDES + MCR): [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md).  
Filed evidence: [`MDES_REVIEWS/`](MDES_REVIEWS/).

---

## Suite Layout

```text
MoniGarr_Engineering_Standards/
├── README.md
├── SYSTEM_CONTEXT.md
├── CHANGELOG.md
├── GLOSSARY.md
├── PRODUCTS.md                      # Portfolio catalog (software, content, sites, channels)
├── CLAUDE.md                        # Canonical Agent Operating Contract for this suite
├── REFERENCES.md
├── MDES.md                          # Documentation quality evaluation standard
├── Governance/
│   ├── MOM.md
│   ├── MILE.md
│   ├── ADR_GUIDE.md
│   ├── CONTRIBUTING.md
│   └── MES_REVIEW_PROCESS.md  # MDES + MCR lifecycle
├── MDES_REVIEWS/                # Filed MDES / MCR evidence
├── Architecture/
│   ├── ARCHITECTURE.md          # Parts I–XX (published)
│   ├── _part_*.md               # Build fragments — not published
│   └── C4/
│       ├── Level1_Context.md
│       ├── Level2_Container.md
│       ├── Level3_Component.md
│       └── Level4_Code.md
├── AI/
│   ├── INDEX.md                 # AI SoT ownership map
│   ├── AI_GUIDELINES.md
│   ├── AGENTS.md
│   ├── SUBAGENTS.md
│   ├── PROMPTS.md
│   ├── TOOLS.md
│   ├── RAG.md
│   ├── KNOWLEDGE_GRAPH.md
│   ├── EVALS.md
│   ├── GOLDEN_DATASETS.md
│   ├── LOOP_ENGINEERING.md
│   ├── HARNESS_ENGINEERING.md
│   ├── MODEL_ROUTING.md
│   ├── MEMORY.md
│   └── REGULATED_PROFILES.md
├── Engineering/
│   ├── ENGINEERING_STANDARDS.md
│   ├── CODING_STANDARDS.md
│   ├── DOCUMENTATION_STANDARDS.md
│   ├── TESTING.md
│   ├── SECURITY.md
│   ├── OBSERVABILITY.md
│   ├── DEVOPS.md
│   ├── RELEASE_PROCESS.md
│   └── ONCALL.md
├── Templates/                   # Per-project instantiation scaffolds (see Templates/README.md)
│   # Core factory: MOM_MILE_GREENFIELD_BLUEPRINT, PRD, ARCHITECTURE (± shortform),
│   # SECURITY, PRIVACY, THREAT_MODEL, VERIFY, USERS, AUDIT, PRESEARCH
│   # Project minimum scaffolds: README_TEMPLATE, AI_GUIDELINES_TEMPLATE,
│   # TESTING_TEMPLATE, CONTRIBUTING_TEMPLATE, CLAUDE_TEMPLATE, RUNBOOK_TEMPLATE,
│   # ONBOARDING_TEMPLATE, SYSTEM_PROFILE_TEMPLATE
│   # Contracts: API_SPEC (→ API.md), DATA_MODEL, EVENT_MODEL, DOMAIN_MODEL
│   # Pointers (do not fork): MOM_TEMPLATE, MILE_TEMPLATE, SECURITY_REQUIREMENTS_DOCUMENTATION
└── scripts/
    ├── check-fragment-citations.ps1  # Quarantine guard for Architecture/_part_*
    └── check-references-links.ps1    # HTTPS link-check for REFERENCES.md
```

---

## Suite hygiene

- **Published architecture SoT:** [`Architecture/ARCHITECTURE.md`](Architecture/ARCHITECTURE.md) only.  
- **Build fragments** (`Architecture/_part_*.md`) are not published; do not cite them. Run `scripts/check-fragment-citations.ps1` before suite releases.  
- **REFERENCES link-check:** Run `scripts/check-references-links.ps1` before Material suite MDES/MCR claims; file evidence under `MDES_REVIEWS/`.  
- **AI concept ownership:** [`AI/INDEX.md`](AI/INDEX.md).

---

## M.O.M. + M.I.L.E.

| Standard | Document | Role |
|----------|----------|------|
| **M.O.M.** — MoniGarr Operating Model | [`Governance/MOM.md`](Governance/MOM.md) | Governance, ADRs, rituals, documentation, quality gates, lifecycle |
| **M.I.L.E.** — MoniGarr Intelligence Led Engineering | [`Governance/MILE.md`](Governance/MILE.md) | AI platform discipline: agents, evals, retrieval, loops, harnesses, HITL |

These are the engineering operating system — not branding. Crown-jewel synthesis: [`Architecture/ARCHITECTURE.md`](Architecture/ARCHITECTURE.md) Part XX.

---

## Recommended GreenField Factory Workflow (8 steps)

1. Complete intake using [`Templates/MOM_MILE_GREENFIELD_BLUEPRINT.md`](Templates/MOM_MILE_GREENFIELD_BLUEPRINT.md).  
2. Create `PRD.md` from [`Templates/PRD_TEMPLATE.md`](Templates/PRD_TEMPLATE.md); companion personas from [`Templates/USERS_TEMPLATE.md`](Templates/USERS_TEMPLATE.md).  
3. Create project `ARCHITECTURE.md` from [`Templates/ARCHITECTURE_TEMPLATE.md`](Templates/ARCHITECTURE_TEMPLATE.md) (panel-grade long form) and map conformance to MES Parts I–XX. Optional slide-form scaffold: [`Templates/ARCHITECTURE_TEMPLATE_SHORTFORM.md`](Templates/ARCHITECTURE_TEMPLATE_SHORTFORM.md).  
4. Create `SECURITY.md` from [`Templates/SECURITY_REQUIREMENTS_TEMPLATE.md`](Templates/SECURITY_REQUIREMENTS_TEMPLATE.md).  
5. Create `PRIVACY_DATA_GOVERNANCE.md` from [`Templates/PRIVACY_DATA_GOVERNANCE_TEMPLATE.md`](Templates/PRIVACY_DATA_GOVERNANCE_TEMPLATE.md) when the project handles non-public, regulated, CUI, classified, privacy-sensitive, AI-training, or sovereign/community-protected data.  
6. Create `THREAT_MODEL.md` from [`Templates/THREAT_MODEL_TEMPLATE.md`](Templates/THREAT_MODEL_TEMPLATE.md) for security-critical, externally exposed, AI-enabled, multi-tenant, federal, regulated, or mission-impacting systems.  
7. Create `VERIFY.md` from [`Templates/VERIFY_TEMPLATE.md`](Templates/VERIFY_TEMPLATE.md) before serious implementation; instantiate project ops docs from `README_TEMPLATE`, `TESTING_TEMPLATE`, `AI_GUIDELINES_TEMPLATE`, `CLAUDE_TEMPLATE`, `CONTRIBUTING_TEMPLATE`, `RUNBOOK_TEMPLATE`, `ONBOARDING_TEMPLATE`, `SYSTEM_PROFILE_TEMPLATE` as needed for the minimum repo standard.  
8. Require evidence before deployment: tests, evals, logs, screenshots, traces, SBOMs, approvals, scans, and release records.

Brownfield intake may begin with [`Templates/AUDIT_TEMPLATE.md`](Templates/AUDIT_TEMPLATE.md) and [`Templates/PRESEARCH_TEMPLATE.md`](Templates/PRESEARCH_TEMPLATE.md) before step 2. Contract docs: instantiate `API.md` from [`Templates/API_SPEC.md`](Templates/API_SPEC.md); `DATA_MODEL.md` / `EVENT_MODEL.md` / `DOMAIN_MODEL.md` when in scope.

---

## Minimum Project Repository Standard

```text
project-root/
├── README.md
├── PRD.md
├── ARCHITECTURE.md
├── USERS.md
├── API.md
├── DATA_MODEL.md
├── SECURITY.md
├── PRIVACY_DATA_GOVERNANCE.md   # when applicable
├── THREAT_MODEL.md              # when applicable
├── VERIFY.md
├── AI_GUIDELINES.md
├── TESTING.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CLAUDE.md                    # or equivalent agent contract
├── SYSTEM_PROFILE.md
├── RUNBOOK.md
├── ONBOARDING.md
├── DECISIONS.md                 # ADR index / links
├── LICENSE
├── .env.example
├── docs/
│   ├── ADRS/
│   └── DEPLOYMENT.md
├── evals/
├── tests/
├── src/
└── scripts/
```

---

## Template Tailoring Rules

- Replace bracketed placeholders such as `[PROJECT_NAME]`, `[OWNER]`, `[SYSTEM_BOUNDARY]`, and `[AUTHORITY]`.  
- Some agent-optimized scaffolds (`USERS_TEMPLATE`, `AUDIT_TEMPLATE`, `ARCHITECTURE_TEMPLATE_SHORTFORM`) also use `{{DOUBLE_BRACE}}` markers — treat both conventions as fill-in targets; prefer `[BRACKET]` for new normative templates.  
- Do not remove security, privacy, verification, or human approval sections; mark `Not Applicable` only with rationale.  
- Treat federal references as starter architecture language, not automatic compliance certification.  
- Keep root documents synchronized. If `PRD.md` changes product intent, update architecture, security, verify, and traceability artifacts.  
- Every project architecture shall complete the MES Parts mapping checklist in [`Templates/ARCHITECTURE_TEMPLATE.md`](Templates/ARCHITECTURE_TEMPLATE.md) (long form). Use [`Templates/ARCHITECTURE_TEMPLATE_SHORTFORM.md`](Templates/ARCHITECTURE_TEMPLATE_SHORTFORM.md) only as a slide-form scaffold — not a substitute for the Parts mapping checklist.  
- The **Minimum Project Repository Standard** in this README is the **canonical** project tree. Templates and blueprints **shall** mirror it, not invent alternate inventories.

---

## Acceptance Standard

A project is not production-ready until a reviewer can answer:

1. What is the system?  
2. Who is it for?  
3. What is it not allowed to do?  
4. Where does AI help, and where is AI bounded?  
5. What deterministic proof shows it works?  
6. What does a human still approve?  
7. What happens when it fails?  
8. How is sensitive data classified, protected, retained, and disposed?  
9. What security controls apply, who approved them, and what evidence proves implementation?  
10. How does a new engineer or AI agent run, test, and safely change it?  
11. Which golden evaluations and harnesses gate this release?  
12. Which MES Parts does the project claim conformance to?  
13. Has documentation been MDES-evaluated **and** MCR-checked where required, with evidence filed?

---

## Scope Boundary

MES defines **how** MoniGarr engineers software. It does not implement product code. Illustrative domains (for example CareerPilot agent teams or knowledge graphs) clarify patterns only.
