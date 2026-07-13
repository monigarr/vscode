# AI Guidelines — Human-in-the-Loop, Bounds, and Agent Contracts

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All MoniGarr products, services, repositories, and AI coding agents  
**Canonical Path:** `AI/AI_GUIDELINES.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Parts III, XII, XX · [`../Governance/MILE.md`](../Governance/MILE.md) · [`AGENTS.md`](AGENTS.md) · [`SUBAGENTS.md`](SUBAGENTS.md) · [`PROMPTS.md`](PROMPTS.md) · [`TOOLS.md`](TOOLS.md) · [`RAG.md`](RAG.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) · [`EVALS.md`](EVALS.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`MEMORY.md`](MEMORY.md) · [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

This document is the company-wide operating contract for AI use across MoniGarr.com LLC. It defines where AI may assist, where AI is prohibited from acting alone, how humans remain accountable, and how approved coding agents (per project `AGENTS.md` / instruction files) must behave inside MoniGarr repositories.

MES is product-agnostic. Product names appear only as labeled illustrations.

**Example (CareerPilot):** CareerPilot agent teams illustrate HITL gates for customer-facing resume and application content; they do not redefine MES policy.

---

## Normative Language

| Term | Meaning |
|------|---------|
| **shall / must** | Mandatory for MES conformance |
| **should** | Strong default; deviation requires an ADR |
| **may** | Optional |
| **Example (CareerPilot)** | Illustrative only |

---

## Scope

These guidelines apply to:

1. AI features inside MoniGarr products and services  
2. AI-assisted engineering (coding agents, PR review bots, documentation generators)  
3. Offline and online evaluation harnesses that invoke models  
4. Retrieval, memory, graph, and tool systems that feed model context  
5. Model gateways, routers, and cost controls  

They do **not** grant certification claims (SOC 2, FedRAMP, ISO, etc.). Regulated deployments still require legal, privacy, contracting, and authorizing-official review.

---

## Core Principles

| Principle | Requirement |
|-----------|-------------|
| Human Approved | Material outputs and production changes require human approval commensurate with risk |
| Evaluation Driven | No AI capability ships without measurable evaluation against golden sets |
| Retrieval Before Generation | Ground claims in retrieved evidence when facts matter |
| Evidence Before Confidence | Cite provenance; refuse or escalate when ungrounded |
| Bounded Authority | Agents operate inside explicit tool, data, and action allowlists |
| Observable by Default | Tokens, cost, latency, tool calls, and evaluation scores are logged |
| Reversible Preferable | Prefer reversible actions; irreversible actions escalate |
| Least Privilege | Minimum credentials, scopes, and repository permissions |

---

## Human-in-the-Loop (HITL)

### Definition

HITL means a named human role must approve, reject, or escalate a decision **before** the system commits a material side effect. Logging alone is not HITL. Auto-approval with post-hoc review is not HITL for high-risk actions.

### Risk Classes

| Class | Examples | HITL requirement |
|-------|----------|------------------|
| **R0 — Advisory** | Draft summaries, local lint suggestions, non-binding brainstorming | Optional review |
| **R1 — Internal draft** | PR description drafts, internal docs, eval report drafts | Should review before merge/publish |
| **R2 — Customer-visible draft** | Emails, resume text, support replies, marketing copy | Must human-approve before send/publish |
| **R3 — Production change** | Deployments, schema migrations, prompt promotions, model swaps | Must human-approve with evidence pack |
| **R4 — Irreversible / regulated** | Data deletion, legal commitments, financial transfers, privilege grants, production secret rotation affecting many tenants | Must dual-control or designated approver; ADR if automated |

**Dual-control rule (canonical):** Dual-control (or designated approver) is required for **R4 workflows**, and for any workflow whose maximum tool **`side_effect_class` is `irreversible` at R3+**. Offline eval PASS does not satisfy R2+ HITL. Side-effect taxonomy: [`TOOLS.md`](TOOLS.md) (`read` \| `draft` \| `write` \| `irreversible`).

Projects shall map every AI workflow to a risk class in `AI_GUIDELINES.md` (project) or architecture docs.

### Approval Artifacts

Every R2+ approval shall record:

- Approver identity  
- Timestamp  
- Artifact version / commit / prompt version  
- Evaluation summary or link to harness run  
- Decision: approve / reject / escalate  
- Residual risk notes  

### Escalation

Agents shall escalate when:

- Confidence is below the configured threshold  
- Retrieval returns conflicting sources  
- Tools fail repeatedly or return unexpected schemas  
- The requested action is outside the allowlist  
- Policy, privacy, or safety classifiers fire  
- Cost or latency budgets would be exceeded  

Escalation shall produce a human-readable packet: goal, attempted steps, evidence, blockers, recommended next action.

---

## Prohibited Authority

AI systems and coding agents **must not**, without explicit human authority documented for that workflow:

1. Approve their own production promotions  
2. Modify security controls, IAM policies, or firewall rules in production  
3. Exfiltrate secrets, dump credentials, or write secrets into logs/docs  
4. Bypass evaluation or quality gates  
5. Disable observability, audit logging, or HITL checkpoints  
6. Commit legally binding statements as the company without counsel/approver  
7. Permanently delete customer data outside an approved retention/disposal workflow  
8. Grant themselves elevated repository or cloud permissions  
9. Train or fine-tune on customer data without a recorded data-use decision  
10. Claim compliance certification or legal conclusions as authoritative fact  

Violations are non-conformant to MES regardless of model capability.

---

## AI Bounds (What AI May Do)

AI **may**:

- Draft code, tests, docs, diagrams, and ADRs for human review  
- Propose refactors with diffs and risk notes  
- Run read-only analysis, search, and local tests inside allowed sandboxes  
- Retrieve and summarize evidence with citations  
- Score drafts against rubrics and golden datasets  
- Suggest tool calls within schema-validated allowlists  
- Generate synthetic evaluation data labeled as synthetic  

AI **should**:

- Prefer smallest sufficient change  
- Prefer existing patterns in the repository  
- Prefer failing closed when uncertain  
- Prefer citing files and evidence over inventing APIs  

AI **must**:

- Respect repository `CONTRIBUTING.md`, security docs, and this standard  
- Preserve secrets handling (use `.env.example`, never invent production credentials)  
- Keep CareerPilot and other products as examples only inside MES itself  

---

## Agent / Human Contract for Coding Agents

This section is normative for approved coding agents operating in MoniGarr repositories (examples of agent products appear under Tool-Specific Notes; the binding allowlist is project `AGENTS.md` / `CLAUDE.md` / equivalent).

### Shared Operating Rules

1. **Read before write.** Inspect relevant docs and code before changing behavior.  
2. **Plan for non-trivial work.** State intent for multi-file or architectural changes.  
3. **Do not invent MES policy.** If standards conflict, follow `SYSTEM_CONTEXT.md` hierarchy.  
4. **Do not expand scope.** Avoid drive-by refactors unrelated to the task.  
5. **Prove when possible.** Prefer tests, evals, typechecks, or harness runs as evidence.  
6. **Leave the tree operable.** Do not leave half-applied migrations or broken builds knowingly.  
7. **Ask when blocked on secrets or credentials.** Never fabricate production keys.  
8. **Respect HITL.** Do not merge, deploy, or publish without the human’s explicit instruction when the action is R2+.  

### Tool-Specific Notes

Notes below are illustrative defaults for common agent products. Projects **shall** name approved agents in `AGENTS.md` (or equivalent); unlisted agents inherit Shared Operating Rules only.

#### Cursor

- Follow project rules, skills, and user rules.  
- Prefer repository skills when they match the task.  
- Use parallel read-only exploration; avoid speculative mass edits.  
- For frontend design, obey project design rules; do not invent a new visual system unless asked.  

#### Codex / OpenAI coding agents

- Treat MES docs and project `AI_GUIDELINES.md` / `AGENTS.md` / `CLAUDE.md` as binding.  
- Prefer patch-oriented changes with clear summaries.  
- Do not mark work complete without stating verification performed or explicitly deferred.  

#### Claude Code

- Honor `CLAUDE.md` and repo instruction files as the local contract.  
- Keep tool use least-privilege; do not request broad filesystem writes for read tasks.  
- When summarizing, separate facts observed in-repo from inferences.  

#### Gemini CLI

- Same MES contract; no special exemptions.  
- Prefer explicit file paths and command transcripts in status updates.  
- Do not silently rewrite standards docs unless the task asks for it.  

### Required Project Instruction Files

Every MoniGarr product repository should provide at least one of:

- `AI_GUIDELINES.md` (project instantiation of this standard)  
- `AGENTS.md` or `CLAUDE.md` (agent-facing operating notes; **approved coding agents** listed here)  
- `CONTRIBUTING.md` with an AI section  

The project file may narrow permissions further; it must not weaken MES prohibited authority.

---

## Regulated Data Profiles (Summary)

Posture guidance—not a certification claim. **Do not duplicate the routing matrix here.**

Canonical owner: [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md) (data-routing matrix, clinical/benefits human authority, DSAR/erasure, retention overlays).

Coding-agent minimum:

1. Classify data before model egress.  
2. Restricted / CUI / PHI (when in scope) → `class.local_private` (or subclass) with residency veto — see REGULATED_PROFILES.  
3. Secrets / credentials → no model egress.  
4. Enforce via ClassificationEnforcer + Model Gateway ([`MODEL_ROUTING.md`](MODEL_ROUTING.md)).  

Projects **shall** instantiate overlays in `PRIVACY_DATA_GOVERNANCE.md` / architecture when regulated classes apply.

---

## Decision Rights Matrix

| Decision | AI may recommend | AI may execute | Human must approve |
|----------|------------------|----------------|--------------------|
| Local code edit in feature branch | Yes | Yes (if tasked) | Before merge if R2+ impact |
| Merge to protected main | Yes | No | Yes |
| Production deploy | Yes | No (unless approved automation) | Yes |
| Prompt library promotion | Yes | No | Yes |
| Model router default change | Yes | No | Yes + cost/eval evidence |
| Customer message send | Yes (draft) | No | Yes |
| Schema migration | Yes | Staging only if allowed | Yes for production |
| Secret rotation | Plan only | No | Yes |

---

## Safety and Privacy Bounds

1. Classify data before sending to external model providers.  
2. Redact secrets, tokens, and regulated identifiers from prompts and logs.  
3. Prefer enterprise-approved model endpoints for non-public data.  
4. Do not paste customer PII into public model playgrounds.  
5. Record data-residency constraints in architecture and privacy docs.  
6. Treat prompt logs as sensitive telemetry with retention limits (see [`MEMORY.md`](MEMORY.md)).  

**Example (CareerPilot):** Resume text and job-application drafts are customer-sensitive; drafts may be model-assisted, but publish/send actions remain HITL R2+.

---

## Regulated Profile Overlays

When a product processes CUI, PHI/ePHI, or sovereign/community-protected data, adopt the optional overlays in [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md). That document **owns** the data-routing matrix, clinical/benefits human authority, DSAR/erasure across RAG and memory, and project-defined AI log retention. Profiles are **not** ATO, FedRAMP, or HIPAA certification. Do not duplicate the routing matrix in this file.

---

## Evaluation and Release Coupling

No AI capability is “done” because a demo looked good. Before production:

- Golden evaluation suite passes thresholds ([`EVALS.md`](EVALS.md), [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md))  
- Harness gates are green ([`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md))  
- Cost and latency within budget ([`MODEL_ROUTING.md`](MODEL_ROUTING.md))  
- Documentation and ownership updated  
- Required HITL approvals recorded  

---

## Failure Modes and Required Behavior

| Failure | Required behavior |
|---------|-------------------|
| Hallucinated API / file | Stop; verify against repo; do not invent |
| Conflicting retrieval | Present conflict; escalate or retrieve more |
| Tool timeout | Retry with backoff per tool policy; then escalate |
| Eval regression | Block promotion; open defect with failing cases |
| Budget overrun | Stop loop; report cost; propose cheaper route |
| Ambiguous user intent on destructive action | Ask; do not guess |

---

## Documentation Duties for AI-Assisted Changes

When AI assists a material change, the resulting PR or change record should include:

- Intent summary  
- Files touched  
- Tests/evals run  
- Residual risks  
- Whether prompts, tools, routers, or memory schemas changed  

Silent prompt drift is non-conformant (see [`PROMPTS.md`](PROMPTS.md)).

---

## Conformance Checklist

A project conforms to this standard when:

- [ ] Risk classes are mapped for AI workflows  
- [ ] HITL gates exist for R2+ actions  
- [ ] Prohibited authority list is enforced in tools and runbooks  
- [ ] Coding-agent instruction files exist and point to MES  
- [ ] Eval/harness gates block unsafe promotion  
- [ ] Observability covers tokens, cost, failures, and approvals  
- [ ] Privacy/redaction rules are documented and tested  
- [ ] CareerPilot or other products appear only as examples inside MES itself  

---

## Anti-Patterns

- “The model said so” as architecture justification  
- Unlimited agent autonomy in production  
- Shipping without golden evals  
- Letting agents approve their own releases  
- Mixing unredacted PII into shared prompt logs  
- Treating MES examples as product requirements  

---

## Related Standards

- Operating model and quality gates: [`../Governance/MOM.md`](../Governance/MOM.md)  
- Intelligence discipline: [`../Governance/MILE.md`](../Governance/MILE.md)  
- Architecture handbook: [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md)  
- Agent team design: [`AGENTS.md`](AGENTS.md)  
- Delegation: [`SUBAGENTS.md`](SUBAGENTS.md)  

---

## Project Instantiation Guide

Every product repository should create a project-level `AI_GUIDELINES.md` that:

1. Links to this MES document as the parent standard  
2. Maps each AI workflow to risk class R0–R4  
3. Names HITL approver roles  
4. Lists prohibited tools/actions for coding agents in that repo  
5. Points to eval/harness entrypoints  
6. States data classes allowed in external model calls  

Template skeleton:

```markdown
# AI Guidelines — [PROJECT]
Parent: MES AI/AI_GUIDELINES.md v1.0.0
## Workflow Risk Map
| Workflow | Risk | HITL role | Eval suite |
|----------|------|-----------|------------|
| ... | R2 | ... | ... |
## Coding Agent Notes
...
## Data Handling
...
```

---

## Pairing with CONTRIBUTING and CLAUDE.md

| File | Audience | Duty |
|------|----------|------|
| MES `AI/AI_GUIDELINES.md` | Company-wide | Normative bounds |
| Project `AI_GUIDELINES.md` | Product | Instantiation |
| `CONTRIBUTING.md` | Humans + agents | How to change the repo |
| `CLAUDE.md` / `AGENTS.md` | Coding agents | Local operating contract |

Conflicts resolve via `SYSTEM_CONTEXT.md` hierarchy. Project files may tighten, not loosen, prohibited authority.

---

## Audit Questions for Reviews

Reviewers of AI-touching PRs should ask:

1. Did risk class change?  
2. Were prompts/tools/routes version-bumped?  
3. Which harness profile went green?  
4. What can the agent newly write?  
5. Is there a rollback?  
6. Were secrets or PII handling reviewed?  

---

## Example (CareerPilot) — HITL Moments

| Moment | Risk | Approver |
|--------|------|----------|
| Draft resume shown in UI | R2 (draft) | User self-approve sufficient for viewing |
| Export/share externally | R2 | User explicit action |
| Auto-apply to jobs | R3/R4 | Must not be silent; requires design + HITL |
| Prompt promotion for resume.system | R3 | Eng owner + scorecard |

---

## Change Control

AI authority and HITL policy changes **shall** follow MILE ([`../Governance/MILE.md`](../Governance/MILE.md)) and MOM quality gates. Architecture-impacting autonomy changes **should** appear in [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) or an ADR.

---

## See Also (Sibling Index)

- [`AGENTS.md`](AGENTS.md) · [`SUBAGENTS.md`](SUBAGENTS.md) · [`PROMPTS.md`](PROMPTS.md) · [`TOOLS.md`](TOOLS.md) · [`EVALS.md`](EVALS.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`MEMORY.md`](MEMORY.md) · [`RAG.md`](RAG.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) · [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md)

---

## Revision History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-07-12 | Initial MES AI Guidelines; regulated data profiles; approved agents via project AGENTS.md |
