# Workflow

## Build/change workflow

1. Inspect project context.
2. Ask focused questions one at a time.
3. Propose 2-3 approaches and recommend one.
4. Present design in digestible sections.
5. Save approved design/spec.
6. Create implementation plan with tiny tasks.
7. Execute in isolated workspace when appropriate.
8. For each task: failing test → verify red → minimal implementation → verify green → refactor → commit.
9. Review task against spec, then code quality.
10. Finish branch with full verification and human choice.

## Debug workflow

1. Read errors completely.
2. Reproduce.
3. Check recent changes.
4. Instrument boundaries if multi-layer.
5. Trace bad data backward to origin.
6. Fix at root cause.
7. Verify the fix and add regression coverage.

## Contribution workflow

- One problem per PR.
- Real problem statement only.
- Search duplicates before submitting.
- Human reviews full diff before public PR.
- Harness integrations need transcript proof.
