# SECURITY_POLICY

## Defaults

- No network in tests.
- No shell execution unless explicitly enabled.
- Filesystem tools are rooted to a workspace directory.
- Writes require policy approval.
- Secrets are stored as env var names or secret handles only.
- MCP servers are disabled until configured.

## Dangerous requests

If the model requests a dangerous tool without approval, emit `tool.denied` with reason and continue safely when possible.

## Audit log

Every tool request, denial, execution, MCP call, and subagent delegation is logged as a runtime event.
