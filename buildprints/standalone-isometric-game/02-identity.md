# Mobile-first identity and interaction intent

UX is a must. A mounted canvas is not a finished product. Do this after `01-setup.md` and before `loops/` UI implementation; do not let a setup dependency prevent earlier concept discussion. Read `.agents/skills/frontend-ui-product-design/SKILL.md` if present and applicable, otherwise record that it is unavailable and follow the packet's explicit UX requirements. No new reusable skill files are needed.

Fill the UX and visual target sections of the existing `PROJECT_CONTRACT.md`, preserving its approval boundaries. Use `templates/ux-intent.md` as an outline inside that section, not as another brief. Derive technical layouts/tokens with links to approved requirements.

1. State the product metaphor, dominant object and primary gesture. The game world is the primary surface; do not turn it into an admin dashboard, raw JSON editor or card grid. Identify what the player understands in the first moment and what they do next.
2. For start, play, pause/settings, contextual interaction, success/failure, restart and any promised inventory/save UI, specify purpose → hierarchy → next action → feedback/recovery. Remove functionless buttons and dead controls rather than using them to simulate breadth.
3. Choose portrait/landscape intent and actual target viewport sizes. Reserve touch reach and safe-area space without shrinking the playable world to a decorative postage stamp. Separate movement, action and camera hit areas. Specify multi-touch, pointer cancellation, focus loss, orientation changes, modal pause and input reset; avoid hover-only information.
4. Explain desktop adaptation: keyboard/focus, pointer picking, camera pan/zoom/fit and readable spacing. Mobile is not a scaled desktop HUD. Agree text size, contrast, non-color cues, sound/motion controls and accessibility limits. No claim of physical-device or Safari support from emulation alone.
5. Protect target images and reference roles. Describe silhouettes, pixel density, palette/light, material transitions, ground connections, actor/prop ratios and scene-relevant animation. Use actual user references; concepts remain clearly labeled non-runtime targets. An absent target/capture facility leaves visual acceptance unverified.

Finish when the contract provides observable views and action sequences, and the derived implementation mapping identifies real host controls and public APIs. Later authorized rendered verification uses those same views and states, not easier framing chosen after defects appear.
