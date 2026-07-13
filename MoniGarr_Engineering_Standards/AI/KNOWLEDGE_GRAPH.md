# Knowledge Graph — Ontology, Provenance, and Agent Traversal

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All MoniGarr knowledge graphs used for AI retrieval, reasoning, governance, or product features  
**Canonical Path:** `AI/KNOWLEDGE_GRAPH.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Parts VI–VII, XII · [`../Governance/MILE.md`](../Governance/MILE.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`AGENTS.md`](AGENTS.md) · [`SUBAGENTS.md`](SUBAGENTS.md) · [`PROMPTS.md`](PROMPTS.md) · [`TOOLS.md`](TOOLS.md) · [`RAG.md`](RAG.md) · [`EVALS.md`](EVALS.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`MEMORY.md`](MEMORY.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

Knowledge graphs provide typed entities, relationships, and provenance that complement textual RAG. This standard defines ontology governance, ingestion, identity resolution, traversal policies for agents, write paths, evaluation, and operational controls.

Text retrieval remains governed by [`RAG.md`](RAG.md). Graphs do not replace corpora; they structure and constrain them.

---

## Normative Language

| Keyword | Meaning |
|---------|---------|
| **shall / must** | Mandatory for MES conformance |
| **should** | Strong default; deviation requires an ADR |
| **may** | Optional |
| **Example (CareerPilot)** | Illustrative only |

---

## Definitions

| Term | Meaning |
|------|---------|
| **Entity** | Typed node with stable ID and properties |
| **Relationship** | Typed edge with direction, constraints, and provenance |
| **Ontology** | Versioned schema of types, properties, and allowed edges |
| **Provenance** | Record of how a fact entered the graph and from which source |
| **Identity resolution** | Linking equivalent real-world entities to one canonical ID |
| **Traversal policy** | Allowed edge types, depth, filters, and budgets for agents |
| **Materialization** | Derived subgraph or projection for a use case |
| **Stale edge** | Relationship past its validity window or contradicted by newer evidence |

---

## When to Use a Knowledge Graph

Use a graph when:

- Relationships are first-class (org charts, skill taxonomies, dependency maps).  
- Multi-hop constraints matter (“roles requiring cert X at company Y”).  
- Provenance and temporality must be queryable.  
- Multiple products share a canonical entity model.

Do **not** force a graph when:

- Flat document search suffices.  
- The ontology would be a one-off dump of free text labels.  
- Write volume would make consistency unattainable without staffing.

---

## Ontology Governance

### Requirements

1. Ontologies **shall** be versioned (SemVer) in source control.  
2. Breaking type/edge changes **must** bump major version and include migration.  
3. Every type **shall** have an owner, description, and property dictionary.  
4. Edge types **shall** declare cardinality, direction, and inverse if any.  
5. Deprecations **shall** name replacements and sunset dates.

### Ontology Review

Ontology PRs **should** include:

- Motivation and impacted products  
- Example instance data  
- Migration plan  
- Eval impact (traversal golden sets)  
- Privacy/sensitivity notes  

MILE applies for cross-product ontology changes ([`../Governance/MILE.md`](../Governance/MILE.md)).

---

## Entity and Edge Contracts

### Entity Minimum Fields

| Field | Requirement |
|-------|-------------|
| `id` | Stable unique identifier |
| `type` | Ontology type |
| `properties` | Typed map |
| `sources` | Provenance refs |
| `valid_from` / `valid_to` | Temporal validity |
| `sensitivity` | Classification |
| `confidence` | If extracted by models |
| `status` | active / deprecated / disputed |

### Edge Minimum Fields

| Field | Requirement |
|-------|-------------|
| `id` | Stable ID |
| `type` | Ontology edge type |
| `from` / `to` | Entity IDs |
| `properties` | Optional typed map |
| `sources` | Provenance |
| `valid_from` / `valid_to` | Temporal |
| `confidence` | If inferred |
| `status` | active / disputed / retracted |

Edges without provenance are non-conformant in production graphs used for R1+ decisions.

---

## Provenance Model

Provenance **shall** record:

1. Source document or system ID  
2. Extractor/agent version (if AI-extracted)  
3. Human approver (if HITL-required)  
4. Extraction timestamp  
5. Checksum or quote pointer into source  

Model-inferred edges at confidence below the product threshold **must** be marked `disputed` or held in a staging graph until approved.

---

## Identity Resolution

Projects **shall** define resolution rules per entity type (for example email, employee ID, canonical company domain).

Rules:

1. Prefer strong identifiers over fuzzy name match.  
2. Fuzzy merges **must** be reversible and audited.  
3. Cross-tenant merges are forbidden.  
4. Resolution conflicts **shall** create `same_as_candidate` edges, not silent merges, until approved for R2+.

---

## Ingestion Pipelines

```text
Sources → Validate → Extract/Map → Resolve IDs → Stage → HITL (if needed) → Commit → Index projections
```

### Normative Controls

- Schema validation before commit.  
- Quarantine for ontology violations.  
- Idempotent upserts with change feed.  
- Separation of staging vs serving graphs for R2+.  
- Replayable ingest from raw sources.

AI extractors are accelerators; the serving graph remains a governed system of record projection.

---

## Agent Traversal Policies

Agents **shall not** run unbounded graph walks. Every agent with graph tools **must** declare a traversal policy:

| Field | Description |
|-------|-------------|
| `allowed_edge_types` | Explicit allowlist |
| `max_depth` | Hard depth |
| `max_nodes` | Fan-out budget |
| `property_filters` | Sensitivity, tenant, validity |
| `time_axis` | As-of query requirements |
| `write_allowed` | false by default |
| `timeout_ms` | Hard stop |

### Tooling

Graph tools follow [`TOOLS.md`](TOOLS.md). Typical IDs:

- `graph.get_entity`  
- `graph.traverse`  
- `graph.query` (constrained DSL; not raw admin query languages for agents)  
- `graph.propose_edge` (draft only)  
- `graph.commit_edge` (HITL / privileged)

Raw Cypher/Gremlin/SPARQL from model text **must not** be executed in production without a deterministic allowlisted template layer.

---

## Reads vs Writes

| Operation | Default |
|-----------|---------|
| Read/traverse | Allowed per policy |
| Propose edge/entity | Draft/staging only |
| Commit to serving graph | Privileged; HITL for R2+ inferred facts |
| Delete/retract | Privileged; audited |

Retracting an edge **shall** preserve history (soft retract), not physical delete, when used for audit-bearing products.

---

## Combination with RAG

Recommended pattern:

1. RAG retrieves supporting text ([`RAG.md`](RAG.md)).  
2. Entity linker maps mentions to graph IDs.  
3. Traversal gathers constrained neighborhood.  
4. Evidence bundle includes both chunk citations and edge provenance.  
5. Generator cites both as needed.  
6. Critic checks contradictions between text and graph.

If text and graph conflict, agents **shall** surface conflict rather than pick silently.

---

## Quality and Evaluation

Graph systems **shall** track:

| Metric | Intent |
|--------|--------|
| Ontology conformance rate | Invalid instances |
| Precision/recall of extraction | Against golden annotations |
| Link accuracy | Identity resolution |
| Traversal usefulness | Task success with graph vs without |
| Staleness | Expired edges still served |
| Conflict rate | Disputed facts |
| Authz leak tests | Cross-tenant traversal attempts |

Golden graph fixtures belong in [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md). Promotion gates in [`EVALS.md`](EVALS.md).

---

## Privacy, Security, and Tenancy

1. Sensitivity labels on nodes/edges are mandatory.  
2. Query layer **must** enforce tenant and authz filters.  
3. Aggregations **shall not** reveal restricted neighbors via counting tricks without policy review.  
4. Exports for model training **must** follow privacy templates and redaction.  
5. Admin bypasses are break-glass only with audit.

---

## Performance and SLOs

Projects **shall** publish:

- p95 traverse latency for standard policies  
- Max graph size growth alerts  
- Ingest lag SLO  
- Hot-neighbor / supernode mitigations  

Supernodes **should** use edge partitioning or summarized projections so agents cannot explode context.

---

## Materializations and Projections

Derived views (search documents, vectorized summaries, API DTOs) **shall** record:

- Source ontology version  
- Build job ID  
- Freshness  
- Lossy transforms applied  

Projections are not a second source of truth; rebuild from the graph + corpora.

---

## Example (CareerPilot) — Skills and Role Graph

Illustrative only.

| Type | Examples |
|------|----------|
| Entities | `Person`, `Role`, `Skill`, `Employer`, `Credential`, `JobPosting` |
| Edges | `person_has_skill`, `role_requires_skill`, `person_employed_at`, `job_seeking` |
| Traversal | Resume matcher may walk `JobPosting → requires_skill → Skill → person_has_skill` depth ≤ 2 |
| Writes | User edits to skills are HITL-confirmed before serving; scraper-inferred skills stay staged |
| Conflict | User denies a scraped employer → edge retracted with provenance preserved |

CareerPilot agents **must not** invent `person_employed_at` edges without user-approved or verified sources.

---

## Anti-Patterns (Non-Conformant)

1. Free-form “knowledge graph” as an untyped property bag.  
2. Agents executing arbitrary graph query languages.  
3. Silent fuzzy merges across people or companies.  
4. Serving inferred edges at low confidence without labels.  
5. Using the graph as a dumping ground for full document text.  
6. No temporal validity on employment or policy relationships.  
7. One global graph without tenant isolation for multi-tenant SaaS.

---

## Compliance Checklist

- [ ] Versioned ontology with owners and edge cardinality.  
- [ ] Provenance on all production edges used for R1+.  
- [ ] Staging vs serving separation for inferred writes.  
- [ ] Agent traversal policies with depth/node budgets.  
- [ ] No raw model-authored query language execution.  
- [ ] Identity resolution rules documented and audited.  
- [ ] Tenant/sensitivity enforcement tested.  
- [ ] Golden extraction and traversal evals in CI/CD.  
- [ ] Conflict and retract semantics defined.  
- [ ] SLOs and supernode mitigations documented.

---

## Harness Pin Contract

Graph harnesses **shall** pin:

| Pin | Requirement |
|-----|-------------|
| Ontology version | SemVer of types/edges under test |
| Serving commit / snapshot ID | Exact graph build used by harness |
| Traversal policy version | Depth/node budgets and allowlists |
| Extractor / model class | When AI extraction is under test |

Unpinned graph runs are non-conformant for R1+ promotion gates. See [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md).

---

## Change Control

Ontology major versions, serving commit paths, and traversal policy defaults **shall** follow MILE ([`../Governance/MILE.md`](../Governance/MILE.md)). Shared platform graphs **should** be reflected in [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md).

---

## Revision History

| Date | MES | Change |
|------|-----|--------|
| 2026-07-12 | 1.1.0 | Harness pin contract + revision history (P3 longevity). |

---

## See Also (Sibling Index)

- [`RAG.md`](RAG.md) — textual evidence and hybrid retrieval  
- [`TOOLS.md`](TOOLS.md) — graph tool contracts  
- [`EVALS.md`](EVALS.md) — graph quality gates  
- [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) — annotated graph fixtures  
- [`MEMORY.md`](MEMORY.md) — ephemeral vs durable knowledge  
- [`AGENTS.md`](AGENTS.md) — retriever/specialist roles  
- [`SUBAGENTS.md`](SUBAGENTS.md) — graph specialist sub-agents  
- [`PROMPTS.md`](PROMPTS.md) — conflict-surfacing instructions  
- [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) — iterative linking loops  
- [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) — graph harnesses  
- [`MODEL_ROUTING.md`](MODEL_ROUTING.md) — extraction model classes  
- [`AI_GUIDELINES.md`](AI_GUIDELINES.md) — HITL for inferred facts  
