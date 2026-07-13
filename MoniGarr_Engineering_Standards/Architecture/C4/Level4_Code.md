# C4 Level 4 — Code

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

Level 4 (Code) is used sparingly for the most critical components — showing classes/modules/functions that implement a component. Prefer linking to source and ADRs over exhaustive UML.

Level 4 is **language-agnostic and interface-first**: document public interfaces, invariants, and proving tests—not a preferred language or framework. Implementation language appears only as a project fact.

---

## When Level 4 Is Required

Level 4 shall be produced for:

- Security-critical policy engines  
- Model Gateway routing and budget enforcement  
- **Kill-switch / emergency disable** paths for AI tools, agents, or model egress  
- Citation / provenance assembly  
- Payment or irreversible side-effect tools  
- Evaluation scoring that gates production  

Level 4 should be omitted for routine CRUD unless it clarifies a non-obvious invariant. Use sparingly.

---

## Pattern

Document:

1. Module path  
2. Public interface  
3. Invariants  
4. Dependencies  
5. Tests / harnesses that prove behavior  
6. Link to ADR if design is non-obvious  

```text
Component: CitationAssembler
Module:    src/ai/rag/citation_assembler.py
Invariant: Every claim marked grounded must map to >=1 provenance record
Tests:     tests/ai/rag/test_citation_assembler.py
Harness:   harnesses/rag_harness/
ADR:       docs/ADRS/00xx-citation-required.md
```

### Optional second pattern — PolicyDecisionPoint (regulated)

When regulated data or R3+ policy gates apply, projects **may** document a `PolicyDecisionPoint` (or equivalent) at Level 4: decide/enforce interface, deny-by-default invariant, audit emission, and harness coverage. Omit when policy is trivial and covered elsewhere.

```text
Component: PolicyDecisionPoint
Interface: Evaluate(subject, action, resource, context) -> Permit|Deny|Obligations
Invariant: Deny on missing classification or expired policy version
Tests:     tests/policy/test_pdp_deny_defaults.py
ADR:       docs/ADRS/00xx-pdp-isolation.md
```

### Required pattern — KillSwitch (AI egress / tools)

When agents, tools, or Model Gateway can perform `write` or `irreversible` side effects, projects **shall** document a kill-switch at Level 4 (or prove an equivalent control-plane disable in the ADR).

```text
Component: KillSwitch
Interface: Disable(scope: tool|agent|gateway|tenant) -> Ack; IsDisabled(scope) -> bool
Invariant: Disabled scope cannot invoke provider/tools until human re-enable + audit
Tests:     tests/control/test_kill_switch.py
Harness:   harnesses/control_plane/
ADR:       docs/ADRS/00xx-kill-switch.md
```

---

## Normative Rules

1. Level 4 docs shall not replace readable code and tests.  
2. Generated diagrams shall be regenerated when interfaces change.  
3. AI agents shall update Level 4 when they change critical invariants.  

---

## Checklist

- [ ] Only critical components documented at Level 4  
- [ ] Invariants stated falsifiably  
- [ ] Tests/harnesses linked  
- [ ] Paths match repository layout  
