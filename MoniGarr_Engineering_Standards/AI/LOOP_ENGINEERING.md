# Loop Engineering — Iterative Agent Loops, Stop Conditions, and Improvement Cycles

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All MoniGarr AI workflows that iterate (retrieve–generate–critique, plan–act–observe, eval-driven improvement)  
**Canonical Path:** `AI/LOOP_ENGINEERING.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Parts VI–VII · [`../Governance/MILE.md`](../Governance/MILE.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`AGENTS.md`](AGENTS.md) · [`SUBAGENTS.md`](SUBAGENTS.md) · [`PROMPTS.md`](PROMPTS.md) · [`TOOLS.md`](TOOLS.md) · [`RAG.md`](RAG.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) · [`EVALS.md`](EVALS.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`MEMORY.md`](MEMORY.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

Loops create power and risk. This standard defines allowed loop topologies, budgets, stop conditions, oscillation controls, human checkpoints, and the outer engineering loop that turns eval failures into durable fixes. Unbounded loops are non-conformant.

Agent topology: [`AGENTS.md`](AGENTS.md).  
Harness execution of loops: [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md).

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
| **Inner loop** | Runtime iteration inside one task (e.g., critique → revise) |
| **Outer loop** | Engineering cycle: observe → hypothesize → change → eval → promote |
| **Stop condition** | Deterministic rule that ends a loop |
| **Budget** | Caps on iterations, tokens, tools, time, cost |
| **Oscillation** | Alternating outputs without progress |
| **Progress signal** | Metric proving iteration improved the artifact |
| **HITL checkpoint** | Mandatory human gate inside or after a loop |

---

## Design Principles

1. **Budgets first.** Every loop declares caps before prompts.  
2. **Progress or stop.** No iteration without a measurable signal.  
3. **Separate roles.** Critic and writer should not be the same unbounded self-chat.  
4. **Fail closed.** Ambiguity and policy conflict escalate.  
5. **Prefer deterministic checks** before model opinion.  
6. **Record the transcript** of loop decisions for audit.  
7. **Outer loop owns learning**; inner loop owns task refinement.

---

## Approved Inner Loop Patterns

### Retrieve → Generate → Critique → (Revise)

Default for R1+ factual generation. Retrieval precedes first draft ([`RAG.md`](RAG.md)).

### Plan → Act → Observe

For tool-using agents. Each act is an allowlisted tool call ([`TOOLS.md`](TOOLS.md)).

### Decompose → Fan-out → Fan-in

For sub-agents ([`SUBAGENTS.md`](SUBAGENTS.md)). Fan-in must reconcile conflicts.

### Evaluate → Repair (Harness)

Offline repair loops run only in non-prod harnesses unless explicitly designed as safe online self-healing with caps.

---

## Required Loop Contract Fields

| Field | Requirement |
|-------|-------------|
| `loop_id` | Stable ID |
| `topology` | Pattern name |
| `max_iterations` | Hard int |
| `max_tool_calls` | Hard int |
| `max_tokens` / `max_cost_usd` / `max_seconds` | Hard caps |
| `stop_conditions` | Explicit list |
| `progress_signal` | How improvement is detected |
| `oscillation_detector` | Enabled policy |
| `escalation` | Where to go on stop-fail |
| `side_effect_class` | Maximum class the loop may exercise: `read` \| `draft` \| `write` \| `irreversible` ([`TOOLS.md`](TOOLS.md)) |
| `memory_writes` | Which layers may update ([`MEMORY.md`](MEMORY.md)) |

Missing caps are non-conformant.

---

## Stop Conditions (Normative Defaults)

Loops **shall** stop when any of the following hold:

1. Iteration budget exhausted.  
2. Cost/time/token budget exhausted.  
3. Critic/eval score ≥ pass threshold.  
4. Deterministic validators pass (schema, policy lint).  
5. Empty retrieval with refuse/clarify policy triggered.  
6. Conflicting evidence unresolved after N attempts.  
7. Unauthorized tool or policy violation attempted.  
8. Oscillation detected.  
9. Human abort / HITL reject.  

“Model says it’s done” is **not** a sufficient stop condition alone for R2+.

---

## Progress Signals

Acceptable signals include:

- Rubric or metric score delta  
- Schema error count decreasing  
- Groundedness rising  
- Failing checklists shrinking  
- Tool errors resolved  

Unacceptable: longer prose, more confident tone, or more bullet points without metric movement.

If no progress across two iterations, the loop **should** stop and escalate.

---

## Oscillation and Divergence Controls

Orchestrators **must** detect:

- Near-duplicate outputs alternating  
- Flip-flopping factual claims without new evidence  
- Repeated identical tool calls  

On detection: stop, snapshot state, escalate. Infinite self-critique is forbidden.

---

## Side Effects Inside Loops

| Iteration phase | Side effects |
|-----------------|--------------|
| Explore / draft | `read` / `draft` only |
| Final commit | `write` only after stop success + HITL if required |
| Failed stop | No opportunistic writes |

Loops **shall not** publish intermediate drafts as final because a later iteration “might” fix them.

---

## HITL Placement

Per [`AI_GUIDELINES.md`](AI_GUIDELINES.md):

- R2+ material writes (`write` side-effect class): HITL after loop success, before commit.  
- **Dual-control rule (canonical):** required for **R4 workflows**, and for **`irreversible` side-effect class at R3+**. Loops cannot auto-approve either case. See [`AI_GUIDELINES.md`](AI_GUIDELINES.md) and [`TOOLS.md`](TOOLS.md).  
- Humans may also inject mid-loop guidance; such guidance is logged.

---

## Outer Engineering Loop

The durable improvement cycle:

```text
Production/harness signal
        ↓
Triage failure class
        ↓
Add/adjust golden case
        ↓
Fix prompt / tool / retrieval / routing / code
        ↓
Run suites (EVALS + HARNESS)
        ↓
Promote with changelog
        ↓
Monitor online
```

Outer loops **shall** prefer systemic fixes over one-off manual patching of customer artifacts.

Engineers **must not** “fix” production by endlessly re-running inner loops without dataset or code changes when failures repeat.

---

## Memory and Loops

Inner loops **may** write working/session memory. Long-term memory writes **shall** follow [`MEMORY.md`](MEMORY.md) promotion rules—no automatic promotion of speculative critique notes to durable facts.

---

## Model Routing Inside Loops

Cheap/fast models **may** draft; higher-quality or specialized models **should** critique or finalize when risk warrants ([`MODEL_ROUTING.md`](MODEL_ROUTING.md)). Router decisions are part of the loop trace.

---

## Example (CareerPilot) — Resume Critique Loop

Illustrative contract:

```yaml
loop_id: career.resume.critique_revise
topology: retrieve_generate_critique_revise
max_iterations: 3
max_tool_calls: 8
max_seconds: 120
max_cost_usd: 0.80
progress_signal: rubric_score_and_schema_errors
stop_conditions:
  - rubric_pass_gte_0.85_and_schema_valid
  - no_progress_twice
  - budget_exhausted
  - invented_employer_detected
side_effect_class: draft
```

CareerPilot **must not** auto-submit to ATS from inside the revise loop.

---

## Observability

Each iteration **shall** log:

- Iteration index  
- Scores / validator results  
- Tool calls  
- Budget remaining  
- Stop reason  

Traces enable both debug and eval mining for new goldens ([`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md)).

---

## Anti-Patterns (Non-Conformant)

1. `while True` agent loops without caps.  
2. Critic that always demands another pass.  
3. Writing to production on iteration 1 “to save time.”  
4. Ignoring oscillation because the prose looks busy.  
5. Using outer-loop learning only in a human’s head—no golden case.  
6. Nested loops that multiply budgets without a global ceiling.  
7. Stopping solely because the model output the word “DONE.”

---

## Compliance Checklist

- [ ] Every production loop has a versioned contract with hard caps.  
- [ ] Stop conditions include budgets, success, refuse, oscillation, policy.  
- [ ] Progress signals are metric-based.  
- [ ] Side effects deferred until successful stop + HITL as required.  
- [ ] Nested loops respect global budgets.  
- [ ] Traces include iteration-level scores and stop reasons.  
- [ ] Outer loop adds goldens for recurring failures.  
- [ ] ATS/publish/commit actions outside inner draft loops.  
- [ ] Memory promotion rules respected.  
- [ ] ADR exists for any non-default topology.

---

## Change Control

New loop topologies affecting side effects or risk **shall** follow MILE ([`../Governance/MILE.md`](../Governance/MILE.md)). Shared orchestrators **should** align with [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md).

---

## Loop Topologies (Expanded)

### Single Candidate Refine

One draft refined until thresholds or stop—default for most writers.

### Tournament

Generate N budgeted drafts → score → keep top M → critique/repair survivors → final compare. Use when variance is high and cost allows.

### Retrieve-Refresh

When critique cites missing evidence: re-retrieve before repair. Do not invent facts to close gaps.

### Planner-Replan

If evaluator fails on plan feasibility, return to planner with a failure packet—bounded by max replans.

---

## Scoring Semantics

Declare absolute gates, relative improvement deltas, or lexicographic ordering (safety → groundedness → style). Lexicographic ordering prevents style polish from masking safety failures.

| Category | Handling |
|----------|----------|
| Safety critical | Hard fail; escalate |
| Schema invalid | Repair once; then fail |
| Soft rubric | Continue until stagnation |
| Cost | Soft warn then hard stop |

---

## Failure Taxonomy

| Code | Meaning | Next action |
|------|---------|-------------|
| `LOOP_STAGNANT` | Score delta too small | Stop; return best |
| `LOOP_BUDGET` | Cost/time/token hit | Stop; escalate |
| `LOOP_SAFETY` | Critical finding | Escalate HITL |
| `LOOP_EMPTY_EVIDENCE` | Retrieval empty | Ask user / fail closed |
| `LOOP_TOOL` | Tool failures | Retry policy then escalate |

---

## Example (CareerPilot) — Interview Coach Loop

Retrieve JD + background → draft questions → critic for relevance/legality → repair illegal items first → rescore ≤3 iterations → user reviews; never auto-send to employers.

---

## Revision History

| Date | MES | Change |
|------|-----|--------|
| 2026-07-12 | 1.1.0 | Revision history; side_effect_class + dual-control aligned in P0 (P3 longevity). |

---

## See Also (Sibling Index)

- [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) — executing and profiling loops  
- [`EVALS.md`](EVALS.md) — scoring progress and gates  
- [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) — capturing loop failures  
- [`AGENTS.md`](AGENTS.md) — coordinator budgets  
- [`SUBAGENTS.md`](SUBAGENTS.md) — nested delegation limits  
- [`TOOLS.md`](TOOLS.md) — tool call caps  
- [`MEMORY.md`](MEMORY.md) — working memory in iterations  
- [`MODEL_ROUTING.md`](MODEL_ROUTING.md) — draft vs critique models  
- [`RAG.md`](RAG.md) — retrieve-before-generate  
- [`PROMPTS.md`](PROMPTS.md) — critique prompts  
- [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) — iterative linking  
- [`AI_GUIDELINES.md`](AI_GUIDELINES.md) — HITL  
