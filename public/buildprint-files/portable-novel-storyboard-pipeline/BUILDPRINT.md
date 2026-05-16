# Buildprint

## Purpose

Build a portable creative AI pipeline that transforms imported novel chapters into structured event context, scripted episodes, storyboard tables/panels, generated-media tasks through mockable adapters, and an exportable preview package.

## Architecture

- Import module stores ordered chapter fixtures.
- Event extraction module converts each chapter to an event summary with pending/success/failure state.
- ScriptAgent module orchestrates story skeleton, adaptation strategy, and episode scripts using tool calls into event/text/workspace state.
- Asset module extracts reusable role/scene/prop assets from scripts.
- ProductionAgent module creates director plan, storyboard table, storyboard panel rows, and optional generated storyboard images.
- Adapter module defines text/image/video provider contracts with mock and live implementations.
- Preview/export module packages scripts, storyboard table, panel rows, media refs, tracks, selected video refs, and task log.

## Evidence Boundary

OBSERVED: Toonflow implements these modules through Express routes, Socket.IO agent namespaces, SQLite tables, Markdown Skills, and TypeScript vendor adapters. Key evidence is listed in `TRACEABILITY_MATRIX.md`.

INFERRED: The clean-room rebuild may use any stack as long as contracts and lifecycle states are preserved.

## Non-Goals

- No full Electron or desktop UI clone.
- No infinite-canvas parity.
- No provider parity or live media generation requirement.
- No claim that exported package equals Toonflow final stitched video.

## Required Validation

Use fixture chapters and mock providers. Validate state transitions, schema contracts, generated package contents, and failure handling. Live providers are optional adapter tests only.

