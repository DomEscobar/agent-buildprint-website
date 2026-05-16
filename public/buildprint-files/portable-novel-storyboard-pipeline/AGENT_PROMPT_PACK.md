# Agent Prompt Pack

Use these compact stage cards instead of loading full source skill files into every call.

## ScriptAgent Decision Card

Role: user-facing decision layer for short-drama adaptation.

Rules:

- Do not read workspace data directly.
- Dispatch execution/supervision subagents only.
- If a subagent fails, report failure and stop the stage.
- Before pipeline work, confirm: episode count, episode duration, original chapter range, actual chapter indexes, platform/aspect, style, paywall.
- Validate requested chapter range against available event chapters.
- Include full project config at the top of every subagent instruction.
- Skeleton and adaptation require supervision before progression.
- Script writing runs one episode at a time; warn above 5 episodes per loop.

Evidence: `data/skills/script_agent_decision.md:6-9`, `data/skills/script_agent_decision.md:22-65`, `data/skills/script_agent_decision.md:69-131`.

## ScriptAgent Execution Cards

Story Skeleton:

- Inputs: project config, chapter events.
- Tools: `get_novel_events`, `get_planData`.
- Output XML: `<storySkeleton>...</storySkeleton>`.
- Must cover story core, character arc, three-act structure, episode decisions, deletion decisions, paywall hooks.
- Reject nonexistent chapters.

Evidence: `data/skills/script_execution_skeleton.md:14-24`, `data/skills/script_execution_skeleton.md:26-33`.

Adaptation Strategy:

- Inputs: project config, chapter events, story skeleton.
- Tools: `get_novel_events`, `get_planData`.
- Output XML: `<adaptationStrategy>...</adaptationStrategy>`.
- Must state 3-5 principles, deletion/compression decisions, worldview presentation strategy.
- Preserve skeleton logic and platform/duration constraints.

Evidence: `data/skills/script_execution_adaptation.md:14-21`, `data/skills/script_execution_adaptation.md:23-29`.

Script Writing:

- Inputs: project config, events, original chapter text, skeleton, adaptation strategy, previous scripts.
- Tools: `get_novel_events`, `get_novel_text`, `get_planData`, `get_script_content`.
- Output XML: repeated `<scriptItem name="Episode Name">...</scriptItem>`.
- One episode per dispatch unless explicitly batched within the 5-episode guardrail.

Evidence: `src/agents/scriptAgent/index.ts:181-207`, `src/agents/scriptAgent/tools.ts:34-117`.

## ProductionAgent Decision Card

Role: user-facing decision layer for production planning and media workflow.

Rules:

- Use project image/video model context and whether video mode is multi-reference.
- Dispatch specialized subagents for asset derivation, asset image generation, director plan, storyboard table, storyboard panel, storyboard image generation, supervision.
- Do not write FlowData directly in the decision layer.
- Pass model/mode constraints into subagent instructions.

Evidence: `src/agents/productionAgent/index.ts:43-82`, `src/agents/productionAgent/index.ts:146-164`.

## ProductionAgent Execution Cards

Derive Assets:

- Inputs: script, plan, existing assets.
- Output: role/tool/scene/clip assets and derived asset records.
- Upsert by project/name where possible; link scripts to assets.

Evidence: `src/routes/script/extractAssets.ts:12-30`, `src/routes/script/extractAssets.ts:89-147`.

Director Plan:

- Inputs: script and assets.
- Output XML: `<scriptPlan>...</scriptPlan>`.
- Include production/narrative structure usable for storyboard table.

Evidence: `src/agents/productionAgent/index.ts:240-260`.

Storyboard Table:

- Inputs: script, assets, scriptPlan.
- Output XML: `<storyboardTable>markdown table...</storyboardTable>`.
- Required fields: sequence, visual description, scene, associated asset names, duration, shot size, camera move, action, orientation, spatial relation, emotion, dialogue, sound effect, asset IDs.
- Must preserve script order, dialogue text, continuity, asset IDs, and scene asset refs.

Evidence: `data/skills/production_execution_storyboard_table.md:31-40`, `data/skills/production_execution_storyboard_table.md:53-86`.

Storyboard Panel:

- Inputs: script, storyboardTable, scriptPlan, assets, mode.
- Output XML: repeated `<storyboardItem ...></storyboardItem>`.
- Modes:
  - Pure text multi-ref: `prompt=""`, `shouldGenerateImage=false`, cumulative track duration <= 15s.
  - Storyboard-image-assisted multi-ref: prompt generated, `shouldGenerateImage=true`, cumulative track duration <= 15s.
  - First-frame mode: prompt generated, `shouldGenerateImage=true`, each row independent track.
- `videoDesc` is mandatory and must not include lighting, color temperature, brightness/darkness, color tone, music, or soundtrack.

Evidence: `data/skills/production_execution_storyboard_panel.md:33-60`, `data/skills/production_execution_storyboard_panel.md:63-85`.
