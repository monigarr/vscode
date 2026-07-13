# Sub-Agents — Delegation Trees and Specialized Workers

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All MoniGarr multi-agent systems using delegated specialists  
**Canonical Path:** `AI/SUBAGENTS.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Parts VI–VII · [`../Governance/MILE.md`](../Governance/MILE.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`AGENTS.md`](AGENTS.md) · [`PROMPTS.md`](PROMPTS.md) · [`TOOLS.md`](TOOLS.md) · [`RAG.md`](RAG.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) · [`EVALS.md`](EVALS.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`MEMORY.md`](MEMORY.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

This document defines the **extended delegation topology** for sub-agent systems. Default team roles live in [`AGENTS.md`](AGENTS.md). Research and Reasoner are **extended** roles (optional specialists in the delegation chain below)—not normative defaults of the default team topology.

Sub-agents are narrowly scoped workers invoked by a parent agent or coordinator to perform one responsibility well. This standard defines delegation trees, handoff contracts, depth limits, and evaluation expectations for sub-agent systems.

Parent standard for team topology: [`AGENTS.md`](AGENTS.md).  
Authority and HITL: [`AI_GUIDELINES.md`](AI_GUIDELINES.md).

---

## Definitions

| Term | Meaning |
|------|---------|
| **Parent agent** | Agent that delegates work and remains accountable for aggregation |
| **Sub-agent** | Child worker with a narrower contract than its parent |
| **Delegation tree** | Directed acyclic graph of parent→child invocations for a goal |
| **Leaf agent** | Sub-agent that does not further delegate |
| **Fan-out** | Parallel delegation to multiple children |
| **Fan-in** | Aggregation of child results by the parent |

---

## When to Use Sub-Agents

Use sub-agents when:

- A skill is reusable across teams  
- Evaluation quality improves when isolated  
- Tools or data domains differ sharply  
- Parallelism reduces latency without raising risk class  
- Failure modes cluster in one specialty  

Do **not** use sub-agents when:

- The task is a single deterministic transform  
- Delegation would exceed latency/cost budgets without quality gain  
- The child would need the parent’s full tool set (that is a refactor smell)  

---

## Canonical Delegation Tree

**Extended chain** for complex cognitive work (optional specialists). Default team roles remain in [`AGENTS.md`](AGENTS.md). Research and Reasoner appear here only — they are **not** normative defaults of the default team topology.

```text
Coordinator
  └─ Planner
       ├─ Research
       │    └─ Retriever
       ├─ Reasoner
       ├─ Writer
       ├─ Critic
       ├─ Evaluator
       └─ Exporter
```

Projects may omit unused stages but shall not skip **Retriever** before factual generation or **Evaluator** before R2+ publish.

### Role Specs

| Sub-agent | Inputs | Outputs | Must not |
|-----------|--------|---------|----------|
| Planner | Goal, constraints | Ordered plan, stop conditions | Invent facts as evidence |
| Research | Plan step, questions | Candidate sources / queries | Write customer-facing prose |
| Retriever | Queries, filters | Evidence bundle + provenance | Fabricate documents |
| Reasoner | Evidence + question | Structured conclusions + uncertainty | Hide missing evidence |
| Writer | Brief + evidence | Draft artifact | Publish externally |
| Critic | Draft + rubric | Findings, severity, fix requests | Silently rewrite as final |
| Evaluator | Artifact + golden criteria | Scores, pass/fail, failing cases | Override HITL |
| Exporter | Approved artifact | Downstream format | Change semantic content |

---

## Delegation Contract

Every parent→child call shall include:

```yaml
delegation:
  parent_id: team.coordinator
  child_id: team.retriever
  goal_id: uuid
  objective: "Retrieve JD requirements and user skill evidence"
  input_ref: evidence://session/abc/input
  constraints:
    - read_only
    - max_cost_usd: 0.20
    - max_seconds: 30
  success_criteria:
    - "Return top evidence with citations"
    - "Flag conflicts"
  on_failure: escalate_to_parent
  depth: 2
```

### Depth Limits

| Risk class | Max delegation depth | Notes |
|------------|----------------------|-------|
| R0–R1 | 4 | Soft limit; log warnings above 3 |
| R2 | 3 | Prefer shallow trees |
| R3–R4 | 2 | Deep trees need ADR |

Infinite or cyclic delegation is forbidden. Orchestrators shall detect cycles and abort.

---

## Fan-Out / Fan-In Rules

1. Children in a fan-out must have non-overlapping write targets.  
2. Parents merge using deterministic aggregation rules first (concat, vote, rank), models second.  
3. Conflicting factual claims shall not be silently averaged; mark conflict.  
4. Budget is split explicitly; children must not overshare a global unlimited pool.  

### Aggregation Patterns

| Pattern | Use |
|---------|-----|
| Concatenate + dedupe | Independent research snippets |
| Ranked merge | Multiple retrieval channels |
| Majority / weighted vote | Classification sub-agents |
| Critic gate | Quality control before export |
| Tournament | Multiple draft candidates → pick winner by eval score |

---

## Example (CareerPilot) — Resume Agent Delegation Tree

Illustrative only.

```text
career.resume_parent
  ├─ career.resume.planner
  ├─ career.resume.retriever          # profile, prior resume, JD
  ├─ career.resume.skills_mapper      # graph: person→skill→job
  ├─ career.resume.section_writer     # leaf writers per section
  │    ├─ summary_writer
  │    ├─ experience_writer
  │    └─ skills_writer
  ├─ career.resume.critic
  ├─ career.resume.evaluator          # golden resume N=100 subset
  └─ career.resume.exporter          # DOCX/PDF/Markdown draft
```

### Resume Sub-Agent Contracts (Excerpt)

| Sub-agent | Purpose | Tools | Eval focus |
|-----------|---------|-------|------------|
| `skills_mapper` | Map person skills to JD requirements via graph | `graph.traverse`, `rag.search` | Coverage of required skills; no invented skills |
| `experience_writer` | Rewrite experience bullets grounded in evidence | none beyond render | Factuality vs source bullets |
| `critic` | Detect inflation, gaps, policy issues | rubric tools | Precision of defect findings |
| `evaluator` | Score draft vs golden rubrics | harness hooks | Threshold stability |

### Forbidden in this Example

- Fabricating employers, degrees, or dates  
- Auto-submitting applications  
- Promoting a draft that fails groundedness threshold  

---

## Isolation and Privilege

Sub-agents inherit **only** the privileges explicitly granted by the parent for that call. Defaults:

- No network beyond allowlisted tools  
- No production writes unless `side_effect_class` permits and HITL satisfied  
- No access to other tenants’ memory scopes  
- No ability to modify their own allowlist  

Parents remain accountable for child side effects.

---

## Memory and Context Passing

Prefer passing **references** (evidence bundle IDs, artifact IDs) over dumping full histories into every child prompt.

| Pass | Prefer | Avoid |
|------|--------|-------|
| Evidence | Bundle ID + top citations | Entire corpus paste |
| Prior draft | Versioned artifact ID | Unversioned clipboard text |
| User prefs | Project memory keys | Secrets / raw tokens |
| Critic findings | Structured issue list | Vague “make it better” |

See [`MEMORY.md`](MEMORY.md) and [`RAG.md`](RAG.md).

---

## Evaluation of Sub-Agents

Each sub-agent needs its own golden slice even if the parent has a team suite.

| Level | What to evaluate |
|-------|------------------|
| Leaf | Skill correctness in isolation |
| Subtree | Parent+children integration |
| Team | End-to-end user goal |
| Safety | Injection via child boundaries |

A parent must not be promoted if a critical child regresses, even if end-to-end “looks fine” on a few demos.

---

## Failure Handling

```text
Child fails → classify (timeout | validation | policy | quality | budget)
  → retry if idempotent and within retry policy
  → else degrade (partial result + flags) OR escalate
  → parent records failure in trace
  → evaluator may hard-fail the goal
```

Children must not hide failures inside fluent prose. Structured error objects are required.

---

## Observability

Delegation spans shall nest:

```text
parent.span
  child.span
    tool.span
```

Required attributes: `parent_agent_id`, `child_agent_id`, `depth`, `delegation_objective`, `budget_remaining`.

---

## Testing Checklist

- [ ] Contract schema validation for each sub-agent  
- [ ] Depth and cycle guards unit-tested  
- [ ] Fan-out budget splits tested  
- [ ] Conflict aggregation tested  
- [ ] Golden sets per critical leaf  
- [ ] Failure injection (child timeout, empty retrieval, critic hard-fail)  
- [ ] Privilege isolation tests (child cannot call denied tools)  

---

## Anti-Patterns

- Sub-agent that re-implements the coordinator  
- Unbounded recursive “research more” loops  
- Passing the entire conversation to every leaf  
- Critic that always rewrites instead of reporting  
- Evaluating only the parent and never the leaves  
- Deep trees for R4 actions without ADR  

---

## Conformance Checklist

- [ ] Delegation uses structured contracts  
- [ ] Depth limits enforced by risk class  
- [ ] Retrieve-before-generate preserved  
- [ ] Children least-privilege  
- [ ] Nested tracing enabled  
- [ ] Leaf and parent evals both exist for R2+  

---

## Delegation State Machine

Parents should model delegation as explicit states:

`idle → planning → delegating → aggregating → evaluating → done/escalated`

Side effects only in states that allow them. User cancelation transitions to `canceled` and aborts in-flight children when the platform supports it.

---

## Shared Libraries of Sub-Agents

Platform teams may publish reusable sub-agents (retriever, critic, schema validator). Consumers pin versions. Breaking changes follow SemVer. Shared does not mean unowned—each reusable sub-agent still declares an owner.

---

## Budget Inheritance Algorithm (Normative Guidance)

```text
parent_budget_remaining
child_allocation = min(child_request, parent_remaining * weight)
parent_remaining -= actual_child_spend
```

Weights are declared in the plan. Children that overrun are terminated; parents decide degrade vs escalate.

---

## Debugging Delegation Trees

Required debug affordances: visualize tree for a `goal_id`, show per-node costs and scores, replay a child with stubs, and export a failure packet for humans. Without these, multi-agent systems become unmaintainable.

---

## Change Control

Delegation depth defaults and shared sub-agent contracts **shall** follow MILE ([`../Governance/MILE.md`](../Governance/MILE.md)). Platform orchestration **should** align with [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md).

---

## See Also (Sibling Index)

- [`AGENTS.md`](AGENTS.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`TOOLS.md`](TOOLS.md) · [`EVALS.md`](EVALS.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`MEMORY.md`](MEMORY.md) · [`RAG.md`](RAG.md) · [`PROMPTS.md`](PROMPTS.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md)

---

## Revision History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-07-12 | Initial MES Sub-Agents standard |
