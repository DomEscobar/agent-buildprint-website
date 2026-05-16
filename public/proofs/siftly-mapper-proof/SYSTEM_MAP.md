# System Map

Target: `./Siftly`
Mapper OS snapshots: `./.buildprint/snapshots`
Status: discovery map for public-proof extraction. Source and snapshot files were read-only.

## Project Purpose

- OBSERVED(Siftly/README.md:21): Siftly describes itself as a self-hosted Twitter/X bookmark manager with AI organization.
- OBSERVED(Siftly/README.md:23): The product turns bookmarks into a searchable, categorized, visual knowledge base running locally, except configured AI API calls.
- OBSERVED(Siftly/README.md:27): The core workflow is import -> entity extraction -> vision analysis -> semantic tagging -> categorization.
- OBSERVED(Siftly/README.md:39): User outputs include AI search, mindmap, filtered browsing, and export tools.

## Stack Summary

- OBSERVED(Siftly/package.json:10): Scripts include `dev`, `build`, `start`, `lint`, `test`, and `siftly`.
- OBSERVED(Siftly/package.json:18): Runtime dependencies include Next 16, React 19, Prisma SQLite adapter, Better SQLite3, JSZip, Anthropic SDK, OpenAI SDK, and XYFlow.
- OBSERVED(Siftly/prisma/schema.prisma:6): Persistence is SQLite through Prisma.
- OBSERVED(Siftly/README.md:234): Settings are managed in-app and via environment variables.

## Architecture Zones

### Browser UI

- OBSERVED(Siftly/app/import/page.tsx:424): Import page accepts `.json` uploads via drag/drop or file picker.
- OBSERVED(Siftly/app/import/page.tsx:65): Import page embeds bookmarklet/console scripts that capture X page API responses and download a local JSON file.
- OBSERVED(Siftly/app/bookmarks/page.tsx:48): Bookmarks page builds `/api/bookmarks` URLs from filters, page, and limit.
- OBSERVED(Siftly/app/ai-search/page.tsx:83): AI Search page posts a query to `/api/search/ai` and renders results or errors.

### Local Import And Persistence

- OBSERVED(Siftly/app/api/import/route.ts:5): `POST /api/import` accepts multipart form data.
- OBSERVED(Siftly/app/api/import/route.ts:42): The route parses uploaded JSON through `parseBookmarksJson`.
- OBSERVED(Siftly/app/api/import/route.ts:77): Import iterates parsed bookmarks, skips duplicates by `tweetId`, and stores media items.
- OBSERVED(Siftly/prisma/schema.prisma:10): `Bookmark` stores tweet identity, text, author, raw JSON, enrichment fields, source, media, and categories.
- OBSERVED(Siftly/prisma/schema.prisma:68): `ImportJob` tracks filename, status, counts, and errors.

### Parsing And Normalization

- OBSERVED(Siftly/lib/parser.ts:322): `parseBookmarksJson` rejects empty input and invalid JSON.
- OBSERVED(Siftly/lib/parser.ts:290): Parser normalizes console export, flat export rows, Siftly re-export rows, raw arrays, and wrapped arrays.
- OBSERVED(Siftly/lib/parser.ts:147): Tweets with no ID are skipped.
- OBSERVED(Siftly/lib/parser.ts:122): Media extraction supports photo, video, and gif, choosing highest-bitrate mp4 for videos.

### Categorization And Enrichment

- OBSERVED(Siftly/app/api/categorize/route.ts:21): Categorization state includes idle/running/stopping, stage, counts, and errors.
- OBSERVED(Siftly/app/api/categorize/route.ts:97): `POST /api/categorize` rejects concurrent runs, parses optional `bookmarkIds`, `apiKey`, and `force`.
- OBSERVED(Siftly/app/api/categorize/route.ts:171): Pipeline begins with local entity extraction.
- OBSERVED(Siftly/app/api/categorize/route.ts:184): Main pipeline processes vision, semantic enrichment, and categorization in parallel.
- OBSERVED(Siftly/lib/categorizer.ts:155): Categorization prompt uses category descriptions and per-bookmark text, image context, semantic tags, hashtags, and tools.
- OBSERVED(Siftly/lib/categorizer.ts:211): AI categorization response must contain a JSON array; invalid responses throw.
- OBSERVED(Siftly/lib/categorizer.ts:293): Results are written through bookmark/category upserts in one transaction and update `enrichedAt`.

### Search

- OBSERVED(Siftly/app/api/bookmarks/route.ts:33): `/api/bookmarks` supports text, category, media type, source, uncategorized, sort, page, and limit filters.
- OBSERVED(Siftly/app/api/search/ai/route.ts:187): `/api/search/ai` accepts JSON `{ query, category }`.
- OBSERVED(Siftly/app/api/search/ai/route.ts:193): Empty AI search query returns HTTP 400.
- OBSERVED(Siftly/app/api/search/ai/route.ts:230): AI search tries FTS first, then LIKE conditions.
- OBSERVED(Siftly/app/api/search/ai/route.ts:303): AI search prompts the provider/CLI to return JSON matches with scores and reasons.
- OBSERVED(Siftly/lib/fts.ts:13): FTS5 table indexes text, semantic tags, entities, and image tags.

### Export

- OBSERVED(Siftly/app/api/export/route.ts:4): `GET /api/export` selects export type from query params.
- OBSERVED(Siftly/app/api/export/route.ts:16): CSV export returns `bookmarks.csv`.
- OBSERVED(Siftly/app/api/export/route.ts:35): JSON export returns `bookmarks.json`.
- OBSERVED(Siftly/app/api/export/route.ts:54): ZIP export returns all bookmarks JSON or a category ZIP.
- OBSERVED(Siftly/lib/exporter.ts:146): CSV fields include tweetId, text, authorHandle, source, categories, tweetCreatedAt, and mediaUrls.
- OBSERVED(Siftly/lib/exporter.ts:178): JSON export includes bookmark identity, source, timestamps, categories, and media items.
- OBSERVED(Siftly/lib/exporter.ts:89): Category ZIP validates category existence, builds `manifest.csv`, and attempts media downloads.

### Settings, Secrets, Providers

- OBSERVED(Siftly/app/api/settings/route.ts:6): Settings GET masks keys before returning them.
- OBSERVED(Siftly/app/api/settings/route.ts:72): Settings POST can store provider choices, API keys, model choices, X OAuth credentials, and Obsidian vault path.
- OBSERVED(Siftly/lib/settings.ts:32): Active AI provider defaults to Anthropic unless settings specify OpenAI or MiniMax.
- OUT_OF_SCOPE: Provider parity and live credentials are excluded for this public proof.

## Entrypoints And APIs

- OBSERVED: UI routes include `/import`, `/bookmarks`, `/ai-search`, `/categorize`, `/categories`, `/mindmap`, `/settings`.
- OBSERVED: Local workflow APIs include `/api/import`, `/api/categorize`, `/api/bookmarks`, `/api/categories`, `/api/search/ai`, `/api/export`, `/api/stats`, `/api/analyze/images`.
- OUT_OF_SCOPE: `/api/import/live`, `/api/import/twitter`, `/api/import/x-oauth/*`, `/api/export/obsidian`, hosted deploy paths, and provider-auth internals.

## Data And Persistence Boundaries

- OBSERVED(Siftly/prisma/schema.prisma:10): `Bookmark.tweetId` is unique, making import idempotent at tweet level.
- OBSERVED(Siftly/prisma/schema.prisma:44): Many-to-many category membership stores confidence on `BookmarkCategory`.
- OBSERVED(Siftly/prisma/schema.prisma:54): Media belongs to bookmarks and stores type, URL, thumbnail, optional local path, and image tags.
- OBSERVED(Siftly/prisma/schema.prisma:79): Settings are key/value strings.
- INFERRED: The selected Buildprint should model storage generically so reversal can use in-memory persistence without claiming SQLite parity.

## State Machines And Lifecycles

### Import

1. pending import request.
2. create `ImportJob` with `processing`.
3. parse uploaded JSON.
4. on parse failure: update job to `error`, return 422.
5. on success: set total, insert new bookmarks/media, skip duplicates/errors.
6. update job to `done`, return counts.

### Categorization

1. idle.
2. POST starts if not running.
3. state becomes running with entity stage.
4. entity extraction, then parallel vision/enrichment/categorize.
5. DELETE requests transition running to stopping.
6. final state is done/idle or error/stopping depending runtime path.

### Search

1. reject invalid JSON or empty query.
2. check short-lived cache.
3. resolve provider/client or CLI.
4. choose candidates using FTS/LIKE and intent categories.
5. ask AI/CLI for scored JSON matches.
6. hydrate allowed IDs only.

### Export

1. require export type.
2. select CSV, JSON, or ZIP path.
3. fetch bookmarks/categories/media.
4. serialize artifact or return 400/500 on invalid type/failure.

## Existing Tests And Validation

- OBSERVED(Siftly/package.json:14): `npm run lint` is configured.
- OBSERVED(Siftly/package.json:15): `npm test` runs Vitest.
- OBSERVED(Siftly/__tests__/minimax-ai-client.test.ts): Existing tests focus on MiniMax auth/client integration behavior, not selected local bookmark workflow.
- INFERRED: Mapper reversal needs its own compact tests for parser/import/categorize/search/export contract behavior.

## Risk Zones

- OBSERVED(Siftly/app/import/page.tsx:65): Bookmarklet/console extraction depends on X page internals and live API response shape. OUT_OF_SCOPE for this proof.
- OBSERVED(Siftly/app/api/categorize/route.ts:112): API key can be submitted to categorization and stored in settings. THREAT_MODEL relevant.
- OBSERVED(Siftly/lib/exporter.ts:55): Category ZIP media export performs network fetches. OUT_OF_SCOPE for no-network reversal.
- OBSERVED(Siftly/app/api/bookmarks/route.ts:14): `DELETE /api/bookmarks` clears bookmarks, media, category links, and categories. Destructive action should be explicit in derived products.
- INFERRED: Global in-memory categorization state is per process, not durable across server restart.

## Unknowns

- QUESTION: Intended public Buildprint audience and naming are not in repo.
- QUESTION: Exact expected AI taxonomy quality is not verifiable without live providers.
- QUESTION: Browser visual parity for Siftly itself is not selected and not claimed.
- QUESTION: Export ZIP media completeness cannot be validated without network and live media URLs.
