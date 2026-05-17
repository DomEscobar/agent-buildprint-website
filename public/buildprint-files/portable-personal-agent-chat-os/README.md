# Portable Personal Agent Chat OS

Clean-room Buildprint for a self-hosted personal agent chatbot inspired by the mapped architecture of [`TheSyart/emperor-agent`](https://github.com/TheSyart/emperor-agent), with comparison pressure from JARVIS and ToFu so the result is not a narrow chat clone.

## Scope

Build a portable personal agent OS with:

- streaming chat UI/runtime boundary
- multi-provider LLM routing
- tool registry and dispatch
- skill registry
- MCP-style external tool adapter
- three-tier memory and context compaction
- subagent/team delegation
- token telemetry
- safety gates for filesystem/shell/network tools
- head-to-foot QA and explicit non-parity claims

## Clean-room boundary

This package is a mapped-project Buildprint, not a source copy. It captures portable architecture and contracts. Do not copy Emperor Agent implementation files, art assets, prompts, or UI styling. Use the contracts and proof here to rebuild the architecture in your own stack.

## Read order

1. `BUILDPRINT.md`
2. `SPEC.md`
3. `PLAN.md`
4. `CONTRACTS.md`
5. `AGENT_RUNTIME.md`
6. `PROVIDER_ROUTER.md`
7. `TOOL_SKILL_MCP.md`
8. `MEMORY_CONTEXT.md`
9. `STREAMING_WEBUI.md`
10. `SUBAGENTS_TEAM.md`
11. `TOKEN_TELEMETRY.md`
12. `SECURITY_POLICY.md`
13. `TEST_MATRIX.md`
14. `HEAD_TO_FOOT_QA.md`
15. `PARITY_CLAIMS.md`
16. `TRACEABILITY_MATRIX.md`
17. `questions.md`

## Validation status

Current validation is local deterministic proof only. No live model providers, MCP servers, shell execution, browser automation, or external network calls are required for the proof.
