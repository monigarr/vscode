# Open-Agent Testing

**Status:** Active
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Canonical Path:** `docs/TESTING.md`
**See Also:** [`VERIFY.md`](VERIFY.md) · [`../MoniGarr_Engineering_Standards/Engineering/TESTING.md`](../MoniGarr_Engineering_Standards/Engineering/TESTING.md)

---

## Unit tests (Open-Agent)

Located under `src/vs/workbench/contrib/openagent/test/browser/`:

| File | Covers |
|------|--------|
| `modelGatewayService.test.ts` | Gateway routing / fail-closed behavior |
| `openAiCompatibleProvider.test.ts` | OpenAI-compatible adapter |
| `anthropicProvider.test.ts` | Anthropic adapter |
| `chunker.test.ts` | Chunking heuristics + symbol ranges |
| `indexChunkWorkerContract.test.ts` | Worker `$chunkSource` contract (in-process) |
| `composerHunks.test.ts` | Composer hunk computation |
| `routingEval.test.ts` | Golden routing / privacy filter fixtures |
| `memoryVectorStore.test.ts` | In-memory vector store |
| `contextMentions.test.ts` | `@` mention parsing / resolution |

Prefer stubbing network; do not require live API keys for unit tests.

## How to run

Use the repository’s standard VS Code unit-test workflow for workbench browser tests (same harness as other `src/vs/workbench/contrib/**/test` suites). Example pattern (adjust to your local script):

```bash
# From repo root — use the project’s documented unit test runner for a single suite
npm run test-browser -- --run src/vs/workbench/contrib/openagent/test/browser/chunker.test.ts
```

If the exact npm script differs in your branch, follow [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) / upstream Code OSS test docs and target the `openagent/test/browser` path.

## What to add with features

| Change | Test expectation |
|--------|------------------|
| Gateway / provider | Unit tests with mocked fetch |
| Chunker / mentions / vector math | Pure unit tests |
| Agent tools | Unit tests for argument parsing + deny paths; integration later |
| UI panes | Prefer focused unit/integration; avoid flaky full workbench unless needed |

## Honesty rule

Do not fabricate green CI. If tests were not run, say so in the PR.
