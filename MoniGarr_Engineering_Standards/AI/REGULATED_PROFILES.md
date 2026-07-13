# Regulated Data Profiles — Optional Overlays for CUI, PHI, and Sovereign Data

**MES Version:** 1.1.0  
**Status:** Engineering Standard (optional profiles)  
**Owner:** MoniGarr Engineering  
**Applies To:** Products and services that process CUI, PHI/ePHI, or sovereign/community-protected data  
**Canonical Path:** `AI/REGULATED_PROFILES.md`  
**See Also:** [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`RAG.md`](RAG.md) · [`MEMORY.md`](MEMORY.md) · [`../REFERENCES.md`](../REFERENCES.md) · [`../Engineering/SECURITY.md`](../Engineering/SECURITY.md) · [`../Templates/PRIVACY_DATA_GOVERNANCE_TEMPLATE.md`](../Templates/PRIVACY_DATA_GOVERNANCE_TEMPLATE.md) · [`../Governance/MILE.md`](../Governance/MILE.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

This standard defines **optional regulated-data profiles** that projects **may** adopt when handling Controlled Unclassified Information (CUI), Protected Health Information (PHI/ePHI), or sovereign/community-protected data.

Profiles are **engineering posture overlays**. They are **not**:

- An Authorization to Operate (ATO)  
- FedRAMP authorization  
- HIPAA, HITECH, or other compliance certification  
- A substitute for legal, contracting, privacy, or Authorizing Official (AO) decisions  

MES does not certify regulated deployments. Projects remain responsible for customer/agency requirements and evidence.

---

## Normative Language

| Term | Meaning |
|------|---------|
| **shall / must** | Mandatory when the profile is adopted |
| **should** | Strong default; deviation requires an ADR |
| **may** | Optional |
| **Example (CareerPilot)** | Illustrative only — not a regulated product claim |

---

## When to Adopt

| Profile | Adopt when |
|---------|------------|
| **CUI** | System processes CUI or federal customer data with CUI-adjacent controls |
| **PHI** | System creates, receives, maintains, or transmits PHI/ePHI |
| **Sovereign / community** | System processes Indigenous, tribal, or community-protected data |

Adopt via project `SECURITY.md`, `PRIVACY_DATA_GOVERNANCE.md`, and AI routing policy — not by asserting MES alone.

---

## Profile Adoption Workflow

When adopting a profile, projects **shall** complete these steps (order may vary; evidence required):

1. **Security / privacy review** — confirm legal basis, BAA/contract needs, and data classes.  
2. **Publish routing matrix** — sensitivity → model class / residency / logging / tool egress (below).  
3. **Pin enforcement** — ClassificationEnforcer + Model Gateway allowlists; kill-switch coverage for write paths.  
4. **Harness safety pack** — tag golden/safety fixtures (e.g., `phi_safety`, `cui_safety`); no raw PHI in fixtures without legal basis.  
5. **DSAR / erasure runbook** — cover RAG, embeddings, memory, and AI logs (below).  
6. **Record adoption** — project `SECURITY.md` / `AI_GUIDELINES.md` checkbox + Evidence Pack link on first regulated release.

---

## Data Routing Matrix (Concept)

Projects that adopt a profile **shall** maintain a **data routing matrix**: sensitivity class → allowed model classes, residency, logging, and tool egress.

| Sensitivity | Allowed model classes (illustrative) | Residency | Logging |
|-------------|--------------------------------------|-----------|---------|
| Public / synthetic | Any approved router class | Unrestricted (policy) | Standard AI telemetry |
| Internal / non-public | Enterprise-approved endpoints only | Project-declared | Redact identifiers |
| CUI | Approved / authorized endpoints only | Per customer AO | Strict redaction; retention declared |
| PHI / ePHI | BAA-covered or otherwise authorized processors only | Per contract / BA | Minimum necessary; no raw PHI in public logs |
| Sovereign / community | Per community authority overlay | Per community rules | Per privacy template |

Matrix detail lives in project artifacts and [`MODEL_ROUTING.md`](MODEL_ROUTING.md). Enforcement **shall** use **ClassificationEnforcer** (Architecture Part II/III) plus Model Gateway residency/allowlist vetoes before egress. Silent routing of regulated data to unapproved providers is non-conformant.

---

## Clinical, Benefits, and Eligibility Boundaries

For clinical, benefits, eligibility, or similar high-stakes domains:

- Systems **shall not** issue autonomous medical advice or autonomous legal advice.  
- Domain-specific **human authority** remains accountable for decisions that affect care, eligibility, benefits, or rights.  
- AI **may** draft, summarize, retrieve, or recommend under HITL gates ([`AI_GUIDELINES.md`](AI_GUIDELINES.md), [`../Governance/MILE.md`](../Governance/MILE.md)).  
- MILE and MES **do not** authorize unsupervised clinical or legal determination.

---

## Healthcare / PHI Overlay (Posture)

When the PHI profile applies, projects **should**:

1. Map PHI flows (ingress, storage, retrieval, model context, egress).  
2. Gate model providers and subprocessors behind BAA / contracting review before PHI egress.  
3. Enforce **minimum-necessary** retrieval into prompts and RAG context.  
4. Use de-identified or synthetic data for golden sets and eval corpora unless an approved exception exists ([`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md)).  

Cross-walk starters: [`../REFERENCES.md`](../REFERENCES.md) Healthcare section; optional annex in [`../Templates/SECURITY_REQUIREMENTS_TEMPLATE.md`](../Templates/SECURITY_REQUIREMENTS_TEMPLATE.md).

---

## Sovereign / Community Overlay

Projects with Indigenous/tribal/community-protected data **shall** instantiate [`../Templates/PRIVACY_DATA_GOVERNANCE_TEMPLATE.md`](../Templates/PRIVACY_DATA_GOVERNANCE_TEMPLATE.md). Document local authority; do not invent a universal NIST substitute ([`../REFERENCES.md`](../REFERENCES.md)).

---

## DSAR / Right-to-Erasure Across AI Surfaces

When privacy law or contract requires access, correction, or erasure, projects **shall** define how fulfillment covers:

| Surface | Expectation |
|---------|-------------|
| Primary stores | Application databases and object storage |
| RAG indexes | Document chunks and metadata |
| Embeddings / vector stores | Vectors and source IDs ([`RAG.md`](RAG.md)) |
| Agent memory | Session and long-term memory ([`MEMORY.md`](MEMORY.md)) |
| AI logs / traces | Prompt/response telemetry per retention policy |

Incomplete erasure that leaves regulated identifiers in embeddings or memory is a privacy defect, not an “AI quirk.”

---

## Records Retention for AI Logs

Retention for prompts, completions, tool traces, and eval artifacts is **project-defined** in `SECURITY.md` / privacy docs. This company standard does **not** invent regulatory clocks. Align retention with customer, contract, and legal requirements; document owners and disposal methods.

---

## Government / CUI Overlay (Posture)

Use [`../REFERENCES.md`](../REFERENCES.md) for NIST CSF / SP 800-53 mapping pointers. ATO inheritance and authorization boundary decisions are the **project AO’s responsibility**. MES provides posture language only.

---

## Conformance Checklist (When Adopted)

- [ ] Profile named in project security/privacy artifacts  
- [ ] Data routing matrix published and enforced in router policy  
- [ ] No autonomous medical or legal advice paths  
- [ ] DSAR/erasure covers RAG, embeddings, and agent memory  
- [ ] AI log retention declared (project-defined)  
- [ ] No ATO / FedRAMP / HIPAA compliance claims from MES alone  

---

## Revision History

| Date | MES | Change |
|------|-----|--------|
| 2026-07-12 | 1.1.0 | Initial regulated overlays; routing matrix ownership clarified vs AI_GUIDELINES (P0–P3). |
| 2026-07-12 | 1.1.0 | Profile adoption workflow; harness safety-pack expectation. |

---

## See Also

- [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`RAG.md`](RAG.md) · [`MEMORY.md`](MEMORY.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md)  
- [`../REFERENCES.md`](../REFERENCES.md) · [`../Engineering/SECURITY.md`](../Engineering/SECURITY.md) · [`../Templates/PRIVACY_DATA_GOVERNANCE_TEMPLATE.md`](../Templates/PRIVACY_DATA_GOVERNANCE_TEMPLATE.md) · [`../Governance/MILE.md`](../Governance/MILE.md)
