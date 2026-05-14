# Phase 07 — Manager Audit

## Goal

Create QA/audit layer that catches drift, unsafe content, stale queues, and publishing blockers.

## Files

- `life/manager-audit.mjs`
- `MANAGER.md`

## Steps

1. Audit stale drafts and stuck media jobs.
2. Audit unsafe/canon-breaking media.
3. Audit ungrounded claims.
4. Audit missing auth/login/publishing blockers.
5. Write structured report.

## Do not

- replace persona voice;
- silently auto-repair major persona direction;
- hide blockers.

## Exit criteria

- audit report includes pass/warn/fail items;
- tests can create stale/unsafe fixtures and see findings.
