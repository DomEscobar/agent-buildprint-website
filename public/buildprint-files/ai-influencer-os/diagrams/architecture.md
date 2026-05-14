# OpenClaw/default-preset Architecture Diagram

```txt
Telegram / chat channel
  ↓
OpenClaw Gateway + Agent Runtime
  ↓
influencer-persona plugin
  ├─ LLM JSON analyzer
  ├─ runtime context builder
  ├─ policy/media gates
  └─ Telegram/media delivery
  ↓
storage
  ├─ users/<id>.json
  ├─ influencer-self/state.json
  ├─ calendar/events.json
  ├─ social/drafts.json
  └─ social/media-jobs.json
  ↓
life modules
  ├─ life-tick
  ├─ journal-writer
  ├─ reflect-memory
  ├─ social-planner
  ├─ social-autonomy
  ├─ social-publisher
  └─ manager-audit
  ↓
skills
  ├─ influencer-image → Wavespeed / mock
  ├─ influencer-post → visible browser/noVNC / mock
  ├─ influencer-social
  ├─ influencer-calendar
  ├─ influencer-journal
  └─ influencer-recall
```
