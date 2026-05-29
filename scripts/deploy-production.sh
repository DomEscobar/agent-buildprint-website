#!/usr/bin/env bash
set -Eeuo pipefail

# Agent Buildprint production deploy pipeline.
# Intended to run on the production host after pushes to either:
# - DomEscobar/agent-buildprint
# - DomEscobar/agent-buildprint-website
#
# It pulls both repos, validates source + website, rebuilds the Docker Compose
# stack, and verifies the live public surface before exiting successfully.

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="${WEBSITE_DIR:-$(cd "$SCRIPT_DIR/.." && pwd)}"
SOURCE_DIR="${SOURCE_DIR:-$(cd "$WEBSITE_DIR/../blueprint" 2>/dev/null && pwd || true)}"
DEPLOY_LOCK="${DEPLOY_LOCK:-/tmp/agent-buildprint-deploy.lock}"
SITE_URL="${SITE_URL:-https://agent-buildprint.com}"
WEB_PORT="${WEB_PORT:-43117}"
LOCAL_BASE="${LOCAL_BASE:-http://127.0.0.1:${WEB_PORT}}"
SMOKE_SLUG="${SMOKE_SLUG:-local-rag-chat-workbench}"
SMOKE_DIR="${SMOKE_DIR:-/tmp/agb-live-smoke-production}"
SKIP_SOURCE_TESTS="${SKIP_SOURCE_TESTS:-0}"
SKIP_BACKEND_TESTS="${SKIP_BACKEND_TESTS:-0}"

log() { printf '[%s] %s\n' "$(date -Is)" "$*"; }
fail() { log "ERROR: $*"; exit 1; }
run() { log "+ $*"; "$@"; }

require_dir() {
  local dir="$1" name="$2"
  [[ -d "$dir/.git" ]] || fail "$name repo not found at $dir"
}

pull_ff() {
  local dir="$1" name="$2"
  require_dir "$dir" "$name"
  run git -C "$dir" fetch origin
  local branch
  branch="$(git -C "$dir" rev-parse --abbrev-ref HEAD)"
  [[ "$branch" == "main" ]] || fail "$name is on $branch, expected main"
  if [[ -n "$(git -C "$dir" status --porcelain)" ]]; then
    fail "$name has uncommitted changes; refusing to deploy dirty tree"
  fi
  run git -C "$dir" pull --ff-only origin main
  log "$name head: $(git -C "$dir" rev-parse --short HEAD) $(git -C "$dir" log -1 --pretty=%s)"
}

cleanup() {
  rm -f "$WEBSITE_DIR/server/bun.lock" 2>/dev/null || true
}
trap cleanup EXIT

main() {
  require_dir "$WEBSITE_DIR" "website"
  require_dir "$SOURCE_DIR" "source"

  exec 9>"$DEPLOY_LOCK"
  if ! flock -n 9; then
    log "Another deploy is already running; exiting cleanly."
    exit 0
  fi

  log "Starting Agent Buildprint production deploy"
  pull_ff "$SOURCE_DIR" "source"
  pull_ff "$WEBSITE_DIR" "website"

  if [[ "$SKIP_SOURCE_TESTS" != "1" ]]; then
    run npm --prefix "$SOURCE_DIR" test
  fi

  run npm --prefix "$WEBSITE_DIR" ci
  run npm --prefix "$WEBSITE_DIR" run sync:buildprints -- --source "$SOURCE_DIR"
  run npm --prefix "$WEBSITE_DIR" run build
  BUILDPRINTS_SOURCE="$SOURCE_DIR/buildprints" run npm --prefix "$WEBSITE_DIR" run check:buildprints
  run npm --prefix "$WEBSITE_DIR" run check:codex-drift

  if [[ "$SKIP_BACKEND_TESTS" != "1" ]]; then
    run docker run --rm -v "$WEBSITE_DIR/server:/app" -w /app oven/bun:1.2-alpine sh -lc 'bun install --silent && bun test'
  fi

  run docker compose -f "$WEBSITE_DIR/docker-compose.yml" --project-directory "$WEBSITE_DIR" build
  run docker compose -f "$WEBSITE_DIR/docker-compose.yml" --project-directory "$WEBSITE_DIR" up -d

  log "Waiting for local web/api health"
  for _ in {1..30}; do
    if curl -fsS "$LOCAL_BASE/api/health" >/dev/null; then break; fi
    sleep 1
  done
  run curl -fsS "$LOCAL_BASE/api/health"
  printf '\n'
  run curl -fsS "$SITE_URL/api/health"
  printf '\n'

  run curl -fsS "$SITE_URL/buildprints/$SMOKE_SLUG/package.json"
  rm -rf "$SMOKE_DIR"
  run node "$SOURCE_DIR/bin/agb.js" start "$SITE_URL/buildprints/$SMOKE_SLUG/package.json" "$SMOKE_DIR"
  [[ -s "$SMOKE_DIR/.buildprint/next-agent.md" ]] || fail "agb start smoke did not create next-agent.md"

  run docker compose -f "$WEBSITE_DIR/docker-compose.yml" --project-directory "$WEBSITE_DIR" ps
  log "Deploy complete"
}

main "$@"
