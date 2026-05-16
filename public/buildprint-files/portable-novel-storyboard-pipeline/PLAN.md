# Plan

1. Define portable schemas for Project, Chapter, EventSummary, ScriptPlan, Script, Asset, StoryboardRow, MediaTask, VideoTrack, ExportPackage.
2. Implement in-memory or SQLite repository interfaces and fixture loader.
3. Implement mock text provider for event extraction and agent outputs.
4. Implement workflow services for import, event extraction, script planning, asset extraction, storyboard creation, media generation requests, and export package creation.
5. Add adapter interfaces for live text/image/video providers but keep proof default mocked.
6. Add API or CLI façade around the services.
7. Add tests covering happy path, invalid input, provider failure, retry, cancellation, and export package snapshot.
8. Optional: add a minimal browser UI only after service contracts pass.

