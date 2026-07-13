# RELEASE_PROCESS — Versioning, Promotion, Evidence, Rollback

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All Products, Services, Repositories  
**Canonical Path:** `Engineering/RELEASE_PROCESS.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) · [`../Governance/MOM.md`](../Governance/MOM.md) · [`../Governance/MILE.md`](../Governance/MILE.md) · [`ENGINEERING_STANDARDS.md`](ENGINEERING_STANDARDS.md) · [`TESTING.md`](TESTING.md) · [`SECURITY.md`](SECURITY.md) · [`DEVOPS.md`](DEVOPS.md) · [`OBSERVABILITY.md`](OBSERVABILITY.md) · [`ONCALL.md`](ONCALL.md) · [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) · [`../GLOSSARY.md`](../GLOSSARY.md)

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

This standard is **company-wide**.

---

## Purpose

Releases turn validated changes into production behavior under human accountability. This document defines versioning, promotion gates, evidence packs, communication, hotfixes, and rollback.

A release is not “main deployed.” A release is a **controlled promotion with proof**.

---

## Versioning

Default versioning scheme: **Semantic Versioning** (`MAJOR.MINOR.PATCH`).

| Bump | When |
|------|------|
| MAJOR | Breaking API/behavior for external consumers |
| MINOR | Backward-compatible feature |
| PATCH | Backward-compatible bugfix / security patch |

Additional labels **may** include pre-release (`-rc.1`) and build metadata.

Artifacts **shall** be traceable to a git commit SHA. Container tags **should** include semver and/or SHA ([`DEVOPS.md`](DEVOPS.md)).

Prompt packs, retrieval indexes, and eval suite versions **shall** be recorded alongside application versions when AI behavior ships.

---

## Release Train Overview

```text
PR merge → CI green → staging deploy → staging verification
  → release candidate / tag → production approvals → production deploy
  → smoke + watch → done / rollback
```

### Normative control points vs example implementations

**Normative:** reviewed merge, green gates (including evals when AI-affecting), staging verification, evidence pack, human production approval, SBOM/scan evidence, rollback path, post-deploy watch. Tooling brand is not the control.

**Example implementations (defaults with ADR escape):** GitHub Actions Environments, Render (or peer PaaS) deploys, Terraform-managed infra, cloud-native pipelines. Substitutions **shall** map to the same control points in an ADR ([`DEVOPS.md`](DEVOPS.md)).

---

## Preconditions to Release

Before production promotion, the following **shall** be true:

1. Changes merged through reviewed PRs (hotfixes: see expedited path)  
2. CI gates green on the release commit  
3. Deterministic tests meeting project floors / targets ([`TESTING.md`](TESTING.md))  
4. AI **golden** eval gates green when AI-affecting (continuous eval supplements — does not replace — pre-release golden gates; see [`TESTING.md`](TESTING.md) and [`../Governance/MOM.md`](../Governance/MOM.md))  
5. Security scans acceptable or residual risk approved  
6. Docs/contracts updated for behavior changes  
7. Migration plan (forward + rollback) when schema changes  
8. Observability dashboards and alerts ready for new failure modes  
9. On-call aware of the release window for **R3+** changes  
10. Risk Class declared for AI-affecting and production-path changes (R0–R4); R3+ Evidence Pack complete; R4 dual-control or designated approver satisfied ([`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md))  
11. Regulated overlays verified when a profile is adopted ([`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md))  

---

## Evidence Pack

Production releases **shall** retain or link an evidence pack including, as applicable:

- Commit SHA / tag  
- CI run URLs  
- Test and coverage summaries  
- Eval reports and thresholds  
- SBOM / scan summaries  
- Migration notes  
- Risk Class (R0–R4) and HITL/approval artifacts for R2+  
- Approver identities and timestamps (dual-control for R4)  
- Rollback procedure reference  

Evidence enables audits and future agents to understand *why* something shipped.

---

## Staging Verification

Staging **shall** exercise:

- Critical journey smoke tests  
- Migration apply on staging-like data  
- Eval suite (AI) against staging configuration  
- Config parity checks (feature flags, model routing)  

Production data **shall not** be copied to staging without approved controls.

**Example (CareerPilot):** Staging verification includes match API smoke, retrieval index version check, and golden eval suite against the release candidate prompt pack — illustrative only.

---

## Production Promotion Gates

| Gate | Owner |
|------|-------|
| Technical CI/CD green | Engineering |
| Eval thresholds | AI/engineering owner |
| Security residual risk (if any) | Security owner / accountable human |
| Product acceptance for user-visible material change | Product owner as required |
| Environment approval | Designated approvers in the deploy platform (reference: GitHub Environments / Render / cloud IAM) |
| Risk Class R3+ HITL | Architecture/domain owner + Evidence Pack |
| Risk Class R4 | Dual-control or designated approver per [`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md) |

Humans remain accountable for production risk acceptance. Agents **may** prepare checklists; they **shall not** self-approve R3+ production risk.

---

## Release Communication

Material releases **should** communicate:

- What changed (user-facing and operational)  
- Risk notes / feature flags  
- Monitoring focus  
- Rollback triggers  

Prefer short release notes in repo (e.g., `CHANGELOG` / forge release notes) over oral-only announcements.

---

## Database & Data Migrations

Migrations **shall**:

- Be backward compatible across rolling deploys when possible (expand/contract)  
- Have a documented rollback or forward-fix strategy  
- Be tested on staging before production  
- Avoid long exclusive locks without plan  

Data backfills **should** be rate-limited and observable.

---

## Feature Flags & Progressive Delivery

Risky changes **should** use:

- Feature flags  
- Percentage rollouts  
- Cohort targeting  

Flags **shall** have owners and cleanup dates. Permanent flags without review become configuration debt.

---

## Hotfix Process

Hotfixes address Sev-1/Sev-2 production defects or critical security issues.

Hotfix **shall**:

1. Branch from the production-released commit when needed  
2. Keep the change minimal  
3. Run proportional tests/evals (cannot skip security for convenience)  
4. Record follow-up tickets for missing full-suite coverage  
5. Merge back to main promptly  

Expedited is not uncontrolled.

---

## Rollback & Forward Fix

Every production deploy **shall** have a known recovery path:

| Strategy | When |
|----------|------|
| Redeploy previous artifact | Preferred for app-only regressions |
| Toggle feature flag off | When change is flagged |
| Forward fix | When rollback is unsafe (expansive data migration) |
| Data restore | Last resort; follow backup policy |

Rollback drills **should** occur periodically for critical systems.

Decision to rollback vs forward-fix is an on-call/incident call with engineering owner input ([`ONCALL.md`](ONCALL.md)).

---

## AI-Specific Release Rules

When shipping prompt, model, retrieval, or agent changes:

- Version the artifact explicitly  
- Map the change to Risk Class R0–R4 and side-effect class (`read` | `draft` | `write` | `irreversible`)  
- Run golden evals; block on threshold failure  
- Compare cost/latency budgets  
- Confirm HITL paths still function (R2+ externalization; R3+ production; R4 dual-control)  
- Prefer canary or cohort rollout for user-visible model/prompt changes  
- Watch hallucination/grounding dashboards post-deploy ([`OBSERVABILITY.md`](OBSERVABILITY.md))  

Silent prompt edits in production consoles are non-conformant.

---

## Library / Package Releases

Published libraries **shall**:

- Follow SemVer carefully  
- Document breaking changes  
- Run consumer contract tests when available  
- Sign/publish via approved registries only  

---

## Release Roles

| Role | Duty |
|------|------|
| Release engineer / owner | Execute promotion checklist |
| Approver | Accept production risk |
| On-call | Watch and respond during window |
| Security | Advise on vulnerability/risk acceptance |
| Product | Accept user-visible outcomes when required |

---

## Cadence

Teams **may** use continuous deployment for low-risk services or scheduled trains for higher-risk systems. Cadence choice **should** be ADR-backed when it affects compliance or customer commitments.

DORA metrics (deployment frequency, lead time, MTTR, change failure rate) **should** be reviewed under M.O.M. rituals without gaming safety gates.

---

## Post-Release Watch

After production deploy:

- Monitor golden signals and AI quality/cost dashboards  
- Confirm smoke success  
- Remain available for the agreed soak window on material releases  
- File defects immediately; prefer rollback when user impact is unclear and recovery is safe  

---

## Anti-Patterns

- Deploying untagged `main` without evidence links  
- Skipping staging “because it’s urgent” for non-hotfix changes  
- Changing prompts in prod without eval  
- Migrations without rollback story  
- Approving one’s own production deploy when policy requires two-person control  
- No changelog for user-visible behavior  

---

## Conformance Checklist

- [ ] SemVer (or ADR-documented scheme) in use  
- [ ] Promotion path documented and automated where practical  
- [ ] Evidence pack retained per release  
- [ ] Staging verification defined  
- [ ] Rollback path known  
- [ ] AI artifact versions recorded when applicable  
- [ ] Hotfix rules understood by on-call  

---

## See Also

- [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md)  
- [`../Governance/MOM.md`](../Governance/MOM.md)  
- [`DEVOPS.md`](DEVOPS.md) · [`TESTING.md`](TESTING.md) · [`ONCALL.md`](ONCALL.md) · [`OBSERVABILITY.md`](OBSERVABILITY.md) · [`SECURITY.md`](SECURITY.md)
