# System Map

## User-Facing Surfaces

- React dashboard: manages API keys, job state, tabs, session recovery, and local storage. Evidence: `dashboard/src/App.jsx:136-170`, `dashboard/src/App.jsx:187-231`, `dashboard/src/App.jsx:239-258`.
- Clip Generator UI: offers URL/file input and requires a rights acknowledgement before processing. Evidence: `dashboard/src/components/MediaInput.jsx:5-31`, `dashboard/src/components/MediaInput.jsx:116-131`.
- AI Shorts wizard: setup, analysis, configuration, generation, and result steps. Evidence: `dashboard/src/components/SaaShortsTab.jsx:379-427`, `dashboard/src/components/SaaShortsTab.jsx:625-848`, `dashboard/src/components/SaaShortsTab.jsx:850-1188`, `dashboard/src/components/SaaShortsTab.jsx:1299-1508`.
- UGC Gallery UI: fetches public videos and actor images, renders cards, and links to SEO pages. Evidence: `dashboard/src/components/UGCGallery.jsx:12-24`, `dashboard/src/components/UGCGallery.jsx:41-57`, `dashboard/src/components/UGCGallery.jsx:147-236`.

## Backend Services

- FastAPI job worker: in-memory queues, status maps, concurrency semaphore, cleanup task. Evidence: `app.py:35-42`, `app.py:84-160`, `app.py:162-170`.
- Clip Generator API: `/api/process` builds a `main.py` subprocess command and stores attestation context; `/api/status/{job_id}` returns status/logs/result. Evidence: `app.py:316-405`, `app.py:407-417`.
- AI Shorts API: `/api/saasshorts/analyze`, `/actor-upload`, `/actor-options`, `/generate`, `/status`, `/gallery`, `/actor-gallery`, and `/post`. Evidence: `app.py:1670-1717`, `app.py:1726-1798`, `app.py:1801-1809`, `app.py:1823-1893`, `app.py:2049-2057`, `app.py:2069-2230`.
- Social publishing adapter: Upload-Post multipart upload for generated clips and AI Shorts, with TikTok/Instagram/YouTube-specific fields and optional scheduling. Evidence: `app.py:1044-1138`, `app.py:1812-1887`.
- Public gallery/SEO pages: FastAPI returns `/gallery` collection page and `/video/{video_id}` pages with JSON-LD and Open Graph metadata. Evidence: `app.py:1896-1964`, `app.py:1967-2046`.

## Media/AI Pipelines

- Clip Generator: `main.py` uses yt-dlp, faster-whisper, Gemini, scene detection, MediaPipe, YOLO, FFmpeg, and vertical reframing primitives. Evidence: `main.py:1-20`, `main.py:31-68`, `main.py:70-77`, `main.py:78-163`, `main.py:279-335`.
- SaaS research and script generation: scrape product pages, optional Gemini web research with Google Search grounding, Gemini analysis, then constrained viral script JSON. Evidence: `saasshorts.py:47-147`, `saasshorts.py:150-236`, `saasshorts.py:239-365`, `saasshorts.py:368-546`.
- SaaS asset generation: fal.ai queue adapter, actor image generation via Flux, ElevenLabs TTS, Kling Avatar premium talking head, Hailuo + VEED low-cost lipsync, Flux b-roll still plus FFmpeg Ken Burns. Evidence: `saasshorts.py:553-624`, `saasshorts.py:673-754`, `saasshorts.py:757-817`, `saasshorts.py:824-945`, `saasshorts.py:948-1015`.
- SaaS composition: Whisper captions, ASS/SRT subtitle generation, FFmpeg assembly with b-roll inserts. Evidence: `saasshorts.py:1049-1123`, `saasshorts.py:1126-1150`, `saasshorts.py:1153-1283`.
- SaaS orchestration: `generate_full_video` performs actor/voice generation, talking-head generation, b-roll generation, subtitles, FFmpeg composition, and cost estimates. Evidence: `saasshorts.py:1290-1474`.
- Remotion post-processing: FastAPI proxies render requests; Express render service validates, queues, resolves shared output paths, and renders `ShortVideo`. Evidence: `app.py:615-639`, `render-service/src/server.ts:57-121`, `render-service/src/render-worker.ts:44-89`, `remotion/src/compositions/ShortVideo.tsx:13-31`.

## Storage and State

- Local state: `uploads/` and `output/` are created and mounted for static serving. Evidence: `app.py:22-27`, `app.py:181-187`.
- S3 adapter: optional AWS credentials control upload/list behavior; missing credentials return empty/false rather than hard fail. Evidence: `s3_uploader.py:16-41`, `s3_uploader.py:55-86`, `s3_uploader.py:87-191`.
- Public actor/video gallery adapter: actors and metadata use public S3 URLs when credentials exist. Evidence: `s3_uploader.py:193-242`, `s3_uploader.py:245-300`, `app.py:2176-2204`.

## Key Boundaries

- External providers are not implemented in-repo; they are invoked via HTTP/client adapters.
- In-memory job maps mean restart recovery is partial; SaaS retry can reuse disk assets when the old output directory exists. Evidence: `app.py:37-39`, `app.py:2084-2107`, `dashboard/src/components/SaaShortsTab.jsx:142-148`.
- Client-side key storage uses XOR plus base64 and is explicitly noted as client-side only. Evidence: `dashboard/src/App.jsx:14-18`, `dashboard/src/App.jsx:19-50`.

