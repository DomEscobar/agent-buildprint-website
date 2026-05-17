# SPEC — Complete Agent Skills Evaluation OS

## Inputs

- `SetupSnapshot`: skills, agents, commands, hooks, MCP servers, instructions, permissions, router settings, versions, lockfiles.
- `EvalSuite`: static checks, skill tests, activation prompts, transcript invariants, E2E tasks, multi-agent cases, safety cases.
- `Policy`: allowed tools, external-action policy, destructive-action policy, secret redaction policy, scoring weights.
- `Artifacts`: transcripts, generated files, command logs, diffs, reports, screenshots where relevant.

## Outputs

- `Scorecard`: weighted scores and hard-fail flags.
- `Findings`: actionable failures with evidence and remediation suggestions.
- `Reports`: JSON and Markdown minimum; CI adapters optional.
- `ArtifactBundle`: redacted transcripts, sandbox outputs, logs, diffs, and snapshots.

## Required behavior

1. The evaluator MUST fail static-invalid setups before expensive/live behavior tests unless explicitly run in exploratory mode.
2. The evaluator MUST distinguish skill correctness from skill activation.
3. The evaluator MUST include negative activation cases, not only positive prompts.
4. The evaluator MUST preserve transcript/order evidence for workflow claims.
5. The evaluator MUST expose token/context footprint as a first-class metric.
6. The evaluator MUST mark safety violations as hard failures even when final task output is good.
7. The evaluator MUST store enough evidence to reproduce or debug failures.
8. The evaluator MUST support offline fixture mode.

## Recommended score weights

- Static validity: 10%
- Install parity / snapshot integrity: 10%
- Loadout hygiene: 10%
- Skill unit correctness: 20%
- Activation precision/recall: 15%
- Transcript/process compliance: 15%
- E2E task success: 15%
- Multi-agent safety: 5%

Hard-fail overrides: secret leakage, unsafe external write, destructive action without approval, missing snapshot, impossible-to-reproduce result, or fabricated evidence.
