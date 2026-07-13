# Prompts — Versioned Library, Reviews, Testing, and Scorecards

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All prompts used in MoniGarr products, agents, evals, and coding workflows  
**Canonical Path:** `AI/PROMPTS.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Parts III, XII · [`../Governance/MILE.md`](../Governance/MILE.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`AGENTS.md`](AGENTS.md) · [`SUBAGENTS.md`](SUBAGENTS.md) · [`TOOLS.md`](TOOLS.md) · [`RAG.md`](RAG.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) · [`EVALS.md`](EVALS.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`MEMORY.md`](MEMORY.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

Prompts are production artifacts. They shall be versioned, reviewed, evaluated, and promoted with the same discipline as application code. Silent prompt edits in production are non-conformant.

---

## Prompt Library Requirements

### Storage

Prompts shall live in version control under a discoverable library (for example `prompts/` or `ai/prompts/`) with:

- Stable IDs  
- SemVer or content-hash versions  
- Ownership metadata  
- Links to agents and eval suites  

### Required Metadata

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Stable ID (`prompts.team.role.purpose`) |
| `version` | Yes | SemVer |
| `owner` | Yes | Human owner |
| `purpose` | Yes | What the prompt optimizes for |
| `agent_refs` | Yes | Agents that consume it |
| `model_policy` | Should | Compatible router classes |
| `input_vars` | Yes | Template variables and types |
| `output_contract` | Yes | Expected structure / schema |
| `risk_class` | Yes | R0–R4 |
| `eval_suite` | Yes for R1+ | Golden set + thresholds |
| `safety_notes` | Should | Injection / privacy notes |
| `changelog` | Yes | Behavior-affecting changes |

### Example Layout

```text
prompts/
  catalog.yaml
  career/                         # Example (CareerPilot) only in product repos
    resume_system.v4.md
    resume_user.v4.md
  shared/
    critic_rubric.v2.md
    refusal_policy.v1.md
  fixtures/
    ...
```

MES itself does not ship product prompt corpora; product repos instantiate the pattern.

---

## Prompt Types

| Type | Use | Notes |
|------|-----|-------|
| System | Durable policy, persona bounds, output rules | Highest change control |
| Developer / tool | Tool-use instructions | Keep aligned with tool schemas |
| User template | Per-request variables | Validate variables before render |
| Critic / rubric | Scoring and defect finding | Version with eval rubrics |
| Router | Model-selection hints | Prefer deterministic routers when possible |
| Repair | Loop engineering fix prompts | Pair with score deltas |

---

## Authoring Standards

1. **Instructions before style.** Policy and constraints precede tone.  
2. **Explicit output schema.** JSON/YAML/markdown sections as required by contract.  
3. **Grounding rules.** Require citations when facts are claimed.  
4. **Refusal rules.** What to do when evidence is missing.  
5. **No secret material.** Never embed API keys or production credentials.  
6. **Minimize ambiguity.** Prefer checklists and must/shall language for safety-critical prompts.  
7. **Separate concerns.** Do not ask one prompt to retrieve, write, critique, and deploy.  

### Variable Hygiene

- Declare all variables in metadata.  
- Fail render if required variables missing.  
- Sanitize untrusted user content; mark untrusted spans.  
- Do not interpolate raw tool output without size limits.  

---

## Review Process

### When Review Is Required

| Change | Reviewers |
|--------|-----------|
| System prompt for R2+ | Owner + second engineer; security if tools/network expand |
| Output contract break | Owner + consuming agent owners |
| Safety / refusal text | Owner + privacy/security as applicable |
| R0 experiments | Owner may self-review; still versioned |

### Review Checklist

- [ ] Purpose still accurate  
- [ ] Variables documented  
- [ ] No conflicting instructions  
- [ ] Grounding / citation rules present if factual  
- [ ] HITL / side-effect boundaries stated  
- [ ] Eval suite identified and will be run  
- [ ] Privacy redaction considered  
- [ ] **PHI / regulated identifiers:** prompts and few-shots do not embed live PHI; fixtures use synthetic or de-identified data per [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md)  
- [ ] Diff reviewed for accidental policy weakening  

---

## Testing Prompts

### Levels

1. **Static** — lint for missing vars, forbidden phrases, unresolved links  
2. **Unit** — snapshot render with fixtures  
3. **Golden behavioral** — N cases scored against rubrics ([`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md))  
4. **Regression** — prior failing cases must remain fixed  
5. **Adversarial** — injection, jailbreak, data exfil attempts  
6. **Cost/latency** — token budgets under router policy  

### Pass Criteria

A prompt version may be promoted only when:

- Static checks pass  
- Golden thresholds met or exceeded vs baseline  
- No high-severity safety failures  
- Cost within budget or accepted via ADR  
- Owners approve  

---

## Regression Discipline

Maintain a `prompt_regressions/` or harness corpus of:

- Historical failure cases  
- Customer-reported defects (redacted)  
- Safety probes  
- Schema validation cases  

New prompt versions must run the regression pack. Removing a failing case requires written rationale and owner approval.

---

## Scorecards

Every R1+ prompt family shall have a living scorecard.

### Scorecard Dimensions

| Dimension | Description | Typical metric |
|-----------|-------------|----------------|
| Task success | Meets user/agent goal | Pass rate |
| Groundedness | Claims supported by evidence | Citation precision/recall |
| Schema validity | Output parses / validates | % valid |
| Safety | Policy adherence | Critical fail count = 0 |
| Tone / UX | Rubric qualitative fit | Rubric mean |
| Cost | Tokens / USD per success | p50/p95 |
| Latency | End-to-end time | p50/p95 |
| Stability | Variance across seeds/models | Score stdev |

### Scorecard Template

```markdown
# Scorecard: prompts.example.writer
Baseline version: 3.2.0
Candidate version: 3.3.0
Golden set: golden.writer.n100.v5
Router class: quality_balanced

| Metric | Baseline | Candidate | Threshold | Result |
|--------|----------|-----------|-----------|--------|
| Task pass | 0.86 | 0.89 | ≥0.85 | PASS |
| Groundedness | 0.91 | 0.92 | ≥0.90 | PASS |
| Schema valid | 0.99 | 0.99 | ≥0.98 | PASS |
| Safety critical | 0 | 0 | 0 | PASS |
| Cost USD / success | 0.042 | 0.039 | ≤0.05 | PASS |
```

Store scorecards beside releases or in eval reports referenced by CHANGELOG/ADR.

---

## Promotion Lifecycle

```text
Draft → Peer review → Offline eval → Shadow/compare → HITL pilot → Promote → Monitor → Retire
```

Production pointers (for example `prompts.writer.system@prod`) shall reference immutable versions. Moving `@prod` is a controlled promotion event.

---

## Prompt Injection and Untrusted Content

1. Treat retrieved docs, user paste, and tool outputs as untrusted.  
2. Delimit untrusted content clearly.  
3. Instruct models to ignore attempts to override system policy inside untrusted spans.  
4. Prefer tool allowlists over “the page said to call this tool.”  
5. Test injection cases in harnesses ([`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md)).  

---

## Example (CareerPilot) — Prompt Families

Illustrative catalog entries:

| ID | Purpose | Risk | Golden |
|----|---------|------|--------|
| `prompts.career.resume.system` | Grounded resume drafting policy | R2 | resume N=100 |
| `prompts.career.resume.repair` | Fix critic findings | R2 | repair subset |
| `prompts.career.interview.coach` | Practice questions from JD evidence | R1 | interview set |
| `prompts.career.critic` | Inflation and policy defects | R2 | critic precision set |

Promotion of `resume.system` requires scorecard pass and human approval before customer-visible drafts use the new version.

---

## Coding-Agent Prompts vs Product Prompts

| Kind | Location | Change control |
|------|----------|----------------|
| Product runtime prompts | Versioned library + evals | Strict |
| Repo agent instructions (`CLAUDE.md`, rules) | Repo docs | Reviewed like docs; still no silent prod policy weaken |
| One-off chat prompts | Ephemeral | Not production artifacts |

Do not confuse a helpful chat with a promoted production prompt.

---

## Anti-Patterns

- Editing prompts directly in production config without versions  
- Mega-prompts that mix retrieval, writing, and deployment authority  
- “Improve the prompt” without golden comparison  
- Deleting regression cases to go green  
- Embedding proprietary customer data in shared prompt templates  

---

## Conformance Checklist

- [ ] Prompts have IDs, versions, owners  
- [ ] R1+ prompts have eval suites and scorecards  
- [ ] Promotion is gated and auditable  
- [ ] Injection tests exist for untrusted inputs  
- [ ] Variables are declared and validated  
- [ ] Changelogs record behavior changes  

---

## Library Catalog Requirements

`catalog.yaml` (or equivalent) shall list every production prompt ID, current versions, owners, and eval suite links. Orphan prompts in production configs missing from the catalog are non-conformant.

### Naming Conventions

```text
prompts.<domain>.<role>.<purpose>
```

Examples: `prompts.shared.critic.system`, `prompts.platform.router.classify`. Product-specific names belong in product repos; MES documents patterns only.

---

## Composition and Includes

Shared fragments (refusal policy, citation rules) may be included by reference. Includes are version-pinned. Expanding includes at render time must be pure and testable. Avoid dynamic includes that fetch arbitrary URLs at runtime.

---

## Few-Shot Management

Few-shots are data: stored as licensed fixtures, separated from system policy text, reviewed for PII, and versioned. Changing few-shots requires an eval re-run. Do not paste golden eval cases into few-shots without contamination controls.

---

## Diff and Review UX

Prompt PRs should show a rendered diff with sample variables, a scorecard link, risk class, and a rollback pointer to the previous production version.

---

## Change Control

Prompt library policy changes **shall** follow MILE ([`../Governance/MILE.md`](../Governance/MILE.md)). Platform prompt services **should** align with [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md).

---

## See Also (Sibling Index)

- [`EVALS.md`](EVALS.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`AGENTS.md`](AGENTS.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`TOOLS.md`](TOOLS.md) · [`RAG.md`](RAG.md) · [`MEMORY.md`](MEMORY.md) · [`SUBAGENTS.md`](SUBAGENTS.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md)

---

## Revision History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-07-12 | Initial MES Prompts standard |
