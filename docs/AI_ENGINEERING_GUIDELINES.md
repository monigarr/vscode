# Open-Agent AI Engineering Guidelines

**Status:** Active
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Canonical Path:** `docs/AI_ENGINEERING_GUIDELINES.md`
**See Also:** [`../MoniGarr_Engineering_Standards/AI/AI_GUIDELINES.md`](../MoniGarr_Engineering_Standards/AI/AI_GUIDELINES.md) · [`SECURITY.md`](SECURITY.md) · [`current/API.md`](current/API.md)

---

## Scope

Guidelines for AI features inside Open-Agent (`contrib/openagent/`). Company-wide AI norms remain in MES `AI/`.

## Risk class (default)

| Surface | Typical risk class | Side-effect class |
|---------|--------------------|-------------------|
| Chat (read-only Q&A) | R1–R2 | `draft` |
| Inline completions | R1 | `draft` |
| Composer file writes | R2–R3 | `write` (HITL required for promotion) |
| Agent terminal / write tools | R3 | `write` / potentially `irreversible` |
| Model Gateway | R2 | egress to local or BYOK endpoints |

Humans remain accountable. AI may propose; deterministic policy and HITL authorize side effects.

## Hard rules

1. **Single egress:** UI and agents call `IModelGatewayService` only — never vendor SDKs directly.
2. **Fail closed:** No inference when `openagent.enabled` is false.
3. **No secrets in prompts/logs:** API keys via SecretStorage; telemetry redacts prompts and keys.
4. **Do not invent authority:** Models do not self-authorize tool writes; enforce in code.
5. **Status honesty:** Agents must not claim PRD features are Implemented without checking [`current/IMPLEMENTATION_STATUS.md`](current/IMPLEMENTATION_STATUS.md).

## HITL expectations (target + partial as-built)

| Action | Required |
|--------|----------|
| Accept Composer diffs | Human accept/reject (as-built: file-level; target: per-block) |
| Agent `write_file` / `run_terminal` | Target: explicit approval; as-built: **gap** — treat as elevated risk |
| External share of workspace content | Human decision; privacy-first default is local/BYOK |

## Model routing

Routing uses MES-style model classes and a versioned mapping (`openagent.routing.mappingVersion`). Changing mapping behavior requires tests and a status/docs note.

## Evals

When adding probabilistic paths, follow MES [`AI/EVALS.md`](../MoniGarr_Engineering_Standards/AI/EVALS.md) and record harness jobs in [`VERIFY.md`](VERIFY.md). Golden sets are not yet a full Open-Agent product suite — do not fabricate scores.
