# Modules

| Module | Responsibilities | Evidence | Confidence |
|---|---|---|---|
| Import/Event | Chapter import, event extraction, event state polling | `src/routes/novel/addNovel.ts:11-52`, `src/utils/cleanNovel.ts:27-89` | high |
| ScriptAgent | Decision layer, subagents, tools, plan/script workspace | `src/agents/scriptAgent/index.ts:41-225`, `src/agents/scriptAgent/tools.ts:34-117` | high |
| Skill Library | Markdown behavior rules for agents and production style | `data/skills/script_agent_decision.md:69-89`, `data/skills/production_execution_storyboard_panel.md:41-73` | high |
| ProductionAgent | Director plan, storyboard table, panel, generation tools | `src/agents/productionAgent/index.ts:196-374` | high |
| Asset Store | Script assets, derived assets, image refs | `src/routes/script/extractAssets.ts:56-149`, `src/routes/production/assets/batchGenerateAssetsImage.ts:54-132` | high |
| Provider Adapter | Dynamic text/image/video providers and task recording | `src/utils/ai.ts:113-321`, `src/utils/vendor.ts:22-41` | high |
| Preview/Export | Video list, track selection, file URL resolution, script zip | `src/routes/production/workbench/getVideoList.ts:15-30`, `src/routes/script/exportScript.ts:15-25` | medium |

