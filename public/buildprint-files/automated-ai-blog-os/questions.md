# Configuration questions

Ask exactly these before implementation unless the user says `Use default blog preset`.

1. What site stack should this target? (`Astro/MDX`, `Next.js/MDX`, `plain Markdown`, other)
2. What is the primary content lane?
3. Who is the reader?
4. Which source types should be scanned? Pick any: docs/releases, GitHub, HN, Reddit, RSS, web search, internal notes, manual links.
5. Should publishing default to `manual`, `schedule after approval`, or `auto after approval and checks`?
6. Who approves drafts?
7. Which SEO outputs are required? sitemap, RSS/feed, llms.txt, JSON-LD, hreflang, FAQ schema, breadcrumbs.
8. What build/test commands should be used?
9. Any banned topics, claims, competitors, or tone constraints?

## Required summary template

```txt
I will build Automated AI Blog OS with:
- stack:
- content lane:
- reader:
- sources:
- publisher mode:
- approval:
- SEO outputs:
- commands:
- constraints:

Confirm and I will implement.
```
