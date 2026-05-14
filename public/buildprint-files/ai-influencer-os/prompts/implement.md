# Implementation Prompt

You are a coding agent implementing the OpenClaw AI Influencer OS Buildprint.

Keep this target shape active while planning:

```txt
OpenClaw container + persona extension + skills + life modules + Wavespeed image skill + browser/noVNC publishing handoff
```

Do not drift into a generic chatbot, SaaS dashboard, social scheduler, or non-OpenClaw app.

Read in this order:

1. `BUILDPRINT.md`
2. `questions.md`
3. `checks/acceptance.md`
4. `policies/media.md`
5. `policies/safety.md`

Mandatory flow:

```txt
if user said "Use default persona preset":
  build with default persona preset
else:
  ask exactly questions.md
  summarize choices
  wait for confirmation
  build
```

Questions configure values only. They do not change the architecture.

Must build:

- OpenClaw config/runtime shape
- persona files and canon
- influencer-persona extension
- OpenClaw-style skills
- Wavespeed image skill with mock fallback
- JSON storage for user memory and self-state
- life modules
- social drafts/media queue
- manager audit
- mock/manual-gated publisher
- browser/noVNC handoff docs
- tests
- `VALIDATION.md`

Tests must not call external APIs. If `WAVESPEED_API_KEY` is missing, real image generation is blocked and mock mode is used.
