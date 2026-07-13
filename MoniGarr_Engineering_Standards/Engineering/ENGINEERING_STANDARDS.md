# ENGINEERING_STANDARDS — Company-Wide Baseline

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All Products, Services, Repositories  
**Canonical Path:** `Engineering/ENGINEERING_STANDARDS.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) · [`../Governance/MOM.md`](../Governance/MOM.md) · [`../Governance/MILE.md`](../Governance/MILE.md) · [`../Governance/ADR_GUIDE.md`](../Governance/ADR_GUIDE.md) · [`../Governance/CONTRIBUTING.md`](../Governance/CONTRIBUTING.md) · [`CODING_STANDARDS.md`](CODING_STANDARDS.md) · [`DOCUMENTATION_STANDARDS.md`](DOCUMENTATION_STANDARDS.md) · [`TESTING.md`](TESTING.md) · [`SECURITY.md`](SECURITY.md) · [`OBSERVABILITY.md`](OBSERVABILITY.md) · [`DEVOPS.md`](DEVOPS.md) · [`RELEASE_PROCESS.md`](RELEASE_PROCESS.md) · [`ONCALL.md`](ONCALL.md) · [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) · [`../GLOSSARY.md`](../GLOSSARY.md)

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
| **Example (CareerPilot)** | Illustrative only — not a MES product requirement |

This document is **company-wide**. Product names appear only as labeled illustrations.

---

## Purpose

This document is the company-wide engineering baseline for MoniGarr. It aggregates non-negotiable expectations that every product repository inherits. Language-, domain-, and AI-specific depth lives in sibling Engineering and AI documents; this file is the umbrella.

Every engineer and AI coding agent working in a MES-conformant repository **shall** treat this baseline as binding unless a project ADR documents and accepts a scoped deviation.

---

## Engineering Outcomes We Optimize For

In priority order aligned with M.O.M.:

1. Customer and business outcomes  
2. Correctness and safety  
3. Maintainability and handoff readiness  
4. Reliability and operability  
5. Security and privacy posture  
6. Observability and evaluability  
7. Sustainable delivery pace  

Feature count and raw velocity are not success metrics. Shipping quickly is useful only when the software creates measurable value that future humans and agents can still operate.

---

## System Qualities (Every Production Path)

Every production system **shall** be:

| Quality | Expectation |
|---------|-------------|
| **Functional** | Meets acceptance criteria in PRD / stories |
| **Tested** | Automated proof for critical paths per [`TESTING.md`](TESTING.md) |
| **Evaluated** | Golden evals when AI/probabilistic components exist |
| **Documented** | Repo artifacts sufficient for new humans and agents per [`DOCUMENTATION_STANDARDS.md`](DOCUMENTATION_STANDARDS.md) |
| **Secure** | Controls + evidence per [`SECURITY.md`](SECURITY.md) |
| **Observable** | Logs, metrics, traces, alerts per [`OBSERVABILITY.md`](OBSERVABILITY.md) |
| **Operable** | Runbooks, health checks, rollback per [`ONCALL.md`](ONCALL.md) |
| **Performant** | Meets published latency/cost budgets |
| **Accessible** | UI paths meet project a11y bar |
| **Governable** | ADRs, ownership, change control per [`../Governance/MOM.md`](../Governance/MOM.md) |

A demo that “works once” is not production-ready. Production-ready means the acceptance standard in the MES README can be answered with evidence.

---

## Architecture Discipline

Before material implementation, projects **shall** establish:

1. Problem and users understood  
2. `PRD.md` current  
3. Project `ARCHITECTURE.md` current and mapped to MES Architecture Parts  
4. Data model and API contracts drafted  
5. Security / privacy / threat artifacts as required by factory workflow  
6. `VERIFY.md` lists proof commands  

Coding before architecture review is non-conformant for greenfield production systems.

Significant decisions **shall** use ADRs ([`../Governance/ADR_GUIDE.md`](../Governance/ADR_GUIDE.md)). Architecture mapping **shall** remain consistent with [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md).

Brownfield work **should** begin with audit and presearch templates before large rewrites.

---

## Design Defaults

| Topic | Default |
|-------|---------|
| Complexity | Prefer simple, explicit designs |
| Boundaries | Clear module/service ownership |
| Contracts | Schema-validated at trust boundaries |
| State | Explicit; avoid hidden side effects |
| Time | UTC in storage; document display TZ |
| Idempotency | For retried external side effects |
| Feature flags | For risky rollouts |
| Dependencies | Prefer maintained, license-reviewed libraries |
| Build vs buy | Open standards → OSS → commercial API → custom |
| Fail mode | Fail closed for authZ, audit, and safety-critical paths |

Deviations **should** be ADR-backed. Cleverness that reduces future handoff readiness is debt, not excellence.

---

## Code Ownership & Handoff

- Every production module **shall** have an owner (human team or named role).  
- Repositories **shall** be runnable from documented steps without tribal Slack knowledge.  
- “Handoff-ready” means a qualified engineer or AI agent can understand, run, test, and safely change the system from repo artifacts alone.  
- Ownership changes **shall** update headers, CODEOWNERS (or equivalent), and on-call maps together.

Silent ownership (“whoever last touched it”) is non-conformant for production paths.

---

## AI-Affecting Engineering

When models, agents, RAG/GraphRAG, prompts, or tools are involved, projects **shall**:

- Follow M.I.L.E. ([`../Governance/MILE.md`](../Governance/MILE.md)) and [`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md)  
- Map every AI workflow to **Risk Class R0–R4** and tool/agent **side-effect class** (`read` \| `draft` \| `write` \| `irreversible`)  
- Keep a deterministic policy that authorizes tools and data access  
- Version prompts and retrieval configs like code  
- Gate releases with **golden** evals (continuous eval supplements; does not replace)  
- Require HITL for R2+ externalization and R3+ production paths (R4 dual-control or designated approver)  
- Emit telemetry covering quality, cost, latency, and hallucination signals per [`OBSERVABILITY.md`](OBSERVABILITY.md)  

AI accelerates delivery; it does not replace deterministic proof or human accountability.

**Example (CareerPilot):** A job-matching agent team is engineered as bounded tools + GraphRAG grounding + eval gates — not as a single unsupervised chat model. Illustrative only.

---

## Quality Gates (Summary)

| Gate | When |
|------|------|
| Lint / format / types | Every PR |
| Unit / integration tests | Every behavioral PR |
| Security scans | Every production repo CI |
| Eval thresholds (golden) | Every AI-affecting release |
| Doc sync | Every behavior change |
| MDES evaluation | Material documentation changes ([`../MDES.md`](../MDES.md)) |
| Human approval | R3+ production risk (R4 dual-control) |
| SBOM / release record | Production release |

Details: [`TESTING.md`](TESTING.md), [`RELEASE_PROCESS.md`](RELEASE_PROCESS.md), [`SECURITY.md`](SECURITY.md), [`DEVOPS.md`](DEVOPS.md), [`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md).

Gates that are skipped without an ADR and residual-risk note are non-conformant.

---

## Environments

| Environment | Purpose | Data |
|-------------|---------|------|
| Local | Dev and agent sandbox | Synthetic / fixture |
| CI | Automated gates | Synthetic / fixture |
| Staging | Pre-prod validation | Anonymized or synthetic |
| Production | Customer traffic | Real; least privilege |

Promotion rules: [`RELEASE_PROCESS.md`](RELEASE_PROCESS.md) · [`DEVOPS.md`](DEVOPS.md).

Production data **shall not** be copied to local or CI without an approved, logged exception and redaction plan.

---

## Technical Debt

- Debt is allowed when conscious, recorded, and time-bounded.  
- Silent debt (TODO without owner/date, skipped gates, undocumented shortcuts) is non-conformant.  
- Prefer fixing adjacent mess when touching a module (“leave it better”).  
- Debt that blocks handoff readiness or security posture **shall** be prioritized over cosmetic refactors.

Every conscious debt item **should** include: owner, rationale, risk, and target resolution window.

---

## Performance & Cost

- Publish budgets for latency, error rate, and (for AI) tokens/cost per critical journey.  
- Regressions beyond budget require fix or explicit acceptance recorded in release notes or ADR.  
- Load and soak tests for externally exposed or high-fanout paths as risk warrants.  
- Prefer measuring before optimizing; premature micro-optimization that obscures clarity is discouraged.

**Example (CareerPilot):** A recommendations journey may publish p95 latency and cost-per-match budgets enforced in staging eval reports before production promotion — illustrative only.

---

## Accessibility & Internationalization

- Interactive UI **should** meet WCAG 2.2 AA unless an ADR documents a narrower bar.  
- User-visible strings **should** be externalizable when i18n is in scope.  
- Do not rely on color alone for state.  
- AI-generated UI copy **shall** still meet accessibility and clarity standards before ship.

---

## Dependency & Supply Chain

- Pin versions in lockfiles for applications.  
- Review new dependencies for license, maintenance, and security.  
- Generate SBOM evidence for production releases.  
- Prefer minimal dependency surface.  
- Prefer maintained upstreams; abandoned libraries require a migration plan or ADR.

Supply-chain incidents are engineering incidents; treat dependency compromise with the same severity discipline as application compromise.

---

## Collaboration Norms

- Conventional commits preferred (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`).  
- Small PRs; rapid review.  
- Critique code and design, not people.  
- AI assistance disclosed for substantial authorship ([`../Governance/CONTRIBUTING.md`](../Governance/CONTRIBUTING.md)).  
- Prefer mergeable, reviewable diffs over large multi-concern dumps.

---

## Change Control

Material changes **shall** update, in the same change set when practical:

- Behavior-facing documentation  
- Tests and/or evals  
- Architecture or ADR when decisions change  
- Observability and runbooks when failure modes change  

“Code only” PRs for behavior changes are non-conformant.

---

## Reliability Expectations

Production services **shall** define:

- Health and readiness probes  
- Explicit degradation modes  
- Rollback path  
- Alerting for user-visible failure classes  
- Retention and backup expectations for durable state  

Reliability is not implied by uptime marketing; it is evidenced by probes, runbooks, and recovery drills.

---

## Privacy & Data Handling (Engineering View)

Engineering teams **shall**:

- Classify data at system boundaries  
- Minimize collection and retention  
- Redact PII/CUI from routine logs  
- Separate training/eval corpora from production customer data unless explicitly authorized  

Project privacy artifacts are required when handling non-public, regulated, CUI, classified, privacy-sensitive, AI-training, or sovereign/community-protected data.

---

## KPI Alignment

Track and review (cadence per M.O.M.):

- Deployment frequency, lead time, MTTR, change failure rate  
- Defect escape rate, coverage / mutation where used  
- Eval pass rate, hallucination rate (AI systems)  
- Customer/outcome metrics and sustainable engineering pace  

KPIs inform improvement; they do not justify shipping unsafe or undocumented systems.

---

## Roles & Accountability

| Role | Accountability |
|------|----------------|
| Product / domain owner | Outcomes and prioritization |
| Engineering owner | Implementation quality, operability, handoff readiness |
| Security owner | Control posture and evidence for the system |
| On-call | Incident response per [`ONCALL.md`](ONCALL.md) |
| Human approver | Material production risk decisions |

AI agents may draft, test, and propose; humans remain accountable for production risk acceptance.

---

## Conformance Checklist

A repository claiming MES engineering conformance can answer yes to:

- [ ] Linked to MES from README  
- [ ] Architecture mapped to MES Parts  
- [ ] Quality gates enforced in CI  
- [ ] Security, testing, observability, release, on-call docs present or inherited  
- [ ] ADRs for significant decisions and MES deviations  
- [ ] Handoff-ready onboarding for humans and agents  
- [ ] VERIFY.md or equivalent evidence plan for critical paths  
- [ ] Environments and promotion rules documented  

Non-conformance without ADR is a process defect, not an informal exception.

---

## Relationship to Sibling Standards

| Document | Role |
|----------|------|
| [`CODING_STANDARDS.md`](CODING_STANDARDS.md) | How we write Python, TypeScript, FastAPI, React |
| [`DOCUMENTATION_STANDARDS.md`](DOCUMENTATION_STANDARDS.md) | How we document for humans and agents |
| [`TESTING.md`](TESTING.md) | Proof strategy for deterministic and AI paths |
| [`SECURITY.md`](SECURITY.md) | Security posture and evidence expectations |
| [`OBSERVABILITY.md`](OBSERVABILITY.md) | Logs, traces, AI telemetry, dashboards |
| [`DEVOPS.md`](DEVOPS.md) | CI/CD, containers, infra, secrets, backups |
| [`RELEASE_PROCESS.md`](RELEASE_PROCESS.md) | Versioning, promotion, rollback |
| [`ONCALL.md`](ONCALL.md) | Incident response and escalation |

---

## See Also

- [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md)  
- [`../Governance/MOM.md`](../Governance/MOM.md)  
- [`../Governance/MILE.md`](../Governance/MILE.md)  
- [`CODING_STANDARDS.md`](CODING_STANDARDS.md) · [`DOCUMENTATION_STANDARDS.md`](DOCUMENTATION_STANDARDS.md) · [`TESTING.md`](TESTING.md) · [`SECURITY.md`](SECURITY.md)
