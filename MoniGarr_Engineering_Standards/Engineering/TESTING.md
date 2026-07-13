# TESTING — Deterministic Proof and AI Evaluation

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All Products, Services, Repositories  
**Canonical Path:** `Engineering/TESTING.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) · [`../Governance/MOM.md`](../Governance/MOM.md) · [`../Governance/MILE.md`](../Governance/MILE.md) · [`ENGINEERING_STANDARDS.md`](ENGINEERING_STANDARDS.md) · [`CODING_STANDARDS.md`](CODING_STANDARDS.md) · [`SECURITY.md`](SECURITY.md) · [`OBSERVABILITY.md`](OBSERVABILITY.md) · [`RELEASE_PROCESS.md`](RELEASE_PROCESS.md) · [`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md) · [`../Templates/VERIFY_TEMPLATE.md`](../Templates/VERIFY_TEMPLATE.md) · [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) · [`../GLOSSARY.md`](../GLOSSARY.md)

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

This standard is **company-wide**. Testing strategy is part of architecture, not an afterthought.

---

## Purpose

Testing proves that systems behave as intended, remain safe under change, and can be handed off with confidence. For MoniGarr, “tested” spans:

1. **Deterministic software proof** — unit, integration, contract, end-to-end  
2. **Probabilistic AI evaluation** — golden sets, rubrics, thresholds, regression gates  
3. **Security and resilience validation** — abuse cases, chaos/failure drills as risk warrants  

A green demo without automated proof is not done.

---

## Dual Coverage Model (Normative)

**SoT hierarchy:** This document owns **project operational floors**. Architecture Part XV owns **portfolio ambition**. See [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) Domain Source-of-Truth Registry and Architecture Part XV hierarchy rule.

MES distinguishes two coverage regimes:

| Regime | Target | What “100%” means |
|--------|--------|-------------------|
| **Deterministic code** | **100% coverage target** for owned production logic that can be unit/integration tested | Line/branch (project-defined metric) approaches full coverage of meaningful deterministic paths; exclusions documented |
| **AI / probabilistic behavior** | **Eval coverage**, not naive line coverage of prompts | Golden cases, rubrics, and thresholds covering critical journeys, failure modes, and safety bounds |

Projects **shall not** claim “100% test coverage” for LLM outputs by measuring only Python/TS line coverage of wrapper code. Equally, projects **shall not** treat golden evals as a substitute for deterministic tests of policy, authZ, schemas, and tooling.

### Deterministic 100% Target — Rules

- Aim for **100%** coverage of **critical-path** deterministic production modules under team ownership (authZ, policy, schemas, money/path-critical domain logic, tool gateways).  
- Remaining deterministic modules **should** approach full coverage; exclusions **shall** be explicit (generated code, thin framework wiring, unreachable defensive branches) with rationale.  
- Coverage without assertions is vanity; mutation testing **may** be used where it improves signal.  
- New deterministic logic **shall** land with tests in the same change.

### AI Eval Coverage — Rules

- Critical AI journeys **shall** have golden eval coverage before production release.  
- Eval suites **shall** version inputs, expected qualities, and scoring method.  
- Threshold regressions **shall** block release (eval gate).  
- Coverage is measured by scenario/risk coverage (happy path, refusal, injection, retrieval miss, tool denial, cost overrun), not by “percent of prompt text executed.”

### Release Gate Hierarchy (Eval)

| Gate | Role |
|------|------|
| **Golden evals** | **Block** release when AI-affecting; required Evidence Pack artifact |
| **Continuous evaluation** | Supplements golden gates where authorized in `VERIFY.md`; may alert or block **only** when project thresholds define it as a release gate |
| **Online / production sampling** | Observability and drift detection; does not replace pre-release golden gates |

Canonical wording for M.O.M. / RELEASE: continuous evaluation **supplements** golden gates — it does not replace them. See [`RELEASE_PROCESS.md`](RELEASE_PROCESS.md) and [`../Governance/MOM.md`](../Governance/MOM.md).

**Example (CareerPilot):** Deterministic match-ranking policy and authZ middleware target near-100% unit/integration coverage on critical paths; recommendation narrative quality is gated by golden evals with provenance and hallucination rubrics — illustrative only.

---

## Test Pyramid & Layers

| Layer | Intent | Cadence |
|-------|--------|---------|
| Unit | Fast proof of pure logic and domain rules | Every PR |
| Integration | DB, queues, HTTP adapters, auth wiring | Every PR or high-signal subset + nightly full |
| Contract | API schemas and consumer expectations | Every PR for changed contracts |
| End-to-end | Critical user journeys | Pre-release / staged |
| Eval | AI quality, safety, grounding | Pre-release + continuous as authorized |
| Security tests | AuthZ negatives, injection, dependency scans | CI + release |
| Load / soak | Capacity and leak detection | Risk-based |

Prefer many fast deterministic tests over a few fragile UI-only suites.

---

## VERIFY.md as Evidence Plan

Projects **shall** maintain `VERIFY.md` (from [`../Templates/VERIFY_TEMPLATE.md`](../Templates/VERIFY_TEMPLATE.md)) listing:

- Commands to run locally and in CI  
- Gates that must pass before merge/release  
- Artifacts retained as evidence  
- Known gaps and owners  

If a claim cannot be reproduced from VERIFY commands, it is not verified.

---

## Unit Testing Standards

- Tests **shall** be deterministic and isolated.  
- Name tests by behavior, not implementation trivia.  
- Prefer arrange-act-assert clarity.  
- Do not hit live paid APIs in unit tests; use fakes/fixtures.  
- Time, randomness, and network **shall** be controlled.

Python default: `pytest`. TypeScript default: project-standard runner (Vitest/Jest) with CI enforcement.

---

## Integration & Contract Testing

- Prefer real engines in ephemeral environments (containers) when practical.  
- Schema changes **shall** update contract tests and consumer docs together.  
- Migrations **shall** have upgrade/rollback proof as risk warrants.  
- AuthN/Z paths **shall** include negative tests (deny cases).

---

## End-to-End Testing

- Cover critical revenue/safety journeys, not every UI permutation.  
- Stabilize with test IDs and explicit waits; avoid brittle selectors.  
- Keep secrets out of recorded traces.  
- Flakes **shall** be treated as defects; quarantine with owner and expiry.

---

## AI Evaluation Standards

### Golden Sets

- Curated, versioned, reviewed like code.  
- Include expected outcomes, rubrics, or reference answers.  
- Track provenance of fixtures; no silent production PII in golden sets without authorization.

### Gates

- Define minimum pass rates / maximum hallucination rates per journey.  
- Model, prompt, or retrieval changes that drop below threshold **shall** fail the release gate.  
- Record eval reports as release evidence.

### Continuous Evaluation

Where authorized, sample production (redacted) traffic against offline judges. Continuous evaluation **supplements — does not replace — pre-release golden gates**. See Release Gate Hierarchy above. Production sampling requires privacy/legal basis per [`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md) when regulated data may appear.

### Red Team / Adversarial

AI-exposed systems **should** include prompt-injection, tool-abuse, and data-exfiltration cases in eval or security suites.

---

## Coverage Reporting

CI **shall** publish coverage artifacts for deterministic suites. Reports **should** distinguish:

- Deterministic coverage percentage and excluded files  
- Eval suite inventory and pass/fail thresholds  

Do not merge the two into a single misleading number.

---

## Test Data Management

- Prefer synthetic fixtures.  
- Anonymize if using production-derived data.  
- Classify fixtures when they contain sensitive patterns.  
- Never commit live secrets, tokens, or unrestricted customer dumps.

---

## Performance & Reliability Tests

- Publish budgets for critical endpoints/journeys.  
- Regressions beyond budget require fix or explicit acceptance.  
- Chaos/failure injection **may** be required for multi-service production systems.

---

## Security Testing Tie-In

Coordinate with [`SECURITY.md`](SECURITY.md):

- SAST/dependency scans in CI  
- Negative authZ tests  
- Secrets detection  
- AI abuse cases for model-facing surfaces  

Security test failures are release blockers unless an approved exception records residual risk.

---

## CI Requirements

Every production repository **shall**:

- Run lint/typecheck/unit tests on PR  
- Fail on coverage regressions below agreed floor while pursuing the 100% deterministic target  
- Run eval gates for AI-affecting changes before production promotion  
- Upload evidence artifacts needed for release records  

See [`DEVOPS.md`](DEVOPS.md) for pipeline mechanics.

---

## Ownership & Quarantine Policy

- Flaky tests **shall** have an owner within two business days.  
- Quarantine without expiry is non-conformant.  
- Deleting tests to green CI without replacing proof is non-conformant.

---

## Local Developer Expectations

Engineers and agents **shall** be able to run the primary proof suite from documented commands without production credentials. Heavy suites **may** be opt-in locally but **shall** run in CI.

---

## Definition of Done (Testing Slice)

A behavioral change is testing-complete when:

- [ ] Deterministic tests cover new logic or exclusions are documented  
- [ ] Contracts/API proofs updated if boundaries changed  
- [ ] AI journeys have eval coverage / threshold check if AI-affecting  
- [ ] VERIFY.md commands still accurate  
- [ ] CI gates pass  

---

## Anti-Patterns

- “We’ll add tests after launch” for production paths  
- Snapshot abuse that hides semantic breakage  
- Counting prompt wrapper lines as AI quality proof  
- Live LLM calls in unit tests without hermetic fixtures  
- Ignoring flaky suites  
- Using production customer data unmarked in fixtures  

---

## Metrics to Review

- Deterministic coverage trend vs 100% target  
- Eval pass rate and hallucination/grounding metrics  
- Flake rate  
- Defect escape rate  
- Time to prove a change locally  

---

## Conformance Checklist

- [ ] Dual coverage model understood and applied  
- [ ] VERIFY.md present and runnable  
- [ ] CI enforces deterministic and (when applicable) eval gates  
- [ ] Exclusions and thresholds documented  
- [ ] Security negatives included for sensitive surfaces  

---

## See Also

- [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md)  
- [`../Governance/MOM.md`](../Governance/MOM.md)  
- [`ENGINEERING_STANDARDS.md`](ENGINEERING_STANDARDS.md) · [`RELEASE_PROCESS.md`](RELEASE_PROCESS.md) · [`OBSERVABILITY.md`](OBSERVABILITY.md) · [`SECURITY.md`](SECURITY.md)
