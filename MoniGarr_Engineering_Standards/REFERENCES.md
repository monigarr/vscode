# External Reference Bibliography

**MES Version:** 1.1.0  
**Status:** Engineering Standard (bibliography)  
**Owner:** MoniGarr Engineering  
**Applies To:** All MoniGarr products, services, and projects that map external authorities  
**Canonical Path:** `REFERENCES.md`  
**See Also:** [`SYSTEM_CONTEXT.md`](SYSTEM_CONTEXT.md) · [`Engineering/SECURITY.md`](Engineering/SECURITY.md) · [`MDES.md`](MDES.md) · [`Templates/PRIVACY_DATA_GOVERNANCE_TEMPLATE.md`](Templates/PRIVACY_DATA_GOVERNANCE_TEMPLATE.md) · [`AI/REGULATED_PROFILES.md`](AI/REGULATED_PROFILES.md)

**Purpose:** Official references used to frame the M.O.M. M.I.L.E. Enterprise Software Factory Production Kit.  
**Verified:** 2026-07-12 (link-check re-run same day for Excellence 10 defense)  
**Note:** These references are **starting points** for architecture and security planning — **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence. Projects **shall** tailor requirements to actual mission, agency, contract, data classification, system boundary, and authorizing authority.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`AI/REGULATED_PROFILES.md`](AI/REGULATED_PROFILES.md), use this bibliography to map external authorities, and follow the Regulated Operations Overlay in [`Governance/MOM.md`](Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

---

## Maintenance and Verification

| Field | Value |
|-------|-------|
| Owner | MoniGarr Engineering |
| Review cadence | At least **annually**, and upon major NIST/OMB/HHS revision affecting adopted starters |
| Link-check method | Manual or CI link check; record date in **Verified** above |
| Broken links | Replace with archive/permalink when available; do not leave silent 404s |
| Link-check obligation | Link-check failures **shall** be fixed or archived within one review cycle; annual review **shall** record link-check evidence under [`MDES_REVIEWS/`](MDES_REVIEWS/) or the annual governance notes |

---

## MES Mapping Index

| MES theme | Primary MES docs | Starter sections below |
|-----------|------------------|------------------------|
| RMF / controls / authorization posture | [`Engineering/SECURITY.md`](Engineering/SECURITY.md), security templates | Federal Risk, Authorization, and Controls |
| SSDF / SBOM / supply chain | [`Engineering/DEVOPS.md`](Engineering/DEVOPS.md), [`Engineering/RELEASE_PROCESS.md`](Engineering/RELEASE_PROCESS.md), [`Engineering/TESTING.md`](Engineering/TESTING.md) | Secure Software, Supply Chain |
| Zero Trust / identity / crypto | Architecture Part XVII, [`Engineering/SECURITY.md`](Engineering/SECURITY.md) | Identity, Cryptography, Cloud, and Zero Trust |
| CUI / Privacy Act / AI RMF | Privacy template, [`AI/REGULATED_PROFILES.md`](AI/REGULATED_PROFILES.md) | Data, Privacy, CUI, and AI Risk |
| CUI non-federal | [`Engineering/SECURITY.md`](Engineering/SECURITY.md), privacy template | NIST SP 800-171 (below) |
| Application security | [`Engineering/SECURITY.md`](Engineering/SECURITY.md), [`Engineering/CODING_STANDARDS.md`](Engineering/CODING_STANDARDS.md) | Application Security (OWASP) |
| Healthcare (PHI/ePHI) | [`AI/REGULATED_PROFILES.md`](AI/REGULATED_PROFILES.md), SECURITY Annex A, PRIVACY Annex | Healthcare |
| Accessibility | Architecture Part XV / XVIII | Accessibility |
| Sovereign / community data | PRIVACY template overlay | Sovereign / Community-Protected Data |
| Commercial assurance mapping (informative) | Project SECURITY / VERIFY | Commercial Assurance Frameworks |
| Documentation excellence + coherence | [`MDES.md`](MDES.md), [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md) | — |

---

## Federal Risk, Authorization, and Controls

- NIST SP 800-37 Rev. 2 — Risk Management Framework for Information Systems and Organizations: https://csrc.nist.gov/pubs/sp/800/37/r2/final
- NIST SP 800-53 Rev. 5 — Security and Privacy Controls for Information Systems and Organizations: https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final
- FIPS 199 — Standards for Security Categorization of Federal Information and Information Systems: https://csrc.nist.gov/pubs/fips/199/final
- FIPS 200 — Minimum Security Requirements for Federal Information and Information Systems: https://csrc.nist.gov/pubs/fips/200/final
- NIST SP 800-60 Rev. 2 — Guide for Mapping Types of Information and Systems to Security Categories: https://csrc.nist.gov/pubs/sp/800/60/r2/iwd
- CNSSI 1253 — Security Categorization and Control Selection for National Security Systems (cited via NIST CSRC glossary for Security Categorization): https://csrc.nist.gov/glossary/term/security_categorization

---

## Secure Software, Supply Chain, and Distribution

- NIST SP 800-218 — Secure Software Development Framework (SSDF) Version 1.1: https://csrc.nist.gov/pubs/sp/800/218/final
- NIST SP 800-218A — Secure Software Development Practices for Generative AI and Dual-Use Foundation Models: https://csrc.nist.gov/news/2024/nist-publishes-sp-800-218a
- OMB M-26-05 — Adopting a Risk-based Approach to Software and Hardware Security: https://www.whitehouse.gov/wp-content/uploads/2026/01/M-26-05-Adopting-a-Risk-based-Approach-to-Software-and-Hardware-Security.pdf
- CISA Minimum Elements for a Software Bill of Materials (SBOM): https://www.cisa.gov/sbom
- CISA Hardware Bill of Materials (HBOM) Framework: https://www.cisa.gov/resources-tools/resources/hardware-bill-materials-hbom-framework-supply-chain-risk-management

---

## Identity, Cryptography, Cloud, and Zero Trust

- NIST SP 800-63-4 — Digital Identity Guidelines: https://csrc.nist.gov/pubs/sp/800/63/4/final
- FIPS 140-3 — Security Requirements for Cryptographic Modules: https://csrc.nist.gov/pubs/fips/140-3/final
- NIST Cryptographic Module Validation Program (CMVP): https://csrc.nist.gov/projects/cryptographic-module-validation-program
- FedRAMP Rev. 5 Documents and Templates: https://www.fedramp.gov/rev5/documents-templates/
- NIST SP 800-207 — Zero Trust Architecture: https://csrc.nist.gov/pubs/sp/800/207/final
- OMB M-22-09 — Moving the U.S. Government Toward Zero Trust Cybersecurity Principles: https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf

---

## Data, Privacy, CUI, and AI Risk

- National Archives — Controlled Unclassified Information (CUI): https://www.archives.gov/cui
- National Archives — CUI Registry: https://www.archives.gov/cui/registry/category-list
- Department of Justice — Privacy Act of 1974: https://www.justice.gov/opcl/privacy-act-1974
- Executive Order 13526 — Classified National Security Information: https://www.archives.gov/isoo/policy-documents/cnsi-eo.html
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- NIST AI RMF Generative AI Profile (NIST AI 600-1): https://doi.org/10.6028/NIST.AI.600-1
- NIST Cybersecurity Framework 2.0: https://www.nist.gov/cyberframework
- NIST SP 800-171 Rev. 3 — Protecting Controlled Unclassified Information in Nonfederal Systems and Organizations: https://csrc.nist.gov/pubs/sp/800/171/r3/final

---

## Application Security (OWASP)

Informative application-security anchors for Engineering SECURITY and coding standards. Not a certification claim.

- OWASP Application Security Verification Standard (ASVS): https://owasp.org/www-project-application-security-verification-standard/
- OWASP API Security Top 10: https://owasp.org/www-project-api-security/

---

## Healthcare (tailoring starters)

These are **tailoring starters** for projects that handle health information. Citing them does **not** establish HIPAA compliance, HITECH compliance, covered-entity status, business-associate status, or any certification.

- HHS — HIPAA Security Rule (45 CFR Part 160 and Subparts A and C of Part 164): https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164
- HHS — HIPAA Privacy Rule (45 CFR Part 160 and Subparts A and E of Part 164): https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E
- HHS OCR — Breach Notification Rule (45 CFR §§ 164.400–414 overview via eCFR Part 164 Subpart D): https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-D
- HITECH Act — Health Information Technology for Economic and Clinical Health Act (Pub. L. 111-5; as implemented with HIPAA): https://www.govinfo.gov/app/details/PLAW-111publ5
- NIST SP 800-66 Rev. 2 — Implementing the Health Insurance Portability and Accountability Act (HIPAA) Security Rule: A Cybersecurity Resource Guide: https://csrc.nist.gov/pubs/sp/800/66/r2/final

Project controls **shall** be instantiated in `SECURITY.md` / privacy artifacts; MES does not certify covered-entity or business-associate status. Use **minimum necessary**, BAAs, and breach processes as project-tailored requirements — not suite certification claims.

---

## Accessibility

These are **accessibility posture** pointers. Citing them does **not** establish Section 508 or WCAG certification.

- Section 508 of the Rehabilitation Act — ICT accessibility requirements for federal procurement/use: https://www.section508.gov/
- W3C — Web Content Accessibility Guidelines (WCAG) 2.2: https://www.w3.org/TR/WCAG22/

Projects **should** declare target conformance level and verification method in product docs; MES does not attest accessibility compliance.

- EN 301 549 — Accessibility requirements for ICT products and services (EU public procurement informative pointer): https://www.etsi.org/deliver/etsi_en/301500_301599/301549/

---

## Commercial Assurance Frameworks (informative)

These are **mapping targets** for enterprise customers — not MES certification claims and not mandatory for MES Conformant / Excellence.

- ISO/IEC 27001 — Information security management systems  
- SOC 2 (AICPA Trust Services Criteria) — attestation reports are project/organization-specific  
- PCI DSS — when cardholder data is in scope  
- CMMC — when required by DoD contracts  

Projects **shall not** claim ISO/SOC/PCI/CMMC certification from MES alone. Use these as control-mapping aids in project `SECURITY.md` / VERIFY evidence when customers require them.

---

## Sovereign / Community-Protected Data

Projects that process Indigenous, tribal, or other community-protected data **shall** use the [`Templates/PRIVACY_DATA_GOVERNANCE_TEMPLATE.md`](Templates/PRIVACY_DATA_GOVERNANCE_TEMPLATE.md) overlay (project `PRIVACY_DATA_GOVERNANCE.md`) to document:

- Local/community data authority and consent model  
- Permitted uses, sharing, residency, and retention  
- AI/RAG/memory eligibility and human decision rights  

There is **no** single NIST document that substitutes for community authority. Document the governing local authority; do not invent a universal “tribal NIST” baseline inside MES.
