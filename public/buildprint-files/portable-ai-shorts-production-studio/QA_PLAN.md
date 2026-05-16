# QA Plan

## Static QA

- Run import/static lint checks for Python and TypeScript where dependencies are available.
- Validate all FastAPI request models and response shapes against documented contracts.
- Run citation sanity checks for Mapper OS artifacts after generation.

## Unit QA

- Mock Gemini, ElevenLabs, fal.ai, Upload-Post, and S3.
- Test analysis, scripts, actor upload, generation request validation, status polling, gallery response, and publish payload construction.
- Test FFmpeg command assembly with safe fixture names and provider-generated strings.

## Integration QA

- Docker Compose smoke test: backend health, frontend boot, renderer health. Evidence for services: `docker-compose.yml:1-40`.
- Manual-description AI Shorts dry run with all providers mocked.
- Local fixture video through FFmpeg composition and Remotion render.
- Gallery page smoke test with fixture metadata.

## External QA

- Run provider sandbox tests only with explicit credentials and cost approval.
- Upload-Post sandbox publish to non-public test destinations if available.
- S3 test bucket upload/list/delete cycle.

## Acceptance Criteria

- Generated vertical MP4 is playable and reports 1080x1920.
- Job status reaches completed or failed with durable logs.
- Social handoff payload matches selected platforms and schedule.
- Gallery pages render with valid HTML and JSON-LD.

