# [PROJECT_NAME] — Agent Operating Contract

**MES Version:** 1.1.1  
**Document:** `CLAUDE.md` (or Cursor/Codex/`AGENTS.md` equivalent)  
**Status:** Template  
**Parent:** suite [`CLAUDE.md`](../CLAUDE.md) · AI ownership [`AI/INDEX.md`](../AI/INDEX.md)

Vendor-neutral content: rename file for the agent toolchain; keep the rules.

---

## Foundation

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Read First

1. `README.md`  
2. `AI_GUIDELINES.md` (project) — Risk Class map and tool allowlist  
3. `VERIFY.md` — commands, gates, evidence expectations  
4. `ARCHITECTURE.md` — before boundary or trust-boundary changes  
5. Suite `AI/INDEX.md` — before editing AI-normative concepts (edit the owner doc)  

---

## Non-Negotiables

- Map work to Risk Class **R0–R4** and `side_effect_class` `read|draft|write|irreversible`  
- Do not invent certifications, products, secrets, or evidence  
- Prefer `INCONCLUSIVE` over fabricated certainty  
- Do not Accept ADRs, approve R3+ production, or set MDES/MCR disposition to Accept without human confirmation  
- Do not paste L3+ / PHI / CUI / production customer data into prompts or PR comments  
- Do not call model providers outside the Model Gateway on production paths  
- Before R2+ writes: confirm `side_effect_class` in the PR description  

---

## Evidence Expectations

For material changes, attach or link:

- Commands run from `VERIFY.md` (pass/fail)  
- Tests / evals / screenshots as applicable  
- Risk Class + `side_effect_class`  
- HITL approver for R3+  

Do not claim “done” without evidence.

---

## Project-Specific Constraints

### Allowed

- Paths: `[src/, tests/, docs/, ...]`  
- Commands: `[from VERIFY.md]`  

### Forbidden

- `[e.g., force-push main, prod deploy, secret files]`  

### Never paste into prompts

Fields/classes from project privacy/classification docs: `[L3+ / PHI / CUI list]`

### Tool allowlist

See `AI_GUIDELINES.md` Allowed Tools table. Do not invent tools.

---

## When Stuck

Escalate with: goal, Risk Class, attempted steps, evidence so far, residual risk — do not silently broaden scope or weaken gates.
