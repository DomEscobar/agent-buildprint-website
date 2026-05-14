# Roundtable: LLM Token Attention & Coding-Agent Alignment

Goal: optimize the Buildprint for how coding agents actually attend, plan, and drift.

## Participants

- **Prompt/Attention Architect** — cares about token order, repeated anchors, and salience.
- **Coding-Agent Harness Designer** — cares about runnable milestones and failure feedback.
- **LLM Failure Critic** — predicts shortcuts and familiar-template drift.
- **OpenClaw Shape Guardian** — keeps the output from becoming generic Node/Express.
- **Default Persona Reviewer** — checks whether the system still follows the default persona preset.
- **Test-First Reviewer** — forces objective pass/fail gates.

## Findings

### 1. First 300 tokens decide the frame

Coding agents overweight the first screen. If “OpenClaw + Wavespeed + default-preset + fixed architecture” is not repeated immediately, the agent may build a generic bot.

Decision: add an **Attention Anchor Block** at the top with the exact target shape and priority order.

### 2. Negative constraints are weaker than positive target shape

“NO generic chatbot” helps, but agents still need a concrete repeated positive shape.

Decision: repeat this exact phrase early and later:

```txt
OpenClaw container + persona extension + skills + life modules + Wavespeed image skill + browser/noVNC publishing handoff
```

### 3. Open-ended alignment questions consume the plan budget

If the interview feels like product discovery, coding agents may re-plan the whole system.

Decision: questions are config values only; architecture is fixed.

### 4. File trees can become fake compliance

Agents can create files without behavior.

Decision: add a **minimum viable behavior table** near the top so the model sees behavior before file tree.

### 5. LLMs drift toward familiar templates under ambiguity

Common drift paths:

- Express/Next.js dashboard app;
- generic Discord/Telegram chatbot;
- content calendar SaaS;
- pure test mock with no OpenClaw shape;
- image provider abstraction that ignores Wavespeed;
- “future TODO” for the hard parts.

Decision: add a **drift map** with required correction.

### 6. Tests should be perceived as construction requirements, not afterthoughts

If tests are only late in the file, agents may underbuild behavior.

Decision: add a top-level “definition of working” before detailed implementation.

## Final token-attention rules

1. Start with target shape, not product story.
2. Use same architecture phrase multiple times.
3. Put “definition of working” before file tree.
4. Convert abstractions into concrete module behavior.
5. Make common drift paths explicit.
6. Make tests validate the hard alignment points.
7. Keep questions closed and configuration-only.

## Edits applied

- Added top-level **Attention anchors for coding agents** to `BUILDPRINT.md`.
- Added **Definition of working** near the top.
- Added **Common drift map** with corrections.
- Updated implementation prompt to repeat the same token anchors.
