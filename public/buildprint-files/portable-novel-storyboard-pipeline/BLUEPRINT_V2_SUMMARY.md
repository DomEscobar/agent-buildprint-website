# Blueprint V2 Summary

## What Changed

V1 was a deterministic service buildprint. V2 upgrades it into a credible webapp implementation blueprint while keeping the same clean-room boundary.

Added:

- Webapp target architecture, routes, pages, components, and state flows.
- UI/canvas/workbench map with confidence levels instead of UI parity claims.
- Compressed agent prompt pack for ScriptAgent and ProductionAgent.
- XML output contract, repair loop, and validation gates.
- Async job/task model with cancellation, retry, idempotency, and persistence.
- Provider adapter interfaces with mock default and optional live adapter rules.
- Preview composition spec for browser preview and manifest export.
- Browser QA scenarios and phased implementation roadmap.
- Explicit safe/unsafe parity claims.

## Now Achievable

A coding agent can build a browser webapp that:

- Imports ordered chapters and extracts event summaries through mock text providers.
- Guides ScriptAgent stages: initialization, story skeleton, adaptation strategy, scripts.
- Extracts/de-dupes assets and preserves script links.
- Runs ProductionAgent stages: asset derivation, director plan, storyboard table, storyboard rows.
- Parses XML-like agent outputs into validated durable state.
- Shows a workbench with chapter/script/asset/storyboard/track/task panels.
- Generates mock image/video tasks with no network in default tests.
- Exports a portable preview manifest and renders a browser preview from it.

## Remaining Non-Parity Boundaries

Do not claim:

- Electron shell parity.
- Infinite canvas parity.
- Live provider output quality parity.
- Final stitched video export parity.
- Full Toonflow route coverage.
- Source UI parity from bundled minified frontend.

## Evidence Summary

- Toonflow describes infinite canvas, three-layer agents, provider programmability, event-driven adaptation, and editable Markdown skills in `docs/README.en.md:108-123`.
- Quick start flow lists project/vendor setup, novel import, event extraction, ScriptAgent, ProductionAgent, canvas organization, storyboard refinement, and video stitching/export in `docs/README.en.md:141-146`.
- Backend routes include novel, production, storyboard, workbench, script, provider, task, and socket APIs in `src/router.ts:41-119` and `src/router.ts:224-260`.
- Socket namespaces exist for ScriptAgent and ProductionAgent in `src/socket/index.ts:5-15`.
- V2 preview/export remains a portable substitute. Source only gives workbench video list/script export evidence, not final stitching internals.

## Implementation Posture

Build the smallest honest webapp that exercises the workflow. Treat source evidence as behavioral inspiration, not code to copy. Mark uncertain UI details `INFERRED`.
