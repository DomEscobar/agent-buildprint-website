# FeedMe System Map

## Scope And Safety

- OBSERVED: Target repo is `./FeedMe`; mapping is read-only for source files.
- OBSERVED: No `.env` file was read. Environment variable names only: `LLM_API_KEY`, `LLM_API_BASE`, `LLM_NAME`.
- OBSERVED: Generated artifacts are written under `./codex-output/`.

## Stack Summary

- OBSERVED(`FeedMe/package.json:5-11`): ESM Node project with Vite scripts: `dev`, `build`, `preview`, `update-feeds`, and `full-build`.
- OBSERVED(`FeedMe/package.json:13-41`): React 19, Vite 6, Tailwind, Radix/shadcn-style UI dependencies, `rss-parser`, and `openai`.
- OBSERVED(`FeedMe/vite.config.ts:6-16`): Vite outputs static assets to `out` and uses relative base path `./`.
- OBSERVED(`FeedMe/README.en.md:20-44`): Product is an AI-powered RSS reader with multi-source RSS aggregation, LLM summaries, auto updates, and static/Docker deployment.

## Architecture Zones

### Static Web App

- Responsibilities: render FeedMe shell, source picker, feed cards, summary/original tabs, theme toggle, and links.
- Entrypoints:
  - OBSERVED(`FeedMe/src/main.tsx:6-10`): React mounts `App` into `#root`.
  - OBSERVED(`FeedMe/src/App.tsx:13-55`): App composes provider, source switcher, feed view, footer, and scroll button.
- State:
  - OBSERVED(`FeedMe/src/components/rss-feed.tsx:18-20`): local React state stores `feedData`, `loading`, and `error`.
  - OBSERVED(`FeedMe/src/hooks/use-navigation.ts:7-19`): URL search parameters are mirrored through `popstate`.
- Side effects:
  - OBSERVED(`FeedMe/src/lib/data-store.ts:20-32`): browser fetches static JSON from `data/{base64(sourceUrl).json}` relative to current base path.
  - OBSERVED(`FeedMe/src/components/rss-feed.tsx:100-108`): article links open external URLs.
- Risk:
  - OBSERVED(`FeedMe/src/components/rss-feed.tsx:126-130`): original feed content is inserted with `dangerouslySetInnerHTML`; sanitizer behavior is not present in repo.
- Confidence: high for UI data flow; medium for security posture.

### Feed Source Configuration

- Responsibilities: declare source list, categories, max retained items, and output data path.
- OBSERVED(`FeedMe/src/config/rss-config.js:14-129`): config has `sources`, `maxItemsPerFeed: 30`, and `dataPath: "./public/data"`.
- OBSERVED(`FeedMe/src/config/rss-config.js:137-149`): helper functions find a source by URL and group sources by category.
- Invariants:
  - OBSERVED(`FeedMe/src/config/rss-config.js:6-10`): each source is intended to have `name`, `url`, and `category`.
  - INFERRED: Source URL is the stable identity key across update and UI lookup.
- Confidence: high.

### RSS Update And Summary Job

- Responsibilities: load env, fetch RSS feeds, serialize items, preserve existing summaries, generate LLM summaries for new items, and write per-source JSON.
- Entrypoint:
  - OBSERVED(`FeedMe/package.json:10`): `pnpm update-feeds` runs `node scripts/update-feeds.js`.
  - OBSERVED(`FeedMe/scripts/update-feeds.js:362-375`): script invokes `main()`.
- Environment:
  - OBSERVED(`FeedMe/scripts/update-feeds.js:18-52`): script loads `.env`, then `.env.local`, if present.
  - OBSERVED(`FeedMe/scripts/update-feeds.js:67-85`): exits if `LLM_API_KEY`, `LLM_API_BASE`, or `LLM_NAME` is missing.
- Data path and naming:
  - OBSERVED(`FeedMe/scripts/update-feeds.js:93-108`): ensures `config.dataPath`, then names files as base64(sourceUrl) with `/+=` replaced by `_`.
  - OBSERVED(`FeedMe/src/lib/data-store.ts:10-22`): browser computes the same base64 filename and fetches from `data/`.
- Item lifecycle:
  - OBSERVED(`FeedMe/scripts/update-feeds.js:183-223`): RSS items are normalized to plain objects with title, link, dates, content, snippet, creator, optional enclosure.
  - OBSERVED(`FeedMe/scripts/update-feeds.js:226-279`): old and new items merge by `link`; new unseen links require summaries; output keeps new feed order and slices to max items.
  - OBSERVED(`FeedMe/scripts/update-feeds.js:302-320`): only new, unsummarized items call `generateSummary`.
  - OBSERVED(`FeedMe/scripts/update-feeds.js:323-333`): saved data includes `sourceUrl`, feed metadata, items, and `lastUpdated`.
- Failure behavior:
  - OBSERVED(`FeedMe/scripts/update-feeds.js:72-85`): missing env exits the process.
  - OBSERVED(`FeedMe/scripts/update-feeds.js:177-180`): summary generation failure returns a fallback Chinese message.
  - OBSERVED(`FeedMe/scripts/update-feeds.js:336-339`): single source update failure throws.
  - OBSERVED(`FeedMe/scripts/update-feeds.js:348-355`): all-source loop records per-source failure and continues.
- Confidence: high.

### Deployment And Scheduling

- GitHub Actions:
  - OBSERVED(`FeedMe/.github/workflows/update-deploy.yml:3-8`): workflow runs every 3 hours, on pushes to `main`/`dev`, and manually.
  - OBSERVED(`FeedMe/.github/workflows/update-deploy.yml:33-44`): installs with pnpm, runs update script with GitHub secrets, then builds.
  - OBSERVED(`FeedMe/.github/workflows/update-deploy.yml:46-53`): copies `vercel.json` into `out` and uploads artifact.
  - OBSERVED(`FeedMe/.github/workflows/update-deploy.yml:56-72`): deploys artifact to GitHub Pages.
  - OBSERVED(`FeedMe/.github/workflows/update-deploy.yml:74-107`): force-pushes artifact contents to `deploy` branch.
- Docker:
  - OBSERVED(`FeedMe/Dockerfile:1-38`): Node 20 Alpine image installs dcron/bash/procps, pnpm, dependencies, copies app, installs crontab, and uses custom entrypoint.
  - OBSERVED(`FeedMe/docker-compose.yml:3-10`): service builds locally, maps port 3000, and mounts `./.env` into `/app/.env`.
  - OBSERVED(`FeedMe/src/config/crontab-docker:1-2`): cron runs update/serve script every 3 hours.
- Risk:
  - OBSERVED(`FeedMe/scripts/update_and_serve.sh:21-34`): shell sets `DATA_DIR=$TEMP_DATA_DIR` for `pnpm update-feeds`.
  - OBSERVED(`FeedMe/scripts/update-feeds.js:93-108`): update script ignores `DATA_DIR` and uses `config.dataPath`.
  - INFERRED: Docker temp-data swap may not behave as intended without changing the update script or config.
- Confidence: high for workflow shape; medium for Docker runtime correctness.

## Data Stores And Models

- OBSERVED(`FeedMe/src/lib/types.ts:1-14`): `FeedItem` includes title, link, dates, content, contentSnippet, creator, generated summary, and optional enclosure.
- OBSERVED(`FeedMe/src/lib/types.ts:23-30`): `FeedData` includes sourceUrl, metadata, items, and lastUpdated.
- OBSERVED(`FeedMe/.gitignore:47-49`): local `data/` and `public/data/*.json` are ignored.
- INFERRED: Generated JSON is deploy artifact data, not committed source data.

## Auth, Permissions, And Sensitive Data

- OBSERVED: No app auth/session/RBAC files were found.
- OBSERVED(`FeedMe/.env.example:1-3`): sample env names and placeholder/provider example values exist.
- OBSERVED(`FeedMe/.gitignore:21-23`): `.env*` ignored except `.env.example`.
- OUT_OF_SCOPE: User accounts, tenants, payments, and admin privileges.

## Major Lifecycles

### Feed Update Lifecycle

1. OBSERVED(`FeedMe/scripts/update-feeds.js:18-52`): load local env file if present.
2. OBSERVED(`FeedMe/scripts/update-feeds.js:67-91`): validate LLM env and create OpenAI-compatible client.
3. OBSERVED(`FeedMe/scripts/update-feeds.js:348-350`): iterate configured sources.
4. OBSERVED(`FeedMe/scripts/update-feeds.js:288-291`): load existing JSON then fetch current RSS.
5. OBSERVED(`FeedMe/scripts/update-feeds.js:294-300`): merge by link and identify new items.
6. OBSERVED(`FeedMe/scripts/update-feeds.js:303-320`): generate summaries for new unsummarized items.
7. OBSERVED(`FeedMe/scripts/update-feeds.js:323-333`): write source JSON and continue.

### Browser Read Lifecycle

1. OBSERVED(`FeedMe/src/components/source-switcher.tsx:19-25`): selecting a source writes `?source=<url>` to browser history.
2. OBSERVED(`FeedMe/src/components/rss-feed.tsx:15-27`): selected URL drives data load.
3. OBSERVED(`FeedMe/src/lib/data-store.ts:12-24`): browser computes data filename and fetches static JSON.
4. OBSERVED(`FeedMe/src/components/rss-feed.tsx:49-57`): missing data renders error card.
5. OBSERVED(`FeedMe/src/components/rss-feed.tsx:93-135`): loaded items render feed cards with summary/original tabs.

## Tests And Checks Present

- OBSERVED(`FeedMe/package.json:6-12`): no test, lint, or typecheck scripts are defined.
- OBSERVED(`FeedMe/package.json:8`): `pnpm build` is the main lightweight check.
- OBSERVED: No dedicated test files were found in the source census.

## Candidate-Risk Unknowns

- QUESTION: Should generated summaries be Chinese-only or configurable?
- QUESTION: Should original RSS HTML be sanitized before browser insertion?
- QUESTION: Is Docker intended to serve `public/data` or `/app/data` after rebuild?
- QUESTION: Should failed RSS sources make the whole update fail or remain partial success?
- QUESTION: Are RSS provider redirects/proxies part of the portable contract?

