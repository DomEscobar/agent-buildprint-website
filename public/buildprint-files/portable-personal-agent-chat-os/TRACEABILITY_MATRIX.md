# TRACEABILITY_MATRIX

| Buildprint requirement | Source evidence | Portable interpretation |
|---|---|---|
| Streaming agent loop | `agent/runner.py`, `agent/webui.py` | Evented runtime with stream deltas, tool calls, checkpoints |
| Provider router | `agent/providers/base.py`, `registry.py`, `openai_compat.py`, `anthropic_provider.py`, `bedrock_provider.py` | Config-driven provider registry with normalized usage |
| Tool system | `agent/tools/schema.py`, `registry.py`, `dispatch.py`, filesystem/shell/search/todo tools | ToolSpec registry with schema and risk policy |
| Skills | `agent/skills.py`, `skills/*/SKILL.md`, `agent/tools/skills.py` | SkillSpec registry and selective instruction injection |
| MCP | `agent/mcp/client.py`, `config.py`, `connection.py`, `adapter.py` | MCP adapter imports external tools into ToolSpec boundary |
| Memory | `agent/memory.py`, `agent/compactor.py`, attachment store | Raw history, daily episode, long-term memory, checkpoints, compaction |
| Subagents/team | `agent/subagents/*`, `agent/team/*` | TeamTask event bus and bounded delegation |
| Token telemetry | `agent/telemetry.py`, `webui/src/composables/useTokens.ts`, `TokensView.vue` | Normalized usage counters visible in UI/tests |
| Workbench UI | `webui/src/views/*.vue` | Chat/model/tools/skills/MCP/memory/team/tokens/config views |
| Safety controls | `agent/control/*`, shell/filesystem tests | Policy gate for risky tools and bounded roots |
