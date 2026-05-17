# PLAN

## Phase 0 — Scope and safety

- Choose fidelity target: default `workflow-proof + contract-parity + mocked-runtime-proof`.
- Choose stack and UI framework.
- Decide enabled channels: WebUI first; CLI/Telegram/Discord optional.
- Define allowed tool risk policy and filesystem root.

## Phase 1 — Contracts and storage

- Implement core types from `CONTRACTS.md`.
- Implement in-memory stores first, then optional SQLite/Postgres adapters.
- Add trace/event log and token usage model.

## Phase 2 — Provider router and streaming loop

- Add provider registry with fake provider for tests.
- Implement streaming turn lifecycle and checkpoint persistence.
- Add context builder and compaction threshold behavior.

## Phase 3 — Tools, skills, MCP

- Implement tool registry and policy checks.
- Add fake filesystem/search/todo tools.
- Implement skill discovery/matching.
- Implement MCP adapter using fake MCP tool fixtures.

## Phase 4 — Memory and subagents

- Add raw history, daily episode, long-term memory, and checkpoint stores.
- Add compactor adapter with deterministic test compactor.
- Add team task/subagent event bus and result summarization.

## Phase 5 — WebUI/API

- Expose bootstrap state.
- Render chat stream and traces.
- Add model/tools/skills/MCP/memory/team/tokens/config workbench views.
- Add accessible error states and no-credential local mode.

## Phase 6 — QA

- Run unit/contract tests.
- Run mocked end-to-end chat turn.
- Run browser/runtime click path if UI is built.
- Record remaining parity gaps in `PARITY_CLAIMS.md` or a validation report.
