# Harness Engineering — Offline/Online Execution, Isolation, and Promotion Rails

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All MoniGarr harnesses that run agents, evals, tools, and promotion checks for AI systems  
**Canonical Path:** `AI/HARNESS_ENGINEERING.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Parts VI–VII, XV, XX · [`../Governance/MILE.md`](../Governance/MILE.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`AGENTS.md`](AGENTS.md) · [`SUBAGENTS.md`](SUBAGENTS.md) · [`PROMPTS.md`](PROMPTS.md) · [`TOOLS.md`](TOOLS.md) · [`RAG.md`](RAG.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) · [`EVALS.md`](EVALS.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`MEMORY.md`](MEMORY.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

A harness is the controlled runtime that executes AI systems for evaluation, CI, canaries, and operator drills. This standard defines harness contracts, isolation, determinism pins, tool mediation, artifact capture, and promotion rails. Ad-hoc scripts that mutate production while “testing” are non-conformant.

Evals: [`EVALS.md`](EVALS.md).  
Loops: [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md).  
Tools: [`TOOLS.md`](TOOLS.md).

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
| **Harness** | Orchestrated runner with pins, mediation, and artifacts |
| **Job** | Versioned harness configuration for a suite or drill |
| **Fixture** | Frozen inputs, fakes, and corpus snapshots |
| **Mediator** | Layer that intercepts tool calls (record/replay/fake/deny) |
| **Artifact bundle** | Traces, scores, diffs, and logs from a run |
| **Promotion rail** | Automated path from PASS artifacts to environment pointers |
| **Record/replay** | Capture real tool I/O once; replay deterministically |

---

## Harness Principles

1. **Isolation.** Offline jobs cannot touch production write endpoints.  
2. **Pins.** Models, prompts, tools, datasets, corpora, seeds are recorded.  
3. **Mediation.** Tools go through a gateway with modes.  
4. **Reproducibility.** Same pins → comparable scores within documented variance.  
5. **Fail closed.** Infra errors block release gates.  
6. **Artifact first.** If it’s not in the bundle, it didn’t happen.  
7. **Least privilege.** Harness identities are scoped.

---

## Harness Job Contract

```yaml
job_id: harness.resume_writer.offline.v5
owner: platform-ai@monigarr.com
mode: offline
system_pins:
  agent: career.resume_writer@1.4.0
  prompts: [prompts.resume.system.v4]
  model_policy: class.quality_balanced
  router_table: routing.v3
  corpus_snapshot: corpus.user_profile.v2026.07.01
  graph_snapshot: graph.skills.v12
suite: eval.career.resume_writer.v5
dataset_pins:
  golden: golden.resume_writer@5.2.0
tool_mediation:
  default: fake
  overrides:
    rag.search.v3: replay
    docs.render.v1: fake
budgets:
  max_wall_minutes: 45
  max_cost_usd: 25
artifacts:
  traces: required
  scores: required
  diffs: optional
promotion:
  on_pass: update_pointer staging.ai.resume_writer
  # Signatures = linked ADR and/or PR approval records + run manifest hash (not undefined crypto)
  requires_signatures: [ci, eval_owner]
  manifest_hash: sha256:...   # hash of the immutable run manifest / artifact bundle
```

Every CI-gated job **shall** be versioned in VCS.

**Promotion signatures** mean durable, linkable approvals—not cryptographic ceremony invented ad hoc. Conforming evidence is: (1) linked ADR and/or required PR/environment approvals naming the change, and (2) the harness run’s **manifest hash** (immutable artifact-bundle digest). Slack emoji or unlinked chat is non-conformant.

---

## Modes

| Mode | Allowed side effects | Use |
|------|----------------------|-----|
| `offline` | None to prod; fakes/replay only | PR/merge gates |
| `shadow` | Read prod-like traffic; no customer-visible writes | Online scoring |
| `canary` | Limited real writes with kill switch | Post-offline promote |
| `drill` | Staging full stack | Incident practice |
| `prod_operator` | Privileged, audited | Break-glass only |

Mixing `offline` configs with production write credentials is forbidden.

---

## Tool Mediation Modes

| Mediation | Behavior |
|-----------|----------|
| `deny` | Always reject |
| `fake` | Deterministic stub from fixtures |
| `replay` | Return recorded payload for matching fingerprint |
| `record` | Call real dependency in approved env; store redacted I/O |
| `live` | Real call; only in canary/drill/prod_operator as allowed |

Offline jobs **must not** use `live` for `write` / `irreversible` tools. Record sessions **shall** redact secrets and PII.

---

## Determinism Pins

Harness runs **shall** capture:

- Model provider + model IDs + API versions when available  
- Temperature / decoding params  
- Prompt versions  
- Tool versions  
- Dataset versions + checksums  
- Corpus/graph snapshots  
- RNG seeds where applicable  
- Harness code version  

Unpinned “latest” floats are non-conformant for release gates.

---

## Isolation and Security

1. Separate service accounts per mode.  
2. Network policies block prod write hosts from offline runners.  
3. Secrets injected scoped to job needs.  
4. Containers/VMs disposed after jobs when handling sensitive fixtures.  
5. Artifact stores encrypt sensitive traces; retention policy documented.

---

## Artifact Bundle Requirements

Minimum contents:

| Artifact | Required |
|----------|----------|
| Run manifest (pins + versions) | Yes |
| Per-case scores | Yes |
| Suite gate result | Yes |
| Traces / spans | Yes for R1+ |
| Error taxonomy summary | Yes |
| Cost/latency summary | Yes |
| Human-readable failure report | Yes on FAIL |

Bundles **shall** be immutable once published; corrections publish a new run ID.

---

## CI/CD Integration

- PR: smoke (+ safety as required)  
- Merge: golden + regression  
- Release: full suite + holdout policy  
- Nightly: soak + shadow  

Harness `ERROR` **must** fail the pipeline for release jobs. Quarantine of flaky cases follows [`EVALS.md`](EVALS.md) / [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md)—not silent skip.

---

## Promotion Rails

Promotion **shall**:

1. Require `PASS` artifacts for required suites.  
2. Update immutable version pointers (not mutate prior versions).  
3. Record who/what approved via **signatures**: linked ADR/PR (or environment) approval **plus** the run **manifest hash**.  
4. Support rollback to previous pointer.  
5. Emit changelog references for prompt/agent/model changes.

Manual prod pointer edits without harness evidence are non-conformant for R1+.

---

## Local Developer Harnesses

Local harnesses **should** mirror CI mediation defaults (fake/replay). Live dependency use on laptops **must** follow security policy and never target production write endpoints.

---

## Performance and Cost Controls

Jobs declare budgets. Exceeding budgets fails the job. Parallelism **should** be used carefully to avoid provider rate-limit flakiness; document concurrency.

---

## Example (CareerPilot) — Offline Writer Harness

Illustrative:

- Mode: `offline`  
- Fakes: ATS submit tool → always `deny`  
- Replay: `rag.search.v3` fixtures from golden contexts  
- Gate: schema + groundedness + safety  
- On pass: pointer `staging.career.resume_writer` updates  
- Canary job separate: small % of draft generations, still no ATS auto-submit  

CareerPilot production publish remains HITL regardless of harness green.

---

## Anti-Patterns (Non-Conformant)

1. Running evals with production write credentials “because it’s easier.”  
2. Floating `model: latest` in release jobs.  
3. Deleting FAIL artifacts to clean dashboards.  
4. Local scripts that diverge silently from CI harness.  
5. Treating canary as optional theater after offline FAIL.  
6. Recording raw secrets into replay cassettes.  
7. Promoting by Slack emoji without pointer + artifact linkage.

---

## Compliance Checklist

- [ ] Versioned harness jobs for all R1+ gates.  
- [ ] Offline isolation from prod writes verified.  
- [ ] Tool mediation modes explicit per tool.  
- [ ] Pins complete in run manifests.  
- [ ] Artifact bundles immutable and complete.  
- [ ] CI maps smoke/golden/regression/release correctly.  
- [ ] Promotion rails require PASS + signatures.  
- [ ] Rollback pointers tested.  
- [ ] Budgets enforced.  
- [ ] Redaction policy on record/replay.

---

## Change Control

Harness mediation defaults and promotion rail changes **shall** follow MILE ([`../Governance/MILE.md`](../Governance/MILE.md)). Shared harness platforms **should** appear in [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md).

---

## Required Harness Categories

Every R2+ production AI workflow **shall** cover before launch: synthetic/schema tests, golden tests, regression packs, failure injection, cost benchmarks, latency benchmarks, safety checks, prompt benchmarks, tool benchmarks, and loop budget behavior where loops are used.

---

## Gate Profiles

| Profile | When | Typical contents |
|---------|------|------------------|
| `pr_fast` | Pull requests | Synthetic + core golden + safety smoke |
| `nightly_full` | Nightly | Full golden + regressions + cost/latency |
| `release` | Release candidate | Nightly full + canaries + HITL evidence; **`holdout_policy` required** (see below) |
| `postdeploy_shadow` | After deploy | Online/shadow probes |

### `holdout_policy` (release profile)

Release-profile jobs **shall** declare a `holdout_policy`: whether a holdout split is scored, how it is accessed (harness role only), and what happens on holdout FAIL (block promote / escalate). Holdout leakage rules: [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md). Omitting holdout on R1+ release gates requires ADR.
---

## Failure Injection Matrix

| Injection | Expected behavior |
|-----------|-------------------|
| Tool timeout | Typed error; stop or degrade |
| Empty retrieval | Refuse/ask; no invention |
| Schema-invalid output | Repair or fail closed |
| Critic hard-fail safety | Escalate; do not export |
| Budget exhaustion | Stop with recorded reason |

---

## Example (CareerPilot) — Job Map

| Job | Profile | Covers |
|-----|---------|--------|
| `career-pr` | pr_fast | resume core, safety smoke, schema |
| `career-nightly` | nightly_full | resume N=100, JD skills, interview, cost |
| `career-release` | release | nightly + export HITL evidence |
| `career-chaos` | nightly | empty retrieval, timeouts, safety |

---

## See Also (Sibling Index)

- [`EVALS.md`](EVALS.md) — what harnesses score  
- [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) — fixtures and packs  
- [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) — loop budgets in jobs  
- [`TOOLS.md`](TOOLS.md) — gateway alignment  
- [`MODEL_ROUTING.md`](MODEL_ROUTING.md) — router pins  
- [`AGENTS.md`](AGENTS.md) — systems under test  
- [`PROMPTS.md`](PROMPTS.md) — prompt pins  
- [`RAG.md`](RAG.md) — corpus snapshots  
- [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) — graph snapshots  
- [`MEMORY.md`](MEMORY.md) — memory fakes in offline  
- [`SUBAGENTS.md`](SUBAGENTS.md) — multi-agent jobs  
- [`AI_GUIDELINES.md`](AI_GUIDELINES.md) — risk and HITL  

---

## Revision History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-07-12 | Initial MES Harness; signatures = ADR/PR + manifest hash; holdout_policy |
