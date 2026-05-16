# LLM Flow

This file preserves the attention-critical agent behavior from Toonflow's Markdown skills in compact rebuild form.

## ScriptAgent Flow

Source pattern: decision layer -> execution subagents -> optional supervision -> persisted plan/scripts.

### Roles

- **Decision layer**: talks to user, determines stage, dispatches subagents, reports failures.
- **Execution layer**: reads workspace data and writes artifacts.
- **Supervision layer**: audits stage outputs before progression.

### Critical Constraints

- Decision layer must not directly read workspace data; execution/supervision tools read events, text, and plan data.
- If a subagent fails, decision layer reports failure and stops. It must not improvise the missing artifact itself.
- Project initialization must ask/confirm: episode count, episode duration, original chapter range, actual chapter indexes, platform/aspect, style, paywall strategy.
- Missing initialization fields should be asked explicitly, not silently defaulted.
- Validate chapter range against available chapter events before continuing.

### Stages

1. **Project initialization**
   - Confirm config.
   - Persist/use config in every later subagent instruction.
2. **Story skeleton**
   - Inputs: chapter event table.
   - Output: `storySkeleton`.
   - Requires supervision before next stage.
3. **Adaptation strategy**
   - Inputs: events + `storySkeleton`.
   - Output: `adaptationStrategy`.
   - Requires supervision before script writing.
4. **Script writing**
   - Inputs: events + original text + skeleton + adaptation strategy + previous scripts.
   - Output: one or more script records.
   - Process episodes one at a time. Source warns that more than 5 episodes per loop can overload context.

## ProductionAgent Flow

Source pattern: decision layer dispatches specialized production subagents over workspace `FlowData`.

### FlowData Keys

- `script`: script content.
- `scriptPlan`: director/production plan.
- `assets`: role/scene/tool/clip assets with derived images.
- `storyboardTable`: table representation of planned shots.
- `storyboard`: storyboard panel rows.

### Production Stages

1. Derive assets from script/plan.
2. Generate or attach asset images through adapter.
3. Build director plan.
4. Build storyboard table.
5. Write storyboard panel rows.
6. Optionally generate storyboard images.
7. Generate video prompt and mock video task.

## Storyboard Panel Contract

The storyboard panel step is the highest-risk LLM output. Preserve these constraints:

### Modes

| Mode | Prompt | shouldGenerateImage | Track rule |
|---|---|---|---|
| Pure text multiparameter | empty string | false | group rows so cumulative duration <= 15s |
| Storyboard-image-assisted multiparameter | generated prompt | true | group rows so cumulative duration <= 15s |
| First-frame mode | generated prompt | true | each row has independent incrementing track |

### Required Row Fields

- `videoDesc` — mandatory for every row.
- `prompt` — empty only in pure text mode.
- `track` — follows selected mode.
- `duration` — exactly matches storyboard table row duration.
- `associateAssetsIds` — asset IDs referenced by the shot.
- `shouldGenerateImage` — mode-dependent boolean in portable contract.

### Prompt Invariants

- Row count must equal storyboard table data-row count.
- Durations must exactly match corresponding table rows.
- Preserve visual subjects, scene, shot size, character action, orientation, spatial relation, emotion, dialogue, sound effects, and asset IDs.
- Do not add visual elements not present in the storyboard table.
- Do not include lighting direction, color temperature, brightness/darkness, color tone, music, or soundtrack in `videoDesc` or `prompt`.
- For image-assisted modes, bind references explicitly: e.g. `@image1 is role X`, then use `@image1` in the prompt body instead of the raw character name.
- XML/source-style output must be parseable as one complete batch. In the clean-room proof, JSON rows are acceptable if they preserve the same fields and constraints.

## Context/Token Guidance

- Do not feed full skill files into every agent call. Convert them into stage cards like this file.
- Keep per-stage prompts small: current config + relevant events/scripts + one stage card + expected schema.
- Process long scripts and episodes incrementally.
- Store intermediate artifacts; do not rely on conversation memory for workflow state.
