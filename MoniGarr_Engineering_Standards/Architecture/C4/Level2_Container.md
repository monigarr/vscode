# C4 Level 2 — Containers

**MES Version:** 1.1.0  
**Status:** Architecture Companion  
**Parent:** [`../ARCHITECTURE.md`](../ARCHITECTURE.md) Part II  
**Audience:** Humans and AI coding agents

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`../../AI/REGULATED_PROFILES.md`](../../AI/REGULATED_PROFILES.md), map external authorities via [`../../REFERENCES.md`](../../REFERENCES.md), and follow the Regulated Operations Overlay in [`../../Governance/MOM.md`](../../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

Level 2 (Containers) shows separately deployable/runnable units: web apps, APIs, workers, databases, queues, and AI platform services.

---

## Typical MoniGarr Container Set

| Container | Responsibility |
|-----------|----------------|
| Web / Client | UX, accessibility, auth session handling |
| API Gateway / BFF | External API edge, authn enforcement |
| Application Services | Deterministic domain logic |
| AI Orchestration | Agent teams, loops, tool calls |
| Model Gateway | Provider routing, budgets, safety hooks |
| Retrieval / RAG | Hybrid search, rerank, citations |
| Graph Store | Knowledge graph |
| Primary Database | Transactional state |
| Object Storage | Documents, exports, artifacts |
| Queue / Bus | Async events and jobs |
| Eval / Harness Workers | Continuous evaluation |
| Observability Agent | OTel collection |
| **Control Plane — Policy Engine** | AuthZ, entitlement, AI policy decisions |
| **Control Plane — Registry Services** | Prompt / agent / tool registries |
| **Control Plane — Secrets / KMS Broker** | Secret materialization; key unwrap; no app-side key sprawl |

Control plane containers align with Architecture handbook Part II Â§2.4–2.7 (system planes) and Part III (AI platform registries, Model Gateway, safety). Canonical patterns are embedded in [`../ARCHITECTURE.md`](../ARCHITECTURE.md); this companion remains the focused C4 Level 2 view.

---

## Pattern Diagram

```mermaid
flowchart TB
  client[WebClient]
  api[APIGateway]
  app[ApplicationServices]
  orch[AIOrchestration]
  gw[ModelGateway]
  rag[RAGLayer]
  graph[GraphStore]
  db[(PrimaryDB)]
  queue[EventBus]
  eval[EvalWorkers]
  subgraph ControlPlane["Control Plane"]
    policy[PolicyEngine]
    regs[RegistryServices]
    kms[SecretsKmsBroker]
  end
  client --> api
  api --> app
  api --> orch
  orch --> gw
  orch --> rag
  orch --> graph
  orch --> policy
  orch --> regs
  app --> db
  orch --> db
  app --> queue
  orch --> queue
  eval --> rag
  eval --> orch
  app --> kms
  orch --> kms
  gw --> kms
```

**Diagram note:** Draw Control Plane as a distinct group. Request-path containers (API parsing, orchestration) call into it; they do not co-host its privileged runtime.

---

## Normative Rules

1. Probabilistic components shall not own authoritative business state without deterministic validation.  
2. Model Gateway shall be the only path to external model providers.  
3. Eval workers shall run with production-like configs in non-prod and gated configs in prod.  
4. Each container shall declare owner, SLO, and data classification.  
5. Control plane containers **shall not** share runtime with untrusted request parsing (separate process/service/sandbox; co-location only under ADR with explicit blast-radius analysis). Cross-link Part II/III in project `ARCHITECTURE.md`.

---

## Checklist

- [ ] All deployable units shown  
- [ ] Control plane group present (Policy Engine, Registry Services, Secrets/KMS broker)  
- [ ] Control plane isolated from untrusted request parsing  
- [ ] Data stores labeled with technology class  
- [ ] AI platform containers explicit  
- [ ] Trust boundaries between containers noted  
- [ ] Maps to deployment topology (Part II / XVI); Part II/III cross-links present  
