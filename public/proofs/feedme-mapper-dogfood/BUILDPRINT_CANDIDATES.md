# Buildprint Candidates

## Candidate 1: Static RSS Update Pipeline Contract

- Scope: `scripts/update-feeds.js`, `src/config/rss-config.js`, `src/lib/types.ts`, browser filename contract in `src/lib/data-store.ts`, and workflow invocation context.
- Build outcome: a portable job that reads configured RSS sources, merges prior JSON by item link, generates summaries for new items through a mockable OpenAI-compatible adapter, and writes per-source static JSON compatible with the browser reader.
- Included paths:
  - `FeedMe/scripts/update-feeds.js`
  - `FeedMe/src/config/rss-config.js`
  - `FeedMe/src/lib/types.ts`
  - `FeedMe/src/lib/data-store.ts`
  - `FeedMe/.github/workflows/update-deploy.yml`
  - `FeedMe/.env.example`
- Excluded paths:
  - UI components except the static JSON filename consumer.
  - Docker live serving scripts except as risk context.
  - Live provider behavior, actual RSS source availability, hosted deployments.
- Reusable value: common static-site pattern for scheduled RSS ingestion plus LLM summaries with artifact JSON consumed by a browser-only frontend.
- Recommended fidelity target: `workflow-proof` + `contract-parity`.
- Optional deeper targets: `runtime-parity` with mocked RSS and mocked LLM; provider parity only with explicit live credentials and network tests.
- Explicitly excluded targets: `provider-parity`, `feed-source-parity`, `hosted-product-parity`, `full-clone-parity`, `ui-workbench-parity`.
- Safe claims:
  - OBSERVED: Env names and hard failure for missing LLM config are known.
  - OBSERVED: JSON naming contract is base64 source URL with `/+=` replaced by `_`.
  - OBSERVED: Merge key is item `link`; existing summaries are preserved; max item count defaults to 30.
  - OBSERVED: Summary failures degrade to a fallback string.
- Main risks:
  - OBSERVED: `DATA_DIR` shell override is ignored by update script.
  - OBSERVED: No tests currently protect merge/idempotency or filename parity.
  - QUESTION: Provider retries/rate limits are not implemented.
- Edge cases to preserve:
  - Missing `.env` and missing individual required env names.
  - Existing source data file missing or malformed.
  - Duplicate item links.
  - Atom feeds with `summary`.
  - Missing item link, content, dates, creator, or enclosure.
  - LLM failure for a new item.
  - RSS fetch failure for one source while others continue.
- QA/product proof strategy:
  - Build small pure Node skeleton with mocked RSS parser and mocked LLM adapter.
  - Run contract tests for filename generation, merge/idempotency, summary fallback, max item cap, and per-source continuation.
  - Run secrets grep on generated package.
- Evidence:
  - OBSERVED(`FeedMe/scripts/update-feeds.js:67-85`)
  - OBSERVED(`FeedMe/scripts/update-feeds.js:93-108`)
  - OBSERVED(`FeedMe/scripts/update-feeds.js:226-279`)
  - OBSERVED(`FeedMe/scripts/update-feeds.js:302-333`)
  - OBSERVED(`FeedMe/src/lib/data-store.ts:10-22`)
- Confidence: high.
- Estimated tier: strong tiny candidate.
- Decision needed before extraction: confirm this pipeline candidate and keep providers mocked.

## Candidate 2: Browser Static Feed Reader

- Scope: React source picker, URL query navigation, static JSON loading, feed cards, summary/original tabs, loading/error states.
- Included paths:
  - `FeedMe/src/App.tsx`
  - `FeedMe/src/components/rss-feed.tsx`
  - `FeedMe/src/components/source-switcher.tsx`
  - `FeedMe/src/hooks/use-navigation.ts`
  - `FeedMe/src/lib/data-store.ts`
  - `FeedMe/src/config/rss-config.js`
- Excluded paths: RSS update job internals, deployment automation, provider behavior.
- Reusable value: static reader UI that works from generated JSON without a backend.
- Recommended fidelity target: `workflow-proof` + `contract-parity`; runtime proof if cheap.
- Optional deeper targets: `runtime-parity`, `ui-workbench-parity`.
- Explicitly excluded targets: `provider-parity`, `feed-source-parity`, `hosted-product-parity`, `full-clone-parity`.
- Safe claims:
  - OBSERVED: source is selected through `?source=`.
  - OBSERVED: missing data renders a Chinese error card.
  - OBSERVED: feed items expose AI summary and original tabs.
- Main risks:
  - OBSERVED: original feed content is rendered with `dangerouslySetInnerHTML`.
  - QUESTION: Accessibility and responsive behavior are not tested.
- Confidence: medium-high.
- Estimated tier: medium.

## Candidate 3: GitHub Pages Static Deploy Workflow

- Scope: scheduled GitHub Actions workflow that installs dependencies, updates feeds with secrets, builds static assets, deploys to Pages, and force-pushes deploy branch.
- Included paths:
  - `FeedMe/.github/workflows/update-deploy.yml`
  - `FeedMe/package.json`
  - `FeedMe/vite.config.ts`
  - `FeedMe/vercel.json`
- Excluded paths: detailed UI and RSS merge internals.
- Reusable value: scheduled static artifact build and multi-target publish pattern.
- Recommended fidelity target: `workflow-proof` + partial `contract-parity`.
- Optional deeper targets: hosted runtime proof with GitHub credentials.
- Explicitly excluded targets: hosted-product-parity, provider-parity, full-clone-parity.
- Risks:
  - OBSERVED: deploy branch is force-pushed from an orphan branch.
  - QUESTION: Whether this branch policy is acceptable for all adopters.
- Confidence: medium.
- Estimated tier: weak-to-medium because it is workflow-specific and depends on GitHub hosting.

## Candidate 4: Docker Cron Refresh And Serve Loop

- Scope: Docker image, compose file, cron schedule, update/build/serve scripts.
- Included paths:
  - `FeedMe/Dockerfile`
  - `FeedMe/docker-compose.yml`
  - `FeedMe/scripts/entrypoint.sh`
  - `FeedMe/scripts/setup-cron.sh`
  - `FeedMe/scripts/update_and_serve.sh`
  - `FeedMe/src/config/crontab-docker`
- Excluded paths: React UI and summary prompt details.
- Reusable value: self-hosted static rebuild loop for scheduled content refresh.
- Recommended fidelity target: `workflow-proof` only until path mismatch is resolved.
- Optional deeper targets: `runtime-parity` with Docker smoke.
- Explicitly excluded targets: provider-parity, hosted-product-parity, full-clone-parity.
- Risks:
  - OBSERVED: shell passes `DATA_DIR`, but update script uses `config.dataPath`.
  - OBSERVED: `npx serve` is invoked but `serve` is not listed as a package dependency.
- Confidence: medium-low.
- Estimated tier: weak without runtime repair or stronger tests.

