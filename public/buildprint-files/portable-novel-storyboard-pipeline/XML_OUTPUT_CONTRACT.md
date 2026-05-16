# XML Output Contract

## Accepted Agent XML

ScriptAgent:

```xml
<storySkeleton>markdown or plain text</storySkeleton>
<adaptationStrategy>markdown or plain text</adaptationStrategy>
<scriptItem name="Episode 1">script text</scriptItem>
```

ProductionAgent:

```xml
<scriptPlan>markdown or plain text</scriptPlan>
<storyboardTable>markdown table</storyboardTable>
<storyboardItem videoDesc="..." prompt="..." track="1" duration="4" associateAssetsIds="[101,300]" shouldGenerateImage="true"></storyboardItem>
```

## Parser Rules

- Parse one complete batch at a time.
- Reject partial tags, nested unexpected root tags, missing closing tags, and duplicate singleton tags.
- Trim wrapper Markdown fences before XML parse.
- Decode entities and normalize smart quotes before validation.
- For `scriptItem`, require non-empty `name` and content.
- For `storyboardItem`, require attributes: `videoDesc`, `prompt`, `track`, `duration`, `associateAssetsIds`, `shouldGenerateImage`.
- Parse `duration` as positive number.
- Parse `associateAssetsIds` as JSON array of known asset IDs.
- Parse `shouldGenerateImage` as boolean. Accept source-style strings `"true"`/`"false"` and storage-style `1`/`0` only at adapter boundaries.

## Validation Gates

Story skeleton:

- Non-empty.
- References only available chapter indexes.
- Stores exactly one `storySkeleton`.

Adaptation strategy:

- Non-empty.
- Requires existing `storySkeleton`.
- Stores exactly one `adaptationStrategy`.

Scripts:

- Requires existing skeleton and adaptation strategy.
- One or more `scriptItem`.
- Names unique inside project unless explicitly updating.

Storyboard table:

- Requires `scriptPlan` and assets.
- Must include required columns.
- Data row count must be stable after parse.

Storyboard rows:

- Row count equals storyboard table data row count.
- Each duration equals corresponding table row duration.
- Each referenced asset exists.
- Pure text mode requires `prompt=""` and `shouldGenerateImage=false`.
- Image-assisted and first-frame modes require non-empty prompt and `shouldGenerateImage=true`.
- Track rule matches selected mode.
- No partial persistence on validation failure.

## Repair Loop

On parse/validation failure:

1. Persist a failed task record with raw output hash and reason.
2. Do not mutate prior good state.
3. Return a compact repair prompt containing:
   - validation errors,
   - expected XML shape,
   - offending row/tag identifiers,
   - required mode.
4. Allow one automatic repair attempt in tests; further retries require user action.

## Evidence

- Source prompts require XML for skeleton, adaptation, script items: `src/agents/scriptAgent/index.ts:141-207`.
- Source prompts require XML for `scriptPlan`, `storyboardTable`, `storyboardItem`: `src/agents/productionAgent/index.ts:240-260`, `data/skills/production_execution_storyboard_panel.md:57-66`.
- Source route stores storyboard fields and uses numeric `shouldGenerateImage`: `src/routes/production/storyboard/batchAddStoryboardInfo.ts:10-24`.

## Clean-Room Difference

V2 validates XML before persistence. Source routes often accept already-shaped JSON route bodies; the XML parse boundary is introduced for a robust webapp agent implementation.
