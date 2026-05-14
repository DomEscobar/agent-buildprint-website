# Phase 03 — Memory and Life State

## Goal

Create separate user memory and persona self-state stores plus life continuity modules.

## Files

- `storage/users/.gitkeep`
- `storage/influencer-self/state.json`
- `storage/calendar/events.json`
- `life/life-state.mjs`
- `life/life-tick.mjs`
- `life/journal-writer.mjs`
- `life/reflect-memory.mjs`

## Steps

1. Implement JSON read/write helpers.
2. Seed self-state and calendar with modest defaults.
3. Implement life tick that does not invent dramatic events.
4. Implement memory reflection that updates user memory only.

## Do not

- merge user memory and self-state;
- claim events not in state/calendar/journal;
- mutate persona source files during reflection.

## Exit criteria

- test can load/update user memory separately from self-state;
- life tick works without external model by conservative fallback.
