# SKILL_UNIT_EVALS

Use `balyakin/skill-eval-runner` as the core module.

## Case design

Every important skill should have:

1. Happy path.
2. Missing context / ambiguous prompt.
3. Bad input / malformed fixture.
4. Output schema/contract check.
5. Safety/permission edge case.
6. No-network or mock-provider mode.
7. Token/duration guard.

## Assertions

- File exists / not exists.
- File contains / matches regex.
- JSON path equals / schema validates.
- Command ran / did not run.
- Exit code and stderr.
- Final response contains / does not contain.
- Token usage under threshold.
- Artifact diff matches expected boundaries.

## Rule

Skill unit tests prove a skill can work when selected. They do not prove the setup will select it. Activation evals are separate.
