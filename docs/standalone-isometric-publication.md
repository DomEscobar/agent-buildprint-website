# Standalone isometric website publication

## Ownership and source

- Website repository: `DomEscobar/agent-buildprint-website`, local `/root/AGB-website`.
- Authored input: `/root/agent-buildprint/buildprints/standalone-isometric-game`, all 32 files copied into this website's `buildprints/standalone-isometric-game`.
- Input source HEAD: `1fb21c4376b6e36404be3fc64fc76df8e0b37a8b`; packet and v2 runtime were uncommitted. This SHA alone does **not** identify the uncommitted packet or runtime.
- Website snapshot modifications are limited to publication metadata, manifest category/status, and distribution/compatibility instructions. The original six loops, runtime definition, framework lock, evidence/contract/UX templates, asset policy, review and handover are preserved byte-for-byte.
- The original CLI worktree, including dirty README/bin/package files and untracked runtime/docs/tests/packet, is not modified, committed, published to npm or deployed by this website change.
- The existing importer merges website-owned publication snapshots by slug; there is no parallel registry, download server or custom archive service. Future changes to this snapshot must be explicit, not silently overwritten by upstream sync.

## Public contract

Expected routes:

- `/buildprints/standalone-isometric-game/`
- `/buildprints/standalone-isometric-game/agent.md`
- `/buildprints/standalone-isometric-game/prompt.txt`
- `/buildprints/standalone-isometric-game/package.json`
- `/buildprints/standalone-isometric-game/package.sha256`
- `/buildprints/standalone-isometric-game/files/{path}`

The generated package carries the original `agb/runtime/v2` descriptor, explicit read order and SHA-256 for every hosted payload. The digest sidecar hashes exactly the package endpoint's JSON serialization. It is byte identity, not independent provenance, signatures, verified CLI transport behavior or game acceptance. `files/package.json` is the local loader manifest payload, not the generated remote manifest.

## Compatibility observed read-only on 2026-09-13

- npm `agent-buildprint` latest: `0.0.17`; tarball gitHead `acce05c1e45d7501d170dfe825b4f11540b52eba`; distributed tarball contains no `src/runtime/` modules. No runtime execution was used to inspect it.
- The local v2 overhaul is unreleased and untested; no automatic CLI install/start prompt is offered for this packet. Direct reading supports alignment/planning now. V2 automated state/bootstrap/progression requires separately supplied overhaul source and remains unverified; absent source is a blocker, not permission to simulate state.
- npm `isometric-framework` latest endpoint returned 404. Public GitHub commit `7542ff68de04ca6ea6736974b54ec5b5dde1cc33` returned 200 with tree `5363d058a3e15e6025a5a66bda09da343ca5215e`; local checkout is clean at that pin.
- Use the pinned framework's real `docs/CREATE_GAME.md` source-build/scaffold path. `build:package` includes prerequisite checks requiring separate authorization. No prebuilt/fake framework archive or archive digest is included.
- Website publication grants no game execution, provider spend or game deployment authorization. WaveSpeed + (RetroDiffusion OR Media4Agents), exact Seedream edit and Bria requirements, real captures/reviews and full-scope acceptance are unchanged.

## Mobile-first presentation

Purpose: determine the packet's scope/compatibility and hand it to an agent. Hierarchy: title/scope → explicit published-packet/runtime-untested status → direct-reading start guide → full README → existing copy-prompt and manifest/digest utilities. Existing responsive cards, links and utility panel are reused; no new layout, gesture, hidden mobile-only action or visual-proof claim. Copy behavior is unchanged. Rendered/browser QA is not run.

## Deployment boundary

The production `scripts/deploy-production.sh` currently requires clean tracked source and website trees, pulls both repos, runs source/runtime smoke gates and rebuilds both web and API. The source worktree is dirty and local source HEAD is ahead of remote main. Do not run it against an old clean clone, alter/clean/push that CLI work merely to satisfy deployment, silently skip mandatory gates, or rebuild the API for this static publication.

A required website build and canonical generated-route/content/digest checks are publication evidence only, not CLI/regression/game/browser acceptance. A prepared build or pushed branch is not a public deployment. Final deployment state and public HTTP evidence must be reported separately.
