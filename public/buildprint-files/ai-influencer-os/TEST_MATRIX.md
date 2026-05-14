# TEST_MATRIX

| Risk | Required test / check |
|---|---|
| Generic chatbot drift | Required OpenClaw config, extension, skills, and Docker files exist |
| Private context leakage | Runtime context is marked private and not returned in visible response fixture |
| Memory/self-state merge | User memory and self-state read/write to separate files |
| Wavespeed ignored | Image skill references `WAVESPEED_API_KEY` and has mock fallback |
| External API in tests | Test runner forces mock mode and passes without keys |
| Public/private media confusion | Low-trust private/sensitive media is blocked; public media requires safety/grounding |
| Ungrounded social claims | Draft without `groundedIn` is blocked by QA |
| Auto-publishing | Mock publisher refuses unapproved drafts and default env disables real publish |
| Manager missing | Manager audit reports stale/unsafe/blocked items |
| Validation handwave | `VALIDATION.md` includes commands, test result, missing keys, deviations, blockers |

## Minimum command gate

```bash
npm test
npm run test:static
```
