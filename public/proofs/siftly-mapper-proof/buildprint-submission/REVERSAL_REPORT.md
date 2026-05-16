# Reversal Report

## Result

- Status: pass.
- Reversal type: compact clean-room proof from `buildprint-submission/` only.
- Selected scope: Local Bookmark Knowledge Base Workflow.
- Selected fidelity: `workflow-proof + contract-parity + mocked-runtime-proof`.
- Behavioral parity: not claimed.

## Built

Created `output/reversal-proof/` with:

- `src/siftly-proof.js` — in-memory parser/import/categorization/search/export model.
- `test/siftly-proof.test.mjs` — 7 Node contract tests.
- `public/app.html` — tiny static proof UI.
- `test/browser-smoke.mjs` — Chromium headless DOM smoke.

## Commands

```bash
cd output/reversal-proof
npm test
npm run browser-smoke
```

## Evidence

- `npm test`: 7/7 tests passed.
- `npm run browser-smoke`: passed and wrote `artifacts/browser-smoke-dom.html`.

## Buildprint Gaps

- No blocking gaps found for the selected depth.
- Future upgrade to runtime parity would need SQLite/Prisma or Next API route proof.
- Future upgrade to UI parity would need Playwright journeys against selected screens.

## Scratch Harness Issues

- None after implementation.

## Product Proof Defects

- None in the clean-room proof.

## Intentional Omissions

- OUT_OF_SCOPE: live X import/scraping/OAuth parity.
- OUT_OF_SCOPE: real AI provider quality/provider parity.
- OUT_OF_SCOPE: hosted deployment/account/session parity.
- OUT_OF_SCOPE: exact Siftly UI/workbench parity.
- OUT_OF_SCOPE: Obsidian/export full parity and network media ZIP parity.

## Conclusion

Architecture reversal passed for the selected workflow/contract/mocked-runtime depth. The proof is publishable as a Mapper OS proof page if framed with the explicit non-claims above.
