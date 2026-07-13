# [PROJECT_NAME] — Security Requirements

**MES Version:** 1.1.1  
**Document:** `SECURITY.md`  
**Project:** [PROJECT_NAME]  
**Repository:** [REPOSITORY_NAME]  
**Owner:** [OWNER]  
**Security Owner:** [SECURITY_OWNER]  
**Version:** [VERSION]  
**Status:** [DRAFT / REVIEW / APPROVED / ACTIVE]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]  
**Classification:** [PUBLIC / INTERNAL / CUI / CLASSIFIED / OTHER]  
**Authority:** [Agency / AO / Security Lead / Product Owner]  
**Scope:** Architecture, engineering, production, maintenance, management, and distribution.

---

## 0. Security Position

Security for this system is not limited to authentication, RBAC, encryption, dependency scanning, secrets management, audit logging, supply-chain protection, prompt-injection mitigation, or data isolation. Those controls are necessary but not sufficient.

The system security architecture must be risk-based, evidence-based, lifecycle-aware, and operationally governable. It must cover categorization, control selection, authorization, continuous monitoring, secure software development, supply-chain assurance, identity assurance, cryptographic validation, privacy, incident response, configuration management, resilience, maintenance, distribution, and accountable governance.

This template is a starter architecture. It must be tailored to the actual mission, impact level, data classification, agency/customer requirements, hosting environment, technology stack, threat model, and Authorizing Official or security authority decisions.

---

## 1. Applicability and Tailoring

| Question | Answer | Evidence / Rationale |
|---|---|---|
| Is this a federal system or federal contractor-delivered system? | [Yes/No/Unknown] | [Evidence] |
| Is this a National Security System? | [Yes/No/Unknown] | [Evidence] |
| Does this process CUI? | [Yes/No/Unknown] | [Evidence] |
| Does this process PII or sensitive PII? | [Yes/No/Unknown] | [Evidence] |
| Does this process classified data? | [Yes/No/Unknown] | [Evidence] |
| Does this use AI models, agents, RAG, embeddings, or AI coding assistants? | [Yes/No/Unknown] | [Evidence] |
| Does this run in cloud infrastructure? | [Yes/No/Unknown] | [Evidence] |
| Does this distribute software, packages, images, models, or updates? | [Yes/No/Unknown] | [Evidence] |
| Does this have external users or public exposure? | [Yes/No/Unknown] | [Evidence] |
| Does this affect rights, benefits, eligibility, safety, enforcement, or public-facing agency action? | [Yes/No/Unknown] | [Evidence] |

### Tailoring Rule

Do not delete a security domain because it appears burdensome. Mark it `Not Applicable` only with rationale, reviewer, date, and residual-risk decision.

---

## 2. Federal Governance, Risk, and Authorization

### 2.1 Requirements

| ID | Requirement | Implementation Expectation | Evidence |
|---|---|---|---|
| SEC-GOV-001 | Define system authorization boundary. | Document components, external dependencies, inherited controls, data flows, users, environments, and excluded assets. | Boundary diagram, SSP, architecture doc |
| SEC-GOV-002 | Perform security categorization. | Determine confidentiality, integrity, and availability impact levels; use CNSSI 1253 where NSS applies. | Categorization worksheet |
| SEC-GOV-003 | Select and tailor control baseline. | Map selected baseline to system risk, data, mission, cloud, AI, and operational context. | Control matrix |
| SEC-GOV-004 | Implement selected controls. | Assign owners, implementation status, evidence, and test method for each control. | Control implementation statement |
| SEC-GOV-005 | Assess controls. | Use independent, peer, internal, 3PAO, or agency-defined assessment as applicable. | SAP, SAR, test records |
| SEC-GOV-006 | Support authorization or risk acceptance. | Provide evidence for ATO, ongoing authorization, internal release approval, or customer approval. | Authorization package / approval record |
| SEC-GOV-007 | Maintain continuous monitoring. | Track metrics, vulnerabilities, configuration drift, incidents, control status, and POA&M. | ConMon plan, dashboards, POA&M |
| SEC-GOV-008 | Manage control inheritance. | Identify controls inherited from CSP, platform, enterprise, identity provider, CI/CD, or shared services. | Inheritance matrix |

### 2.2 Authorization Artifacts

| Artifact | Required? | Owner | Status | Location |
|---|---|---|---|---|
| System Security Plan (SSP) | [Y/N] | [Owner] | [Status] | [Link] |
| Security Assessment Plan (SAP) | [Y/N] | [Owner] | [Status] | [Link] |
| Security Assessment Report (SAR) | [Y/N] | [Owner] | [Status] | [Link] |
| Plan of Action and Milestones (POA&M) | [Y/N] | [Owner] | [Status] | [Link] |
| Privacy Impact Assessment (PIA) | [Y/N] | [Owner] | [Status] | [Link] |
| System of Records Notice (SORN) review | [Y/N] | [Owner] | [Status] | [Link] |
| Control inheritance matrix | [Y/N] | [Owner] | [Status] | [Link] |
| Continuous monitoring plan | [Y/N] | [Owner] | [Status] | [Link] |
| Risk acceptance memo | [Y/N] | [Owner] | [Status] | [Link] |

---

## 3. Secure Software Development Lifecycle

| ID | Requirement | Implementation Expectation | Evidence |
|---|---|---|---|
| SEC-SDLC-001 | Security requirements traceability. | Link security requirements to architecture, code, tests, and release evidence. | Traceability matrix |
| SEC-SDLC-002 | Threat modeling. | Model misuse, abuse, data leakage, access control, supply chain, and AI-specific threats before release. | `THREAT_MODEL.md` |
| SEC-SDLC-003 | Secure architecture review. | Review trust boundaries, authorization boundary, data flows, secrets, crypto, logging, and failure modes. | Review record |
| SEC-SDLC-004 | Secure coding standards. | Define language/framework-specific secure coding rules. | Standards doc, PR checks |
| SEC-SDLC-005 | Peer and security review. | Require review for risky code, auth logic, crypto, data handling, CI/CD, infrastructure, and AI tools. | Pull request records |
| SEC-SDLC-006 | Automated security testing. | Use SAST, DAST, IAST where applicable, SCA, secrets scanning, IaC scanning, container scanning, fuzzing, and abuse-case tests. | Scan reports |
| SEC-SDLC-007 | Release security gates. | Block release on critical issues, unapproved risk, failed security tests, missing SBOM/provenance, or missing approval. | CI/CD gate logs |
| SEC-SDLC-008 | Vulnerability response. | Define intake, triage, severity, remediation SLA, disclosure, recurrence prevention, and POA&M tracking. | Vulnerability process |

---

## 4. Identity, Credential, and Access Management

| ID | Requirement | Implementation Expectation | Evidence |
|---|---|---|---|
| SEC-IAM-001 | Authentication. | Require strong authentication appropriate to impact and user population. | IAM design, logs |
| SEC-IAM-002 | Identity proofing and assurance. | Define identity proofing, authenticator assurance, federation assurance, and account lifecycle requirements. | Identity profile |
| SEC-IAM-003 | Phishing-resistant MFA. | Use phishing-resistant MFA where required or appropriate; document exceptions. | MFA policy |
| SEC-IAM-004 | PIV/CAC and federation. | Support PIV/CAC/federation where federal or agency environment requires it. | Federation config |
| SEC-IAM-005 | Authorization. | Enforce least privilege using RBAC, ABAC, policy-as-code, or explicit access rules. | Access matrix |
| SEC-IAM-006 | Privileged access management. | Control admin access, require approval, log privileged sessions, and review access periodically. | PAM records |
| SEC-IAM-007 | Service-account governance. | Identify owners, permissions, rotation, expiration, and usage restrictions. | Service account inventory |
| SEC-IAM-008 | Workload identity. | Prefer short-lived workload identities over static credentials. | Workload identity config |
| SEC-IAM-009 | Separation of duties. | Separate generation, approval, deployment, security assessment, and risk acceptance roles. | Role matrix |
| SEC-IAM-010 | Session management. | Enforce secure cookies/tokens, expiration, revocation, device context, and re-authentication where needed. | Session tests |

---

## 5. Cryptography, Key Management, and Secrets

| ID | Requirement | Implementation Expectation | Evidence |
|---|---|---|---|
| SEC-CRYPTO-001 | Approved cryptography. | Use approved algorithms and validated cryptographic modules where required. | Crypto inventory |
| SEC-CRYPTO-002 | Encryption in transit. | Enforce TLS configuration appropriate to environment and risk. | TLS scan/config |
| SEC-CRYPTO-003 | Encryption at rest. | Encrypt databases, object stores, backups, logs, and restricted artifacts. | Storage config |
| SEC-CRYPTO-004 | Encryption in use. | Evaluate confidential computing or equivalent controls for high-risk workloads when needed. | Design decision |
| SEC-CRYPTO-005 | Key management. | Define key generation, storage, rotation, escrow, access, backup, destruction, and separation of duties. | KMS policy |
| SEC-CRYPTO-006 | Certificate management. | Track issuance, ownership, expiration, revocation, and renewal. | Certificate inventory |
| SEC-CRYPTO-007 | Secrets management. | Store secrets in approved vaults; prohibit plaintext secrets in code, logs, tickets, prompts, and documentation. | Secrets scan |
| SEC-CRYPTO-008 | Crypto agility. | Maintain inventory and plan for algorithm changes and post-quantum transition where applicable. | Crypto roadmap |

---

## 6. Data Security and Privacy

| ID | Requirement | Implementation Expectation | Evidence |
|---|---|---|---|
| SEC-DATA-001 | Data classification. | Classify source data, documents, prompts, outputs, embeddings, logs, model artifacts, and derived products. | Data inventory |
| SEC-DATA-002 | CUI handling. | Identify CUI status, category, markings, dissemination controls, authorized users/systems, and AI permissions. | CUI register |
| SEC-DATA-003 | PII protection. | Apply minimization, purpose limitation, access controls, audit logging, breach readiness, and privacy review. | Privacy review |
| SEC-DATA-004 | Data minimization. | Collect and retain only mission-required data. | Data map |
| SEC-DATA-005 | Retention and disposal. | Enforce retention schedules, legal hold, secure deletion, sanitization, and records handling. | Retention records |
| SEC-DATA-006 | Tenant/data isolation. | Separate tenants, missions, environments, classifications, and authorization boundaries. | Isolation tests |
| SEC-DATA-007 | Database security. | Enforce least privilege, encryption, backups, monitoring, patching, and query controls. | DB config |
| SEC-DATA-008 | Tokenization/masking. | Apply masking, tokenization, anonymization, or pseudonymization where appropriate; validate re-identification risk. | Data protection tests |
| SEC-DATA-009 | Cross-boundary data flow. | Control exports, APIs, external sharing, interagency exchange, contractor access, and publication. | Data flow records |
| SEC-DATA-010 | AI data boundary. | Prevent restricted data from entering unauthorized AI tools, IDE extensions, model APIs, agents, or training pipelines. | AI boundary tests |

---

## 7. Cloud, Platform, and Infrastructure Security

| ID | Requirement | Implementation Expectation | Evidence |
|---|---|---|---|
| SEC-CLOUD-001 | Cloud authorization baseline. | Determine FedRAMP Low/Moderate/High/LI-SaaS or equivalent requirement if cloud-based. | Cloud baseline decision |
| SEC-CLOUD-002 | Shared responsibility. | Map CSP, platform, enterprise, customer, and application responsibilities. | Shared responsibility matrix |
| SEC-CLOUD-003 | Secure configuration baselines. | Use hardened images, CIS/STIG/agency baselines where applicable, and drift detection. | Baseline scans |
| SEC-CLOUD-004 | Infrastructure-as-code security. | Scan IaC for misconfiguration, exposed secrets, insecure defaults, and public access. | IaC scan reports |
| SEC-CLOUD-005 | Network segmentation. | Segment environments, tenants, workloads, management planes, data tiers, and external access. | Network diagram/tests |
| SEC-CLOUD-006 | Zero trust architecture. | Treat users, devices, workloads, services, and data sources as resources requiring explicit authentication and authorization. | ZTA design |
| SEC-CLOUD-007 | Container/Kubernetes security. | Secure images, registries, admission control, runtime policy, namespaces, network policy, secrets, and workload identity. | Container/K8s scans |
| SEC-CLOUD-008 | Runtime protection. | Monitor workloads, APIs, identities, containers, hosts, and cloud control planes. | CSPM/CWPP/CNAPP reports |

---

## 8. DevSecOps, Build, Release, and Distribution Security

| ID | Requirement | Implementation Expectation | Evidence |
|---|---|---|---|
| SEC-DEVOPS-001 | Protected CI/CD. | Restrict pipeline permissions, protect branches, require reviews, and log deployments. | CI/CD config |
| SEC-DEVOPS-002 | Build isolation. | Isolate build runners and prevent untrusted code from accessing privileged secrets. | Runner policy |
| SEC-DEVOPS-003 | Artifact integrity. | Hash, sign, and verify build artifacts, containers, packages, models, and release bundles. | Signatures/checksums |
| SEC-DEVOPS-004 | Provenance and attestations. | Generate provenance/build attestations for release artifacts where feasible. | Attestations |
| SEC-DEVOPS-005 | SBOM. | Generate and retain SBOMs for releases; provide upon authorized request where applicable. | SBOM artifacts |
| SEC-DEVOPS-006 | HBOM. | Maintain hardware inventory/HBOM where hardware, appliances, embedded systems, or federal risk policy require it. | HBOM records |
| SEC-DEVOPS-007 | Dependency pinning. | Pin critical dependencies and verify package integrity. | Lockfiles/policy |
| SEC-DEVOPS-008 | Secure package repositories. | Use approved registries, scoped tokens, package signing, and malware detection. | Registry config |
| SEC-DEVOPS-009 | Secure update channels. | Protect update delivery, rollback, versioning, and release approval. | Release records |
| SEC-DEVOPS-010 | Distribution controls. | Define who can receive binaries, models, containers, documentation, and updates. | Distribution list |

---

## 9. Software Supply Chain Risk Management

| ID | Requirement | Implementation Expectation | Evidence |
|---|---|---|---|
| SEC-SCRM-001 | Open-source governance. | Approve licenses, maintainers, project health, vulnerability history, and replacement strategy. | OSS review |
| SEC-SCRM-002 | Third-party component review. | Review libraries, services, SaaS, APIs, models, datasets, and tools. | Component register |
| SEC-SCRM-003 | Vendor risk management. | Evaluate vendors for security posture, contracts, access, data handling, incident notice, and support lifecycle. | Vendor assessment |
| SEC-SCRM-004 | Malicious package detection. | Monitor typosquatting, dependency confusion, maintainer compromise, and suspicious package behavior. | Detection reports |
| SEC-SCRM-005 | Provenance tracking. | Track source, version, origin, maintainer, license, and integrity for software and model artifacts. | Provenance record |
| SEC-SCRM-006 | Supplier assurance. | Define contractual security requirements, audit rights, disclosure obligations, and support commitments. | Contract clauses |

---

## 10. Configuration, Change, Asset, and Maintenance Management

| ID | Requirement | Implementation Expectation | Evidence |
|---|---|---|---|
| SEC-CM-001 | Asset inventory. | Maintain hardware, software, cloud, data, model, service, and dependency inventories. | Inventory export |
| SEC-CM-002 | Secure baselines. | Define approved baseline configurations for application, infrastructure, identity, and data systems. | Baseline docs |
| SEC-CM-003 | Drift detection. | Detect and alert on configuration drift. | Drift reports |
| SEC-CM-004 | Change control. | Review and approve changes by risk tier. | Change records |
| SEC-CM-005 | Emergency change process. | Allow urgent changes with post-implementation review and evidence. | Emergency change log |
| SEC-CM-006 | Patch management. | Track vulnerabilities, patches, exceptions, and maintenance windows. | Patch records |
| SEC-CM-007 | Maintenance access controls. | Control support access, remote maintenance, vendor access, and break-glass procedures. | Access logs |
| SEC-CM-008 | End-of-life management. | Identify EOL/EOS components and replacement timelines. | Lifecycle register |
| SEC-CM-009 | Environment separation. | Separate dev, test, staging, production, classified, CUI, and customer environments as applicable. | Environment matrix |

---

## 11. Vulnerability Management and Security Testing

| ID | Requirement | Implementation Expectation | Evidence |
|---|---|---|---|
| SEC-VULN-001 | Vulnerability scanning. | Scan application, infrastructure, containers, dependencies, IaC, secrets, APIs, and endpoints. | Scan reports |
| SEC-VULN-002 | KEV tracking. | Monitor Known Exploited Vulnerabilities and prioritize remediation. | KEV review |
| SEC-VULN-003 | Remediation SLAs. | Define SLAs by severity, exploitability, exposure, and mission impact. | SLA policy |
| SEC-VULN-004 | Exploitability analysis. | Validate whether findings are reachable, exploitable, mitigated, or false positives. | Triage records |
| SEC-VULN-005 | Penetration testing. | Conduct penetration testing where risk, exposure, customer, or authorization requires it. | Pen test report |
| SEC-VULN-006 | Red-team/adversarial testing. | Conduct red-team testing for high-risk systems and AI-enabled workflows. | Red-team report |
| SEC-VULN-007 | Vulnerability disclosure. | Define coordinated disclosure, intake, safe harbor where applicable, and response process. | Disclosure policy |
| SEC-VULN-008 | POA&M tracking. | Track open findings, owner, due date, risk, mitigation, and closure evidence. | POA&M |

---

## 12. Logging, Monitoring, Detection, and Auditability

| ID | Requirement | Implementation Expectation | Evidence |
|---|---|---|---|
| SEC-LOG-001 | Audit event definition. | Define events for auth, access, admin actions, data access, AI processing, exports, failures, security decisions, and deployments. | Log schema |
| SEC-LOG-002 | Centralized logging. | Forward logs to approved centralized system. | Log pipeline |
| SEC-LOG-003 | Tamper resistance. | Protect logs from unauthorized modification/deletion. | Log store config |
| SEC-LOG-004 | Time synchronization. | Synchronize time across systems. | Time config |
| SEC-LOG-005 | SIEM/SOAR integration. | Integrate security events with detection, alerting, triage, and escalation. | SIEM rules |
| SEC-LOG-006 | Behavioral detection. | Detect anomalous access, data export, privilege use, prompt abuse, and model/tool misuse. | Detection reports |
| SEC-LOG-007 | Audit retention. | Retain audit evidence according to policy, contracts, records requirements, and investigation needs. | Retention config |
| SEC-LOG-008 | Metrics and evidence. | Produce control metrics for continuous monitoring. | Dashboard |

---

## 13. Incident Response, Resilience, and Recovery

| ID | Requirement | Implementation Expectation | Evidence |
|---|---|---|---|
| SEC-IR-001 | Incident response plan. | Define roles, severity, triage, containment, eradication, recovery, communications, and post-incident review. | IR plan |
| SEC-IR-002 | Security event classification. | Classify incidents including data leak, auth compromise, supply-chain issue, AI misuse, model leakage, and service outage. | Severity rubric |
| SEC-IR-003 | Breach reporting workflow. | Define internal, customer, agency, legal, privacy, and contractual reporting obligations. | Reporting plan |
| SEC-IR-004 | Forensic readiness. | Preserve logs, artifacts, timelines, evidence, and chain of custody as appropriate. | Forensic plan |
| SEC-IR-005 | Backup and restore. | Encrypt backups and periodically test restoration. | Restore test |
| SEC-IR-006 | Disaster recovery. | Define RTO, RPO, failover, backup region, and manual recovery. | DR plan/test |
| SEC-IR-007 | Contingency and continuity. | Maintain operational continuity for mission-critical workflows. | Continuity plan |
| SEC-IR-008 | Tabletop exercises. | Conduct exercises for security, privacy, supply chain, cloud outage, AI misuse, and data leak scenarios. | Tabletop records |
| SEC-IR-009 | Corrective action. | Convert incidents into root-cause fixes, tests, control updates, and POA&M items. | Post-incident report |

---

## 14. Personnel, Process, and Operational Security

| ID | Requirement | Implementation Expectation | Evidence |
|---|---|---|---|
| SEC-OPS-001 | Security awareness training. | Require general security training for contributors. | Training records |
| SEC-OPS-002 | Developer secure-coding training. | Require role-specific training for engineers. | Training records |
| SEC-OPS-003 | Privileged-user training. | Require training before elevated access. | Training records |
| SEC-OPS-004 | Onboarding/offboarding. | Grant and revoke access based on role, need, and employment/contract status. | Access reviews |
| SEC-OPS-005 | Insider-threat considerations. | Apply monitoring, separation of duties, least privilege, and reporting where applicable. | Policy |
| SEC-OPS-006 | Third-party access governance. | Approve, restrict, monitor, and revoke vendor/contractor access. | Vendor access log |
| SEC-OPS-007 | Maintenance personnel controls. | Control personnel access to production, sensitive environments, and support tools. | Maintenance records |

---

## 15. AI and Model Security

| ID | Requirement | Implementation Expectation | Evidence |
|---|---|---|---|
| SEC-AI-001 | Prompt injection mitigation. | Treat retrieved content, user input, tool output, and model output as untrusted; enforce instruction hierarchy and tool policies. | Adversarial evals |
| SEC-AI-002 | Data leakage prevention. | Prevent sensitive data from being exposed in prompts, outputs, embeddings, logs, telemetry, or training. | DLP tests |
| SEC-AI-003 | Model input/output controls. | Validate, sanitize, classify, and log model inputs and outputs where appropriate. | Validation tests |
| SEC-AI-004 | RAG security. | Enforce source-level access control before retrieval and response generation. | RAG access tests |
| SEC-AI-005 | Tool-call security. | Use allowlisted tools, scoped permissions, confirmations, budgets, and deterministic guardrails. | Tool policy tests |
| SEC-AI-006 | Model and dataset provenance. | Track model source, version, provider, dataset lineage, fine-tuning data, evals, and restrictions. | Model card/dataset card |
| SEC-AI-007 | AI evaluation and red-teaming. | Test hallucination, prompt injection, data leakage, unsafe tool use, bias, robustness, and refusal behavior. | Eval report |
| SEC-AI-008 | Human oversight. | Require human review for high-impact outputs and decisions affecting rights, services, benefits, enforcement, safety, or public action. | Approval records |
| SEC-AI-009 | Model monitoring. | Monitor drift, quality, cost, failures, safety events, and abuse patterns. | Monitoring dashboard |
| SEC-AI-010 | AI supply-chain risk. | Review model providers, AI tools, plugins, IDE extensions, datasets, weights, and evaluation tooling. | AI SCRM review |
| SEC-AI-011 | Model memory control. | Prevent unauthorized retention, learning, or replay of restricted prompts, context, files, and outputs. | Data-use review |
| SEC-AI-012 | AI incident response. | Include AI misuse, prompt injection, model leakage, unsafe output, and unauthorized tool execution in incident plans. | IR scenarios |

---

## 16. National Security, Classified, and Special Environments

Use this section when the system may process national security information, classified data, compartmented data, special access data, restricted data, or operate in DoD/IC/NSS environments.

| ID | Requirement | Implementation Expectation | Evidence |
|---|---|---|---|
| SEC-NSS-001 | NSS determination. | Determine whether the system is a National Security System. | NSS determination |
| SEC-NSS-002 | CNSSI 1253 alignment. | Apply CNSSI 1253 categorization/control selection where NSS applies. | NSS control matrix |
| SEC-NSS-003 | Classified processing rules. | Use only approved classified systems, networks, personnel, procedures, and storage. | Classified boundary approval |
| SEC-NSS-004 | Cross-domain controls. | Use approved cross-domain solution controls where data crosses classification or security domains. | CDS approval |
| SEC-NSS-005 | Agency overlays. | Apply agency, DoD, IC, mission, SAP/SCI, or compartment-specific overlays. | Overlay matrix |
| SEC-NSS-006 | Prohibited unclassified AI exposure. | Prohibit classified or compartmented data in unclassified AI tools, IDEs, APIs, logs, or prompts. | AI boundary evidence |

---

## 17. Security Requirements Traceability Matrix

| Requirement ID | Architecture Section | Control / Framework Mapping | Implementation Owner | Test / Assessment | Evidence | Status |
|---|---|---|---|---|---|---|
| SEC-GOV-001 | `ARCHITECTURE.md#authorization-boundary` | [Mapping] | [Owner] | [Assessment] | [Artifact] | [Status] |

---

## 18. Minimum Release Security Gate

A release must not proceed until:

- [ ] Authorization boundary is documented.
- [ ] Data classification is documented.
- [ ] Authentication and authorization controls are implemented and tested.
- [ ] Secrets are stored in approved secret management systems.
- [ ] Critical/high vulnerabilities are remediated or formally risk-accepted.
- [ ] SAST/SCA/secrets/IaC/container scans are complete as applicable.
- [ ] SBOM is generated as applicable.
- [ ] Artifacts are signed or integrity-protected as applicable.
- [ ] Logging and monitoring are active for production-relevant events.
- [ ] Incident response path is documented.
- [ ] AI-specific evals pass if AI-enabled.
- [ ] Human approval is recorded.

---

## 19. Open Risks and POA&M

| ID | Finding / Risk | Severity | Owner | Due Date | Mitigation | Evidence | Status |
|---|---|---|---|---|---|---|---|
| POAM-001 | [Finding] | [Severity] | [Owner] | [Date] | [Plan] | [Evidence] | [Open/Closed] |

---

## 20. Document Control

| Field | Value |
|---|---|
| Owner | [Owner] |
| Security Owner | [Security Owner] |
| Version | [Version] |
| Last Updated | [Date] |
| Reviewers | [Names/Roles] |
| Approval | [Status] |
| Distribution | [Audience] |
| Classification | [Classification] |

---

## Authoritative Framework Reference Pointers

See `REFERENCES.md` in this kit for the current reference list, including NIST RMF, NIST SP 800-53 Rev. 5, FIPS 199, FIPS 200, NIST SSDF, NIST SP 800-63-4, FIPS 140-3, FedRAMP Rev. 5, NIST AI RMF, NIST SP 800-218A, CUI, Privacy Act, and OMB software/hardware security policy references.

---

## Annex A (Optional) — Healthcare Supplement (HIPAA Security Rule Cross-Walk)

**Applicability:** Include this annex only when the system creates, receives, maintains, or transmits PHI/ePHI or when a customer requires HIPAA Security Rule mapping.

**Hard disclaimer:** Completing this cross-walk is **starter architecture / posture**. It is **not** HIPAA certification, covered-entity determination, business-associate determination, or proof of compliance. Legal, privacy, and contracting owners remain accountable.

| HIPAA Security Rule safeguard area | Project control mapping (fill in) | Evidence / owner |
|------------------------------------|-----------------------------------|------------------|
| **Administrative safeguards** (e.g., security management process, workforce security, information access management, security awareness, security incident procedures, contingency plan, evaluation, BA contracts) | [Map to sections in this SECURITY.md / runbooks / contracts] | [Owner · artifact] |
| **Physical safeguards** (e.g., facility access, workstation use/security, device and media controls) | [Map to hosting, device, media controls] | [Owner · artifact] |
| **Technical safeguards** (e.g., access control, audit controls, integrity, authentication, transmission security) | [Map to IAM, logging, crypto, transport] | [Owner · artifact] |

**Tailoring starters (not certification):** HHS HIPAA Security Rule; HITECH; NIST SP 800-66 Rev. 2 — see kit `REFERENCES.md` Healthcare section. AI/PHI routing overlays: `AI/REGULATED_PROFILES.md`.

