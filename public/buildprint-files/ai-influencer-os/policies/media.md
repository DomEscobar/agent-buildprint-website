# Wavespeed Media Policy

The full Buildprint uses Wavespeed for image generation.

Required env:

```txt
WAVESPEED_API_KEY=
WAVESPEED_API_URL=
INFLUENCER_IMAGE_GENERATION_TIMEOUT_MS=180000
```

## Implementation rules

- Real generation path must call the Wavespeed-backed image skill.
- Tests must use mock mode.
- If `WAVESPEED_API_KEY` is absent, the system must not pretend real image generation works.
- Public social media prompts must be platform-safe and canon-consistent.
- Private media must be trust/consent gated.
- Public media jobs must link back to a social draft or grounded life/calendar beat.
