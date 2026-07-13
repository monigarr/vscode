# [PROJECT_NAME] — System Profile Template

**MES Version:** 1.1.1  
**Document:** `SYSTEM_PROFILE.md`  
**Status:** Template  

Runtime topology and environment profile for operators and agents.

---

## Environments

| Env | URL / account | Data class | Deploy authority |
|-----|---------------|------------|------------------|
| dev | | synthetic | |
| staging | | scrubbed / synthetic | |
| production | | real under controls | R3+ HITL |

## Runtime topology

| Component | Tech | Notes |
|-----------|------|-------|
| Web | | |
| API | | |
| Workers / agents | | |
| Model Gateway | | |
| Control plane | | |
| Primary DB | | |
| Search / vector | | |
| Graph | | |

## Versions & pins

| Artifact | Version / pin |
|----------|---------------|
| App release | |
| Prompt pack | |
| Retrieval index | |
| Routing table | |
| Eval suite | |

## Feature flags

| Flag | Default | Owner | Cleanup date |
|------|---------|-------|--------------|
| | | | |

## Resource profile

- CPU / memory / GPU budgets: `[...]`  
- Token / cost budgets: `[...]`  

## Secrets

Injection via `[vault / platform]` — never git. Rotation owner: `[...]`.
