# Specification

## Inputs

- `url`: optional product website URL for scraping/research. Evidence: `app.py:1661-1668`, `dashboard/src/components/SaaShortsTab.jsx:466-482`.
- `description`: optional manual product/business description. Evidence: `app.py:1661-1664`, `dashboard/src/components/SaaShortsTab.jsx:484-495`.
- `num_scripts`, `style`, `language`, `actor_gender`: script-generation controls. Evidence: `app.py:1664-1668`, `saasshorts.py:368-375`.
- Provider keys: Gemini, fal.ai, ElevenLabs, Upload-Post. Evidence: `app.py:1675-1678`, `app.py:2072-2082`, `app.py:1823-1850`.

## Outputs

- Product analysis and scripts. Evidence: `app.py:1706-1714`.
- Generated actor options or uploaded actor URL. Evidence: `app.py:1726-1795`.
- Generated video URL, filename, duration, cost estimate, script metadata. Evidence: `app.py:2164-2174`.
- Optional gallery video ID. Evidence: `app.py:2176-2204`.
- Optional Upload-Post response for social publishing. Evidence: `app.py:1880-1887`.

## Non-Functional Requirements

- Background job status must be pollable. Evidence: `app.py:2219-2230`, `dashboard/src/components/SaaShortsTab.jsx:136-171`.
- Concurrency should respect backend semaphore. Evidence: `app.py:35-42`, `app.py:2149-2213`.
- Output files live under `output/` and are served through `/videos`. Evidence: `app.py:22-27`, `app.py:181-187`.
- Docker Compose should run backend, frontend, and renderer with shared output. Evidence: `docker-compose.yml:1-40`.

## Explicit Non-Claims

- No direct TikTok/Instagram/YouTube API parity.
- No guarantee of provider model availability or output quality.
- No guarantee of S3/public gallery behavior without configured buckets.

