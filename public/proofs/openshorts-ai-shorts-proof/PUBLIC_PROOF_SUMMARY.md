# OpenShorts-Inspired AI Shorts Production Studio Proof

## Status

PASS for scoped reversal proof.

This proof maps the public `mutonby/openshorts` repository into a clean-room Buildprint called **Portable AI Shorts Production Studio**.

Claim boundary:

`workflow-proof + contract-parity + mocked-provider proof`

Do not describe this as an OpenShorts clone, drop-in replacement, or provider/API/social-platform parity implementation.

## What was proven

- Evidence-backed Mapper OS pass over public OpenShorts source.
- Selected end-to-end candidate: product URL/manual input → analysis → script generation → actor/voice selection → mocked talking-head/b-roll/subtitle provider jobs → 9:16 composition plan → gallery SEO/social handoff manifest.
- Clean-room runnable proof built from the Buildprint package, not from OpenShorts source.
- Final command: `npm run check`.
- Final result: 7/7 tests passing and `dist/` build passing.

## Source repo

`https://github.com/mutonby/openshorts`

Mapped commit:

`fe87af6dd599b854e6eab2de0ca247ebafe13885`

GitHub metadata noted the repository is a fork; this is recorded as a risk/metadata boundary, not a blocker for mapping the public code snapshot.

## Commands

```bash
cd /root/.openclaw/workspace/research/openshorts-cleanroom-proof-2026-05-16
npm run check
```

`npm run check` runs:

```bash
npm test
npm run build
```

## What is out of scope

- Full OpenShorts clone parity.
- Actual video rendering quality parity.
- Gemini, ElevenLabs, fal.ai, Flux, Hailuo, Kling, VEED, Remotion, S3, Upload-Post, YouTube, TikTok, or Instagram provider/API parity.
- Real scraping reliability, quotas, moderation, consent, platform policy, or publishing guarantees.
- Production auth/key vault/storage hardening.
- Copyright/likeness/legal compliance beyond threat-model notes.

## Key artifacts

- `REPO_FACTS.md` — source metadata and repo census.
- `SOURCE_TRACE.md` — source evidence grouped by capability.
- `SYSTEM_MAP.md` — OpenShorts system map.
- `buildprint-submission/` — Buildprint package.
- `cleanroom-proof/src/pipeline.js` — clean-room proof pipeline.
- `cleanroom-proof/tests/pipeline.test.js` — proof tests.
