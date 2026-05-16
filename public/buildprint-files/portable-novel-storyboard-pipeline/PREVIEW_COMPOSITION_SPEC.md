# Preview Composition Spec

## Goal

Render a browser preview from portable state. This is a substitute for final stitched video export, not parity with Toonflow's video compositor.

## Manifest

```ts
type PreviewManifest = {
  version: "toonflow-blueprint-v2";
  generatedAt: string;
  project: ProjectSummary;
  chapters: Chapter[];
  events: EventSummary[];
  planData: {
    storySkeleton?: string;
    adaptationStrategy?: string;
  };
  scripts: Script[];
  assets: Asset[];
  storyboardTable: string;
  storyboardRows: StoryboardPanelRow[];
  tracks: PreviewTrack[];
  media: MediaRecord[];
  taskLog: JobRecord[];
  limitations: string[];
};
```

## Track Composition

```ts
type PreviewTrack = {
  id: string;
  label: string;
  duration: number;
  rowIds: string[];
  selectedVideoId?: string;
  videos: string[];
};
```

Rules:

- Group storyboard rows by `track`.
- Track duration is sum of row durations.
- Preserve row order from storyboard table.
- For multi-ref modes, cumulative track duration should be <= 15s.
- For first-frame mode, each row is its own track.
- Video records attach to track IDs, not directly to the final movie.

Evidence: track grouping and duration update in `src/routes/production/storyboard/batchAddStoryboardInfo.ts:52-91`; video records attach to `videoTrackId` in `src/routes/production/workbench/generateVideo.ts:78-85`.

## Browser Preview

Preview UI:

- Timeline lanes from `tracks`.
- Clip cells from storyboard rows.
- Selected preview panel shows best available media:
  - selected video if success,
  - storyboard image if success,
  - asset refs/placeholders if no media.
- Details panel shows videoDesc, prompt, assets, duration, state.

## Export Boundary

Safe export:

- JSON manifest.
- Optional zip containing manifest and local mock/media files.
- Deterministic snapshot for tests.

Unsafe export claim:

- Final stitched MP4.
- Audio/video synchronization.
- Transition/render parity.
- Original workbench export behavior.

Evidence: source docs mention returning to workbench for stitching/export in `docs/README.en.md:145-146`, but no buildprint evidence proves compositor internals. Keep v2 to manifest/preview.
