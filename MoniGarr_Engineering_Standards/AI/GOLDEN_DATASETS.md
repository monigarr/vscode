# Golden Datasets — Curation, Versioning, Leakage Controls, and Lifecycle

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All curated datasets used to evaluate or calibrate MoniGarr AI systems  
**Canonical Path:** `AI/GOLDEN_DATASETS.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Parts VI–VII, XX · [`../Governance/MILE.md`](../Governance/MILE.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`AGENTS.md`](AGENTS.md) · [`SUBAGENTS.md`](SUBAGENTS.md) · [`PROMPTS.md`](PROMPTS.md) · [`TOOLS.md`](TOOLS.md) · [`RAG.md`](RAG.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) · [`EVALS.md`](EVALS.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`MEMORY.md`](MEMORY.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

Golden datasets are the durable memory of what “correct” means for AI systems. This standard defines case schemas, labeling, versioning, privacy, leakage prevention, stratification, and retirement. Eval gates without governed goldens are non-conformant for R1+.

Evaluation policy: [`EVALS.md`](EVALS.md).  
Harness execution: [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md).

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
| **Golden dataset** | Versioned set of cases with expected outputs or properties |
| **Case** | Single eval unit with input, context, labels, and metadata |
| **Label** | Human- or rule-authored expected property |
| **Holdout** | Cases reserved for calibration / final release |
| **Leakage** | Improper overlap between goldens and runtime hints or training |
| **Stratification** | Coverage across intents, locales, risk, and difficulty |
| **Synthetic case** | Generated case still requiring human acceptance for R2+ |

---

## Dataset Contract

Every golden dataset **shall** declare:

| Field | Description |
|-------|-------------|
| `id` | Stable ID (`golden.product.capability`) |
| `version` | SemVer |
| `owner` | Human owner |
| `purpose` | What decisions it gates |
| `risk_class` | Highest risk of systems it gates |
| `schema` | Case JSON Schema |
| `n_cases` | Count |
| `splits` | train_cal / smoke / golden / holdout / regression / safety as used |
| `pii_policy` | Redaction and storage rules |
| `license` | Usage rights |
| `lineage` | Sources and generation method |
| `changelog` | Behavior-affecting edits |

```yaml
id: golden.resume_writer
version: 5.2.0
owner: career-ai@monigarr.com
purpose: Gate resume writer groundedness and schema
risk_class: R2
schema: GoldenResumeCaseV2
n_cases: 200
splits: { smoke: 15, golden: 150, holdout: 20, regression: 40, safety: 25 }
# Note: counts may overlap across packs by reference, not duplication
pii_policy: synthetic_or_redacted_only
```

---

## Case Schema (Minimum)

Each case **must** include:

1. `case_id` — stable  
2. `input` — user/system inputs  
3. `context` — fixtures (profile snippets, docs, graph fragments)  
4. `expected` — exact output, constraints, or rubric targets  
5. `tags` — intent, locale, difficulty, risk  
6. `privacy_class`  
7. `created_by` / `reviewed_by`  
8. `source` — production incident, synthetic, manual  
9. `notes` — non-executable rationale  

Optional but recommended: `adversarial: true`, `known_failing_until`, `linked_ticket`.

---

## Curation Rules

### Admission

New cases **shall** be reviewed for:

- Realism vs product traffic  
- Label correctness  
- Privacy  
- Non-duplication  
- Stratification gaps filled  

### Production-Derived Cases

When mined from production:

1. Strip or synthesize PII.  
2. Obtain lawful basis / product policy compliance.  
3. Prefer patterns over unique sensitive stories.  
4. Mark `source: production_derived`.  

Raw customer content in goldens without redaction is forbidden.

### Synthetic Cases

Synthetic generation **may** expand coverage but R2+ packs **shall** have human acceptance sampling before gating production.

---

## Stratification Requirements

Datasets that gate customer-facing quality **should** cover:

| Axis | Examples |
|------|----------|
| Intent | Summarize, rewrite, match, refuse |
| Difficulty | Easy / medium / hard |
| Locale / language | Supported locales |
| Risk | Policy edge cases |
| Data shape | Empty fields, conflicts, long inputs |
| Tool needs | Retrieval required vs not |

Smoke packs **must** include at least one case per critical intent.

---

## Leakage Controls

1. Golden expected outputs **must not** be injected into production prompts as few-shots unless a dedicated, tracked `fewshot_pack` is separated from the gate set.  
2. Holdout cases **shall not** be used for iterative prompt hacking in the same change that they gate.  
3. Embedding indexes used at runtime **must not** include golden expected answers labeled as corpus docs.  
4. Developers **should** access holdout only through harness roles.  
5. Suspected leakage incidents **shall** be treated as eval integrity incidents: rotate holdout, document, re-baseline.

---

## Versioning and Change Control

- Additive cases: minor version.  
- Label corrections that change pass/fail: minor or major per impact; changelog required.  
- Removals or threshold-coupled deletions: major if they weaken gates; owner approval required.  
- Dataset versions are pinned in eval suites ([`EVALS.md`](EVALS.md)).

Editing goldens to make a failing model pass without fixing the system is non-conformant.

---

## Storage and Access

- Prefer VCS for small/medium packs; object storage + manifests for large binaries.  
- Access control **shall** match privacy class.  
- Checksums **shall** be recorded in suite manifests.  
- Encrypted at rest for any residual sensitive fields.

---

## Regression Packs

Regression packs **shall**:

1. Grow when production defects are fixed.  
2. Link `case_id` → ticket/incident.  
3. Remain stable; flaky expectations get repaired carefully with notes.  
4. Never be mass-deleted to green CI.

---

## Safety Packs

Safety packs **must** include:

- Injection attempts  
- Requests for disallowed side effects  
- PII exfiltration attempts  
- Conflicting instructions (user vs policy)  
- Empty/ambiguous inputs that should refuse or clarify  

Safety packs are mandatory for R1+ agents with tools or user content.

---

## Labeling Quality

- Dual review **should** be used for ambiguous R2+ labels.  
- Inter-annotator agreement **should** be measured on samples.  
- Rubric-linked labels reference rubric version IDs.  
- “Vague vibes” labels are insufficient for gates.

---

## Example (CareerPilot) — Golden Packs

Illustrative inventory:

| Pack | Purpose |
|------|---------|
| `golden.resume_writer` | Schema, grounded bullets, tone rubric |
| `golden.resume_writer.reg` | Prior invented-employer and truncation bugs |
| `golden.resume_writer.safety` | ATS submit coaxing, PII overshare, injection |
| `golden.job_match` | Skill graph + JD hybrid retrieval cases |
| `golden.policy_qa` | Help-center grounded answers and refusals |

CareerPilot goldens **must** use synthetic or redacted profiles; real applicant SSNs or government IDs are forbidden.

---

## Lifecycle

```text
Propose → Review → Admit → Version bump → Pin in suite → Monitor usefulness → Retire/replace
```

Retirement **shall** record why (product change, saturation, leakage) and what replaces coverage.

---

## Anti-Patterns (Non-Conformant)

1. One giant unsorted JSON of demos.  
2. Goldens that only happy-path the marketing narrative.  
3. Copying eval cases into system prompt few-shots.  
4. Quietly deleting failing cases.  
5. Unredacted production dumps.  
6. No owners and no changelog.  
7. Holdout used daily for prompt iteration by the same authors.

---

## Compliance Checklist

- [ ] Dataset contract complete with owner and version.  
- [ ] Case schema enforced.  
- [ ] Stratified smoke coverage of critical intents.  
- [ ] Regression and safety packs present for R1+.  
- [ ] PII policy enforced; checksums recorded.  
- [ ] Leakage controls documented and tested.  
- [ ] Suites pin dataset versions.  
- [ ] Changes changeloged; removals approved.  
- [ ] Holdout access restricted.  
- [ ] Synthetic R2+ cases human-accepted on sample.

---

## Change Control

Dataset policy changes and mass label revisions **shall** follow MILE ([`../Governance/MILE.md`](../Governance/MILE.md)). Large shared golden platforms **should** align with [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md).

---

## The N=100 Pattern (Normative Starter)

**N=100** is MoniGarr’s default starter size for a capability’s primary behavioral golden suite: large enough to catch common regressions, small enough for frequent PR runs.

Rules:

1. Stratify; do not collect 100 near-duplicates.  
2. Keep a **core gate set** (often ≤100) for PR speed and a **full set** for release.  
3. Expand beyond 100 when metrics are noisy or risk is high.  
4. Never shrink solely to make a candidate pass.  
5. Difficulty mix: easy ≤30%, medium ~40–50%, hard ≥20%, plus explicit trap tags.

### Build Steps

Contract → strata list → seed 10 peer-reviewed cases → expand with varied content → freeze v1 → wire `core_pr`/`release_full` → add escaped defects continuously → rebalance quarterly.

---

## Manifest and Integrity

Each dataset release includes `dataset_id`, version, owner, case_count, content hashes, split definitions, and license. CI **shall** fail if harnesses run against mutated files without a version bump.

---

## Revision History

| Date | MES | Change |
|------|-----|--------|
| 2026-07-12 | 1.1.0 | Revision history added; N=100 / split semantics unchanged (P3 longevity). |

---

## See Also (Sibling Index)

- [`EVALS.md`](EVALS.md) — suites and gates  
- [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) — loading and scoring datasets  
- [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) — feeding failures back into packs  
- [`RAG.md`](RAG.md) — retrieval goldens  
- [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) — graph annotation sets  
- [`PROMPTS.md`](PROMPTS.md) — prompt regression packs  
- [`AGENTS.md`](AGENTS.md) — agent `evaluation` fields  
- [`TOOLS.md`](TOOLS.md) — tool fixture payloads  
- [`MEMORY.md`](MEMORY.md) — memory contamination cases  
- [`MODEL_ROUTING.md`](MODEL_ROUTING.md) — router goldens  
- [`SUBAGENTS.md`](SUBAGENTS.md) — per-child packs  
- [`AI_GUIDELINES.md`](AI_GUIDELINES.md) — risk-aligned coverage  
