# Codex Dogfood Review: Mapper OS On FeedMe

## What Worked

- OBSERVED: The public prompt correctly directed the agent to use `.buildprint/next-agent.md` after bootstrap and not edit snapshot files.
- OBSERVED: Mapper OS discovery flow produced the right shape: `SYSTEM_MAP.md`, `BUILDPRINT_CANDIDATES.md`, `questions.md`, then selected extraction.
- OBSERVED: Fidelity-depth language was useful. It prevented accidental claims of provider parity, feed-source parity, hosted-product parity, or full clone parity.
- OBSERVED: Required `PARITY_CLAIMS.md`, `HEAD_TO_FOOT_QA.md`, and `TRACEABILITY_MATRIX.md` improved claim discipline for a product-adjacent workflow.
- OBSERVED: The candidate-first process found a stronger tiny scope than a vague full FeedMe clone: the static RSS update pipeline.

## Ambiguity Or Friction

- OBSERVED: `.buildprint/next-agent.md` says to update `.buildprint/state.json`, `progress.md`, and `next-agent.md` before stopping, while the user explicitly said snapshot files are present and not to edit them. It is ambiguous whether state files count as snapshots or mutable run state.
- OBSERVED: The public prompt says "Do not require a CLI" while also prescribing `agb start ...` if snapshots are not present. In this run snapshots were present, but the wording can confuse agents about whether CLI bootstrap is mandatory.
- OBSERVED: Mapper OS says "ask me to choose one candidate", but dogfood automation supplies a simulated choice. The system handled this, but templates could explicitly support "simulated/noninteractive selection".
- OBSERVED: Required artifact set is large even for a tiny candidate. Some artifacts (`THREAT_MODEL.md`, `OBSERVABILITY.md`, `QUALITY_SCORECARD.md`) were useful but risk becoming templated filler if not tightly scoped.

## Missing Or Weak Artifacts

- INFERRED: There is no compact "tiny candidate artifact profile" that lists minimum required files for non-UI workflow candidates.
- INFERRED: `SUBMISSION_CHECKLIST.md` contract does not explicitly require "commands not run and why"; extraction prompt mentions it, but checklist contract could make it mandatory.
- INFERRED: The Mapper templates need clearer treatment of source bugs discovered during mapping. Example: FeedMe Docker passes `DATA_DIR`, while update script ignores it. The correct Mapper behavior is to record as risk/out-of-scope unless selected, not fix source.

## Parity And Depth Handling Flaws

- OBSERVED: The depth menu is strong, but it does not name "feed-source parity" separately. This repo needed that boundary because live RSS availability/content is distinct from provider parity and hosted parity.
- OBSERVED: `runtime-parity` wording can be too broad for a cheap mocked proof. This run used "compact runtime proof" but avoided claiming runtime parity.
- INFERRED: Mapper OS should separate "runtime proof with mocks" from "runtime parity" in prompts to reduce overclaiming.

## QA And Runtime Evidence Gaps

- OBSERVED: Original repo has no tests and no `node_modules`; `pnpm build` was not run.
- OBSERVED: Clean-room Node proof covered core contracts, but did not build the original app.
- OBSERVED: No Playwright QA was run because selected candidate excluded UI/workbench parity.
- QUESTION: Whether Mapper OS should require an original-repo build attempt even when dependencies are absent and network is restricted. Current guidance says run lightweight verification that makes sense; that was sufficient here.

## Concrete Mapper OS Fixes Recommended

1. Clarify that `.buildprint/state.json`, `progress.md`, and `next-agent.md` are mutable run-state files, or remove the requirement when user says not to edit `.buildprint`.
2. Add "noninteractive/simulated selection" guidance for dogfood/CI runs.
3. Add `feed-source-parity` as a named explicit non-claim/evidence category for RSS/API aggregation projects.
4. Split "mocked runtime proof" from `runtime-parity`.
5. Add a tiny-scope required artifact profile to reduce filler while preserving claim discipline.
6. Require `commands not run and why` in `SUBMISSION_CHECKLIST.md`.
7. Add a rule for discovered source defects: document them as observed risks unless the selected scope is "fix source".

