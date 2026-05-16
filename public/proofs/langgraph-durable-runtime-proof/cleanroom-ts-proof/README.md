# LangGraph-Inspired Clean-Room TS Proof

A clean-room TypeScript/JavaScript proof built from the Buildprint package at:

`/root/.openclaw/workspace/research/langgraph-mapper-os-2026-05-16/output-serious/buildprint-submission/`

This is not a LangGraph clone. It proves a small portable durable graph runtime subset:

- typed-ish state schema with reducers
- builder nodes/edges/conditional routes
- compile-time validation
- deterministic single-process supersteps
- invoke/stream surfaces
- in-memory checkpoints by `thread_id` / `checkpoint_id`
- pending-write replay simulation
- interrupt/resume
- strict serializer allowlist gate

Out of scope: Python API parity, LangGraph.js parity, LangSmith/cloud, providers/tools, production storage adapters, Pregel concurrency/performance, exact event ordering parity, exact checkpoint byte compatibility.
