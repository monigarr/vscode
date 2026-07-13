# Model Routing — Classes, Policies, Fallbacks, and Cost/Quality Control

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All MoniGarr systems that select, pin, or fall back across foundation models and specialized models  
**Canonical Path:** `AI/MODEL_ROUTING.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Parts III, VI–VII · [`../Governance/MILE.md`](../Governance/MILE.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`AGENTS.md`](AGENTS.md) · [`SUBAGENTS.md`](SUBAGENTS.md) · [`PROMPTS.md`](PROMPTS.md) · [`TOOLS.md`](TOOLS.md) · [`RAG.md`](RAG.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) · [`EVALS.md`](EVALS.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`MEMORY.md`](MEMORY.md) · [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md) · [`../GLOSSARY.md`](../GLOSSARY.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

Model routing chooses the right model class for a job under quality, latency, cost, privacy, and risk constraints. This standard defines router classes, policy tables, pinning, fallbacks, evaluation, and forbidden patterns. Hard-coding a single vendor model across all tasks without policy is discouraged; silent auto-upgrades without evals are non-conformant.

Prompts remain versioned separately ([`PROMPTS.md`](PROMPTS.md)).  
Agents declare `model_policy` ([`AGENTS.md`](AGENTS.md)).

---

## Model Gateway (Normative)

The **Model Gateway** is the sole production egress for model inference and embeddings under MES ([`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) §3.2 · [`../GLOSSARY.md`](../GLOSSARY.md) **Model Gateway**).

Routing policy **shall** execute **inside or through** the Model Gateway. Agents, services, and tools **shall not** call provider SDKs directly on production paths.

| Requirement | Shall |
|-------------|-------|
| Sole egress | All production inference/embeddings via Model Gateway |
| Classification | ClassificationEnforcer (or equivalent) resolves sensitivity/residency before egress when labels apply |
| AuthZ / budgets | Gateway enforces allowlists, budgets, timeouts, and logging |
| Traceability | Traces include `gateway_request_id` correlating product → agent → model call |
| Offline / batch | Documented jobs **shall** apply equivalent policy, logging, and residency controls |
| Tool vs model | Tool Gateway mediates tools ([`TOOLS.md`](TOOLS.md)); Model Gateway mediates models — neither bypasses the other |

MCP servers and other tool transports do **not** authorize direct provider model calls.

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
| **Model class** | Abstract capability tier (e.g., `class.fast_cheap`) |
| **Provider model** | Concrete vendor model ID |
| **Router** | Policy that maps request context → model class → provider model |
| **Pin** | Immutable binding used in a harness or production pointer |
| **Fallback** | Ordered alternate when primary fails policy checks |
| **Shadow route** | Parallel call for comparison without user-visible effect |
| **Affinity** | Sticky routing for a session when required for consistency |

---

## Design Principles

1. **Route by job, not by hype.**  
2. **Abstract classes over vendors** in agent contracts.  
3. **Pin for gates; float only inside a class with eval cover.**  
4. **Fallback safely**—degrade capability, not safety.  
5. **Measure cost and quality together.**  
6. **Privacy residency matters**—data locality can veto a route.  
7. **Deterministic rules first**, model-based routing second.

---

## Standard Model Classes

Projects **shall** map concrete models into classes. Names may extend this set via ADR.

| Class | Intent | Typical use |
|-------|--------|-------------|
| `class.fast_cheap` | Low latency/cost | Classification, routing, simple rewrites |
| `class.quality_balanced` | Default generation | Drafts, summaries with RAG |
| `class.quality_max` | Hard reasoning | Complex plans, difficult critique |
| `class.code_specialist` | Code tasks | Coding agents |
| `class.judge` | Evaluation scoring | LLM-as-judge (calibrated) |
| `class.embed` | Embeddings | RAG dense index |
| `class.rerank` | Reranking | RAG stage 4 |
| `class.multimodal` | Image/audio inputs | When in scope |
| `class.local_private` | High-sensitivity; local/private runtime family | Restricted data (parent class) |
| `class.private_onprem` | Subclass of local_private | On-prem / VPC-isolated inference |
| `class.sovereign_cloud` | Subclass of local_private | Region-/sovereignty-constrained approved cloud |

`class.local_private` remains valid as the umbrella class. Prefer subclasses (`class.private_onprem`, `class.sovereign_cloud`) when residency or tenancy policy must distinguish them. Agents **should** reference classes, not raw provider IDs, in contracts.

---

## Routing Policy Table

Routers **shall** be versioned tables (or equivalent) listing:

```yaml
routing_table_id: routing.v3
rules:
  - match: { agent_role: critic, risk_class: [R2, R3, R4] }
    class: class.quality_max
  - match: { task: embed }
    class: class.embed
  - match: { sensitivity: restricted }
    class: class.local_private  # or class.private_onprem / class.sovereign_cloud per residency
  - match: { default: true }
    class: class.quality_balanced
fallbacks:
  class.quality_max: [class.quality_balanced]
  class.quality_balanced: [class.fast_cheap]
constraints:
  disallow_fallback_across_privacy_boundary: true
  safety_class_floor: class.quality_balanced  # example floor for R2 generate
```

### Match Dimensions (Recommended)

- Agent role / prompt family  
- Risk class  
- Task type (generate, classify, judge, embed, rerank)  
- Sensitivity / residency  
- Latency SLO class  
- Cost budget remaining  
- Tool-heavy vs prose-only  

---

## Pinning vs Floating

| Context | Rule |
|---------|------|
| Offline release gates | Pin provider model IDs |
| Production pointers | Pin or pin-within-class with evaluated candidates |
| Dev experimentation | Float allowed in non-prod |
| Emergency hotfix | Pin + expedited eval; no silent vendor “latest” |

Automatic major model upgrades **must** pass suites ([`EVALS.md`](EVALS.md)) before production pointer moves.

---

## Fallback Rules

Fallbacks **must**:

1. Preserve safety constraints (privacy boundary, tool policy).  
2. Be ordered and finite.  
3. Emit telemetry when triggered.  
4. Avoid infinite fallback loops.  
5. Refuse rather than route to an unsafe cheaper model for R2+ factual advice when policy requires a floor.

Fallback that strips retrieval or HITL requirements is forbidden.

---

## Draft / Critique Split

Loops **should** use cheaper classes for drafts and stronger classes for critique/finalize when cost-efficient ([`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md)). Both routes remain in traces.

---

## Privacy and Residency

Routing **shall** consult data sensitivity:

- Restricted data → approved private/local classes only.  
- Customer content may require region-locked providers.  
- Logs of prompts/responses follow retention and redaction policy.

A quality win does not override residency vetoes.

---

## Evaluation of Routers

Router changes **shall** evaluate:

- Task success vs prior table  
- Safety metrics unchanged or better  
- Cost per success  
- Latency SLOs  
- Fallback rate  
- Cross-class confusion (wrong class chosen)  

Golden router cases live under [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) (intent → expected class).

Shadow routes **may** compare candidates before promotion.

---

## Observability

Every model call **shall** log:

- `routing_table_id`  
- Matched rule ID  
- Model class  
- Provider model ID  
- Fallback depth  
- Token/cost/latency  
- Sensitivity decision  

---

## Anti-Patterns (Non-Conformant)

1. `model: latest` in production.  
2. One mega-model for embed, judge, and generate.  
3. Falling back to public cloud for restricted data.  
4. Changing provider mid-session without affinity policy when consistency required.  
5. Router ML that cannot be audited or pinned.  
6. Cost optimization that disables citation/RAG requirements.  
7. Shipping new vendor models because of a blog post without harness PASS.

---

## Example (CareerPilot) — Class Mapping

Illustrative:

| Job | Class |
|-----|-------|
| Intent classify inbound | `class.fast_cheap` |
| Resume draft | `class.quality_balanced` |
| Resume critic | `class.quality_max` |
| Job embedding | `class.embed` |
| Match rerank | `class.rerank` |
| Offline judge | `class.judge` (calibrated) |
| Restricted enterprise profile fields | `class.local_private` / `class.private_onprem` if configured |

CareerPilot **must not** route ATS-submit decisioning to a cheap classifier that bypasses HITL—routing does not replace governance.

---

## Compliance Checklist

- [ ] Agents reference model classes in contracts.  
- [ ] Versioned routing table with owners.  
- [ ] Pins used for release gates.  
- [ ] Fallbacks finite, safe, telemetered.  
- [ ] Privacy/residency vetoes enforced.  
- [ ] Router goldens and cost/quality evals exist.  
- [ ] Traces include class and provider IDs.  
- [ ] No silent latest upgrades.  
- [ ] Draft/critique split considered for loops.  
- [ ] ADR for new classes or providers.

---

## Change Control

New providers, classes, and fallback floors **shall** follow MILE ([`../Governance/MILE.md`](../Governance/MILE.md)). Platform routing services **should** align with [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md).

---

## Mapping Config Versioning

Store class mappings as versioned config with `mapping_version`, primary/fallback model pins, and a required eval suite before promotion. Every product call trace **shall** record `mapping_version` and resolved model IDs.

---

## Adaptive Routing (Optional)

Adaptive routers may escalate class when critic findings remain high-severity after N repairs, JSON mode fails repeatedly on `class.fast`, or retrieval confidence is high but generation quality is low. Adaptive behavior must still respect budgets and be feature-flagged.

**Production:** enabling adaptive routing in production **shall** require an ADR plus a documented **shadow period** (compare adaptive vs pinned table offline/shadow before cutover). Skipping shadow for R1+ is non-conformant without explicit risk acceptance.

---

## Provider Health and Load Shedding

Gateway monitors error rates, latency, rate-limit signals, and cost anomalies. On degradation: shift to fallbacks, shed non-critical traffic, or enable read-only degrade modes.

---

## Cost Envelopes and Unit Economics

Track **cost per successful task**, including loop retries. Declare envelopes per workflow and fail harnesses when p95 cost exceeds budget without ADR waiver.

**Example (CareerPilot):** JD extract ≤ $0.01/success on `class.fast`; resume refine loop ≤ $0.25 total; nightly eval jobs capped and sharded.

---

## Migration Playbook

1. Add candidate model behind shadow flag.  
2. Dual-run traffic percentage or offline full golden.  
3. Compare quality/cost/safety scorecards.  
4. Flip mapping version with approvers.  
5. Keep prior primary as fallback for one window.  
6. Remove stale models after stability.

---

## See Also (Sibling Index)

- [`AGENTS.md`](AGENTS.md) — `model_policy` field  
- [`PROMPTS.md`](PROMPTS.md) — prompt compatibility with classes  
- [`EVALS.md`](EVALS.md) — promotion gates for route changes  
- [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) — pinning in jobs  
- [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) — per-iteration routing  
- [`RAG.md`](RAG.md) — embed/rerank classes  
- [`TOOLS.md`](TOOLS.md) — tools vs models separation  
- [`MEMORY.md`](MEMORY.md) — memory-sensitive routing  
- [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) — router cases  
- [`SUBAGENTS.md`](SUBAGENTS.md) — per-child class policies  
- [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) — extraction model classes  
- [`AI_GUIDELINES.md`](AI_GUIDELINES.md) — risk floors  

---

## Revision History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-07-12 | Initial MES Model Routing; private_onprem / sovereign_cloud; adaptive ADR+shadow |
