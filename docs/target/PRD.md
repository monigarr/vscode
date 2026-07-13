# Product Requirement Document (PRD): Open-Agent (VS Code Fork)

**Status:** Target (aspirational requirements)
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Canonical Path:** `docs/target/PRD.md`
**See Also:** [`ARCHITECTURE.md`](ARCHITECTURE.md) · [`ROADMAP.md`](ROADMAP.md) · [`../current/IMPLEMENTATION_STATUS.md`](../current/IMPLEMENTATION_STATUS.md)

> This is the **target** product definition. For what ships today, see [`../current/`](../current/).

---

## 1. Objective & Vision

The goal is to build **Open-Agent**, a privacy-first, fully open-source, AI-native code editor. It must be built as a direct downstream fork of the open-source Visual Studio Code (`microsoft/vscode`) codebase. The product will mirror the structural core features of Cursor AI, Codex, and Claude Code while offering a modular AI engine that supports:

- **Bring Your Own Key (BYOK)** for cloud providers
- **Local LLMs** via [Ollama](https://ollama.com/), Llama.cpp, and [**LM Studio**](https://lmstudio.ai/docs/app)
- **Private remote-local models** via [**LM Link**](https://lmstudio.ai/link) (user-owned machines linked over an encrypted mesh)
- Local Hugging Face / Kaggle-compatible inferences

## 2. Target Users

- Developers needing strict privacy who cannot allow source code to leave their workstation.
- Teams in air-gapped or offline enterprise infrastructure environments.
- AI Engineers looking to swap out underlying coding models on the fly.
- Engineers who edit on a laptop but run large models on a more powerful home, office, or private cloud box via **LM Link**.

## 3. Core Features & Functional Requirements

### 3.1. Deep IDE Workspace Indexing & Semantic Search

- **Requirement:** Automatically chunk and index the active workspace using AST-aware parsers.
- **Local Vectors:** Embed a lightweight local vector database (e.g., LanceDB or embedded Vector storage) directly into the VS Code extension host or main node process.
- **Trigger Tags:** Provide explicit context injections using `@file`, `@folder`, `@git`, and `@codebase` references in chat windows.

### 3.2. Native Inline Code Generation & Prediction (Tab-Autocomplete)

- **Requirement:** Fast, multi-line code predictions that appear inline as ghost text as the user types.
- **Triggers:** Triggered natively via keystroke idle times or explicit keybindings (`Cmd + K` / `Ctrl + K`).
- **Interception:** Intercept standard suggestion providers to prioritize the custom AI inference pipeline.

### 3.3. Embedded AI Chat & Multi-File Composer Panel

- **Requirement:** A custom-built, native Activity Bar view (Secondary Sidebar) serving as an AI Chat window.
- **Composer Mode (`Cmd + I` / `Ctrl + I`):** An advanced edit interface allowing the AI to write, modify, or create files across multiple directories concurrently.
- **Native Diff Integration:** Use VS Code's native `TextDiffEditor` API to showcase proposed changes side-by-side. The user must be able to Accept or Reject changes per block.

### 3.4. Autonomous Agent Execution Loop

- **Requirement:** An agent layer capable of breaking down prompts into discrete multi-step tasks.
- **System Capabilities:** The agent must be authorized to call native tools:
  - Read/Write file buffers.
  - Run terminal commands via the integrated VS Code terminal instance.
  - Listen to active terminal logs to self-diagnose and patch build compilation failures.

### 3.5. Pluggable BYOK & Local AI Gateway

- **Requirement:** A robust abstraction layer decoupling the frontend editor UI from the backend LLM providers.
- **Supported Paradigms:**

#### Local and private-local stack

- **[LM Studio](https://lmstudio.ai/docs/app)** — Primary desktop local runtime. Open-Agent connects to LM Studio’s OpenAI-compatible local server (default documented base URL `http://127.0.0.1:1234/v1`) for chat, composer, inline, agent, and embeddings when the user serves those models.
- **[LM Link](https://lmstudio.ai/link)** — Supported path so Open-Agent can use models loaded on linked remote devices as if they were local. The user configures the Model Gateway base URL to the LM Link–reachable OpenAI-compatible endpoint. Open-Agent does **not** proxy prompts through MoniGarr-hosted inference; traffic stays on the user’s private mesh (LM Link / Tailscale-backed per LM Studio’s product design).
- **Additional local/compat options:** Ollama APIs, Llama.cpp servers, and Hugging Face Transformers / OpenAI-compatible pipeline endpoints.

#### Cloud / BYOK

- OpenAI, Anthropic Claude, DeepSeek, and standard OpenAI-compatible proxies (keys in SecretStorage).

#### Acceptance notes (target)

| Criterion | Expectation |
|-----------|-------------|
| LM Studio profile | Documented gateway profile + health check against the local OpenAI-compatible API |
| LM Link configuration | Documented guidance for pointing Open-Agent at an LM Link–reachable endpoint (base URL / profile); no second proprietary SDK required in v1 |
| Privacy | Inference egress only to user-chosen endpoints; LM Link is not MoniGarr multi-tenant model hosting |
| Operator docs | Runbook covers enabling LM Studio locally and using LM Link when the endpoint is reachable |

## 4. Non-Functional & Fork-Specific Requirements

- **Maintainability:** All custom code must be isolated to targeted custom sub-directories (`/src/vs/workbench/contrib/openagent/`) or localized modifications to avoid merge conflicts when pulling upstream VS Code releases.
- **Performance:** Autocomplete text streaming must execute under 150ms. Heavy processing (indexing, embedding generation) must stay restricted to background worker threads.
- **Telemetry:** Open-Agent performs no outbound telemetry by default. Local logging is used for diagnostics. Any outbound telemetry requires explicit user opt-in and is disabled in Open-Agent distributions. Upstream Code OSS telemetry infrastructure remains intact for mergeability; it is not deleted.
- **Local-first inference:** Prefer on-device LM Studio / Ollama / Llama.cpp; use LM Link only for user-owned remote hardware; never require a MoniGarr cloud model endpoint for core coding features.
