# UI Canvas Map

## Confidence Legend

- High: backend/source docs directly support the concept.
- Medium: source docs support the workflow, but UI layout is inferred.
- Low: inferred from bundled/minified frontend or screenshots only; do not claim parity.

## Mapping

| Toonflow Concept | Webapp Surface | Confidence | Evidence |
|---|---|---:|---|
| Infinite canvas production workbench | `ProductionAgent Workspace` with AssetBoard, StoryboardRowsPanel, TrackWorkbench | Medium | `docs/README.en.md:112-113`, route groups in `src/router.ts:224-260` |
| ScriptAgent chat | ScriptAgent ChatPanel with streaming messages and stop | High | `src/socket/routes/scriptAgent.ts:48-89` |
| ProductionAgent chat | ProductionAgent ChatPanel with context update and stop | High | `src/socket/routes/productionAgent.ts:49-99` |
| Project/chapter import | Project Dashboard ChapterImporter | High | `src/routes/novel/addNovel.ts:23-50` |
| Event extraction status | EventQueuePanel | High | `src/utils/cleanNovel.ts:27-59` |
| Plan/workspace data | StageTabs + PlanEditor | High | `src/agents/scriptAgent/tools.ts:59-77` |
| Production FlowData | FlowDataInspector | High | `src/agents/productionAgent/tools.ts:45-87` |
| Asset derivation | AssetBoard | High | `src/agents/productionAgent/tools.ts:89-135` |
| Storyboard panel | StoryboardRowsPanel | High | `src/routes/production/storyboard/batchAddStoryboardInfo.ts:10-24` |
| Tracks | TrackWorkbench lanes | High | `src/routes/production/storyboard/batchAddStoryboardInfo.ts:52-91` |
| Video node/result | Track row video records | High | `src/routes/production/workbench/generateVideo.ts:78-122` |
| Final export button | Preview manifest export only | Low | Source docs mention stitching/export in `docs/README.en.md:145-146`, but internals are not evidenced |

## Browser Layout

Use a dense, workbench-oriented layout:

- Left sidebar: project navigation, chapter/script list.
- Center: active stage workspace or track timeline.
- Right inspector: selected entity details and validation errors.
- Bottom or collapsible drawer: task log and manifest.

INFERRED: This layout preserves the workbench idea without pretending to match Toonflow's original canvas UI.

## Canvas Boundary

The webapp may implement drag/reorder in later phases, but v2 acceptance only requires:

- Stable grouped track lanes.
- Selectable storyboard rows.
- Asset references visible on rows.
- Mock media state visible per row/track.
- No overlap or unreadable text at desktop/mobile widths.

Do not implement freeform infinite pan/zoom unless a later task explicitly asks for it.
