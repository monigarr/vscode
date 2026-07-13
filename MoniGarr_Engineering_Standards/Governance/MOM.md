# MoniGarr Operating Model (M.O.M.)

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All Products, Services, Repositories, AI Agents  
**Canonical Path:** `Governance/MOM.md`  
**See Also:** [`MILE.md`](MILE.md) · [`MES_REVIEW_PROCESS.md`](MES_REVIEW_PROCESS.md) · [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Part XX · [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) · [`../MDES.md`](../MDES.md) · [`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md) · [`../GLOSSARY.md`](../GLOSSARY.md) · [`../Engineering/DOCUMENTATION_STANDARDS.md`](../Engineering/DOCUMENTATION_STANDARDS.md) · [`../CLAUDE.md`](../CLAUDE.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`MOM.md`](MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

The MoniGarr Operating Model (M.O.M.) defines how MoniGarr designs, builds, evaluates, deploys, operates, and continuously improves software systems.

M.O.M. establishes a common engineering language that allows human engineers and AI coding agents to collaborate predictably while maintaining enterprise-quality standards.

M.O.M. is not branding. It is enforceable operating discipline for systems that remain:

- human-accountable
- maintainable
- auditable
- transferable
- governable

The operating model prioritizes:

- Long-term maintainability
- Engineering excellence
- Measurable quality
- Human judgment
- Continuous improvement
- Sustainable business value

---

## Mission

Build software that remains valuable for years rather than software that merely ships quickly.

Every architectural decision should reduce future complexity.

---

## Core Principles

### 1. Value Before Velocity

Shipping quickly is useful only when the software creates measurable value.

Optimize for:

- customer value
- business value
- engineering value

Never optimize for feature count.

### 2. Architecture Before Implementation

Every implementation begins with architecture.

Required before coding:

- PRD
- Architecture
- Domain Model
- Data Model
- User Stories
- Acceptance Criteria

Coding begins only after architectural review.

### 3. Documentation Is Product

Documentation is not an afterthought.

Documentation must remain synchronized with production systems.

Every repository is self-documenting.

### 4. AI Augments Engineers

AI accelerates engineering.

AI does not replace engineering judgment.

Humans remain accountable for:

- correctness
- ethics
- architecture
- production approval

### 5. Production Quality Is the Default

There are no "temporary" solutions.

Every merge should improve the system.

### 6. Evidence Over Assertion

Claims of readiness require artifacts: tests, evals, scans, traces, approvals, and runbooks.

### 7. Handoff-Ready Engineering

Any qualified engineer or AI agent shall be able to understand, run, test, and safely change the system from repository artifacts alone.

---

## Engineering Lifecycle

```text
Discover → Design → Validate → Implement → Evaluate → Review → Deploy → Observe → Improve
```

Repeat continuously. Skipping Evaluate or Review before Deploy is non-conformant for production systems.

| Stage | Primary outputs |
|-------|-----------------|
| Discover | Problem statement, users, constraints, risks |
| Design | PRD, architecture, domain/data models, ADRs |
| Validate | Threat model, privacy posture, acceptance criteria |
| Implement | Code, tests, docs, harnesses |
| Evaluate | Golden evals, regression, quality scores |
| Review | Human approval, security review, ADR updates |
| Deploy | Release record, SBOM, monitoring enabled |
| Observe | Metrics, traces, alerts, cost, hallucinations |
| Improve | Retrospectives, prompt/model/graph updates |

---

## Engineering Rituals

| Ritual | Cadence | Purpose |
|--------|---------|---------|
| Architecture review | Before first implementation and on material change | Confirm boundaries, trust, AI limits |
| ADR review | Per significant decision | Record context, options, consequences |
| Eval gate review | Every AI-affecting release | Confirm golden sets and thresholds |
| Security review | Every externally exposed or data-sensitive change | Controls + evidence |
| Documentation sync | Every merge that changes behavior | Keep docs as product |
| Post-incident review | After Sev-1/Sev-2 | MTTR learning, runbook updates |
| Standards sync | Quarterly | Align repo practices to MES version |

---

## Engineering Quality Gates

Every feature **shall** satisfy the following gates. Deviation requires an ADR.

| Gate | Minimum evidence | Blocks merge / release when |
|------|------------------|-----------------------------|
| Functional | Acceptance criteria mapped to tests or demos | Criteria unmet |
| Tested | CI green per [`../Engineering/TESTING.md`](../Engineering/TESTING.md) | Required suites fail |
| Documented | Touched docs updated; material docs MDES+MCR when required | Docs stale vs behavior |
| Observable | SLIs/alerts for critical journeys per OBSERVABILITY | Silent production paths |
| Secure | Scans + AuthZ tests; threat model when triggered | Critical findings open |
| Performant | Latency/cost budgets recorded | Budget breach without ADR |
| Accessible | WCAG/508 evidence when UI changed (Architecture Part XV) | Declared a11y criteria fail |
| Maintainable | Ownership, runbooks, no unexplained debt spike | Unowned critical path |
| Evaluated | Golden evals green when AI-affecting | Eval gate red |

Production deployment additionally requires:

- Explicit human approval classified by **Risk Class R0–R4** ([`../GLOSSARY.md`](../GLOSSARY.md#risk-class); canonical policy: [`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md)). In M.O.M., “material risk” **means R3+** (production change) unless a project ADR maps a narrower scope.
- R3+ Evidence Pack (minimum contents: [`../GLOSSARY.md`](../GLOSSARY.md) **Evidence Pack**)
- R4 dual-control or designated approver per Risk Class table
- Golden evaluation gates green when AI-affecting; continuous evaluation thresholds where authorized in `VERIFY.md` (continuous eval supplements golden gates — it does not replace them)
- SBOM / dependency scan evidence
- Rollback plan
- MDES + MCR for MES suite and material suite-affecting documentation changes ([`../MDES.md`](../MDES.md); [`MES_REVIEW_PROCESS.md`](MES_REVIEW_PROCESS.md))

---

## Regulated Operations Overlay

When a project processes CUI, PHI/ePHI, sovereign/community-protected data, or federal authorization-bound workloads:

1. Adopt the matching profile in [`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md) via project `SECURITY.md` / `PRIVACY_DATA_GOVERNANCE.md`.  
2. Map authorities via [`../REFERENCES.md`](../REFERENCES.md) — starters only; not ATO / FedRAMP / HIPAA certification.  
3. Require ADR Compliance Notes for material deviations ([`ADR_GUIDE.md`](ADR_GUIDE.md)).  
4. Include accessibility evidence when UI changes (Architecture Part XV; Section 508 / WCAG starters in REFERENCES).  
5. Ban PHI/CUI/production customer data from PR artifacts and prompt dumps ([`CONTRIBUTING.md`](CONTRIBUTING.md)).

MES remains **not** a regulatory framework ([`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) Regulatory Independence).

---

## M.O.M. and M.I.L.E. Interlock

M.O.M. is the **governance plane**. M.I.L.E. is the **intelligence plane**. Neither alone is sufficient.

AI-touching work **shall** run M.I.L.E. stages embedded inside M.O.M. Discover → Improve. Skipping M.O.M. Evaluate / Review / Deploy gates because an AI harness passed remains **non-conformant**.

Canonical stage mapping: [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Part XX.5. Summary:

| M.O.M. stage | M.I.L.E. specialization (when AI in scope) |
|--------------|--------------------------------------------|
| Discover / Design | Understand / Model (agents, retrieval, prompts) |
| Validate | Evaluate (pre-ship golden sets + harnesses) |
| Implement | Build under tool allowlists and budgets |
| Evaluate / Review | Score + HITL per Risk Class R0–R4 |
| Deploy | Promote only with Evidence Pack + human approval for R3+ |
| Observe / Improve | Continuous eval (authorized) + loop/harness learning |

---

## Documentation Requirements

Every repository contains at minimum the **canonical** project tree defined in [`../README.md`](../README.md) § Minimum Project Repository Standard. Summary:

| Document | Purpose |
|----------|---------|
| `README.md` | Onboarding and run instructions |
| `PRD.md` | Product intent |
| `ARCHITECTURE.md` | System design and boundaries |
| `USERS.md` | Personas and journeys |
| `API.md` | Interface contracts |
| `DATA_MODEL.md` | Data entities and retention |
| `SECURITY.md` | Controls and evidence |
| `PRIVACY_DATA_GOVERNANCE.md` | When applicable (non-public / regulated / AI-training / sovereign data) |
| `THREAT_MODEL.md` | When applicable (see [`../Engineering/SECURITY.md`](../Engineering/SECURITY.md) threat-model triggers) |
| `VERIFY.md` | Evidence plan and proof commands |
| `AI_GUIDELINES.md` | AI bounds and agent contract |
| `TESTING.md` | Test and eval strategy |
| `CHANGELOG.md` | Release history |
| `CONTRIBUTING.md` | Contribution rules |
| `CLAUDE.md` (or equivalent) | Agent-facing operating notes |
| `SYSTEM_PROFILE.md` | Runtime profile |
| `RUNBOOK.md` | Operations |
| `ONBOARDING.md` | Human + agent onboarding |
| `DECISIONS.md` / `docs/ADRS/` | ADR index |

Full mandatory set: [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Part XVIII. If this table and README diverge, **README wins** ([`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) Domain SoT Registry).

Authoring rules: [`../Engineering/DOCUMENTATION_STANDARDS.md`](../Engineering/DOCUMENTATION_STANDARDS.md).

MES suite documents and material project documentation **shall** pass MDES and MCR before merge ([`../MDES.md`](../MDES.md) · [`MES_REVIEW_PROCESS.md`](MES_REVIEW_PROCESS.md)).

---

## Decision Framework

**Scope:** This framework governs **human architectural and design decisions** when multiple viable solutions exist.

It does **not** replace the **Agent Decision Hierarchy** in [`../CLAUDE.md`](../CLAUDE.md), which governs AI-agent execution priorities when goals conflict during implementation.

When multiple solutions exist, choose the option that maximizes, in order:

1. Simplicity  
2. Maintainability  
3. Reliability  
4. Observability  
5. Security  
6. Extensibility  
7. Business value  

Never optimize prematurely. Record significant choices as ADRs ([`ADR_GUIDE.md`](ADR_GUIDE.md)).

Process authority for the split: [`MES_REVIEW_PROCESS.md`](MES_REVIEW_PROCESS.md) § Decision Authority.

---

## Build vs Buy

Prefer, in order:

1. Open standards  
2. Open source (license-reviewed)  
3. Commercial APIs (contract + data posture reviewed)  
4. Custom development  

Only build proprietary components when they create durable competitive advantage and can be operated to MES quality.

---

## Repository Standards

- One product / clear system boundary per primary repository (monorepos allowed when boundaries remain explicit)  
- One architecture source of truth  
- Reproducible from source  
- Secrets never committed  
- MES conformance declared in README  

---

## Operational Excellence

Every deployment includes:

- Health checks  
- Metrics  
- Tracing  
- Logging  
- Alerts  
- Backups  
- Disaster recovery posture  
- Runbooks  

---

## Engineering KPIs

Track at minimum:

- Deployment frequency  
- Lead time  
- Mean time to recovery  
- Change failure rate  
- Defect escape rate  
- Test coverage  
- Mutation score (where applicable)  
- Evaluation pass rate  
- Hallucination rate (AI systems)  
- Customer satisfaction / business outcome metrics  
- Engineering happiness (sustainable pace)

Detailed definitions: [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Part XIX.

---

## Human Principles

- Respect people.  
- Reduce cognitive load.  
- Design for future engineers and AI agents.  
- Leave systems easier to understand than when you found them.  

---

## Definition of Done

A feature is complete only when:

- Code merged  
- Documentation updated  
- Tests passing  
- Evaluation passing (if AI-involved)  
- Security reviewed as required  
- Monitoring enabled  
- Production deployed (or explicitly deferred with ADR)  
- Knowledge transferred  

---

## Continuous Improvement

Every sprint produces:

- Better software  
- Better documentation  
- Better tooling  
- Better automation  
- Better engineering practices  
- Better business outcomes  

Improvement is continuous. Never complete.

---

## Conformance

Projects claiming MES conformance shall:

1. Link to this suite from README  
2. Follow the lifecycle and quality gates above  
3. Map architecture to MES Parts I–XX  
4. Maintain ADRs for significant deviations  

Deviations without ADR are non-conformant.
