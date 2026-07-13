# [PROJECT_NAME] — Verification & Evaluation

**MES Version:** 1.1.1  
**Document:** `VERIFY.md`  
**Project:** [PROJECT_NAME]  
**Owner:** [OWNER]  
**Version:** [VERSION]  
**Status:** [DRAFT / REVIEW / APPROVED / ACTIVE]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]  
**Classification:** [PUBLIC / INTERNAL / CUI / CLASSIFIED / OTHER]

---

## 0. Verification Position

This document defines how `[PROJECT_NAME]` proves that it works, remains secure, handles data correctly, and satisfies acceptance criteria.

AI output is untrusted by default. Deterministic tests, schemas, scans, replay, monitoring, human review, and evidence artifacts determine whether the system is acceptable.

---

## 1. Acceptance Commands

```sh
# Replace with actual project commands. Prefer the project-primary stack.
# Python (primary MoniGarr stack — Engineering/CODING_STANDARDS.md):
# uv run ruff check .
# uv run pytest
# uv run <eval-entry>
# uv run <security-scan>

# Node / TypeScript (when in scope):
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run eval
npm run security:scan
npm run verify
```

Record the exact commands used in the Evidence Pack. Do not leave both stacks as unexecuted placeholders in production `VERIFY.md`.

---

## 2. Evidence Inventory

| Evidence ID | Artifact | Proves | Location | Owner | Status |
|---|---|---|---|---|---|
| EVID-001 | [Artifact] | [Claim] | [Path/link] | [Owner] | [Status] |

---

## 3. Requirement Traceability

| Requirement | Source | Verification Method | Evidence | Status |
|---|---|---|---|---|
| FR-001 | `PRD.md` | [Test/eval/review] | [Artifact] | [Pass/Fail] |
| SEC-GOV-001 | `SECURITY.md` | [Assessment] | [Artifact] | [Pass/Fail] |

---

## 4. Test Layers

| Layer | Scope | Tool/Method | Command | Evidence |
|---|---|---|---|---|
| Unit | [Scope] | [Tool] | [Command] | [Artifact] |
| Integration | [Scope] | [Tool] | [Command] | [Artifact] |
| End-to-end | [Scope] | [Tool] | [Command] | [Artifact] |
| Accessibility | [Scope] | [Tool] | [Command] | [Artifact] |
| Performance | [Scope] | [Tool] | [Command] | [Artifact] |
| Security | [Scope] | [Tool] | [Command] | [Artifact] |
| AI eval | [Scope] | [Tool] | [Command] | [Artifact] |
| Regression | [Scope] | [Tool] | [Command] | [Artifact] |

---

## 5. AI Evaluation Plan

| Eval ID | Behavior Tested | Risk Class | Dataset / Seeds | Pass Criteria | Failure Action | Evidence |
|---|---|---|---|---|---|---|
| EVAL-001 | [Behavior] | R[n] | [Seeds] | [Criteria] | [Action] | [Artifact] |

Required AI eval categories:

- Hallucination resistance.
- Prompt injection resistance.
- Data leakage prevention.
- RAG authorization correctness.
- Tool-call safety.
- Refusal behavior.
- Human-review routing.
- Output format/schema correctness.
- Robustness to malformed input.
- Bias/fairness review where applicable.

---

## 6. Security Verification

| Security Domain | Verification | Evidence | Status |
|---|---|---|---|
| Authentication | [Method] | [Artifact] | [Status] |
| Authorization | [Method] | [Artifact] | [Status] |
| Secrets | [Method] | [Artifact] | [Status] |
| Cryptography | [Method] | [Artifact] | [Status] |
| Dependency/SCA | [Method] | [Artifact] | [Status] |
| SAST | [Method] | [Artifact] | [Status] |
| DAST/API | [Method] | [Artifact] | [Status] |
| IaC | [Method] | [Artifact] | [Status] |
| Container/image | [Method] | [Artifact] | [Status] |
| Supply chain | [Method] | [Artifact] | [Status] |
| Logging/monitoring | [Method] | [Artifact] | [Status] |
| Incident response | [Method] | [Artifact] | [Status] |

---

## 7. Release Gate

A release is acceptable only when:

- [ ] Product acceptance criteria pass.
- [ ] Architecture assumptions remain valid.
- [ ] Required tests pass.
- [ ] Required AI evals pass.
- [ ] Required security scans pass or are risk-accepted.
- [ ] Data classification and AI eligibility rules are enforced.
- [ ] Logs, metrics, traces, and audit records are enabled.
- [ ] SBOM/provenance/signing evidence exists where applicable.
- [ ] Rollback plan exists and has been tested where applicable.
- [ ] Human approval is recorded.
- [ ] Accessibility checks complete where user-facing (or N/A with rationale).
- [ ] Material documentation MDES-evaluated when required ([`../MDES.md`](../MDES.md)).
- [ ] Suite-affecting / MES normative doc changes MCR-checked when required ([`../Governance/MES_REVIEW_PROCESS.md`](../Governance/MES_REVIEW_PROCESS.md)); evidence under `MDES_REVIEWS/` or PR-attached table.
- [ ] PHI/CUI fixtures are synthetic only unless legal basis documented ([`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md)).
- [ ] Risk Class R3+ Evidence Pack complete ([`../GLOSSARY.md`](../GLOSSARY.md) Evidence Pack).

---

## 8. Regression Rule

Every confirmed bug, security issue, unsafe AI behavior, data handling error, production incident, or failed acceptance criterion must become one of:

- A unit test.
- An integration test.
- An end-to-end test.
- A security test.
- An AI eval seed.
- A monitoring alert.
- A documented manual verification procedure.

---

## 9. Verification Sign-Off

| Role | Name | Decision | Date | Evidence Reviewed |
|---|---|---|---|---|
| Product owner | [Name] | [Approved/Rejected] | [Date] | [Evidence] |
| Architecture owner | [Name] | [Approved/Rejected] | [Date] | [Evidence] |
| Security owner | [Name] | [Approved/Rejected] | [Date] | [Evidence] |
| Data/privacy owner | [Name] | [Approved/Rejected] | [Date] | [Evidence] |
| Release owner | [Name] | [Approved/Rejected] | [Date] | [Evidence] |
