# Agent Handoff

Use this file first if you are a coding agent rebuilding the Toonflow portable creative pipeline from this Buildprint.

## Mission

Build a clean-room, deterministic service proof that turns fixture novel chapters into a portable short-drama production package:

`Project + Chapters -> Event Summaries -> Script Plan + Scripts -> Assets -> Storyboard Table + Storyboard Rows -> Mock Media Tasks -> Portable Preview Manifest`

Do **not** rebuild Toonflow's Electron app, full canvas UI, live provider integrations, or final video stitching.

## Read Order

1. `AGENT_HANDOFF.md` — what to build and what to ignore.
2. `CONTRACTS.md` — schemas, states, adapters.
3. `LLM_FLOW.md` — ScriptAgent/ProductionAgent flow and prompt invariants.
4. `SYSTEM_MAP.md` — module boundaries and relationships.
5. `TEST_MATRIX.md` + `QA_PLAN.md` — validation gates.
6. `TRACEABILITY_MATRIX.md` — source evidence if needed.

Avoid spending first-pass attention on optional docs until tests and contracts are clear.

## Build Order

1. Create deterministic domain models and repositories.
2. Add fixture loader with 3 ordered chapters.
3. Implement event extraction with mock text provider.
4. Implement ScriptAgent service as staged deterministic/mock outputs: skeleton -> adaptation -> scripts.
5. Implement asset extraction and de-dup/linking.
6. Implement ProductionAgent service: director plan -> storyboard table -> storyboard rows.
7. Implement media task adapters with mock image/video providers only.
8. Implement portable preview manifest export.
9. Add tests before any UI.

## Hard Rules

- Default tests must make zero network calls.
- Use deterministic IDs and clock for snapshots.
- Preserve workflow states and transitions.
- Keep live providers behind interfaces only.
- Do not store secrets or provider values.
- Do not claim final stitched-video parity.
- If a source behavior is unclear, mark it `INFERRED` and choose the safe portable default.

## Minimal Acceptance

A clean-room proof passes when:

- A 3-chapter fixture imports with stable chapter order.
- Event extraction records success and failure states.
- Script stages produce stored skeleton, adaptation, and scripts.
- Asset extraction de-dupes names and preserves script links.
- Storyboard rows preserve row count, duration, track grouping, and asset links.
- Mock media tasks record generated/failed states.
- Preview manifest snapshot includes chapters, events, scripts, assets, storyboard rows, tracks, media records, and task log.
