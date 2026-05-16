# Reversal Report: Portable Durable Agent Graph Runtime

## Goal

Validate whether the evidence-backed Buildprint draft is sufficient for a clean-room implementer to recreate a useful portable runtime without copying LangGraph source.

## Result

SUCCESS for the scoped subset.

A small TypeScript runtime was implemented at:

`/root/.openclaw/workspace/research/langgraph-cleanroom-ts-proof-2026-05-16/src/runtime.ts`

Build output and public declarations are emitted under:

`/root/.openclaw/workspace/research/langgraph-cleanroom-ts-proof-2026-05-16/dist/`

Tests are at:

`/root/.openclaw/workspace/research/langgraph-cleanroom-ts-proof-2026-05-16/tests/runtime.test.js`

The implementation passes the required Buildprint test matrix subset.

## Clean-Room Boundary

Inputs used:

- Buildprint package copied to `docs/buildprint-submission/`.
- Public architectural concepts summarized in the Buildprint.

Not used:

- No imports from LangGraph.
- No vendored LangGraph source.
- No checkpoint byte compatibility work.
- No provider/tool/cloud adapters.

## Implemented Runtime Surface

- `GraphBuilder`
- `StateSchema`
- `CompiledGraph.invoke`
- `CompiledGraph.stream`
- `CompiledGraph.get_state`
- directed edges
- conditional edges
- compile validation
- reducers
- `Command`
- `Send` fanout with custom target args
- `interrupt(value)`
- `InMemoryCheckpointSaver`
- `SafeSerializer`
- async `ainvoke` / `astream` proof surface
- pending-write recovery that replays successful writes and resumes the failed node

## Proof Commands

```bash
cd /root/.openclaw/workspace/research/langgraph-cleanroom-ts-proof-2026-05-16
npm test
```

Observed result after v2 hardening: 12/12 tests passing.

## What This Proves

The Buildprint is actionable: a coding agent/developer can reconstruct a portable durable graph runtime with state updates, reducers, checkpoints, interrupts, and streamable events from the Buildprint alone.

## What This Does Not Prove

- Does not prove LangGraph behavioral parity.
- Does not prove LangGraph API compatibility.
- Does not prove production durability.
- Does not prove Pregel concurrency/performance.
- Does not prove LangSmith/cloud/tool/provider behavior.
- Does not prove exact streaming payload compatibility.

## Recommendation

The LangGraph mapping can now be upgraded from “serious mapping draft” to “scoped reversal proof passed” if public copy keeps the proof boundary explicit:

`workflow-proof + contract-parity + mocked-runtime-proof`

Do not call it a clone, drop-in replacement, or full parity implementation.
