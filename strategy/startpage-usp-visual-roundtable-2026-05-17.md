# Agent Buildprint Startpage USP + Visual Roundtable — 2026-05-17

## Goal

Rethink the startpage from first principles so a cold visitor understands the USP quickly.

Important constraints from Dom:

- The USP must be easy to get.
- Visuals matter a lot.
- Recognizable icons are useful, but no ugly pill/card clutter.
- We can generate images or create custom graphics.
- Buildprints must feel like rails/defaults, not rigid templates.
- Requirements should be practical only: API keys, accounts, credentials, repo access, runtime/deployment blockers — no generic filler.

---

## First-principles user psychology

A visitor landing today likely has AI-agent fatigue. They have seen:

- prompt libraries
- agent frameworks
- SaaS templates
- boilerplates
- “AI app generator” promises
- vague marketplaces

Their internal questions are not academic. They are:

1. “What is this, really?”
2. “Is it just prompts?”
3. “Will this save me from AI chaos?”
4. “Do I have to use this exact stack?”
5. “Can I trust it?”
6. “What do I do in the next 30 seconds?”

The homepage should answer these in this order:

```text
Problem → Object → Outcome → Control → Proof → Action
```

Bad order:

```text
Object → file list → marketplace → filters → advanced details
```

People do not buy files. They buy the feeling that their coding agent will not wander off a cliff.

---

## Core homepage message

Best homepage thesis:

> The planning layer before AI writes code.

Supporting line:

> Buildprints give coding agents the architecture, contracts, phases, requirements, and checks they usually have to guess.

Control line:

> Use the default stack or swap parts — the plan keeps the work scoped and testable.

Proof line:

> Validated Buildprints include bootstraps, raw files, test evidence, and explicit non-goals.

---

## Roundtable

### 1. Cold visitor / skeptical builder

The homepage needs to speak to a pain I already have:

> “My agent can code, but it makes hidden architecture decisions I did not approve.”

Do not make me decode a new category first. Show me the contrast.

Suggested above-fold copy:

```text
Your coding agent can write code.
The problem is what it guesses.

Buildprints are executable implementation plans: architecture, phases,
contracts, requirements, and checks packaged before the agent starts.
```

This is clearer than leading with “marketplace.”

### 2. UX strategist

Homepage must have a five-second visual explainer.

Recommended hero structure:

```text
LEFT: clear pain + promise + CTA
RIGHT: visual before/after
```

Hero graphic should show:

```text
Prompt-only path:
Prompt → Guessing → Drift

Buildprint path:
Buildprint → Rails → Checked result
```

This can be an SVG/CSS graphic, not necessarily generated art. It must be readable at a glance.

### 3. Visual art director

The strongest visual metaphor is **engineering packet + proof machine**.

The startpage should not look like an app-store clone. The category is new, so visual metaphor matters.

Possible hero art directions:

#### A. The Split-Rail Diagram

A clean split-screen graphic:

```text
NO BUILDPRINT                         WITH BUILDPRINT
┌────────────┐                         ┌──────────────┐
│ vague task │                         │ build packet │
└─────┬──────┘                         └──────┬───────┘
      ↓                                       ↓
  agent guesses                         agent follows rails
      ↓                                       ↓
  drift / rework                         checks / evidence
```

Visual style:
- left side slightly chaotic/sketchy
- right side precise blueprint lines
- minimal color, strong contrast

This is the clearest USP visual.

#### B. The Buildprint Packet Render

Generated/illustrated image of a technical folder:

```text
[BUILDPRINT PACKET]
Architecture
Contracts
Phases
Requirements
Checks
```

A coding-agent cursor/terminal sits beside it. The agent is “reading” the packet.

This is brandable but less explanatory than split-rail.

#### C. The Agent Factory Line

Visual conveyor:

```text
Idea → Buildprint → Agent Workbench → Tests → Evidence Receipt
```

This communicates process and proof. Risk: may feel generic if over-illustrated.

#### D. The Dossier Marketplace Shelf

A shelf of blueprint folders, each with a stamp:

```text
AI Influencer OS      VALIDATED
RAG Search            MAPPED
Stripe Billing        DRY-RUN
```

Good for marketplace feeling after the hero, not as first visual.

### 4. Conversion copywriter

Homepage needs sharper copy blocks.

Recommended hero variants:

#### Variant 1 — pain-led

```text
Your coding agent can write code.
The problem is what it guesses.

Buildprints give agents the architecture, phases, contracts,
requirements, and checks before they start coding.
```

#### Variant 2 — category-led

```text
The planning layer before AI writes code.

Pick a Buildprint. Your agent gets a scoped implementation plan,
required credentials, adaptable stack choices, and validation gates.
```

#### Variant 3 — outcome-led

```text
Turn vague agent tasks into scoped, testable builds.

Buildprints package the decisions agents usually invent:
architecture, behavior, phases, interfaces, requirements, and checks.
```

Best recommendation: use Variant 1 as hero, Variant 2 as subline/section.

### 5. Marketplace product designer

Do not reveal marketplace too late, but do not lead with it either.

Homepage section order:

1. Hero: pain + Buildprint explanation + split-rail visual
2. “What a Buildprint contains” — packet contents, including requirements
3. “Rails, not handcuffs” — fixed vs adaptable
4. Featured Buildprints — dossier cards
5. “Validated means evidence” — proof receipt strip
6. “Use with your agent” — copy/bootstrap flow
7. Creator/publisher angle

This order moves from emotion to utility to proof.

### 6. Trust/evidence expert

Today, people are skeptical of AI claims. The homepage must show proof primitives early.

Proof should be concrete:

```text
Validated means:
✓ package files exist
✓ agb start bootstraps snapshots
✓ tests/proof pass
✓ claim boundaries documented
```

Do not use vague “trusted,” “battle-tested,” or “production-ready” language unless true.

A generated image cannot replace proof. It can attract attention, but proof must be textual and inspectable.

### 7. Autonomy/control psychologist

A major fear: “Will this force me into someone else's stack?”

Homepage should include a short control section:

```text
Rails, not handcuffs.

Fixed:
- outcome
- boundaries
- contracts
- checks

Adaptable:
- stack
- providers
- UI
- database
- deployment
```

This belongs on the homepage, not only detail pages, because it addresses adoption anxiety.

### 8. Requirements/product usability expert

People also ask: “Can I run this today?”

Homepage should establish the requirements philosophy:

```text
Requirements are only real blockers.
API keys, accounts, credentials, repo access, deployment targets.
No fake checklist filler.
```

On the homepage this can be one concise line in “What a Buildprint contains”:

> Requirements: only the external keys/accounts/access the Buildprint cannot provide.

The detail page can expand it.

### 9. Graphic generation expert

Generated images can help if they show a concept, not decoration.

Best image candidates:

#### Image 1 — Hero split path

Prompt:

```text
A clean editorial technical illustration split into two paths. Left path: a vague prompt card leading into tangled sketch lines and warning marks, representing an AI coding agent guessing architecture. Right path: a crisp blue engineering dossier labeled Buildprint Packet with architecture/spec/contracts/checks sheets, leading through straight rails to a verified code artifact with a small evidence receipt. Minimal modern technical drawing style, warm off-white paper, black ink, blueprint blue accents, no people, no robots, no 3D gloss, no purple gradients, high readability, web hero composition.
```

Use if generated image is crisp enough. If not, recreate as SVG.

#### Image 2 — Buildprint packet hero object

```text
A refined flat editorial illustration of a software architecture dossier folder on a drafting table. Visible sheets labeled BUILDPRINT.md, SPEC.md, PLAN.md, CONTRACTS.md, TEST_MATRIX.md, REQUIREMENTS.md. A small validation stamp and proof receipt sit beside it. Warm paper texture, blueprint grid, black ink, electric blueprint blue accents, clean modern magazine style, no clutter, no humans, no robots.
```

#### Image 3 — Marketplace shelf

```text
A clean technical marketplace shelf of software architecture dossier folders, each folder labeled with a Buildprint category: Product OS, Workflow OS, Framework, Feature. Some have small inspection stamps: VALIDATED, MAPPED, DRY-RUN. Minimal editorial UI illustration, warm paper, blueprint lines, black and blue, high clarity, no 3D, no cartoon.
```

#### Image 4 — Proof receipt

```text
A close-up editorial illustration of a verification receipt for an AI coding-agent build. Checklist lines: manifest loads, files available, bootstrap passed, tests passed, non-goals documented. Beside it is a clean code artifact and blueprint packet. Technical drawing style, minimal, trustworthy, high contrast, warm white and blueprint blue.
```

Recommendation: do not depend on image generation for core comprehension. Use image as atmospheric reinforcement. The hero concept should still work as HTML/SVG text diagram.

---

## Proposed homepage buildups

### Buildup A — Maximum clarity / recommended

```text
┌──────────────────────────────────────────────────────────────┐
│ Your coding agent can write code.                            │
│ The problem is what it guesses.                              │
│                                                              │
│ Buildprints give agents architecture, phases, contracts,     │
│ requirements, and checks before they start coding.           │
│                                                              │
│ [Browse Buildprints] [See how one works]                    │
│                                                              │
│        WITHOUT                         WITH                  │
│   vague prompt → guesses          Buildprint → rails         │
│                 → drift                      → evidence      │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ WHAT A BUILDPRINT CONTAINS                                   │
│ Architecture · Spec · Phases · Contracts · Requirements · Checks│
│ Requirements = only real blockers like API keys/accounts.    │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬───────────────────────────────┐
│ RAILS                         │ ADAPT                         │
│ outcome, boundaries, checks    │ stack, providers, UI, DB      │
└──────────────────────────────┴───────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ FEATURED BUILDPRINTS                                         │
│ dossier cards focused on: builds / requirements / status     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ VALIDATED MEANS EVIDENCE                                     │
│ bootstrap ✓ files ✓ tests ✓ non-goals ✓                      │
└──────────────────────────────────────────────────────────────┘
```

Why this works:
- Starts with pain.
- Explains object.
- Reduces lock-in anxiety.
- Shows marketplace only after category clarity.

### Buildup B — Marketplace-first but safer

```text
┌──────────────────────────────────────────────────────────────┐
│ Browse implementation plans your coding agent can follow.    │
│                                                              │
│ Not prompts. Not starter templates. Buildprints package      │
│ architecture, phases, requirements, and checks for agents.   │
│                                                              │
│ [Browse marketplace]                                         │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ PICK A DOSSIER                                               │
│ AI Influencer OS | RAG Search | Billing Flow | Skill Harness │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ HOW ONE WORKS                                                │
│ choose → copy/bootstrap → agent follows packet → proof       │
└──────────────────────────────────────────────────────────────┘
```

Risk:
- “Marketplace” can still feel abstract before the user understands why.

### Buildup C — Proof-first

```text
┌──────────────────────────────────────────────────────────────┐
│ Validated agent build plans, with evidence.                  │
│                                                              │
│ Every validated Buildprint includes files, bootstrap checks, │
│ test evidence, and explicit limits.                          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ WHY IT MATTERS                                               │
│ prompt-only agents guess architecture. Buildprints constrain │
│ the work before coding starts.                               │
└──────────────────────────────────────────────────────────────┘
```

Risk:
- Trust is strong but emotional pain may arrive too late.

---

## Recommended card philosophy for startpage

Cards should not be generic previews. They should answer “should I open this?”

Recommended featured card:

```text
┌────────────────────────────────────┐
│ VALIDATED                 Product OS│
│                                    │
│ AI Influencer OS                   │
│ Builds: approval-gated creator OS  │
│                                    │
│ Requirements: none for mock mode   │
│ Adapt: stack/providers allowed     │
│ Proof: bootstrap + tests           │
│                                    │
│ Open Buildprint →                  │
└────────────────────────────────────┘
```

No icon pile. Tech icons may appear as one quiet line:

```text
Use with Codex, Cursor, Claude
```

with flat inline icons only.

---

## Final recommendation

Build homepage around this psychological sequence:

```text
Fear: AI agents guess.
Relief: Buildprint gives a plan before coding.
Control: you can adapt stack/providers.
Practicality: requirements are only real blockers.
Trust: validation leaves evidence.
Action: browse/copy/bootstrap.
```

Hero should use **Buildup A** with either:

- an HTML/SVG split-rail diagram, or
- a generated split-path illustration if it is crisp and restrained.

Most important homepage sentence:

> Your coding agent can write code. The problem is what it guesses.

Most important product sentence:

> Buildprints give agents architecture, phases, contracts, requirements, and checks before they start coding.

Most important control sentence:

> Use the defaults or swap the stack — the contracts and checks keep the build on rails.
