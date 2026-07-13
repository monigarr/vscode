# [PROJECT_NAME] — Event Model Template

**MES Version:** 1.1.1  
**Document:** `EVENT_MODEL.md`  
**Status:** Template  
**See Also:** [`API_SPEC.md`](API_SPEC.md) · [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md) · [`../Engineering/OBSERVABILITY.md`](../Engineering/OBSERVABILITY.md)

Instantiate when the project is event-driven or emits domain/AI job events. Canonical event catalog SoT is this file (domain events in `DOMAIN_MODEL.md` may summarize and link here).

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

---

## Bus / Broker

| Field | Value |
|-------|-------|
| Technology | `[KAFKA / SQS / REDIS / OTHER]` |
| Delivery | at-least-once with idempotent consumers |
| Schema registry | `[path or service]` |
| AsyncAPI | `docs/asyncapi.yaml` (optional) |

## Event Catalog

| Event | Producer | Consumers | Schema version | Classification | Contains PII? |
|-------|----------|-----------|----------------|----------------|---------------|
| [PastTenseEvent] | [svc] | [svcs] | [v] | [class] | Y/N |

## Envelope

Required fields: `event_id`, `event_type`, `occurred_at`, `producer`, `schema_version`, `tenant_id` (if multi-tenant), `trace_id`, `classification`.

Optional: `contains_pii`, `correlation_id`, `causation_id`.

**Healthcare / regulated:** do not place PHI in event payloads unless authorized; prefer references/tokens with ACL-checked fetch.

## Idempotency & Replay

- Consumer idempotency key: `[...]`  
- Dead-letter queue: `[...]`  
- Replay procedure: `[RUNBOOK link]`  

## AI Job Events

Include `prompt_version`, `model_id`, `routing_table_id`, `agent_id`, `token_cost`, `eval_ids`, `side_effect_class` when emitting agent-run events.

## Observability

Emit correlation with OTel `trace_id` / `span_id`. See [`../Engineering/OBSERVABILITY.md`](../Engineering/OBSERVABILITY.md).
