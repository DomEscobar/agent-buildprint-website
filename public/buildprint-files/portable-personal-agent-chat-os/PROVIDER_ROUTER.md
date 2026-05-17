# PROVIDER_ROUTER

## Required behavior

- Provider registry maps `providerId -> provider adapter`.
- Provider capabilities include streaming, tools, vision, reasoning, context window, and token accounting shape.
- Tests use `FakeProvider` with deterministic streamed chunks and tool-call scripts.

## Adapter families

- OpenAI-compatible: OpenAI, DeepSeek, vLLM, Ollama-compatible HTTP, llama-swap style gateways.
- Anthropic: messages stream adapter.
- Bedrock: converse/stream adapter.
- Local: in-process or local HTTP model.

## Acceptance checks

- Unknown provider fails at bootstrap with actionable diagnostics.
- Provider can stream deltas.
- Provider usage is normalized into `{input, output, cacheRead, cacheCreate, total}`.
- Model config is hot-reloadable only if current turn is not mutating state.
