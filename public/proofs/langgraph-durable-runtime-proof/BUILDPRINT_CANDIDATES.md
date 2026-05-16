# Buildprint Candidates

## Candidate 1: Portable Durable Agent Graph Runtime (Selected)

Selection: SELECTED.

Fidelity: Serious clean-room subset.

Rationale:
- OBSERVED(libs/langgraph/langgraph/graph/state.py:130-144): LangGraph's state graph builder has a clear, teachable core: shared typed state, partial node updates, reducers, compile before execute.
- OBSERVED(libs/langgraph/langgraph/pregel/main.py:448-521): the runtime model is explainable as actor/channel supersteps.
- OBSERVED(libs/checkpoint/langgraph/checkpoint/base/__init__.py:176-209): checkpointing is a clear persistence contract, with in-memory implementation evidence.
- OBSERVED(libs/langgraph/langgraph/types.py:748-924): interrupt/resume/command primitives make the runtime agentic and durable.

Buildprint deliverable:
- Typed state schema.
- Node registry.
- Directed and conditional edges.
- Compile validation.
- Invoke and stream execution.
- In-memory checkpoint saver.
- Thread/checkpoint identity.
- Interrupt/resume command surface.
- Pending-write recovery simulation.
- Serializer safety gate.
- Optional tiny mocked ToolNode/ReAct demo marked non-core.

Non-claims:
- OUT_OF_SCOPE: Full LangGraph clone parity.
- OUT_OF_SCOPE: Full Python API parity.
- OUT_OF_SCOPE: LangGraph.js parity.
- OUT_OF_SCOPE: LangSmith/cloud/deployment parity.
- OUT_OF_SCOPE: Provider/model/tool ecosystem parity.
- OUT_OF_SCOPE: Production storage adapter parity.
- OUT_OF_SCOPE: Pregel performance/concurrency parity.

## Candidate 2: StateGraph Builder Only

Status: Not selected.

This would extract only the builder/compile validation surface. It is easier, but it misses the durable execution behavior that makes the selected candidate useful. It would not cover checkpoint tuples, pending writes, or interrupt/resume.

## Candidate 3: Checkpoint Saver Contract Only

Status: Not selected.

This would focus on `BaseCheckpointSaver`, `InMemorySaver`, serializer gates, and checkpoint tuple shapes. It is valuable but too narrow: it would not show how checkpointing supports graph runtime execution, stream events, or interrupts.

## Candidate 4: Streaming/Event Protocol Only

Status: Not selected.

This would extract stream modes and typed event payloads. It is useful as a secondary component, but not enough for a complete portable runtime Buildprint.

## Candidate 5: Prebuilt Tool/ReAct Mini-Agent

Status: Not selected.

OBSERVED(libs/prebuilt/langgraph/prebuilt/chat_agent_executor.py:274-318): `create_react_agent` exists but is deprecated and provider/tool heavy. OBSERVED(libs/prebuilt/langgraph/prebuilt/tool_node.py:622-700): `ToolNode` is a rich prebuilt utility. These are adjacency only; implementing them would risk provider ecosystem claims outside the requested scope.
