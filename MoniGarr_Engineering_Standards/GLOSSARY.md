# GLOSSARY — MoniGarr Engineering Standards (MES) v1.1

**MES Version:** 1.1.0  
**Status:** Engineering Standard — Reference-grade engineering lexicon  
**Owner:** MoniGarr Engineering  
**Applies To:** All MES documents and conforming projects  
**Canonical Path:** `GLOSSARY.md`  
**See Also:** [`SYSTEM_CONTEXT.md`](SYSTEM_CONTEXT.md) · [`MDES.md`](MDES.md) · [`Governance/MOM.md`](Governance/MOM.md) · [`Governance/MILE.md`](Governance/MILE.md) · [`Architecture/ARCHITECTURE.md`](Architecture/ARCHITECTURE.md) · [`Governance/ADR_GUIDE.md`](Governance/ADR_GUIDE.md) · [`Governance/CONTRIBUTING.md`](Governance/CONTRIBUTING.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

Shared vocabulary prevents humans and AI agents from optimizing different definitions of “done,” “safe,” or “ready.”

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`AI/REGULATED_PROFILES.md`](AI/REGULATED_PROFILES.md), map external authorities via [`REFERENCES.md`](REFERENCES.md), and follow the Regulated Operations Overlay in [`Governance/MOM.md`](Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## How to Use This Glossary

1. Prefer the **Concept Taxonomy** below when browsing by domain.  
2. Prefer the **Alphabetical Lexicon** when looking up a specific term.  
3. Terms are normative for MES documents unless a project ADR redefines a term locally with explicit scope. Normative language follows RFC 2119 / RFC 8174 unless otherwise stated.  
4. **Example (CareerPilot)** labels are illustrations, not MES product requirements.  
5. Prefer these spellings and expansions in docs, ADRs, and eval reports.

---

## Concept Taxonomy

Enterprise readers often think in domains rather than letters. This taxonomy maps major concepts to the alphabetical lexicon.

### AI Concepts

- Agent · Agent Memory · Agent Team · Context Engineering · Context Window · Eval / Evaluation · Eval Golden Set · Execution (Agent) · GraphRAG · Hallucination · Harness Engineering · Loop Engineering · MCP · Model Routing · Planning (Agent) · Prompt · Prompt Injection · RAG · Reflection (Agent) · Structured Output · Tool Calling

### Architecture

- Boundary · Capability · Component · Contract · Dependency · Domain · Module · Platform · Product · Service

### Engineering

- Continuous Improvement · Definition of Done · Engineering Judgment · Evidence · Ownership · Quality Gate · Refactoring · Reliability · Technical Debt · Observability

### Governance (M.O.M.)

- Accountability · ADR · Conditionally Conformant · Continuous Improvement · Decision · Decision Record · Engineering Judgment · Evidence · Evidence Pack · Governance · Ownership · Quality Gate · Suite Owner

### Risk & Resilience

- Availability · Backward Compatibility · Idempotency · Reliability · Resilience · Risk

### Security

- Authentication · Authorization · CUI · Defense in Depth · Identity · Least Privilege · PII · Prompt Injection · SBOM · Secrets · Supply Chain · Threat Model · Zero Trust

### Data

- Canonical Data · Data Classification · Data Contract · Data Lineage · Deletion · Immutable · Provenance · Retention · Schema

### Operations / DevOps

- Blue/Green · Canary · Deployment · Feature Flag · Incident · Infrastructure as Code (IaC) · MTTR · On-Call · Release · Rollback · Runbook · SLI / SLO · Terraform

### Agent Lifecycle Distinctions

Many multi-agent systems distinguish these phases (all defined alphabetically):

| Phase | Role |
|-------|------|
| **Planning** | Decide goals, steps, and tool strategy before acting |
| **Execution** | Perform tool calls / generation according to the plan |
| **Reflection** | Critique intermediate results and decide repair or escalate |
| **Evaluation** | Score outcomes against rubrics, golden sets, or gates |

---

## Alphabetical Lexicon

## A

### Acceptance Criteria
Testable conditions that must be true for a user story, feature, or release gate to be considered complete.

### Accountability
The obligation to answer for outcomes of a decision, system, or release. Distinct from **Ownership**: ownership names who stewards an asset; accountability names who is answerable when it fails, drifts, or harms. Humans remain accountable under MES even when AI assists.

### ADR (Architecture Decision Record)
A short, versioned document recording a significant architectural or engineering decision, options considered, and consequences. See [`Governance/ADR_GUIDE.md`](Governance/ADR_GUIDE.md). See also **Decision** and **Decision Record**.

### Agent
A bounded software actor (often LLM-backed) with a defined purpose, inputs, outputs, tools, memory, evaluation, failure modes, and escalation rules. Prefer specialized agents over monolith agents.

### Agent Memory
Persisted or session-scoped state an agent may read/write under policy (working, session, project, long-term, reference). Must have classification, retention, ACL, and promotion rules — not unbounded chat dumps. See **Memory (AI)** and [`AI/MEMORY.md`](AI/MEMORY.md).

### Agent Team
A coordinated set of specialized agents with explicit handoffs, shared contracts, and a deterministic orchestration layer.

### AI-Native
Designed from the start so intelligence (models, retrieval, agents, evals) is a first-class architectural capability with governance, not a bolted-on chatbot. AI-Native does **not** mean unbounded autonomy.

**Relationship:** **AI-Native** is the architectural posture (intelligence is a governed platform capability). Prefer this spelling in MES normative text.

### AI First
A design stance that assumes intelligence-assisted workflows early, while still requiring deterministic control planes and HITL for material risk. Prefer the spelling **AI First** (two words, capital F) in MES docs.

**Relationship:** **AI First** is a delivery stance (“start assuming AI assistance”). It is a subset of responsible AI-Native practice — not a license for unbounded autonomy. When in doubt, use **AI-Native** for architecture and **AI First** only for workflow/product timing language.

### Audit Event
A security- or compliance-relevant log record that must be integrity-protected and retained per policy; fail closed when required by security posture.

### Authentication
Verifying the identity of a user, service, agent, or system (proving *who* or *what* is calling). Distinct from **Authorization**.

### Authorization
Determining whether an authenticated principal is allowed to perform an action or access a resource (proving *what they may do*). Distinct from **Authentication**.

### Availability
The ability of a system to serve authorized requests when needed, typically expressed via uptime, SLIs/SLOs, and degrade modes. Related to but distinct from **Reliability** and **Resilience**.

---

## B

### Backward Compatibility
The property that newer versions of an API, schema, event, prompt contract, or data format continue to work with existing clients without breaking changes — or that breaking changes are versioned and migrated deliberately (SemVer MAJOR).

### Blue/Green
A deployment strategy with two production environments (blue and green); traffic switches to the new environment after validation, enabling fast rollback by switching back.

### Boundary
An explicit contract describing what a component, service, agent, or team owns, and what it deliberately does not own. Boundaries reduce coupling, improve accountability, and enable safe evolution.

---

## C

### C4 Model
Context, Container, Component, Code — diagram levels used in MES Architecture companions to describe systems at progressive zoom.

### Canary
A progressive deployment that exposes a change to a small percentage of traffic or tenants first, with gates on errors, latency, evals, and business KPIs before full rollout.

### Canonical Data
The authoritative, agreed representation of an entity or fact for a bounded context — the form other systems should treat as SoT for that domain (often after master-data or anti-corruption mapping).

### Capability
A coherent business or technical ability the organization delivers (e.g., “identity,” “billing,” “retrieval,” “agent orchestration”). Capabilities help map products, services, and ownership without confusing them with deployment units.

### CareerPilot
A MoniGarr product domain used in MES **only** as an illustrative example (`Example (CareerPilot)`). Not a requirement of the MES constitution.

### Change Failure Rate
Share of deployments causing incident, rollback, or hotfix — a M.O.M. engineering KPI.

### ClassificationEnforcer
AI-orchestration component that applies data-sensitivity and residency labels before model or regulated egress calls. Required when sensitivity labels apply. See [`Architecture/ARCHITECTURE.md`](Architecture/ARCHITECTURE.md) §2.5 and [`Architecture/C4/Level3_Component.md`](Architecture/C4/Level3_Component.md).

### Component
A cohesive unit of software within a container (C4 Level 3) with a clear responsibility and interface. Smaller than a **Service**; larger than a single function.

### Conformance (MES)
A project’s declared adherence to MES lifecycle, quality gates, documentation, and Parts mapping. Deviations require ADRs.

### Conditionally Conformant
A documentation or suite state meaning: suitable for production use, with identified constitutional or Material issues remaining open under named owners and closure criteria. Distinct from **Conformant** (all mandatory MDES + MCR requirements met with evidence). Canonical states: [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md) § Disposition. Conditionally Conformant **shall not** be marketed as Conformant.

### Conformant (documentation)
See **MDES Conformant**. Suite Conformant additionally requires zero unresolved Material MCR findings and filed evidence cited from Document Status.

### Context Engineering
The deliberate design and assembly of everything a model sees for a task: system instructions, retrieved evidence (RAG/GraphRAG), memory tiers, tool results, schemas, examples, and token budgets — so generation is grounded, bounded, and evaluable rather than free-form. Includes query rewrite, metadata/ACL filtering, ranking, re-ranking, compression, citation anchors, and provenance. See [`AI/RAG.md`](AI/RAG.md), [`AI/MEMORY.md`](AI/MEMORY.md), and Architecture Parts III–IV.

### Context Window
The maximum amount of tokens (input + output, depending on provider accounting) a model can process in one call. Context engineering must fit authorized evidence and instructions within this budget without dropping citation anchors or critical constraints.

### Continuous Evaluation
Ongoing measurement of AI/system quality (including production sampling where authorized) against thresholds, not one-time demo checks.

### Continuous Improvement
The M.O.M. practice of repeatedly improving software, documentation, tooling, automation, evaluations, and outcomes — never treating a release as the end of learning. Improvements are change-controlled; silent drift is non-conformant.

### Contract
A versioned agreement defining expected inputs, outputs, schemas, behaviors, failure conditions, compatibility guarantees, and ownership between software components, services, agents, or teams. Includes API contracts, event contracts, data contracts, and agent/tool contracts.

### Control Plane
Privileged runtime group for policy decisions (PDP), registries, and secrets/KMS brokerage. Distinct from request-path application and AI orchestration runtimes. **Shall not** share runtime with untrusted request parsing without ADR. See [`Architecture/ARCHITECTURE.md`](Architecture/ARCHITECTURE.md) §2.4–2.7.

### CUI (Controlled Unclassified Information)
US government information category requiring safeguarding; treated as restricted in MES security/privacy templates.

---

## D

### Data Classification
Labeling data by sensitivity and handling rules (e.g., public, internal, PII, CUI, regulated). Classification drives encryption, access, retention, logging redaction, and AI eligibility.

### Data Contract
A versioned agreement about the meaning, schema, quality, ownership, and compatibility guarantees of a dataset or interface between producers and consumers.

### Data Lineage
The traceable path of data from origin through transforms, stores, models, and outputs — who produced it, how it changed, and where it was used. Related to **Provenance** (often claim/citation-level).

### Decision
A deliberate choice among alternatives that affects architecture, risk, or operating practice. Significant decisions **shall** be recorded (see **Decision Record** / **ADR**).

### Decision Record
Any durable record of a decision and its rationale. **ADR** is the MES-preferred form for architectural and significant engineering decisions.

### Defense in Depth
Layering multiple independent security controls so compromise of one control does not yield total failure (network, identity, app, data, monitoring, human process).

### Deletion
The controlled removal or cryptographic erasure of data per policy, user rights, or legal requirement — including derived copies (indexes, embeddings, backups) as applicable. Distinct from soft-hide without retention proof.

### Dependency
An external or internal component a system relies on (library, service, model provider, dataset). Dependencies are supply-chain and reliability risks and must be inventoried (SBOM), pinned, and monitored.

### Deployment
The act of placing a built artifact into an environment (dev, staging, production). Distinct from **Release** (the product/version decision and evidence pack that makes a change customer-facing under governance).

### Determinism
The property whereby identical inputs, state, configuration, and execution conditions produce identical observable outcomes.

### Deterministic Control Plane
Software that reliably authorizes, validates, routes, and records probabilistic AI behavior (policy, schemas, tools, budgets, gates).

### Definition of Done
M.O.M. checklist: code, docs, tests, evals (if AI), security as required, monitoring, deploy or deferred-with-ADR, knowledge transfer.

### Domain
A bounded area of business knowledge and language (DDD). Domains drive ubiquitous language, bounded contexts, ownership, and service boundaries.

### Drift (Prompt / Model / Data)
Untracked change in prompts, models, retrieval corpora, or configs that alters behavior without review — prohibited for production paths.

---

## E

### Engineering Judgment
Human professional responsibility to interpret standards, weigh trade-offs, accept residual risk, and decide when AI proposals are fit for purpose. AI may accelerate analysis; engineering judgment remains human-owned under M.O.M.

### Enterprise Ready
Operational posture meaning the system can be run, monitored, secured, supported, and handed off under MES standards with evidence — **not** a marketing badge and **not** a substitute for formal certification.

### Eval / Evaluation
A measurable assessment of system or model behavior against expected outcomes, often via golden sets, rubrics, and thresholds. In multi-agent systems, **Evaluation** is also the phase that scores outcomes after planning/execution/reflection.

### Eval Gate
A release quality gate that blocks ship when evaluation scores fall below agreed thresholds.

### Eval Golden Set
A versioned, change-controlled corpus of fixed inputs and expected outcomes (or scoring rubrics) used as the authoritative benchmark for an AI capability. Model upgrades, prompt changes, and retrieval changes **shall** run against the same Eval Golden Set before promotion. Synonym in MES: **Golden Set / Golden Dataset**. See [`AI/GOLDEN_DATASETS.md`](AI/GOLDEN_DATASETS.md) and [`AI/EVALS.md`](AI/EVALS.md).

### Evidence
Observable artifacts that substantiate a claim of correctness, security, readiness, or quality (test results, eval reports, logs, traces, scans, approvals, screenshots, SBOMs). Assertions without evidence are non-conformant for production claims. See **Evidence Pack**.

### Evidence Pack
The assembled set of evidence artifacts proving a specific release, gate, or verification claim. Minimum contents for R3+ production claims **shall** include (or mark N/A with rationale):

| Artifact | Role |
|----------|------|
| Approver identity + timestamp | Human accountability |
| Policy / prompt / model / harness version pins | Reproducibility |
| Eval / golden gate results | Probabilistic proof |
| Deterministic test / coverage summary | Deterministic proof |
| Security scan / SBOM evidence | Supply-chain posture |
| Rollback or degrade plan | Operability |
| Decision + residual risk note | Audit trail |

Projects **may** add domain-specific artifacts. Distinct from **Evidence Bundle** (retrieval). See [`Governance/MOM.md`](Governance/MOM.md) and [`Engineering/RELEASE_PROCESS.md`](Engineering/RELEASE_PROCESS.md).

### Evidence Bundle
Structured package of retrieved chunks (or graph edges) with scores and provenance returned by a retriever before grounded generation. Distinct from **Evidence Pack** (release/gate proof). See [`AI/RAG.md`](AI/RAG.md).

### Execution (Agent)
The agent-lifecycle phase that carries out planned steps: tool calls, retrieval, and generation under policy, budgets, and timeouts. Distinct from **Planning**, **Reflection**, and **Evaluation**.

---

## F

### Factory Maxim
“AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.” Also called **MES Maxim**.

### Fail Closed / Fail Open
Fail closed: deny or stop when a critical control cannot run (authZ, required audit). Fail open: continue when a non-critical path fails (e.g., best-effort metrics export), with alerting.

### Feature Flag
A runtime switch that enables or disables behavior without a full redeploy, used for progressive delivery, kill switches, and experiments — with ownership, defaults, and cleanup rules.

---

## G

### Golden Set / Golden Dataset
A curated, versioned set of inputs and expected outcomes used to regress quality for models, retrieval, agents, or critical product paths. Changes are reviewed like code. Prefer the term **Eval Golden Set** when referring specifically to evaluation/release benchmarks.

### Governance
The system of principles, roles, decisions, rituals, documentation, quality gates, and accountability that keeps engineering activities aligned, auditable, and handoff-ready. In MES, **M.O.M.** is the governance operating model; **M.I.L.E.** governs intelligence specifically.

### GraphRAG
Retrieval-augmented generation that uses a knowledge graph (entities/relationships) in addition to or instead of flat vector retrieval, improving grounded multi-hop reasoning.

### Grounding
Binding model outputs to retrieved evidence or deterministic system state; ungrounded factual claims are treated as suspect.

---

## H

### Hallucination
Model output presented as fact that is not supported by authorized context, tools, or provenance. Measured via evals; mitigated by retrieval, schemas, refusal policies, and HITL.

### Harness / Harness Engineering
The discipline of giving every AI workflow a dedicated test harness: synthetic data, real/anonymized data, golden examples, edge cases, failure scenarios, regression tests, and cost/latency budgets, wired into CI so agents, prompts, retrieval, tools, and evals remain testable and repeatable. See [`AI/HARNESS_ENGINEERING.md`](AI/HARNESS_ENGINEERING.md) and Architecture Part IX.

### HITL (Human In The Loop)
Required human review or approval at defined risk checkpoints (e.g., production deploy, irreversible actions, sensitive communications).

### Hotfix
An expedited fix under release process rules; still requires proportional evidence and follow-up for debt.

---

## I

### Idempotency
The property that performing the same operation multiple times yields the same durable effect as performing it once (critical for retries, at-least-once messaging, and agent tool calls). Write tools **shall** define idempotency keys where practical.

### Identity
The unique representation of a principal (user, service, device, or agent) used for authentication, authorization, audit, and tenancy. Identity systems are a trust boundary.

### Immutable
Not changed in place after creation. Applies to release artifacts, golden set versions, signed images, and often audit logs (append-only). Enables reproducibility and trustworthy rollback.

### Incident
An unplanned disruption or degradation of service quality, security, or AI safety posture requiring operational response per severity.

### Infrastructure as Code (IaC)
Managing infrastructure through versioned, reviewable declarative or programmatic definitions (e.g., Terraform) rather than unreproducible console changes. See **Terraform**.

### Intelligence Stack
M.I.L.E. layered model: Product → Business Logic → AI Orchestration → Agents → Tools → Knowledge → Models.

### INCONCLUSIVE
Verification outcome when evidence is insufficient to claim VERIFIED or NOT VERIFIED; preferred over fabricated certainty.

---

## K

### KillSwitch
Emergency control that disables write / irreversible AI model egress and tool execution paths. Required pattern for R3+ write-capable AI systems: [`Architecture/C4/Level4_Code.md`](Architecture/C4/Level4_Code.md); platform component: Architecture Part III §3.1.

### Knowledge Graph
Structured representation of entities and relationships used for retrieval, reasoning, and provenance.

---

## L

### Lead Time
Elapsed time from work start (or commit) to production — a M.O.M. KPI.

### Legacy System
An existing system that remains in use but was not built (or fully modernized) under current MES standards. Brownfield work inherits MES for new changes and uses audit/gap plans for conformance debt.

### Least Privilege
Granting only the minimum permissions necessary for a principal, service, or agent tool to perform its function — default deny elsewhere.

### Loop Engineering
Disciplined, measured refinement of probabilistic outputs through structured iteration (for example Draft → Critique → Repair → Re-score → Compare → Improve → Evaluate → Approve), with each iteration recording prompt, response, evaluation, token cost, runtime, and quality score — never silent production drift. See [`AI/LOOP_ENGINEERING.md`](AI/LOOP_ENGINEERING.md) and Architecture Part VIII.

### LLM (Large Language Model)
Probabilistic text/multimodal model used under deterministic governance.

---

## M

### MCP (Model Context Protocol)
An open protocol for connecting AI applications to external tools, data sources, and context providers through standardized server/client interfaces. MCP servers are treated as **tools** under MES: schema, authZ, observability, and allowlisting apply. MCP does not bypass Model Gateway, HITL, or eval gates.

### Memory (AI)
Persisted context for agents/users with explicit lifecycle, classification, and retention rules — not unbounded chat logs as SoT. See **Agent Memory**.

### Material documentation change
A documentation change that alters behavior, normative requirements, security/privacy posture, architecture boundaries, or quality-gate definitions. Material documentation changes **shall** receive **MDES evaluation** and, for MES suite documents (or suite-affecting SoT/enum/hierarchy changes), an **MCR** (delta or broader) before merge or acceptance ([`MDES.md`](MDES.md), [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md)). Cosmetic edits (typos, link fixes without meaning change) are not material.

### Material risk
In M.O.M. and release language, **material risk** means **Risk Class R3+** unless a project ADR maps a narrower scope. Prefer naming the Risk Class explicitly (R0–R4) in PRs, ADRs, and Evidence Packs.

### MES (MoniGarr Engineering Standards)
Company-wide engineering constitution (this suite), versioned and product-agnostic.

### MES Maxim
See **Factory Maxim**.

### M.I.L.E. (MoniGarr Intelligence Led Engineering)
Standing standard for AI-native engineering: agents, evals, retrieval, loops, harnesses, HITL. Canonical: [`Governance/MILE.md`](Governance/MILE.md).

### M.O.M. (MoniGarr Operating Model)
Standing standard for governance, rituals, documentation, quality gates, and lifecycle. Canonical: [`Governance/MOM.md`](Governance/MOM.md).

### MDES (MoniGarr Documentation Excellence Standard)
Standing standard for evaluating documentation quality across the MES suite and MES-conformant project docs. Defines criteria, scoring (0–10), passing thresholds, required evidence, and review cadence. Complements [`Engineering/DOCUMENTATION_STANDARDS.md`](Engineering/DOCUMENTATION_STANDARDS.md) (authoring rules). Canonical: [`MDES.md`](MDES.md).

### MDES Conformant
A document that meets MDES passing thresholds: no criterion below **8**, average **9.0 or higher**, no unresolved contradictions, valid cross-references, glossary-aligned terminology, consistent normative language, and reviewer findings resolved or ADR-documented. Conformance is evidence-based, not declaration-based. See also **Conditionally Conformant**.

### MDES Excellence
Stricter optional bar than **MDES Conformant**: no criterion below **9**, average **9.5 or higher**, plus the same contradiction/cross-reference/glossary/normative requirements. See [`MDES.md`](MDES.md). Do not claim Excellence without recorded criterion scores.

### MDES Excellence 10
Exemplary recognition: every MDES criterion scores **10** (average **10.0**), with filed evidence and no unresolved Material MCR findings on the claimed scope. Named Bootstrap/scaffold exceptions may remain outside the scored published corpus. See [`MDES.md`](MDES.md).

### Model Gateway
The sole production egress for model inference under MES: policy-checked routing, authZ, budgets, logging, and provider abstraction. Agents and services **shall not** call provider SDKs directly in production paths. See [`Architecture/ARCHITECTURE.md`](Architecture/ARCHITECTURE.md) Part III and [`AI/MODEL_ROUTING.md`](AI/MODEL_ROUTING.md).

### Model Routing
Policy-driven selection of which model (or model tier) handles a request based on task class, risk, latency, cost, capability, and data-handling constraints — implemented via the Model Gateway / router, not ad-hoc SDK calls. See [`AI/MODEL_ROUTING.md`](AI/MODEL_ROUTING.md).

### Module
A source-level packaging unit (package/namespace) that groups related code. Distinct from **Component** (runtime/design unit) and **Service** (deployable boundary).

### MTTR (Mean Time To Recovery)
Average time to restore service after an incident — a M.O.M. KPI.

### Mutation Score
Portion of seeded code mutants killed by tests; optional quality signal where mutation testing is used.

---

## O

### Observability
Ability to understand system behavior via logs, metrics, traces, and (for AI) prompt/retrieval/eval telemetry — without guessing. Canonical: [`Engineering/OBSERVABILITY.md`](Engineering/OBSERVABILITY.md).

### On-Call
Operational duty to respond to incidents per severity and escalation; see [`Engineering/ONCALL.md`](Engineering/ONCALL.md).

### OpenTelemetry (OTel)
Vendor-neutral telemetry standard (traces, metrics, logs) used as the MES default instrumentation approach unless an ADR selects an equivalent.

### Orchestration
Deterministic coordination of agents, tools, and workflows; models propose, orchestration disposes per policy.

### Ownership
Named stewardship of a system, document, prompt, service, or metric — who maintains it and is the primary contact. Distinct from **Accountability** (answerability for outcomes).

---

## P

### PII (Personally Identifiable Information)
Data that can identify a person; subject to privacy controls and redaction rules in logs/telemetry.

### Planning (Agent)
The agent-lifecycle phase that produces goals, steps, tool strategy, and stop conditions before **Execution**. Plans should be inspectable and budget-bounded.

### Platform
Shared capabilities consumed by multiple products (e.g., identity, Model Gateway, eval runners, observability). Platforms have versioned contracts and stronger stability obligations than single products.

### POA&M
Plan of Action and Milestones — tracked remediation for security findings (template language; not automatic certification).

### Product
A customer- or business-facing offering with its own PRD, users, and outcomes. A product may compose multiple services and consume platforms.

### Production Ready
Means the acceptance standard in MES README can be answered with evidence (boundaries, AI limits, tests/evals, HITL, failure modes, data handling, onboarding). **Not** a synonym for “demo works.”

### Prompt
Versioned instruction/content sent to a model; treated as a code-like artifact with review, eval, and change control.

### Prompt Injection
An attack or accidental pattern where untrusted content (documents, web pages, user text, tool output) manipulates model behavior to ignore policy, exfiltrate data, or misuse tools. Mitigations: treat untrusted text as data, tool allowlists, output handling, evals, and HITL. See Red Team (AI).

### Provenance
Traceable origin of a claim, document chunk, graph edge, or model output citation — required for grounded enterprise answers. Related to **Data Lineage**.

---

## Q

### Quality Gate
A mandatory checkpoint that must pass before merge, promote, or release (tests, evals, scans, reviews, approvals). Eval gates and security gates are types of quality gates under M.O.M.

---

## R

### RAG (Retrieval-Augmented Generation)
Pattern that retrieves authorized context before generation to improve grounding and reduce hallucination.

### Red Team (AI)
Adversarial testing for prompt injection, tool abuse, data exfiltration, and jailbreaks.

### Refactoring
Changing internal structure without intentionally changing external behavior, to reduce complexity or technical debt — backed by tests/evals so behavior stays proven.

### Reflection (Agent)
The agent-lifecycle phase that critiques intermediate results (quality, grounding, policy) and decides whether to repair, replan, escalate, or proceed to **Evaluation**.

### Regression (Eval)
Failure of a previously passing golden case after a change — blocks release when under gate.

### Release
A governed version of software (and related artifacts) made available to users or operators, with changelog, evidence pack, and approval. Distinct from **Deployment** (placing bits in an environment).

### Reliability
The ability of a system to perform its required functions under stated conditions for a stated period — correctness + consistency over time. Measured via SLIs/SLOs, error budgets, and defect escape rate.

### Render
Cloud PaaS used by some MoniGarr deployments for services, cron, and disks; PaaS convenience does not waive MES secrets, observability, or rollback requirements. See [`Engineering/DEVOPS.md`](Engineering/DEVOPS.md).

### Resilience
The ability to absorb failures, degrade gracefully, recover, and continue operating (timeouts, retries, circuit breakers, bulkheads, backups, failover). Related to but broader than **Availability**.

### Retention
How long data (and derived artifacts) are kept before deletion or archive, driven by classification, law, and product policy.

### Retrieval
Deterministic or hybrid search over corpora/graphs/memory prior to generation.

### Retrieval Diagnostics
Telemetry answering what was retrieved, scores/ranks, index/corpus/graph version, ACL filters, misses, and grounding attachment — required for RAG/GraphRAG operability.

### Risk
The combination of likelihood and impact of an undesirable event. MES manages risk through architecture, evidence, testing, monitoring, operational controls, and governance. **Risk Class** (R0–R4) drives HITL and gate strength.

<a id="risk-class"></a>
### Risk Class (R0–R4)

AI / agent workflow risk classification that determines HITL strength. **Canonical owner:** [`AI/AI_GUIDELINES.md`](AI/AI_GUIDELINES.md) (full table and policy). Prefer linking there rather than duplicating the matrix in procedural docs.

| Class | HITL (summary) |
|-------|----------------|
| **R0 — Advisory** | Optional review |
| **R1 — Internal draft** | Should review before merge/publish |
| **R2 — Customer-visible draft** | Must human-approve before send/publish |
| **R3 — Production change** | Must human-approve with Evidence Pack |
| **R4 — Irreversible / regulated** | Dual-control or designated approver; ADR if automated |

Projects **shall** map every AI workflow to a risk class. Full examples and dual-control coupling: [`AI/AI_GUIDELINES.md`](AI/AI_GUIDELINES.md).

### Bootstrap (catalog)

A living inventory disposition below the MDES Conformant bar (for example [`PRODUCTS.md`](PRODUCTS.md)). Entries may be incomplete or unverified. Agents and humans **shall** verify before relying on Bootstrap catalogs as SoT. Distinct from **Revise** (fix required) and **Accept**.

### Explainable (AI)

Outputs and decisions are inspectable via provenance, retrieval diagnostics, structured traces, and evaluation artifacts such that a human can determine *why* a result was produced. Prefer grounded citations over opaque confidence claims. See [`AI/RAG.md`](AI/RAG.md) and [`Engineering/OBSERVABILITY.md`](Engineering/OBSERVABILITY.md).

### MES Coherence Review (MCR)

Suite-integrity review that checks source-of-truth alignment, terminology, canonical enums, cross-references, hierarchy, and contradictory guidance across MES documents. Complements **MDES** (per-document excellence). Canonical process: [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md).

### Rollback
Reverting an environment to a prior known-good artifact, configuration, or prompt/model pin after a failed deployment or release.

### RPO / RTO
Recovery Point Objective (acceptable data loss window) and Recovery Time Objective (acceptable downtime to restore).

### Runbook
Operator procedure for diagnosis, mitigation, and recovery for a known class of incidents.

---

## S

### SBOM (Software Bill of Materials)
Inventory of components/dependencies for supply-chain review and release evidence. Necessary but not sufficient for **Supply Chain** security.

### Schema
A formal description of structure and types for data, events, APIs, tool arguments, or memory records. Schemas enable validation, contracts, and safe evolution.

### Secrets
Credentials and sensitive configuration (API keys, tokens, passwords, private keys, connection strings) that must never be committed to git and must be injected via secret stores with rotation and least privilege.

### Security Posture (MES)
Risk-based controls, evidence, and operational governance defined by MES and project security artifacts. **Not** a certification, ATO, or compliance attestation by itself. See [`Engineering/SECURITY.md`](Engineering/SECURITY.md).

### SemVer (Semantic Versioning)
`MAJOR.MINOR.PATCH` versioning scheme used by default in MES release process. See [`Engineering/RELEASE_PROCESS.md`](Engineering/RELEASE_PROCESS.md).

### Service
A separately deployable unit that owns a capability boundary and exposes contracts (APIs/events). Distinct from **Product** (offering) and **Platform** (shared capability layer).

### Severity (Sev)
Incident impact classification (e.g., Sev-1 to Sev-4) driving response time and escalation.

### Side-effect Class
Declared mutation posture of an agent tool or workflow step: `read` | `draft` | `write` | `irreversible`. Gates HITL and whether durable systems of record may change. Canonical: [`AI/TOOLS.md`](AI/TOOLS.md). Agent contracts and loop contracts **shall** use this field name (`side_effect_class`) and enum — not legacy spellings such as `draft_only` or `write-with-HITL`. Dual-control is required for **R4 workflows**, and for **`irreversible` at R3+** (see **Risk Class** and [`AI/AI_GUIDELINES.md`](AI/AI_GUIDELINES.md)).

### SLI / SLO
Service Level Indicator (measurable) and Service Level Objective (target over a window). Used for classical reliability and AI quality/cost journeys.

### SoT (Source of Truth)
Authoritative artifact for a domain. Suite-level SoT hierarchy is defined in [`SYSTEM_CONTEXT.md`](SYSTEM_CONTEXT.md). Chat is not SoT.

### SSP / SAR / SAP
Security authorization package artifacts (System Security Plan, Security Assessment Report, Security Assessment Plan) referenced in templates as starter language — not proof of ATO by themselves.

### Structured Output
Model responses constrained to a declared schema (JSON Schema, typed objects, tool-call arguments) and validated deterministically before side effects. Preferred over free-form text for agent/tool pipelines.

### Supply Chain
The end-to-end path of software and AI dependencies: source, packages, containers, CI actions, model providers, datasets, and build provenance. Controls include pinning, scanning, SBOM, signing/attestation, least-privilege CI, and vendor due diligence.

### Suite Owner
The accountable human for MES suite Accept / Conformant claims (defaults to MoniGarr Engineering architect of record). Defined in [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md) § Roles.

---

## T

### Technical Debt
Deferred engineering work that increases future cost, risk, or complexity. Must be visible (tracked), owned, and paid down deliberately — not used as an excuse to skip MES gates indefinitely.

### Terraform
Infrastructure-as-code tool preferred for long-lived cloud resources under MES DevOps standards (remote state, plan review, least privilege). An **IaC** implementation. See [`Engineering/DEVOPS.md`](Engineering/DEVOPS.md).

### Threat Model
Structured analysis of assets, adversaries, abuses, and mitigations; required for security-critical and AI-exposed systems per factory workflow.

### Token Accounting
Measurement of model input/output tokens, estimated cost, budget breaches, and routing/cache effects — required AI telemetry per [`Engineering/OBSERVABILITY.md`](Engineering/OBSERVABILITY.md).

### Tool (Agent Tool)
A capability an agent may invoke (API, DB query, browser, MCP server, etc.) only after deterministic authorization policy allows it.

### Tool Calling
The mechanism by which a model proposes invoking a named tool with arguments; the runtime **shall** validate schema, enforce authZ, apply timeouts/retries/breakers, and record observability before/after execution.

### Trace / Span
Distributed tracing units (OpenTelemetry) correlating requests across services and AI steps.

---

## V

### VERIFY.md
Project evidence plan listing commands, gates, and artifacts required before serious implementation and release.

### VERIFIED / NOT VERIFIED
Outcomes of an evidence-based verification claim; contrast with INCONCLUSIVE.

---

## Z

### Zero Trust
Security model that assumes no implicit trust based on network location: authenticate and authorize every request, continuously evaluate posture, and minimize blast radius. Aligns with least privilege and defense in depth.

---

## Normative Language (MES)

| Term | Meaning |
|------|---------|
| **shall / must** | Mandatory for MES conformance |
| **should** | Strong default; deviation requires ADR |
| **may** | Optional |
| **Example (CareerPilot)** | Illustrative only |

---

## Engineering Suite Index

| Document | Role |
|----------|------|
| [`Engineering/ENGINEERING_STANDARDS.md`](Engineering/ENGINEERING_STANDARDS.md) | Company-wide engineering baseline |
| [`Engineering/CODING_STANDARDS.md`](Engineering/CODING_STANDARDS.md) | Primary stack (Python, TypeScript, FastAPI, React); other languages via ADR |
| [`Engineering/DOCUMENTATION_STANDARDS.md`](Engineering/DOCUMENTATION_STANDARDS.md) | Docs for humans and agents |
| [`Engineering/TESTING.md`](Engineering/TESTING.md) | Deterministic coverage + AI eval coverage |
| [`Engineering/SECURITY.md`](Engineering/SECURITY.md) | Security posture (not certification) |
| [`Engineering/OBSERVABILITY.md`](Engineering/OBSERVABILITY.md) | Logs, OTel, prompt/retrieval/eval/token telemetry |
| [`Engineering/DEVOPS.md`](Engineering/DEVOPS.md) | Normative CI/CD control points; illustrative GitHub Actions / Docker / Render / Terraform examples (ADR to substitute) |
| [`Engineering/RELEASE_PROCESS.md`](Engineering/RELEASE_PROCESS.md) | Versioning, promotion, rollback |
| [`Engineering/ONCALL.md`](Engineering/ONCALL.md) | Severity, escalation, incidents |

---

## Related Indices

| Need | Document |
|------|----------|
| Conflict resolution | [`SYSTEM_CONTEXT.md`](SYSTEM_CONTEXT.md) |
| Documentation quality evaluation | [`MDES.md`](MDES.md) |
| Documentation review process (MDES + MCR) | [`Governance/MES_REVIEW_PROCESS.md`](Governance/MES_REVIEW_PROCESS.md) |
| MDES / MCR evidence | [`MDES_REVIEWS/`](MDES_REVIEWS/) |
| Operating rituals | [`Governance/MOM.md`](Governance/MOM.md) |
| AI discipline | [`Governance/MILE.md`](Governance/MILE.md) |
| Architecture Parts | [`Architecture/ARCHITECTURE.md`](Architecture/ARCHITECTURE.md) |
| Engineering procedures | [`Engineering/`](Engineering/) |
| AI procedures | [`AI/`](AI/) |
