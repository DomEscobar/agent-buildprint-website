# Test Matrix

| Area | Test | Evidence Anchor | Required Fixtures |
|---|---|---|---|
| Analyze manual input | Description-only request returns analysis/scripts | `app.py:1695-1707` | Gemini mock |
| Analyze URL input | Scrape + research + analysis path executes | `app.py:1689-1694`, `saasshorts.py:150-236` | HTTP fixture, Gemini mock |
| Script schema | Scripts have 5 segments with b-roll requirements | `saasshorts.py:417-429`, `saasshorts.py:498-511` | Gemini script fixture |
| Actor upload | Rejects non-image/tiny image; stores valid image | `app.py:1726-1748` | Small/valid image files |
| Actor generation | fal.ai actor adapter returns image URLs | `app.py:1756-1795`, `saasshorts.py:673-729` | fal.ai mock |
| Voice list | ElevenLabs voices endpoint falls back to defaults | `app.py:2233-2245`, `saasshorts.py:796-817` | ElevenLabs mock |
| Video generate | Missing fal/ElevenLabs keys rejected | `app.py:2072-2082` | None |
| Orchestrator | Cached actor/voice/head/b-roll are reused | `saasshorts.py:1335-1385`, `saasshorts.py:1392-1433` | File fixtures |
| Subtitles | Audio transcription produces ASS captions | `saasshorts.py:1049-1123` | Short audio fixture |
| FFmpeg composition | Output is 1080x1920 MP4 and includes b-roll timing | `saasshorts.py:1153-1283` | Local media fixtures |
| Social handoff | Upload-Post payload contains selected platforms and schedule | `app.py:1849-1887`, `dashboard/src/components/SaaShortsTab.jsx:1427-1474` | Upload-Post mock |
| Gallery | Public pages include JSON-LD and video metadata | `app.py:1896-2046` | S3/gallery fixture |
| Remotion | Render service accepts schema and writes MP4 | `render-service/src/server.ts:24-39`, `render-service/src/render-worker.ts:67-89` | Local output fixture |

