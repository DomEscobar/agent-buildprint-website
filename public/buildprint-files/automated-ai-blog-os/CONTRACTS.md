# CONTRACTS: Automated AI Blog OS

## SourceRecord

```json
{
  "id": "src_20260515_001",
  "url": "https://example.com/post",
  "title": "string",
  "excerpt": "string",
  "sourceType": "web|rss|hn|reddit|github|manual|internal",
  "observedAt": "ISO-8601",
  "quality": "strong|medium|weak",
  "retrievalStatus": "fetched|manual|failed|skipped",
  "signals": { "score": 0, "comments": 0, "shares": 0 },
  "notes": "why this matters"
}
```

## IdeaRecord

```json
{
  "id": "idea_001",
  "title": "string",
  "angle": "string",
  "audience": "string",
  "sourceIds": ["src_20260515_001"],
  "rubric": {
    "audienceFit": 0,
    "novelty": 0,
    "practicalWorkflow": 0,
    "visualExplainability": 0,
    "sourceStrength": 0,
    "businessRelevance": 0,
    "publishEffort": 0,
    "slopRisk": 0
  },
  "totalScore": 0,
  "status": "candidate|selected|needs_more_sources|rejected"
}
```

## DraftRecord

```json
{
  "id": "draft_001",
  "ideaId": "idea_001",
  "slug": "post-slug",
  "status": "draft|needs_review|approved|scheduled|published|blocked",
  "frontmatter": {
    "title": "string",
    "description": "string",
    "date": "ISO-8601",
    "tags": ["string"],
    "draft": true,
    "canonical": "string"
  },
  "sourceMap": [{ "sourceId": "src_20260515_001", "usedFor": "claim or context" }],
  "claimMap": [{ "claim": "string", "sourceIds": ["src_20260515_001"], "type": "fact|opinion|experience" }],
  "visualPlan": [{ "component": "FlowGraphic|CompareGrid|DoDont|MetricStrip|Checklist", "purpose": "string" }],
  "internalLinks": ["/blog/example"],
  "checklist": { "claims": "pending", "seo": "pending", "approval": "pending", "build": "pending" }
}
```

## ApprovalRecord

```json
{
  "draftId": "draft_001",
  "status": "pending|approved|rejected|changes_requested",
  "reviewer": "human|policy",
  "reviewedAt": "ISO-8601|null",
  "notes": "string"
}
```

## SeoReport

```json
{
  "draftId": "draft_001",
  "status": "pass|fail|blocked",
  "checks": {
    "title": true,
    "description": true,
    "canonical": true,
    "robots": true,
    "openGraph": true,
    "twitter": true,
    "blogPostingJsonLd": true,
    "breadcrumbs": true,
    "faqSchemaIfApplicable": true,
    "sitemap": true,
    "rss": true,
    "llms": true,
    "build": true
  },
  "errors": []
}
```

## PublishReport

```json
{
  "draftId": "draft_001",
  "mode": "manual|schedule|auto",
  "status": "prepared|scheduled|published|refused|failed",
  "reason": "string",
  "publishedUrl": "string|null",
  "timestamp": "ISO-8601"
}
```
