# PARITY CLAIMS

## Allowed Claims

- OBSERVED: LangGraph exposes a `StateGraph` builder with typed state, nodes, edges, conditional edges, and compile.
- OBSERVED: LangGraph compiles Graph API definitions to a Pregel-backed executable runtime.
- OBSERVED: LangGraph has stream modes including values, updates, custom, messages, checkpoints, tasks, and debug.
- OBSERVED: LangGraph checkpointing uses checkpoint tuples, thread/checkpoint config, pending writes, and serializer controls.
- INFERRED: A small clean-room runtime can implement a portable subset of those ideas.

## Prohibited Claims

- OUT_OF_SCOPE: Full LangGraph clone parity.
- OUT_OF_SCOPE: Full Python API parity.
- OUT_OF_SCOPE: LangGraph.js parity.
- OUT_OF_SCOPE: LangSmith/cloud/deployment parity.
- OUT_OF_SCOPE: Provider/model/tool ecosystem parity.
- OUT_OF_SCOPE: Production storage adapter parity.
- OUT_OF_SCOPE: Pregel performance/concurrency parity.
- OUT_OF_SCOPE: Exact event ordering parity beyond this Buildprint's documented deterministic order.
- OUT_OF_SCOPE: Exact serializer compatibility with LangGraph checkpoint bytes.
- OUT_OF_SCOPE: Exact interrupt namespace/id hashing behavior.
- OUT_OF_SCOPE: Complete `ToolNode`, `ValidationNode`, or `create_react_agent` behavior.
