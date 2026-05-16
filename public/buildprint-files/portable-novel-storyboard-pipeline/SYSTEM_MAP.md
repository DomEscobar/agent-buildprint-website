# System Map

Self-contained compact map for the selected Toonflow portable creative pipeline Buildprint.

## Scope

Selected scope: novel/story import -> chapter event extraction -> ScriptAgent skeleton/adaptation/scripts -> asset extraction -> ProductionAgent director plan/storyboard table/storyboard rows -> mockable image/video tasks -> portable preview manifest.

Non-goals: Electron shell, full infinite canvas, live provider parity, final stitched video parity, payment/business/admin flows.

## Components

1. **Project/Chapter Store**
   - Stores projects and ordered novel chapters.
   - Observed import route inserts `o_novel` rows with monotonic `chapterIndex` and `eventState: 0`.

2. **Event Extractor**
   - Runs per imported chapter through a text provider.
   - Writes event summary or failure reason back to the chapter.
   - Portable proof should expose pending/running/success/failure state mapping.

3. **ScriptAgent Service**
   - Staged LLM workflow: project initialization -> story skeleton -> adaptation strategy -> script writing.
   - Decision layer dispatches execution/supervision subagents; workspace reads happen through tools.
   - Stores `storySkeleton`, `adaptationStrategy`, and script records.

4. **Asset Service**
   - Extracts reusable role/scene/tool assets from scripts.
   - De-dupes by asset name inside a project.
   - Maintains script-to-asset links.

5. **ProductionAgent Service**
   - Uses FlowData: `script`, `scriptPlan`, `assets`, `storyboardTable`, `storyboard`.
   - Produces director plan, storyboard table, storyboard rows, and generation tasks.

6. **Storyboard/Track Store**
   - Persists storyboard rows with prompt, video description, duration, track, generation flag, and asset links.
   - Groups rows into video tracks by mode-specific track rules.

7. **Media Adapter Layer**
   - Text/image/video provider interfaces.
   - Default proof uses mocks only.
   - Live providers are optional implementations behind the same interface.

8. **Preview Manifest Exporter**
   - Produces portable preview manifest containing project, chapters, events, scripts, assets, storyboard rows, tracks, media records, and task log.
   - This replaces any claim of full stitched-video export parity.

## Data Relationships

- Project 1:N Chapter.
- Project 1:N Script.
- Script N:M Asset through script-asset links.
- Script 1:N StoryboardRow.
- StoryboardRow N:M Asset through storyboard-asset links.
- StoryboardRow N:1 VideoTrack by `trackId`.
- VideoTrack 1:N Video records.
- MediaTask references generated image/video records.

## Dependency Direction

`Project/Chapter Store -> Event Extractor -> ScriptAgent -> Script/Asset Store -> ProductionAgent -> Storyboard/Media Tasks -> Preview Manifest`

Adapters depend inward on provider interfaces. Workflow services should not depend on concrete provider SDKs.

## Evidence Pointer

Detailed evidence-backed discovery map lives one level up at `../SYSTEM_MAP.md` in this generated output directory. The selected package must remain usable even if only `project.buildprint/` is handed to a coding agent.
