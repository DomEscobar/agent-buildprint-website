# Phase 00 — Alignment

## Goal

Configure the fixed OpenClaw Influencer OS without redesigning it.

## Steps

1. If user said `Use default persona preset`, continue.
2. Otherwise ask exactly `questions.md`.
3. Summarize choices.
4. Wait for confirmation.
5. Start `VALIDATION.md` from `VALIDATION_TEMPLATE.md` and record choices.

## Do not

- ask broad product strategy questions;
- introduce a fixed default persona name;
- change runtime, image provider, or publishing architecture.

## Exit criteria

- confirmed alignment choices exist;
- persona name is user-provided or marked “generate fresh fictional name”.
