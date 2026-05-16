# Reversal Report

## Result

- architecture reversal passed
- workflow proof passed
- contract parity partial
- provider parity not claimed
- feed-source parity not claimed
- hosted product parity not claimed
- full clone parity not claimed

## Proof Setup

- Scratch folder: `codex-output/reversal-proof/`
- Original repo access during proof: not required after Buildprint extraction; proof implemented only the selected pipeline contracts.
- Live network/API calls: none.
- Secrets used: none.

## Commands Run

```sh
node codex-output/reversal-proof/test/rss-pipeline.test.mjs
node --check FeedMe/scripts/update-feeds.js
rg -n "sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|BEGIN (RSA|OPENSSH|PRIVATE)" codex-output || true
```

## Evidence

- OBSERVED: `node codex-output/reversal-proof/test/rss-pipeline.test.mjs` printed `rss pipeline contract proof passed`.
- OBSERVED: `node --check FeedMe/scripts/update-feeds.js` exited successfully.
- OBSERVED: secret-pattern grep produced no matches.
- OBSERVED: `FeedMe/node_modules` is absent, so Vite build was not attempted under restricted network.

## Checks Covered

- Filename contract.
- Feed normalization.
- Merge by link.
- Existing summary preservation.
- New item summary generation.
- HTML stripping before summary adapter.
- Summary fallback on adapter failure.
- Per-source continuation after one source fails.
- Missing env validation.

## Buildprint Gaps

- QUESTION: Summary language/customization remains product-confirmation territory.
- QUESTION: Process exit semantics after partial source failures are not fully specified by tests.

## Scratch Harness Issues

- None observed.

## Product Proof Defects

- None applicable; no UI/runtime product parity was selected.

## Intentional Omissions

- Live LLM provider behavior.
- Live RSS source behavior.
- Hosted deployment.
- Docker cron runtime.
- Browser UI QA.
