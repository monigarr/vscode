# Agents — Team Patterns and Required Contracts

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All MoniGarr AI agent systems and multi-agent orchestrations  
**Canonical Path:** `AI/AGENTS.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Parts VI–VII, XX · [`../Governance/MILE.md`](../Governance/MILE.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`SUBAGENTS.md`](SUBAGENTS.md) · [`PROMPTS.md`](PROMPTS.md) · [`TOOLS.md`](TOOLS.md) · [`RAG.md`](RAG.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) · [`EVALS.md`](EVALS.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`MEMORY.md`](MEMORY.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

This standard defines how MoniGarr designs, documents, evaluates, and operates **agents** and **agent teams**. Agents are specialized workers with bounded tools and measurable outcomes—not unbounded “do anything” chat sessions.

Prefer **teams of small agents** over monolith agents. Prefer explicit contracts over implicit prompt folklore.

---

## Definitions

| Term | Meaning |
|------|---------|
| **Agent** | A named, versioned worker with purpose, inputs, outputs, tools, memory scope, evals, failure modes, escalation, and ownership |
| **Agent team** | A coordinated set of agents that share a goal, orchestration policy, and shared evaluation gates |
| **Coordinator** | The agent or orchestrator that routes work, enforces budgets, and escalates |
| **Monolith agent** | A single agent asked to plan, retrieve, write, critique, and ship without separation — discouraged |
| **Side effect** | Any write to systems of record, messaging, billing, identity, or production config |

---

## Design Principles

1. **Single responsibility.** One agent, one job.  
2. **Explicit I/O.** Structured inputs and outputs; prefer schemas over free text where possible.  
3. **Tool minimalism.** Only the tools required for the job.  
4. **Memory locality.** Access only the memory layers needed ([`MEMORY.md`](MEMORY.md)).  
5. **Evaluation ownership.** Every agent has acceptance metrics.  
6. **Fail closed.** On ambiguity or policy conflict, escalate.  
7. **Observable.** Every run emits traces: prompts, tools, tokens, scores.  
8. **Replaceable.** Agents can be swapped without rewriting the product surface.  

---

## Required Fields (Agent Contract)

Every production agent **shall** declare the following fields in version control (YAML, JSON Schema, or markdown table equivalent). Missing fields are non-conformant.

| Field | Description |
|-------|-------------|
| `id` | Stable unique identifier (`team.agent_name`) |
| `name` | Human-readable name |
| `version` | SemVer of the agent contract |
| `purpose` | One-paragraph mission; what success means |
| `owner` | Human owner / team |
| `risk_class` | R0–R4 per [`AI_GUIDELINES.md`](AI_GUIDELINES.md) |
| `inputs` | Schema or documented fields; required vs optional |
| `outputs` | Schema; include confidence and citations when factual |
| `tools_allowlist` | Exact tool IDs and versions permitted |
| `tools_denylist` | Explicit denials (optional but recommended) |
| `memory_scopes` | Working / session / project / long-term / reference |
| `retrieval_policy` | When RAG/graph is required before generation |
| `model_policy` | Router class or pinned model family ([`MODEL_ROUTING.md`](MODEL_ROUTING.md)) |
| `prompt_refs` | Versioned prompt IDs ([`PROMPTS.md`](PROMPTS.md)) |
| `evaluation` | Golden sets, thresholds, harness job IDs |
| `failure_modes` | Known failure classes and detection signals |
| `escalation_rules` | When and to whom/what to escalate |
| `budgets` | Max tokens, max tool calls, max wall time, max cost |
| `side_effect_class` | `read` \| `draft` \| `write` \| `irreversible` — canonical taxonomy in [`TOOLS.md`](TOOLS.md) / [`../GLOSSARY.md`](../GLOSSARY.md). Agents declare the **maximum** class they may exercise; promotion from `draft` to `write` is a distinct HITL step. `automated-write` (legacy wording) means `write` at R0/R1 only and **requires ADR**. |
| `observability` | Required log/trace fields |
| `dependencies` | Upstream agents, services, datasets |
| `changelog` | Pointer to agent change history |

### Contract Template

```yaml
id: example.team.writer
name: Example Writer
version: 1.2.0
purpose: Produce grounded draft documents from retrieved evidence.
owner: platform-ai@monigarr.com
risk_class: R2
inputs:
  required: [goal, audience, evidence_bundle_id]
  optional: [tone, length_budget]
outputs:
  schema: DraftDocumentV1
  includes: [citations, confidence, open_questions]
tools_allowlist: [rag.search.v3, graph.traverse.v2, docs.render.v1]
memory_scopes: [working, session, reference]
retrieval_policy: require_hybrid_rag_when_facts_claimed
model_policy: class.quality_balanced
prompt_refs: [prompts.writer.system.v4, prompts.writer.user.v4]
evaluation:
  golden_set: golden.writer.n100.v3
  thresholds: { groundedness: 0.90, rubric_pass: 0.85 }
failure_modes: [ungrounded_claim, overlong_output, citation_mismatch]
escalation_rules: [confidence_lt_0.7, conflicting_sources, budget_exceeded]
budgets: { max_tokens: 12000, max_tool_calls: 12, max_cost_usd: 0.75, max_seconds: 90 }
side_effect_class: draft
observability: [trace_id, prompt_versions, tool_spans, eval_scores]
```

---

## Agent Team Pattern

### Topology

```text
┌─────────────────────────────────────────────→
│                 Coordinator                  │
│  (routing, budgets, HITL, aggregation)       │
└───────────────┬─────────────────────────────┘
                │
    ┌───────────┼───────────┬───────────→
    ▼           ▼           ▼           ▼
 Planner    Retriever    Specialist   Critic
                │           │
                └─────┬─────┘
                      ▼
                  Evaluator
                      │
                      ▼
              Exporter / Adapter
```

### Team Roles (Normative Defaults)

Default team topology is defined in this document. [`SUBAGENTS.md`](SUBAGENTS.md) defines the **extended** delegation topology (including optional Research and Reasoner roles).

| Role | Responsibility |
|------|----------------|
| Coordinator | Accept goal, decompose, assign, enforce budgets, escalate |
| Planner | Produce ordered plan with dependencies and stop conditions |
| Retriever | Hybrid RAG / graph retrieval; return evidence bundles |
| Specialist | Domain-specific reasoning or generation (one specialty) |
| Critic | Adversarial review against rubric and policy |
| Evaluator | Score against golden criteria; gate progression |
| Exporter | Format outputs for downstream systems without inventing facts |

**Extended-only (optional):** Research and Reasoner appear in the extended delegation chain in [`SUBAGENTS.md`](SUBAGENTS.md); they are not required default team roles.

Projects may rename roles but must preserve separation of retrieval, generation, critique, and evaluation for R2+ workflows.

### Team Contract Fields

In addition to per-agent fields, teams shall declare:

- Shared goal schema  
- Shared glossary / ontology version  
- Shared evidence bundle format  
- Shared escalation channel  
- Shared cost and latency SLOs  
- Shared golden harness suite  

---

## Coordination Policies

### Routing

Coordinators should route by:

1. Intent classification (deterministic rules first, model second)  
2. Risk class  
3. Required tools and data domains  
4. Current budget remaining  

### Parallelism

Agents may run in parallel when tasks are independent and evidence does not conflict. Writers should not run before retrievers complete when facts are required.

### Handoffs

Handoffs shall be structured messages:

```json
{
  "from": "team.retriever",
  "to": "team.writer",
  "goal_id": "...",
  "evidence_bundle_id": "...",
  "constraints": ["cite_all_claims", "no_customer_send"],
  "open_questions": []
}
```

Free-text handoffs without IDs are discouraged for production teams.

---

## Sizing and Granularity

| Signal | Prefer |
|--------|--------|
| Prompt exceeds maintainability / frequent partial failures | Split agent |
| Agent needs more than ~8 tools | Split or introduce sub-agents |
| Eval failures cluster on one skill | Isolate that skill |
| Latency dominated by sequential over-decomposition | Merge carefully with ADR |

Monolith agents that “do the whole product” are non-conformant for R2+ customer workflows unless an ADR justifies temporary exception with a split plan.

---

## Example (CareerPilot) — Career Team

The following is illustrative only.

### Team Goal

Help a user improve career materials and preparation through grounded, reviewable drafts—never silent auto-submit of applications.

### Agents

| Agent ID | Purpose | Risk | Side effects |
|----------|---------|------|--------------|
| `career.coordinator` | Route user goals to specialists; enforce HITL | R2 | none |
| `career.planner` | Break goals into resume/JD/interview steps | R1 | none |
| `career.retriever` | Retrieve user profile, prior drafts, JD evidence | R1 | read-only |
| `career.resume_specialist` | Draft resume sections from evidence | R2 | `draft` |
| `career.interview_specialist` | Draft interview practice Q&A | R1 | `draft` |
| `career.critic` | Check tone, truthfulness, policy | R2 | none |
| `career.evaluator` | Score against golden resume/interview sets | R1 | none |
| `career.exporter` | Export drafts to user-owned formats | R2 | `write` |

### Flow

```mermaid
flowchart LR
  U[User Goal] --> C[Coordinator]
  C --> P[Planner]
  P --> R[Retriever]
  R --> S[Resume Specialist]
  S --> K[Critic]
  K --> E[Evaluator]
  E -->|pass| X[Exporter]
  E -->|fail| S
  X --> H[Human Approve]
  H --> Out[User Receives Draft]
```

### Non-Goals for the Example

- Auto-submitting job applications  
- Inventing employment history  
- Guaranteeing offers or salary outcomes  

---

## Lifecycle

1. **Propose** agent contract + owner  
2. **Implement** prompts, tools, memory scopes  
3. **Golden** create/extend datasets ([`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md))  
4. **Harness** wire continuous gates ([`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md))  
5. **Shadow** run offline or shadow traffic  
6. **HITL pilot** limited production with approvals  
7. **Promote** after thresholds hold  
8. **Observe** and loop-improve ([`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md))  
9. **Retire** with deprecation notice and traffic drain  

---

## Versioning and Change Control

- Contract SemVer: **MAJOR** for I/O or side-effect changes; **MINOR** for new optional fields/tools; **PATCH** for clarifications.  
- Prompt changes that alter behavior require eval re-run even if contract PATCH.  
- Tool allowlist expansions require security review for R2+.  
- Breaking changes need migration notes for coordinators and harnesses.  

---

## Observability Requirements

Every agent run shall emit at least:

- `trace_id` / `span_id`  
- `agent_id` + `agent_version`  
- `prompt_refs`  
- `model_route`  
- token and cost metrics  
- tool call summary  
- eval scores (when evaluated)  
- escalation events  
- final status (`success`, `fail`, `escalate`, `budget_stop`)  

---

## Testing Requirements

| Layer | Requirement |
|-------|-------------|
| Contract validation | Schema validates in CI |
| Unit | Tool stubs; pure transformers |
| Golden | N≥ representative set for the agent skill |
| Team integration | Multi-agent happy path + failure injection |
| Safety | Prompt injection / tool abuse cases |
| Budget | Enforce max tokens/cost in harness |

---

## Anti-Patterns

- One mega-agent with thirty tools  
- Hidden side effects not listed in contract  
- Shared mutable global memory without lifecycle  
- Critic and writer as the same prompt pass without separation for R2+  
- “Team” that is only sequential prompts with no coordinator budgets  
- Product-specific hardcoding inside MES (use Example labels)  

---

## Conformance Checklist

- [ ] Every production agent has the required fields  
- [ ] Teams separate retrieve / generate / critique / evaluate for R2+  
- [ ] Allowlists and budgets enforced in code, not only in prose  
- [ ] Golden evals and harness jobs exist  
- [ ] Ownership and escalation paths are named  
- [ ] Observability fields are present in production traces  

---

## Registry and Discovery

Production agents should appear in a registry (YAML/JSON/DB) queryable by id, owner, risk class, and eval suite. Orchestrators load contracts from the registry—not from ad-hoc prompt strings in application code.

Registry entries include health: `active`, `deprecated`, `disabled`. Deprecated agents serve traffic only with warnings and an expiry.

---

## Communication Protocols

Prefer schema-validated messages between agents. If natural language bridges are required, wrap them with parsers and repair loops. Log both raw and parsed forms when debugging.

---

## Idempotency and Exactly-Once Side Effects

When teams perform writes: pass idempotency keys through coordinators to tools; treat at-least-once delivery as default on retries; make exporters safe under duplicate calls.

---

## Example (CareerPilot) — Coordinator Pseudopolicy

```text
if intent == tailor_resume:
  require retrieval before writer
  forbid mail.send on allowlist
  require evaluator before exporter
  require user HITL before external share
elif intent == interview_practice:
  risk R1; critic for illegal questions
else:
  escalate
```

---

## Capacity and Backpressure

Coordinators apply queue limits and reject or degrade when concurrency exceeds budget. Fan-out without backpressure is an availability risk.

---

## Change Control

Agent contract schema and team topology defaults **shall** follow MILE ([`../Governance/MILE.md`](../Governance/MILE.md)). Shared orchestration platforms **should** align with [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md).

---

## See Also (Sibling Index)

- [`SUBAGENTS.md`](SUBAGENTS.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`TOOLS.md`](TOOLS.md) · [`PROMPTS.md`](PROMPTS.md) · [`EVALS.md`](EVALS.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`MEMORY.md`](MEMORY.md) · [`RAG.md`](RAG.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md)

---

## Revision History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-07-12 | Initial MES Agents standard |
