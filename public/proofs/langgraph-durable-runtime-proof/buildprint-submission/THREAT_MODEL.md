# THREAT MODEL

## Assets

- Checkpoint state.
- Pending writes.
- Thread identifiers.
- Interrupt payloads.
- User-provided node inputs and outputs.
- Serialized checkpoint bytes.

## Threats

- Malicious checkpoint payload triggers code execution during deserialization.
- User-provided node writes invalid state keys or incompatible values.
- Thread id collision leaks state between runs.
- Resume command applies to the wrong interrupt.
- Pending writes are lost after partial failure.
- Stream events expose sensitive state unintentionally.

## Controls

- Serializer uses strict primitive JSON by default.
- Non-primitive tagged values require allowlist.
- No pickle/equivalent executable deserialization by default.
- `thread_id` is explicit and caller-controlled; tests use unique IDs.
- Compile validation rejects invalid graph topology.
- Runtime validates update keys.
- Interrupts include IDs; resume maps to an interrupt or next pending interrupt.
- Pending writes are persisted before superstep checkpoint commit in the simulation.

## Out of Scope Security Controls

- OUT_OF_SCOPE: Multi-tenant production storage isolation.
- OUT_OF_SCOPE: Encryption at rest.
- OUT_OF_SCOPE: Network sandboxing for user nodes.
- OUT_OF_SCOPE: Provider credential handling.
- OUT_OF_SCOPE: LangSmith/cloud deployment access controls.
