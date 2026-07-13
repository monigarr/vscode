# RAG — Retrieval-Augmented Generation Standard

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All MoniGarr systems that retrieve external or corpus knowledge to ground model outputs  
**Canonical Path:** `AI/RAG.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Parts VI–VII, XII · [`../Governance/MILE.md`](../Governance/MILE.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`AGENTS.md`](AGENTS.md) · [`SUBAGENTS.md`](SUBAGENTS.md) · [`PROMPTS.md`](PROMPTS.md) · [`TOOLS.md`](TOOLS.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) · [`EVALS.md`](EVALS.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`MEMORY.md`](MEMORY.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

RAG is the primary grounding mechanism for factual generation. This standard defines corpus curation, chunking, indexing, hybrid retrieval, reranking, evidence bundles, citation rules, freshness, and evaluation gates. Ungrounded claims in R1+ user-facing outputs are non-conformant.

Related graph retrieval: [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md).  
Memory layers that are not corpus RAG: [`MEMORY.md`](MEMORY.md).

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
| **Corpus** | Versioned collection of documents approved for retrieval |
| **Chunk** | Indexed unit of text (or multimodal payload) with metadata |
| **Evidence bundle** | Structured package of retrieved chunks + scores + provenance |
| **Hybrid retrieval** | Sparse + dense (+ optional graph) fusion before generation |
| **Reranker** | Model or heuristic that reorders candidates after first-stage recall |
| **Groundedness** | Degree to which claims are supported by cited evidence |
| **Freshness SLA** | Maximum acceptable lag between source update and index visibility |
| **Poisoning** | Adversarial or accidental corpus content that steers unsafe outputs |

---

## When RAG Is Required

Agents **shall** retrieve before generation when:

1. The output asserts product, policy, legal, pricing, or customer-specific facts.  
2. The risk class is R1+ and the answer depends on mutable knowledge.  
3. Citations are required by the agent contract.  
4. The prompt family marks `retrieval_policy: required`.

Agents **may** skip RAG only when:

- The task is pure style/format transform of already-grounded inputs.  
- The knowledge is statically pinned in a versioned system prompt *and* evaluated as frozen.  
- An ADR documents why parametric memory alone is acceptable.

---

## Architecture Overview

```text
Sources → Ingest/Validate → Chunk → Embed/Index → Retrieve → Rerank
                                                           ↓
                                              Evidence Bundle
                                                           ↓
                                              Generator (cited)
                                                           ↓
                                              Critic / Eval gates
```

Generation **must not** begin factual drafting until an evidence bundle exists or an explicit empty-result policy runs.

---

## Corpus Governance

### Admission

Every document admitted to a production corpus **shall** have:

| Field | Requirement |
|-------|-------------|
| `doc_id` | Stable ID |
| `source_system` | Origin |
| `owner` | Human owner |
| `license` / rights | Allowed use |
| `sensitivity` | Public / internal / confidential / restricted |
| `effective_date` / `expires_at` | Validity window |
| `version` | Content version |
| `checksum` | Integrity |
| `pii_class` | None / contains_pii / redacted |

### Forbidden Admissions

Corpora **must not** include:

- Secrets, raw credentials, or private keys  
- Customer PII beyond the product’s approved data boundary  
- Unlicensed third-party content  
- Unreviewed scraped web dumps for R2+ assistants  

### Versioning

Corpus snapshots **shall** be versioned. Index builds reference a corpus snapshot ID. Rolling indexes without snapshot IDs are non-conformant for regulated or customer-facing R2+ flows.

---

## Chunking Standard

### Requirements

1. Chunks **shall** preserve enough context to stand alone for citation.  
2. Chunk boundaries **should** respect semantic units (sections, clauses), not only token windows.  
3. Overlap **may** be used; overlap policy must be documented.  
4. Each chunk **must** carry parent `doc_id`, section path, offsets, and sensitivity.  
5. Tables and code **should** use specialized chunkers that keep structure.

### Anti-Patterns

- Tiny fragments that force hallucinated glue text  
- Mega-chunks that drown the context window  
- Stripping headings so citations cannot be located  
- Mixing confidential and public text in one chunk without labels  

---

## Indexing

### Dense Index

Embedding model ID and version **shall** be recorded on the index. Changing embedding models requires a full reindex and eval gate.

### Sparse Index

Keyword/BM25 (or equivalent) **should** be maintained for hybrid recall, especially for IDs, error codes, and proper nouns.

### Metadata Filters

Indexes **must** support filters for sensitivity, product, locale, and effective dates. Agents **shall** apply filters matching the caller’s authz.

### Freshness

Projects **shall** publish a freshness SLA per corpus (for example “policy docs ≤ 24h”). Stale indexes beyond SLA **must** page on-call or degrade to safe refusal for R2+ factual answers.

---

## Retrieval Pipeline (Normative Defaults)

### Stage 1 — Query Construction

- Prefer structured filters + natural language query.  
- Expand queries carefully; expansions **should** be logged.  
- User and tool text **must** be treated as untrusted (prompt injection).

### Stage 2 — Hybrid Recall

Production R1+ systems **should** use hybrid recall (sparse + dense). Dense-only is allowed only with ADR and eval proof of sufficiency.

### Stage 3 — Fusion

Reciprocal rank fusion or documented weighted fusion **shall** produce a candidate set with scores.

### Stage 4 — Rerank

R2+ factual flows **should** rerank top-N. Reranker version is part of the retrieval policy fingerprint.

### Stage 5 — Evidence Bundle Assembly

The retriever **must** return an evidence bundle, not raw free text dumps into the writer prompt without structure.

---

## Evidence Bundle Contract

```yaml
evidence_bundle_id: eb_01HZX...
corpus_snapshot_id: corpus.policies.v2026.07.12
retrieval_policy_id: policy.hybrid.v3
query: "..."
filters: { sensitivity: ["public","internal"], product: "example" }
items:
  - chunk_id: chk_...
    doc_id: doc_...
    score: 0.83
    rerank_score: 0.91
    citation:
      title: "..."
      section: "3.2"
      uri: "..."
    text: "..."
    sensitivity: internal
open_questions: []
coverage:
  sufficient: true
  rationale: "Two independent sources agree on effective date."
```

Writers **shall** cite `chunk_id` / document references for material claims. Critic agents **shall** flag uncited factual assertions.

---

## Citation and Groundedness Rules

1. Material facts **must** map to at least one evidence item.  
2. Conflicting evidence **must not** be silently averaged; surface conflict.  
3. Absence of evidence **shall** yield refusal, clarification, or explicit uncertainty—not invention.  
4. Paraphrase is allowed; contradiction of evidence is not.  
5. Citations **should** be user-visible for customer-facing R2+ answers unless UX ADR says otherwise (still required in traces).

---

## Security and Safety

### Prompt Injection via Corpus

Ingest pipelines **shall** scan for instruction-like payloads (“ignore previous instructions”). High-risk chunks **must** be quarantined.

### Cross-Tenant Isolation

Multi-tenant products **must** enforce tenant filters at index and query layers—not only in the prompt.

### Data Minimization

Retrieve the minimum chunks needed. Dumping entire documents into context is discouraged and **must** respect sensitivity.

---

## Evaluation Requirements

RAG systems **shall** evaluate at least:

| Metric | Intent |
|--------|--------|
| Recall@k | Required docs appear in candidates |
| Precision / nDCG | Ranking quality |
| Groundedness | Claims supported by citations |
| Citation accuracy | Cited chunks actually support claims |
| Refusal quality | Correct behavior on empty/conflict |
| Freshness lag | Index SLA compliance |
| Latency / cost | Within budgets |

Golden sets: [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md).  
Harness jobs: [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md).  
Promotion gates: [`EVALS.md`](EVALS.md).

Offline eval **must** pass before production index or policy promotion. Online sampling **should** continue post-deploy.

---

## Retrieval Policies

Each agent **shall** reference a named `retrieval_policy` including:

- Corpora allowed  
- Hybrid vs dense-only  
- k / N parameters  
- Reranker  
- Authz filters  
- Empty-result behavior  
- Max context tokens for evidence  

Policy IDs are versioned and appear in traces.

---

## Integration with Knowledge Graphs

When entities and relationships matter, RAG **should** combine with graph traversal ([`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md)):

1. Retrieve text evidence.  
2. Resolve entities.  
3. Traverse constrained paths.  
4. Merge into one evidence bundle with typed provenance.

Graph-only answers without textual provenance are discouraged for customer-facing explanations.

---

## Operational Runbooks (Required Topics)

Projects **shall** document:

1. Reindex procedure and rollback  
2. Poisoning / quarantine response  
3. Freshness breach response  
4. Embedding model migration  
5. Tenant isolation verification  
6. Cost spike response  

### Right-to-erasure / DSAR (pointers)

When personal data enters corpora or indexes, projects **shall** define (or link to project `PRIVACY_DATA_GOVERNANCE.md`):

- **Erasure:** purge/tombstone subject data from indexes and object stores; reindex or selective delete so retrieval no longer returns erased content within the published SLA.  
- **Reindex:** procedure and verification after erasure or retention expiry.  
- **DSAR export:** export path for subject-accessible retrieval artifacts where applicable.  

Detail lives in privacy docs—not duplicated essays here.

---

## Retrieval Diagnostics

**Ownership:** RAG systems **shall** emit diagnostics; field catalog and dashboard expectations live in [`../Engineering/OBSERVABILITY.md`](../Engineering/OBSERVABILITY.md) § Retrieval Diagnostics.

Every production retrieval path **shall** emit (or link via `trace_id`) at least:

| Field | Purpose |
|-------|---------|
| `corpus_snapshot_id` | Which corpus version answered |
| `chunk_ids` / evidence ids | Provenance for citations |
| `recall_scores` / fusion scores | Debugging rank quality |
| `filter_audit` | Which ACL / classification filters applied |
| `rerank_model_id` (when used) | Reproducibility |
| `empty_result` boolean | Distinguish “no evidence” from “model invented” |

Agents and reviewers **shall** use these fields before blaming the generator for retrieval failures.

---

## Example (CareerPilot) — Resume and Job Grounding

Illustrative only.

| Flow | Corpus | Policy notes |
|------|--------|--------------|
| Resume bullet grounding | User-approved experience corpus | Never invent employers; empty → ask user |
| Job description match | Job post + skills ontology | Hybrid recall; cite job sections |
| Policy answers | CareerPilot help center snapshot | Freshness ≤ 24h; refuse if stale |
| Critique | Rubric docs + prior golden fails | Critic reads evidence, not parametric folklore |

CareerPilot writers **must** treat user profile fields as authoritative over web-scraped rumors about the same person.

---

## Anti-Patterns (Non-Conformant)

1. “Retrieve something” then ignore it in the draft.  
2. Stuffing the context with low-score chunks to look thorough.  
3. Using the live public web as the only corpus for regulated advice.  
4. One shared index across tenants without filters.  
5. Changing chunkers/embeddings without golden regression.  
6. Citing documents not present in the evidence bundle.  
7. Treating chat memory as a substitute for corpus RAG.

---

## Compliance Checklist

- [ ] Production factual flows have versioned corpora and snapshots.  
- [ ] Chunks carry provenance and sensitivity metadata.  
- [ ] Hybrid retrieval is default for R1+ or ADR exists.  
- [ ] Evidence bundle contract is enforced.  
- [ ] Citations required for material claims.  
- [ ] Freshness SLA defined and monitored.  
- [ ] Injection/quarantine controls exist at ingest.  
- [ ] Tenant isolation verified.  
- [ ] Offline golden evals gate promotions.  
- [ ] Traces include policy, snapshot, and chunk IDs.

---

## Change Control

Retrieval policy, embedding model, and corpus admission rule changes **shall** go through MILE ([`../Governance/MILE.md`](../Governance/MILE.md)) with eval deltas attached. Platform-shared RAG services **should** align with [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md).

---

## See Also (Sibling Index)

- [`TOOLS.md`](TOOLS.md) — `rag.search` and related tools  
- [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) — entity/relationship grounding  
- [`EVALS.md`](EVALS.md) — groundedness and retrieval metrics  
- [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) — RAG golden cases  
- [`MEMORY.md`](MEMORY.md) — non-corpus memory layers  
- [`AGENTS.md`](AGENTS.md) — retriever role  
- [`SUBAGENTS.md`](SUBAGENTS.md) — retriever sub-agents  
- [`PROMPTS.md`](PROMPTS.md) — citation instructions  
- [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) — retrieve–generate loops  
- [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) — RAG harness jobs  
- [`MODEL_ROUTING.md`](MODEL_ROUTING.md) — rerank vs generate models  
- [`AI_GUIDELINES.md`](AI_GUIDELINES.md) — risk and refusal  

---

## Revision History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-07-12 | Initial MES RAG standard; erasure/reindex/DSAR pointers |
