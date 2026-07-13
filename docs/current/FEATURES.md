# As-Built Features: Open-Agent

**Status:** Current (operator / PM facing)
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Updated:** 2026-07-13
**Canonical Path:** `docs/current/FEATURES.md`
**See Also:** [`IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md) · [`../target/PRD.md`](../target/PRD.md) · [`../RUNBOOK.md`](../RUNBOOK.md)

> Describes behavior that exists in code today.

---

## Prerequisites

1. Build and run Code OSS from this repository.
2. Set `openagent.enabled` to `true` (default is `false`).
3. For cloud BYOK: store provider API keys via SecretStorage (not settings JSON).
4. For local: run Ollama, **or** [LM Studio](https://lmstudio.ai/docs/app) (`lmstudio` profile). For remote-local via [LM Link](https://lmstudio.ai/link): use command **Open-Agent: Configure LM Link Endpoint** (or Select Model Profile → LM Link).
5. **Profile selection drives routing:** choosing LM Studio / LM Link / Ollama retargets `local_private`, `embed`, and `code_specialist` traffic to that profile (local-first Composer). Health check runs after pick (warning if endpoint down; settings still saved).

## Feature flags

| Setting | Default | Effect |
|---------|---------|--------|
| `openagent.enabled` | `false` | Master gate for gateway egress |
| `openagent.chat.enabled` | `true` | Chat sidebar |
| `openagent.inline.enabled` | `true` | Ghost-text completions |
| `openagent.index.enabled` | `true` | Workspace indexing / `@codebase` |
| `openagent.composer.enabled` | `true` | Multi-file Composer flow |
| `openagent.agent.enabled` | `true` | Autonomous tool loop |
| `openagent.inline.debounceMs` | `100` | Idle debounce (PRD \<150ms) |
| `openagent.agent.terminalTimeoutMs` | `8000` | Terminal capture budget |

## Chat

| Capability | As-built |
|------------|----------|
| Auxiliary Bar chat view | Yes |
| Streaming via Model Gateway | Yes |
| `@file`, `@folder`, `@codebase`, `@git` | Yes (`@git` includes bounded SCM diff snippets) |
| Agent from chat (`/agent <goal>`) | Yes |

## Inline ghost text

| Capability | As-built |
|------------|----------|
| InlineCompletionsProvider | Yes |
| Streaming ghost text | Yes |
| Debounce default 100ms | Yes |
| Provider priority (`groupId` / `excludesGroupIds`) | Yes |
| `Ctrl/Cmd+K` trigger | Yes |

## Composer

| Capability | As-built |
|------------|----------|
| Dedicated Composer panel | Yes (HITL Accept/Reject controls) |
| `Ctrl/Cmd+I` opens Composer | Yes |
| Diff preview | Yes — side-by-side TextDiffEditor review canvas |
| Per-hunk Accept/Reject | Yes — updates the same modified text models shown in the diff editors |
| File-level Accept/Reject | Yes |
| Local-first when LM Studio/Ollama/LM Link selected | Yes (`code_specialist` follows selected local profile) |

## Agent loop

| Capability | As-built |
|------------|----------|
| ReAct multi-step loop | Yes |
| Tools: read/write/patch/terminal/search | Yes |
| `apply_patch` | Yes — unified-diff apply (fail closed on malformed patches) |
| Terminal log capture (`onData`) | Yes |
| HITL on write/shell/patch | Yes |
| Chat-integrated agent | Yes (`/agent`) |
| Step budget + stall escalate | Yes |

## Indexing & semantic search

| Capability | As-built |
|------------|----------|
| Document-symbol (AST-aware) chunking | Yes (heuristic fallback; runs on web worker) |
| Background chunk worker (`IWebWorkerService`) | Yes (embed/upsert remain host-side by design) |
| Incremental file-watcher reindex | Yes |
| LanceDB product path (desktop shared process) | Yes (JSON fallback if native unavailable) |
| `@codebase` search | Yes |
| Embeddings via selected local profile (incl. LM Studio `/embeddings`) | Yes when the served model exposes embeddings |

## Privacy / telemetry

| Capability | As-built |
|------------|----------|
| No outbound telemetry by default | Yes (`product.json` `enableTelemetry: false`) |
| Local redacted `model.call` diagnostics | Yes |
| Upstream telemetry sources retained for merge | Yes (ADR-0004) |

## Model Gateway / BYOK

| Capability | As-built |
|------------|----------|
| Unified `IModelGatewayService` | Yes |
| Ollama / OpenAI-compatible / Anthropic | Yes |
| LM Studio + LM Link profiles + picker commands | Yes — picker overrides routing + base URL |
| Health check on profile pick | Yes (non-blocking warning on failure) |
| Hugging Face / Kaggle-compatible profiles | Yes (OpenAI-compat endpoints) |
| SecretStorage for API keys | Yes |
| Circuit breaker + routing eval tests | Yes |
