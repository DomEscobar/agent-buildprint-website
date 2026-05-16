# Selection

Selected candidate: Portable Durable Agent Graph Runtime.

Selected fidelity: Clean-room durable subset with source-traced behavioral contracts.

## Claims

- OBSERVED(libs/langgraph/langgraph/graph/state.py:130-144): State graph nodes read shared state and return partial state updates.
- OBSERVED(libs/langgraph/langgraph/graph/state.py:1164-1219): Compiled graph is executable and checkpointer-backed runs require `thread_id`.
- OBSERVED(libs/langgraph/langgraph/pregel/main.py:448-521): Runtime uses actor/channel step execution with plan, execute, update phases.
- OBSERVED(libs/checkpoint/langgraph/checkpoint/base/__init__.py:139-147): Checkpoint tuple includes config, checkpoint, metadata, parent config, and pending writes.
- OBSERVED(libs/langgraph/langgraph/types.py:801-924): Interrupts require a checkpointer and resume through `Command`.
- INFERRED: A minimal portable runtime can reproduce these architectural concepts without copying LangGraph implementation or claiming parity.

## Explicit Non-Claims

- OUT_OF_SCOPE: Full LangGraph clone parity.
- OUT_OF_SCOPE: Full Python API parity.
- OUT_OF_SCOPE: LangGraph.js parity.
- OUT_OF_SCOPE: LangSmith/cloud/deployment parity.
- OUT_OF_SCOPE: Provider/model/tool ecosystem parity.
- OUT_OF_SCOPE: Production storage adapter parity.
- OUT_OF_SCOPE: Pregel performance/concurrency parity.
- OUT_OF_SCOPE: Complete ReAct agent, ToolNode, ValidationNode, or model provider behavior.
