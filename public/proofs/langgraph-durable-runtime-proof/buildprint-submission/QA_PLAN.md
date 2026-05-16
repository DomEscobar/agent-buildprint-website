# QA PLAN

## Static Review

- Check every `OBSERVED(...)` claim points to an exact source path and line range.
- Check every synthesis claim is labeled `INFERRED`.
- Check non-goals are labeled `OUT_OF_SCOPE`.
- Check unresolved design items are labeled `QUESTION`.
- Check no generated artifact contains large copied source chunks.

## Behavioral Tests

Implement and run the tests in `TEST_MATRIX.md`.

Required test conditions:
- No network access.
- No model provider dependency.
- No LangSmith/cloud dependency.
- Temporary in-memory storage only.
- Deterministic event ordering.

## Security Tests

- Strict serializer rejects unknown tagged type.
- Pickle/equivalent unsafe mode is unavailable or disabled by default.
- Checkpoint load from untrusted bytes is documented as unsafe unless strict allowlist is active.

## Reversal Proof

A future clean-room implementation should prove:
- It was written from this Buildprint and public concepts only.
- It does not copy LangGraph source.
- It passes the required tests.
- It does not claim unsupported parity.
