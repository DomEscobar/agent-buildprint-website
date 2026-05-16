# Buildprint Candidates

## 1. Portable AI Shorts Production Studio

Product URL/manual input -> scrape/research/analyze -> viral script generation -> actor/avatar selection or generation -> TTS voiceover -> talking-head/lipsync provider job -> b-roll generation -> subtitles/hook overlays -> FFmpeg/Remotion composition -> gallery/SEO page -> social publishing handoff.

Evidence: `app.py:1670-1717`, `saasshorts.py:47-147`, `saasshorts.py:368-546`, `dashboard/src/components/SaaShortsTab.jsx:958-1188`, `saasshorts.py:1290-1474`, `app.py:1896-2046`, `app.py:1823-1893`.

Why it is strong: it is the most complete end-to-end product loop and matches the requested preferred candidate.

## 2. Long-Form Video to Viral Shorts Pipeline

File/URL ingest -> transcript -> viral moment analysis -> scene/face-aware reframing -> clip extraction -> subtitles/hooks/effects -> publish-ready shorts.

Evidence: `app.py:316-405`, `main.py:31-68`, `main.py:70-77`, `main.py:78-163`, `main.py:279-335`, `app.py:568-612`, `app.py:647-749`.

Why it is strong: the repo exposes an older but substantial video clipping pipeline.

## 3. Self-Hosted Social Publishing Handoff

Generated video -> platform selection -> optional schedule -> Upload-Post multipart adapter -> TikTok/Instagram/YouTube fields -> async provider upload.

Evidence: `app.py:1044-1138`, `app.py:1812-1887`, `dashboard/src/components/SaaShortsTab.jsx:1398-1500`.

Why it is strong: useful as a narrow integration buildprint, but it depends entirely on Upload-Post.

## 4. SEO UGC Gallery and Video Landing Pages

S3-backed generated assets -> public gallery list -> card grid -> individual video page -> Open Graph and JSON-LD metadata.

Evidence: `app.py:1801-1809`, `app.py:1896-1964`, `app.py:1967-2046`, `dashboard/src/components/UGCGallery.jsx:12-24`, `dashboard/src/components/UGCGallery.jsx:147-236`.

Why it is strong: clear artifact publication loop, but narrower than the core production flow.

## 5. Remotion Enhancement Render Service

Base video -> structured subtitles/hook/effects props -> FastAPI proxy -> Node render queue -> Remotion composition -> MP4 output in shared volume.

Evidence: `app.py:615-639`, `render-service/src/server.ts:24-39`, `render-service/src/server.ts:57-121`, `render-service/src/render-worker.ts:44-89`, `remotion/src/compositions/ShortVideo.tsx:13-31`.

Why it is strong: clean service boundary and contract surface.

## 6. YouTube Studio Companion Toolkit

Video upload/URL -> background transcription -> title analysis/refinement -> thumbnail generation -> description/chapter generation -> YouTube publishing through Upload-Post.

Evidence: `app.py:1200-1267`, `app.py:1270-1345`, `app.py:1357-1410`, `app.py:1413-1472`, `app.py:1485-1514`, `app.py:1521-1607`.

Why it is strong: coherent creator workflow, but less central than AI Shorts.

