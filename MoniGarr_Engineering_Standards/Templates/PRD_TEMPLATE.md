# [PROJECT_NAME] — Product Requirements Document

**MES Version:** 1.1.1  
**Document:** `PRD.md`  
**Project:** [PROJECT_NAME]  
**Repository:** [REPOSITORY_NAME]  
**Owner:** [OWNER]  
**Maintainers:** [MAINTAINERS]  
**Version:** [VERSION]  
**Status:** [DRAFT / REVIEW / APPROVED / ACTIVE]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]  
**Classification:** [PUBLIC / INTERNAL / CUI / CLASSIFIED / OTHER]  
**Source of Truth:** This file owns product intent, scope, users, requirements, success metrics, and acceptance criteria.

**Placeholder convention:** Use `[BRACKET]` fill-ins. Map data sensitivity to Privacy L0–L7 in `PRIVACY_DATA_GOVERNANCE.md` when that artifact exists (PRD may use Public/Internal/CUI/PHI labels — link the mapping).

---

## 0. Executive Summary

Describe the product in one to three paragraphs.

Include:

- What the system is.
- Who it serves.
- Why it matters.
- What proof will demonstrate success.
- What is explicitly not included.

---

## 1. Product Position

### 1.1 One-Line Thesis

> [PROJECT_NAME] is [PRODUCT TYPE] for [PRIMARY USER] that [CORE VALUE] by [PRIMARY MECHANISM].

### 1.2 Primary Problem

[Describe the pain, risk, inefficiency, mission gap, or opportunity.]

### 1.3 Why This Problem Matters

[Explain cost, risk, mission importance, operational impact, or user burden.]

### 1.4 Current Alternatives

| Alternative | Strength | Weakness | Why This Product Is Needed |
|---|---|---|---|
| [Alternative 1] | | | |
| [Alternative 2] | | | |

### 1.5 Failure Cost if Unsolved

[Describe what happens if the product is not built.]

---

## 2. Goals, Non-Goals, and Deferred Scope

### 2.1 Goals

| ID | Goal | Success Signal |
|---|---|---|
| G-001 | [Goal] | [Evidence] |
| G-002 | [Goal] | [Evidence] |
| G-003 | [Goal] | [Evidence] |

### 2.2 Non-Goals

| ID | Non-Goal | Rationale |
|---|---|---|
| NG-001 | [Not included] | [Why] |
| NG-002 | [Not included] | [Why] |

### 2.3 Deferred Scope

| ID | Deferred Item | Trigger for Reconsideration |
|---|---|---|
| DS-001 | [Deferred item] | [Condition] |

---

## 3. Users and Stakeholders

| User / Stakeholder | Need | Workflow Moment | Trust Expectation | Success Signal |
|---|---|---|---|---|
| Primary user | | | | |
| Secondary user | | | | |
| Admin/operator | | | | |
| Reviewer/evaluator | | | | |
| Security/privacy stakeholder | | | | |

---

## 4. Use Cases

### UC-001 — [Use Case Name]

- **Actor:** [User]
- **Trigger:** [Event]
- **Preconditions:** [Required state]
- **Primary Flow:**
  1. [Step]
  2. [Step]
  3. [Step]
- **Expected Outcome:** [Outcome]
- **Failure Risk:** [Risk]
- **Acceptance Criteria:** [Measurable criteria]

### UC-002 — [Use Case Name]

- **Actor:**
- **Trigger:**
- **Preconditions:**
- **Primary Flow:**
- **Expected Outcome:**
- **Failure Risk:**
- **Acceptance Criteria:**

---

## 5. Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria | Evidence Artifact |
|---|---|---:|---|---|
| FR-001 | [Requirement] | P0 | [Criteria] | [Test/eval/demo/log] |
| FR-002 | [Requirement] | P1 | [Criteria] | [Test/eval/demo/log] |
| FR-003 | [Requirement] | P2 | [Criteria] | [Test/eval/demo/log] |

---

## 6. Non-Functional Requirements

| Category | Requirement | Acceptance Criteria | Evidence Artifact |
|---|---|---|---|
| Security | [Requirement] | [Criteria] | [Scan/test/review] |
| Privacy | [Requirement] | [Criteria] | [PIA/review/test] |
| Reliability | [Requirement] | [Criteria] | [Test/monitoring] |
| Performance | [Requirement] | [Criteria] | [Benchmark] |
| Accessibility | [Requirement] | [Criteria] | [Audit/test] |
| Observability | [Requirement] | [Criteria] | [Logs/metrics/traces] |
| Maintainability | [Requirement] | [Criteria] | [Docs/coverage] |
| Portability | [Requirement] | [Criteria] | [Deployment proof] |
| Resilience | [Requirement] | [Criteria] | [DR/restore test] |

---

## 7. AI-Native Requirements

### 7.1 AI Responsibilities

| ID | AI Responsibility | Inputs | Outputs | Verification Method |
|---|---|---|---|---|
| AI-001 | [AI task] | [Inputs] | [Outputs] | [Eval/schema/human review] |

### 7.2 Deterministic Responsibilities

| ID | Deterministic Responsibility | Why It Must Be Deterministic | Verification Method |
|---|---|---|---|
| DET-001 | [Validation/control/calculation] | [Reason] | [Test/schema/replay] |

### 7.3 Human Approval Responsibilities

| ID | Human Approval Gate | Required Approver | Evidence |
|---|---|---|---|
| H-001 | [Approval moment] | [Role] | [Record] |

### 7.4 AI Prohibited Behavior

AI must not:

- Expand product scope without approval.
- Bypass authentication, authorization, or trust boundaries.
- Make production-impacting changes without approval.
- Invent evidence, logs, citations, tests, or approvals.
- Override deterministic validation.
- Make final legal, medical, financial, safety, eligibility, enforcement, or disciplinary determinations.
- Process data outside approved classification and AI eligibility boundaries.

### 7.5 Risk Class Map

Map each AI-affecting or mutation-capable workflow to MES Risk Class and `side_effect_class` ([`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md), [`../AI/TOOLS.md`](../AI/TOOLS.md)). Companion detail: project `AI_GUIDELINES.md`.

| Workflow / agent | Risk Class (R0–R4) | `side_effect_class` | HITL | Notes |
|------------------|--------------------|---------------------|------|-------|
| [workflow] | R[n] | read \| draft \| write \| irreversible | [who / when] | |

### 7.6 Regulated profile

- [ ] None  
- [ ] Adopt [`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md): `[PHI / CUI / sovereign]`  

---

## 8. Data Requirements

| Data Item | Source | Classification | AI Use Allowed? | Retention | Owner | Notes |
|---|---|---|---|---|---|---|
| [Data] | [Source] | [Public/Internal/CUI/PII/etc.] | [Yes/No/Restricted] | [Period] | [Owner] | [Notes] |

Required handling:

- **Inputs:** [Data inputs]
- **Outputs:** [Data outputs]
- **Sensitive data:** [PII/CUI/classified/sovereign/etc.]
- **Retention:** [Retention period]
- **Redaction:** [Redaction controls]
- **Synthetic/demo data strategy:** [Strategy]
- **Data sharing:** [Allowed recipients]

---

## 9. Security and Trust Requirements

- **Authentication / authorization:** [Requirement]
- **Identity assurance:** [Requirement]
- **Least privilege:** [Requirement]
- **Trust boundaries:** [Requirement]
- **Secrets management:** [Requirement]
- **Cryptography:** [Requirement]
- **Supply chain:** [Requirement]
- **Logging/audit:** [Requirement]
- **Abuse cases:** [Requirement]
- **Guardrails:** [Requirement]
- **Kill switch / stop conditions:** [Requirement]
- **Incident response:** [Requirement]

Refer to `SECURITY.md` for full security requirements and control evidence.

---

## 10. Acceptance Criteria

The project is accepted when:

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]
- [ ] Security requirements have mapped evidence.
- [ ] Verification commands pass reproducibly.
- [ ] Human approval gates are recorded.
- [ ] Risk Class map (§7.5) complete for AI / mutation workflows.
- [ ] Regulated profile adopted or marked N/A (§7.6).
- [ ] Material PRD changes MDES-evaluated when required; suite-affecting changes also MCR-checked.

---

## 11. Success Metrics

| Metric | Target | Measurement Method | Evidence Artifact |
|---|---:|---|---|
| User workflow completion | [Target] | [Method] | [Artifact] |
| Latency | [Target] | [Method] | [Artifact] |
| Accuracy / correctness | [Target] | [Method] | [Artifact] |
| Eval pass rate | [Target] | [Method] | [Artifact] |
| Security gate pass rate | [Target] | [Method] | [Artifact] |
| Cost | [Target] | [Method] | [Artifact] |

---

## 12. Milestones

| Milestone | Date | Deliverable | Proof | Approver |
|---|---|---|---|---|
| Intake approved | [Date] | [Deliverable] | [Proof] | [Role] |
| MVP | [Date] | [Deliverable] | [Proof] | [Role] |
| Security review | [Date] | [Deliverable] | [Proof] | [Role] |
| Production readiness | [Date] | [Deliverable] | [Proof] | [Role] |

---

## 13. Traceability Matrix

| Product Requirement | Architecture Section | Security Requirement | Test / Eval | Evidence Artifact |
|---|---|---|---|---|
| FR-001 | [Section] | [SEC-ID] | [Test] | [Artifact] |

---

## 14. Assumptions and Open Questions

### Assumptions

- [Assumption]

### Open Questions

- [Question]

---

## 15. Document Control

| Field | Value |
|---|---|
| Owner | [Owner] |
| Version | [Version] |
| Last Updated | [Date] |
| Reviewers | [Names/Roles] |
| Approval | [Status] |
| Distribution | [Audience] |
| Classification | [Classification] |
