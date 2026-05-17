# PLAN — Implementation rails

## Phase 0 — Scope and policy
- Define target agent platforms.
- Define allowed live adapters and offline mode.
- Define safety policy for external actions, credentials, browser use, and destructive commands.

## Phase 1 — Snapshot
- Discover setup artifacts.
- Normalize to `SetupSnapshot`.
- Record source versions and install target.
- Redact secrets.

## Phase 2 — Static lint
- Validate `SKILL.md` frontmatter and body.
- Validate agent/command/hook/MCP references.
- Validate permission boundaries.
- Block behavior tests on critical errors.

## Phase 3 — Loadout inventory
- Compute loaded token/context footprint.
- Detect duplicates, dormant artifacts, and unused high-cost components.
- Emit inventory report.

## Phase 4 — Skill unit suites
- Add `*.skill-test.yml` or equivalent cases.
- Run sandboxed tests.
- Assert file, command, JSON, output, duration, and token contracts.

## Phase 5 — Activation suites
- Generate positive and negative prompts per component.
- Run with base setup and optionally with router enabled.
- Score recall, precision, ambiguity handling, and wrong-route rate.

## Phase 6 — Transcript invariants
- Define required event order.
- Parse transcripts/events.
- Fail forbidden shortcuts and missing process steps.

## Phase 7 — E2E benchmark
- Run representative repo tasks.
- Score final artifacts, tests, process evidence, safety, and recovery.

## Phase 8 — Multi-agent safety
- Test delegation briefs, output schemas, file ownership, worktree/session coordination, and merge recovery.

## Phase 9 — Reports
- Aggregate scorecard.
- Store redacted evidence.
- Emit CI-friendly JSON/Markdown/JUnit/HTML reports.
