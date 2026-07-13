# [PROJECT_NAME] — Onboarding Template

**MES Version:** 1.1.1  
**Document:** `ONBOARDING.md`  
**Status:** Template  

Day-1 path for humans and coding agents.

---

## Prerequisites

- Access: `[repos, secrets vault, cloud, IdP]`  
- Tools: `[language runtimes, Docker, etc.]`  

## Day 1 — Human

1. Read `README.md`, `PRD.md`, `ARCHITECTURE.md`  
2. Run local quickstart  
3. Run tests / evals from `TESTING.md` / `VERIFY.md`  
4. Join on-call / ownership map (`CODEOWNERS` and/or project ownership doc — do not invent `AUTHOR_ORGANIZATION.md` unless the project adopts it)  

## Day 1 — AI agent

1. Load `CLAUDE.md` + `AI_GUIDELINES.md`  
2. Respect Risk Class and tool allowlists  
3. Do not invent inventory — check suite `PRODUCTS.md` for portfolio questions  

## Architecture tour

- Trust boundaries: `[...]`  
- Deterministic vs intelligence plane: `[...]`  
- Where prompts, evals, and golden sets live: `[...]`  

## First safe change

Suggested starter task: `[docs typo / test / small non-prod fix]` with PR evidence checklist.
