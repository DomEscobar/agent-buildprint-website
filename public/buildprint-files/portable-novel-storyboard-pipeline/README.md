# Toonflow Portable Creative Pipeline Buildprint

This v2 Buildprint describes a clean-room, portable webapp rebuild target for Toonflow's creative AI pipeline:

novel import -> chapter event extraction -> ScriptAgent skeleton/adaptation/script -> ProductionAgent storyboard table/panel -> asset/image/video adapters -> portable preview manifest.

It intentionally does not claim full Toonflow parity, desktop/Electron parity, provider parity, live video generation parity, or final stitched-video parity.

## V2 Read Order

1. `BLUEPRINT_V2_SUMMARY.md` - v2 changes, achievable scope, non-parity boundaries.
2. `WEBAPP_TARGET_SPEC.md` - concrete webapp architecture, pages, components, data flows.
3. `AGENT_HANDOFF.md` - task, build order, hard rules.
4. `AGENT_PROMPT_PACK.md` and `XML_OUTPUT_CONTRACT.md` - compact agent stage cards and parser contract.
5. `ASYNC_JOB_MODEL.md` and `PROVIDER_ADAPTERS.md` - job lifecycle and provider interfaces.
6. `HEAD_TO_FOOT_QA.md` - required end-to-end runtime QA gate for generated webapps.
6. `UI_CANVAS_MAP.md` and `PREVIEW_COMPOSITION_SPEC.md` - workbench mapping and preview/export substitute.
7. `BROWSER_QA_SCENARIOS.md`, `IMPLEMENTATION_ROADMAP.md`, `PARITY_CLAIMS.md` - QA, build phases, safe claims.
8. `CONTRACTS.md`, `LLM_FLOW.md`, `SYSTEM_MAP.md`, `TEST_MATRIX.md`, `QA_PLAN.md`, `TRACEABILITY_MATRIX.md` - v1 baseline contracts and evidence.

Start implementation only after the contracts and LLM flow are clear.
