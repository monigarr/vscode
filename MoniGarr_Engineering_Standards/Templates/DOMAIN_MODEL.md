# [PROJECT_NAME] — Domain Model Template

**MES Version:** 1.1.1  
**Document:** `DOMAIN_MODEL.md`  
**Status:** Template  
**See Also:** [`DATA_MODEL.md`](DATA_MODEL.md) · [`EVENT_MODEL.md`](EVENT_MODEL.md) · [`API_SPEC.md`](API_SPEC.md) · [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md)

Instantiate for DDD-heavy systems. Persistence detail lives in `DATA_MODEL.md`; integration events catalog may live in `EVENT_MODEL.md`.

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

---

## Ubiquitous Language

| Term | Meaning | Context |
|------|---------|---------|
| [TERM] | [MEANING] | [CONTEXT] |

## Bounded Contexts

| Context | Owner | Responsibilities | Integrates via |
|---------|-------|------------------|----------------|
| [CONTEXT] | [OWNER] | [RESP] | API / events / ACL |

## Context Map

- Path: `docs/context-map.mmd`  
- Show upstream/downstream, conformist, anti-corruption, shared kernel as applicable  

## Aggregates and Invariants

| Aggregate | Root | Invariants | Consistency |
|-----------|------|------------|-------------|
| [NAME] | [ROOT] | [RULES] | strong / eventual |

## Anti-Corruption Layers

| External system | ACL module | Translated concepts |
|-----------------|------------|---------------------|
| [SYS] | [MODULE] | [CONCEPTS] |

## Domain Events

| Event | When | Payload summary | Catalog |
|-------|------|-----------------|---------|
| [EventName] | [trigger] | [fields] | link `EVENT_MODEL.md` |

## Example (CareerPilot)

Illustrative contexts only: Identity, Career Graph, Matching, Documents, Interview Prep, Applications, Analytics, Compliance.
