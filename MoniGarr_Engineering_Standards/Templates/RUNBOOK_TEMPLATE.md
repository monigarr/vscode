# [PROJECT_NAME] — Runbook Template

**MES Version:** 1.1.1  
**Document:** `RUNBOOK.md`  
**Status:** Template  
**See Also:** suite [`Engineering/ONCALL.md`](../Engineering/ONCALL.md)

---

## Service overview

| Field | Value |
|-------|-------|
| Service | `[NAME]` |
| Owner | `[TEAM]` |
| On-call | `[ROTATION]` |
| Dashboards | `[URLS]` |
| Deploy | `[PATH / doc]` |

## Alert → action map

| Alert | Severity | First actions | Escalate |
|-------|----------|---------------|----------|
| [name] | Sev-n | [steps] | [who] |

## Common failures

### [Failure mode]

1. Diagnose: `[...]`  
2. Mitigate: `[...]`  
3. Verify: `[...]`  
4. Follow-up: `[ticket / PIR]`  

## AI quality cliffs

| Symptom | Checks | Rollback |
|---------|--------|----------|
| Eval / grounding drop | prompt_version, index, model route | prior artifact pin |

## Rollback

- Application: `[...]`  
- Prompt / model / index: `[...]`  
- Data restore: last resort — `[BACKUP POLICY]`  

## Contacts

| Role | Contact |
|------|---------|
| Eng owner | |
| Security | |
| Privacy / AO | |
