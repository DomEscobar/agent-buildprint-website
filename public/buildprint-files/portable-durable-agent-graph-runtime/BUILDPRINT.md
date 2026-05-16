# BUILDPRINT: Portable Durable Agent Graph Runtime

## Intent

Build a small, dependency-light runtime for durable agent workflows. The runtime lets users define a typed state, register nodes that return partial state updates, connect nodes with directed and conditional edges, compile the graph, invoke it, stream execution events, checkpoint state by thread, interrupt for human input, and resume.

## Evidence Anchors

- OBSERVED(libs/langgraph/langgraph/graph/state.py:130-144): builder, shared state, partial updates, reducers, compile-before-run.
- OBSERVED(libs/langgraph/langgraph/pregel/main.py:448-521): actor/channel superstep execution.
- OBSERVED(libs/checkpoint/langgraph/checkpoint/base/__init__.py:92-147): checkpoint and checkpoint tuple shapes.
- OBSERVED(libs/langgraph/langgraph/types.py:120-134): stream modes.
- OBSERVED(libs/langgraph/langgraph/types.py:748-924): `Command`, `Send`, and `interrupt`.

## Clean-Room Architecture

Components:
- `StateSchema`: declares state keys, value validators, and optional reducers.
- `GraphBuilder`: mutable definition object with nodes, edges, conditional routes, and compile validation.
- `CompiledGraph`: immutable runtime plan with `invoke`, `stream`, `get_state`, and `update_state`.
- `Channel`: per-key state container with `apply(updates)` and `snapshot()`.
- `CheckpointSaver`: persistence interface.
- `InMemoryCheckpointSaver`: test/debug implementation.
- `Command`: control object for state update, resume, and goto.
- `Send`: optional fanout object for routing custom input to a node.
- `Interrupt`: resumable pause payload.
- `Serializer`: safe JSON-like serialization with explicit allowlist for non-primitive tagged values.

## Execution Model

INFERRED clean-room superstep loop:
1. Load latest checkpoint for `thread_id` or create initial checkpoint.
2. Map input or `Command` to pending writes.
3. Plan next runnable nodes from entrypoint, updated channels, or command goto.
4. Execute planned nodes in deterministic order.
5. When a checkpointer exists and durability permits, persist each successful task's pending writes before applying the full superstep.
6. If a task fails, keep successful pending writes in the checkpoint path and stop with error.
7. Apply writes through channel reducers.
8. Advance channel versions and versions-seen.
9. Store checkpoint.
10. Emit stream events.
11. Stop at `END`, no runnable nodes, interrupt, or error.

## Minimal Public API

```text
GraphBuilder(schema)
  .add_node(name, fn)
  .add_edge(start, end)
  .add_conditional_edges(source, route_fn, path_map=None)
  .set_entry_point(name)
  .set_finish_point(name)
  .compile(checkpointer=None)

CompiledGraph
  .invoke(input, config=None, stream_mode="values")
  .stream(input, config=None, stream_mode="values")
  .get_state(config)

Command(update=None, resume=None, goto=None)
Send(node, arg)
interrupt(value)
InMemoryCheckpointSaver()
```

## Fidelity Boundary

This Buildprint targets architectural behavior, not API parity. Names may be similar only where they are public concepts needed to describe the contract.

Important simplifications: deterministic single-process execution, in-memory checkpointing, explicit reducer ordering chosen by the implementer, and local-only/mock stream events for provider-adjacent modes. These are clean-room choices, not claims about exact LangGraph behavior.
