# Contracts

## Analyze Product

Endpoint: `POST /api/saasshorts/analyze`

Request fields: `url`, `description`, `num_scripts`, `style`, `language`, `actor_gender`. Evidence: `app.py:1661-1668`.

Response fields: `analysis`, `scripts`, `web_research`. Evidence: `app.py:1706-1714`.

## Actor Options

Endpoint: `POST /api/saasshorts/actor-options`

Request fields: `actor_description`, `num_options`, `product_description`. Evidence: `app.py:1720-1724`.

Provider key: `X-Fal-Key`. Evidence: `app.py:1756-1764`.

Response field: `images`. Evidence: `app.py:1782-1795`.

## Generate Video

Endpoint: `POST /api/saasshorts/generate`

Request fields: `script`, `voice_id`, `actor_description`, `selected_actor_url`, `retry_job_id`, `video_mode`. Evidence: `app.py:2060-2067`.

Provider keys: `X-Fal-Key`, `X-ElevenLabs-Key`. Evidence: `app.py:2069-2082`.

Immediate response: `job_id`, `status`. Evidence: `app.py:2214-2216`.

Status endpoint: `GET /api/saasshorts/status/{job_id}` returns `status`, `logs`, `result`. Evidence: `app.py:2219-2230`.

Result fields include `video_url`, `video_filename`, `duration`, `cost_estimate`, `script`, and optional `gallery_video_id`. Evidence: `app.py:2164-2202`.

## Publish Video

Endpoint: `POST /api/saasshorts/post`

Request fields: `job_id`, `api_key`, `user_id`, `platforms`, optional `title`, `description`, `scheduled_date`, `timezone`. Evidence: `app.py:1812-1820`.

Adapter behavior: sends multipart `video` to Upload-Post with platform fields. Evidence: `app.py:1849-1887`.

## Gallery

Endpoint: `GET /api/saasshorts/gallery`

Returns `videos` and `total`. Evidence: `app.py:1801-1809`.

Public pages: `/gallery`, `/video/{video_id}`. Evidence: `app.py:1896-2046`.

