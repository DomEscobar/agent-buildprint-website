# Unreleased source CLI integration — versioned opt-in

This package now opts into the implemented `agb/runtime/v2` engine through `package.json` → `runtime.json`. The kernel/v1 spine and loop-index/v1 remain backward-compatible packet structures. `runtime.json` supplies explicit dependency/approval/acceptance routing for the same six loops. The mutable active loop lives in `.buildprint/HEAD.json`'s selected revision, never by editing snapshots.

Source-authoring status only: no CLI command, scaffold, tests, build, browser QA or independent review has been run for this integration. The original `AUTHORING_REPORT.md` remains historical; see the appended overhaul note and repository `docs/cli-overhaul-report.md`.

## Commands that now exist

Only from a separately supplied checkout containing the unreleased v2 overhaul (`src/runtime/` and `docs/cli-runtime-v2.md`). Public npm `agent-buildprint@0.0.17` has no v2 runtime; do not substitute installed `agb` or assume cloning public main supplies it. This publication ships the packet, not the CLI. If that source is unavailable, direct-read the hosted packet for alignment/planning and report automated setup/progression blocked; never simulate its state or weaken acceptance:

```sh
node ./bin/agb.js start ./buildprints/standalone-isometric-game/package.json /existing/scaffolded/game
node ./bin/agb.js start ./buildprints/standalone-isometric-game/package.json /existing/scaffolded/game --resume
node ./bin/agb.js bootstrap ./buildprints/standalone-isometric-game/package.json /new/game --allow-scaffold --framework /pinned/framework --archive /trusted/isometric-framework-0.1.0.tgz --archive-sha256 <trusted-digest>
node ./bin/agb.js state status /game
node ./bin/agb.js loop next /game
node ./bin/agb.js packet next /game
node ./bin/agb.js state approve /game --revision <current> --receipt /game/.game-quality/approval.json
node ./bin/agb.js loop begin /game --revision <current> --receipt /game/.game-quality/begin.json
node ./bin/agb.js evidence bind /game --revision <current> --receipt /game/.game-quality/build-binding.json
node ./bin/agb.js evidence record /game --revision <current> --receipt /game/.game-quality/evidence.json
node ./bin/agb.js loop accept /game --revision <current> --receipt /game/.game-quality/accept.json
node ./bin/agb.js loop advance /game --revision <current> --receipt /game/.game-quality/advance.json
```

`loop defect`, `resolve-defect`, `return`, `resolve-return` use the same revision/receipt arguments. All receipts have `schema: agb/receipt/v2`. The unreleased source checkout includes `docs/cli-runtime-v2.md` and `docs/schemas/` with exact fields, recovery commands, limits and security boundaries. These are code-backed commands, not instructions to execute checks during this authoring task.

## Bootstrap and authority

`start` alone stages and publishes packet state into an existing host (or creates a new project directory); it does not scaffold. `bootstrap` copies the exact committed framework template blobs plus a separately supplied SHA-256-checked opaque archive, then publishes host plus state. It requires explicit copy consent, does not execute manifest/framework shell commands, and does not install/build dependencies or run the upstream script. Existing user files are never merged. Empty/contract-only scaffold targets use a documented two-rename recovery journal and retain the original; this is NOT an atomic directory swap. A new destination or a `.buildprint` insertion uses a single publication rename. State revisions use atomic HEAD replacement with locks and expected revision checks; local POSIX assumptions and race limitations are explicit in the CLI guide.

The framework pin/tree is enforced only by the fixed `bootstrap` adapter. Plain `start` just snapshots the lock. Archive hash matching establishes byte identity, not publisher authentication or provenance from that source. Missing trusted archive/build authorization is a setup blocker; do not fabricate one or run upstream `build:package` when its included checks are prohibited.

Remote manifests use bounded credential-free HTTPS, no redirects, same-origin payloads and versioned manifest/file digests. Local v2 strings resolve beside the manifest. The website publishes https://agent-buildprint.com/buildprints/standalone-isometric-game/package.json with real same-origin payload digests and https://agent-buildprint.com/buildprints/standalone-isometric-game/package.sha256. The sidecar establishes byte identity, not a separately trusted manifest channel. No public CLI compatibility is claimed. Old manifests without runtime opt-in retain legacy state shapes and packet operations; existing state is never overwritten or silently migrated. `--resume` validates the existing v2 snapshot and same source inventory, not a refresh.

## Game loop binding

Five recorded approvals bind to the actual contract hash: `contract`, `setup`, `mobile-ux`, `asset-policy`, `acceptance-execution`. They mirror real authorized decisions, not grant them. Preserve prior answers; ask at most three unresolved alignment questions per batch. Record no-spend/fallback decisions without pretending provider access exists. User/host policy remains authoritative.

Loop 01 requires implementation attestation; loops 02–06 require separately selected implementation, functional and visual attestations. Calibration does not reduce scope. Full-coverage loops 05 and 06 additionally require every requirement and protected view from the bound upstream v3 acceptance plan. Use the loop ID as the routing coverage entry, plus real plan requirement IDs. The plan is derived from the one contract, not an alternate human brief.

Bind full project code/build/assets, package and lock, architecture, setup receipt, installed framework tree, v3 plan and comparison references. Source-to-running-build correspondence still needs real capture/reviewer observation: the CLI cannot infer it from a command string. New candidates stale earlier receipts; this engine deliberately requires fresh predecessor re-attestations after changed builds rather than pretending granular receipt reuse is verified. Open defects/returns block progression. Defects require fixes and fresh same-dimension evidence; return routes preserve decisions and reopen alignment/setup/identity work. Never reduce scope or alter targets to get a pass.

CLI state references upstream detailed production receipts; it does not replace their production stages, plan, freeze, comparison or actual review. No automatic capture, provider or critic integration is invented. `implemented_attested`, `functional_attested` and `visual_attested` mean selected, byte-bound recorded claims. PNG/video signatures and artifact hashes cannot judge pixels, establish playback, authenticate execution or prove reviewer independence. Genuine unavailable capabilities mean unverified. Independent review is required when the contract-derived plan selects it; self-declared mode is still only a recorded claim.

## Remaining real gaps

- No executed compatibility/security/acceptance proof for this overhaul; authored regressions remain unexecuted.
- No automated legacy migration, granular input-root reuse, remote scaffold checkout/archive downloader, source-to-archive attestation or publisher signature verification.
- No adversarial-filesystem race sandbox, cross-filesystem atomicity, shared-host lock recovery or tamper-proof history.
- No built-in live capture, motion playback/semantic judgment, reviewer identity authentication or completeness inference from prose.
- The pinned upstream WaveSpeed wrapper still lacks `bria/remove-background`; no Media4Agents adapter was identified. Preferred **WaveSpeed + (RetroDiffusion OR Media4Agents)** and exact `bytedance/seedream-v5.0-pro/edit`/Bria availability and budget preflights remain mandatory, with honest gaps/free-only fallbacks.
- Reuse installed framework skills. No generated harness recommendation overrides execution restrictions or the skill_workshop-only reusable skill authoring rule.
