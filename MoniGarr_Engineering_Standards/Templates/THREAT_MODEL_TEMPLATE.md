# [PROJECT_NAME] — Threat Model

**MES Version:** 1.1.1  
**Document:** `THREAT_MODEL.md`  
**Project:** [PROJECT_NAME]  
**Owner:** [OWNER]  
**Security Owner:** [SECURITY_OWNER]  
**Version:** [VERSION]  
**Status:** [DRAFT / REVIEW / APPROVED / ACTIVE]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]  
**Classification:** [PUBLIC / INTERNAL / CUI / CLASSIFIED / OTHER]

---

## 0. Threat Model Position

This threat model defines the assets, actors, trust boundaries, abuse cases, attack paths, controls, residual risks, and verification evidence for `[PROJECT_NAME]`.

AI-enabled components, agent workflows, retrieval systems, prompts, embeddings, model outputs, tool calls, CI/CD systems, cloud environments, and distribution channels are treated as security-relevant surfaces.

---

## 1. Scope

### 1.1 In Scope

- [Component/workflow]

### 1.2 Out of Scope

- [Component/workflow]

### 1.3 Assumptions

- [Assumption]

### 1.4 Trigger Rationale

Threat model is required because (check all that apply):

- [ ] Risk Class R2+ ([`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md))
- [ ] Externally exposed
- [ ] AI-enabled
- [ ] Multi-tenant
- [ ] Federal / regulated / mission-impacting
- [ ] Security-critical (other — describe)

Canonical trigger union: [`../Engineering/SECURITY.md`](../Engineering/SECURITY.md) · [`../README.md`](../README.md) factory step 6.

---

## 2. Assets

| Asset | Type | Classification | Business/Mission Impact | Owner |
|---|---|---|---|---|
| [Asset] | [Data/service/model/etc.] | [Level] | [Impact] | [Owner] |

---

## 3. Actors

| Actor | Intent | Trust Level | Access |
|---|---|---|---|
| Authorized user | [Intent] | [Trust] | [Access] |
| Admin/operator | [Intent] | [Trust] | [Access] |
| External attacker | [Intent] | Untrusted | None |
| Malicious insider | [Intent] | Partial | [Access] |
| Compromised dependency | [Intent] | Untrusted | [Access path] |
| Prompt injection adversary | [Intent] | Untrusted | User/retrieval/tool content |
| Compromised model/tool provider | [Intent] | Untrusted/third-party | [Access path] |

---

## 4. Trust Boundaries

| Boundary | Assets Inside | Inputs Crossing Boundary | Controls | Evidence |
|---|---|---|---|---|
| User input boundary | [Assets] | [Inputs] | [Controls] | [Evidence] |
| Identity boundary | | | | |
| AI/model boundary | | | | |
| Tool execution boundary | | | | |
| Data boundary | | | | |
| CI/CD boundary | | | | |
| Cloud boundary | | | | |
| Distribution boundary | | | | |

---

## 5. Abuse Cases

| ID | Abuse Case | Actor | Target | Impact | `side_effect_class` | Required Control | Test Evidence |
|---|---|---|---|---|---|---|---|
| ABUSE-001 | [Abuse case] | [Actor] | [Target] | [Impact] | read \| draft \| write \| irreversible | [Control] | [Test] |

---

## 6. AI-Specific Threats

| ID | Threat | Example | Control | Evidence |
|---|---|---|---|---|
| AI-T001 | Prompt injection | User/retrieved content attempts to override system/tool policy. | Instruction hierarchy, input isolation, tool allowlists, adversarial evals. | [Evidence] |
| AI-T002 | Data leakage | Sensitive data appears in output, logs, embeddings, or model memory. | DLP, classification labels, redaction, no-training terms, output review. | [Evidence] |
| AI-T003 | Insecure tool use | Model calls a privileged tool incorrectly or maliciously. | Tool scopes, deterministic policy, confirmations, sandboxing. | [Evidence] |
| AI-T004 | RAG overexposure | User retrieves documents beyond authorization. | Source-level ACLs before retrieval, metadata filters, audit logs. | [Evidence] |
| AI-T005 | Hallucinated authority | AI invents approvals, requirements, citations, evidence, or policies. | Evidence verifier, citations, human approval, deterministic checks. | [Evidence] |
| AI-T006 | Model/supply-chain compromise | Untrusted model, dataset, plugin, or extension manipulates output. | Provider review, provenance, version pinning, sandboxing, monitoring. | [Evidence] |
| AI-T007 | PHI / regulated leakage via AI surfaces | PHI/ePHI or CUI appears in prompts, logs, embeddings, RAG chunks, or eval fixtures without authorization. | ClassificationEnforcer, residency veto, synthetic golden sets, REGULATED_PROFILES overlays, redaction. | [Evidence] |

---

## 7. Attack Path Analysis

| ID | Attack Path | Preconditions | Steps | Detection | Mitigation | Residual Risk |
|---|---|---|---|---|---|---|
| PATH-001 | [Attack path] | [Preconditions] | [Steps] | [Detection] | [Mitigation] | [Risk] |

---

## 8. Control Coverage

| Threat ID | Preventive Control | Detective Control | Corrective Control | Test / Evidence |
|---|---|---|---|---|
| [Threat] | [Prevent] | [Detect] | [Correct] | [Evidence] |

---

## 9. Residual Risk Register

| Risk ID | Description | Severity | Likelihood | Impact | Owner | Decision | Review Date |
|---|---|---|---|---|---|---|---|
| RISK-001 | [Risk] | [Severity] | [Likelihood] | [Impact] | [Owner] | [Accept/Mitigate/Transfer/Avoid] | [Date] |

---

## 10. Security Test Plan

| Test ID | Threat / Control | Method | Expected Result | Evidence |
|---|---|---|---|---|
| TM-TEST-001 | [Threat/control] | [Manual/automated/eval] | [Expected] | [Artifact] |

---

## 11. Sign-Off

| Role | Name | Decision | Date | Notes |
|---|---|---|---|---|
| Product owner | [Name] | [Approved/Rejected] | [Date] | [Notes] |
| Architecture owner | [Name] | [Approved/Rejected] | [Date] | [Notes] |
| Security owner | [Name] | [Approved/Rejected] | [Date] | [Notes] |
| Data/privacy owner | [Name] | [Approved/Rejected] | [Date] | [Notes] |

---

## Document control

- Parent standards: [`../Engineering/SECURITY.md`](../Engineering/SECURITY.md) · [`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md) · [`../AI/TOOLS.md`](../AI/TOOLS.md)
- Material changes: MDES ([`../MDES.md`](../MDES.md)); suite-affecting changes also MCR ([`../Governance/MES_REVIEW_PROCESS.md`](../Governance/MES_REVIEW_PROCESS.md))
- External posture starters: [`../REFERENCES.md`](../REFERENCES.md) (OWASP, NIST — informative, not certification)
