# [PROJECT_NAME] — Contributing Template

**MES Version:** 1.1.1  
**Document:** `CONTRIBUTING.md`  
**Status:** Template  
**Parent:** suite [`Governance/CONTRIBUTING.md`](../Governance/CONTRIBUTING.md)

Project rules may be stricter than MES. They **shall not** weaken MES non-negotiables.

---

## Branch & PR

- Default branch: `[main]`  
- Protected: yes  
- PR template fields: Summary, Evidence, Risk Class R0–R4, `side_effect_class`, HITL, Rollback  

## Local checks

```bash
[lint] && [test] && [eval if AI]
```

## Risk Class

Use suite R0–R4. R2+ externalization and R3+ production require HITL evidence. R4 dual-control.

## Documentation

- Material project doc changes require **MDES** scores + disposition ([`../MDES.md`](../MDES.md)).
- Suite-affecting / MES normative changes also require **MCR** checklist ([`../Governance/MES_REVIEW_PROCESS.md`](../Governance/MES_REVIEW_PROCESS.md)); file evidence under `MDES_REVIEWS/` or attach the scorecard table to the PR.
- Agents **shall not** mark Accept / Conformant / Excellence without Suite Owner confirmation.

## Regulated data

No real PHI/CUI in fixtures, logs, or PRs unless legal basis is documented ([`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md)).
