# Threat Model

## Assets

- User API keys: Gemini, fal.ai, ElevenLabs, Upload-Post, AWS.
- Uploaded source videos and generated videos.
- Uploaded/custom actor photos.
- Provider-generated actor images, voices, captions, and scripts.
- Public gallery metadata and SEO pages.

## Trust Boundaries

- Browser localStorage to backend headers. Evidence: `dashboard/src/App.jsx:136-158`, `dashboard/src/App.jsx:239-258`.
- Backend to external providers. Evidence: `saasshorts.py:553-624`, `saasshorts.py:757-817`, `app.py:1849-1887`.
- Backend local filesystem to public `/videos` mount. Evidence: `app.py:181-187`.
- Backend to public S3 buckets. Evidence: `s3_uploader.py:193-242`.
- Upload-Post to TikTok/Instagram/YouTube accounts. Evidence: `app.py:1812-1893`.

## Key Threats

- API key exposure through client localStorage or logs.
- Unauthorized processing of copyrighted videos or third-party likenesses.
- Prompt injection or untrusted scraped content influencing generated scripts.
- Unsafe provider-generated text passed into FFmpeg subtitle filters.
- Public gallery leakage of private videos or actor images.
- Job loss or inconsistent state after backend restart.
- SSRF-like risk from arbitrary URL scraping/downloading.

## Existing Controls

- Clip Generator requires user acknowledgement of rights before processing. Evidence: `app.py:339-357`, `dashboard/src/components/MediaInput.jsx:116-131`.
- Hosted deployments can disable YouTube URL ingestion. Evidence: `app.py:28-34`, `app.py:342-343`.
- Upload file size limit for Clip Generator. Evidence: `app.py:31`, `app.py:374-385`.
- Actor upload requires image content type and minimum size. Evidence: `app.py:1726-1738`.
- S3 operations no-op without credentials. Evidence: `s3_uploader.py:20-25`, `s3_uploader.py:55-62`.

## Recommended Controls

- Server-side encrypted key vault or bring-your-own-key session tokens.
- Explicit consent and likeness attestation for custom actor uploads.
- URL allow/deny controls and network egress policy for scraping/downloading.
- Provider response validation and output moderation.
- Durable jobs with access-controlled artifact storage.
- Private-by-default gallery with explicit publish action.

