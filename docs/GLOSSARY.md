# Open-Agent Glossary

**Status:** Active
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Updated:** 2026-07-13
**Canonical Path:** `docs/GLOSSARY.md`
**See Also:** [`../MoniGarr_Engineering_Standards/GLOSSARY.md`](../MoniGarr_Engineering_Standards/GLOSSARY.md)

Company-wide terms (HITL, Risk Class, Evidence, INCONCLUSIVE, Factory Maxim) are defined in the MES glossary. This file adds Open-Agent-specific terms.

| Term | Meaning |
|------|---------|
| **Open-Agent** | AI-native product slice in this VS Code fork under `contrib/openagent/` |
| **Model Gateway** | `IModelGatewayService` — sole DI contract for model inference egress |
| **Profile** | OpenAI-compatible endpoint pin (Ollama, LM Studio, OpenAI, DeepSeek, …) in `profiles.ts` |
| **Primary profile** | Value of `openagent.openai.profileId` set via F1 picker; drives local/embed/`code_specialist` routing when local |
| **LM Studio** | Desktop local LLM app ([docs](https://lmstudio.ai/docs/app)); Open-Agent uses its OpenAI-compatible server (default `http://127.0.0.1:1234/v1`) |
| **LM Link** | LM Studio feature ([link](https://lmstudio.ai/link)) for private remote access to models on user-owned machines; Open-Agent points the gateway at the reachable endpoint — **not** MoniGarr-hosted inference |
| **BYOK** | Bring Your Own Key — user-supplied cloud credentials in SecretStorage |
| **Fail closed** | When `openagent.enabled` is false, inference requests do not call providers |
| **As-built / current** | Documentation of behavior that exists in code (`docs/current/`) |
| **Target** | Aspirational PRD/architecture (`docs/target/`) |
| **Composer** | Multi-file edit flow: Auxiliary Bar panel (HITL) + side-by-side TextDiffEditor review canvas (`Ctrl/Cmd+I`) |
| **Agent loop** | ReAct multi-step tool loop (`IAgentLoopService`); tools include `apply_patch` (unified diff) |
| **apply_patch** | Agent tool that applies a unified diff with `@@` hunks; fails closed on malformed patches |
| **Mapping version** | Version string for class→provider routing (`openagent.routing.mappingVersion`) |
| **Partial** | Status: scaffolded but not PRD-complete |
| **Implemented** | Status: meets stated PRD acceptance with code evidence |
| **`dev` branch** | Fork branch that carries Open-Agent work; never merge into upstream-mirror `main` |
