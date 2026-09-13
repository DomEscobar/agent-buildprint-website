# Align the full standalone game

## Goal
Turn the player's desired experience into one approved, original isometric game with complete agreed content, connected traversal, readable actions, responsive controls and honest visual/gameplay acceptance. “Full” means the approved requirement set, not an arbitrary commercial scale and not a compulsory tiny slice.

## Alignment in batches
Inspect the existing project, instructions, contract, decisions and references before asking. Draft the contract for the user; do not send a technical form to fill out. Ask at most three questions per batch, fewer when enough; avoid reconfirming answered choices.

1. Resolve missing experience: player fantasy, repeated verbs, success/failure or peaceful completion, complete regions/content/modes and exclusions. Identify supporting details the agent may choose. Do not infer combat or quests solely from “lively world.”
2. Resolve missing presentation: original style references (style-only by default), actor/world proportions, desired motion, target devices/orientations, keyboard/touch controls and accessibility. Distinguish layout or both only on explicit instruction.
3. Resolve missing authority: asset rights/technique; generation only if needed, access and budget; local versus hosting; privacy/saves/destruction. Obtain explicit authorization for future running-build visual/gameplay acceptance, independent review where available and performance measurement if required by full-world acceptance. These are game-workflow decisions, not authorization to run them during packet authoring.

Summarize the entire deliverable using `templates/PROJECT_CONTRACT.md`. Offer reversible defaults with tradeoffs; mark assumptions distinctly from user requirements. Obtain approval before implementation or paid generation. Already-approved contracts proceed unchanged. Later changes require a user-approved amendment identifying superseded requirement IDs and downstream baseline implications, not a second contract.

## Hard-stop questions
Stop before `01-setup.md` if an applicable hard-stop decision is unresolved. A blocker can be documented while unrelated authorized discussion continues; recording a blocker does not authorize crossing it.

| Decision | Required resolution |
| --- | --- |
| Product/artifact identity | Player experience, full scope, explicit exclusions, mode support and agent-delegated choices. |
| Deployment posture | Confirm trusted_local or another explicitly requested posture; no implied push/deploy. |
| Secrets and provider policy | Confirm no-spend path or selected technique, authorized uploads, protected credential entry and capped spend. |
| Destructive/data-loss behavior | Preserve existing work/saves; specific approval for replacement, migration or reset if applicable. |
| Privacy/compliance exposure | Confirm applicable telemetry, accounts, private references, data retention and third-party exposure, or explicit not-applicable. |

Use `confirmed_by: user` or `confirmed_by: explicit_user_delegation`; `agent_assumption` is invalid for hard stops. Approved answers live in `PROJECT_CONTRACT.md`. `.buildprint/decisions.md` contains pointers to those answers and blocking decisions, not a conflicting requirements copy. Before scaffolding, keep the destination contract-only; the copy-only `agb bootstrap` stages host and state together, or use scaffold then `agb start`. Never merge into an existing game.

## Assumable defaults
Within delegated boundaries: preserve all existing data; keep authoring tools local; no telemetry/accounts, no paid calls and no public release until authorized; use the framework rather than inventing an engine. Do not use these defaults to silently remove an explicitly requested mode or invent hard-stop approval. Map size, style and acceptance thresholds must serve the agreed experience.

## Deferrable questions
Store listing, future expansions, monetization and unrelated multiplayer services can wait only if excluded from the current approved scope. Requested content cannot be relabeled backlog to make calibration look finished.

## Acceptance criteria
- Every approved region, route, actor/action, system, state and supported device has stable requirement coverage, including objective/failure-or-undo/restart and saves where promised.
- An aligned observable target covers visual hierarchy, material treatment, contacts, scale, motion and interaction; original references remain protected.
- Mobile-first UX specifies purpose, information hierarchy, next action, touch behavior and desktop adaptation before UI coding.
- Original maps and host-owned art use public package exports; no demo/example host, sprites, maps, palettes, characters, layouts or asset URLs are copied by default.
- Preferred-stack availability, spending approval, provenance and explicit free-only limitations are honest; fallback receives the same visual scrutiny.
- The framework v3 visual production loop establishes actual packed-art, complete world, motion and gameplay acceptance tied to current inputs and captures. Missing capability or authorization means unverified.
- Handover separates implemented, functionally verified and visually accepted, with motion/performance and independent-review status separate; no unsupported completion or deployment claim.
