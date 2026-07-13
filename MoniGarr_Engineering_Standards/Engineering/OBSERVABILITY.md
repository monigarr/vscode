# OBSERVABILITY — Logs, Traces, Metrics, and AI Telemetry

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All Products, Services, Repositories  
**Canonical Path:** `Engineering/OBSERVABILITY.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) · [`../Governance/MOM.md`](../Governance/MOM.md) · [`../Governance/MILE.md`](../Governance/MILE.md) · [`ENGINEERING_STANDARDS.md`](ENGINEERING_STANDARDS.md) · [`SECURITY.md`](SECURITY.md) · [`TESTING.md`](TESTING.md) · [`DEVOPS.md`](DEVOPS.md) · [`ONCALL.md`](ONCALL.md) · [`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md) · [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) · [`../GLOSSARY.md`](../GLOSSARY.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Normative Language

| Term | Meaning |
|------|---------|
| **shall / must** | Mandatory for MES conformance |
| **should** | Strong default; deviation requires an ADR |
| **may** | Optional |
| **Example (CareerPilot)** | Illustrative only |

This standard is **company-wide**.

---

## Purpose

Observability is the ability to understand system behavior from emitted telemetry without guessing. For MoniGarr, observability covers classical SRE signals **and** AI-native signals: prompt logs, retrieval diagnostics, eval dashboards, and token accounting.

If on-call cannot diagnose user-visible failure from telemetry and runbooks, the system is not operable.

---

## Pillars

| Pillar | Use |
|--------|-----|
| **Logs** | Discrete events with structured fields |
| **Metrics** | Aggregates for SLIs/SLOs and capacity |
| **Traces** | Request/agent journey correlation (OpenTelemetry) |
| **Profiles** | Optional deep performance investigation |
| **AI telemetry** | Prompts (redacted), retrieval, evals, tokens/cost |

OpenTelemetry (OTel) is the default instrumentation approach unless an ADR selects an equivalent.

---

## Universal Requirements

Production services **shall**:

- Emit structured logs (JSON or equivalent)  
- Propagate trace context across service and agent steps  
- Expose health/readiness suitable for orchestration  
- Define golden signals for critical journeys (latency, traffic, errors, saturation)  
- Redact secrets and minimize PII in telemetry  
- Include `request_id` / `trace_id` in API error responses when practical  

Best-effort metrics export **may** fail open; required audit events **shall** fail closed per security posture.

---

## Correlation & Context

Every request/agent run **should** carry:

- `trace_id` / `span_id`  
- `request_id`  
- `service.name` / deployment version  
- `tenant_id` / `user_id` only when necessary and permitted  
- `feature_flag` / experiment ids when relevant  
- `model` / `prompt_version` / `retrieval_index_version` for AI paths  

Without correlation, AI multi-step failures become un-debuggable folklore.

---

## Prompt Logs (AI)

Prompt logging **shall** be intentional and governed:

- Log prompt **metadata** always: prompt version, model, temperature/routing choice, token counts, latency, tool names invoked, success/failure.  
- Log prompt **content** only when authorized by data class and retention policy.  
- Redact secrets, credentials, payment data, and unnecessary PII.  
- Separate debug-level full prompt capture (restricted) from production default metadata.  
- Retain per policy; do not treat unbounded chat history as SoT.

**Example (CareerPilot):** Production prompt logs store template id, retrieval hit ids, and token usage; raw resume text is redacted or hashed unless a restricted debug mode is explicitly authorized — illustrative only.

---

## Retrieval Diagnostics

RAG/GraphRAG systems **shall** emit diagnostics sufficient to answer:

- What was retrieved (document/chunk/node ids)?  
- What scores/ranks were used?  
- Which index/corpus/graph version?  
- Were filters (tenant, ACL) applied?  
- Was there a retrieval miss or low-confidence set?  
- Did grounding/citation attach to the final answer?  

Retrieval diagnostics **should** be joinable to the generation span via trace ids.

Missing retrieval telemetry is a primary cause of silent hallucination regressions.

---

## Eval Dashboards

Teams running AI features **shall** maintain dashboards (or equivalent reports) showing:

- Golden eval pass rates by suite and journey  
- Hallucination / grounding / refusal metrics  
- Regression deltas vs last release  
- Latency and cost per journey  
- HITL intervention rates where applicable  

Eval dashboards are engineering tools, not marketing slides. Release decisions **shall** be able to cite them.

Continuous evaluation sampling, when authorized, **should** appear alongside offline golden trends.

---

## Token Accounting & Cost Telemetry

AI systems **shall** account for:

- Input/output tokens per model call  
- Aggregated tokens per request / agent run / tenant (as designed)  
- Estimated cost using versioned price tables  
- Budget breaches and circuit-breaker trips  
- Cache hits / routing decisions that affect cost  

Token accounting supports both financial control and abuse detection.

Budgets **should** be enforced in the deterministic control plane, not hoped for in prompts.

---

## Metrics & SLOs

For each critical journey, define:

| Element | Expectation |
|---------|-------------|
| SLI | Measurable indicator (e.g., p95 latency, error ratio, eval pass rate) |
| SLO | Target over a window |
| Error budget | Remaining failure allowance before freeze/escalation |
| Alert | Condition that pages or tickets on-call |
| Dashboard | Single pane for journey health |

AI journeys **should** include quality SLIs, not only infrastructure SLIs.

### Minimum SLO set (example — non-normative numbers)

Projects **shall** publish actual targets in project `ARCHITECTURE.md` or journey runbooks. The following illustrates a complete shape:

| Journey SLI | Example SLO | Window | Notes |
|-------------|-------------|--------|-------|
| Availability | 99.9% successful requests | 30 days | Exclude planned maintenance if declared |
| Latency | p95 &lt; 500 ms (API) | 7 days | Adjust per product |
| Error rate | &lt; 1% 5xx | 7 days | |
| AI eval pass rate | ≥ 95% golden suite | Per release | AI-affecting only |
| Token / cost | Within declared budget | 30 days | See Token Accounting |

When error budget remaining is **&lt; 10%**, R3+ user-visible releases **should** require engineering owner approval (see [`ONCALL.md`](ONCALL.md)).

---

## Tracing Guidance (OTel)

- Create spans for inbound HTTP, outbound HTTP, DB, queue publish/consume, model calls, retrieval, tool calls, and HITL waits.  
- Mark errors on spans; attach safe attributes.  
- Avoid putting raw prompts or PII in span attributes by default.  
- Keep cardinality under control (no unbounded raw URLs/ids as metric labels).

See [`DEVOPS.md`](DEVOPS.md) for collector/export wiring expectations.

---

## Logging Guidance

Structured fields over string soup. Recommended event categories:

- `request.start` / `request.end`  
- `authn` / `authz`  
- `db.query` (safe metadata)  
- `model.call`  
- `retrieval.query`  
- `tool.invoke`  
- `hitl.decision`  
- `audit.security`  

Log levels: use `error` for actionable failures; do not spam `error` for expected user 4xx.

---

## Alerting

Alerts **shall** be actionable and tied to runbooks ([`ONCALL.md`](ONCALL.md)).

Prefer:

- Symptom-based alerts (user journey broken)  
- Budget/token runaway alerts  
- Eval gate / quality cliff alerts for AI systems  
- Saturation alerts (queue depth, DB connections)  
- **Version-skew alerts** — deployed `prompt_version` / `model` / `retrieval_index_version` / policy version diverge from the promoted release pin  
- **Drift alerts** — online quality or cost metrics leave the declared band vs golden baseline  

Avoid:

- Noisy host CPU pages without user impact  
- Duplicate alerts for the same failure  
- Alerts without owners  

---

## Privacy & Security of Telemetry

Telemetry is a data store. Teams **shall**:

- Classify telemetry backends  
- Restrict access to prompt content stores  
- Encrypt in transit to collectors  
- Define retention and deletion  
- Prevent cross-tenant leakage in shared observability tenants  

Security audit events requirements in [`SECURITY.md`](SECURITY.md) override convenience logging.

---

## Dashboards Minimum Set

Production systems **should** provide:

1. Service overview (golden signals)  
2. Dependency health (DB, queues, model providers)  
3. Release marker overlay  
4. AI quality & cost (when AI present)  
5. Retrieval health (when RAG/GraphRAG present)  

**Example (CareerPilot):** A “Match Journey” dashboard combines API p95, retrieval miss rate, eval pass rate, and cost per successful recommendation — illustrative only.

---

## Instrumentation Ownership

- Feature owners own journey SLIs.  
- Platform/DevOps owns collectors and shared backends.  
- Security owns audit event requirements.  
- AI owners own prompt/retrieval/eval/token telemetry completeness.

Missing ownership produces orphan metrics.

---

## Local & CI Observability

- Local **may** use console exporters.  
- CI **should** capture enough logs to diagnose test/eval failures.  
- Load tests **should** emit comparable metrics to staging.

---

## Anti-Patterns

- `print` debugging as the only production signal  
- Unredacted prompt dumps in shared Slack channels  
- Metrics labels with user email or raw prompt text  
- Tracing only the HTTP edge while ignoring agent/tool spans  
- Eval reports that exist only on one laptop  
- Token usage unknown until the invoice arrives  

---

## Conformance Checklist

- [ ] Structured logs + trace propagation in production services  
- [ ] OTel (or ADR-equivalent) wired per [`DEVOPS.md`](DEVOPS.md)  
- [ ] Prompt metadata logging with redaction policy  
- [ ] Retrieval diagnostics for RAG/GraphRAG  
- [ ] Eval dashboards for AI releases  
- [ ] Token/cost accounting and budgets  
- [ ] Actionable alerts with runbook links  

---

## See Also

- [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md)  
- [`../Governance/MOM.md`](../Governance/MOM.md)  
- [`DEVOPS.md`](DEVOPS.md) · [`ONCALL.md`](ONCALL.md) · [`SECURITY.md`](SECURITY.md) · [`TESTING.md`](TESTING.md) · [`RELEASE_PROCESS.md`](RELEASE_PROCESS.md)
