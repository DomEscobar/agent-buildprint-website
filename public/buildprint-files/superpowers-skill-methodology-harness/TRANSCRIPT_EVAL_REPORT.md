# Transcript Eval Report

Date: 2026-05-17

## Scope

This is a clean-room runnable proof for the Superpowers Skill Methodology Harness Buildprint snapshots under `.buildprint/snapshots`. It does not copy `obra/superpowers` source. The proof models the methodology as a neutral Node.js harness with machine-readable skill metadata, transcript events, hard gates, and an eval runner.

## Commands Run

```bash
npm test
npm run eval
```

Both commands passed locally.

## Eval Results

`npm run eval` reported:

- Passed: 5
- Failed: 0

Covered scenarios:

- `Let's make a react todo list` loads bootstrap, performs skill lookup, activates brainstorming, and blocks implementation before approved design.
- TDD gate blocks production implementation before a failing test is observed.
- Subagent loop dispatches task-specific context only, then performs spec review before code-quality review.
- Debugging prompt records root-cause evidence before any fix path.
- Completion prompt blocks without verification evidence and passes after `npm test` evidence is recorded.

## Acceptance Evidence

For the required acceptance prompt, the transcript order is:

1. `bootstrap_loaded`
2. `skill_lookup` with `using-superpowers`, `brainstorming`, and `test-driven-development`
3. `skill_activated` for `brainstorming`
4. `gate` for `no_code_before_approved_design`
5. `brainstorm_options`

No `production_change` event is present in that transcript.

## Files

- `package.json`
- `src/skills.js`
- `src/transcript.js`
- `src/harness.js`
- `src/subagents.js`
- `src/eval.js`
- `src/run-evals.js`
- `tests/harness.test.js`

## Residual Risk

This is a compact proof harness, not a production runtime adapter. It validates behavior shaping and transcript contracts, but it does not integrate with a real agent tool API, git worktree manager, or filesystem-writing runtime.
