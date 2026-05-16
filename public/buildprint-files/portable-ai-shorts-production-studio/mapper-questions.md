# Open Questions

1. Which deployment mode is authoritative: local Docker only, hosted OpenShorts app, or both?
2. Should Mapper OS describe Upload-Post as the only social publishing path, or should direct platform APIs be considered out of scope?
3. Are S3 public gallery buckets required for production, or should local-only gallery output be a supported mode?
4. What is the intended retention model for generated videos beyond the current in-memory job maps and cleanup window? Evidence for cleanup: `app.py:84-124`.
5. Should client-side API key storage be redesigned before any production buildprint claims? Current storage is client-side XOR/base64 plus localStorage. Evidence: `dashboard/src/App.jsx:14-50`, `dashboard/src/App.jsx:239-258`.
6. Which provider modes should be first-class in contracts: low-cost Hailuo + VEED, premium Kling Avatar, or both? Evidence: `saasshorts.py:865-945`, `saasshorts.py:824-862`.
7. Is YouTube URL ingestion intentionally disabled in hosted deployments? The backend supports `DISABLE_YOUTUBE_URL`. Evidence: `app.py:28-34`, `app.py:339-343`.
8. What minimum content safety, consent, and likeness controls are required for custom actor upload and generated actor prompts? Evidence for custom upload: `app.py:1726-1748`.

