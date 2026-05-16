# Parity Claims

## Supported Claims

- The repo contains an end-to-end AI Shorts pipeline from URL/manual description through script generation, actor/voice configuration, video generation, composition, gallery, and social handoff. Evidence: `app.py:1670-1717`, `app.py:2060-2216`, `saasshorts.py:1290-1474`, `app.py:1823-1893`.
- The repo contains a long-form clip generator path with file/URL ingest, rights acknowledgement, subprocess execution, and job status polling. Evidence: `app.py:316-417`.
- The repo contains a Remotion render service that can layer effects, subtitles, and hooks over video. Evidence: `app.py:615-639`, `render-service/src/server.ts:57-121`, `remotion/src/compositions/ShortVideo.tsx:13-31`.
- The repo contains public gallery and individual video page HTML generation with SEO metadata. Evidence: `app.py:1896-2046`.

## Adapter Claims Only

- Gemini research/analysis/script generation is an adapter claim. Evidence: `saasshorts.py:47-147`, `saasshorts.py:239-365`, `saasshorts.py:368-546`.
- ElevenLabs TTS/voices is an adapter claim. Evidence: `saasshorts.py:757-817`.
- fal.ai/Flux/Hailuo/Kling/VEED generation is an adapter claim. Evidence: `saasshorts.py:553-624`, `saasshorts.py:673-754`, `saasshorts.py:824-945`.
- Upload-Post TikTok/Instagram/YouTube publishing is an adapter claim. Evidence: `app.py:1044-1138`, `app.py:1812-1893`.
- S3 gallery/backup behavior is an adapter claim. Evidence: `s3_uploader.py:16-41`, `s3_uploader.py:87-191`, `s3_uploader.py:193-300`.
- yt-dlp URL download is an adapter claim. Evidence: `main.py:15`, `app.py:1238-1243`.

## Not Claimed

- Full parity with commercial clip-generation products.
- Direct official platform API publishing to TikTok, Instagram, or YouTube.
- Provider-level availability, moderation, policy compliance, quality, or cost.
- Multi-tenant secure SaaS production readiness.

