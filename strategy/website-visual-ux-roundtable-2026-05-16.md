# Agent Buildprint Visual / UI / UX Roundtable — 2026-05-16

## Prompt

Dom clarified: the discussion should be less about features and more about design appearance, UI, and UX. He liked the evidence-based validation badge idea, but wants more visual/design thinking.

## Current visual diagnosis

The site is clean, practical, and more credible than before, but visually it still reads like a calm SaaS/docs registry. It does not yet have a memorable “Agent Buildprint” design language.

Current strengths:
- Clear, restrained layout.
- Good whitespace.
- Cards are readable.
- Dark/light theme exists.
- Proof pages have honest boundaries.

Current weaknesses:
- The visual system is too generic: white/blue SaaS, rounded cards, soft shadows, Inter/system-font feel.
- The homepage does not have a signature graphic moment.
- Cards look similar across homepage, registry, detail, and proof pages; hierarchy could be more expressive.
- Validation is conceptually strong but visually underused.
- Buildprints are “files/contracts/proofs”, but the UI does not yet feel like blueprints, engineering drawings, manifests, or verified artifacts.

---

## Expert roundtable

### 1. Editorial Art Director

The site needs a recognizable metaphor. “Buildprint” suggests blueprint, technical drawing, stamped plans, construction documents, inspected packages. The design should not look like another AI SaaS gradient. It should feel like:

> a clean engineering dossier for software agents.

Recommended visual language:
- Fine blueprint grid backgrounds, very subtle.
- Document/file-stack motifs.
- Stamp-like validation marks: `VALIDATED`, `DOGFOODED`, `BROWSER SMOKE`.
- Monospace labels mixed with a sharper editorial display face.
- More black/ink + electric blueprint blue, less soft SaaS blue.

Avoid: bubbly cards, generic icons, purple/blue AI glow.

### 2. Senior Product Designer

The homepage needs a stronger first-screen composition. Right now it is text-first and rational. Keep it concise, but add one visual object that explains the product instantly.

Best above-fold visual: **Buildprint dossier card**

A large right-side card or under-hero object:

```text
BUILDPRINT PACKAGE
├─ BUILDPRINT.md      architecture truth
├─ SPEC.md            behavior contract
├─ PLAN.md            phase rails
├─ CONTRACTS.md       interfaces
└─ TEST_MATRIX.md     validation gates

status: VALIDATED
checks: CLI snapshot · tests · browser smoke
```

Make it look like a real technical artifact, not a marketing illustration. Slight paper texture, blueprint grid, stamped corner, file tabs.

### 3. UX Researcher

Users likely arrive with 3 questions:

1. What is this?
2. Why is it better than a prompt/PRD?
3. Can I trust it enough to try?

The UI should answer those visually before asking users to read paragraphs.

Recommended homepage order:
1. Hero + dossier preview.
2. Prompt vs Buildprint visual comparison.
3. Validated proof strip.
4. Featured Buildprints.
5. Start flow.

The proof strip should be more visual than text:

`Mapper OS` → `FeedMe` → `Siftly` → `Toonflow`

Each proof tile shows: source, scope, tests, non-claims. This turns “trust” into a visible product surface.

### 4. Interaction Designer

The UI needs richer microinteractions, but only where they reinforce the “verified artifact” theme.

Ideas:
- Hovering a Buildprint card reveals its validation stack as layered chips.
- Validated badges behave like inspection stamps with a small pressed/ink effect.
- File rows subtly slide/indent on hover like expanding a folder tree.
- Copy buttons should feel immediate: “Copied ✓” plus tiny status pulse.
- Registry filters should feel selected, not just functional; active chips need strong selected state.
- Cards should have stronger hover depth and border movement, but avoid bouncy/playful motion.

Motion tone: precise, mechanical, confidence-building. Not cute.

### 5. Frontend Visual Systems Designer

The current CSS has good structure but needs a stronger token system. Define visual identity tokens:

- `--ink`: nearly black text / blueprint ink.
- `--paper`: warm off-white, not sterile white.
- `--blueprint`: vivid technical blue.
- `--grid`: faint line color.
- `--verified`: green but less neon; inspection-stamp green.
- `--warning`: amber/orange for non-claims.

Add reusable components:
- `.artifact-card`
- `.validation-stamp`
- `.file-tree`
- `.proof-rail`
- `.evidence-chip`
- `.blueprint-grid`

The visual system should make every page feel connected: homepage, registry, detail, proof pages.

### 6. Conversion Designer

“Validated” should become the site’s visual trust engine. Dom liked idea 4; expand it into an evidence layer.

Instead of status text only:

```text
VALIDATED
CLI snapshot ✓  Tests ✓  Browser smoke ✓  No secrets ✓
```

On cards, use compact chips. On detail/proof pages, use a full “Verification Ledger” component:

```text
Verification Ledger
✓ Snapshot bootstrap      agb start … passed
✓ Unit tests              7/7
✓ Browser smoke           Chromium headless passed
✓ Claim boundary          full clone not claimed
```

This makes validation look like proof, not decoration.

### 7. Brand Designer

The name “Agent Buildprint” can own a distinctive aesthetic:

- Industrial/editorial rather than startup bubbly.
- “Filed, stamped, inspected” rather than “magical AI”.
- The logo could evolve from simple document icon to folded blueprint sheet / technical seal.
- Use uppercase micro-labels and file-code typography, but keep body copy simple.

Potential style names:
1. **Blueprint Dossier** — clean engineering docs, grid, stamps, file trees.
2. **Agent Control Room** — darker, terminal/control-panel, proof telemetry.
3. **Spec Magazine** — editorial, large typography, print-like proof cards.

Best fit: **Blueprint Dossier**. It matches the product, avoids generic AI aesthetics, and reinforces trust.

---

## Strong visual directions

### Direction A — Blueprint Dossier (recommended)

Feel: engineering document, verified plan, technical but elegant.

Visual ingredients:
- Warm paper background with faint blueprint grid.
- Ink-black typography with electric blue accents.
- File tree card in hero.
- Validation stamps/chips.
- Thin technical borders, corner brackets, document tabs.
- Proof pages look like inspection reports.

Why it works:
- Directly matches “Buildprint”.
- Makes validation feel native.
- Distinct from generic AI SaaS.
- Still easy to implement on current Astro/CSS site.

### Direction B — Agent Control Room

Feel: dark technical cockpit, live checks, command console.

Visual ingredients:
- Dark-first UI.
- Terminal panels, status lights, scanlines/grid.
- Proof telemetry cards.
- CLI command as hero centerpiece.

Risk:
- Can become too hacker-ish and less accessible/trustworthy for broader users.
- Might overemphasize CLI/tooling vs reusable plans.

### Direction C — Spec Magazine

Feel: high-end editorial/productized knowledge.

Visual ingredients:
- Large dramatic typography.
- Asymmetric layouts.
- Proof stories as magazine case studies.
- Fewer cards, more authored sections.

Risk:
- Beautiful, but might underplay developer utility.

---

## Recommended UI/UX enhancements

### P0 visual changes

1. **Add signature hero visual**
   - Replace empty hero side space with a restrained Buildprint dossier/file-tree card.
   - Include validation stamp and 4–5 files.

2. **Redesign validation badges as evidence chips**
   - `CLI snapshot`, `Tests`, `Browser smoke`, `No secrets`, `Claim boundary`.
   - Cards show 2–3 chips; detail/proof pages show full ledger.

3. **Introduce Blueprint Dossier background language**
   - Subtle grid/noise on hero and proof sections.
   - Corner brackets or file-tab details on artifact cards.

4. **Upgrade card hierarchy**
   - Featured cards should feel more premium than row cards.
   - Use left accent rail or top file-tab strip by category.
   - Make mapped/validated Buildprints visually distinct.

5. **Create a proof rail / proof strip**
   - Visual row of proof cards with test evidence and non-claim warning.
   - This is UI/UX, not just content: it gives trust a visual shape.

### P1 visual changes

6. **Make detail pages feel like build dossiers**
   - Add a `Verification Ledger` panel near top.
   - Show package files as a designed file tree before technical table.
   - Make “Technical package details” feel less hidden for developer users.

7. **Improve registry filtering UX**
   - Strong active filter state.
   - Show result count.
   - Add sort/status toggle: `Validated first`.
   - Empty state with reset button.

8. **Add motion polish**
   - Staggered hero entry.
   - Card hover: border/transform/shadow only.
   - Respect reduced motion.

9. **Typography polish**
   - Consider replacing pure Inter/system with a more characterful pair:
     - Display: `Söhne/Geist/Instrument Sans`-like if self-hosted/available, or keep system but use stronger letterspacing and weights.
     - Mono: `JetBrains Mono`/`IBM Plex Mono` style for file/CLI surfaces.
   - Add `text-wrap: balance` to headings.

### P2 refinements

10. **Visual taxonomy**
    - Product OS, Workflow OS, Mapped Project, Framework, Extension should have consistent color/accent/shape tokens.

11. **Empty/loading/copy states**
    - Search no-results state.
    - Copy success state already exists, but can be visually stronger.

12. **Mobile UX**
    - Hero dossier should collapse into a horizontal artifact card or stacked compact file tree.
    - Proof strip can become swipeable cards.

---

## Concrete components to implement

### `BlueprintHeroCard`

Purpose: explain Buildprint visually in 2 seconds.

Elements:
- Header: `BUILDPRINT PACKAGE`
- Stamp: `VALIDATED`
- File rows with purpose labels.
- Bottom: `agent reads → implements → checks`.

### `EvidenceChips`

Purpose: replace vague validation with compact proof.

Examples:
- `CLI snapshot ✓`
- `7/7 tests ✓`
- `Chromium smoke ✓`
- `No secrets ✓`
- `Non-claims declared ✓`

### `VerificationLedger`

Purpose: trust panel on detail/proof pages.

Rows:
- Check name.
- Command/evidence.
- Status.

### `ProofRail`

Purpose: make public proofs visible and scannable.

Cards:
- FeedMe dogfood.
- Siftly Mapper proof.
- Toonflow webapp proof if published.
- Vercel AI Chatbot mapper artifact.

### `ArtifactCard`

Purpose: unify Buildprint/proof file cards.

Visual details:
- File extension badge.
- Corner bracket.
- Hover indent.
- `Open` affordance.

---

## Best next implementation chunk

Implement the **Blueprint Dossier visual pass**:

1. Homepage hero dossier card.
2. Evidence chips on featured/registry cards.
3. Verification ledger style for proof/detail pages.
4. Subtle blueprint grid + focus/motion polish.
5. Stronger active filter/search UX if time permits.

This keeps the site practical but gives it a memorable product identity.

## Short recommendation

Go with **Blueprint Dossier**: technical, stamped, verified, file-based, not generic AI. Make the site feel like a set of inspected engineering plans that coding agents can execute.
