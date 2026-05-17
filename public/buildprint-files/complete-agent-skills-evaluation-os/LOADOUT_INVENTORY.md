# LOADOUT_INVENTORY

Evaluate what the agent carries into context.

## Metrics

- Total enabled skills, commands, agents, hooks, MCP servers.
- Estimated loaded token tax per turn.
- Active invocation count per artifact.
- Dormant artifacts: no invocation in 90+ days or no recorded use.
- Duplicates: multiple skills covering same trigger/intention.
- High-cost low-use items.
- Router misses: installed artifacts that never activate in activation evals.

## Tool mapping

`robester0403/Local-Loadout-Smithery` is the strongest fresh source for this layer: it frames loadout cost as both loaded cost and active usage, which is essential for evaluating complete setups.
