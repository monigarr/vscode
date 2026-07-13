# {{PROJECT_NAME}} — USERS

**MES Version:** 1.1.1

> ## 📋 How to use this template — read me first, then delete this box
> - **What it is:** the single source of truth for **who** the product is for and **why**. Every feature in the
>   PRD and every component in the Architecture must trace back to a use case defined here.
> - **Who owns it:** the designer and project owner, together.
> - **When in the workflow:** Companion to PRD (Step 2 of 8) — see [README](../README.md). Fill it right after PreSearch when brownfield.
> - **Drive it with AI:** *"Help me define ONE narrow persona and 2–3 use cases. Push back if a use case
>   doesn't justify an AI agent over a plain UI. Fill the traceability matrix at the end."*
> - **Placeholder legend:** `{{FILL_ME}}` = your value · `💡` = guidance, delete it · `✍️` = example, replace it
> - **Done when:** no `{{...}}` tokens and no `💡` / `✍️` callouts remain.

---

## 0. Source of Truth
**Rule:** All features MUST map to a defined use case below. If a feature has no use case here, it does not get built.

---

## 1. Target User (Single Persona First)
> 💡 Resist the urge to serve everyone. Pick the *one* user whose pain is sharpest. You can widen later.

- **Role:** `{{job title / function}}`
- **Experience level:** `{{novice ... expert with the domain and with software}}`
- **Environment:** `{{where they work — device, network, noise, interruptions}}`
- **Technical context:** `{{what system they live in today}}`
- **Constraints (time, cognitive load, risk):** `{{e.g. ~90 seconds between tasks; high stakes if wrong}}`

---

## 2. Day-in-the-Life Workflow
> 💡 Describe the real moment your product enters. Be concrete about what happens immediately before and after.

1. **Before system interaction:** `{{what they're doing / what they need}}`
2. **Interaction moment:** `{{the exact moment your product is used}}`
3. **After interaction:** `{{what they do with the output}}`

---

## 3. Core Needs
- **Need 1:** `{{need}}`
- **Need 2:** `{{need}}`

---

## 4. Use Cases

### UC1 — {{Name}}
- **Moment:** `{{when in the workflow}}`
- **Need:** `{{the question the user is asking}}`
- **Why conversational / AI-first:** `{{why an agent beats a static UI here}}`
- **Success outcome:** `{{what good looks like}}`
- **Failure risk:** `{{what harm happens if it's wrong}}`

### UC2 — {{Name}}
> 💡 Copy the UC1 structure. Aim for 2–3 strong use cases, not ten weak ones.

- **Moment:** `{{...}}`
- **Need:** `{{...}}`
- **Why conversational / AI-first:** `{{...}}`
- **Success outcome:** `{{...}}`
- **Failure risk:** `{{...}}`

---

## 5. UX Entry Point
- **Where in system:** `{{the screen / surface where the product appears}}`
- **Trigger action:** `{{button, page load, command, etc.}}`
- **Expected response time:** `{{e.g. < 5s}}`
- **Acceptable friction:** `{{how much wait / how many clicks is tolerable}}`

---

## 6. Trust Expectations
> 💡 This section is where verification-first design meets the user. Be explicit.

- **What must never happen:** `{{e.g. a fabricated fact presented as true}}`
- **What uncertainty looks like:** `{{how the product admits "I don't know"}}`
- **What builds trust:** `{{citations, visible sources, conservative phrasing}}`

---

## 7. Out of Scope Users
- `{{who this is NOT for yet — name them so scope stays narrow}}`

---

## 8. Traceability Matrix
> 💡 This is the contract between USERS and the rest of the kit. Every row should reappear in the PRD and Architecture.

| Use Case | Required Data | Risk if Wrong | Mitigation |
| --- | --- | --- | --- |
| `{{UC1}}` | `{{data it needs}}` | `{{harm}}` | `{{verification / domain rule}}` |
| `{{UC2}}` | `{{...}}` | `{{...}}` | `{{...}}` |

---

## 9. Document Control

| Field | Value |
| --- | --- |
| Owner | `{{OWNER}}` |
| Version | `{{VERSION}}` |
| Last updated | `{{YYYY-MM-DD}}` |
