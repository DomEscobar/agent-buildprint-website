# Roundtable: AI Influencer OS Buildprint Alignment

Goal: make the Buildprint hard for coding agents to misread, drift, or half-implement.

## Participants

- **Build Systems Architect** — cares about deterministic file tree and runnable milestones.
- **OpenClaw Runtime Expert** — cares that the result is actually OpenClaw-shaped.
- **default persona Operator** — cares that it mirrors the working reference influencer architecture.
- **Coding-Agent Critic** — assumes agents will take shortcuts unless blocked.
- **Safety/Policy Reviewer** — cares about public/private media, secrets, posting gates.
- **Product/User Advocate** — cares that humans understand what they are choosing.

## Critique

### 1. Too many open questions create drift

The old `questions.md` asked 25 questions. That invites the coding agent to redesign the product with the user instead of configuring the fixed default persona/OpenClaw architecture.

Decision: replace with a short, closed **configuration interview**. Questions may change parameters, not architecture.

### 2. “OpenClaw-based” is not enough

Agents may create generic Node files and call it OpenClaw.

Decision: the Buildprint must require OpenClaw-specific artifacts:

- `AGENTS.md`, `SOUL.md`, `USER.md` workspace/persona files;
- skills with `SKILL.md` + executable command;
- extension/plugin folder;
- Docker entrypoint that copies persona files into runtime/workspace;
- commands that resemble the real reference influencer operating model.

### 3. Required file tree can become empty scaffolding

Agents may create placeholder files and pass by shape only.

Decision: define minimum behavior per module and tests that prove behavior.

### 4. Wavespeed must be a production contract, not a vague provider note

Agents may implement a generic `generateImage()` mock and mention Wavespeed in docs.

Decision: `influencer-image` must expose explicit real/mock mode and fail clearly when `WAVESPEED_API_KEY` is missing. Tests must prove mock fallback.

### 5. Alignment should not block implementation forever

Agents can get stuck asking too many questions.

Decision: if the user says “use default persona preset”, no questions. Otherwise ask exactly 8 closed questions and then ask for confirmation.

### 6. Need golden-path commands

Agents perform better with target commands.

Decision: require `npm test`, `npm run test:static`, and documented Docker commands.

## Final alignment rules

1. Architecture is fixed.
2. Questions configure values only.
3. OpenClaw shape is mandatory.
4. Wavespeed is mandatory for production image generation.
5. Browser/noVNC publishing is mandatory as the real-publishing handoff model.
6. Public/private media separation is mandatory.
7. Real posting is disabled by default.
8. Tests must validate behavior, not only file existence.
9. `VALIDATION.md` must report deviations and blockers.

## Edits applied

- Shortened `questions.md` into an 8-question configuration interview.
- Tightened `BUILDPRINT.md` with stronger anti-drift rules.
- Added explicit OpenClaw artifact requirements.
- Added exact runtime behavior contracts and command expectations.
- Added roundtable rationale in this file.
