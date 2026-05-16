# Observability

## Required Events

- chapter_imported
- event_extraction_started/succeeded/failed
- script_agent_stage_started/succeeded/failed
- asset_extraction_started/succeeded/failed
- storyboard_panel_saved
- media_generation_started/succeeded/failed
- export_package_created

## Required Fields

`projectId`, `chapterId`, `scriptId`, `storyboardId`, `trackId`, `providerKey`, `taskClass`, `state`, `errorReason`, `durationMs`.

OBSERVED: Toonflow records task class/model/state/reason in `o_tasks` and wraps provider calls with task records (`src/lib/initDB.ts:318-334`; `src/utils/ai.ts:142-160`).

