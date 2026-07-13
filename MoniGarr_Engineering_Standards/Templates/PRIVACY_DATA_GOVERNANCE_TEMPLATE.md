# [PROJECT_NAME] — Privacy & Data Governance

**MES Version:** 1.1.1  
**Document:** `PRIVACY_DATA_GOVERNANCE.md`  
**Project:** [PROJECT_NAME]  
**Owner:** [OWNER]  
**Data Owner:** [DATA_OWNER]  
**Privacy Owner:** [PRIVACY_OWNER]  
**Version:** [VERSION]  
**Status:** [DRAFT / REVIEW / APPROVED / ACTIVE]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]  
**Classification:** [PUBLIC / INTERNAL / CUI / CLASSIFIED / OTHER]

---

## 0. Purpose

The Privacy & Data Governance layer establishes the authoritative method for identifying, labeling, protecting, using, sharing, retaining, auditing, and disposing of data across the full AI-first system lifecycle.

This classification model applies to:

- Source data.
- Documents.
- Databases.
- API payloads.
- Prompts.
- Model outputs.
- Embeddings.
- Vector-store records.
- Training data.
- Fine-tuning data.
- Evaluation data.
- Synthetic data.
- Telemetry.
- Logs.
- Audit records.
- Source code containing data references.
- Model configuration artifacts.
- Generated reports.
- Downstream derivative works.

---

## 1. Classification Principles

| Principle | Requirement |
|---|---|
| **Authoritative classification** | Every dataset, data object, prompt, output, embedding, and derivative artifact must have an assigned classification before operational use. |
| **Highest-watermark inheritance** | Derived artifacts inherit the highest classification, privacy sensitivity, CUI marking, dissemination control, and sovereignty restriction of their source data unless formally reviewed and reclassified. |
| **Minimum necessary use** | Data collection, retrieval, processing, model access, and disclosure shall be limited to the minimum necessary for the authorized mission purpose. |
| **Purpose limitation** | Data approved for one mission, workflow, model, environment, or evaluation shall not be reused for another purpose without authorization. |
| **AI-use restriction** | Data may only be processed by AI tools, models, agents, APIs, IDEs, extensions, or automation workflows that are approved for the data's classification and handling level. |
| **Continuous reclassification** | Classification must be reassessed when data is transformed, aggregated, exported, summarized, embedded, fine-tuned, shared, released, or connected to a new system. |
| **Traceability** | Data classification decisions must be auditable and traceable to owner, steward, authority, source, date, system boundary, and applicable policy. |
| **Privacy by design** | PII, sensitive PII, protected records, and individual-impacting data must be governed from intake through deletion. |
| **Control alignment** | Classification must drive access, encryption, retention, monitoring, logging, AI eligibility, sharing, and disposal controls. |
| **Sovereign/community respect** | Tribal, Indigenous, cultural, community-held, research, and consent-restricted data must honor stewardship, consent, cultural safety, and reuse limits. |

---

## 2. Federal Data Classification Dimensions

A single data object may carry multiple labels.

| Dimension | Description | Example Values |
|---|---|---|
| **Release Status** | Determines whether data is approved for public release. | Public, Pre-Publication, Internal, Non-Public, Restricted Release |
| **Federal Information Type** | Maps data to mission, business, operational, privacy, financial, legal, investigative, intelligence, or support information types. | Privacy, Financial, Medical, Investigative, Contractor-Sensitive, Security Management |
| **FIPS 199 Impact Level** | Categorizes confidentiality, integrity, and availability impact. | Confidentiality: Low/Moderate/High; Integrity: Low/Moderate/High; Availability: Low/Moderate/High |
| **CUI Status** | Determines whether unclassified data requires safeguarding or dissemination controls. | Not CUI, CUI Basic, CUI Specified |
| **CUI Category/Subcategory** | Identifies the official CUI category where applicable. | Privacy, Procurement, Legal, Export Control, Critical Infrastructure, Law Enforcement |
| **Classified Status** | Determines whether national security classification applies. | Unclassified, Confidential, Secret, Top Secret, SCI, SAP, RD, FRD |
| **Privacy Sensitivity** | Identifies data about individuals and privacy risk. | No PII, PII, Sensitive PII, System-of-Records Data, Biometric, Health, Financial, Minor-Related |
| **Sovereign / Community Data Status** | Identifies protected cultural, Tribal, Indigenous, community, research, consent, or collectively governed data. | Tribal Data, Cultural Heritage Data, Community-Governed Data, Restricted Consent Data |
| **AI Processing Eligibility** | Determines whether data may be used with AI systems or agents. | Public AI Eligible, Agency-Approved AI Only, No External AI, No Training, No Fine-Tuning, Classified AI Boundary Only |
| **Data Residency / Hosting Boundary** | Determines authorized environment. | Public Cloud, FedRAMP Moderate, FedRAMP High, GovCloud, Agency On-Prem, Classified Network |
| **Retention Status** | Determines records handling, retention, legal hold, and disposal. | Record, Non-Record, Permanent, Temporary, Legal Hold, FOIA-Responsive, Audit Evidence |
| **Sharing / Dissemination Controls** | Determines allowed recipients and disclosure restrictions. | Public, Agency Internal, Need-to-Know, Contractual Access, Interagency, CUI Dissemination Controls, Classified Caveats |
| **Lifecycle State** | Determines where data exists in the operational lifecycle. | Intake, Validation, Processing, Model Context, Storage, Retrieval, Output, Archive, Disposal |

---

## 3. Classification Levels

| Level | Classification | Description | Default Handling |
|---|---|---|---|
| **L0** | **Public / Approved for Release** | Information formally approved for public distribution. | May be used in public-facing systems and approved public AI workflows after release authorization and privacy review. |
| **L1** | **Internal / Non-Public Enterprise or Agency Data** | Operational, administrative, draft, pre-decisional, or business data not approved for public release. | Controlled access, least privilege, internal logging, no public AI tools unless approved. |
| **L2** | **Federal Contract Information / Controlled Internal Data** | Non-public information created for, collected by, or received from the government that may not rise to CUI but still requires protection. | Contractual access controls, approved systems only, no unauthorized external disclosure. |
| **L3** | **Privacy-Sensitive Data** | PII, sensitive PII, records about individuals, or data that can affect rights, benefits, eligibility, services, or civil liberties. | Privacy review, minimization, access controls, audit logging, approved AI tools only, PIA/SORN review where applicable. |
| **L4** | **CUI Basic** | Unclassified information requiring safeguarding or dissemination controls under law, regulation, or government-wide policy. | CUI marking, controlled access, encryption, approved boundary, dissemination restrictions, monitoring, and auditability. |
| **L5** | **CUI Specified** | CUI where the underlying authority requires or permits specific safeguarding or dissemination controls beyond CUI Basic. | Category-specific controls, markings, contractual clauses, and agency-defined handling rules. |
| **L6** | **Classified National Security Information** | Information classified under national security authority. | Classified systems only, cleared personnel only, strict need-to-know, no unclassified AI processing. |
| **L7** | **Special Compartmented / Statutory Restricted Data** | SCI, SAP, Restricted Data, Formerly Restricted Data, or other special statutory/compartmented categories. | Authorized compartment only, specialized controls, agency/security authority approval, prohibited from standard enterprise AI workflows. |
| **Overlay** | **Sovereign / Community-Protected Data** | Tribal, Indigenous, cultural, community-held, human-subject, or consent-restricted data requiring governance beyond standard federal classification. | Governed by consent, stewardship agreements, Tribal/community authority, cultural restrictions, mission need, and reuse limitations. |

---

## 4. CUI Classification Requirements

Where data is Controlled Unclassified Information, record and enforce:

| Requirement | Description |
|---|---|
| **CUI determination** | Whether the data is Not CUI, CUI Basic, or CUI Specified. |
| **CUI category/subcategory** | Applicable CUI Registry category and subcategory. |
| **Underlying authority** | Law, regulation, or government-wide policy that requires or permits safeguarding. |
| **Marking** | Required banner, portion marking where applicable, category marking, dissemination controls, and limited dissemination controls. |
| **Authorized users** | Users, groups, roles, agencies, contractors, services, models, and systems permitted to access the data. |
| **Authorized systems** | Systems and environments approved to store, process, transmit, or generate derivative artifacts from the data. |
| **AI permissions** | Whether CUI may be used for prompting, retrieval, summarization, code generation, embedding, model evaluation, fine-tuning, or training. |
| **External sharing** | Whether sharing is allowed with contractors, vendors, interagency partners, state/local/Tribal entities, or public users. |
| **Retention/disposal** | Required retention schedule, records treatment, sanitization, and disposal controls. |

---

## 5. Privacy and PII Classification

All data shall be evaluated for privacy impact before being used in AI-first workflows.

| Privacy Class | Description | Required Governance |
|---|---|---|
| **No PII** | Data does not identify or reasonably link to an individual. | Standard classification and security controls. |
| **PII** | Data that identifies or can reasonably identify an individual. | Privacy review, purpose limitation, minimization, access control, logging. |
| **Sensitive PII** | PII that creates elevated harm if lost, misused, disclosed, or re-identified. | Strong access control, encryption, enhanced logging, restricted AI use, breach-response readiness. |
| **System-of-Records Data** | Records retrieved by personal identifier and governed by Privacy Act requirements. | SORN review, disclosure controls, access/amendment considerations, routine-use analysis. |
| **Regulated Individual Data** | Health, financial, education, tax, benefits, biometric, geolocation, law-enforcement, or other specially governed individual data. | Domain-specific authority review, legal/privacy review, heightened safeguards. |
| **Civil Rights / Civil Liberties Impacting Data** | Data used to make, support, automate, recommend, or influence decisions affecting individuals or protected groups. | Bias, fairness, explainability, human oversight, appealability, and audit controls. |

---

## 6. AI-First Data Classification Rules

| Rule | Requirement |
|---|---|
| **Prompt classification** | Prompts inherit the classification of all data included, referenced, summarized, attached, retrieved, or implied. |
| **Output classification** | AI-generated outputs inherit the highest classification of the prompt, retrieved context, source data, system instructions, and connected tools unless reviewed and reclassified. |
| **Embedding classification** | Embeddings, vector records, semantic indexes, and retrieval chunks inherit the classification of the source data. They shall not be treated as declassified, anonymized, or public by default. |
| **RAG classification** | Retrieval-augmented generation workflows must enforce source-level access control before retrieval and response generation. |
| **Training restriction** | Data may not be used for model training, fine-tuning, evaluation, or reinforcement learning unless the classification explicitly permits that use. |
| **No unauthorized external AI** | Non-public, CUI, privacy-sensitive, classified, sovereign, or agency-restricted data shall not be submitted to external AI systems unless the tool, contract, boundary, retention behavior, and data-use terms are approved for that classification. |
| **Synthetic data review** | Synthetic data must be reviewed for memorization, re-identification, source leakage, privacy inference, and classification inheritance. |
| **Model memory control** | AI tools must not retain, learn from, or expose restricted prompts, outputs, files, embeddings, or context beyond the authorized boundary. |
| **Human review** | AI outputs affecting rights, services, benefits, safety, enforcement, eligibility, or public-facing agency action require human review and accountability. |
| **Auditability** | AI interactions involving restricted data must log user, system, model, data sources, retrieval context, classification labels, output destination, and approval status. |

---

## 7. AI Tool Eligibility Matrix

| Data Classification | External AI / AI IDE Use | Agency/Enterprise-Approved AI Use | External Model Training | Fine-Tuning | RAG / Embeddings | Notes |
|---|---:|---:|---:|---:|---:|---|
| Public / Approved for Release | Allowed if tool is approved | Allowed | Allowed only if approved | Allowed only if approved | Allowed | Confirm public-release authority first. |
| Internal / Non-Public | Restricted | Allowed within approved boundary | Prohibited by default | Prohibited by default | Restricted | Do not expose drafts, internal workflows, non-public architecture, credentials, or sensitive context. |
| FCI / Controlled Internal | Restricted | Allowed if contractually and technically approved | Prohibited by default | Prohibited by default | Restricted | Must honor contract, procurement, and access limitations. |
| PII / Sensitive PII | Prohibited unless explicitly approved | Allowed only with privacy controls | Prohibited by default | Prohibited by default | Restricted | Requires privacy review, minimization, logging, and approved retention behavior. |
| CUI Basic | Prohibited unless boundary is approved for CUI | Allowed only in approved CUI boundary | Prohibited unless explicitly authorized | Prohibited unless explicitly authorized | Allowed only in CUI-approved boundary | Must enforce CUI markings, access, storage, transfer, and dissemination controls. |
| CUI Specified | Prohibited unless specifically approved | Allowed only under category-specific authority | Prohibited unless specifically authorized | Prohibited unless specifically authorized | Category-specific | Underlying authority controls permitted use. |
| Classified | Not allowed in unclassified tools | Classified AI boundary only | Classified authority only | Classified authority only | Classified boundary only | Requires cleared personnel, approved classified system, and need-to-know. |
| SCI / SAP / RD / FRD | Not allowed | Only under special authorization | Special authority only | Special authority only | Special compartment only | Requires compartment-specific approval. |
| Sovereign / Community-Protected | Depends on consent and agreement | Only if governance permits | Prohibited by default | Prohibited by default | Restricted | Must honor Tribal, cultural, community, human-subject, or consent restrictions. |

---

## 8. Required Metadata Labels

Every data object, dataset, prompt, output, embedding collection, model artifact, and generated product shall carry classification metadata where feasible.

```yaml
data_classification:
  classification_level: "L0 | L1 | L2 | L3 | L4 | L5 | L6 | L7"
  release_status: "Public | Internal | Non-Public | Restricted | Classified"
  fips_199:
    confidentiality: "Low | Moderate | High"
    integrity: "Low | Moderate | High"
    availability: "Low | Moderate | High"
  cui:
    status: "Not CUI | CUI Basic | CUI Specified"
    category: null
    subcategory: null
    dissemination_controls: []
    underlying_authority: null
  privacy:
    pii_status: "No PII | PII | Sensitive PII | System-of-Records Data"
    privacy_authority: null
    pia_required: false
    sorn_required: false
    consent_required: false
  classified:
    status: "Unclassified | Confidential | Secret | Top Secret | SCI | SAP | RD | FRD"
    caveats: []
    authorized_boundary: null
  sovereignty:
    sovereign_or_community_data: false
    governing_authority: null
    consent_or_stewardship_terms: null
    reuse_restrictions: []
  ai_use:
    ai_processing_allowed: false
    approved_tools: []
    prompt_allowed: false
    rag_allowed: false
    embedding_allowed: false
    fine_tuning_allowed: false
    training_allowed: false
    output_review_required: true
  lifecycle:
    owner: null
    steward: null
    source_system: null
    lineage: []
    retention_schedule: null
    legal_hold: false
    disposal_method: null
  audit:
    classification_date: null
    classified_by: null
    review_date: null
    approval_authority: null
    evidence_reference: null
```

---

## 9. Data Classification Workflow

| Step | Action | Required Output |
|---:|---|---|
| 1 | Identify data source and owner | Data owner, steward, source system, mission use |
| 2 | Determine information type | Federal information type and mission/business category |
| 3 | Determine release status | Public, internal, non-public, restricted, or classified |
| 4 | Determine FIPS 199 impact | Confidentiality, integrity, and availability impact levels |
| 5 | Determine CUI status | Not CUI, CUI Basic, or CUI Specified |
| 6 | Determine privacy status | PII, sensitive PII, system-of-records, civil-rights impact |
| 7 | Determine sovereignty/community restrictions | Tribal, cultural, community-governed, consent-bound, human-subject |
| 8 | Determine AI eligibility | Prompting, RAG, embeddings, fine-tuning, training, output review |
| 9 | Apply markings and metadata | Labels, tags, access policy, retention, dissemination controls |
| 10 | Enforce technical controls | IAM, encryption, logging, DLP, ABAC/RBAC, segmentation |
| 11 | Review derivative artifacts | Prompts, outputs, embeddings, summaries, reports, code artifacts |
| 12 | Monitor and reclassify | Continuous review, audit, reclassification, declassification, disposal |

---

## 10. Minimum Enforcement Requirements

| Control Area | Requirement |
|---|---|
| **Access Control** | Enforce classification-aware RBAC/ABAC, least privilege, need-to-know, and separation of duties. |
| **Encryption** | Encrypt restricted data in transit and at rest using approved cryptographic controls. |
| **Logging** | Log access, modification, export, AI processing, retrieval, summarization, embedding, and disclosure events. |
| **DLP** | Apply data loss prevention controls for PII, CUI, classified indicators, secrets, credentials, and restricted terms. |
| **Data Segmentation** | Separate data by classification, mission, tenant, environment, and authorized system boundary. |
| **AI Boundary Control** | Prevent restricted data from entering unauthorized AI tools, browser extensions, IDE plugins, APIs, agents, or model-training pipelines. |
| **Records Management** | Apply retention, legal hold, FOIA, eDiscovery, audit evidence, and disposal requirements. |
| **Disclosure Review** | Require approval before public release, interagency transfer, contractor transfer, or external publication. |
| **Continuous Monitoring** | Monitor misclassification, unauthorized access, data leakage, improper AI use, and downstream propagation. |
| **Exception Handling** | Document, approve, risk-rate, and periodically review any exception to classification or AI-use rules. |

---

## 11. Data Inventory

| Data Object | Owner | Source | Classification | AI Eligibility | Retention | Sharing | Disposal | Evidence |
|---|---|---|---|---|---|---|---|---|
| [Data] | [Owner] | [Source] | [Level] | [Allowed/Restricted/Prohibited] | [Policy] | [Recipients] | [Method] | [Artifact] |

---

## 12. Exceptions

| Exception ID | Data | Rule Exception | Risk | Approver | Expiration | Compensating Control | Review Date |
|---|---|---|---|---|---|---|---|
| EX-001 | [Data] | [Exception] | [Risk] | [Approver] | [Date] | [Control] | [Date] |

---

## Annex A — HIPAA Privacy Rule (tailoring starter)

**Disclaimer:** This annex is **starter architecture language** for projects that may process PHI/ePHI. Completing it does **not** establish HIPAA compliance, covered-entity status, business-associate status, or any certification. See [`../REFERENCES.md`](../REFERENCES.md) § Healthcare.

| Topic | Project posture | Evidence |
|-------|-----------------|----------|
| PHI / ePHI in scope? | [Yes / No / TBD] | |
| Covered entity / BA / subcontractor roles | [describe — not MES-certified] | |
| Minimum necessary | [how enforced in APIs, RAG, logs, exports] | |
| Uses & disclosures | [permitted / prohibited] | |
| Individual rights (access, amendment, accounting) | [process owner] | |
| BAAs / subprocessors | [register path] | |
| Breach notification | [runbook link — project-defined clocks] | |
| AI eligibility for PHI | [prohibited / local_private only / etc.] | |

Also complete Security Rule cross-walk in [`SECURITY_REQUIREMENTS_TEMPLATE.md`](SECURITY_REQUIREMENTS_TEMPLATE.md) Annex A when security controls are in scope.

---

## Authoritative Framework Reference Pointers

See `REFERENCES.md` in this kit for the current reference list, including NIST RMF, NIST SP 800-53 Rev. 5, FIPS 199, FIPS 200, NIST SSDF, NIST SP 800-63-4, FIPS 140-3, FedRAMP Rev. 5, NIST AI RMF, NIST SP 800-218A, CUI, Privacy Act, HIPAA Privacy/Security starters, and OMB software/hardware security policy references.

