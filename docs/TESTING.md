# Open-Agent Testing

**Status:** Active
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Updated:** 2026-07-13
**Canonical Path:** `docs/TESTING.md`
**See Also:** [`VERIFY.md`](VERIFY.md) · [`../MoniGarr_Engineering_Standards/Engineering/TESTING.md`](../MoniGarr_Engineering_Standards/Engineering/TESTING.md)

---

## Unit tests (Open-Agent)

Located under `src/vs/workbench/contrib/openagent/test/browser/`:

| File | Covers |
|------|--------|
| `modelGatewayService.test.ts` | Fail-closed gate; routing; LM Studio profile override for local/embed/`code_specialist`; secrets not logged |
| `openAiCompatibleProvider.test.ts` | OpenAI-compatible adapter (chat + `/embeddings`) |
| `anthropicProvider.test.ts` | Anthropic adapter |
| `chunker.test.ts` | Chunking heuristics + symbol ranges |
| `indexChunkWorkerContract.test.ts` | Worker `$chunkSource` contract (in-process) |
| `composerHunks.test.ts` | Composer hunk computation |
| `routingEval.test.ts` | Golden default routing table + privacy filter fixtures |
| `memoryVectorStore.test.ts` | In-memory vector store |
| `contextMentions.test.ts` | Production `parseOpenAgentMentions` parser |
| `applyPatch.test.ts` | Unified-diff apply + fail-closed malformed patches + bounded diff snippets |

Prefer stubbing network; do not require live API keys for unit tests.

## How to run

Requires `npm ci` / `npm install` at the repo root (VS Code deps). Then use the workbench browser unit-test harness:

```bash
# Prefer no Playwright reinstall when browsers are already present
npm run test-browser-no-install -- --grep Open-Agent

# Or target a single suite path (adjust if the harness flag differs on your branch)
npm run test-browser-no-install -- --run src/vs/workbench/contrib/openagent/test/browser/applyPatch.test.ts
```

If the exact npm script differs, follow [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) / upstream Code OSS test docs and target `openagent/test/browser`.

## What to add with features

| Change | Test expectation |
|--------|------------------|
| Gateway / provider / profile override | Unit tests with mocked fetch (`modelGatewayService.test.ts`) |
| Chunker / mentions / vector math / apply_patch | Pure unit tests |
| Agent tools | Unit tests for argument parsing + deny / malformed patch paths; integration later |
| UI panes | Prefer focused unit/integration; avoid flaky full workbench unless needed |

## Honesty rule

Do not fabricate green CI. If tests were not run, say so in the PR / VERIFY notes.
