# Selected Buildprint

Selected candidate: `Portable AI Shorts Production Studio`

## Selection Rationale

This candidate is supported by an end-to-end implementation path:

- Input can be a product URL or manual product/business description. Evidence: `app.py:1661-1668`, `app.py:1670-1682`, `dashboard/src/components/SaaShortsTab.jsx:466-495`.
- URL mode scrapes the website, performs Gemini web research, analyzes the product, and generates scripts. Evidence: `app.py:1686-1707`, `saasshorts.py:47-147`, `saasshorts.py:150-236`, `saasshorts.py:239-365`, `saasshorts.py:368-546`.
- User can choose/generate/upload actors, select voices, edit narration, choose low-cost or premium video mode, then start generation. Evidence: `dashboard/src/components/SaaShortsTab.jsx:431-463`, `dashboard/src/components/SaaShortsTab.jsx:859-956`, `dashboard/src/components/SaaShortsTab.jsx:958-1188`.
- Backend generation requires fal.ai and ElevenLabs keys, supports selected actor images, runs in background, and stores result metadata. Evidence: `app.py:2060-2148`, `app.py:2149-2216`.
- Full video pipeline covers actor image, voiceover, talking-head/lipsync, b-roll, subtitles, and FFmpeg composite. Evidence: `saasshorts.py:1290-1474`.
- Output is exposed as local `/videos/...`, optionally uploaded to gallery, and can be posted through Upload-Post. Evidence: `app.py:2164-2204`, `app.py:1801-1809`, `app.py:1823-1893`.
- Public gallery and individual SEO video pages exist. Evidence: `app.py:1896-2046`.

## Scope Guardrails

This selection does not claim provider parity or reliable production behavior across Gemini, ElevenLabs, fal.ai, Upload-Post, S3, YouTube, TikTok, or Instagram. The repo provides adapters and request shapes; external service correctness, quotas, auth, moderation, platform policy compliance, and result quality were not validated in this pass.

