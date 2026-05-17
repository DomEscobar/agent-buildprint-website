# VALIDATION_REPORT

Status: fully published and live-bootstrap validated.

## Source mapping

Primary mapped repo: `TheSyart/emperor-agent` at shallow clone commit `d9761740bf82b9d5a91e5d8cda44ab5643bab59d`.

Mapped evidence zones: `agent/runner.py`, `agent/webui.py`, `agent/providers/*`, `agent/tools/*`, `agent/mcp/*`, `agent/memory.py`, `agent/compactor.py`, `agent/subagents/*`, `agent/team/*`, `agent/telemetry.py`, and `webui/src/views/*.vue`.

## Local proof

Command:

```bash
cd /root/AGB-website/public/buildprint-files/portable-personal-agent-chat-os/proof
npm test
```

Result: passed, 5/5 Node tests.

Covered:

- streamed deltas before turn completion
- skill selection + write tool execution + critic subagent delegation + telemetry
- default shell denial policy
- fake MCP tool mapped through ToolSpec boundary
- memory compaction under token/context pressure with checkpoint clearing

## Website build

Command:

```bash
cd /root/AGB-website
npm run build
```

Result: passed. Static build generated the human page, agent.md, prompt.txt, package.json, and snapshot file routes for `portable-personal-agent-chat-os`.

## Manifest completeness

Generated manifest: `dist/buildprints/portable-personal-agent-chat-os/package.json`.

Result: passed. Manifest lists 26 files and every listed local source file exists under `public/buildprint-files/portable-personal-agent-chat-os`.

## Local bootstrap validation

Command:

```bash
cd /root/AGB-website
PUBLIC_SITE_BASE=http://127.0.0.1:8765 npm run build
python3 -m http.server 8765 -d dist
node /root/blueprint/bin/agb.js start http://127.0.0.1:8765/buildprints/portable-personal-agent-chat-os/package.json /tmp/agb-agent-chat-os-bootstrap
cd /tmp/agb-agent-chat-os-bootstrap/.buildprint/snapshots/proof
npm install
npm test
```

Result: passed. `agb start` downloaded 26 exact snapshot files; bootstrapped proof passed 5/5 tests from snapshots.

## Live validation

Live manifest:

`https://agent-buildprint.com/buildprints/portable-personal-agent-chat-os/package.json`

Result: passed. HTTP 200, manifest slug `portable-personal-agent-chat-os`, 26 files.

Live raw URL check: passed, 26/26 raw snapshot URLs returned HTTP 200.

Live bootstrap command:

```bash
node /root/blueprint/bin/agb.js start https://agent-buildprint.com/buildprints/portable-personal-agent-chat-os/package.json /tmp/agb-agent-chat-os-live-bootstrap
cd /tmp/agb-agent-chat-os-live-bootstrap/.buildprint/snapshots/proof
npm install
npm test
```

Result: passed. `agb start` downloaded 26 exact snapshot files from the live manifest; bootstrapped live snapshot proof passed 5/5 tests.

## Published commits

- `91deefa Add portable personal agent chat OS buildprint`
- live validation report update commit pending/pushed separately if this file is updated after first publish.
