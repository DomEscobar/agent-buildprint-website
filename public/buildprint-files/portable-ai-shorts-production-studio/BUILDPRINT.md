# Buildprint: Portable AI Shorts Production Studio

## Purpose

Generate publish-ready vertical UGC-style marketing videos from a product URL or manual description using a modular AI/provider pipeline.

## Core Flow

1. Accept product URL or manual product/business description.
2. Scrape product pages and optionally perform Gemini web research.
3. Generate structured product analysis and viral scripts.
4. Let user select voice, actor image, video mode, and edit narration.
5. Generate or reuse actor image and voiceover.
6. Generate talking-head/lipsync video through provider adapters.
7. Generate b-roll assets.
8. Generate subtitles from actual audio.
9. Compose final vertical video with FFmpeg and optional Remotion post-processing.
10. Store result, expose local video URL, optionally upload to public gallery.
11. Publish/schedule through Upload-Post handoff.

## Evidence

- Product/manual input and analyze route: `app.py:1661-1717`
- Web research/scrape/analyze: `saasshorts.py:47-365`
- Script generation: `saasshorts.py:368-546`
- Actor/voice/video configuration UI: `dashboard/src/components/SaaShortsTab.jsx:850-1188`
- Provider asset generation: `saasshorts.py:553-1015`
- Subtitle/composition/orchestration: `saasshorts.py:1049-1474`
- Generate/status API: `app.py:2060-2230`
- Gallery/SEO pages: `app.py:1896-2046`
- Social publish handoff: `app.py:1812-1893`

