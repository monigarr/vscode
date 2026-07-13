# CODING_STANDARDS — Python, TypeScript, FastAPI, React

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All application and library code in MES-conformant repositories  
**Canonical Path:** `Engineering/CODING_STANDARDS.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) · [`../Governance/MOM.md`](../Governance/MOM.md) · [`../Governance/MILE.md`](../Governance/MILE.md) · [`../Governance/CONTRIBUTING.md`](../Governance/CONTRIBUTING.md) · [`../Governance/ADR_GUIDE.md`](../Governance/ADR_GUIDE.md) · [`../Templates/CODE_COMMENT_HEADER_TEMPLATE.md`](../Templates/CODE_COMMENT_HEADER_TEMPLATE.md) · [`ENGINEERING_STANDARDS.md`](ENGINEERING_STANDARDS.md) · [`TESTING.md`](TESTING.md) · [`SECURITY.md`](SECURITY.md) · [`DOCUMENTATION_STANDARDS.md`](DOCUMENTATION_STANDARDS.md) · [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) · [`../GLOSSARY.md`](../GLOSSARY.md)

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

This standard is **company-wide**. Stack choices for a given repository **shall** still obey these rules unless an ADR documents a scoped exception.

---

## Purpose

This standard defines how MoniGarr writes production code in the **primary reference stack**:

- **Python** (services, workers, evals, data tooling)
- **TypeScript** (shared types, Node services, scripts)
- **FastAPI** (HTTP/JSON APIs)
- **React** (web UIs)

This is a reference stack, not a vendor lock. Other languages and frameworks inherit the *spirit* of these rules; adopt them via ADR when used in production.

---

## Universal Rules (All Languages)

1. **Clarity over cleverness** — prefer boring, explicit code.  
2. **Small units** — functions and components do one job.  
3. **Borders validate** — trust no external input (HTTP, LLM output, files, queues).  
4. **Errors are explicit** — no bare except/catch that swallows security-relevant failures.  
5. **No secrets in source** — configuration via env / secret manager.  
6. **Headers on production modules** — see File Headers below.  
7. **Tests beside behavior** — new logic ships with proof.  
8. **Docs in the same change** — public contracts updated with code.  
9. **Imports at top of file** — no inline imports unless a documented circular-dependency exception.  
10. **AI output is untrusted** — schema-validate and policy-check before side effects.  
11. **No drive-by rewrites** — keep diffs focused on the requested change.  
12. **Fail closed** for authZ, audit, and safety-critical paths.

---

## File Headers

Production source files **shall** include a header conforming to [`../Templates/CODE_COMMENT_HEADER_TEMPLATE.md`](../Templates/CODE_COMMENT_HEADER_TEMPLATE.md).

Required fields at minimum: `FILE`, `PURPOSE`, `OWNER`, `AUTHOR`, `CREATED`, `UPDATED`, `LICENSE`, `SECURITY`.  
Add `DATA HANDLING` when processing data; `AI NOTES` when AI/prompts/tools/evals are involved.  
Add `RISK CLASS` (R0–R4) on AI modules, agent entrypoints, tool gateways, and other intelligence-plane code that can trigger side effects.

Recommended fields for operational modules: `USAGE`, `DEPENDENCIES`, `PERFORMANCE`, `OBSERVABILITY`, `TESTING`, `OPERATIONAL NOTES`.

Headers are governance metadata — not a substitute for clear code or tests.

Exempt: pure generated code (note generator), trivial one-line re-exports (optional), and test fixtures where noise exceeds value (project ADR may set policy).

When updating a production module, engineers and agents **shall** refresh `UPDATED` and any header fields that became inaccurate.

---

## Python

### Style & Tooling

| Concern | Standard |
|---------|----------|
| Style | Compatible with PEP 8; prefer `ruff` format/lint |
| Types | Type hints on public functions; `mypy` or `pyright` in CI for apps |
| Packaging | `pyproject.toml`; lock deps for apps |
| Testing | `pytest`; markers for integration/eval |
| Env | `pydantic-settings` or equivalent typed settings |

### Practices

- Prefer explicit `Optional` / `| None` over ambiguous returns.  
- Use context managers for resources.  
- Dataclasses or Pydantic models for structured data crossing boundaries.  
- Avoid mutable default arguments.  
- Async: do not block the event loop; use `httpx`/`aio*` consistently within a service.  
- Logging: structured (`structlog` or JSON logs); never log secrets, raw PII, or full prompts unless authorized and redacted.  
- Prefer composition over deep inheritance trees.  
- Public library APIs **should** include docstrings with examples for non-obvious behavior.

### Anti-Patterns

- Catching `Exception` and continuing silently  
- Dynamic attribute injection that defeats typing  
- Mixing sync blocking I/O into hot async paths without isolation  
- Embedding SQL/string-built queries without parameterization  

### Example Header (Python)

Follow the Python example in [`../Templates/CODE_COMMENT_HEADER_TEMPLATE.md`](../Templates/CODE_COMMENT_HEADER_TEMPLATE.md).

---

## FastAPI

### API Design

- Version public APIs (`/v1/...`) when externally consumed.  
- Request/response bodies are Pydantic models — no untyped `dict` at the edge.  
- Dependency injection for auth, DB sessions, and settings.  
- Return problem-shaped errors (consistent `code`, `message`, `request_id`).  
- Idempotency keys for creating charged or irreversible resources.  
- OpenAPI is generated and reviewed; keep narrative API docs synchronized for contracts that humans and agents consume.

### Security at the Edge

- Authenticate then authorize (RBAC/ABAC as designed).  
- Validate content types and size limits.  
- Separate admin routes; stricter authN/Z.  
- Rate-limit abuse-prone endpoints.  
- Treat LLM-produced fields as data, never as executable authority.  
- Prefer least-privilege service credentials for downstream calls.

### Routing & Layers

```text
api (routers) → services (use-cases) → domain → adapters (db, queues, model providers)
```

Do not put business logic in router functions beyond orchestration.

Routers **shall** remain thin: parse, authorize, call service, map errors, return response.

### Background Work

Long-running or fan-out work **should** use workers/queues with idempotent handlers, explicit retries, and dead-letter visibility — not unbounded in-request loops.

**Example (CareerPilot):** A `/v1/matches:recommend` route validates the user, calls a matching service that invokes a bounded agent tool policy, and returns schema-checked results with provenance IDs — illustrative only.

---

## TypeScript

### Style & Tooling

| Concern | Standard |
|---------|----------|
| Language | TypeScript strict mode (`strict: true`) |
| Lint | ESLint + project rules; format with Prettier or biome as chosen by ADR |
| Modules | ES modules; avoid `any` — prefer `unknown` + narrow |
| Exhaustiveness | `switch` on unions/enums must use `never` in `default` |

### Practices

- Prefer `readonly` and immutable updates at boundaries.  
- Zod (or equivalent) for runtime validation of external data.  
- Do not use non-null assertions to silence real uncertainty.  
- Shared types live in a clear package/path; do not duplicate API models silently.  
- Node services: structured logs; same secret/PII rules as Python.  
- Prefer discriminated unions over loosely typed status strings.

### Exhaustive Switch Example

```typescript
type AgentState = "planning" | "tool_call" | "awaiting_hitl" | "done";

function labelFor(state: AgentState): string {
  switch (state) {
    case "planning":
      return "Planning";
    case "tool_call":
      return "Calling tool";
    case "awaiting_hitl":
      return "Awaiting human approval";
    case "done":
      return "Done";
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}
```

Adding a new `AgentState` variant **shall** fail compile-time until handlers are updated.

---

## React

### Principles

- Prefer function components.  
- One clear responsibility per component; extract hooks for reusable logic.  
- Controlled forms with schema validation before submit.  
- Accessible by default: labels, keyboard, focus, contrast.  
- Do not put secrets in client bundles.  
- Server-provided authZ remains authoritative; UI hiding is not security.

### State & Data

- Server state via established library patterns (e.g., TanStack Query) when the project uses them; follow repo conventions.  
- Avoid premature `useMemo` / `useCallback` unless the codebase or React Compiler guidance requires them.  
- Prefer modern patterns already adopted by the repo (`useEffectEvent`, `startTransition`, `useDeferredValue` when appropriate).  
- Error boundaries for resilient UI sections.  
- Loading and empty states are first-class UX, not afterthoughts.

### Structure

```text
features/<feature>/  — UI + hooks + local types
shared/ui/           — design-system primitives
shared/lib/          — pure helpers
```

Do not invent a second design system inside a product without ADR.

### Security & Privacy in UI

- Sanitize or carefully structure any rendered markdown/HTML.  
- Redact sensitive fields in client logging/analytics.  
- Clear copy when AI is involved; show provenance when answers are grounded.  
- Never trust client-only feature flags for security boundaries.

**Example (CareerPilot):** A recommendations panel shows cited role-taxonomy nodes and an explicit “AI-assisted” disclosure rather than a naked confidence score — illustrative only.

---

## Naming

| Kind | Convention |
|------|------------|
| Python modules/funcs | `snake_case` |
| Python classes | `PascalCase` |
| TS/React types & components | `PascalCase` |
| TS functions/vars | `camelCase` |
| React files | `PascalCase.tsx` for components; match repo existing style if already consistent |
| Constants | `UPPER_SNAKE` for true constants |
| Files | Prefer clarity over abbreviation |
| Tests | Mirror source path; use clear behavior names |

---

## Error Handling

- Map domain errors to stable API error codes.  
- Include `request_id` / trace id in API error payloads.  
- Retry only idempotent or explicitly safe operations; use backoff.  
- Distinguishing user error (4xx) vs system error (5xx) is mandatory at HTTP edges.  
- Never convert auth failures into generic 500s that hide attack surface signals from operators while confusing clients.

---

## Concurrency & Async

- Document thread/async assumptions in headers for critical modules.  
- Avoid shared mutable global state.  
- Use transactions or idempotency for multi-step writes.  
- Prefer cancellation-aware clients and timeouts on outbound calls.

---

## Configuration

- Typed settings objects **shall** load from environment / secret manager.  
- Fail startup when required production config is missing (fail closed).  
- Document every public env var in project README or ops docs.  
- Do not commit `.env` files with secrets; commit `.env.example` with placeholders only.

---

## Testing Expectations Tied to Code

When changing behavior, authors **shall** update:

- Unit tests for deterministic logic  
- Contract/integration tests for boundary changes  
- Golden evals for AI-affecting behavior changes  

See [`TESTING.md`](TESTING.md) for coverage targets and AI eval policy.

---

## Code Review Focus (Coding)

Reviewers check:

- [ ] Header present and accurate for production modules  
- [ ] Boundary validation  
- [ ] No secret/PII leakage  
- [ ] Tests/evals updated  
- [ ] Exhaustive unions (TS)  
- [ ] FastAPI layers respected  
- [ ] React a11y basics  
- [ ] Minimal diff; no drive-by unrelated rewrites  
- [ ] Imports at top of module  
- [ ] Docs/contracts updated when public behavior changes  

---

## Generative AI Coding Assistants

Agents **shall** follow [`../Governance/CONTRIBUTING.md`](../Governance/CONTRIBUTING.md):

- Match existing style before introducing new libraries  
- Prefer editing existing modules over parallel “v2” copies  
- Never disable typecheckers to pass CI  
- Never invent APIs that conflict with OpenAPI/Pydantic contracts  
- Disclose substantial AI authorship in PR description when required by contributing policy  

AI-generated code is subject to the same review bar as human-authored code.

---

## Package & Monorepo Hygiene

- Prefer clear package boundaries over circular imports.  
- Shared libraries **shall** version carefully and avoid leaking app-specific secrets or env assumptions.  
- Generated code **should** be clearly marked and regenerated via documented commands.

---

## Performance Coding Guidance

- Measure hot paths before specializing.  
- Avoid N+1 queries; batch at adapters.  
- Cache only with explicit invalidation strategy.  
- For AI paths, prefer deterministic prefilters and retrieval narrowing before expensive model calls.

---

## Conformance

Stack-specific exceptions require an ADR. Formatting/lint config lives in-repo and is enforced in CI.

A repository claiming coding-standard conformance **shall**:

- Enforce lint/format/type checks in CI  
- Require headers on production modules  
- Keep FastAPI/React/TS/Python practices aligned with this document or ADR  

See Also: [`TESTING.md`](TESTING.md) · [`SECURITY.md`](SECURITY.md) · [`DOCUMENTATION_STANDARDS.md`](DOCUMENTATION_STANDARDS.md) · [`../Templates/CODE_COMMENT_HEADER_TEMPLATE.md`](../Templates/CODE_COMMENT_HEADER_TEMPLATE.md) · [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) · [`../Governance/MOM.md`](../Governance/MOM.md)
