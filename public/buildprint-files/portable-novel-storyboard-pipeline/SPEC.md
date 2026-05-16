# Spec

## User-Visible Behavior

1. A user creates/selects a project and imports ordered novel chapters.
2. The system marks chapters as event-pending and asynchronously extracts per-chapter events.
3. The user can ask ScriptAgent to produce story skeleton, adaptation strategy, and one or more scripts.
4. The system can extract role/scene/prop assets from scripts.
5. ProductionAgent can produce a director plan, storyboard table, and storyboard panel rows.
6. Asset/storyboard/video generation can be requested through adapters; Phase 1 proof uses mocks.
7. The user can preview generated/selected media refs and export a package.

## Must

- Preserve chapter order and project association.
- Track event states: pending, success, failure, and error reason.
- Store plan data separately from scripts.
- Treat storyboard table and panel as distinct artifacts.
- Preserve asset-to-script and asset-to-storyboard associations.
- Use adapter interfaces for text/image/video generation.
- Support cancellation/abort at agent chat level.
- Provide deterministic fixture tests with mock providers.

## Must Not

- Depend on Electron.
- Require live provider credentials for validation.
- Invent missing final stitching behavior.
- Persist secret values in Buildprint artifacts.

## Edge Cases

- Empty chapter import: reject or return explicit no-op error.
- Event extraction no chapters: observed route returns "没有对应章节" (`src/routes/novel/event/generateEvents.ts:24-26`).
- Provider failure: persist failure state and error reason.
- `shouldGenerateImage=false`: keep storyboard row but mark/not-generate image.
- Missing model/vendor config: fail with explicit configuration error.
- Invalid token: HTTP 401 or socket disconnect.

