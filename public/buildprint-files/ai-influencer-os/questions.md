# Configuration Interview

Ask these only if the user did **not** say:

```txt
Use default persona preset.
```

Rules for the coding agent:

- Ask exactly these questions.
- Do not ask broad product strategy questions.
- Do not propose architecture changes.
- These answers configure the fixed OpenClaw Influencer OS architecture; they do not replace it.
- If the user skips a question, use the default persona preset.

## Questions

1. **Persona** — should the user choose the persona name/identity, or should the coding agent generate a fresh fictional name and identity from the default preset?

2. **Voice/language** — keep mixed DE/EN dry/direct default preset tone, or change language/tone?

3. **Content lane** — keep lifestyle/gaming/gym/streetwear/coffee, or swap/add lanes?

4. **Chat channel** — Telegram first, or another OpenClaw-supported channel first?

5. **Public platforms** — mock only first, or prepare Instagram/TikTok/X/YouTube Shorts handoff?

6. **Image generation** — use Wavespeed production path with mock fallback? If not, stop and ask because this Buildprint requires Wavespeed.

7. **Publishing safety** — keep manual approval + mock publishing by default, or allow any auto-publish later behind env flags?

8. **Autonomy** — keep life/social loops disabled by default, or enable scheduled loops after tests pass?

## Required confirmation summary

After answers, output:

```txt
Alignment summary
- Persona name/identity source:
- Voice/language:
- Content lane:
- Chat channel:
- Public platforms:
- Image generation:
- Publishing safety:
- Autonomy:
- Kept from default persona preset:
- Changed from default persona preset:

Reply “confirm” to build, or tell me what to change.
```

Do not implement before confirmation.
