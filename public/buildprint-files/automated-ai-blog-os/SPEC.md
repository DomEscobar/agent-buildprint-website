# SPEC: Automated AI Blog OS

This file is the behavior truth. `BUILDPRINT.md` is the architecture truth.

## Requirements

### R1 — Source capture
Given configured sources exist, when a scan runs, then each captured source has `id`, `url`, `title`, `excerpt`, `observedAt`, `sourceType`, `quality`, and `retrievalStatus`.

Given a source cannot be fetched, when scan completes, then the source is marked failed or skipped; the system must not invent source content.

### R2 — Idea scoring
Given captured sources exist, when ideas are generated, then each idea has a numeric rubric score and per-field explanation.

Given source strength is weak, when scoring runs, then the idea is penalized or marked `needs_more_sources`.

### R3 — Content memory
Given previous posts and used angles exist, when drafting starts, then the draft process reads content memory and avoids repeated angles unless explicitly justified.

### R4 — Draft contract
Given an idea is selected, when a draft is created, then it includes frontmatter, source map, claim map, visual plan, reusable prompt/workflow, internal-link suggestions, and publish checklist state.

### R5 — Claim grounding
Given a factual claim appears in a draft, when validation runs, then it must reference one or more source IDs or be marked as opinion/experience.

Given an ungrounded factual claim exists, when publishing is requested, then publishing is blocked.

### R6 — SEO/build validation
Given a draft is approved, when publish validation runs, then title, description, canonical, robots, OG/Twitter, dates, tags, language, BlogPosting JSON-LD, breadcrumbs and FAQ schema where applicable, sitemap, RSS/feed, llms output, and build command are checked.

### R7 — Approval gate
Given default config is used, when publish is requested, then unapproved drafts are refused.

Given auto-schedule is enabled, when a draft lacks approval or passing checks, then scheduling is refused.

### R8 — Publisher modes
Given publisher mode is `manual`, when a post passes checks, then the system prepares a publish report but does not deploy.

Given publisher mode is `schedule`, when checks pass and approval exists, then the system writes a scheduled publish record.

Given publisher mode is `auto`, when enabled explicitly, then it still requires approval policy and all checks.

### R9 — Manager audit
Given drafts, sources, approvals, and reports exist, when manager audit runs, then it reports stale drafts, repeated angles, weak sources, ungrounded claims, SEO failures, broken feeds, and blocked publish attempts.

### R10 — Test isolation
Given tests run, when external source scanning or publishing would be needed, then fixture/mock mode is used and no real network or publish credentials are required.

## Out of scope for first implementation

- mass programmatic SEO pages;
- fake author expertise;
- publishing directly from first draft;
- real network calls in tests;
- private analytics dashboards beyond simple reports;
- replacing editorial judgment with keyword volume alone.
