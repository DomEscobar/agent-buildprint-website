# LangGraph-Inspired Durable Runtime Proof

## Status

PASS for scoped reversal proof.

This proof maps `langchain-ai/langgraph` at commit `076e2a3627206f5a1aef573aaca4a01e5af897ca` into a clean-room Buildprint called **Portable Durable Agent Graph Runtime**.

Claim boundary:

`workflow-proof + contract-parity + mocked-runtime-proof`

Do not describe this as a LangGraph clone, drop-in replacement, API-compatible runtime, or full parity implementation.

## What was proven

- Evidence-backed source trace with 166 checked source references and 0 missing/bad ranges.
- Buildprint package for a portable durable graph runtime.
- Clean-room TypeScript proof implemented from Buildprint docs only.
- Runtime proof covers builder, nodes, directed/conditional edges, reducers, compile validation, invoke/stream, checkpoint restore, interrupt/resume, Send fanout, async surfaces, pending-write recovery simulation, and serializer safety.
- Final command: `npm test`.
- Final result: 12/12 tests passing.

## Source commit

`076e2a3627206f5a1aef573aaca4a01e5af897ca`

## Commands

```bash
cd /root/.openclaw/workspace/research/langgraph-cleanroom-ts-proof-2026-05-16
npm test
```

`npm test` runs:

```bash
tsc -p tsconfig.json
node --test
```

## What is out of scope

- Full LangGraph clone parity.
- Full Python API parity.
- LangGraph.js parity.
- LangSmith/cloud/deployment parity.
- Provider/model/tool ecosystem parity.
- Production storage adapters.
- Pregel concurrency/performance parity.
- Exact event ordering parity.
- Exact serializer/checkpoint byte compatibility.
- Exact interrupt namespace/id hashing.
- Complete ToolNode/ReAct/ValidationNode behavior.

## Key artifacts

- `SOURCE_TRACE.md` — source evidence and mapping claims.
- `CRITICAL_REVIEW.md` — critical review of the serious map output.
- `buildprint-submission/` — Buildprint package.
- `cleanroom-ts-proof/REVERSAL_REPORT.md` — clean-room reversal report.
- `cleanroom-ts-proof/QA_REPORT.md` — QA/test report.
- `cleanroom-ts-proof/src/runtime.ts` — proof runtime.
- `cleanroom-ts-proof/tests/runtime.test.js` — proof tests.
