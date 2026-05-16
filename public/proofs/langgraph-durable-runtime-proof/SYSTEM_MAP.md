# System Map: Portable Durable Agent Graph Runtime

## Selected Scope

Candidate selected: Portable Durable Agent Graph Runtime.

This is a clean-room Buildprint for a small, portable runtime inspired by observed LangGraph architecture. It is not a clone and must not claim API, provider, storage, cloud, or performance parity.

## Core Shape

1. Builder layer
   - OBSERVED(libs/langgraph/langgraph/graph/state.py:130-144): `StateGraph` is a builder whose nodes read shared state and return partial state.
   - OBSERVED(libs/langgraph/langgraph/graph/state.py:251-269): builder owns nodes, edges, branches, schemas, channels, managed values, compile flag.
   - INFERRED: Clean-room runtime can expose a smaller `GraphBuilder<State>` with typed state schema, node registry, directed edges, conditional routes, and compile validation.

2. Compile layer
   - OBSERVED(libs/langgraph/langgraph/graph/state.py:1164-1219): compile returns executable `CompiledStateGraph`; checkpointer enables pause/resume/replay and requires `thread_id`.
   - OBSERVED(libs/langgraph/langgraph/graph/state.py:1333-1388): compile builds channels, runtime metadata, attached nodes/edges/branches, then validates.
   - INFERRED: Clean-room compile should freeze the builder into a runtime plan and fail before execution for missing entrypoint, unknown nodes, duplicate node names, and invalid branches.

3. Runtime layer
   - OBSERVED(libs/langgraph/langgraph/pregel/main.py:448-521): execution is actor/channel oriented and step-based: plan, execute, update.
   - OBSERVED(libs/langgraph/langgraph/pregel/_runner.py:135-138): runner executes tasks, commits writes, yields output, and interrupts on conditions.
   - INFERRED: Clean-room runtime should implement deterministic single-process supersteps. Concurrent execution and Pregel performance are OUT_OF_SCOPE.

4. State layer
   - OBSERVED(libs/langgraph/langgraph/channels/base.py:19-99): channels define value, update, checkpoint, and update semantics.
   - OBSERVED(libs/langgraph/langgraph/channels/last_value.py:20-67): default channel stores one update per step and rejects concurrent writes.
   - OBSERVED(libs/langgraph/langgraph/channels/binop.py:51-109): reducer channel applies a binary operator over updates.
   - INFERRED: Clean-room state can support `LastValue` and reducer channels only.

5. Durability layer
   - OBSERVED(libs/checkpoint/langgraph/checkpoint/base/__init__.py:92-147): checkpoint and checkpoint tuple include channel values, versions, versions seen, metadata, parent config, and pending writes.
   - OBSERVED(libs/checkpoint/langgraph/checkpoint/memory/__init__.py:33-48): in-memory saver is for debugging/testing; production adapters are separate.
   - INFERRED: Buildprint should implement only an in-memory saver and pending-write recovery simulation.

6. Control layer
   - OBSERVED(libs/langgraph/langgraph/types.py:748-798): `Command` carries update, resume, and goto.
   - OBSERVED(libs/langgraph/langgraph/types.py:801-924): `interrupt()` pauses, requires checkpointer, resumes with `Command`, and re-executes node logic.
   - INFERRED: Clean-room runtime should support interrupt/resume in a minimal deterministic way.

7. Streaming layer
   - OBSERVED(libs/langgraph/langgraph/types.py:120-134): stream modes are values, updates, custom, messages, checkpoints, tasks, debug.
   - OBSERVED(libs/langgraph/langgraph/pregel/main.py:2644-2695): stream yields step outputs shaped by stream mode.
   - INFERRED: Buildprint should include event records for values, updates, checkpoints, tasks, debug, and custom; messages may be a placeholder event type without LLM integration.

## Primary Data Flow

1. User defines a typed state schema and optional reducer per key.
2. User registers named nodes.
3. User adds edges and conditional routes from `START` through nodes to `END`.
4. Compile validates the graph and creates a compiled runtime plan.
5. Invoke/stream starts or resumes a thread using `thread_id`.
6. Each superstep plans runnable nodes from updated channels or routes.
7. Nodes return partial updates or `Command`.
8. Runtime persists pending writes, applies channel updates, records checkpoint, emits stream events.
9. Interrupt stores interrupt metadata and exits; resume passes `Command(resume=...)` and re-enters from saved state.

## Explicit Non-Claims

- OUT_OF_SCOPE: Full LangGraph clone parity.
- OUT_OF_SCOPE: Full Python API parity.
- OUT_OF_SCOPE: LangGraph.js parity.
- OUT_OF_SCOPE: LangSmith/cloud/deployment parity.
- OUT_OF_SCOPE: Provider/model/tool ecosystem parity.
- OUT_OF_SCOPE: Production storage adapter parity.
- OUT_OF_SCOPE: Pregel performance/concurrency parity.

## Open Design Questions

- QUESTION: Should typed state be enforced at runtime by a schema library, static types only, or simple key/type validators?
- QUESTION: Should conditional routes return only node names, or support `Send` fanout in v1?
- QUESTION: Should reducer ordering be deterministic by node name, registration order, or task id?
- QUESTION: What is the minimum safe serializer format for the target language/runtime?
