# AI Discipline Index — Source-of-Truth Ownership

**MES Version:** 1.1.0  
**Status:** Engineering Standard (index)  
**Owner:** MoniGarr Engineering  
**Applies To:** All MoniGarr AI systems and MES AI documentation  
**Canonical Path:** `AI/INDEX.md`  
**See Also:** [`../Governance/MILE.md`](../Governance/MILE.md) · [`AI_GUIDELINES.md`](AI_GUIDELINES.md) · [`../GLOSSARY.md`](../GLOSSARY.md) · [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md) · [`../REFERENCES.md`](../REFERENCES.md)

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

---

## Purpose

This index declares **which AI document owns each concept**. Prefer linking here over duplicating definitions across siblings. When two docs conflict, the owner wins; open an ADR if the owner must change.

---

## Ownership Map

| Concept | Canonical owner | Do not redefine in |
|---------|-----------------|--------------------|
| Risk Class R0–R4 (AI HITL) | [`AI_GUIDELINES.md`](AI_GUIDELINES.md) | Sibling AI docs (link only); GLOSSARY link-primary |
| HITL definition | [`AI_GUIDELINES.md`](AI_GUIDELINES.md) | — |
| Side-effect class enum | [`TOOLS.md`](TOOLS.md) | AGENTS / LOOP / SUBAGENTS (use field only) |
| Dual-control rule | [`AI_GUIDELINES.md`](AI_GUIDELINES.md) | TOOLS / LOOP (must match) |
| Default agent team topology | [`AGENTS.md`](AGENTS.md) | SUBAGENTS |
| Extended delegation / Research / Reasoner | [`SUBAGENTS.md`](SUBAGENTS.md) | AGENTS |
| Prompt library & review | [`PROMPTS.md`](PROMPTS.md) | — |
| Prompt-family scorecard **schema** (dimensions, template) | [`PROMPTS.md`](PROMPTS.md) | EVALS (reporting only) |
| Suite scorecard **reporting / retention / trends** | [`EVALS.md`](EVALS.md) | PROMPTS (schema only) |
| Tool contracts & budgets | [`TOOLS.md`](TOOLS.md) | — |
| Bounded autonomy / HITL policy | [`AI_GUIDELINES.md`](AI_GUIDELINES.md) | — |
| Coding-agent operating contract (suite) | [`../CLAUDE.md`](../CLAUDE.md) | Project `CLAUDE.md` / `AGENTS.md` narrow only |
| Tool Gateway vs Model Gateway | [`TOOLS.md`](TOOLS.md) + [`MODEL_ROUTING.md`](MODEL_ROUTING.md) | Do not conflate |
| Model Gateway (sole egress) | [`MODEL_ROUTING.md`](MODEL_ROUTING.md) + Architecture Part III | Direct provider SDK calls |
| Model routing / class policy | [`MODEL_ROUTING.md`](MODEL_ROUTING.md) | AI_GUIDELINES (summary only) |
| RAG / retrieval | [`RAG.md`](RAG.md) | MEMORY (reference only) |
| Evidence Bundle (retrieval) | [`RAG.md`](RAG.md) | Distinct from Evidence Pack |
| Evidence Pack (release/gate) | [`../Governance/MOM.md`](../Governance/MOM.md) / RELEASE_PROCESS | Distinct from Evidence Bundle |
| Harness artifact bundle | [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) | Maps into Evidence Pack at release |
| Retrieval Diagnostics (emit) | [`RAG.md`](RAG.md) | — |
| Retrieval Diagnostics (field catalog / dashboards) | [`../Engineering/OBSERVABILITY.md`](../Engineering/OBSERVABILITY.md) | RAG emits; OBSERVABILITY catalogs |
| Knowledge graph | [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) | RAG |
| Eval metrics & gates | [`EVALS.md`](EVALS.md) | — |
| Eval Golden Set / Golden datasets | [`GOLDEN_DATASETS.md`](GOLDEN_DATASETS.md) | EVALS (link packs) |
| Refinement loops | [`LOOP_ENGINEERING.md`](LOOP_ENGINEERING.md) | — |
| Harnesses | [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) | — |
| Agent memory layers | [`MEMORY.md`](MEMORY.md) | RAG |
| Regulated data profiles / routing matrix | [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md) | AI_GUIDELINES (link only) |
| ClassificationEnforcer (enforcement hook) | Architecture Part II/III + [`REGULATED_PROFILES.md`](REGULATED_PROFILES.md) | — |

Governance lifecycle ownership remains [`../Governance/MILE.md`](../Governance/MILE.md) and [`../Governance/MOM.md`](../Governance/MOM.md). Architecture boundaries: [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md).

---

## Agent Navigation Rule

AI coding agents **shall**:

1. Open this index when unsure which AI doc is authoritative.  
2. Edit the **owner** document for normative changes.  
3. Update sibling docs only to replace duplicated prose with links.  
4. Treat chat as non-SoT ([`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md)).

---

## Revision History

| Date | MES | Change |
|------|-----|--------|
| 2026-07-12 | 1.1.0 | Initial AI SoT ownership index (P3 longevity). |
| 2026-07-12 | 1.1.0 | Expanded ownership: Model Gateway, Evidence Bundle/Pack, Retrieval Diagnostics, ClassificationEnforcer, HITL. |
| 2026-07-12 | 1.1.0 | Scorecard SoT split (PROMPTS schema / EVALS reporting); Retrieval Diagnostics emit vs catalog; bounded autonomy + coding-agent contract rows. |
