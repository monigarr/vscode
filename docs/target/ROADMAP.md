# Open-Agent Roadmap (Target → Current)

**Status:** Active planning artifact
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Canonical Path:** `docs/target/ROADMAP.md`
**See Also:** [`PRD.md`](PRD.md) · [`../current/IMPLEMENTATION_STATUS.md`](../current/IMPLEMENTATION_STATUS.md)

> Features **migrate** from this roadmap into [`../current/`](../current/) only when code evidence exists. Status language: Implemented | Partial | Stub | Missing.

---

## North star

Ship a privacy-first, BYOK / local-LLM capable AI-native Code OSS fork (including [LM Studio](https://lmstudio.ai/docs/app) and [LM Link](https://lmstudio.ai/link) for user-owned local and remote-local models) with Cursor/Codex/Claude-Code-class surfaces, while keeping all custom code merge-safe under `contrib/openagent/`.

---

## Local LLM access — LM Studio & LM Link

Product refs: [LM Studio docs](https://lmstudio.ai/docs/app) · [LM Link](https://lmstudio.ai/link) · PRD §3.5 · Architecture §2.5

| Feature | Status | Wave | Exit criteria |
|---------|--------|------|---------------|
| **LM Studio** local OpenAI-compatible profile (`lmstudio`, default `http://127.0.0.1:1234/v1`) | **Implemented** | 0 | Profile + health path; picker command |
| LM Studio as primary local runtime in operator docs | **Implemented** | 0 | Runbook + FEATURES list LM Studio alongside Ollama |
| LM Studio embeddings when model serves `/embeddings` | **Partial** / TBD per model | 1–4 | Document which tasks work with LM Studio embed models |
| **LM Link** — use models on linked remote devices via reachable OpenAI-compatible URL | **Implemented** | 4 | `lmlink` profile + Configure LM Link Endpoint command |
| LM Link privacy posture (user-owned mesh only) | **Implemented** | 4 | SECURITY + RUNBOOK + ADR-0004 |
| Settings / profile picker discoverability for LM Studio + LM Link endpoints | **Implemented** | 4 | F1: Select Model Profile / Configure LM Link Endpoint |

---

## Waves

### Wave 0 — Platform spine (**Implemented**)

| Item | PRD | Goal |
|------|-----|------|
| Unified Model Gateway + profiles | 3.5 | Fail-closed gateway; Ollama/OpenAI/Anthropic/compat |
| **LM Studio** local profile | 3.5 | `lmstudio` OpenAI-compatible profile |
| SecretStorage BYOK | 3.5 | No API keys in settings JSON |
| Feature flags | 4 | Master `openagent.enabled` default false |
| Local redacted `model.call` logs | 4 | No prompt/key upload from Open-Agent slice |

### Wave 1 — Chat & context (**Implemented**)

| Item | PRD | Exit criteria |
|------|-----|---------------|
| Chat sidebar streaming | 3.3 | Stable Auxiliary Bar chat with gateway stream |
| `@file` / `@folder` / `@codebase` | 3.1 | Mentions resolve to real workspace content |
| AST-aware chunking + file watchers | 3.1 | Document-symbol chunks + incremental index |
| LanceDB wired in product path | 3.1 | Shared-process Lance (ADR-0003); JSON fallback |
| `@git` context | 3.1 | SCM status/diff list injection |

### Wave 2 — Inline & Composer (**Implemented**)

| Item | PRD | Exit criteria |
|------|-----|---------------|
| Ghost-text streaming \<150ms path | 3.2 | Streaming + debounce default 100ms |
| Provider priority / interception | 3.2 | `groupId` / `excludesGroupIds` (no core patch) |
| Dedicated Composer panel | 3.3 | Composer ViewPane registered |
| Per-block Accept/Reject in diff UI | 3.3 | Hunk-level HITL in Composer panel |

### Wave 3 — Autonomous agent (**Implemented**)

| Item | PRD | Exit criteria |
|------|-----|---------------|
| Terminal log observation loop | 3.4 | `onData` capture with timeout |
| Chat-integrated agent runs | 3.4 | `/agent` from chat |
| HITL for write / shell | 3.4 | Dialog/callback approval |
| Tool budgets & escalation | 3.4 | Max steps + stall escalate |

### Wave 4 — Provider completeness & privacy hardening (**Implemented**)

| Item | PRD | Exit criteria |
|------|-----|---------------|
| **LM Link**–reachable endpoint UX | 3.5 | Profile + commands + runbook |
| LM Studio + LM Link settings discoverability | 3.5 | Profile picker commands |
| Hugging Face / Kaggle pipeline endpoints | 3.5 | OpenAI-compatible profiles + health paths |
| Upstream telemetry posture for privacy builds | 4 | ADR-0004 + `enableTelemetry: false` + revised PRD wording |
| Eval harness for gateway routing | MES | `routingEval.test.ts` golden fixtures |
| Index background chunk worker | 4 | `IWebWorkerService` chunk worker; embed remains host-side |

---

## How to update this roadmap

1. Change code under `contrib/openagent/`.
2. Update [`../current/IMPLEMENTATION_STATUS.md`](../current/IMPLEMENTATION_STATUS.md) with status, files, and gaps.
3. Move completed wave items to “Done” notes here only after status is Implemented.
4. If architecture changes, add or supersede an ADR under [`../ADR/`](../ADR/).
