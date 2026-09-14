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

Buildprint files are served from the canonical Agent Buildprint repository (`BUILDPRINTS_SOURCE`, normally `/root/agent-buildprint/buildprints`) through the existing generated `/buildprints/{slug}/files/*` routes. Publication metadata and packet payloads remain versioned together in that source repository; there is no website-owned duplicate packet. Do not edit generated/public files as the source of truth.

## Agent bootstrap UX

For legacy packets, the Buildprint prompt recommends `agb start <package-manifest-url>` when AGB is available. Versioned `agb/runtime/v2` packets derive installed-package support and publication availability from their source metadata instead of a website-wide version assumption. The website emits an npm command only when a compatible version is explicitly marked published. Otherwise it uses one fresh checkout's matching CLI and packet, records that checkout's HEAD, and keeps direct reading available. Both routes create `.buildprint/` state before implementation. `package.sha256` matches generated manifest bytes but is not an independently trusted channel, and runtime records are not game or visual acceptance.

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
