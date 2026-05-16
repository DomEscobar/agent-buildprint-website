# QA Report

## Scope

Siftly-inspired local bookmark knowledge workflow: local JSON import, normalization, dedupe, mocked categorization, local search, JSON/CSV/manifest export.

## Commands Run

```bash
cd output/reversal-proof
npm test
npm run browser-smoke
```

## Results

| Gate | Result | Evidence |
|---|---:|---|
| Static/no-network proof posture | pass | proof uses fixtures and in-memory store only |
| Parser/import contract | pass | Node tests cover wrapped JSON, flat rows, malformed/empty JSON, missing IDs |
| Dedupe/idempotency | pass | repeated import skips duplicate tweet IDs |
| Categorization contract | pass | confidence clamp and unknown slug filtering covered |
| Search contract | pass | empty query rejects; matches are from candidate IDs only |
| Export contract | pass | JSON/CSV/manifest ZIP covered; unknown type rejects |
| Browser smoke | pass | Chromium headless rendered static proof and expected state |

## Commands Not Run And Why

- Original `Siftly` `npm test` / `npm run build`: not required for the clean-room Mapper proof and could require dependency/runtime assumptions outside selected proof scope.
- Live provider tests: explicitly excluded.
- Live X import/scraping tests: explicitly excluded.
- Full Playwright UI parity: explicitly excluded; only a static proof smoke was selected.

## Remaining Gaps

- Provider quality and provider failures are not validated.
- Live X source drift is not validated.
- Exact Next.js route/runtime behavior is not validated.
- Exact UI parity and hosted deployment parity are not validated.
