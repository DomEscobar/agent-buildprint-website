# Critical Review

## Main Risks

- External providers are not validated. The code calls Gemini, ElevenLabs, fal.ai models, Upload-Post, and S3, but this pass did not execute provider calls or verify response compatibility beyond source inspection. Evidence for adapter calls: `saasshorts.py:553-624`, `saasshorts.py:757-817`, `app.py:1823-1893`, `s3_uploader.py:55-86`.
- In-memory job tracking can lose state on restart. The backend stores jobs in dictionaries and the UI treats missing SaaS jobs as lost after restart, though retry may reuse cached output assets. Evidence: `app.py:35-39`, `dashboard/src/components/SaaShortsTab.jsx:142-148`, `app.py:2084-2107`.
- API keys are handled in headers and client localStorage. The frontend says the XOR/base64 helper is still client-side, and Gemini key remains plain for compatibility. Evidence: `dashboard/src/App.jsx:14-18`, `dashboard/src/App.jsx:233-237`.
- Public gallery/actor URLs depend on S3 credentials and bucket configuration. Missing credentials return no client, empty lists, or upload fallback. Evidence: `s3_uploader.py:55-86`, `s3_uploader.py:193-242`, `app.py:1782-1794`.
- Social publishing is an Upload-Post handoff, not direct platform integration. Evidence: `app.py:1849-1887`, `app.py:1086-1138`.
- URL scraping and YouTube URL ingest have consent/compliance implications. Clip processing requires rights acknowledgement and hosted deployment may disable YouTube URLs. Evidence: `app.py:339-357`, `dashboard/src/components/MediaInput.jsx:116-131`.
- Generated actor/custom actor flow needs likeness consent controls before production parity claims. Custom actor upload only validates content type and minimum size. Evidence: `app.py:1726-1748`.
- FFmpeg command construction is mostly list-based but still consumes generated paths and subtitle filters; provider-generated text in subtitles/hook overlays should be tested for escaping and filter safety. Evidence: `saasshorts.py:1167-1179`, `saasshorts.py:1270-1281`.

## Evidence Quality

- Strong: route-level API surfaces, pipeline orchestration, UI flow, Docker services, Remotion rendering, FFmpeg composition.
- Medium: README product claims, cost claims, provider model names.
- Weak/unvalidated: provider result quality, quotas, moderation, platform publish success, public S3 bucket behavior, hosted production settings.

## Mapper Constraint Compliance

- No full clone/provider/API/social-platform parity is claimed.
- Providers and social platforms are treated as adapters.
- The selected buildprint is evidence-backed by file:line citations.

