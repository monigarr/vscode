# As-Built API & Contracts: Open-Agent

**Status:** Current
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Canonical Path:** `docs/current/API.md`
**Code:** `src/vs/workbench/contrib/openagent/`
**See Also:** [`ARCHITECTURE.md`](ARCHITECTURE.md) · [`../CONTRIBUTING.md`](../CONTRIBUTING.md)

---

## Rule

Feature UI **shall** call only `IModelGatewayService` for model egress. Do not import provider adapters from chat/composer/inline/agent surfaces.

## DI services

| Service | Decorator / Id | Implementation |
|---------|----------------|----------------|
| Model Gateway | `IModelGatewayService` (`openAgentModelGatewayService`) | `browser/api/modelGatewayService.ts` |
| Agent Loop | `IAgentLoopService` (`openAgentAgentLoopService`) | `browser/agent/agentLoopService.ts` |
| Context Index | (see `common/contextIndex.ts`) | `browser/index/contextIndexService.ts` |
| Composer | (see `common/composer.ts`) | `browser/composer/composerService.ts` |
| Vector Store | (see `common/vectorStore.ts`) | `browser/vectorStoreService.ts` |

## `IModelGatewayService`

```ts
complete(request: IModelGatewayRequest, token: CancellationToken): Promise<IModelGatewayCompletionResponse>;
stream(request: IModelGatewayRequest, token: CancellationToken): AsyncIterable<IModelGatewayStreamEvent>;
embed(request: IModelGatewayRequest, token: CancellationToken): Promise<IModelGatewayEmbeddingResponse>;
```

### Request (selected fields)

| Field | Meaning |
|-------|---------|
| `modelClass` | MES routing class (`common/modelClasses.ts`) |
| `taskType` | `generate` \| `embed` \| `rerank` \| `classify` \| `judge` |
| `messages` | Chat messages (`common/messages.ts`) |
| `pin` | Optional provider/profile/model pin |
| `budget` | Optional max tokens / cost |
| `sensitivity` | Reserved for future classification enforcement |

### Response meta

Every response carries `gatewayRequestId`, `providerId`, `profileId`, `modelClass`, `routingTableId`, `matchedRuleId`, `fallbackDepth`, `mappingVersion`, `latencyMs`, optional `usage`.

## Agent tools

| Tool id | Purpose |
|---------|---------|
| `read_file` | Read workspace file |
| `write_file` | Write workspace file |
| `apply_patch` | Apply patch |
| `run_terminal` | Run command in integrated terminal |
| `search_codebase` | Semantic / index search |

Defined in `common/agentLoop.ts`.

## Configuration keys

From `common/openAgent.ts` (`OpenAgentConfigKeys`):

| Key | Default (notable) |
|-----|-------------------|
| `openagent.enabled` | `false` |
| `openagent.chat.enabled` | `true` |
| `openagent.inline.enabled` | `true` |
| `openagent.index.enabled` | `true` |
| `openagent.composer.enabled` | `true` |
| `openagent.agent.enabled` | `true` |
| `openagent.ollama.baseUrl` | `http://127.0.0.1:11434` |
| `openagent.ollama.defaultModel` | `llama3.2` |
| `openagent.openai.baseUrl` | `https://api.openai.com/v1` |
| `openagent.openai.defaultModel` | `gpt-4o-mini` |
| `openagent.openai.profileId` | `openai` (enum of compat profiles) |
| `openagent.anthropic.baseUrl` | `https://api.anthropic.com` |
| `openagent.anthropic.defaultModel` | `claude-sonnet-4-20250514` |
| `openagent.embed.model` | `nomic-embed-text` |
| `openagent.vectorStore.backend` | `lance` (enum: `lance` \| `memory`) |
| `openagent.routing.mappingVersion` | `mapping.v2` |
| `openagent.requestTimeoutMs` | `60000` |
| `openagent.inline.debounceMs` | `200` |
| `openagent.agent.maxSteps` | `12` |

## Secrets

| SecretStorage key | Use |
|-------------------|-----|
| `openagent.openai.apiKey` | OpenAI-compatible cloud profiles |
| `openagent.anthropic.apiKey` | Anthropic provider |

## OpenAI-compatible profile ids

`ollama`, `openai`, `openrouter`, `deepseek`, `groq`, `together`, `fireworks`, `lmstudio`, `llamacpp`, `huggingface_compatible`, `custom` — see `common/profiles.ts`.

## View / contrib ids

| Constant | Value |
|----------|-------|
| `OPEN_AGENT_VIEW_CONTAINER_ID` | `workbench.view.openagent` |
| `OPEN_AGENT_CHAT_VIEW_ID` | `workbench.view.openagent.chat` |
| `OPEN_AGENT_COMPOSER_VIEW_ID` | `workbench.view.openagent.composer` |

## Telemetry event (local)

Event name `model.call` via `ILogService` — redacted metadata only. Details: [`../../src/vs/workbench/contrib/openagent/TELEMETRY.md`](../../src/vs/workbench/contrib/openagent/TELEMETRY.md).
