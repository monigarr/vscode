# Open-Agent Security

**Status:** Active
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Canonical Path:** `docs/SECURITY.md`
**See Also:** [`../MoniGarr_Engineering_Standards/Engineering/SECURITY.md`](../MoniGarr_Engineering_Standards/Engineering/SECURITY.md) · [`AI_ENGINEERING_GUIDELINES.md`](AI_ENGINEERING_GUIDELINES.md) · [`../src/vs/workbench/contrib/openagent/TELEMETRY.md`](../src/vs/workbench/contrib/openagent/TELEMETRY.md)

---

## Classification

Open-Agent processes **workspace source code** which may be Internal, proprietary, or otherwise sensitive. Treat prompts and file contents as untrusted input to models and as confidential relative to third parties.

This document is **not** a certification, ATO, FedRAMP, or HIPAA evidence pack.

## Threat surface (product slice)

| Asset | Risk | Control (as-built) |
|-------|------|--------------------|
| API keys | Theft via settings/logs | SecretStorage; never config properties |
| Source in prompts | Leak to cloud providers | User chooses local vs BYOK; master flag off by default |
| Agent file write | Destructive edits | HITL confirm dialog (or chat approve callback) before write/apply_patch |
| Agent terminal | Arbitrary command execution | HITL confirm before run_terminal; bounded output capture timeout |
| Telemetry | Prompt/key exfil | `enableTelemetry: false` in product.json; local redacted `model.call` only in Open-Agent (ADR-0004) |

## Fail-closed

- `openagent.enabled` default **`false`**.
- When disabled, gateway requests fail closed (no provider calls).

## Secrets

| Key | Storage |
|-----|---------|
| `openagent.openai.apiKey` | SecretStorage |
| `openagent.anthropic.apiKey` | SecretStorage |

Never commit `.env` files with real keys. Never log Authorization headers.

## Network

Outbound HTTPS/HTTP only through registered providers when enabled. Prefer local Ollama (`127.0.0.1`) for air-gapped workflows.

## Upstream VS Code telemetry

Open-Agent keeps upstream telemetry **code** intact for merge safety (ADR-0004) but ships with **`product.json` → `enableTelemetry: false`**, so Open-Agent distributions perform no outbound product telemetry by default. Local redacted `model.call` logs remain the Open-Agent diagnostics path. Operators may set `telemetry.telemetryLevel` to `off` as an additional confirm. See [`TELEMETRY.md`](../src/vs/workbench/contrib/openagent/TELEMETRY.md).

## Reporting

Security contact: Monica Peters \<monigarr@MoniGarr.com\> / MoniGarr.com LLC — see [`AUTHOR_ORGANIZATION.md`](AUTHOR_ORGANIZATION.md).
