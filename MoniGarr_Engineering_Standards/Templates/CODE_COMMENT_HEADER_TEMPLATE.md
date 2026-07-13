# MoniGarr Engineering File Header Template

**Document:** `CODE_COMMENT_HEADER_TEMPLATE.md`  
**Purpose:** Standardized production code header for AI First / AI Native enterprise software factory repositories.  
**Owner:** Monica Peters / MoniGarr.com LLC  
**MES Version:** 1.1.1  
**Status:** Polished template  
**Created:** 2026-07-04  
**Last Updated:** 2026-07-12

---

## 1. Purpose

Every production code file should carry enough context for a reviewer, teammate, auditor, or future maintainer to understand:

- What the file does.
- Why it exists.
- Who owns it.
- How it is used.
- What security/data constraints apply.
- What performance or operational constraints apply.
- What dependencies, side effects, and verification requirements exist.

Headers are not a substitute for clear code, tests, or architecture. They are continuity and governance metadata.

---

## 2. Required Header Fields

| Field | Required? | Description |
|---|---:|---|
| `FILE` | Yes | File name and path. |
| `PURPOSE` | Yes | What this file does and why it exists. |
| `OWNER` | Yes | Responsible owner/team. |
| `AUTHOR` | Yes | Original author or organization. |
| `CREATED` | Yes | Creation date. |
| `UPDATED` | Yes | Last meaningful update. |
| `LICENSE` | Yes | License or proprietary status. |
| `USAGE` | Recommended | How to use the file or call the module. |
| `DEPENDENCIES` | Recommended | Internal/external dependencies. |
| `SECURITY` | Yes | Auth, secrets, data, network, logging, and abuse considerations. |
| `RISK CLASS` | Yes when AI / side effects | R0–R4 per [`../Engineering/CODING_STANDARDS.md`](../Engineering/CODING_STANDARDS.md) and [`../AI/AI_GUIDELINES.md`](../AI/AI_GUIDELINES.md). |
| `DATA HANDLING` | Yes when data is processed | Classification, PII/CUI/PHI/classified/sovereign/community data handling, retention. |
| `AI NOTES` | Yes when AI is involved | Prompt/model/tool/eval considerations and prohibited AI authority. |
| `PERFORMANCE` | Recommended | Latency, memory, async, throughput, cost, concurrency constraints. |
| `OBSERVABILITY` | Recommended | Logs, metrics, traces, audit events. |
| `TESTING` | Recommended | Unit/integration/eval/security tests. |
| `OPERATIONAL NOTES` | Recommended | Deployment, failure behavior, rollback, maintenance notes. |

---

## 3. Generic Header Template

```text
===============================================================================
FILE: [path/to/file.ext]
PURPOSE: [What this file does and why it exists]
OWNER: [Owner/team]
AUTHOR: [Author / organization]
CREATED: [YYYY-MM-DD]
UPDATED: [YYYY-MM-DD]
LICENSE: [License / proprietary status]

USAGE:
[How to run, import, call, or operate this file]

DEPENDENCIES:
- [Dependency]

SECURITY:
- [Authentication/authorization notes]
- [Secrets handling]
- [Network/external service constraints]
- [No sensitive data in logs unless explicitly authorized]

RISK CLASS: [R0|R1|R2|R3|R4]  (required for AI modules, agents, tool gateways)

DATA HANDLING:
- Classification: [Public/Internal/CUI/PII/Classified/etc.]
- Retention: [Policy]
- Redaction/masking: [Policy]
- AI processing eligibility: [Allowed/Restricted/Prohibited]

AI NOTES:
- [Model/tool/prompt constraints]
- [Validation/eval requirements]
- [Human review gates]

PERFORMANCE:
- [Latency, memory, async, throughput, cost, concurrency]

OBSERVABILITY:
- [Logs/metrics/traces/audit events]

TESTING:
- [Unit/integration/security/eval commands]

OPERATIONAL NOTES:
- [Failure behavior, rollback, deployment notes]
===============================================================================
```

---

## 4. Python Example

```python
"""
===============================================================================
FILE: src/telemetry_manager.py
PURPOSE: Enterprise telemetry orchestration manager for structured logs, metrics,
         traces, and audit events.
OWNER: MoniGarr.com LLC
AUTHOR: Monica Peters / MoniGarr.com LLC
CREATED: 2026-07-04
UPDATED: 2026-07-04
LICENSE: [LICENSE]

USAGE:
    telemetry = TelemetryManager()
    telemetry.start()

DEPENDENCIES:
- opentelemetry-api
- structlog

SECURITY:
- No PHI, PII, CUI, secrets, tokens, passwords, private keys, or raw prompts in logs
  unless explicitly authorized by data classification policy.
- Encrypted transport required for remote telemetry export.
- Audit events must include request ID and actor context where available.

DATA HANDLING:
- Classification: Internal by default.
- Retention: Follow project logging retention policy.
- AI processing eligibility: Restricted unless logs are redacted and approved.

AI NOTES:
- Model inputs/outputs must be logged only as hashes, classifications, or redacted
  excerpts unless explicit approval exists.
- AI-generated telemetry summaries require human review before external reporting.

PERFORMANCE:
- Async-safe.
- Non-blocking event pipeline.
- Must fail open for non-critical telemetry export but fail closed for audit records
  required by security policy.

OBSERVABILITY:
- Emits structured logs, metrics, traces, and audit counters.

TESTING:
- Unit tests: tests/test_telemetry_manager.py
- Security tests: verify no secret/PII leakage in emitted logs.

OPERATIONAL NOTES:
- If telemetry export fails, buffer according to retention limit and alert operator.
===============================================================================
"""
```

---

## 5. TypeScript / JavaScript Example

```ts
/**
 * =============================================================================
 * FILE: src/policy/toolPolicy.ts
 * PURPOSE: Deterministic tool authorization policy for AI agent workflows.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters / MoniGarr.com LLC
 * CREATED: 2026-07-04
 * UPDATED: 2026-07-04
 * LICENSE: [LICENSE]
 *
 * USAGE:
 *   const decision = authorizeToolCall(context, requestedTool);
 *
 * DEPENDENCIES:
 * - zod
 * - project auth context
 *
 * SECURITY:
 * - AI may request a tool call, but deterministic policy grants or denies it.
 * - Tool calls must be scoped by user, role, data classification, environment,
 *   budget, and operation risk.
 * - Denied tool calls must be logged as security-relevant events.
 *
 * DATA HANDLING:
 * - Classification-aware authorization required before data retrieval.
 * - CUI/PII/classified data must not be routed to unauthorized models/tools.
 *
 * AI NOTES:
 * - The model is not trusted to self-authorize.
 * - Prompt content is untrusted input.
 *
 * PERFORMANCE:
 * - Synchronous policy decision should complete within [TARGET_MS] ms.
 *
 * OBSERVABILITY:
 * - Log allow/deny decisions with request ID, actor, tool, policy version,
 *   classification, and reason code.
 *
 * TESTING:
 * - Unit tests for allow/deny cases.
 * - Regression tests for prompt-injection attempts.
 * =============================================================================
 */
```

---

## 6. Shell Script Example

```bash
#!/usr/bin/env bash
# =============================================================================
# FILE: scripts/verify.sh
# PURPOSE: Runs local verification gates for linting, tests, security scans, and
#          AI evals before release.
# OWNER: MoniGarr.com LLC
# AUTHOR: Monica Peters / MoniGarr.com LLC
# CREATED: 2026-07-04
# UPDATED: 2026-07-04
# LICENSE: [LICENSE]
#
# USAGE:
#   ./scripts/verify.sh
#
# SECURITY:
# - Do not print secrets or environment values.
# - Fail closed on security scan failures unless an approved exception exists.
# - Use least-privilege credentials.
#
# DATA HANDLING:
# - Use synthetic or approved test data only.
# - Do not send restricted data to external services.
#
# PERFORMANCE:
# - Intended for local/CI execution.
# - Keep long-running evals behind explicit flags.
#
# TESTING:
# - This script is itself part of release verification.
# =============================================================================
```

---

## 7. Header Quality Checklist

- [ ] Purpose is specific, not generic.
- [ ] Security notes identify actual risks.
- [ ] Data handling classification is present when data is processed.
- [ ] AI notes are present when AI, prompts, models, embeddings, or agents are involved.
- [ ] Usage example is current.
- [ ] Dependencies are listed or linked.
- [ ] Testing path or command is included.
- [ ] Operational failure behavior is documented for production-critical files.
