# Templates — Project Instantiation Index

**MES Version:** 1.1.1  
**Status:** Living index for GreenField / brownfield scaffolds  
**Parent:** suite [`README.md`](../README.md) factory workflow  
**Rule:** Fill-in templates are scaffolds — project instances must replace `[BRACKET]` placeholders before claiming MES Declared conformance.

---

## Factory path (greenfield)

| Step | Instantiate from | Project artifact |
|---:|---|---|
| 1 | [`MOM_MILE_GREENFIELD_BLUEPRINT.md`](MOM_MILE_GREENFIELD_BLUEPRINT.md) | Intake worksheet (complete before PRD) |
| 2 | [`PRD_TEMPLATE.md`](PRD_TEMPLATE.md) · [`USERS_TEMPLATE.md`](USERS_TEMPLATE.md) | `PRD.md` · `USERS.md` |
| 3 | [`ARCHITECTURE_TEMPLATE.md`](ARCHITECTURE_TEMPLATE.md) | `ARCHITECTURE.md` (Parts I–XX checklist). Shortform: [`ARCHITECTURE_TEMPLATE_SHORTFORM.md`](ARCHITECTURE_TEMPLATE_SHORTFORM.md) — slide scaffold only |
| 4 | [`SECURITY_REQUIREMENTS_TEMPLATE.md`](SECURITY_REQUIREMENTS_TEMPLATE.md) | `SECURITY.md` |
| 5 | [`PRIVACY_DATA_GOVERNANCE_TEMPLATE.md`](PRIVACY_DATA_GOVERNANCE_TEMPLATE.md) | `PRIVACY_DATA_GOVERNANCE.md` (when data triggers apply) |
| 6 | [`THREAT_MODEL_TEMPLATE.md`](THREAT_MODEL_TEMPLATE.md) | `THREAT_MODEL.md` (when security triggers apply) |
| 7 | [`VERIFY_TEMPLATE.md`](VERIFY_TEMPLATE.md) | `VERIFY.md` |

Ops / agent contracts (minimum repo standard as needed):

| Template | Project artifact |
|---|---|
| [`README_TEMPLATE.md`](README_TEMPLATE.md) | `README.md` |
| [`TESTING_TEMPLATE.md`](TESTING_TEMPLATE.md) | `TESTING.md` |
| [`AI_GUIDELINES_TEMPLATE.md`](AI_GUIDELINES_TEMPLATE.md) | `AI_GUIDELINES.md` |
| [`CLAUDE_TEMPLATE.md`](CLAUDE_TEMPLATE.md) | `CLAUDE.md` (vendor-neutral agent contract filename) |
| [`CONTRIBUTING_TEMPLATE.md`](CONTRIBUTING_TEMPLATE.md) | `CONTRIBUTING.md` |
| [`RUNBOOK_TEMPLATE.md`](RUNBOOK_TEMPLATE.md) | `RUNBOOK.md` |
| [`ONBOARDING_TEMPLATE.md`](ONBOARDING_TEMPLATE.md) | `ONBOARDING.md` |
| [`SYSTEM_PROFILE_TEMPLATE.md`](SYSTEM_PROFILE_TEMPLATE.md) | `SYSTEM_PROFILE.md` |

---

## Brownfield / audit

| Template | Use |
|---|---|
| [`AUDIT_TEMPLATE.md`](AUDIT_TEMPLATE.md) | Submission readiness, gaps, evidence inventory — required for regulated/production; brownfield intake |
| [`PRESEARCH_TEMPLATE.md`](PRESEARCH_TEMPLATE.md) | Discovery before factory step 2 |
| [`PRD_BROWNFIELD_TEMPLATE.md`](PRD_BROWNFIELD_TEMPLATE.md) | PRD when inheriting an existing system |

---

## Contracts & models

| Template | Project artifact |
|---|---|
| [`API_SPEC.md`](API_SPEC.md) | `API.md` |
| [`DATA_MODEL.md`](DATA_MODEL.md) | `DATA_MODEL.md` |
| [`EVENT_MODEL.md`](EVENT_MODEL.md) | `EVENT_MODEL.md` |
| [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md) | `DOMAIN_MODEL.md` |

---

## Governance companions (project copies)

| Template | Notes |
|---|---|
| [`MOM_TEMPLATE.md`](MOM_TEMPLATE.md) | Project MOM overlay when needed |
| [`MILE_TEMPLATE.md`](MILE_TEMPLATE.md) | Project MILE overlay when needed |
| [`AUTHOR_ORGANIZATION.md`](AUTHOR_ORGANIZATION.md) | Authoring / org metadata |
| [`CODE_COMMENT_HEADER_TEMPLATE.md`](CODE_COMMENT_HEADER_TEMPLATE.md) | Source file header convention |

---

## Deprecated aliases

| File | Canonical |
|---|---|
| [`SECURITY_REQUIREMENTS_DOCUMENTATION.md`](SECURITY_REQUIREMENTS_DOCUMENTATION.md) | Use [`SECURITY_REQUIREMENTS_TEMPLATE.md`](SECURITY_REQUIREMENTS_TEMPLATE.md) |

---

## Scaffold disposition (suite)

Templates are **not** scored under suite **MDES Excellence 10** (published standards only). High-impact scaffolds (PRD, Architecture, VERIFY, Blueprint, Threat Model, agent contracts, CONTRIBUTING) are maintained at MES **1.1.1** with Risk Class / MDES+MCR wiring. Remaining fill-ins may stay Revise until a project instantiation campaign needs depth.
