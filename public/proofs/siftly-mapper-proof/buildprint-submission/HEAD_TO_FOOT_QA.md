# Head To Foot QA

## Static Safety

- Check no secret values in Buildprint package.
- Check no validation command needs live API credentials.

## Unit / Contract

- Parser formats and errors.
- Import idempotency.
- Categorization assignment validation.
- Search response filtering.
- Export serialization.

## Build / Typecheck

- Clean-room proof uses plain JS to keep dependency and TypeScript config risk low.

## Runtime Happy Path

- Run fixture import.
- Run mocked categorization.
- Search a semantic term.
- Export JSON/CSV.
- Render static proof UI.

## Runtime Negative Paths

- Empty JSON.
- Invalid JSON.
- Duplicate import.
- Empty search query.
- Unknown export type.
- Unknown category assignment.

## Responsive / UX Smoke

- Static proof HTML should contain import count, category label, search result, and export preview.
- This is not Siftly UI/workbench parity.

## Optional Live Provider / Export Gates

- OUT_OF_SCOPE: live AI providers.
- OUT_OF_SCOPE: live X import.
- OUT_OF_SCOPE: network media ZIP.
- OUT_OF_SCOPE: hosted deployment.
