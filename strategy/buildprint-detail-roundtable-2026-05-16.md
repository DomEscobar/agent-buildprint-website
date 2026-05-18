# Buildprint Detail Page Roundtable — 2026-05-16

Goal: replace the Buildprint detail page guessing loop with a simple, readable, high-conversion information design. No console cosplay. No fake product UI. No wall of undifferentiated files. Mobile-first.

## Participants

- **Product reader** — wants to know if this Buildprint is useful in 20 seconds.
- **Senior full-stack dev** — wants scope, stack, source repo, and proof boundary before trusting it.
- **Coding-agent user** — wants to know what to paste/run and what files matter.
- **Open-source maintainer** — wants provenance, license/source clarity, and no clone/parity overclaim.
- **Mobile UX reviewer** — wants one readable column, no horizontal scroll, no dense tables.
- **Copy editor** — wants fewer labels, stronger nouns, short paragraphs, and no internal jargon first.

---

## Shared diagnosis

Current detail pages are still too implementation-inventory driven.

Problems:

1. **The page starts with package mechanics instead of value.**
   - `Package JSON`, `Buildprint files`, `Agent guide` are useful but not what a human evaluates first.

2. **The description is too compressed and abstract.**
   - Example: “validated mapped-project Buildprint…” is accurate but not emotionally/visually clear.
   - Better: “A rebuild plan for an AI shorts studio: product input, script, voice/avatar jobs, composition, gallery handoff.”

3. **Sections are generic.**
   - `Use this when` and `What is included` are okay but not memorable.
   - Need domain-specific blocks: “What you can build”, “What it proves”, “What it does not claim”.

4. **File list is too long too early.**
   - GitHub READMEs work because file trees are not the hero; explanation is.
   - Show key docs first; full file list collapsed or lower down.

5. **Quick start is misleading as primary for normal humans.**
   - Dom asked KISS. Most visitors need understanding first, then links.
   - Keep quick start, but after “what this is”.

6. **Mobile needs editorial rhythm.**
   - Short paragraphs, clear headings, bullets with 5–7 items max, no multi-column file rows.

---

## Consensus information order

The perfect detail page should read like a beautiful README landing page:

1. **Title**
2. **Plain-language subtitle** — one sentence, not registry jargon.
3. **Source/provenance row** — source repo if mapped, Buildprint package, proof if available.
4. **What you can build** — 3–6 concrete outcomes.
5. **How it works** — short domain pipeline, e.g. `Input → Analysis → Script → Media jobs → Output`.
6. **What is proven** — test/build/proof status, short.
7. **What is not claimed** — honest boundary, short.
8. **Key documents** — only 5–8 important files first.
9. **All package files** — collapsible, boring but available.
10. **Agent/CLI start** — small, copyable, not visually dominant.

---

## Recommended universal page copy template

```md
# {Title}

{Plain-language one-liner. Say what someone can rebuild, not that it is a Buildprint.}

**Source:** {source repo if any}  
**Status:** {validated/draft/planned}  
**Best for:** {3 short tags}

## What you can build

- {Concrete outcome 1}
- {Concrete outcome 2}
- {Concrete outcome 3}
- {Concrete outcome 4}

## How the flow works

`{Step 1} → {Step 2} → {Step 3} → {Step 4} → {Output}`

Short paragraph explaining the architecture in normal language.

## What is proven

- {test/build/proof result}
- {source trace / cited mapping}
- {runtime/mock/browser proof if any}

## What this does not claim

- {no clone parity}
- {no provider/API parity}
- {no production/legal/platform guarantee}

## Start from the package

```bash
agb start {package url}
```

Or inspect the package JSON and key docs first.

## Key docs

- [`BUILDPRINT.md`] — architecture and agent contract
- [`SPEC.md`] — expected behavior
- [`PLAN.md`] — implementation order
- [`CONTRACTS.md`] — data and interface contracts
- [`TEST_MATRIX.md`] — what must be tested
- [`PARITY_CLAIMS.md`] — safe claims and non-claims, if present

<details>
<summary>All files</summary>
...
</details>
```

---

## Concrete copy principles

### Do

- Use product nouns first: “AI shorts studio”, “durable graph runtime”, “novel-to-storyboard pipeline”.
- Start sentences with outcomes, not metadata.
- Keep validation honest and crisp.
- Use source repo links where mapped.
- Put full package/files lower.
- Let `BUILDPRINT.md`, `SPEC.md`, `PLAN.md`, `CONTRACTS.md`, `TEST_MATRIX.md` be the core doc set.

### Avoid

- “mapped-project Buildprint” in the first sentence.
- “agent-grade” as primary value.
- Long raw file inventory above the fold.
- Special visual metaphors.
- Dense cards/tables on mobile.
- Claiming clone/API/provider/platform parity unless proven.

---

## Domain-specific example: OpenShorts page

Bad current style:

> A validated mapped-project Buildprint for rebuilding a portable AI shorts production pipeline from public OpenShorts architecture patterns...

Better:

> A clean-room rebuild plan for an AI shorts studio: take a product, generate a UGC script, route mock voice/avatar/media jobs, compose a 9:16 video plan, and hand off gallery SEO/social publishing artifacts.

What you can build:

- Product input and analysis flow
- Five-part UGC script generator
- Actor/avatar and voice provider adapter layer
- Mock talking-head, b-roll, and subtitle job graph
- 9:16 composition manifest
- Gallery SEO and social handoff manifest

Flow:

`Product input → Analysis → UGC script → Actor/voice/media jobs → 9:16 composition → Gallery/social handoff`

Proven:

- Clean-room JS proof built
- `npm run check` passed
- 7/7 tests
- Provider integrations modeled as mocks/adapters

Not claimed:

- Not an OpenShorts clone
- No provider/API/social-platform parity
- No video quality/rendering parity
- No production legal/compliance guarantee

---

## Layout recommendation

Keep one centered content column, max width ~860–920px.

Visual styling should be README/editorial:

- white content card on subtle site background
- large title, short subtitle
- small metadata pills
- link row
- markdown headings with border-top separators
- bullets over cards
- inline code flow line
- key docs as simple definition list
- all files in collapsed details

Mobile:

- title must wrap naturally
- hide extra stack pills after 3–4 if needed
- link row stacks vertically
- no tables
- all file rows become simple stacked rows

---

## Final recommendation

Do another implementation pass, but this time not “README-style generic”. It should be **domain-aware formatted markdown**:

- Derive a better first sentence from `bp.summary`/`bp.title` and known mapped origin.
- Add a `flow`/`outcomes` layer to `buildprints.ts` so the page can say useful things without inventing per-template special cases.
- For now, implement a safe generic version:
  - `What you can build` from first 6 `includes`
  - `How it works` from first 5 `stack` items as an inline flow
  - `What is proven` from trust badges/checks
  - `What is not claimed` from risks
  - `Start from the package` below proof
  - `Key docs` first, full files collapsed

This should feel like GitHub README quality, not SaaS landing page and not docs dump.
