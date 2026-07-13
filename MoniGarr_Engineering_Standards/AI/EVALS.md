# Evals — Metrics, Gates, Suites, and Promotion Discipline

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All MoniGarr AI systems, agents, prompts, RAG/graph policies, and model routings subject to quality control  
**Canonical Path:** `AI/EVALS.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Parts VI–VII, XX · [`../Governance/MILE.md`](../Governance/MILE.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`AGENTS.md`](AGENTS.md) · [`SUBAGENTS.md`](SUBAGENTS.md) · [`PROMPTS.md`](PROMPTS.md) · [`TOOLS.md`](TOOLS.md) · [`RAG.md`](RAG.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`MEMORY.md`](MEMORY.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

Evaluations are the proof system for AI changes. This standard defines metric families, suite structure, thresholds, statistical care, human rubrics, online monitoring, and promotion gates. Shipping prompt/model/agent changes without gated evals is non-conformant for R1+.

Datasets: [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md).  
Execution environment: [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md).  
Iterative improvement: [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md).

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
| **Eval** | A scored measurement of system behavior on defined cases |
| **Suite** | Versioned collection of evals with thresholds and owners |
| **Gate** | Binary promote/block decision based on suite results |
| **Golden case** | Curated input with expected properties or labels |
| **Rubric** | Human or LLM-judge scoring criteria |
| **Regression pack** | Cases that previously failed and must stay fixed |
| **Shadow eval** | Offline scoring of production traffic samples |
| **Canary** | Limited online exposure with kill switch |

---

## Principles

1. **Falsifiability.** Claims of quality must be testable.  
2. **Task fidelity.** Evals mirror real user jobs, not toy prompts only.  
3. **Separation of train and test.** No silent leakage of goldens into few-shots used at runtime without tracking.  
4. **Multiple metrics.** No single score vanity.  
5. **Human authority.** LLM judges assist; humans own rubrics for R2+.  
6. **Comparable runs.** Pin models, prompts, tools, corpora, seeds.  
7. **Fail closed.** Missing eval artifacts block promotion.  
8. **Traceability.** Every score links to case IDs and system versions.

---

## Metric Families (Normative Catalog)

Projects **shall** select metrics from these families and document why any family is omitted.

### Task Success

- Exact match / structured schema validity  
- Critical field accuracy  
- End-to-end goal completion rate  

### Grounding and Retrieval

- Groundedness / unsupported claim rate  
- Citation precision  
- Recall@k / nDCG for RAG  
- Graph link precision  

### Safety and Policy

- Policy violation rate  
- PII leakage rate  
- Jailbreak / injection susceptibility  
- Refusal appropriateness  

### UX and Quality Rubrics

- Clarity, tone, completeness (weighted rubric)  
- Harmful or misleading content flags  

### Tooling and Agency

- Tool selection accuracy  
- Argument schema validity  
- Unauthorized tool attempt rate  
- Loop termination correctness  

### Efficiency

- Latency p50/p95  
- Token and cost per successful task  
- Tool call count  

### Reliability

- Crash / timeout rate  
- Non-deterministic flake rate under pinned seeds  

### Fairness / Disparate Impact (optional; R2+ customer-facing)

For R2+ customer-facing ranking, matching, or decision-support flows, projects **may** add a fairness / disparate-impact metric family (slice metrics by approved demographic or proxy cohorts where lawful and consented; document cohort definitions). Treat as quality/risk signal—not marketing claims or certification. Omission for in-scope flows **should** be ADR-noted.

---

## Suite Structure

Every R1+ agent, prompt family, retrieval policy, and router class **shall** have a named suite:

```yaml
suite_id: eval.career.resume_writer.v5
owner: platform-ai@monigarr.com
risk_class: R2
system_under_test:
  agent: career.resume_writer@1.4.0
  prompts: [prompts.resume.system.v4]
  tools: [rag.search.v3]
  model_policy: class.quality_balanced
  corpus_snapshot: corpus.user_profile.v...
datasets:
  golden: golden.resume_writer.n200.v5
  regression: golden.resume_writer.reg.v5
  safety: golden.resume_writer.safety.v3
metrics:
  - { id: schema_valid, threshold: 1.0 }
  - { id: groundedness, threshold: 0.90 }
  - { id: rubric_pass, threshold: 0.85 }
  - { id: policy_violation, threshold_max: 0.0 }
gates:
  promote_requires: [golden, regression, safety]
harness_job: harness.resume_writer.offline.v5
reproducibility_manifest_hash: sha256:...  # digest of pins + suite versions for the scored run
```

### Suite Layers

| Layer | Purpose | Cadence |
|-------|---------|---------|
| Smoke | Tiny critical path | Every PR |
| Golden | Representative quality | Every PR / merge |
| Regression | Prior failures | Every PR |
| Safety | Abuse and policy | Every PR for R1+ |
| Soak / nightly | Broader + shadow | Nightly |
| Release | Full gate | Before prod promote |

---

## Thresholds and Gates

1. Thresholds **shall** be explicit numeric policies in version control.  
2. Raising thresholds is encouraged; lowering **must** have owner approval and rationale.  
3. Safety metrics with `threshold_max: 0` **must not** be waived by average quality gains.  
4. Gates **shall** be enforced in CI/CD or the promotion harness—not by informal chat sign-off alone.  
5. Flaky tests **must** be quarantined with tickets; silent ignores are forbidden.

### Gate Outcomes

| Outcome | Meaning |
|---------|---------|
| `PASS` | All required thresholds met |
| `FAIL` | Block promotion |
| `WARN` | Non-gating degradation; must file follow-up |
| `ERROR` | Harness/infra failure; treat as fail-closed for release |

---

## Human Rubrics and LLM Judges

### Human Rubrics

R2+ customer-facing suites **shall** include a human rubric for periodic calibration (sample size and cadence documented).

Rubric items **must** be:

- Atomic  
- Observable  
- Weighted  
- Accompanied by examples of pass/fail  

### LLM-as-Judge

LLM judges **may** scale scoring but **shall**:

1. Use versioned judge prompts ([`PROMPTS.md`](PROMPTS.md)).  
2. Blind to producer identity when comparing systems.  
3. Be calibrated against human labels on a holdout.  
4. Never be the sole gate for safety-critical metrics without human oversight policy.

Agreement metrics (for example Cohen’s κ or percent agreement) **should** be tracked; drift triggers recalibration.

---

## Statistical Care

- Report sample sizes with scores.  
- Prefer paired comparisons on the same cases when ranking variants.  
- Avoid declaring winners on tiny N without confidence intervals or bootstrap notes.  
- Seed and temperature **shall** be pinned for offline suites unless stochasticity is the subject under test.  
- Document known nondeterminism (provider variance) and mitigation (majority vote, tolerances).

---

## Offline vs Online Evals

### Offline (Required)

Deterministic harness runs on golden datasets before promotion.

### Online (Should for R1+)

- Shadow scoring on sampled production traces  
- Canary with automatic rollback triggers  
- User outcome metrics (task success, CSAT proxies) separated from model vanity metrics  

Online metrics **must not** replace offline safety gates.

---

## Regression Discipline

When a production defect is fixed:

1. Add a golden/regression case **before** or with the fix.  
2. Case IDs link to incident or ticket.  
3. Removing a regression case **requires** written rationale and owner approval.  

This pairs with [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) and [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md).

---

## Component vs End-to-End Evals

| Scope | Required when |
|-------|----------------|
| Retriever-only | RAG policy changes |
| Graph extraction | Ontology/extractor changes |
| Prompt unit | Prompt family changes |
| Tool contract | New tools / schemas |
| Agent e2e | Coordination or UX path changes |
| Team e2e | Multi-agent topology changes |

R2+ releases **shall** run both component and e2e suites when multiple layers change.

---

## Scorecards and Reporting

Living scorecards **shall** show:

- Suite version  
- System versions under test  
- Metric trends  
- Last human calibration date  
- Open WARN items  
- Cost/latency alongside quality  

Scorecards are engineering artifacts, not marketing slides.

---

## Artifact Retention

Eval artifacts (raw scores, case IDs, harness logs, judge outputs, promotion evidence) **shall** be retained long enough to support:

- Release Evidence Packs and PIR reconstruction  
- Threshold disputes and calibration reviews  
- Regulatory or customer audit requests when those profiles apply  

Default posture (projects may tighten via ADR / privacy policy):

| Artifact | Minimum retention |
|----------|-------------------|
| Gate pass/fail summaries + suite version pins | Release + **12 months** (or contract maximum if longer) |
| Per-case score details for failed / WARN cases | **90 days** after resolution or next major release |
| Full prompt/completion payloads inside eval stores | Follow [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md) / project privacy — prefer redacted fixtures |

Retention clocks are project-owned; MES does not invent regulatory clocks. Disposal methods **shall** be documented.

---

## Failure Triage

On `FAIL`:

1. Identify failing case IDs and metrics.  
2. Classify: data bug, prompt bug, retrieval miss, tool bug, model routing, harness flake.  
3. Fix at the correct layer; do not “prompt over” safety failures.  
4. Re-run required suites.  
5. Record learnings in changelog / ADR if policy changes.

---

## Example (CareerPilot) — Resume Writer Gates

Illustrative thresholds:

| Metric | Gate |
|--------|------|
| Output schema valid | 100% |
| No invented employers | 100% (safety) |
| Groundedness on experience claims | ≥ 0.90 |
| Rubric pass (clarity/impact) | ≥ 0.85 |
| PII leakage beyond user profile | 0 |
| p95 latency | ≤ product SLO |
| Unauthorized ATS submit attempts | 0 |

A prettier resume that invents a job title **must** fail the suite regardless of rubric style scores.

---

## Anti-Patterns (Non-Conformant)

1. Demo-driven shipping with three cherry-picked examples.  
2. Averaging safety into a single “quality” score.  
3. Changing goldens to match a broken model.  
4. Using the eval set as few-shot memory in production without isolation.  
5. Ignoring harness `ERROR` as “infra noise” on release day.  
6. Declaring victory from LLM judge scores with no human calibration.  
7. Lowering thresholds quietly to green the build.

---

## Compliance Checklist

- [ ] R1+ systems have versioned suites with owners.  
- [ ] Smoke + golden + regression + safety layers exist as required by risk.  
- [ ] Thresholds live in VCS and are enforced by harness/CI.  
- [ ] Safety metrics cannot be waived by quality averages.  
- [ ] LLM judges calibrated; humans own R2+ rubrics.  
- [ ] Pins recorded for models, prompts, tools, corpora.  
- [ ] Regression cases added for production defects.  
- [ ] Scorecards show trends, cost, and latency.  
- [ ] Online canary/shadow does not replace offline gates.  
- [ ] Failures triaged by layer with re-run evidence.

---

## Change Control

New gates, threshold reductions, and judge prompt changes **shall** follow MILE ([`../Governance/MILE.md`](../Governance/MILE.md)). Eval platform architecture **should** align with [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md).

---

## See Also (Sibling Index)

- [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) — dataset curation and leakage controls  
- [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) — running suites  
- [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) — improve loops using eval signal  
- [`PROMPTS.md`](PROMPTS.md) — prompt scorecards  
- [`AGENTS.md`](AGENTS.md) — agent evaluation fields  
- [`RAG.md`](RAG.md) — retrieval metrics  
- [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) — graph metrics  
- [`MODEL_ROUTING.md`](MODEL_ROUTING.md) — router A/B evals  
- [`TOOLS.md`](TOOLS.md) — tool-call accuracy  
- [`MEMORY.md`](MEMORY.md) — memory contamination tests  
- [`SUBAGENTS.md`](SUBAGENTS.md) — child vs parent suite promotion  
- [`AI_GUIDELINES.md`](AI_GUIDELINES.md) — risk classes  

---

## Revision History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-07-12 | Initial MES Evals; fairness family optional; reproducibility_manifest_hash |
