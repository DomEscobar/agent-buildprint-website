# TEST_MATRIX

| Risk | Required test / check |
|---|---|
| Generic blog template drift | Required scanner, scorer, draft queue, validators, approval, publisher, and audit modules/files exist |
| Unsourced claims | Claim validator blocks factual claims without source IDs |
| Source laundering | Draft source map must reference captured SourceRecord IDs |
| Generic SEO filler | Idea score requires practical workflow value and original angle |
| Repeated content angles | Drafting reads content memory / used angles and flags duplicates |
| Publishing without approval | Publisher refuses unapproved drafts by default |
| Auto-publish misconfiguration | Default config disables auto-publish and auto-schedule |
| SEO metadata drift | Validator fails missing title, description, canonical, robots, OG/Twitter, dates/tags/language, JSON-LD |
| Broken discovery outputs | Validator checks sitemap, RSS/feed, and llms output for publishable posts |
| Build broken | Publish gate requires build command pass |
| External API in tests | Tests use fixtures/mocks and pass without network credentials |
| Manager missing | Audit reports stale drafts, weak sources, repeated angles, SEO failures, blocked publish attempts |
| Validation handwave | `VALIDATION.md` includes commands, results, deviations, and blockers |

## Minimum command gate

```bash
npm test
npm run build
```

If the target project does not use npm, replace with equivalent test/build commands and record the substitution in `VALIDATION.md`.
