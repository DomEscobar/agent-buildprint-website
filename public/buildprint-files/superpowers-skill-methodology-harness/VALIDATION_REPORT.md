# Validation Report

## Package validation

- Source repo cloned and inspected at `obra/superpowers` commit `f2cbfbefebbfef77321e4c9abc9e949826bea9d7`.
- Source evidence was mapped into `SOURCE_TRACE.md`.
- Buildprint package files created under `public/buildprint-files/superpowers-skill-methodology-harness/`.
- Website build verifies routing and package manifest generation.

## Clean-room proof

Status: `validated` with scoped compact proof.

A fresh Codex run bootstrapped the live Buildprint package with `agb start` and built a clean-room neutral Node.js proof from `.buildprint/snapshots` only. The proof models the inspired/adaptive methodology harness, not an official Superpowers plugin clone and not a production runtime adapter.

Proof files are included under `proof/`.

## Commands run

From `/tmp/sp-codex-proof`:

```bash
npm test
node src/run-evals.js
```

Results:

- `npm test`: 6/6 subtests passed.
- `node src/run-evals.js`: 5/5 transcript evals passed, 0 failed.

## Eval coverage

- Clean-session acceptance prompt `Let's make a react todo list` loads bootstrap, performs skill lookup, activates brainstorming, and blocks implementation before design approval.
- Bootstrap is idempotent across turns.
- Approved design can transition into an exact implementation plan.
- TDD gate blocks production changes before a failing test event.
- Subagent loop dispatches task-specific context and performs spec review before code-quality review.
- Debugging prompt records root-cause evidence before a fix path.
- Completion blocks without verification evidence and passes after evidence is recorded.

## Claim boundary

Validated claim: the Buildprint can produce a runnable clean-room methodology-harness proof with transcript evals.

Not claimed:

- official `obra/superpowers` compatibility,
- exact plugin clone,
- production Claude/Codex/OpenCode/Gemini/Cursor adapter,
- real git worktree manager,
- real subagent API integration,
- full upstream feature parity.

## Remaining hardening

- Add a real runtime adapter for one agent CLI.
- Add filesystem artifact writing for generated specs/plans.
- Add worktree abstraction with dry-run tests.
- Add transcript fixture snapshots and destructive/external-action approval gates.
