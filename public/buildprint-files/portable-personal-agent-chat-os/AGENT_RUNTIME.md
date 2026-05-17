# AGENT_RUNTIME

The runtime is an evented loop, not a single LLM call wrapper.

## Turn lifecycle

1. `turn.started`
2. save checkpoint
3. select skills
4. build context
5. provider stream starts
6. emit `model.delta` events
7. model requests tools or delegation
8. validate and policy-check each request
9. execute safe tools / fake MCP tools / subagents
10. feed results back into the context
11. emit usage telemetry
12. append final answer to memory
13. clear checkpoint
14. `turn.completed`

## Interruptibility

The implementation should support cancellation at provider stream, tool execution, and subagent task boundaries. Cancellation should persist partial trace and leave a checkpoint the UI can inspect.

## Error model

Errors are events. Do not crash the whole runtime for a failed tool. Tool failure becomes a tool result or `turn.failed` depending on phase.
