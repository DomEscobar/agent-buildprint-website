# Automated AI Blog OS

> Build an approval-gated AI blog publishing system that researches sources, scores ideas, drafts useful visual posts, validates claims/SEO/build output, and only publishes through configured safety gates.

```txt
     sources          ideas          memory          draft          validate          approve          publish
        │              │              │               │               │                │                │
        ▼              ▼              ▼               ▼               ▼                ▼                ▼
   ┌─────────┐   ┌─────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │ Scanner │ → │ Scorer  │ → │ Content  │ → │ MD/MDX   │ → │ Claims + │ → │ Review   │ → │ Schedule │
   │ records │   │ rubric  │   │ memory   │   │ draft    │   │ SEO gate │   │ queue    │   │ /publish │
   └─────────┘   └─────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
                                      │                              │
                                      ▼                              ▼
                              used angles + links            sitemap/RSS/llms/build
```

## What you get

- 🔎 source scanner with captured `SourceRecord`s
- 🧮 rubric-based idea scoring
- 🧠 content memory for previous posts, used angles, banned claims, and internal links
- ✍️ draft generator for Markdown/MDX posts
- 🧾 source maps and claim maps for every draft
- 🎨 visual post plans/components such as flow graphics, compare grids, do/don't cards, metric strips, and checklists
- 🧪 claim grounding validator
- 📈 SEO/build/feed validator for metadata, structured data, sitemap, RSS/feed, and llms outputs
- ✅ approval queue before publishing
- 🗓️ gated publisher/scheduler for manual, scheduled, or explicitly configured auto modes
- 🧯 manager audit for stale drafts, weak sources, repeated angles, SEO drift, and blocked publish attempts
- 🧰 acceptance checks for coding agents

## Use it

Give this folder to a coding agent:

```txt
Read BUILDPRINT.md.
Ask questions.md unless I say “use default blog preset”.
Then build the Automated AI Blog OS.
```

Fast path:

```txt
Use default blog preset.
Build this in a new Astro/MDX or Markdown-first repo.
Keep publishing manual until I approve it.
```

CLI bootstrap:

```bash
agb start https://agent-buildprint.com/buildprints/automated-ai-blog-os/package.json
```

## Default publishing stance

The default is **not** raw auto-posting.

```txt
research automatically
score automatically
draft automatically
validate automatically
prepare publishing automatically
publish only after approval by default
```

Auto-schedule or auto-publish can exist, but only when explicitly configured and only after approval, claim validation, SEO validation, feed checks, and build checks pass.

## Required production configuration

Typical implementations need some version of:

```txt
CONTENT_SITE_URL=
CONTENT_SOURCE_CONFIG=
PUBLISH_MODE=manual|schedule|auto
APPROVAL_REQUIRED=true
BUILD_COMMAND="npm run build"
```

Optional integrations may add keys for web search, RSS ingestion, CMS APIs, GitHub commits, or deployment providers.

No key? The implementation must use fixture/mock mode and clearly mark the missing integration as a blocker.

## Files

```txt
BUILDPRINT.md              architecture contract
SPEC.md                    behavior requirements
PLAN.md                    phase index
plans/*.md                 phase-by-phase task rails
CONTRACTS.md               source/idea/draft/approval/SEO/publish data shapes
DEFAULT_PRESET.md          safe default content ops settings
TEST_MATRIX.md             risks mapped to tests
VALIDATION_TEMPLATE.md     completion report template
questions.md               configuration interview
prompts/implement.md       copyable coding-agent prompt
prompts/qa.md              QA/review prompt
checks/acceptance.md       what must pass
policies/publishing.md     publishing safety gates
diagrams/architecture.md   pipeline map
schemas/buildprint.meta.json
```

## Build rule

This is **not** a generic AI article generator.

It should build around:

```txt
source records + idea scoring + content memory + grounded drafts + SEO/feed/build gates + approval queue + gated publishing
```

Hard rule: if a factual claim has no source, it does not publish.
