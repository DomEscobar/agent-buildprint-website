# Parity Claims

## Safe Claims

- Clean-room webapp proof for Toonflow-inspired novel-to-video workflow.
- Preserves ordered chapter import semantics.
- Preserves portable event extraction states.
- Preserves ScriptAgent staged workflow: initialization, skeleton, adaptation, scripts.
- Preserves ProductionAgent FlowData concepts: script, scriptPlan, assets, storyboardTable, storyboard.
- Preserves storyboard row fields: videoDesc, prompt, track, duration, associated asset IDs, image generation flag.
- Preserves mode rules for pure text multi-ref, storyboard-image-assisted multi-ref, and first-frame grouping.
- Provides mock text/image/video provider adapters.
- Provides browser preview manifest and timeline substitute.
- Default tests make no network calls.

## Unsafe Claims

- Exact Toonflow UI parity.
- Exact infinite canvas parity.
- Electron desktop parity.
- Full route/API parity.
- Live provider parity.
- Model output quality parity.
- Final stitched-video export parity.
- Audio binding/export parity.
- Memory/RAG parity.
- Editable vendor VM parity.

## Required Wording

Use:

> "This is a clean-room portable webapp implementation guided by Toonflow workflow evidence. It proves workflow shape, data contracts, validated agent output handling, mock media tasks, and preview manifest export. It does not claim original UI, provider, Electron, or final video stitching parity."

Do not use:

- "Clone"
- "Full reproduction"
- "Drop-in replacement"
- "Same as Toonflow"
- "Exports final video like Toonflow"

## Evidence Anchors

- Source describes the complete workflow and canvas/provider/agent concepts: `docs/README.en.md:108-123`.
- Source quick start includes final stitching/export, but v2 does not implement it: `docs/README.en.md:141-146`.
- Source backend evidence supports workflow contracts but not full UI/compositor parity: `src/router.ts:41-119`, `src/router.ts:224-260`.
