# Acceptance Checks

## Alignment checks

- User either said “Use default persona preset” or the agent asked exactly `questions.md`.
- Agent did not ask broad product-redesign questions.
- `VALIDATION.md` records final choices and deviations.

## OpenClaw shape checks

- `AGENTS.md`, `SOUL.md`, and `USER.md` exist.
- `config/openclaw.json` exists.
- `extensions/influencer-persona/` exists with entrypoint, context, policy, media flow, and storage modules.
- Skills exist for image, post, social, journal, calendar, recall.
- Docker deployment exists.
- Browser/noVNC handoff is documented.

## Provider checks

- `.env.example` includes `WAVESPEED_API_KEY`.
- Wavespeed is the only production image provider path.
- Missing Wavespeed key triggers mock mode or blocked real mode.
- OpenRouter/OpenClaw model vars are documented.

## Behavior checks

- User memory and persona self-state are separate.
- Runtime context includes memory/life/media status but is not leaked.
- Public claims must be grounded in state/calendar/journal/social data.
- Public and private media policies are separate.
- Private sensitive media is trust/consent gated or blocked.
- Publishing is mock/manual-gated by default.
- Manager QA can block unsafe/canon-breaking drafts.

## Test checks

- `npm test` runs without real external API calls.
- `npm run test:static` or equivalent syntax check exists.
- Tests cover mock image mode, blocked unsafe media, grounded/ungrounded drafts, publisher approval, and manager audit.

## Failure checks

Fail if the implementation is a generic chatbot, omits OpenClaw shape, omits Wavespeed, auto-publishes by default, or silently changes the Buildprint architecture.
