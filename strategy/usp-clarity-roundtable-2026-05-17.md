# Agent Buildprint USP Clarity Roundtable — 2026-05-17

## Objective

Make the USP obvious to a cold visitor in 5 seconds.

This roundtable is intentionally stricter than prior visual brainstorming. The problem is not simply “make it prettier.” The problem is:

> A first-time visitor may not understand what a Buildprint is, why it is different from prompts/templates/PRDs, or why the marketplace matters.

No site changes should be made from this document unless they pass the clarity tests below.

---

## Current risk diagnosis

The current product is conceptually strong but category-new. That means visitors do not arrive with the mental model.

Likely visitor thoughts:

1. “Is this a prompt library?”
2. “Is this a template marketplace?”
3. “Is this docs for a CLI?”
4. “Is this a code generator?”
5. “Why would I need this instead of asking Cursor/Codex/Claude directly?”

If the page only says “reusable specs/plans,” that is rationally correct but not instant enough. The user has to infer the category.

The USP must be visible as a transformation:

```text
Vague request → agent guesses → messy implementation
Buildprint → agent follows architecture/spec/tests → checked implementation
```

The product is not the file list. The product is **less guessing before code gets written**.

---

## The one-sentence category

Best working definition:

> Agent Buildprint is a marketplace of executable implementation plans for coding agents.

Alternative variants:

1. **Executable architecture plans for coding agents.**
2. **Implementation packages that tell coding agents what to build, how to build it, and how to prove it works.**
3. **The missing planning layer between your prompt and your coding agent.**
4. **A package registry for agent-ready software blueprints.**
5. **Blueprints that turn vague coding-agent tasks into scoped, testable implementation work.**

Recommended shortest homepage phrase:

> The planning layer before AI writes code.

Recommended concrete explainer directly below:

> Pick a Buildprint. Your agent gets the architecture, spec, phases, contracts, and checks — before it starts coding.

---

## Expert roundtable

### 1. Category designer

The name “Buildprint” is good but not self-explanatory. The UI must translate it immediately.

Do not lead with “marketplace” alone. Marketplaces are about supply/demand; the visitor first needs the object.

Correct order:

1. What is the object? → executable implementation plan
2. Who uses it? → coding agents + humans reviewing agent work
3. Why does it matter? → prevents guessing/drift
4. Why marketplace? → reusable, inspectable, comparable plans

Recommended category ladder:

```text
Prompt = instruction
PRD = human requirements
Template = starter code
Buildprint = agent-ready implementation plan + proof gates
```

This ladder should become a visual section.

### 2. First-time visitor / skeptic

The skeptic does not care about `BUILDPRINT.md`, `SPEC.md`, `PLAN.md` first. They care about the failure mode:

- “My AI agent builds fast but chooses weird architecture.”
- “It forgets requirements halfway through.”
- “It says done after one happy-path test.”
- “I cannot compare two agent attempts.”

Therefore homepage hero should start with the pain:

> Coding agents are fast. The problem is what they guess.

Then show the fix:

> Buildprints remove the guessing by giving agents architecture, contracts, phases, and tests first.

### 3. Marketplace UX expert

The registry should not look like a generic blog-card grid. It should feel like a catalog of usable artifacts.

Every card should answer:

1. What will this help me build?
2. What does the agent receive?
3. How trustworthy is it?
4. How do I start?

Recommended card hierarchy:

```text
[VALIDATED stamp]             Product OS
AI Influencer OS
Builds: an AI creator workflow with approvals and media generation.

Agent receives:
Architecture · Spec · Phases · Contracts · Checks

Use with: Codex / Cursor / Claude
Open Buildprint →
```

Avoid:
- Many tiny visual pills.
- Technology icons inside dense card rows.
- File names as the first thing people see.

Use icons only where they reduce recognition cost, e.g. “Codex / Cursor / Claude,” GitHub source, Docker/npm analogy. Icons must be inline logos, not bordered chips.

### 4. Visual identity / art director

The strongest visual metaphor is not “app store.” It is **inspected architectural packet**.

Reason: The core trust promise is that an expert has captured decisions before execution. This maps naturally to:

- blueprint sheet
- technical dossier
- stamped inspection
- file packet
- verification receipt

But the visual must not become decorative clutter. One hero diagram can carry the whole USP.

Recommended signature graphic:

```text
┌──────────────┐      ┌────────────────────────┐      ┌──────────────┐
│ vague prompt │  →   │ BUILDPRINT PACKET      │  →   │ agent builds │
│ “make X”     │      │ architecture/spec/tests│      │ with checks  │
└──────────────┘      └────────────────────────┘      └──────────────┘
       guesswork ↓              rails ↓                       evidence ✓
```

This should be an SVG/CSS diagram, not a row of pills.

Visual rules:

- One strong blue/ink technical accent.
- Stamps for validation only.
- Cards as dossier covers, not rounded SaaS blobs.
- Keep recognizable tech icons, but only as inline brand cues.
- No border/background around inline logos.
- No nested chips inside cards.

### 5. Conversion copywriter

The headline must say the before/after, not just the noun.

Headline candidates:

1. **Stop asking coding agents to guess the architecture.**
2. **Give your coding agent the plan before it writes code.**
3. **The planning layer before AI writes code.**
4. **Executable implementation plans for coding agents.**
5. **Browse proven build plans your agent can follow.**

Best pair:

```text
The planning layer before AI writes code.
Pick a Buildprint. Your agent gets architecture, specs, phases, contracts, and checks — before it starts coding.
```

CTA labels:

- Primary: `Browse Buildprints`
- Secondary: `See how one works`
- Detail CTA: `Copy agent prompt` or `Bootstrap package`

Avoid overclaiming:

- Do not say “guaranteed correct.”
- Do not say “one-click app generation.”
- Do not frame as magic.

### 6. Agent workflow expert

The USP is only credible if the agent flow is concrete.

Show the actual handoff:

```text
Human chooses Buildprint
→ agent reads BUILDPRINT.md / SPEC.md / PLAN.md / CONTRACTS.md / TEST_MATRIX.md
→ agent implements phase by phase
→ agent runs checks
→ human reviews evidence
```

This should appear as the main “How it works” section, not hidden in advanced details.

The file list matters only after the user understands the transformation.

### 7. Trust/evidence expert

“Validated” is the marketplace moat. But it must be explained.

Recommended trust model:

- **Mapped** — extracted from a real source or workflow.
- **Dry-run needed** — package exists, but not fully reversal-tested.
- **Validated** — bootstrapped and tested with evidence.

Show this as a legend near the registry, not as random card microcopy.

For detail pages, use a “Verification receipt”:

```text
Verification receipt
✓ package manifest loads
✓ raw files available
✓ agb start bootstraps snapshots
✓ proof tests pass
! non-goals documented
```

This makes the marketplace feel curated and trustworthy.

### 8. Information architect

Recommended page architecture:

Homepage:

1. Pain + definition hero
2. One transformation diagram: prompt guessing vs Buildprint rails
3. Featured Buildprints as dossier cards
4. Trust model / validation legend
5. How to use with agent
6. Creator/submit angle

Registry:

1. Category statement: “Browse agent-ready implementation plans”
2. Filters
3. Dossier cards focused on outcome + trust + start
4. Short status legend

Detail page:

1. What this builds
2. What the agent receives
3. Copy/bootstrap CTA
4. Architecture preview
5. Verification receipt
6. Advanced package files

---

## The decisive USP framing

The strongest framing is:

```text
Without Buildprint:
You prompt. The agent guesses architecture while coding.

With Buildprint:
The architecture, contracts, phases, and checks are already packaged.
The agent follows the plan. You inspect the evidence.
```

This should be visible on the homepage without scrolling far.

---

## Proposed visual prototype, no code yet

Prototype name:

> **Clarity Hero + Dossier Cards**

Scope should be deliberately small:

1. Homepage hero copy + one transformation diagram.
2. Registry card layout only.
3. Detail page “What the agent receives” + verification receipt.

Explicit non-goals:

- No global restyle.
- No new technology icon system.
- No decorative pill rows.
- No changing data model.
- No publishing until screenshots are approved.

Branch suggestion:

`prototype/usp-clarity-dossier`

Rollback:

- Keep current `main` untouched until approved.
- If implemented locally, one commit only.
- Screenshots first, merge later.

---

## Clarity test before shipping

A prototype passes only if a cold visitor can answer these in 5 seconds:

1. What is a Buildprint?
   - Expected: “an implementation plan/package for coding agents.”
2. Why not just prompt the agent?
   - Expected: “because otherwise the agent guesses architecture/scope/tests.”
3. What does the agent get?
   - Expected: “architecture, spec, phases/contracts/checks.”
4. Why trust it?
   - Expected: “validated packages include proof/checks/evidence.”
5. What do I do next?
   - Expected: “browse/copy/bootstrap a Buildprint.”

If any answer fails, do not ship.

---

## Final recommendation

Do not chase a prettier marketplace first. Build the homepage around the before/after transformation.

Recommended hero:

```text
The planning layer before AI writes code.

Pick a Buildprint. Your agent gets architecture, specs, phases,
contracts, and checks — before it starts coding.

[Browse Buildprints] [See how one works]
```

Hero visual:

```text
Prompt → guessing/drift
Buildprint → plan/rails/checks → evidence
```

Registry cards should then feel like concrete artifacts the visitor can choose after they understand the category.

---

## Detail page nuance: Buildprints are guided, not rigid

Dom flagged a critical detail-page risk: if Buildprints look too fixed, visitors may assume they are templates that force one exact stack or implementation.

The detail page must communicate:

> A Buildprint gives the agent rails, defaults, contracts, and checks — but leaves explicit decision points for tech choices and project-specific adjustments.

This is important because the USP is not “copy this exact stack.” The USP is “do not let the agent invent the architecture from nothing.”

Recommended detail-page framing:

```text
What is fixed:
- outcome and scope
- architecture boundaries
- behavior contracts
- implementation phases
- validation gates

What you can adapt:
- tech stack
- providers and APIs
- UI framework
- storage/database
- deployment target
- optional features
```

Possible section title:

> Rails, not handcuffs.

Alternative titles:

- `What is prescribed vs adaptable`
- `Use the plan, swap the parts`
- `Defaults you can change`
- `Opinionated where it matters, flexible where it should be`

Recommended component for detail pages:

```text
Buildprint flexibility

Locked by the plan
✓ user journey / outcome
✓ contracts and edge cases
✓ phase order
✓ validation checks

Open to adapt
↔ stack choices
↔ provider choices
↔ UI styling
↔ data/storage implementation
```

Microcopy:

> Buildprints are not starter-code templates. They are implementation plans. Use the default stack, or tell your agent which parts to swap while keeping the same contracts and checks.

This helps distinguish Buildprints from:

- templates: “copy this exact codebase”
- prompts: “hope the agent understands”
- PRDs: “human-readable, not execution-ready”
- frameworks: “must use our runtime”

Recommended detail-page placement:

Place this near the top, after “What this builds” and before the advanced file list. It should be visible before users decide whether the Buildprint fits their stack.

Card-level hint:

Registry cards can include a short line:

```text
Defaults included · stack adaptable
```

But avoid making this another pill row. It should be quiet text or a small line in the card footer.
