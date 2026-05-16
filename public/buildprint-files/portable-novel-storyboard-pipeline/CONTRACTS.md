# Contracts

## ImportChapterInput

```ts
type ImportChapterInput = {
  projectId: number | string;
  chapters: { reel: string; chapter: string; chapterData: string }[];
};
```

Output: inserted chapter records with monotonic `chapterIndex` and portable `eventState="pending"`.

Observed Toonflow request body uses `data`, not `chapters`:

```ts
type ObservedAddNovelBody = {
  projectId: number;
  data: { index: number; reel: string; chapter: string; chapterData: string }[];
};
```

Portable rebuild may rename `data` to `chapters`, but tests must preserve ordered insertion semantics.

## State Mapping

| Area | Observed Toonflow state | Portable state |
|---|---|---|
| Novel event | `eventState: 0` | `pending` / `running` |
| Novel event | `eventState: 1` | `success` |
| Novel event | `eventState: -1` | `failure` with `errorReason` |
| Script asset extraction | `extractState: 2` | `queued` |
| Script asset extraction | `extractState: 0` | `running` |
| Script asset extraction | `extractState: 1` | `success` |
| Script asset extraction | `extractState: -1` | `failure` with `errorReason` |
| Video generation | `生成中` | `running` |
| Video generation | `生成成功` | `success` |
| Video generation | `生成失败` | `failure` with `errorReason` |

## EventExtractor

```ts
interface TextProvider {
  generate(input: { system: string; messages: { role: string; content: string }[] }): Promise<{ text: string }>;
}
```

Invariant: one input chapter yields one event summary or one failure record.

## ScriptAgent Workspace

```ts
type ScriptPlanData = {
  storySkeleton: string;
  adaptationStrategy: string;
  scripts: { id?: string | number; name: string; content: string }[];
};
```

ScriptAgent tools must read events, chapter text, plan data, and previous scripts. Agent output can be mocked as structured XML or parsed JSON.

## Production FlowData

```ts
type FlowData = {
  script: string;
  scriptPlan: string;
  assets: Asset[];
  storyboardTable: string;
  storyboard: StoryboardItem[];
};
```

Observed source schema: `src/agents/productionAgent/tools.ts:45-51`.

## Media Adapter

```ts
interface ImageProvider {
  run(input: { prompt: string; referenceList?: MediaRef[]; size: string; aspectRatio: string }): Promise<MediaBlob>;
}
interface VideoProvider {
  run(input: { prompt: string; referenceList?: MediaRef[]; mode: unknown; duration: number; resolution: string; audio?: boolean }): Promise<MediaBlob>;
}
```

Side effects: provider calls create task records and later update media state.

## StoryboardPanelRow

```ts
type StoryboardPanelRow = {
  id?: string | number;
  videoDesc: string;
  prompt: string;
  track: string | number;
  duration: number;
  associateAssetsIds: Array<string | number>;
  shouldGenerateImage: boolean;
};
```

Observed route validates `shouldGenerateImage` as `z.number()`, while the skill emits XML values `true`/`false`. Portable contract should use boolean and map to storage/API representation at adapter boundaries.

## PortablePreviewManifest

```ts
type PortablePreviewManifest = {
  project: ProjectSummary;
  chapters: Chapter[];
  events: EventSummary[];
  scripts: Script[];
  assets: Asset[];
  storyboardTable: string;
  storyboard: StoryboardPanelRow[];
  tracks: VideoTrack[];
  media: MediaRecord[];
  taskLog: TaskRecord[];
};
```

INFERRED: This is the portable substitute for Toonflow preview/export behavior. Do not claim final stitched-video parity.

