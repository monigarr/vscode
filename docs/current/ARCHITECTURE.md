# As-Built Architecture: Open-Agent

**Status:** Current (must match code)
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Canonical Path:** `docs/current/ARCHITECTURE.md`
**Code root:** `src/vs/workbench/contrib/openagent/`
**See Also:** [`IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md) · [`API.md`](API.md) · [`../target/ARCHITECTURE.md`](../target/ARCHITECTURE.md)

---

## 1. Placement in VS Code

Open-Agent is a workbench contribution registered from:

```text
src/vs/workbench/workbench.common.main.ts
  → import './contrib/openagent/browser/openagent.contribution.js'

src/vs/workbench/workbench.desktop.main.ts (desktop only)
  → import './contrib/openagent/electron-browser/openAgentVectorStore.contribution.js'

src/vs/code/electron-utility/sharedProcess/sharedProcessMain.ts (ADR-0003)
  → channel openAgentVectorStore → OpenAgentVectorStoreRemoteService
```

`openagent.contribution.ts` registers:

- `IModelGatewayService` → `ModelGatewayService` (Delayed singleton)
- Configuration schema under `openagent.*`
- Settings picker commands (LM Studio / LM Link / profiles)
- Side-effect imports for chat, inline, composer, agent, and index contributions

## 2. Container view (as-built)

```text
Workbench (renderer)
├── Open-Agent Chat View (Auxiliary Bar) — optional /agent mode
├── Open-Agent Composer View (Auxiliary Bar) — hunk Accept/Reject
├── InlineCompletionsProvider (streaming ghost text)
├── Agent loop (palette + chat) with HITL
└── Context index + vector store
        │  (desktop: shared-process Lance; else JSON/memory)
        ▼
IModelGatewayService
├── ProviderRegistry
├── OpenAiCompatibleProvider (Ollama, LM Studio, LM Link, HF/Kaggle-compat, …)
├── AnthropicProvider
├── CircuitBreaker
├── OpenAgentSecrets (SecretStorage)
└── OpenAgentTelemetry (local ILogService model.call)
```

## 3. Major components

| Component | Path | Role |
|-----------|------|------|
| Contribution entry | `browser/openagent.contribution.ts` | DI + settings + feature imports |
| Settings UX | `browser/openAgentSettingsCommands.ts` | Profile / LM Link picker |
| Model Gateway | `browser/api/modelGatewayService.ts` | Sole inference egress |
| Contracts | `common/*` | Request/response + routing + profiles |
| Chat UI | `browser/chat/*` | Sidebar chat + streaming + `/agent` |
| Inline | `browser/inline/*` | Streaming ghost-text provider |
| Composer | `browser/composer/*` | Panel + hunk HITL |
| Agent | `browser/agent/*` | ReAct loop + HITL + terminal capture |
| Index | `browser/index/*` | Symbol chunk + watchers + `@` mentions |
| Vector store | `browser/vectorStoreService.ts`, `node/*`, `electron-browser/*` | Lance IPC + fallbacks |
| Config keys | `common/openAgent.ts` | Feature flags and defaults |

## 4. Data flows (as-built)

### Chat completion

1. User sends message (optional `@` mentions or `/agent <goal>`).
2. Mentions resolve via index/SCM; agent mode calls `IAgentLoopService.run`.
3. Otherwise `IModelGatewayService.stream` with a `ModelClass`.
4. Gateway routes, applies circuit breaker, calls provider adapter.
5. Streams to the view; emits redacted `model.call` log.

### Inline completion

1. Editor uses provider `debounceDelayMs` (default **100ms**).
2. Provider streams via gateway `stream()` and fires `onDidChangeInlineCompletions`.
3. `groupId=openagent` with `excludesGroupIds` for Copilot-like groups.
4. `Ctrl/Cmd+K` triggers `editor.action.inlineSuggest.trigger`.

### Composer

1. `Ctrl/Cmd+I` opens Composer ViewPane.
2. Gateway proposes multi-file edits; diff editors open.
3. Panel supports file-level and **per-hunk** Accept/Reject.

### Agent loop

1. Palette or chat `/agent` runs `IAgentLoopService.run(goal)`.
2. HITL dialog (or callback) before `write_file` / `apply_patch` / `run_terminal`.
3. Terminal tool captures `onData` until quiet or `openagent.agent.terminalTimeoutMs`.
4. Stall detection escalates when observations repeat.

### Indexing

1. Document-symbol chunking with heuristic fallback, executed on an `IWebWorkerService` chunk worker (`OpenAgentIndexChunkClient`).
2. Embeddings via gateway `embed` on the host; incremental `IFileService` watchers.
3. Desktop Lance via shared-process remote; JSON/memory fallback otherwise.

## 5. Trust & fail-closed posture

- Master flag `openagent.enabled` defaults to **false**.
- Sub-feature flags default true but are ineffective while the master flag is off.
- API keys live in SecretStorage, never in configuration properties.
- Open-Agent distributions set `product.json` → `enableTelemetry: false` (ADR-0004); upstream telemetry *code* remains for mergeability.
- See [`../../src/vs/workbench/contrib/openagent/TELEMETRY.md`](../../src/vs/workbench/contrib/openagent/TELEMETRY.md).

## 6. Remaining follow-ups (non-blocking)

- Re-assert `enableTelemetry: false` after upstream `product.json` merges if conflicted.
- Optional deeper offload of embed batching if measured host latency requires it.

See [`IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md).
