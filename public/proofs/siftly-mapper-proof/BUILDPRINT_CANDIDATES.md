# Buildprint Candidates

## Candidate 1: Local Bookmark Knowledge Base Workflow

- Scope: import local X bookmark JSON, normalize and dedupe records, categorize through mocked AI contracts, search stored bookmarks, and export JSON/CSV/manifest artifacts.
- Included paths: `Siftly/lib/parser.ts`, `Siftly/app/api/import/route.ts`, `Siftly/prisma/schema.prisma`, `Siftly/lib/categorizer.ts`, `Siftly/app/api/categorize/route.ts`, `Siftly/app/api/bookmarks/route.ts`, `Siftly/app/api/search/ai/route.ts`, `Siftly/lib/fts.ts`, `Siftly/app/api/export/route.ts`, `Siftly/lib/exporter.ts`, `Siftly/app/import/page.tsx`, `Siftly/app/bookmarks/page.tsx`, `Siftly/app/ai-search/page.tsx`.
- Excluded paths: live X import/OAuth routes, Obsidian exporter, deployed hosting config, real provider auth paths, mindmap canvas, settings provider parity.
- Reusable value: compact AI-native personal-knowledge workflow with clear contracts for local ingestion, enrichment, classification, retrieval, and export.
- Main risks: parser shape drift, duplicate handling, AI JSON contract failures, search fallback behavior, export side effects.
- Evidence: OBSERVED(Siftly/README.md:123) local import tools; OBSERVED(Siftly/app/api/import/route.ts:42) parse-and-import route; OBSERVED(Siftly/lib/parser.ts:290) multiple import formats; OBSERVED(Siftly/lib/categorizer.ts:155) categorization contract; OBSERVED(Siftly/app/api/search/ai/route.ts:230) FTS/LIKE candidate selection; OBSERVED(Siftly/lib/exporter.ts:146) CSV export.
- Confidence: high for workflow and contracts; medium for AI quality semantics.
- Edge cases to preserve: empty/invalid JSON, missing file, duplicate tweetId, missing tweetId skip, malformed AI JSON, empty search query, no provider available, unknown export type, category not found for ZIP.
- QA/product proof strategy: clean-room in-memory model with fixtures, mocked categorizer/search reranker, tests for import/analyze/categorize/search/export; optional browser smoke with static UI using the clean-room model.
- Recommended fidelity target: workflow-proof + contract-parity + mocked-runtime-proof.
- Optional deeper parity targets: runtime-parity with SQLite/Next APIs; ui-workbench-parity for selected screens; export-media-parity for network media ZIP.
- Explicitly excluded parity targets: live X parity, provider parity, hosted deployment parity, account/session parity, Obsidian/export full parity, full clone parity.
- Evidence needed to upgrade depth: live provider traces with redacted secrets, Playwright journeys against original app, media export samples, deployment config, X OAuth fixtures.
- Decision needed before extraction: selected by simulated user decision.

## Candidate 2: AI Categorization Pipeline Contract

- Scope: entity extraction, vision/image tags, semantic tags, category prompt, batched category result writes, progress state.
- Included paths: `Siftly/lib/categorizer.ts`, `Siftly/app/api/categorize/route.ts`, `Siftly/lib/rawjson-extractor.ts`, `Siftly/lib/vision-analyzer.ts`, `Siftly/lib/image-context.ts`.
- Excluded paths: import UI, browse UI, export, live provider authentication.
- Reusable value: reusable AI enrichment pipeline architecture.
- Main risks: provider-specific behavior, prompt quality, async cancellation, partial failures.
- Evidence: OBSERVED(Siftly/app/api/categorize/route.ts:21) state model; OBSERVED(Siftly/app/api/categorize/route.ts:171) staged pipeline; OBSERVED(Siftly/lib/categorizer.ts:211) JSON response parser.
- Confidence: medium; provider quality is unvalidated.
- Recommended fidelity target: contract-parity + mocked-runtime-proof.
- Explicitly excluded targets: provider parity, full clone parity, UI parity.

## Candidate 3: Search And Browse Retrieval Layer

- Scope: filtered bookmark retrieval, category/media/source filters, FTS candidate search, AI reranking response contract.
- Included paths: `Siftly/app/api/bookmarks/route.ts`, `Siftly/app/api/search/ai/route.ts`, `Siftly/lib/fts.ts`, `Siftly/app/bookmarks/page.tsx`, `Siftly/app/ai-search/page.tsx`.
- Excluded paths: import pipeline, categorization writes, live provider parity, mindmap.
- Reusable value: hybrid lexical + semantic search layer for local content.
- Main risks: FTS syntax, cache staleness, AI JSON parse failure, category intent heuristics.
- Evidence: OBSERVED(Siftly/app/api/bookmarks/route.ts:36) filters; OBSERVED(Siftly/app/api/search/ai/route.ts:215) candidate selection; OBSERVED(Siftly/app/api/search/ai/route.ts:344) AI response shape.
- Confidence: high for filter contracts, medium for semantic quality.
- Recommended fidelity target: workflow-proof + contract-parity.
- Explicitly excluded targets: provider parity, full UI/workbench parity.

## Candidate 4: Local Export And Portability Layer

- Scope: JSON/CSV/ZIP export shapes, category manifest generation, media URL handling.
- Included paths: `Siftly/app/api/export/route.ts`, `Siftly/lib/exporter.ts`, `Siftly/app/api/export/obsidian/route.ts`, `Siftly/lib/obsidian-exporter.ts`.
- Excluded paths: import, categorization, search, live media download parity unless selected.
- Reusable value: data portability patterns for local-first apps.
- Main risks: network media fetches, vault path validation, CSV compatibility.
- Evidence: OBSERVED(Siftly/app/api/export/route.ts:16) CSV route; OBSERVED(Siftly/app/api/export/route.ts:35) JSON route; OBSERVED(Siftly/lib/exporter.ts:89) category ZIP route.
- Confidence: medium.
- Recommended fidelity target: contract-parity.
- Explicitly excluded targets: Obsidian/export full parity unless upgraded; export-media-parity.

## Recommended Selection

Select Candidate 1 because it is the best compact AI-native webapp candidate and matches the simulated decision: local bookmark import/analyze/categorize/search/export workflow without live X scraping.
