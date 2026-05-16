# Buildprint Submission

Buildprint: Portable Durable Agent Graph Runtime.

This submission specifies a clean-room implementation target, not a LangGraph clone. The source trace in `../SOURCE_TRACE.md` provides evidence for the architectural ideas. Implementation must use original code and tests written from this specification.

Core deliverables:
- Typed state schema and reducer metadata.
- Builder with nodes, directed edges, conditional routing, and compile validation.
- Compiled runtime with `invoke` and `stream`.
- In-memory checkpoint saver with thread/checkpoint identity.
- Interrupt/resume via `Command`.
- Pending-write recovery simulation.
- Serializer safety gate.
- Optional mocked ToolNode/ReAct demo marked non-core.

Hard non-goals are recorded in `PARITY_CLAIMS.md`.
