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
npm run test:server
npm run check:buildprints
```

Buildprint files are served from the canonical Agent Buildprint repo at `/root/blueprint/buildprints` through generated `/buildprints/{slug}/files/*` routes. Do not copy or edit `public/buildprint-files` as a source of truth.

## Agent bootstrap UX

Every Buildprint prompt should start with `agb start <package-manifest-url>`. This creates `.buildprint/`, downloads exact snapshot files, and writes continuation state before implementation begins.

## Production Docker

The production stack serves the static Astro site through nginx and proxies `/api/*`
to the Bun engagement API. Anonymous Buildprint views and likes are stored in a
SQLite database on the `engagement_data` Docker volume.

```bash
docker compose up -d --build
docker compose logs -f web api
```

Useful environment variables:

- `WEB_PORT` defaults to `43117`.
- `SITE_URL` defaults to `https://agent-buildprint.com` during the web build.
- `DATABASE_PATH` defaults to `/data/engagement.sqlite` inside the API container.

Backup the SQLite database before destructive VPS work:

```bash
docker compose exec api cp /data/engagement.sqlite /data/engagement.backup.sqlite
```
