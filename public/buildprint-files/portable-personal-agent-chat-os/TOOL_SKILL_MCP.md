# TOOL_SKILL_MCP

## Tool registry

Tools are first-class objects with schema, risk, and handler. The model never executes arbitrary text; it can only request registered tools.

Risk levels:

- `safe`: pure deterministic helpers.
- `read`: reads bounded local state.
- `write`: writes bounded local state.
- `network`: external HTTP/API.
- `shell`: process execution.

Default policy: allow `safe/read`; require approval or explicit config for `write/network/shell`.

## Skill registry

A skill is a folder or record with instructions and optional scripts/resources. Skill injection should be narrow: load the selected skill, not every skill.

Selection order:

1. explicit user/tool selection
2. trigger keyword match
3. task classifier
4. no skill

## MCP adapter

MCP tools are imported into the same `ToolSpec` registry with namespaced ids such as `mcp.github.search_issues`.

Rules:

- deny unknown MCP server ids
- deny disabled tools
- enforce timeout
- record `mcp.tool_mapped` and `tool.result` events
- fake MCP implementation for tests
