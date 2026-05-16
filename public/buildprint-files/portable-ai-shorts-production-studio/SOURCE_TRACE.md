# Source Trace

## Repository and Product

- README product summary: `README.md:10`
- Three tools: `README.md:23-49`
- AI Shorts claims in README: `README.md:30-40`, `README.md:73-82`
- UGC gallery claims in README: `README.md:51-59`

## Backend

- FastAPI initialization and static serving: `app.py:170-187`
- Job queue and cleanup: `app.py:35-42`, `app.py:84-160`
- Clip Generator process endpoint: `app.py:316-405`
- Clip Generator status endpoint: `app.py:407-417`
- Remotion proxy: `app.py:615-639`
- Social post adapter for clips: `app.py:1044-1138`
- Thumbnail/YouTube Studio endpoints: `app.py:1200-1607`
- SaaSShorts imports/state: `app.py:1646-1658`
- SaaSShorts analyze route: `app.py:1670-1717`
- Actor upload/options/gallery routes: `app.py:1726-1809`, `app.py:2049-2057`
- SaaSShorts social post route: `app.py:1812-1893`
- SEO gallery/video pages: `app.py:1896-2046`
- SaaSShorts generate/status routes: `app.py:2060-2230`

## SaaSShorts Pipeline

- Pipeline docstring: `saasshorts.py:1-13`
- Gemini research with Google Search grounding: `saasshorts.py:47-147`
- Website scraping: `saasshorts.py:150-236`
- Product analysis: `saasshorts.py:239-365`
- Script generation: `saasshorts.py:368-546`
- fal.ai queue adapter: `saasshorts.py:553-624`
- fal.ai file upload adapter: `saasshorts.py:627-670`
- Actor image generation: `saasshorts.py:673-754`
- ElevenLabs TTS and voice list: `saasshorts.py:757-817`
- Kling talking head: `saasshorts.py:824-862`
- Hailuo + VEED low-cost talking head: `saasshorts.py:865-945`
- B-roll and Ken Burns FFmpeg: `saasshorts.py:948-1015`
- Subtitles and transcription: `saasshorts.py:1049-1123`
- FFmpeg composite: `saasshorts.py:1153-1283`
- Full orchestrator: `saasshorts.py:1290-1474`

## Clip Generator

- Dependencies and model imports: `main.py:1-20`
- Gemini viral clip prompt contract: `main.py:31-68`
- Face/person tracking primitives: `main.py:70-77`, `main.py:78-163`, `main.py:279-335`

## Frontend

- App composition/imports: `dashboard/src/App.jsx:1-12`
- Key storage and encryption helper: `dashboard/src/App.jsx:14-50`
- App state/key state: `dashboard/src/App.jsx:136-170`
- Session recovery: `dashboard/src/App.jsx:187-231`
- Media input acknowledgement: `dashboard/src/components/MediaInput.jsx:5-31`, `dashboard/src/components/MediaInput.jsx:116-131`
- SaaSShorts state and polling: `dashboard/src/components/SaaShortsTab.jsx:37-90`, `dashboard/src/components/SaaShortsTab.jsx:136-171`
- SaaSShorts analyze/generate client calls: `dashboard/src/components/SaaShortsTab.jsx:187-306`
- AI Shorts setup UI: `dashboard/src/components/SaaShortsTab.jsx:427-623`
- Analysis/script UI: `dashboard/src/components/SaaShortsTab.jsx:625-848`
- Voice/actor/narration/generation UI: `dashboard/src/components/SaaShortsTab.jsx:850-1188`
- Result/publish UI: `dashboard/src/components/SaaShortsTab.jsx:1299-1508`
- UGC gallery UI: `dashboard/src/components/UGCGallery.jsx:12-24`, `dashboard/src/components/UGCGallery.jsx:41-57`, `dashboard/src/components/UGCGallery.jsx:147-236`

## Rendering and Deployment

- Render service schema/server: `render-service/src/server.ts:24-39`, `render-service/src/server.ts:57-121`
- Render worker: `render-service/src/render-worker.ts:44-89`
- Remotion composition layers: `remotion/src/compositions/ShortVideo.tsx:13-31`
- Docker Compose services: `docker-compose.yml:1-40`

## Storage

- S3 credential gating and upload: `s3_uploader.py:16-41`, `s3_uploader.py:55-86`
- S3 clip listing: `s3_uploader.py:87-191`
- Actor public upload/gallery: `s3_uploader.py:193-300`

