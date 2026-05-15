# DEFAULT_PRESET: Automated AI Blog OS

Use this when the user says: `Use default blog preset`.

```yaml
site_stack: Astro/MDX or Markdown-first equivalent
content_lane: unusual/practical AI workflows for developers and operators
primary_audience: builders, founders, technical operators, automation-curious professionals
voice: clear, specific, practical, anti-hype
post_types:
  - workflow teardown
  - practical tutorial
  - visual explainer
  - tool comparison
  - field note
source_rotation:
  - official docs/releases
  - GitHub repos/issues
  - Hacker News
  - Reddit/practitioner forums
  - credible blogs/newsletters
scoring_weights:
  audienceFit: 2
  novelty: 2
  practicalWorkflow: 3
  visualExplainability: 2
  sourceStrength: 3
  businessRelevance: 2
  publishEffort: -1
  slopRisk: -3
publisher:
  default_mode: manual
  auto_publish_default: false
  auto_schedule_default: false
approval:
  required_by_default: true
  reviewer: human
seo:
  require_build: true
  require_sitemap: true
  require_rss: true
  require_llms: true
```

Default rule: automate research, scoring, drafting, validation, and scheduling preparation. Do not publish without approval unless the user explicitly configures it.
