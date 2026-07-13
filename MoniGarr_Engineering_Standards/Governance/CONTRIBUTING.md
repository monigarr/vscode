# CONTRIBUTING — Human + AI Coding Agent Contract

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All human contributors and AI coding agents (Codex, Cursor, Claude Code, Gemini CLI, and equivalents)  
**Canonical Path:** `Governance/CONTRIBUTING.md`  
**See Also:** [`MOM.md`](MOM.md) · [`MILE.md`](MILE.md) · [`ADR_GUIDE.md`](ADR_GUIDE.md) · [`MES_REVIEW_PROCESS.md`](MES_REVIEW_PROCESS.md) · [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) · [`../Engineering/CODING_STANDARDS.md`](../Engineering/CODING_STANDARDS.md) · [`../Engineering/DOCUMENTATION_STANDARDS.md`](../Engineering/DOCUMENTATION_STANDARDS.md) · [`../MDES.md`](../MDES.md) · [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`MOM.md`](MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Purpose

This document is the contribution contract for every MoniGarr repository that inherits MES.

It binds:

- Human engineers (all levels)
- AI coding agents used inside IDEs, CLIs, or automation
- Reviewers and releasers

Product repositories may extend this file with project-specific commands, but they **shall not** weaken MES quality gates, security posture, or human accountability.

---

## Non-Negotiables

1. **Humans remain accountable** for correctness, ethics, architecture, security, and production approval.  
2. **Evidence over assertion** — tests, evals, scans, traces, and docs prove readiness.  
3. **Documentation is product** — behavior changes update docs in the same change set.  
4. **Secrets never enter git** — including `.env`, keys, tokens, customer data dumps.  
5. **No unbounded AI autonomy in production** — deterministic policy governs tools, data, and deploy.  
6. **MES deviations require an ADR** — see [`ADR_GUIDE.md`](ADR_GUIDE.md).  
7. **Architecture/_part_*.md are build fragments — not published SoT** — cite only [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md). Run `scripts/check-fragment-citations.ps1` when editing suite docs.  
8. **AI concept ownership** — use [`../AI/INDEX.md`](../AI/INDEX.md) before duplicating AI definitions.  
9. **No PHI / CUI / production customer data in PR artifacts, screenshots, logs, or prompts** unless an approved redaction/synthetic procedure is documented in project privacy/security artifacts.  
10. **Agents shall not set MDES/MCR disposition to Accept** (or Excellence claims) without human Suite Owner / reviewer confirmation.  
11. **Before a Material suite MDES/MCR claim**, run `scripts/check-fragment-citations.ps1` and `scripts/check-references-links.ps1`; file link-check evidence under [`../MDES_REVIEWS/`](../MDES_REVIEWS/) when REFERENCES URLs change or on annual governance review.

---

## Before You Change Code

All contributors (human or agent) **shall**:

1. Read the project `README.md`, `PRD.md`, and `ARCHITECTURE.md`.  
2. Read `AI_GUIDELINES.md` / agent contract files when AI components exist.  
3. Search existing ADRs and issues for prior decisions.  
4. Confirm the change fits the system boundary and non-goals.  
5. Identify required tests, evals, security review, and doc updates.  

Agents **shall** load suite context from `SYSTEM_CONTEXT.md` when working across MES-conformant repos.

---

## Contribution Workflow

```text
Discover → Design (if material) → Validate → Implement → Test/Eval → Document → Review → Merge → Observe
```

Aligns with M.O.M. lifecycle ([`MOM.md`](MOM.md)): Discover → Design → **Validate** → Implement → Evaluate → Review → Deploy → Observe → Improve. CONTRIBUTING compresses Evaluate/Review/Deploy into Test/Eval → Review → Merge for day-to-day PR work; Validate remains required for **Risk Class R2+** (threat model, privacy, acceptance criteria) and always for R3+ production paths.

| Step | Human | AI agent |
|------|-------|----------|
| Scope | Clarify intent and risk | Restate task; ask when ambiguous |
| Design | ADR / architecture update when required | Draft ADR/options; do not self-accept |
| Implement | Own the PR | Produce minimal, reviewable diffs |
| Prove | Run local/CI gates | Run available verify scripts; report evidence |
| Review | Approve merge | Respond to review; never approve own production deploy |
| Operate | Own incidents for owned services | Assist with runbooks; do not silently change prod |

---

## Pull Request Requirements

Every PR **shall** include:

- Clear summary of *why* (not only *what*)
- Linked issue / ticket when the project uses a tracker
- Tests or evals for behavioral change
- Doc updates when user-facing or operator-facing behavior changes
- Notes on risk, rollback, and feature flags when relevant
- Explicit callout of AI-generated substantial portions (see below)

Every PR **should**:

- Stay small and focused
- Separate refactors from behavior changes when practical
- Include screenshots or traces for UI / observability changes

Every PR **must not**:

- Commit secrets or production data  
- Include PHI, CUI, or production customer data in PR descriptions, screenshots, logs, or fixtures without approved redaction/synthetic basis  
- Disable failing gates without an approved exception  
- Bundle unrelated MES deviations

### Suggested PR Body Skeleton

```markdown
## Summary
- Why this change exists
- User / operator impact

## Evidence
- [ ] Unit / integration tests
- [ ] Evals (if AI-affecting)
- [ ] Lint / typecheck / security scans
- [ ] Docs updated
- [ ] No PHI/CUI/production customer data in PR artifacts
- [ ] MDES review (normative / material doc changes): scores + disposition
- [ ] MCR check (suite doc changes): SoT / enum / xref / hierarchy — see [`MES_REVIEW_PROCESS.md`](MES_REVIEW_PROCESS.md)
- [ ] Evidence artifact link: `MDES_REVIEWS/...` or PR-attached table

## Risk & Rollback
- Risk class: R0 | R1 | R2 | R3 | R4 (see [`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md) / [`../GLOSSARY.md`](../GLOSSARY.md#risk-class))
- Side-effect class (if agent/tool change): read | draft | write | irreversible (see [`../AI/TOOLS.md`](../AI/TOOLS.md))
- HITL evidence attached: [link / N/A — required for R2+ externalization and R3+ production paths]
- Rollback plan: ...

## AI Assistance
- [ ] Substantial AI-authored code (tool: ...)
- Human reviewed: Yes
```

---

## Human Contributor Expectations

Humans **shall**:

- Leave the system easier to understand than they found it  
- Review AI-produced diffs as carefully as human diffs  
- Refuse merge when evidence is missing for Risk Class R2+ (R3+ requires Evidence Pack)  
- Mentor juniors and document tribal knowledge into the repo  
- Follow coding, testing, security, and release standards under `Engineering/`  

Humans **own**:

- Final architectural acceptance  
- Production deploy approval for R3+ changes (R4 dual-control or designated approver)  
- Incident command for their services  
- Ethical and legal judgment AI cannot assume  

---

## AI Coding Agent Contract

Applies to **Codex**, **Cursor**, **Claude Code**, **Gemini CLI**, and equivalent agents.

### Agents May

- Read repository and MES context  
- Propose designs, ADRs, tests, docs, and refactors  
- Implement scoped tasks with minimal diffs  
- Run local lint, tests, evals, and verify scripts when available  
- Open or update draft PRs when tooling allows  
- Surface risks, missing docs, and gate failures  

### Agents Shall

- Prefer existing patterns over novel frameworks  
- Keep imports at module top (no inline imports unless documented circular-dependency exception)  
- Use exhaustive handling for discriminated unions / enums in TypeScript  
- Add or update file headers per [`../Templates/CODE_COMMENT_HEADER_TEMPLATE.md`](../Templates/CODE_COMMENT_HEADER_TEMPLATE.md) for production modules  
- Cite provenance for factual claims grounded in repo docs  
- Stop and ask when requirements conflict with MES, security, or privacy constraints  
- Mark ADRs as `Proposed`, never self-`Accepted`  

### Agents Must Not

- Invent product requirements not present in PRD / issues / explicit user instruction  
- Weaken security, authZ, or evaluation gates “to make CI green”  
- Exfiltrate secrets, customer data, or private prompts into logs, issues, or chat exports  
- Perform destructive git operations (`push --force` to main, hard reset of shared history) unless explicitly instructed by a human with clear intent  
- Deploy to production or change live infrastructure without human approval  
- Claim certification (SOC 2, FedRAMP, etc.) or “Production Ready / Enterprise Ready” without meeting MES definitions and evidence  
- Set MDES/MCR disposition to Accept or claim MDES Excellence without human confirmation  
- Hide uncertainty; prefer explicit `INCONCLUSIVE` / questions over hallucinated certainty  

### Agent Onboarding Files

Projects **should** provide one or more of:

| File | Role |
|------|------|
| `CLAUDE.md` / `AGENTS.md` / `.cursor/rules` | Agent-facing operating notes |
| `AI_GUIDELINES.md` | Bounds, tools, prohibited authority |
| `ONBOARDING.md` | How to run, test, and safely change |
| `VERIFY.md` | Exact proof commands and gates |

Agents treat these as binding for that repository, subordinate to MES conflict rules in [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md).

---

## Code Quality Contract

Follow [`../Engineering/CODING_STANDARDS.md`](../Engineering/CODING_STANDARDS.md) and [`../Engineering/ENGINEERING_STANDARDS.md`](../Engineering/ENGINEERING_STANDARDS.md).

Minimum expectations:

- Readable names; no dead code introduced intentionally  
- Errors handled at boundaries; no silent swallow of security-relevant failures  
- Tests for new logic; golden evals for AI-affecting changes  
- Structured logging without sensitive payloads  
- Public APIs documented  

---

## Testing & Evaluation Contract

Follow [`../Engineering/TESTING.md`](../Engineering/TESTING.md) and M.I.L.E. evaluation discipline.

| Change type | Minimum proof |
|-------------|----------------|
| Pure refactor | Existing tests still pass |
| Behavior change | Unit/integration coverage of new behavior |
| API contract change | Contract tests + API.md update |
| AI prompt / retrieval / agent change | Golden evals + threshold check |
| Security-sensitive change | Security review + relevant tests/scans |
| Infra / deploy change | Plan review, dry-run where possible, rollback notes |

---

## Security & Privacy Contract

Follow [`../Engineering/SECURITY.md`](../Engineering/SECURITY.md).

- Least privilege for tokens used by humans and agents  
- No production data in local sandboxes without explicit authorization  
- Prompt injection treated as untrusted input  
- Dependency and secret scanning in CI for production repos  
- Report suspected incidents per [`../Engineering/ONCALL.md`](../Engineering/ONCALL.md)  

---

## Documentation Contract

Follow [`../Engineering/DOCUMENTATION_STANDARDS.md`](../Engineering/DOCUMENTATION_STANDARDS.md) for authoring rules.

Normative or material documentation changes **shall** include an MDES evaluation ([`../MDES.md`](../MDES.md)) **and** an MCR check when suite integrity is affected ([`MES_REVIEW_PROCESS.md`](MES_REVIEW_PROCESS.md)): criterion scores, coherence findings, and disposition (Accept | Revise | ADR required) in the PR or a linked artifact under [`../MDES_REVIEWS/`](../MDES_REVIEWS/).

Same-change-set updates for:

- README / ONBOARDING when run steps change  
- API.md / DATA_MODEL.md when contracts change  
- CHANGELOG for user-visible or operator-visible releases  
- RUNBOOK when failure modes or alerts change  

---

## Review & Merge

- At least one human review for changes touching production paths  
- Owners of security, AI eval, or data domains review changes in their domains  
- Conventional commits preferred (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`)  
- Protected main/trunk; no direct push of material changes  

AI agents may assist review with checklists; merge authority remains human.

---

## Release & Hotfix

- Releases follow [`../Engineering/RELEASE_PROCESS.md`](../Engineering/RELEASE_PROCESS.md)  
- Hotfixes still require evidence proportional to risk and a follow-up for missing docs/tests  
- Versioning is SemVer unless an ADR documents an exception  

---

## Example (CareerPilot) — Illustrative Only

**Example (CareerPilot):** An agent implementing a new resume-parsing tool would read CareerPilot `AI_GUIDELINES.md`, add deterministic schema validation, extend golden evals for parse quality, update `API.md`, and open a PR marked with AI assistance — without deploying the tool to production or raising autonomy. This example is illustrative only.

---

## Reporting Problems in MES Itself

Defects or ambiguities in this suite:

1. Open an issue or change request against the MES repository  
2. Do not silently fork conflicting local “standards”  
3. Project-level exceptions go through ADRs, not README folklore  

---

## Conformance

A contribution is MES-conformant when it respects this contract, leaves evidence for reviewers, and preserves human accountability.

See Also: [`MOM.md`](MOM.md) · [`MILE.md`](MILE.md) · [`ADR_GUIDE.md`](ADR_GUIDE.md) · [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) · [`../MDES.md`](../MDES.md)
