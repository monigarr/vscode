# Memory — Layers, Scopes, Promotion, Retention, and Contamination Controls

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All MoniGarr AI memory systems spanning working context, sessions, projects, long-term stores, and reference corpora interfaces  
**Canonical Path:** `AI/MEMORY.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Parts VI–VII, XII · [`../Governance/MILE.md`](../Governance/MILE.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`AGENTS.md`](AGENTS.md) · [`SUBAGENTS.md`](SUBAGENTS.md) · [`PROMPTS.md`](PROMPTS.md) · [`TOOLS.md`](TOOLS.md) · [`RAG.md`](RAG.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) · [`EVALS.md`](EVALS.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

Memory makes agents useful and dangerous. This standard defines memory layers, scopes, write/read policies, promotion to durable stores, retention, isolation, and contamination controls. Treating chat transcripts as an unbounded source of truth is non-conformant for R1+ systems.

Corpus retrieval is specified in [`RAG.md`](RAG.md).  
Typed durable facts may also live in [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md).

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
| **Working memory** | Ephemeral context for the current step/loop |
| **Session memory** | Durable for a user session / ticket / run |
| **Project memory** | Shared across a project or workspace with ACL |
| **Long-term memory** | Cross-session user or org preferences/facts with governance |
| **Reference memory** | Read-oriented interface to corpora/graphs (not a dump of chat). Aligns with MILE **Reference knowledge** ([`../Governance/MILE.md`](../Governance/MILE.md)): curated product/domain knowledge accessed via RAG/graph, distinct from conversational working memory. |
| **Promotion** | Controlled elevation of a memory item to a more durable layer |
| **Contamination** | Incorrect, unsafe, or cross-tenant data influencing future runs |
| **Memory tool** | Allowlisted read/write API for agents ([`TOOLS.md`](TOOLS.md)) |
| **PHI / regulated memory class** | Memory items that may contain PHI or other regulated identifiers; subject to [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md) routing, retention, and erasure |

---

## Layer Model (Normative)

```text
Working  →  Session  →  Project  →  Long-term
                ↘         ↘
                 Reference (RAG / Graph) read paths
```

| Layer | Default TTL | Writes by agents | Requires |
|-------|-------------|------------------|----------|
| Working | End of step/loop | Yes | Budgeted context |
| Session | Session end / policy TTL | Yes | Session ID + ACL |
| Project | Project lifecycle | Limited | Project ACL |
| Long-term | Policy retention | Restricted | Validation + often HITL |
| Reference | Per corpus/graph | Via ingest pipelines | Corpus/graph governance |

Agents **shall** declare `memory_scopes` they may access ([`AGENTS.md`](AGENTS.md)).

---

## Design Principles

1. **Least memory.** Access only needed layers.  
2. **Explicit writes.** No silent persistence of full traces to long-term.  
3. **Typed items.** Prefer structured memory records over blob transcripts.  
4. **Provenance.** Every durable item records source and confidence.  
5. **Tenant isolation.** Hard filters at storage and query.  
6. **Promotion gates.** Upward movement is controlled.  
7. **Forgetability.** Deletion/export honor privacy rights.  
8. **Reference ≠ chat.** Product facts come from RAG/graph, not vibes in memory.

---

## Memory Item Contract

Durable items (session+) **shall** include:

| Field | Description |
|-------|-------------|
| `id` | Stable ID |
| `layer` | session / project / long_term |
| `type` | preference / fact / artifact_pointer / summary |
| `subject` | User, project, or org scope key |
| `payload` | Structured content |
| `provenance` | Who/what wrote it |
| `confidence` | If inferred |
| `sensitivity` | Classification (include PHI / regulated labels when applicable) |
| `created_at` / `expires_at` | Timestamps |
| `status` | active / superseded / retracted |

Items in the **PHI / regulated memory class** **shall not** be written to long-term or project layers without profile-aligned controls ([`REGULATED_PROFILES.md`](REGULATED_PROFILES.md)). Prefer pointers to authorized systems of record over storing regulated payloads in agent memory.

Summaries of conversations **should** store pointers + structured facts, not entire raw transcripts, unless an approved audit store requires raw retention.

---

## Read Policies

1. Reads **must** enforce ACL and sensitivity.  
2. Working context assembly **should** prioritize: system policy → reference evidence → durable facts → session → working.  
3. Conflicting durable facts **shall** surface, not silently overwrite in prompt stuffing.  
4. Reference reads follow retrieval policies ([`RAG.md`](RAG.md) / [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md)).

---

## Write Policies

| Layer | Agent write rule |
|-------|------------------|
| Working | Allowed freely within budget |
| Session | Allowed for task state; redact secrets |
| Project | Allowlisted types only |
| Long-term | Default deny; promote via policy |
| Reference | Not via agent chat writes; ingest only |

Secrets, tokens, and raw payment data **must not** be written to memory layers used for model context.

---

## Promotion Rules

Promotion to long-term **shall** require:

1. Schema validation.  
2. Deduplication / conflict check.  
3. Confidence threshold or human confirmation for R2+ inferred facts.  
4. Sensitivity labeling.  
5. Audit log entry.

Automatic promotion of speculative critic notes or failed hypotheses is forbidden.

Demotion/retract **shall** preserve history when audit-bearing.

---

## Summarization and Compaction

When context grows:

- Prefer deterministic compaction (drop tool noise, keep decisions).  
- Model summaries **must** be marked `type: summary` with provenance.  
- Summaries **shall not** invent facts; if unsure, omit.  
- Eval suites **should** include compaction contamination cases.

---

## Isolation and Tenancy

1. Memory indexes **must** be tenant-keyed.  
2. Cross-user “similar memory” suggestions require explicit product policy and privacy review.  
3. Shared project memory needs RBAC.  
4. Operator break-glass access is audited.

---

## Retention and Deletion

Projects **shall** publish retention per layer and honor deletion requests. Backups follow privacy templates. Soft-delete with purge SLA is recommended for durable layers.

### Right-to-erasure / DSAR (pointers)

Align with project `PRIVACY_DATA_GOVERNANCE.md` (and [`RAG.md`](RAG.md) reindex notes):

- **Erasure:** retract/tombstone subject memory items; verify agents no longer retrieve them within SLA.  
- **Reindex / rebuild:** when memory-backed indexes exist, reindex after purge.  
- **DSAR export:** export path for subject-scoped durable memory where applicable.  

Do not expand privacy essays here—link the governing privacy doc.

---

## Contamination Controls

Harnesses and evals **shall** test:

- Cross-tenant read attempts  
- Prompt injection stored into session memory then replayed  
- Poisoned long-term preferences  
- Golden dataset leakage into memory ([`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md))  
- Stale facts beyond `expires_at` still being retrieved  

On contamination incidents: quarantine subject memories, rotate affected sessions, add regression cases ([`EVALS.md`](EVALS.md)).

---

## Tools

Memory tools follow [`TOOLS.md`](TOOLS.md). Typical pattern:

- `memory.read`  
- `memory.write`  
- `memory.promote` (privileged)  
- `memory.retract` (privileged)  

Wildcard filesystem memory is forbidden for production agents.

---

## Interaction with Loops

Inner loops use working/session memory ([`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md)). Loop failure states **should** not auto-promote. Successful user-confirmed preferences **may** promote.

---

## Example (CareerPilot) — Memory Scopes

Illustrative:

| Layer | Examples |
|-------|----------|
| Working | Current critique checklist, open schema errors |
| Session | Active resume draft ID, last retrieval bundle ID |
| Project | Workspace style guide pointer |
| Long-term | User-confirmed preferred target roles, approved employers list |
| Reference | Help center corpus + skills graph |

CareerPilot **must not** store unverified scraped employers into long-term person facts without promotion gates. ATS credentials never enter model memory layers.

---

## Anti-Patterns (Non-Conformant)

1. Dumping full chat history into every future prompt forever.  
2. Using memory as a substitute for versioned RAG corpora.  
3. Cross-tenant vector search “for personalization.”  
4. Silent long-term writes from speculative agents.  
5. Storing secrets in session notes.  
6. No expiry and no deletion path.  
7. Treating summaries as primary evidence over source documents.

---

## Compliance Checklist

- [ ] Agents declare memory scopes.  
- [ ] Layers implemented with TTL and ACL.  
- [ ] Durable items use structured contracts + provenance.  
- [ ] Long-term promotion gated.  
- [ ] Reference writes go through ingest, not chat.  
- [ ] Tenant isolation tested.  
- [ ] Retention/deletion documented.  
- [ ] Contamination evals exist.  
- [ ] Memory tools allowlisted and mediated.  
- [ ] Secrets barred from model memory stores.

---

## Change Control

Memory layer semantics and promotion policies **shall** follow MILE ([`../Governance/MILE.md`](../Governance/MILE.md)). Shared memory platforms **should** align with [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md).

---

## Conflict Resolution with RAG

When memory conflicts with retrieved documents: surface both; prefer reviewed user assertions for preferences; prefer documents for external facts; ask the user when material. Never silently overwrite document truth with inferred chat memory.

---

## Compaction Strategies

| Strategy | Use |
|----------|-----|
| Sliding window | Session turns |
| Hierarchical summary | Long projects |
| Key-value profile | Stable preferences |
| Episode logs | Auditable workflows |

Compaction jobs are versioned and evaluated for factual drift and secret leakage.

---

## Threat Model Highlights

| Threat | Mitigation |
|--------|------------|
| Prompt injection “store this forever” | Validate + quarantine + policy |
| Memory poisoning | Review gates; provenance |
| Cross-tenant bleed | Strict keys + tests |
| Stale wrong facts | TTL + conflict checks |
| Secret retention | Classifiers + deny lists |

---

## Example (CareerPilot) — Remember / Forget

- “Remember I prefer British spelling.” → project memory `spelling_locale=en-GB` after confirmation.  
- “Forget my previous target role.” → tombstone preference; verify retrieval no longer returns it.  
- Agents must not promote temporary JD paste into long-term memory without explicit ask.

---

## See Also (Sibling Index)

- [`RAG.md`](RAG.md) — reference corpora  
- [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) — typed durable facts  
- [`AGENTS.md`](AGENTS.md) — `memory_scopes`  
- [`TOOLS.md`](TOOLS.md) — memory tools  
- [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) — working memory in iterations  
- [`EVALS.md`](EVALS.md) — contamination and preference tests  
- [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) — leakage vs memory  
- [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) — faking memory offline  
- [`MODEL_ROUTING.md`](MODEL_ROUTING.md) — private memory routing  
- [`PROMPTS.md`](PROMPTS.md) — instructions not to invent memories  
- [`SUBAGENTS.md`](SUBAGENTS.md) — child memory isolation  
- [`AI_GUIDELINES.md`](AI_GUIDELINES.md) — HITL for durable personal facts  

---

## Revision History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-07-12 | Initial MES Memory; Reference knowledge footnote; erasure/DSAR pointers |
