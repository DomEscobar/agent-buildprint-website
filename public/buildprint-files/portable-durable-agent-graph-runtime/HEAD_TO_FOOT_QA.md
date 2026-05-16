# HEAD TO FOOT QA

## Head: Does the Buildprint Match the Selected Candidate?

Yes. All core files describe the Portable Durable Agent Graph Runtime, not a broad LangGraph clone.

## Body: Are Core Subsystems Covered?

- Builder: covered in `SPEC.md`, `CONTRACTS.md`, and trace.
- Runtime: covered with deterministic supersteps, invoke, stream, state snapshots.
- State updates: covered with partial dict updates, LastValue, reducers.
- Streaming: covered with modes and payload expectations.
- Checkpointing: covered with checkpoint shape, tuple, in-memory saver, thread/checkpoint config, pending writes.
- Interrupt/resume: covered with `interrupt`, `Command`, and snapshot requirements.
- Serializer safety: covered with strict allowlist and no default pickle-equivalent behavior.

## Feet: Can a Future Implementer Walk It?

Yes. `PLAN.md` gives implementation sequence and `TEST_MATRIX.md` gives acceptance tests.

## Risk Review

- Risk: Over-claiming parity. Mitigation: `PARITY_CLAIMS.md` is explicit.
- Risk: Accidentally implementing provider/tool ecosystem. Mitigation: prebuilt tooling is optional and mocked.
- Risk: Unsafe deserialization. Mitigation: strict serializer safety gate is a core test.
- Risk: Ambiguous reducer ordering. Mitigation: documented question; implementation must choose deterministic order.
