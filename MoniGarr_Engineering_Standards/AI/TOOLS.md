# Tools — Allowlists, Contracts, Safety, and Observability

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All tools callable by MoniGarr AI agents, sub-agents, harnesses, and coding assistants  
**Canonical Path:** `AI/TOOLS.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Parts VI–VII, XV · [`../Governance/MILE.md`](../Governance/MILE.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`AGENTS.md`](AGENTS.md) · [`SUBAGENTS.md`](SUBAGENTS.md) · [`PROMPTS.md`](PROMPTS.md) · [`RAG.md`](RAG.md) · [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) · [`EVALS.md`](EVALS.md) · [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) · [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) · [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) · [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · [`MEMORY.md`](MEMORY.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

Tools are the side-effect surface of AI systems. This standard defines how tools are registered, versioned, allowlisted, sandboxed, observed, and retired. An agent without a documented tool contract is non-conformant for production use.

Parent agent contracts: [`AGENTS.md`](AGENTS.md).  
Risk and HITL: [`AI_GUIDELINES.md`](AI_GUIDELINES.md).

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
| **Tool** | A named, versioned callable with schema, auth, side-effect class, and owner |
| **MCP server** | Tool subtype: Model Context Protocol server exposing one or more tools; subject to the same allowlist, contract, and gateway rules as native tools |
| **Allowlist** | Explicit set of tool IDs an agent may invoke |
| **Denylist** | Explicit set of tools forbidden even if discoverable |
| **Side-effect class** | Read / draft / write / irreversible |
| **Tool gateway** | Mediation layer that enforces auth, budgets, and policy before **tool** execution. Distinct from **Model Gateway** (sole production egress for model inference — [`MODEL_ROUTING.md`](MODEL_ROUTING.md) · Architecture Part III). MCP does not bypass either gateway. |
| **Sandbox** | Isolation boundary for untrusted or high-risk tool execution |
| **Tool span** | Observability record of one invocation |

---

## Design Principles

1. **Least privilege.** Agents receive only the tools required for their contract.  
2. **Explicit contracts.** Inputs, outputs, errors, and timeouts are schema-defined.  
3. **Fail closed.** Unknown tools, expired versions, and auth failures abort.  
4. **Observable by default.** Every call emits a span with args redacted per policy.  
5. **Deterministic wrappers preferred.** Prefer typed APIs over free-form shell.  
6. **Human gates for writes.** Material side effects follow risk-class HITL rules.  
7. **Version immutability.** Published tool versions are not silently mutated.  
8. **Replaceable backends.** Tool IDs stay stable when implementations change.

---

## Tool Contract (Required Fields)

Every production tool **shall** declare:

| Field | Description |
|-------|-------------|
| `id` | Stable ID (`domain.action` or `domain.action.vN` family) |
| `version` | SemVer of the tool interface |
| `name` | Human-readable name |
| `owner` | Human owner / team |
| `purpose` | One-paragraph mission |
| `input_schema` | JSON Schema or equivalent |
| `output_schema` | JSON Schema or equivalent |
| `error_codes` | Documented failure taxonomy |
| `authz` | Required roles, scopes, or service identities |
| `side_effect_class` | `read` \| `draft` \| `write` \| `irreversible` |
| `risk_class_max` | Highest agent risk class permitted to call |
| `timeout_ms` | Hard timeout |
| `retry_policy` | Idempotent retries only when safe |
| `rate_limits` | Per-agent and global limits |
| `pii_handling` | Redaction, retention, and logging rules |
| `audit_level` | What is logged (args, results, hashes) |
| `sandbox` | Required / optional / none |
| `circuit_breaker_policy` | Open/half-open thresholds, cooldown, and fail-closed behavior on dependency faults |
| `dependencies` | Upstream services and datasets |
| `deprecation` | Sunset date and replacement ID if any |
| `changelog` | Behavior-affecting changes |

### Contract Template

```yaml
id: rag.search
version: 3.1.0
name: Hybrid RAG Search
owner: platform-ai@monigarr.com
purpose: Return ranked evidence chunks for a query under a retrieval policy.
input_schema: RagSearchRequestV3
output_schema: EvidenceBundleV2
error_codes: [AUTH_DENIED, TIMEOUT, INDEX_UNAVAILABLE, QUERY_REJECTED]
authz: [role:agent.retriever, scope:rag.read]
side_effect_class: read
risk_class_max: R4
timeout_ms: 8000
retry_policy: { max: 2, backoff_ms: 200, idempotent: true }
rate_limits: { per_agent_rpm: 60, global_rpm: 6000 }
pii_handling: { log_args: hashed_query, log_results: ids_only }
audit_level: standard
sandbox: none
circuit_breaker_policy: { error_rate_open: 0.5, window_s: 60, fail: closed }
dependencies: [vector_index.v7, sparse_index.v4]
```

---

## Allowlists and Denylists

### Agent Binding

Every agent **shall** declare `tools_allowlist` with exact tool IDs and versions (or pinned major ranges approved by ADR). Wildcard allowlists (`*`) are forbidden in production. MCP servers are a **tool subtype**: each exposed MCP tool ID **shall** appear on the allowlist under the same rules as native tools; discovering an MCP server does not imply invocation rights.

Agents **should** also declare `tools_denylist` for high-risk families they must never call (for example billing, identity delete, production deploy).

### Gateway Enforcement

The tool gateway **must**:

1. Reject calls not on the agent allowlist.  
2. Reject expired or unpublished versions.  
3. Enforce authz before execution.  
4. Enforce rate limits and budgets.  
5. Enforce side-effect class vs HITL state.  
6. Emit a tool span whether success or failure.

### Discovery vs Invocation

Agents may discover tool *metadata* for UX, but **must not** invoke tools outside their allowlist even if discovered.

---

## Side-Effect Classes

| Class | Meaning | Normative gate |
|-------|---------|----------------|
| `read` | No durable mutation | May run under agent budget |
| `draft` | Writes to draft/staging only | Should be reversible; no customer-visible commit |
| `write` | Mutates systems of record | Must follow HITL for R2+ per [`AI_GUIDELINES.md`](AI_GUIDELINES.md) |
| `irreversible` | Cannot safely undo | Dual-control required: **R4 workflows**, or **`irreversible` at R3+**. Same rule as [`AI_GUIDELINES.md`](AI_GUIDELINES.md). |

Coordinators **shall not** escalate a child’s side-effect class silently. Promotion from `draft` to `write` is a distinct step with its own approval record.

---

## Safety Requirements

### Input Validation

Tools **must** validate inputs against schema before side effects. Soft validation with best-effort coercion is forbidden for `write` and `irreversible` tools.

### Injection and Confused Deputy

Tools that accept natural language or URLs **shall**:

- Treat model-supplied strings as untrusted.  
- Prefer structured IDs over free-form paths.  
- Block SSRF-prone fetches unless an allowlisted host policy exists.  
- Never pass raw shell strings from model output without a deterministic parser.

### Secrets

Tools **must not** return secrets to model context unless the tool is an approved secret broker with redaction and short TTL. Logs **shall** redact tokens, passwords, and session cookies.

### Idempotency

`write` tools **should** accept an idempotency key. Retries without idempotency keys on non-idempotent writes are non-conformant.

---

## Sandboxing

| Tool type | Sandbox requirement |
|-----------|---------------------|
| Pure API read | May run without sandbox |
| Code execution | Must run in sandbox with network and FS policy |
| Shell / OS | Must run in sandbox; production hosts forbidden for R0–R2 agents |
| Browser automation | Must use isolated profile and domain allowlist |
| File writes outside draft dirs | Must require elevated authz |

Sandboxes **shall** define CPU, memory, disk, network, and wall-time limits. Escape attempts are security incidents.

---

## Observability

Every tool invocation **shall** emit a span containing at least:

| Field | Notes |
|-------|-------|
| `trace_id` / `span_id` | Correlation |
| `agent_id` / `agent_version` | Caller |
| `tool_id` / `tool_version` | Callee |
| `side_effect_class` | As declared |
| `authz_decision` | Allow / deny reason |
| `latency_ms` | End-to-end |
| `status` / `error_code` | Outcome |
| `budget_delta` | Tokens/cost/tool-count if applicable |
| `arg_fingerprint` | Hash or redacted summary |
| `result_fingerprint` | Hash or size/count summary |

Raw PII in spans is forbidden unless an approved audit sink with retention controls is used.

---

## Tool Catalog

Projects **shall** maintain a machine-readable catalog (for example `tools/catalog.yaml`) listing all production tools, owners, and versions. The catalog is the source of truth for allowlist generation and reviews.

### Required Catalog Sections

1. Active tools  
2. Deprecated tools with sunset dates  
3. Forbidden tool families (org-wide denylist)  
4. Change log pointers  

---

## Versioning and Compatibility

- Breaking input/output changes **must** bump major version.  
- Additive optional fields **may** bump minor version.  
- Bugfix-only behavior that preserves schemas **may** bump patch.  
- Agents pin major versions; automatic major upgrades are forbidden without eval gates ([`EVALS.md`](EVALS.md)).

Deprecation **shall** include: replacement ID, migration notes, and a date after which the gateway rejects the old version.

---

## Testing Requirements

Tools **must** have:

1. Contract tests (schema validation).  
2. Authz negative tests (deny paths).  
3. Timeout and failure injection tests.  
4. Side-effect dry-run or staging tests for `write`+ tools.  
5. Golden harness cases when used by R1+ agents ([`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md)).

---

## Example (CareerPilot) — Tool Allowlists by Role

Illustrative only. Product repos own their concrete catalogs.

| Agent role | Allowlisted tools (examples) | Denied |
|------------|------------------------------|--------|
| Retriever | `rag.search.v3`, `graph.traverse.v2`, `docs.metadata.get.v1` | Email send, billing |
| Resume Writer | `docs.render.v1`, `style.apply.v2`, `rag.search.v3` (read) | Job board submit, payment |
| Critic | `rubric.score.v1`, `policy.check.v2` | Any `write` to customer profile |
| Exporter | `docs.export.draft.v1` | `docs.publish.v1` without HITL |
| Coordinator | Budget and routing tools only; no direct customer writes | Identity delete |

CareerPilot publish to external ATS **must** use a `write` tool behind HITL for R2+ content.

---

## Anti-Patterns (Non-Conformant)

1. Giving a monolith agent shell + browser + production DB “for flexibility.”  
2. Soft-failing unknown tools by ignoring them.  
3. Logging full prompts and tool payloads containing PII to shared debug channels.  
4. Mutating tool behavior in place without version bumps.  
5. Letting models invent tool names and auto-registering them.  
6. Treating drafts as published because the UI looks the same.  
7. Retrying non-idempotent payments or sends on timeout without reconciliation.

---

## Compliance Checklist

- [ ] Every production tool has a complete contract in version control.  
- [ ] Agent allowlists are exact; no wildcards.  
- [ ] Gateway enforces authz, budgets, and side-effect gates.  
- [ ] Spans emit for every call with redaction policy.  
- [ ] `write` / `irreversible` tools have HITL mapping.  
- [ ] Catalog lists owners, versions, and deprecations.  
- [ ] Contract and negative authz tests pass in CI.  
- [ ] Sandbox policy documented for code/shell/browser tools.

---

## Change Control

Tool contract changes that affect side effects or authz **shall** follow MILE change control ([`../Governance/MILE.md`](../Governance/MILE.md)) and include eval impact analysis. Architecture implications for shared platforms **should** update [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) or a linked ADR.

---

## See Also (Sibling Index)

- [`AGENTS.md`](AGENTS.md) — agent contracts and team topology  
- [`SUBAGENTS.md`](SUBAGENTS.md) — delegation and child tool inheritance  
- [`PROMPTS.md`](PROMPTS.md) — prompt/tool instruction pairing  
- [`RAG.md`](RAG.md) — retrieval tools and evidence bundles  
- [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) — graph traversal tools  
- [`EVALS.md`](EVALS.md) — tool-call correctness metrics  
- [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) — fixture payloads for tools  
- [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) — tool use inside loops  
- [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) — harness mediation of tools  
- [`MODEL_ROUTING.md`](MODEL_ROUTING.md) — models vs tools separation  
- [`MEMORY.md`](MEMORY.md) — memory read/write tools  
- [`AI_GUIDELINES.md`](AI_GUIDELINES.md) — risk classes and HITL  

---

## Revision History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-07-12 | Initial MES Tools standard; circuit_breaker_policy; MCP as tool subtype |
