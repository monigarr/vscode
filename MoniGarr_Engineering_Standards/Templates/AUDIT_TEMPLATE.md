# {{PROJECT_NAME}} — AUDIT

**MES Version:** 1.1.1

> ## 📋 How to use this template — read me first, then delete this box
> - **What it is:** an honest audit of the **existing system** you are about to build into — security,
>   performance, architecture, data quality, compliance, and observability. It tells the architecture what
>   *must be true* before building, and what must *not* be done.
> - **Who owns it:** the architect and a security reviewer.
> - **When in the workflow:** Brownfield intake before Architecture (Step 3 of 8) — see [README](../README.md).
> - **Drive it with AI:** *"Audit this repository against each section below. For every finding, cite the file
>   or config that proves it. If you cannot prove it, mark it `{{UNVERIFIED}}` — do not assert it."*
> - **Placeholder legend:** `{{FILL_ME}}` = your value · `💡` = guidance, delete it · `✍️` = example, replace it
> - **Done when:** no `{{...}}` tokens and no `💡` / `✍️` callouts remain, and every finding is evidence-backed.

---

## 0. One-Page Summary (~500 words)
> 💡 Lead with the truth. Name the biggest risk in the first paragraph. Reviewers read this section first.

- **Key risks:** `{{...}}`
- **Key constraints:** `{{...}}`
- **Integration implications:** `{{...}}`

---

## 1. Security Audit

### Authentication
- **Current model:** `{{how the existing system authenticates users}}`
- **Risks:** `{{weaknesses, gaps}}`

### Authorization

| Risk | Description | Mitigation |
| --- | --- | --- |
| `{{e.g. IDOR}}` | `{{...}}` | `{{server-bound scope}}` |

### Data Exposure
- **Logs:** `{{does logging risk leaking PII/PHI/secrets?}}`
- **APIs:** `{{over-broad endpoints, missing auth}}`
- **Third-party:** `{{subprocessors, outbound data flows}}`

---

## 2. Performance Audit

| Area | Observation | Impact |
| --- | --- | --- |
| `{{...}}` | `{{...}}` | `{{...}}` |

- **Latency bottlenecks:** `{{...}}`
- **Scaling risks:** `{{...}}`

---

## 3. Architecture Audit
- **System structure:** `{{monolith / services / mixed legacy + modern}}`
- **Integration points:** `{{where your additive module can safely attach}}`
- **Legacy risks:** `{{fragile areas to avoid disturbing}}`

---

## 4. Data Quality Audit

| Issue | Impact | Mitigation |
| --- | --- | --- |
| `{{missing fields}}` | `{{...}}` | `{{...}}` |
| `{{duplicates / stale data}}` | `{{...}}` | `{{...}}` |

---

## 5. Compliance & Legal
- **Regulatory constraints:** `{{e.g. HIPAA, GDPR, sector rules}}`
- **Data handling requirements:** `{{...}}`
- **Vendor implications:** `{{BAA, data residency, model-provider terms}}`

---

## 6. Observability Audit
- **Logging coverage:** `{{what exists today}}`
- **Missing visibility:** `{{what you can't currently see}}`
- **Required metrics:** `{{what you must add}}`

---

## 7. Prioritized Findings
> 💡 Severity = Critical / High / Medium / Low. Order by severity. This table drives the work list.

| ID | Severity | Finding | Recommendation |
| --- | --- | --- | --- |
| F1 | `{{High}}` | `{{...}}` | `{{...}}` |
| F2 | `{{...}}` | `{{...}}` | `{{...}}` |

---

## 8. Integration Implications
> 💡 The two most important lines in the document. Be specific and absolute.

- **What must be true before building:** `{{...}}`
- **What must NOT be done:** `{{...}}`

---

## 9. Document Control

| Field | Value |
| --- | --- |
| Owner | `{{OWNER}}` |
| Version | `{{VERSION}}` |
| Last updated | `{{YYYY-MM-DD}}` |
