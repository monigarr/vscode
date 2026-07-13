# [PROJECT_NAME] — Data Model Template

**MES Version:** 1.1.1  
**Document:** `DATA_MODEL.md`  
**Status:** Template  
**See Also:** [`PRIVACY_DATA_GOVERNANCE_TEMPLATE.md`](PRIVACY_DATA_GOVERNANCE_TEMPLATE.md) · [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md) · [`API_SPEC.md`](API_SPEC.md) · [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Part V

Instantiate when the project needs a data contract. Align field-level classification with project `PRIVACY_DATA_GOVERNANCE.md` metadata when present.

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Entities

| Entity | Description | Owner | Sensitivity | Retention | Legal hold |
|--------|-------------|-------|-------------|-----------|------------|
| [ENTITY] | [DESC] | [OWNER] | [CLASS] | [POLICY] | [Y/N] |

## Field Dictionary (per entity)

| Field | Type | Classification | PII/PHI/CUI | AI embed? | Nullable | Notes |
|-------|------|----------------|-------------|-----------|----------|-------|
| [field] | [type] | [class] | [Y/N] | [Y/N] | [Y/N] | |

Repeat or link per-entity tables. Prefer linking classification metadata YAML from `PRIVACY_DATA_GOVERNANCE.md` § inventory rather than duplicating.

## Relationships

| From | To | Cardinality | Integrity | Notes |
|------|-----|-------------|-----------|-------|
| [A] | [B] | 1:N | FK / soft | |

Describe graph edges separately if using a knowledge graph (MES Part V).

## Diagram

- ERD path: `docs/erd.mmd` or linked image  
- Keep synchronized with migrations  

## Migrations

- All schema changes **shall** use versioned migrations.  
- No undocumented production DDL.  
- Forward + rollback plan required for R3+ releases.  

## Seed / Synthetic Data

- Prefer synthetic fixtures for tests and evals.  
- No unrestricted production dumps in git.  
- Document anonymization method when production-derived.  

## AI / RAG Notes

| Entity / field set | Embeddable | Indexable | Training eligible | Notes |
|--------------------|------------|-----------|-------------------|-------|
| [set] | Y/N | Y/N | Y/N | |

List prohibited fields (secrets, raw PHI without authorization, etc.).

## Deletion & Erasure

Document how hard-delete / crypto-erase propagates to indexes, embeddings, backups, and memory layers (see [`../AI/MEMORY.md`](../AI/MEMORY.md), [`../AI/RAG.md`](../AI/RAG.md)).

## Conformance

- Sync with `PRD.md` data tables and `API.md` payloads.  
- Healthcare/gov projects: mark PHI/ePHI and CUI explicitly.  
