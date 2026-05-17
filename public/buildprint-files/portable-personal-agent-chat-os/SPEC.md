# SPEC

## Users

- A solo operator who wants a self-hosted AI assistant with persistent memory, tools, and a WebUI.
- A developer using the assistant as a local workbench for provider testing, skills, MCP tools, and subagents.
- A coding agent implementing this Buildprint in Node, Python, Go, Rails, Laravel, or another stack.

## Core objects

- `AgentSession`: one conversation/run with messages, checkpoints, active model, trace events, and usage.
- `ProviderConfig`: provider kind, model id, context window, generation defaults, capabilities.
- `ToolSpec`: name, description, JSON-like input schema, risk level, handler reference.
- `SkillSpec`: name, triggers, instructions path/body, optional scripts/resources, enabled flag.
- `McpServerSpec`: server id, transport, allowed tools, timeout, auth reference, enabled flag.
- `MemoryState`: raw history, daily episode, curated long-term memory, checkpoints, attachments index.
- `TeamTask`: delegated task with role, input, status, events, result, usage.
- `RuntimeEvent`: streamed event for deltas, tool calls, tool results, skill loads, delegation, errors, and telemetry.

## Required flows

### 1. Bootstrap

- Load config.
- Load provider registry.
- Load tools and skills.
- Load MCP server configs but do not connect until needed.
- Load memory state and checkpoint if present.
- Return a bootstrap payload to UI with model/tools/skills/MCP/memory/token state.

### 2. Chat turn

- Accept user message.
- Append to history.
- Build context from system prompt, long-term memory, recent history, attachments, and relevant skills.
- Route to selected provider.
- Stream assistant deltas.
- Detect structured tool calls or tool-call requests.
- Policy-check each tool.
- Execute allowed tools, or return safe denial event.
- Feed tool results back to the agent loop.
- Persist final answer, trace, and telemetry.

### 3. Memory compaction

- Track input/output/cache tokens per provider call.
- When usage crosses configured threshold, summarize older history into an episode.
- Update curated long-term memory only through explicit compactor output or human edit.
- Preserve recent messages and checkpoints.

### 4. Skills

- Discover skill folders/files.
- Parse `SKILL.md` front matter or first section.
- Match skills by trigger, explicit selection, or task classification.
- Inject only selected skill instructions/resources into context.
- Treat scripts as tools subject to the same policy as other execution tools.

### 5. MCP

- Represent MCP tools as `ToolSpec` instances through an adapter.
- Allow per-server and per-tool enable/disable.
- Enforce timeouts and deny unknown tools.
- In tests, use fake MCP servers and deterministic tool responses.

### 6. Subagents/team

- Spawn/delegate only through a `TeamTask` contract.
- Emit events for `created`, `started`, `message`, `completed`, `failed`.
- Store team task results in history only after summarization or explicit inclusion.

### 7. WebUI/API

Required UI areas:

- Chat stream
- Model/provider settings
- Tool list and risk labels
- Skills list
- MCP server/tools list
- Memory editor/viewer
- Team/subagents view
- Token/usage view
- Config diagnostics

## Safety requirements

- No tool may execute from raw model text without schema validation.
- Shell/filesystem/network/browser tools require explicit allow policy and bounded roots/timeouts.
- Secrets are referenced by env var name or secret handle, never stored in Buildprint files.
- Test mode must be no-network by default.
