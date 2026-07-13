# Open-Agent Runbook

**Status:** Active
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Canonical Path:** `docs/RUNBOOK.md`
**See Also:** [`SECURITY.md`](SECURITY.md) · [`current/FEATURES.md`](current/FEATURES.md) · [`../src/vs/workbench/contrib/openagent/TELEMETRY.md`](../src/vs/workbench/contrib/openagent/TELEMETRY.md)

---

## Enable Open-Agent

1. Launch Code OSS built from this repo.
2. Settings → set `openagent.enabled` = `true`.
3. Ensure desired surface flags (`chat`, `inline`, `index`, `composer`, `agent`) are on.
4. **Local path (Ollama):** start Ollama; confirm `openagent.ollama.baseUrl` and model id.
5. **Local path (LM Studio):** start [LM Studio](https://lmstudio.ai/docs/app), load a model, enable the local OpenAI-compatible server; run **Open-Agent: Select Model Profile** → LM Studio (default `http://127.0.0.1:1234/v1`).
6. **LM Link:** link devices in LM Studio per [LM Link](https://lmstudio.ai/link); run **Open-Agent: Configure LM Link Endpoint** and paste the mesh-reachable OpenAI-compatible base URL. Open-Agent does not proxy through MoniGarr.
7. **BYOK path:** store OpenAI-compatible and/or Anthropic keys in SecretStorage (never paste into settings JSON).

## Common failures

| Symptom | Likely cause | Mitigation |
|---------|--------------|------------|
| No responses / immediate fail | `openagent.enabled` false | Enable master flag |
| Connection errors to Ollama | Server down / wrong base URL | Check `127.0.0.1:11434` and `/v1` profile |
| Connection errors to LM Studio | Server not started / wrong port | Enable LM Studio local server; check `127.0.0.1:1234/v1` |
| LM Link endpoint unreachable | Mesh/link not established | Verify LM Link status in LM Studio; confirm base URL from the linked host |
| 401 from cloud | Missing/invalid secret | Re-set SecretStorage key |
| Slow inline | Model latency + debounce | Use local small model; tune `openagent.inline.debounceMs` (default 100) |
| Empty `@codebase` | Index off or empty store | Enable `openagent.index.enabled`; re-index / open workspace files |
| Agent destructive edits | Unexpected allow | Deny HITL dialogs; or disable `openagent.agent.enabled` |

## Rollback

1. Set `openagent.enabled` = `false` (immediate fail-closed).
2. Optionally disable individual surface flags.
3. Restart window if a contribution appears stuck.

## Observability

- Inspect local logs for `model.call` (redacted). Open-Agent does not upload these events.
- Correlate with `gatewayRequestId` from gateway responses when debugging UI issues.

## Privacy / telemetry (Open-Agent distributions)

1. Built product ships with `product.json` → `enableTelemetry: false` (no outbound product telemetry by default).
2. Confirm Settings → `telemetry.telemetryLevel` is `off` if you want an extra operator lock.
3. Do **not** delete upstream telemetry sources when syncing with `main` — privacy is enforced by product defaults + settings (ADR-0004).
4. Full policy: [`TELEMETRY.md`](../src/vs/workbench/contrib/openagent/TELEMETRY.md).

## Escalation

Contact: Monica Peters \<monigarr@MoniGarr.com\> — [`AUTHOR_ORGANIZATION.md`](AUTHOR_ORGANIZATION.md).
