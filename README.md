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
- `/buildprint-files/{slug}/{path}`

## Development

```bash
npm install
npm run dev
npm run build
```

The static raw Buildprint files under `public/buildprint-files/` are copied from the Agent Buildprint repo before deployment.
