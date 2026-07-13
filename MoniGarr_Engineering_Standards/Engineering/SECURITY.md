# SECURITY — Posture, Controls, and Evidence

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All Products, Services, Repositories  
**Canonical Path:** `Engineering/SECURITY.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) · [`../Governance/MOM.md`](../Governance/MOM.md) · [`../Governance/MILE.md`](../Governance/MILE.md) · [`../Templates/SECURITY_REQUIREMENTS_TEMPLATE.md`](../Templates/SECURITY_REQUIREMENTS_TEMPLATE.md) · [`../Templates/THREAT_MODEL_TEMPLATE.md`](../Templates/THREAT_MODEL_TEMPLATE.md) · [`../Templates/PRIVACY_DATA_GOVERNANCE_TEMPLATE.md`](../Templates/PRIVACY_DATA_GOVERNANCE_TEMPLATE.md) · [`../REFERENCES.md`](../REFERENCES.md) · [`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md) · [`ENGINEERING_STANDARDS.md`](ENGINEERING_STANDARDS.md) · [`TESTING.md`](TESTING.md) · [`OBSERVABILITY.md`](OBSERVABILITY.md) · [`DEVOPS.md`](DEVOPS.md) · [`ONCALL.md`](ONCALL.md) · [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) · [`../GLOSSARY.md`](../GLOSSARY.md)

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

## Security Position (Read Carefully)

MES defines a **security posture**: risk-based controls, evidence, lifecycle awareness, and operational governance.

MES does **not** by itself constitute:

- A federal Authorization to Operate (ATO)  
- A SOC 2 / ISO 27001 / FedRAMP certification  
- A legal or contractual compliance attestation  
- Proof that a project has completed agency authorization  

Projects **shall** instantiate and tailor project security requirements from [`../Templates/SECURITY_REQUIREMENTS_TEMPLATE.md`](../Templates/SECURITY_REQUIREMENTS_TEMPLATE.md). Template language about SSP/SAR/SAP, baselines, and authorization packages is **starter architecture**, not evidence that those packages exist or that certification has been achieved.

**Canonical instantiation rule:** Project control lists and requirement tables live only in repository `SECURITY.md` derived from [`../Templates/SECURITY_REQUIREMENTS_TEMPLATE.md`](../Templates/SECURITY_REQUIREMENTS_TEMPLATE.md). [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Part XVII states principles and regulated overlays; it **shall not** duplicate full control catalogs.

Claiming certification or ATO without documented authorization evidence is non-conformant and prohibited.

---

## Purpose

This document sets company-wide security expectations for engineering teams and AI agents: how to design, implement, verify, and operate secure systems under MES.

---

## Core Principles

1. **Least privilege** everywhere (humans, services, agents, tools).  
2. **Defense in depth** — no single control is sufficient.  
3. **Fail closed** for authZ, audit, and safety-critical decisions.  
4. **Evidence-based** — controls without proof are aspirations.  
5. **Assume breach** planning for detection and response.  
6. **AI is untrusted** — models propose; deterministic policy disposes.  
7. **Privacy by design** — minimize, classify, retain intentionally.

---

## Project Security Artifacts

Depending on risk and data class, projects **shall** maintain:

| Artifact | When |
|----------|------|
| Project `SECURITY.md` from [`../Templates/SECURITY_REQUIREMENTS_TEMPLATE.md`](../Templates/SECURITY_REQUIREMENTS_TEMPLATE.md) | All production systems |
| `THREAT_MODEL.md` | Security-critical, externally exposed, AI-enabled, multi-tenant, federal, regulated, or mission-impacting |
| `PRIVACY_DATA_GOVERNANCE.md` | Non-public, regulated, CUI, classified, privacy-sensitive, AI-training, or sovereign/community-protected data |
| ADRs for security deviations | Any MES or project control exception |

Do not delete template domains solely because they are burdensome; mark Not Applicable with rationale, reviewer, date, and residual risk.

---

## Identity, Authentication, Authorization

- Authenticate before authorize.  
- Prefer modern identity protocols appropriate to the environment (OIDC/OAuth2, workforce IdP, etc.).  
- Service-to-service auth **shall** use short-lived credentials or workload identity where available.  
- Authorization decisions **shall** be enforced server-side.  
- Admin paths **shall** have stricter controls and audit.  
- Agent tools **shall** be allowlisted and policy-checked before invocation.

UI hiding is not authorization.

---

## Secrets Management

- Secrets **shall not** live in source control.  
- Use environment secret stores / platform secret managers (see [`DEVOPS.md`](DEVOPS.md)).  
- Rotate on compromise or schedule; revoke promptly on offboarding.  
- Detect secrets in CI; failed detection is a release blocker when high confidence.  
- `.env.example` **may** list keys with placeholders only.

---

## Data Protection

- Classify data at boundaries (public, internal, confidential, CUI, etc.).  
- Encrypt in transit (TLS) for networked production paths.  
- Encrypt sensitive data at rest as platform/risk requires.  
- Minimize PII in logs, traces, prompts, and analytics.  
- Separate customer production data from eval/training corpora unless explicitly authorized.

**Example (CareerPilot):** Resume content and employer communications are treated as sensitive customer data with redaction rules for prompt logs — illustrative only.

---

## Application Security Baseline

Production apps **shall**:

- Validate and encode at trust boundaries  
- Protect against injection (SQL, command, template, prompt)  
- Enforce CSRF protections where cookie sessions apply  
- Set secure cookie/header defaults for browsers  
- Limit request sizes and rates on abuse-prone endpoints  
- Keep dependency and container images patched on a defined cadence  

---

## AI / LLM Security

AI-enabled systems **shall**:

- Treat model output as untrusted data  
- Defend against prompt injection and tool abuse  
- Constrain tools with deterministic authorization  
- Ground high-stakes claims or refuse  
- Require HITL for material risk actions  
- Red-team critical surfaces before broad exposure  
- Avoid placing secrets in prompts or retrieval corpora  

See [`../Governance/MILE.md`](../Governance/MILE.md) and [`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md).

---

## Supply Chain Security

- Pin dependencies; review new packages.  
- Generate SBOM for production releases.  
- Scan images and libraries in CI.  
- Prefer signed artifacts where platform supports it.  
- Document build provenance for release records.

---

## Secure SDLC Gates

| Stage | Security expectation |
|-------|----------------------|
| Design | Threat considerations; data class; trust boundaries |
| Implementation | Headers, validation, least privilege |
| PR / CI | SAST, secret scan, dependency scan, authZ negatives |
| Pre-prod | Config review; penetration/abuse tests as risk warrants |
| Release | Evidence pack; residual risk acceptance if needed |
| Operate | Monitoring, incident response, patching |

---

## Logging, Audit, and Monitoring

Security-relevant events **shall** be auditable:

- AuthN success/failure (without password material)  
- AuthZ denials on sensitive actions  
- Admin operations  
- Secret access where platform supports  
- Agent tool invocations and HITL decisions  

Audit paths that are required for policy **shall** fail closed when audit cannot be written.

Coordinate detail with [`OBSERVABILITY.md`](OBSERVABILITY.md).

---

## Vulnerability Management

- Triage findings by severity and exploitability.  
- Critical/high production findings **shall** have owners and due dates.  
- Track remediation in POA&M-style lists when formal tracking is required by customer/mission.  
- “Risk accepted” **shall** be written, time-bounded, and approved by an accountable human.

---

## Incident Response (Security)

Security incidents follow [`ONCALL.md`](ONCALL.md) severity and escalation, with additional requirements:

- Preserve forensic evidence  
- Rotate compromised credentials  
- Notify stakeholders per legal/contractual duty (human-led)  
- Post-incident: root cause, corrective actions, control improvements  

AI agents **may** assist investigation drafts; humans own external notification decisions.

---

## Multi-Tenant & Isolation

Multi-tenant systems **shall** prevent cross-tenant data access by design (authZ + data scoping + tests). Shared caches and retrieval indexes **shall** enforce tenant boundaries.

---

## Federal / Regulated Contexts

When building for federal or heavily regulated customers:

- Tailor [`../Templates/SECURITY_REQUIREMENTS_TEMPLATE.md`](../Templates/SECURITY_REQUIREMENTS_TEMPLATE.md) seriously  
- Do not equate MES posture with authorization  
- Track inherited vs system-specific controls  
- Keep evidence packs reviewable by security assessors  

MES helps teams prepare; authorizing officials decide.

---

## Developer & Agent Responsibilities

Engineers and coding agents **shall**:

- Never commit secrets or private keys  
- Never weaken authZ to “make the demo work”  
- Never disable security scanners without ADR + approval  
- Prefer secure defaults in templates and scaffolds  
- Document security-relevant changes in PRs  

---

## Threat Modeling Expectations

Threat models **shall** exist when **any** of the following is true:

1. The system or workflow is **Risk Class R2+** ([`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md)), **or**  
2. The system matches factory workflow predicates in [`../README.md`](../README.md) step 6: security-critical, externally exposed, AI-enabled, multi-tenant, federal, regulated, or mission-impacting.

Threat models **shall** be current before R3+ production promotion. R0–R1 systems that do **not** match the system-type predicates **should** maintain a lightweight threat note or ADR exception.

Update threat models when architecture or exposure changes materially. Use [`../Templates/THREAT_MODEL_TEMPLATE.md`](../Templates/THREAT_MODEL_TEMPLATE.md).

Threat models **shall** cover (or mark N/A with rationale):

- Assets and data flows  
- Adversaries and abuse cases  
- Trust boundaries  
- Mitigations and residual risks  
- AI-specific abuses (injection, exfiltration, privilege escalation via tools)  
- PHI / regulated data leakage via prompts, RAG, memory, or logs when those profiles apply  

---

## Privacy Intersection

Security and privacy overlap. Engineering **shall** coordinate retention, consent, redaction, and subject-rights mechanics with privacy artifacts when those obligations apply.

---

## Evidence Pack (Security Slice)

Typical evidence includes:

- Scan reports (SAST, SCA, container)  
- AuthZ test results  
- Threat model currency  
- SBOM  
- Secret rotation records when relevant  
- Approvals for residual risk  

---

## Anti-Patterns

- Marketing “enterprise secure” without controls evidence  
- Claiming SOC2/ATO because a template mentions it  
- Logging raw prompts with secrets/PII by default  
- Unbounded agent tools in production  
- Shared service accounts across environments  
- Security exceptions without expiry  

---

## Conformance Checklist

- [ ] Project SECURITY.md tailored from template  
- [ ] Posture vs certification distinction understood  
- [ ] Secrets managed outside git  
- [ ] CI security scans enabled  
- [ ] AI tool policy deterministic when AI present  
- [ ] Threat/privacy artifacts present when required  
- [ ] Incident path documented  

---

## See Also

- [`../Templates/SECURITY_REQUIREMENTS_TEMPLATE.md`](../Templates/SECURITY_REQUIREMENTS_TEMPLATE.md)  
- [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md)  
- [`../REFERENCES.md`](../REFERENCES.md)  
- [`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md)  
- [`../Governance/MOM.md`](../Governance/MOM.md)  
- [`TESTING.md`](TESTING.md) · [`DEVOPS.md`](DEVOPS.md) · [`ONCALL.md`](ONCALL.md) · [`OBSERVABILITY.md`](OBSERVABILITY.md)
