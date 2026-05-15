---
title: Automated AI Blog OS
slug: automated-ai-blog-os
category: Product OS
stack: [Astro/MDX, Markdown, Research workflow, SEO checks, Approval queue, Scheduled publishing]
difficulty: Advanced
status: publishable-draft
agentFile: true
---

# BUILDPRINT: Automated AI Blog OS

## 0A. Attention anchors for coding agents

Keep these tokens active while planning and coding:

```txt
TARGET_SHAPE = research scanner + idea scorer + content memory + draft generator + visual post templates + SEO validator + approval queue + publisher/scheduler + manager audit
DEFAULT_OUTPUT = Markdown/MDX-first automated blog pipeline, not a generic CMS
PUBLISHING_DEFAULT = draft/manual approval, never raw auto-publish by default
SOURCE_RULE = every factual claim must be grounded in captured sources or marked opinion
SEO_RULE = publish only after metadata, canonical, sitemap/RSS/llms, structured data, and build checks pass
AUTO_MODE = optional scheduled publishing only after explicit config + approval policy + checks
ANTI_SLOP = no generic SEO filler, no fake expertise, no source laundering
```

When instructions conflict, preserve `TARGET_SHAPE` and `PUBLISHING_DEFAULT`.

If you notice yourself building a generic blog template, CMS admin, or keyword-stuffed content mill, stop and return to this Buildprint.

---

## 0B. Definition of working

The build is working only when all are true:

| Gate | Must be true |
|---|---|
| Source scanner | Configured sources are captured with URL, title, excerpt, observed signal, timestamp, and retrieval status |
| Idea scoring | Ideas are scored with explicit rubric fields, not vague ranking |
| Content memory | Previous posts, used angles, banned topics, and internal links are read before drafting |
| Draft generator | Drafts include source map, reusable workflow/prompt value, visual plan, and frontmatter |
| Claim grounding | Factual claims are linked to source IDs or blocked for review |
| SEO validator | title, description, canonical, robots, OG/Twitter, dates, tags, language, JSON-LD, breadcrumbs/FAQ where applicable are checked |
| Output feeds | sitemap, RSS/feed, and llms outputs include publishable posts |
| Approval queue | Default publish state is draft/needs_review; publishing refuses unapproved drafts |
| Publisher | Optional schedule/publish step only runs after approval + checks + build pass |
| Manager audit | Reports stale drafts, weak sources, repeated angles, SEO drift, broken feeds, and blocked publish attempts |
| Tests | Test command passes without network or real publishing credentials |
| Validation | `VALIDATION.md` records configuration, commands, test results, deviations, blockers |

---

## 0C. Common drift map

| If you drift toward... | Correct back to... |
|---|---|
| generic AI article generator | research-to-approval publishing OS with source contracts |
| SEO spam | useful workflow-first posts with sources and original angle |
| fake expertise | grounded claims, opinion labels, and human review |
| auto-posting everything | approval-gated publishing by default |
| thin Astro blog | scanner, scorer, draft queue, SEO validator, feeds, manager audit |
| source laundering | direct source IDs attached to ideas, claims, and drafts |
| broken publish | build + sitemap/RSS/llms + metadata checks before publish |

---

## 0D. Buildprint package map

```txt
BUILDPRINT.md          architecture truth
SPEC.md                behavior truth
PLAN.md                execution index
plans/*.md             phase-by-phase task rails
CONTRACTS.md           data/interface truth
DEFAULT_PRESET.md      safe default content ops settings
TEST_MATRIX.md         risk → test truth
VALIDATION_TEMPLATE.md completion report shape
questions.md           closed configuration interview
```

Do not collapse these into one vague implementation prompt.

---

## 1. Contract for the coding agent

Build an **Automated AI Blog OS**: a Markdown/MDX-first content pipeline that researches topics, scores ideas, drafts useful posts, validates SEO/build outputs, and publishes only through configured approval gates.

Hard no:

```txt
NO unsourced factual claims
NO generic SEO filler
NO fake expertise or fake case studies
NO source laundering
NO publishing without approval by default
NO real network/API calls in tests
NO hiding broken sitemap/RSS/llms outputs
NO replacing the pipeline with a plain blog theme
```

---

## 2. First action: configuration interview

Before implementation:

```txt
if user said "Use default blog preset":
  use DEFAULT_PRESET.md and start building
else:
  ask exactly questions.md
  summarize answers using the required summary template
  wait for confirmation
```

Record final choices in `VALIDATION.md`.

---

## 3. Fixed architecture

Implement this architecture. Simplify internals for MVP, but keep every box represented.

```txt
Automated AI Blog OS
  |-- config
  |   |-- content-os.config.json
  |   `-- sources.json
  |-- content-research
  |   |-- README.md
  |   |-- YYYY-MM-DD.md
  |   `-- ideas/*.json
  |-- content-memory
  |   |-- posts-index.json
  |   |-- used-angles.json
  |   |-- internal-links.json
  |   `-- banned-claims.json
  |-- src/content/blog or content/blog
  |   `-- draft/published Markdown/MDX posts
  |-- src/content/visuals or components
  |   |-- FlowGraphic
  |   |-- CompareGrid
  |   |-- DoDont
  |   |-- MetricStrip
  |   `-- Checklist
  |-- scripts
  |   |-- scan-sources
  |   |-- score-ideas
  |   |-- draft-post
  |   |-- validate-claims
  |   |-- validate-seo
  |   |-- approve-draft
  |   |-- publish-or-schedule
  |   `-- manager-audit
  |-- storage
  |   |-- sources/*.json
  |   |-- drafts/*.json
  |   |-- approvals/*.json
  |   |-- seo-reports/*.json
  |   `-- publish-reports/*.json
  `-- tests
      |-- fixtures
      |-- content-pipeline.test.*
      |-- seo-validation.test.*
      `-- approval-publishing.test.*
```

---

## 4. Required implementation behavior

### Research scan
- Rotate configured sources.
- Capture source facts, not just links.
- Mark source quality and retrieval status.
- Never invent sources.

### Idea scoring
Score each idea against:
- audience fit;
- novelty/unusualness;
- practical workflow value;
- visual explainability;
- source strength;
- business relevance;
- publish effort;
- risk of slop/factual weakness.

### Draft generation
Every draft must include:
- frontmatter;
- source map;
- claim map;
- original angle;
- reusable prompt/workflow;
- visual component plan;
- internal links;
- CTA or next step;
- publish checklist state.

### Approval and publishing
Default state is `draft` or `needs_review`.

Publishing requires:

```txt
approval.status == approved
claim_validation.status == pass
seo_report.status == pass
build.status == pass
publisher.mode allowed by config
```

Auto-schedule is allowed only when explicitly configured and the same gates pass.

---

## 5. Acceptance checks

- `npm test` or equivalent passes without network/publishing credentials.
- Source fixtures prove ideas and claims are grounded.
- Draft fixture cannot publish until approved.
- SEO validator catches missing title, description, canonical, OG/Twitter, JSON-LD, sitemap/RSS/llms output, and build failure.
- Manager audit reports stale drafts, repeated angles, weak source maps, and blocked publish attempts.
- `VALIDATION.md` follows `VALIDATION_TEMPLATE.md`.

