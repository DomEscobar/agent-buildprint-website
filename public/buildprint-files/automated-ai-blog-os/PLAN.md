# PLAN

Read `BUILDPRINT.md` first. Then execute phase files in order.

```txt
plans/00-alignment.md
plans/01-content-skeleton.md
plans/02-source-scanner.md
plans/03-idea-scoring.md
plans/04-drafting-visuals.md
plans/05-seo-claim-validation.md
plans/06-approval-publishing.md
plans/07-manager-audit.md
plans/08-tests-validation.md
```

## Rules

- Finish each phase before starting the next.
- Keep the research → score → draft → validate → approve → publish/schedule shape intact.
- Do not call external APIs in tests.
- Do not auto-publish by default.
- Record choices, deviations, blockers, and test results in `VALIDATION.md`.

## Done means

- tests pass;
- static/build checks pass;
- every risk in `TEST_MATRIX.md` is covered or marked blocked;
- `VALIDATION.md` follows `VALIDATION_TEMPLATE.md`.
