# Head-to-Foot QA Plan

Purpose: prove the generated webapp works as a real runtime product flow, not only as isolated unit tests.

This QA plan is the required acceptance gate for any webapp built from this Buildprint v2.

## QA Levels

### Level 0 — Static Safety

Required checks:

- Buildprint package is self-contained.
- No source-repo paths are required at runtime.
- No secrets/API keys appear in artifacts.
- Safe/unsafe claims from `PARITY_CLAIMS.md` are visible in app/docs.
- Default provider mode is mock/no-network.

Evidence to record:

- command output for secret scan,
- list of runtime source files,
- safe-claim text in UI or docs.

### Level 1 — Unit/Contract Tests

Required checks:

- Ordered chapter import.
- Empty/invalid chapter import rejection.
- Observed-to-portable state mapping.
- Event success/failure states.
- ScriptAgent config/chapter-range guards.
- XML parser accepts valid agent output.
- XML parser rejects invalid/partial/malformed output.
- Storyboard row validation: row count, duration, asset refs, mode rules.
- No partial persistence after invalid XML.
- Async job success/failure/cancel/retry.
- Deterministic IDs/clock/manifest snapshot.
- No-network gate: `fetch`, `XMLHttpRequest`, and provider SDK entry points throw by default.

Required command:

```bash
npm test
```

Pass condition:

- all tests pass,
- test count and files recorded.

### Level 2 — Production Build

Required command:

```bash
npm run build
```

Pass condition:

- TypeScript/build passes,
- static assets generated,
- no build-time provider/network dependency.

### Level 3 — Real Browser Runtime Happy Path

This is the most important non-Jacky test.

Required flow in a real browser, preferably automated with Playwright/CDP:

1. Open app.
2. Load/import 3-chapter fixture.
3. Extract events.
4. Verify 3 chapter events render as success.
5. Open ScriptAgent workspace.
6. Run story skeleton.
7. Run adaptation strategy.
8. Write scripts.
9. Verify scripts render.
10. Open ProductionAgent workspace.
11. Extract assets.
12. Generate director plan.
13. Generate storyboard table.
14. Generate storyboard rows from XML/agent output path.
15. Generate mock storyboard images.
16. Generate mock track videos.
17. Open Preview timeline.
18. Verify timeline/track/clip UI renders.
19. Export/read manifest from rendered UI.
20. Assert manifest contains at least:
    - version `toonflow-blueprint-v2`,
    - 3 chapters,
    - 3 events,
    - >=1 script,
    - >=4 assets,
    - >=1 storyboard row,
    - >=1 track,
    - >=1 media record,
    - task log entries,
    - limitations/non-parity text.

Required command example:

```bash
npm run dev -- --host 127.0.0.1 --port 5179 --strictPort
APP_URL=http://127.0.0.1:5179/ node scripts/runtime-live-test.mjs
```

Pass condition:

- browser automation clicks actual rendered controls,
- manifest is parsed from rendered UI,
- all counts and limitation text pass,
- screenshot captured.

### Level 4 — Runtime Negative Paths

Required real-browser scenarios:

- Event extraction mock failure shows failure reason and retry option.
- Invalid storyboard XML shows validation error and prior rows remain unchanged.
- Delayed job cancellation marks job cancelled and does not create success artifact.
- Mock media failure creates failed media/task state and retry can succeed without duplicate owner media.
- Switching storyboard modes changes prompt/image/track behavior:
  - pure text: empty prompt, no image generation,
  - image-assisted: prompt required, tracks <= 15s,
  - first-frame: one row per track.

Pass condition:

- each failure is visible in UI,
- task log records reason,
- durable state remains consistent.

### Level 5 — Responsive/UX Smoke

Required checks:

- desktop width screenshot,
- mobile width screenshot,
- no overlapping critical controls,
- limitations visible near preview/export,
- provider settings clearly show mock default/live gated.

### Level 6 — Optional Live Provider Gate

Only run if explicitly enabled and credentials are available.

Required environment gates:

```bash
TOONFLOW_ENABLE_LIVE_PROVIDERS=1
NO_NETWORK=0
```

Required checks:

- one live text provider smoke can generate event or script artifact,
- provider error is normalized into `errorReason`,
- no secret is persisted in manifest/task log,
- mock tests still pass without credentials.

This level is optional and must never be required for default CI.

## Required QA Artifacts

Every build should produce:

- `BUILD_REPORT.md`
- `RUNTIME_LIVE_TEST_REPORT.md`
- browser screenshot(s)
- test/build command logs or summary
- exported/parsed manifest sample
- explicit remaining gaps

## Current v2 Build Evidence

The first v2 webapp build produced these runtime evidence artifacts:

- App path: `/root/.openclaw/workspace/research/toonflow-webapp-v2-build-2026-05-16/`
- Runtime script: `scripts/runtime-live-test.mjs`
- Runtime report: `RUNTIME_LIVE_TEST_REPORT.md`
- Screenshot: `docs/screenshot-v2-runtime-live.png`

Runtime manifest checks from that build:

```json
{
  "version": "toonflow-blueprint-v2",
  "chapters": 3,
  "events": 3,
  "scripts": 1,
  "assets": 4,
  "storyboardRows": 2,
  "tracks": 1,
  "media": 3,
  "jobs": 13
}
```

## Non-Parity Boundary

Passing this QA proves a credible clean-room webapp implementation of the portable Toonflow-style workflow.

It still does not prove:

- exact Toonflow UI/canvas parity,
- live provider output quality,
- Electron behavior,
- final stitched-video export,
- full route/API parity.
