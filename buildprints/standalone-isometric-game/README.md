# Full Standalone Isometric Game

A complete local authoring packet for an original game built with DomEscobar/isometric-framework. Full means the approved game scope, not the framework demo and not a vertical-slice cap. Completely separate from `guided-2d-game`; no dependency on or modifications to that packet.

**Status: published instruction packet; v2 runtime unreleased and untested.** Website publication is not a CLI release or proof of a working game. No CLI, scaffold, regression, gameplay, browser or independent acceptance checks were run for this publication.

## Start here — direct reading, no CLI required

1. Open the [agent guide](https://agent-buildprint.com/buildprints/standalone-isometric-game/agent.md) or [hosted package manifest](https://agent-buildprint.com/buildprints/standalone-isometric-game/package.json). Read `BUILDPRINT.md` and `00-goal.md` through the manifest's `rawUrl` links, then follow `instructions.readOrder`. Preserve one approved `PROJECT_CONTRACT.md`; ask at most three consequential unresolved questions per batch.
2. Direct reading is immediately available for alignment and planning. It does not create `.buildprint` state, execute code or record approvals. Do not fabricate CLI receipts or mark any loop accepted.
3. Before game setup, read `01-setup.md` and `references/framework.md`. The framework pin is [7542ff68de04ca6ea6736974b54ec5b5dde1cc33](https://github.com/DomEscobar/isometric-framework/tree/7542ff68de04ca6ea6736974b54ec5b5dde1cc33). There is no published npm framework package or prebuilt archive supplied here. The upstream local `build:package` includes prerequisite boundary/type checks and needs separate authorization. No fake tarball or digest is provided.
4. **Public `agent-buildprint@0.0.17` does not contain `agb/runtime/v2`.** Do not run the v2 commands below with installed public `agb`, `npx`, or assume a normal public-main clone includes them. V2 automated setup/progression requires a separately supplied source checkout containing the unreleased overhaul. Without it, report the automation blocker and continue only authorized direct-reading/planning work; all game acceptance criteria remain unchanged.

The [manifest SHA-256](https://agent-buildprint.com/buildprints/standalone-isometric-game/package.sha256) and per-payload SHA-256 fields identify actual hosted bytes. A digest from the same website is not an independent trusted channel, publisher signature or game-quality evidence. The generated hosted manifest is distinct from the local loader manifest exposed under `files/package.json`.

## Unreleased source-only commands — not public installed agb
Only in a separately obtained checkout containing the unreleased v2 overhaul (`src/runtime/` and `docs/cli-runtime-v2.md`), the following source entrypoints are implemented but unexecuted. The authoring environment held it at `/root/agent-buildprint`; that local path is not a public distribution. Public main and npm must not be assumed to contain this source. Align and approve the one contract before setup.

```sh
# Existing scaffolded host; no host files are merged or overwritten.
node ./bin/agb.js start ./buildprints/standalone-isometric-game/package.json /absolute/path/to/my-isometric-game
# Or a new/empty/contract-only host, with explicit template-copy consent and trusted archive:
node ./bin/agb.js bootstrap ./buildprints/standalone-isometric-game/package.json /absolute/path/to/my-isometric-game --allow-scaffold --framework /pinned/framework --archive /trusted/isometric-framework-0.1.0.tgz --archive-sha256 <trusted-digest>
```

Replace example paths/digest. `bootstrap` reads pinned Git template blobs and copies a digest-checked opaque archive; it does not run manifest commands, the framework scaffold script, package installs or checks. Source-to-archive provenance remains the operator's responsibility. See `01-setup.md` for the authorized upstream preparation alternative and `references/cli-integration.md` for precise publication/recovery semantics. Never overwrite existing packet state. V2 continuation uses the same `start` command with `--resume`; source changes require an explicit migration decision.

For that unreleased source only, read `.buildprint/next-agent.md`, then `node ./bin/agb.js state status /game` and `node ./bin/agb.js loop next /game`. The versioned engine records explicit approvals, prerequisites, defects, returns and separately byte-bound implemented/functional/visual **attestations**, not CLI-verified pixels or gameplay. Commands and JSON receipt contracts are in that source checkout’s `docs/cli-runtime-v2.md`. Actual test/capture/review/spend authorization remains with the owner. Missing capability stays unverified.

Optional future checks, ONLY if requested (none run for this authoring task):

```sh
node ./bin/agb.js packet check ./buildprints/standalone-isometric-game
node ./bin/agb.js packet next ./buildprints/standalone-isometric-game
```

`packet next` on a packet prints the default loop; on a v2 project it reads current state. Only explicit `loop begin/accept/advance` mutations change progression. `agb check` is the legacy graph-blueprint checker, not the kernel packet command. The hosted manifest and direct-reading path above are published; automated runtime compatibility is not verified.

## Package map
- `BUILDPRINT.md`, `00-goal.md`, `01-setup.md`, `02-identity.md`: briefing, alignment, safe scaffold/bootstrap, mobile-first UX.
- `blueprint.yaml`, `loops/loop-index.yaml`, `loops/loop-flow.md`, `runtime.json`: supported kernel routes, versioned approval/evidence prerequisites and six full-game loops.
- `framework-lock.json`, `references/framework.md`: exact upstream pin, verified provenance and skill catalog links.
- `references/assets.md`, `references/visual-acceptance.md`: preferred asset policy and substantive reuse of upstream v3 visual acceptance.
- `references/cli-integration.md`: current supported manifest/CLI behavior and real gaps.
- `templates/`: contract, UX outline, setup receipt, acceptance-plan routing, asset provenance, generation ledger and capture receipt.
- `review.md`, `HANDOVER.md`: authorized future acceptance and honest delivery.
- `package.json`: explicit local snapshot file manifest for unreleased v2 source `start`, not public installed `agb`.
- `publication.json`: existing publication metadata format with `publish: true` for website publication only.
- `AUTHORING_REPORT.md`: local scope, static inspection evidence, gaps and untested status.

Skills are linked at the exact framework commit and later read from its installed package; none are copied or authored here. Framework production receipts remain the detailed live quality evidence; CLI state owns routing and byte-bound attestation references, not an alternate quality workflow. Package templates are not game requirements or evidence until populated for an actual approved project.
