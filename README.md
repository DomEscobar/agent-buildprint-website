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

Buildprint files are served from the canonical Agent Buildprint repo (the `BUILDPRINTS_SOURCE` build input, normally `/root/agent-buildprint/buildprints`) through generated `/buildprints/{slug}/files/*` routes. Website-owned publication snapshots under `buildprints/{slug}/` take precedence for their slug and use that same importer/schema/route system, including in CI. Do not copy or edit `public/buildprint-files` as a source of truth. The standalone-isometric-game snapshot is website-owned so it can be published without releasing or altering the dirty CLI project; its source and compatibility boundary are documented in `docs/standalone-isometric-publication.md`.

## Agent bootstrap UX

For legacy/runtime-supported packets, the Buildprint prompt recommends `agb start <package-manifest-url>` when AGB is available. AGB is optional: users may install it globally with `npm install -g agent-buildprint`, or clone `DomEscobar/agent-buildprint` and run `node agent-buildprint/bin/agb.js start ...` without a global install. Both legacy paths create `.buildprint/`, download exact snapshot files, and write continuation state before implementation begins. Exception: an unreleased `agb/runtime/v2` packet must use direct-reading guidance and disclose the missing public runtime. Do not substitute public `agb@0.0.17` or a main-branch clone for separately supplied unreleased source. Its manifest preserves the v2 runtime descriptor/read order and byte-bound payloads; `package.sha256` matches the generated manifest bytes, but is not an independently trusted channel.

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
