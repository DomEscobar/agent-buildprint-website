# Parity Claims

## Selected Fidelity Target

- `workflow-proof`
- `contract-parity`

## Safe Claims

- OBSERVED: The Buildprint preserves the RSS update workflow from config to static JSON artifact.
- OBSERVED: The Buildprint preserves the source URL to artifact filename contract.
- OBSERVED: The Buildprint preserves item merge identity by `link`.
- OBSERVED: The Buildprint preserves generated-summary reuse for existing links.
- OBSERVED: The Buildprint preserves fallback summary behavior when the LLM call fails.
- OBSERVED: The Buildprint preserves per-source continuation behavior in all-source updates.

## Unsafe Claims

- OUT_OF_SCOPE: Provider parity with any OpenAI-compatible service.
- OUT_OF_SCOPE: Feed-source parity for the listed RSS URLs.
- OUT_OF_SCOPE: Hosted-product parity for GitHub Pages, Vercel, or ESA Pages.
- OUT_OF_SCOPE: Docker runtime parity.
- OUT_OF_SCOPE: UI/workbench parity.
- OUT_OF_SCOPE: Full clone parity.

## Allowed Wording

Use:

- "Reproduces the static RSS update workflow with mocked providers."
- "Preserves the observed JSON artifact and merge contracts."
- "Includes a compact contract proof; live provider behavior is not claimed."

Do not use:

- "Drop-in clone of FeedMe."
- "Matches live provider behavior."
- "Matches all configured RSS sources."
- "Production deployment parity."
- "Full UI parity."

## Evidence Required To Upgrade

- Runtime parity: runnable generated implementation plus build/tests against representative fixtures.
- Provider parity: real credentials, live smoke tests, latency/failure/cost notes, and secret-safe logs.
- Feed-source parity: live fetch checks for each configured feed and documented proxy/redirect behavior.
- Hosted-product parity: deployed URL, artifact verification, and hosting-specific checks.
- UI/workbench parity: generated UI, Playwright journeys, screenshots, and accessibility/responsive smoke.

