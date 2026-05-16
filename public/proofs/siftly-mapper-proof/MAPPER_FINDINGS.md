# Mapper Findings From Siftly Proof

## What Worked

- Candidate-first mapping selected a compact, high-value AI-native slice instead of a full app clone.
- New depth term `mocked-runtime-proof` fit the clean-room proof better than overclaiming `runtime-parity`.
- New `feed-source-parity`/source-parity framing generalized well to live X import exclusion.
- `PARITY_CLAIMS.md` and `HEAD_TO_FOOT_QA.md` made the proof publishable without overclaiming.

## Issues / Lessons

- Mapper should mention social/source parity explicitly for apps that ingest platform data, not only RSS/API feeds.
- For webapps, Mapper should offer a lightweight static proof-smoke option between pure Node tests and full UI parity.
- The extracted package could benefit from a standard `PUBLIC_PROOF_SUMMARY.md` template.

## Recommended Low-Risk Mapper Improvements

- Rename/generalize `feed-source-parity` guidance to include `platform-source-parity` examples such as X, GitHub, RSS, email, and files.
- Add optional `PUBLIC_PROOF_SUMMARY.md` to Mapper validation outputs for website publication.
- Add a lightweight browser smoke recipe for mocked-runtime-proof webapp scopes.
