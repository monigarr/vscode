# [PROJECT_NAME] — Architecture

**MES Version:** 1.1.1 · Panel-grade long form. Parts I–XX checklist required. Shortform is **not** a substitute.

```text
===============================================================================
PROJECT ARCHITECTURE
===============================================================================
Project Name:        [PROJECT_NAME]
Repository:          [REPOSITORY_NAME]
Version:             [VERSION]
Status:              [DRAFT / REVIEW / APPROVED / ACTIVE]
Classification:      [PUBLIC / INTERNAL / CUI / CLASSIFIED / OTHER]
Authors:             [AUTHORS]
Organization:        [ORGANIZATION]
Primary Maintainers: [MAINTAINERS]
Created:             [YYYY-MM-DD]
Last Updated:        [YYYY-MM-DD]
License:             [LICENSE]
MES Version:         1.1.1
===============================================================================
DESCRIPTION
-------------------------------------------------------------------------------
High-level architectural definition using:
- MoniGarr Operating Model (M.O.M.)
- MoniGarr Intelligence-Led Engineering (M.I.L.E.)
- MoniGarr Engineering Standards

This document defines:
- Architectural intent
- Constraints
- Trust boundaries
- AI integration strategy
- Security posture
- Operational expectations
- Governance requirements
- Scalability assumptions
- Human accountability structures
===============================================================================
```

---

## Source-of-Truth Hierarchy

1. `PRD.md` — product scope, users, workflows, and requirements.
2. `ARCHITECTURE.md` — system design and authority boundaries.
3. `SECURITY.md` — security requirements, controls, evidence, and authorization posture.
4. `PRIVACY_DATA_GOVERNANCE.md` — data classification, retention, privacy, CUI, AI eligibility, and disposal.
5. `THREAT_MODEL.md` — security abuse cases, attack paths, and mitigations.
6. `VERIFY.md` — test, evaluation, scan, and acceptance proof.
7. `README.md` — onboarding and run instructions.

If documents conflict, `PRD.md` wins for product intent, and this file wins for system implementation boundaries.

Project architectures shall conform to **MoniGarr Engineering Standards (MES) v1.1**. See suite `Architecture/ARCHITECTURE.md` Parts I–XX and `SYSTEM_CONTEXT.md`.

---

## MES Parts Conformance Checklist

Mark each part as Conforms / Partial / N/A (with ADR link if Partial or justified N/A):

| MES Part | Title | Status | ADR / Notes |
|----------|-------|--------|-------------|
| I | Engineering Philosophy | [ ] | |
| II | System Architecture | [ ] | |
| III | AI Architecture (Platform) | [ ] | |
| IV | Enterprise RAG | [ ] | |
| V | Enterprise Knowledge Graph | [ ] | |
| VI | AI Agent Platform | [ ] | |
| VII | Sub-Agent Architecture | [ ] | |
| VIII | Loop Engineering | [ ] | |
| IX | Harness Engineering | [ ] | |
| X | Golden Evaluation Sets | [ ] | |
| XI | Continuous Evaluation | [ ] | |
| XII | Prompt Engineering | [ ] | |
| XIII | Tool Engineering | [ ] | |
| XIV | Engineering Standards | [ ] | |
| XV | Testing | [ ] | |
| XVI | DevOps | [ ] | |
| XVII | Security | [ ] | |
| XVIII | Documentation | [ ] | |
| XIX | Engineering KPIs | [ ] | |
| XX | M.O.M. + M.I.L.E. | [ ] | |

---

## 0. Executive Summary

[Describe the system in enterprise language.]

Include:

- What the architecture is.
- What it is not.
- Primary system boundaries.
- Authorization boundary.
- AI role.
- Deterministic role.
- Human approval role.
- Security and data posture.
- What proves the system works.

---

## 1. Architecture Position

### 1.1 Core Claim

> [State the architecture's central claim.]

### 1.2 What This System Is

- [System identity]
- [Major capabilities]
- [Authorized workflows]

### 1.3 What This System Is Not

- [Non-goal]
- [Forbidden behavior]
- [Unsupported workflow]

### 1.4 Non-Negotiables

- Human accountability remains explicit.
- AI operates only inside approved boundaries.
- Deterministic validation owns proof.
- Sensitive data follows classification and handling rules.
- Security controls are evidence-backed.
- Production deployment requires explicit approval.

---

## 2. M.O.M. / M.I.L.E. Application

### 2.1 M.O.M. — MoniGarr Operating Model

| Principle | Project Interpretation | Implementation Evidence |
|---|---|---|
| Human accountability first | [Interpretation] | [Artifact] |
| Ancient + human + AI integration | [Interpretation] | [Artifact] |
| Enterprise from day one | [Interpretation] | [Artifact] |
| Documentation as infrastructure | [Interpretation] | [Artifact] |
| Handoff-ready engineering | [Interpretation] | [Artifact] |
| Sovereign ownership | [Interpretation] | [Artifact] |

### 2.2 M.I.L.E. — MoniGarr Intelligence-Led Engineering

| Principle | Project Interpretation | Implementation Evidence |
|---|---|---|
| Intelligence-led decisions | [Interpretation] | [Artifact] |
| Evidence over vibes | [Interpretation] | [Artifact] |
| Evals before confidence | [Interpretation] | [Artifact] |
| Bounded autonomy | [Interpretation] | [Artifact] |
| Verification before output | [Interpretation] | [Artifact] |
| Observability-first | [Interpretation] | [Artifact] |
| Security signal density | [Interpretation] | [Artifact] |
| Deterministic proof where possible | [Interpretation] | [Artifact] |

---

## 3. System Scope

### 3.1 In Scope

- [Capability/workflow]

### 3.2 Out of Scope

- [Unsupported behavior/workflow]

### 3.3 Deferred

- [Deferred capability]

---

## 4. High-Level System Architecture

### 4.1 Architectural Style

Select and justify one or more:

- Modular monolith.
- Distributed services.
- Event-driven system.
- AI-native orchestration.
- Local-first runner.
- Cloud API.
- Hybrid local/cloud inference.
- Brownfield augmentation.

**Selected style:** [Style]  
**Rationale:** [Why this style fits the mission, risk, team, and constraints]

### 4.2 System Diagram

```text
[ User / Operator ]
        ↓
[ Interface Layer ]
        ↓
[ Application / Orchestration Layer ]
        ↓
[ Policy / Authorization Layer ]
        ↓
[ AI Layer ] ←→ [ Deterministic Tools ]
        ↓
[ Verification / Safety Layer ]
        ↓
[ Data / Artifact Layer ]
        ↓
[ Observability / Audit Layer ]
```

### 4.3 Component Authority Table

| Component | Responsibility | Authority | Forbidden | Failure Behavior | Evidence |
|---|---|---|---|---|---|
| Interface | [Responsibility] | [Authority] | [Forbidden] | [Behavior] | [Evidence] |
| Orchestrator | | | | | |
| Policy layer | | | | | |
| AI service | | | | | |
| Tool layer | | | | | |
| Verification layer | | | | | |
| Data store | | | | | |
| Observability | | | | | |

---

## 5. AI-Native Engineering Model

### 5.1 AI-First Philosophy

AI participates in planning, analysis, drafting, critique, execution support, summarization, pattern discovery, test generation, documentation, and review.

AI does not own final authority, security authorization, production deployment, risk acceptance, legal interpretation, or final claims.

### 5.2 AI Responsibilities

| ID | Responsibility | Input Boundary | Output Boundary | Verification |
|---|---|---|---|---|
| AI-001 | [Responsibility] | [Boundary] | [Boundary] | [Method] |

### 5.3 Deterministic Responsibilities

| ID | Responsibility | Method | Proof |
|---|---|---|---|
| DET-001 | [Validation/control] | [Code/schema/test] | [Evidence] |

### 5.4 Human Responsibilities

| ID | Decision / Approval | Required Role | Record |
|---|---|---|---|
| H-001 | [Approval] | [Role] | [Artifact] |

### 5.5 Prohibited AI Authority

AI must not:

- Expand scope without approval.
- Bypass authentication, authorization, data classification, or trust boundaries.
- Make production-impacting changes without approval.
- Suppress uncertainty.
- Invent evidence, sources, logs, tests, scans, approvals, or metrics.
- Override deterministic validation.
- Make final legal, medical, financial, safety, eligibility, enforcement, disciplinary, or mission-critical determinations.
- Retain or process data outside approved tool, model, tenant, or system boundaries.

---

## 6. Agent / Role Model

Use this section when the project has multiple agents or separable AI responsibilities.

| Role | Purpose | Inputs | Outputs | Risk Class | `side_effect_class` | Permissions | Trust Level | Validator |
|---|---|---|---|---|---|---|---|---|
| Orchestrator | Plans/routes work | [Input] | [Output] | R[n] | read \| draft | [Permissions] | Medium | [Validator] |
| Worker Agent | Produces bounded work | | | R[n] | read \| draft | | Low/Medium | |
| Tool Executor | Calls approved tools | | | R[n] | read \| draft \| write \| irreversible | | Medium | |
| Judge / Critic | Evaluates output independently | | | R[n] | read \| draft | | Medium | |
| Documentation Agent | Converts evidence into docs | | | R[n] | draft | | Medium-low | |
| Safety / Budget Guard | Enforces deterministic limits | | | R0–R1 | read | | High deterministic | |

### Separation-of-Duties Rule

The role that generates an output must not be the only role that validates it. Self-grading is not proof.

---

## 7. Data Architecture

### 7.1 Data Types

| Data Type | Source | Classification | Storage | Retention | AI Eligibility | Owner |
|---|---|---|---|---|---|---|
| [Data] | [Source] | [Level] | [Store] | [Policy] | [Allowed/Restricted/Prohibited] | [Owner] |

### 7.2 Data Flow

```text
[Source] → [Ingestion] → [Validation] → [Processing] → [Storage] → [Retrieval] → [Output] → [Audit]
```

### 7.3 Storage

- [Storage mechanism]
- [Encryption requirement]
- [Backup requirement]
- [Tenant isolation requirement]

### 7.4 Retention

- [Retention period]
- [Records status]
- [Legal hold behavior]
- [Disposal method]

### 7.5 Redaction and Sensitive Data Controls

- [Redaction requirements]
- [DLP requirements]
- [Masking/tokenization requirements]
- [Export controls]

---

## 8. Trust Boundaries

| Boundary | Allowed | Forbidden | Enforced By | Evidence |
|---|---|---|---|---|
| User input | [Allowed] | [Forbidden] | [Control] | [Evidence] |
| AI output | | | | |
| Tool execution | | | | |
| Data access | | | | |
| External services | | | | |
| Admin operations | | | | |
| Deployment | | | | |

---

## 9. Security Architecture

### 9.1 Security Philosophy

Security is proactive, layered, observable, continuously validated, and evidence-based. The system must be designed so that security controls are traceable to requirements, implementation, tests, logs, monitoring, approvals, and residual-risk decisions.

### 9.2 Authorization Boundary

- **System boundary:** [Describe]
- **External systems:** [Describe]
- **Inherited controls:** [List]
- **Customer/agency responsibilities:** [List]
- **Cloud provider responsibilities:** [List]
- **Excluded components:** [List]
- **Boundary diagram:** [Link or describe]

### 9.3 Security Requirements

Instantiate project `SECURITY.md` from [`SECURITY_REQUIREMENTS_TEMPLATE.md`](SECURITY_REQUIREMENTS_TEMPLATE.md) — do not duplicate control inventories here. Record only architecture-significant security decisions and trust boundaries.

### 9.4 Threat Model Summary

| Threat | Asset | Attack Path | Control | Residual Risk | Test Evidence |
|---|---|---|---|---|---|
| [Threat] | [Asset] | [Path] | [Control] | [Risk] | [Evidence] |

---

## 10. Privacy and Data Governance

Architecture must reference the project's privacy classification. Do not duplicate the L0–L7 (or equivalent) classification table here — instantiate and maintain it from [`PRIVACY_DATA_GOVERNANCE_TEMPLATE.md`](PRIVACY_DATA_GOVERNANCE_TEMPLATE.md) as project `PRIVACY_DATA_GOVERNANCE.md`.

- **Privacy artifact:** `[link to project PRIVACY_DATA_GOVERNANCE.md]`
- **Highest classification in scope:** `[e.g. Public / Internal / Privacy-Sensitive / CUI / Classified / Sovereign]`
- **Architecture-significant privacy decisions:** `[trust boundaries, AI eligibility, residency, retention constraints]`

---

## 11. Verification and Evaluation Strategy

### 11.1 Verification Layers

| Layer | Method | Evidence |
|---|---|---|
| Unit | [Method] | [Evidence] |
| Integration | [Method] | [Evidence] |
| End-to-end | [Method] | [Evidence] |
| AI eval | [Method] | [Evidence] |
| Security | [Method] | [Evidence] |
| Privacy/data | [Method] | [Evidence] |
| Regression | [Method] | [Evidence] |
| Release | [Method] | [Evidence] |

### 11.2 Acceptance Commands

```sh
# Examples. Replace with project commands.
npm test
npm run lint
npm run typecheck
npm run eval
npm run security:scan
npm run verify
```

### 11.3 Regression Rule

Every confirmed bug, security finding, unsafe behavior, hallucination pattern, data leak, authorization failure, or operational incident becomes a regression test whenever feasible.

---

## 12. Observability and Auditability

Track:

- Request IDs / trace IDs.
- User/operator action.
- Identity and authorization context.
- Tool calls.
- Model route and model version.
- Prompt/context classification where applicable.
- Data sources and retrieval context.
- Latency.
- Cost.
- Errors.
- Validation results.
- Security decisions.
- Human approvals.
- Artifact paths and release versions.

| Event | Required Fields | Retention | Destination |
|---|---|---|---|
| [Event] | [Fields] | [Policy] | [SIEM/log store] |

---

## 13. Deployment Architecture

| Environment | Purpose | Data | Access | Deployment Method | Approval Gate |
|---|---|---|---|---|---|
| Local | Development | Synthetic only by default | Maintainers | Manual | Maintainer |
| Dev | Shared testing | Synthetic/sanitized | Team | CI/CD | Tech lead |
| Staging | Pre-production | Synthetic/sanitized/approved | Controlled | CI/CD | Release manager |
| Production | Live operations | Approved only | Restricted | Release gate | Owner/security |

---

## 14. Failure Modes and Recovery

| Failure Mode | Expected Behavior | Recovery | Evidence |
|---|---|---|---|
| AI hallucination | Reject, verify, or label uncertainty before output | Prompt/schema/eval fix | Eval regression |
| Prompt injection | Refuse unsafe instruction and preserve system/tool policy | Guardrail update, red-team case | Adversarial test |
| Tool failure | Graceful degradation | Retry/fallback | Incident/log |
| Data mismatch | Block unsafe output | Validation repair | Test case |
| Authorization failure | Fail closed | Access review/fix | Audit record |
| Cost spike | Stop or degrade run | Budget guard | Cost log |
| Security violation | Fail closed and escalate | Incident response | IR ticket |
| Data leak | Stop workflow and invoke incident process | Containment/remediation | Incident record |

---

## 15. Scalability Strategy

- **Concurrency assumptions:** [Assumptions]
- **Scaling model:** [Horizontal/vertical/event-driven/etc.]
- **Caching:** [Strategy]
- **Queueing:** [Strategy]
- **AI inference scaling:** [Strategy]
- **Cost model:** [Strategy]
- **Data growth:** [Strategy]
- **Operational limits:** [Limits]

---

## 16. Accessibility and UX Architecture

- Semantic structure.
- Keyboard support.
- Screen-reader compatibility.
- Plain-language errors.
- Latency feedback.
- User confirmation moments.
- Clear explanation of AI-generated content and uncertainty where applicable.

---

## 17. Repository Standards

**Canonical minimum repo tree:** suite [`README.md`](../README.md) § Minimum Project Repository Standard.

Instantiate at least:

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

Brownfield / regulated projects **may** add `AUDIT.md`, `PRESEARCH.md`, and `internal/` workspaces. Do not treat those as substitutes for the minimum above. Do not fork a second skeleton in this template — update the suite README when the minimum changes.

---

## 18. Architecture Decision Records

| ADR | Decision | Rationale | Tradeoff | Status | Evidence |
|---|---|---|---|---|---|
| ADR-001 | [Decision] | [Rationale] | [Tradeoff] | Proposed | [Evidence] |

---

## 19. Implementation Roadmap

| Phase | Goal | Deliverable | Proof | Exit Criteria |
|---|---|---|---|---|
| Phase 0 | Bootstrap | Repo + docs | README + PRD + Architecture | Source-of-truth approved |
| Phase 1 | MVP | Core workflow | Tests + demo | Acceptance criteria met |
| Phase 2 | Hardening | Security/evals | Security + eval evidence | Risk acceptable |
| Phase 3 | Release | Deployment | Verify + changelog | Approval recorded |
| Phase 4 | Operate | Monitoring + maintenance | Metrics + incidents + POA&M | Continuous monitoring active |

---

## 20. Final Engineering Position

This system is designed according to:

- MoniGarr Operating Model (M.O.M.).
- MoniGarr Intelligence-Led Engineering (M.I.L.E.).
- MoniGarr Engineering Standards.

The system prioritizes:

- Human accountability.
- Sovereign engineering.
- Operational continuity.
- Enterprise reliability.
- Security and privacy by design.
- Scalable intelligence orchestration.
- Long-term maintainability.

AI accelerates engineering.  
Deterministic systems prove repeatability.  
Humans remain accountable.  
Systems remain governable.

---

## 21. Document Control

| Field | Value |
|---|---|
| Owner | [Owner] |
| Version | [Version] |
| Created | [Date] |
| Last Updated | [Date] |
| Reviewers | [Names/Roles] |
| Approval | [Status] |
| Distribution | [Audience] |
| Classification | [Classification] |

---

## Authoritative Framework Reference Pointers

See `REFERENCES.md` in this kit for the current reference list, including NIST RMF, NIST SP 800-53 Rev. 5, FIPS 199, FIPS 200, NIST SSDF, NIST SP 800-63-4, FIPS 140-3, FedRAMP Rev. 5, NIST AI RMF, NIST SP 800-218A, CUI, Privacy Act, and OMB software/hardware security policy references.

