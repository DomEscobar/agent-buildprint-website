# QA Report: LangGraph-Inspired Clean-Room TS Proof

## Verdict

PASS as a clean-room reversal proof for the scoped Buildprint subset.

This is not a LangGraph clone and does not claim API/runtime/cloud/provider/storage/performance parity.

## Source of Truth

Built from Buildprint docs copied into `docs/buildprint-submission/` from:

`/root/.openclaw/workspace/research/langgraph-mapper-os-2026-05-16/output-serious/buildprint-submission/`

The implementation intentionally does not import or copy LangGraph source.

## Commands Run

```bash
cd /root/.openclaw/workspace/research/langgraph-cleanroom-ts-proof-2026-05-16
npm test
```

Result:

- tests: 12
- pass: 12
- fail: 0

## Test Coverage

- Simple `START -> A -> B -> END` graph.
- Conditional route based on state after node update.
- Reducer merge for same-step writes.
- Compile failure for missing entrypoint, duplicate node, unknown target.
- Checkpoint latest restore and explicit checkpoint_id restore.
- Interrupt then resume with `Command(resume=...)`.
- Failed superstep keeps successful pending writes.
- Stream event local shapes for `values`, `updates`, `checkpoints`, `tasks`, and `debug`.
- Strict serializer rejects unknown tagged values.
- `Send` fanout routes custom args into target nodes.
- Async `ainvoke` / `astream` mirror the sync proof surface.
- Pending writes replay into state and resume only the failed node in the recovery simulation.

## Known Simplifications

- TypeScript source is emitted through `tsc`; public declarations are hand-authored for the scoped proof surface.
- Single-process deterministic execution.
- In-memory checkpointer only.
- Local stream event shapes; no real LLM/provider `messages` streaming.
- Minimal interrupt semantics; no exact LangGraph interrupt namespace/id hashing.
- Minimal version tracking; enough for checkpoint snapshots but not full Pregel scheduling parity.
- `Send` exists as a control object but fanout parity is not claimed.

## Out of Scope

- Full LangGraph clone parity.
- Full Python API parity.
- LangGraph.js parity.
- LangSmith/cloud/deployment parity.
- Provider/model/tool ecosystem parity.
- Production storage adapters.
- Pregel concurrency/performance parity.
- Exact event ordering parity.
- Exact serializer/checkpoint byte compatibility.
