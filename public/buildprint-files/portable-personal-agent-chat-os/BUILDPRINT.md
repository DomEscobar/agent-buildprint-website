# BUILDPRINT — Portable Personal Agent Chat OS

## Goal

Build a self-hosted personal agent chatbot that feels like a small operating system: chat is the control surface, but the real product is a runtime that routes models, streams responses, invokes tools, loads skills, remembers context, delegates to subagents, records telemetry, and exposes a WebUI/API boundary.

## Source mapping basis

Primary source: `TheSyart/emperor-agent` at shallow clone commit `d9761740bf82b9d5a91e5d8cda44ab5643bab59d`.

Observed architecture signals:

- `agent/runner.py` — main streaming model/tool loop, checkpoints, token tracking, compaction trigger.
- `agent/webui.py` — aiohttp WebSocket/HTTP WebUI boundary, bootstrap state, memory/tokens/model/config routes.
- `agent/providers/*` — provider base, registry, OpenAI-compatible, Anthropic, Bedrock implementations.
- `agent/tools/*` — tool schema, registry, dispatch, filesystem, shell, web/search/todo/skills tools.
- `agent/mcp/*` — MCP config/client/connection/adapter layer.
- `agent/memory.py` and `agent/compactor.py` — long-term memory, history, daily episodes, checkpoint, compaction.
- `agent/subagents/*` and `agent/team/*` — subagent specs, team bus/events/store/tools.
- `agent/telemetry.py` and `webui/src/views/TokensView.vue` — token/usage telemetry surfaced in UI.
- `webui/src/views/*.vue` — chat/model/tools/skills/MCP/memory/team/tokens/config workbench tabs.

Comparative references from the scan:

- `hyhmrright/JARVIS` pushes product OS breadth: auth, workflows, RAG, observability, Postgres/Qdrant/Redis.
- `NiuTrans/ToFu` pushes assistant OS breadth: MCP, memory, scheduler, browser, tool use, DB layer, multi-agent/swarm.

This Buildprint stays intentionally smaller than those: personal-agent OS first; multi-tenant SaaS/workflow-builder/RAG platform only as optional extensions.

## Architecture

```text
WebUI / CLI / Channel
  -> Session Controller
  -> Context Builder + Memory Store
  -> Provider Router
  -> Streaming Agent Loop
      -> Tool Dispatcher
      -> Skill Registry
      -> MCP Adapter
      -> Subagent Team Bus
  -> Event Stream + Telemetry
  -> History / Episodes / Long-term Memory
```

## Non-negotiables

1. Chat output is streamed as events, not returned only as a final string.
2. Provider selection is config-driven and testable without live API calls.
3. Tools are described by schemas and mediated by policy before execution.
4. Shell/filesystem/network tools are deny-by-default or approval-gated.
5. Skills are discoverable units with metadata, instructions, and optional helper scripts.
6. Memory is split into raw history, daily/episodic notes, and curated long-term memory.
7. Long-context pressure triggers compaction/checkpoint behavior, not silent truncation.
8. MCP is an adapter boundary; local tests use fake MCP servers/tools.
9. Subagents/team delegation is evented and traceable.
10. Token telemetry is visible in runtime state and test assertions.

## Default fidelity target

`workflow-proof + contract-parity + mocked-runtime-proof`.

Do not claim full Emperor Agent clone, UI/art parity, provider parity, shell parity, real MCP parity, or hosted product parity unless those are separately implemented and tested.
