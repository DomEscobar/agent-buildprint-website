---
title: AI Editorial OS
slug: ai-editorial-os
category: Content OS
stack: [Astro/MDX, Research workflow, SEO checks, Visual components]
difficulty: Medium
---

# AI Editorial OS Buildprint

## What this builds

An automated editorial system that researches ideas, scores them, drafts visual blog posts, and runs publish checks before human approval.

Inspired by the huecki.com content-research workflow.

## When to use

Use this for blogs, founder field notes, technical content, SEO-supported content, newsletter pipelines, or research-driven publishing.

Do not use this for mass AI slop or unsourced SEO spam.

## Inputs / assumptions

- A content repo with Markdown/MDX posts.
- A clear editorial positioning.
- A list of sources to rotate.
- Manual approval before publishing.
- A build command that verifies the site.

## Implementation plan

1. Create `content-research/README.md` with positioning, sources, capture format, scoring, and publish rules.
2. Create daily research files `content-research/YYYY-MM-DD.md`.
3. Define scoring rubric for unusual/practical/visual posts.
4. Create visual post components or templates:
   - flow graphic
   - key points
   - compare grid
   - do/don't
   - metric strip
5. Add prompts:
   - daily scan
   - draft post
   - SEO review
6. Add publish checklist:
   - title/description
   - canonical/hreflang
   - robots
   - OG/Twitter
   - structured data
   - sitemap/RSS/llms
   - build passes
7. Add draft approval state; never publish automatically by default.

## Acceptance checks

- Every post idea includes source, why unusual, who it helps, workflow, risk, score, and post viability.
- Drafts include one reusable prompt/workflow.
- Drafts cite sources.
- Site build passes.
- Generated output appears in sitemap/RSS when non-draft.
- SEO metadata exists and aligns with the post.
- Human approval required before publish.

## Risks / when not to use

- Avoid generic AI content.
- Avoid unsourced claims.
- Do not auto-publish without review.
- Do not chase SEO if it breaks positioning.

## Copyable agent prompt

Build an AI Editorial OS from this Buildprint. Create a minimal Astro/MDX or Markdown-first content workflow with content-research docs, daily idea capture, scoring rubric, draft prompts, visual component templates, and an SEO/build publish checklist. Add sample research day and one draft post. Ensure publish remains manual and build/test commands verify output.
