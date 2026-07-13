# [PROJECT_NAME] — AI Guidelines (Project Instantiation)

**MES Version:** 1.1.1  
**Document:** `AI_GUIDELINES.md`  
**Status:** Template  
**Parent standard:** suite [`AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md) · ownership map [`AI/INDEX.md`](../AI/INDEX.md)

This file **narrows** MES AI rules for this product. It **shall not** weaken prohibited authority, Risk Class, dual-control, or HITL requirements.

---

## Foundation

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Suite Sections Adopted

Confirm each suite obligation is adopted or narrowed with rationale:

| Suite section | Adopted | Project note |
|---------------|---------|--------------|
| Risk Class R0–R4 | [ ] | |
| Dual-control (R4 **or** irreversible @ R3+) | [ ] | |
| Prohibited authority list | [ ] | |
| Model Gateway sole egress | [ ] | |
| Eval / golden gates before AI release | [ ] | |
| Prompt registry + versioning | [ ] | |
| Tool allowlists + budgets | [ ] | |
| KillSwitch for write / irreversible paths | [ ] | |

---

## Scope

- AI features in scope: `[list]`  
- Out of scope: `[list]`  
- Deterministic systems of record (never AI-owned): `[list]`  

---

## Risk Class Map

| Workflow / agent | Risk Class (R0–R4) | `side_effect_class` | HITL | Approver role |
|------------------|--------------------|---------------------|------|---------------|
| [workflow] | R[n] | read \| draft \| write \| irreversible | [who / when] | [role] |

**Example (narrow):** FAQ draft = R1 / `draft` / reviewer optional · Production CRM write = R3 / `write` / product owner · Irreversible delete = R4 / `irreversible` / dual-control.

---

## Allowed Tools

| Tool ID | Purpose | `side_effect_class` | Max risk | Budget / rate |
|---------|---------|---------------------|----------|---------------|
| [id] | [purpose] | read \| draft \| write \| irreversible | R[n] | [limit] |

Agents **shall not** invoke tools above their workflow Risk Class or outside this allowlist.

---

## Prohibited Authority

Suite bans always apply. Add product-specific bans:

- [ ] No autonomous clinical / medical advice  
- [ ] No autonomous legal / eligibility determinations  
- [ ] No silent production deploy or secret exfiltration  
- [ ] No MDES/MCR disposition Accept without human confirmation  
- Other: `[...]`

---

## Prompts, Models, Routing

- Prompt registry path: `[...]`  
- Model Gateway / routing policy: `[...]`  
- Data residency / ClassificationEnforcer: `[...]`  
- KillSwitch control path: `[...]`  

---

## Evals & Harnesses

| Suite / golden set | Gate | Threshold | Owner |
|--------------------|------|-----------|-------|
| [name] | release | [metric ≥ x] | [owner] |

R3+ AI changes **shall** attach eval evidence before merge/release.

---

## Regulated Overlays

- [ ] None  
- [ ] Adopt [`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md): `[PHI / CUI / sovereign]`  
- Routing matrix path: `[...]`  
- PHI/CUI fixtures: synthetic only unless legal basis documented  

---

## Approval Artifacts (R2+)

Record: approver, timestamp, artifact versions (prompt/model/harness), eval link, decision, residual risk — per suite AI_GUIDELINES.
