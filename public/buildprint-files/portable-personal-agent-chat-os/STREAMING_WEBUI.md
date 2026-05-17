# STREAMING_WEBUI

## Views

- Chat: streaming deltas, tool traces, errors, retry/cancel.
- Model: provider/model config and diagnostics.
- Tools: registered tools, risk labels, allow policy.
- Skills: skill list, details, triggers, enabled/disabled state.
- MCP: server configs, discovered tools, health/timeout state.
- Memory: long-term memory, today episode, raw history/checkpoint viewer.
- Team: delegated tasks, statuses, result summaries.
- Tokens: per-turn and aggregate usage.
- Configs: safe config editor / diagnostics.

## Event transport

Use WebSocket, SSE, or equivalent event stream. The contract is `RuntimeEvent[]`; UI transport is replaceable.

## Browser QA path

Bootstrap → select fake provider → send message → observe deltas → tool trace → final answer → token count changes → memory/history updated.
