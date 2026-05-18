# Agent Buildprint Website

Agent-first registry UI for Agent Buildprint.

## What this site exposes

Human pages:

- `/`
- `/buildprints/`
- `/buildprints/{slug}/`

Agent endpoints:

- `/llms.txt`
- `/buildprints/index.json`
- `/buildprints/{slug}/agent.md`
- `/buildprints/{slug}/package.json`
- `/buildprints/{slug}/prompt.txt`
- `/buildprints/{slug}/files/{path}`

## Development

```bash
npm install
npm run dev
npm run build
npm run check:buildprints
```

Buildprint files are served from the canonical Agent Buildprint repo at `/root/blueprint/buildprints` through generated `/buildprints/{slug}/files/*` routes. Do not copy or edit `public/buildprint-files` as a source of truth.

## Agent bootstrap UX

Every Buildprint prompt should start with `agb start <package-manifest-url>`. This creates `.buildprint/`, downloads exact snapshot files, and writes continuation state before implementation begins.
