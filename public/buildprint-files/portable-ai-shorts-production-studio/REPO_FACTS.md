# Repository Facts

- Repository: `mutonby/openshorts`
- Commit mapped: `fe87af6dd599b854e6eab2de0ca247ebafe13885`
- GitHub metadata supplied by task: public repository, `fork=true`
- Product statement: README describes OpenShorts as a free/open-source AI video platform with Clip Generator, AI Shorts with AI actors, and YouTube Studio. Evidence: `README.md:10`, `README.md:23-49`.
- Primary backend: FastAPI app in `app.py`, with CORS, static video/thumbnail mounts, queue state, and API routes. Evidence: `app.py:170-187`, `app.py:312-417`.
- Primary frontend: React dashboard imports Clip Generator inputs, AI Shorts tab, UGC Gallery, Thumbnail Studio, and scheduling modal. Evidence: `dashboard/src/App.jsx:1-12`, `dashboard/src/App.jsx:136-170`.
- AI Shorts workflow: URL or manual description analysis, script generation, actor selection/generation, voice selection, video generation, gallery, and publishing are implemented across `saasshorts.py`, FastAPI routes, and `SaaShortsTab.jsx`. Evidence: `app.py:1646-1717`, `app.py:2060-2216`, `dashboard/src/components/SaaShortsTab.jsx:187-306`, `dashboard/src/components/SaaShortsTab.jsx:850-1188`.
- Clip Generator workflow: `/api/process` accepts a URL or file, requires an ownership/rights acknowledgement, queues `main.py`, and reports job status. Evidence: `app.py:316-405`, `app.py:407-417`.
- Rendering surface: a Node/Express render service validates render requests, serves shared output, executes Remotion in background, and exposes status polling. Evidence: `render-service/src/server.ts:24-39`, `render-service/src/server.ts:57-121`, `render-service/src/render-worker.ts:67-89`.
- Remotion composition layers base video, effects, subtitles, and hook overlay. Evidence: `remotion/src/compositions/ShortVideo.tsx:13-31`.
- Deployment surface: Docker Compose defines backend, frontend, and renderer services with shared output volume. Evidence: `docker-compose.yml:1-40`.
- External services are adapter surfaces in this mapping unless separately validated: Gemini, ElevenLabs, fal.ai/Flux/Hailuo/Kling/VEED, Upload-Post, AWS S3, YouTube/TikTok/Instagram, scraping, and yt-dlp.

