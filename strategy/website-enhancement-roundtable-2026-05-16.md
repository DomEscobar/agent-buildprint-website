# Agent Buildprint Website Enhancement Roundtable — 2026-05-16

## Context reviewed

- Homepage: `/root/AGB-website/src/pages/index.astro`
- Registry/data model: `/root/AGB-website/src/lib/buildprints.ts`
- Global styles: `/root/AGB-website/src/styles.css`
- Recent proof pages and public Mapper proof direction.

Current positioning is much clearer than earlier: “Buildprints package the decisions agents usually guess.” The site now has validation proof, real examples, CLI usage, and mapped-project artifacts. The remaining issue is not “more content”; it is faster comprehension, stronger trust, and a more compelling proof loop.

## Participants

- **Product Marketer** — positioning, conversion, visitor intent.
- **Senior Fullstack Developer** — technical credibility and install flow.
- **Developer Relations Lead** — docs, examples, adoption path.
- **UX Designer** — first 5 seconds, visual hierarchy, friction.
- **Trust/Security Reviewer** — proof claims, parity boundaries, credibility.
- **SEO/GEO Strategist** — AI-search discoverability and content architecture.
- **Founder/Operator** — launch focus and speed-to-impact.

---

## Roundtable discussion

### Product Marketer

The homepage finally has the right core sentence, but it still asks visitors to infer the category. “Buildprints” is a coined term, so the hero needs a second line that anchors it immediately:

> “Downloadable implementation packages for coding agents — specs, phases, contracts, and tests in one folder.”

Current CTA pair is okay, but “Browse Buildprints” is passive. The strongest CTA should be a concrete outcome:

- **Try a validated Buildprint**
- Secondary: **See Mapper proof** or **How it works**

Add a small “works with” row above or below the CTA: `Codex · Cursor · Claude Code · OpenClaw · CLI`. This makes the product feel immediately useful.

### Senior Fullstack Developer

The site needs a “copy this and see it work” moment above the fold or immediately after. Developers trust commands and artifacts. Add a terminal card with one canonical command:

```bash
npx --yes github:DomEscobar/agent-buildprint start https://agent-buildprint.com/buildprints/buildprint-mapper-os/package.json
```

Then show generated outputs:

- `.buildprint/next-agent.md`
- `BUILDPRINT.md`
- `SPEC.md`
- `PLAN.md`
- `TEST_MATRIX.md`

The “Vague prompt vs Buildprint” section is good, but it is conceptual. Developers need an actual package preview with file names and a tiny example of an agent instruction.

### Developer Relations Lead

The site should have one “golden path” page:

1. Pick Buildprint.
2. Run CLI.
3. Open `.buildprint/next-agent.md`.
4. Paste into Codex/Cursor/Claude Code.
5. Run checks.

Right now this exists, but it is distributed across homepage/detail pages. Make it impossible to miss with a `/quickstart/` or homepage section titled **Start in 60 seconds**.

Also add “Examples that passed” as a proof rail:

- Automated AI Blog OS — Codex dry-run passed.
- Portable Novel-to-Storyboard Pipeline — browser/runtime proof.
- Mapper OS FeedMe proof — dogfood validation.
- Siftly Mapper proof — Node tests + Chromium smoke.

### UX Designer

The site has a clean aesthetic, but the homepage lacks one memorable visual object. A strong visual could be a compact “Buildprint package” card:

```text
agent-buildprint/
  BUILDPRINT.md      architecture
  SPEC.md            behavior
  PLAN.md            phases
  CONTRACTS.md       interfaces
  TEST_MATRIX.md     validation
```

The current homepage removed the hero side card, which was the right call if it felt noisy. But replace it with a simpler visual, not empty space: one terminal/package preview is enough.

Design improvements:

- Add `text-wrap: balance`/`pretty` to headings for polish.
- Add visible `:focus-visible` states globally.
- Add skip link in `BaseLayout`.
- Avoid icon-only theme toggle without clear `aria-label` if not already present.
- For horizontal nav chips on mobile, make active/primary nav clearer.

### Trust/Security Reviewer

The strongest differentiator is honest proof. Lean into it. Most “AI coding” sites overclaim. This site should make non-claims a trust feature:

- “Validated” should expand into exact gates: CLI snapshot, tests, build, browser smoke, publish gate, no-network mock mode.
- Add a public proof index: `/proofs/` listing FeedMe, Siftly, Toonflow, Vercel AI Chatbot, etc.
- Add a **Claim Boundary** block to mapped-project pages: what is proven vs explicitly not proven.

For Mapper OS, this matters a lot: never imply full clone parity. The Siftly proof page does this well. Make that pattern reusable.

### SEO/GEO Strategist

“Buildprint” is a new term, so SEO needs bridge pages targeting existing search language:

- `implementation plan for AI coding agents`
- `coding agent spec template`
- `Cursor project plan template`
- `Codex implementation spec`
- `AI coding agent validation checklist`
- `how to stop AI coding agents from drifting`

Add explanatory pages or blog posts that map known terms to Buildprints. Also generate structured data for Buildprints/proofs:

- `SoftwareSourceCode` or `TechArticle` for Buildprints.
- `CreativeWork`/`Dataset`-like metadata for proof artifacts.
- FAQ schema on homepage or quickstart.
- Keep `llms.txt` and raw Markdown access prominent.

### Founder/Operator

Do not redesign everything. The highest leverage is a tight homepage conversion pass and a proof hub.

The first implementation batch should be:

1. Add hero package/terminal card.
2. Add “Start in 60 seconds” golden path.
3. Add proof hub with the 3–5 strongest proof pages.
4. Make “Validated” badges explain exact evidence.
5. Add global a11y polish: skip link, focus states, heading wrapping.

This gets the site from “interesting artifact registry” to “credible product you can try now.”

---

## Priority recommendations

### P0 — Do next

1. **Homepage hero: add one concrete package/CLI preview**
   - Keep copy concise.
   - Show what a Buildprint physically contains.
   - CTA: “Try a validated Buildprint”.

2. **Create a `/proofs/` index**
   - Cards for FeedMe, Siftly, Toonflow, Vercel AI Chatbot if available.
   - Each card: source repo, scope, tests run, what is not claimed.

3. **Add “Start in 60 seconds” section**
   - One command.
   - One expected output.
   - One instruction: “Give `.buildprint/next-agent.md` to your coding agent.”

4. **Make validation badges evidence-based**
   - Instead of just “Validated”, show compact proof chips: `CLI snapshot`, `Tests`, `Browser smoke`, `No-network mocks`, `Publish gate`.

### P1 — Strong follow-up

5. **Buildprint detail pages: add “Agent handoff preview”**
   - Show first ~10 lines of `.buildprint/next-agent.md` or a representative handoff.

6. **Add comparison section**
   - “Prompt” vs “PRD” vs “Buildprint”.
   - Explain why Buildprints are more actionable for coding agents than normal docs.

7. **Add claim-boundary component for mapped projects**
   - Proven / Inferred / Out of scope.
   - Use exact validation commands.

8. **SEO bridge content**
   - 3–5 short pages/posts targeting “coding agent spec/template/implementation plan/checklist”.

### P2 — Polish

9. **Global accessibility pass**
   - Skip link.
   - Focus-visible styles.
   - Confirm theme toggle ARIA.
   - Reduced motion guard.

10. **Developer trust extras**
   - Add GitHub stars/downloads when available.
   - Add last validation date.
   - Add copy buttons for canonical CLI commands.

---

## Recommended first implementation chunk

Implement one contained website pass:

- Homepage hero package preview.
- New `/proofs/` page.
- Proof cards for FeedMe and Siftly immediately; Toonflow if its proof page is already public-ready.
- Evidence chips in featured cards.
- Skip link + focus-visible CSS.

This is small enough to ship quickly and high-impact enough to make the site feel much more credible.

## Suggested homepage hero copy

```text
Buildprints are implementation packages for coding agents.

Specs, phases, contracts, and validation gates — bundled so Codex, Cursor, Claude Code, or OpenClaw can build with less guessing.
```

Primary CTA: `Try a validated Buildprint`
Secondary CTA: `See proof runs`

## Suggested proof-hub card format

```text
Siftly Mapper Proof
Source: viperrcrypto/Siftly
Scope: Local Bookmark Knowledge Base Workflow
Validated: npm test 7/7 + Chromium smoke
Claims: workflow-proof + contract-parity + mocked-runtime-proof
Not claimed: full clone, live X, provider parity, hosted/account parity
```
