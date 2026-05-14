# SPEC: OpenClaw AI Influencer OS

This file is the behavior truth. `BUILDPRINT.md` is the architecture truth.

## Requirements

### R1 — Configurable persona

Given the user provides a persona name/identity
When the system is generated
Then generated persona files use that identity.

Given the user does not provide a persona name
When the default preset is used
Then the coding agent generates a fresh fictional name and short identity.

### R2 — OpenClaw runtime

Given the project starts
When the OpenClaw container/runtime loads
Then it loads persona files, the influencer persona extension, and the required skills.

### R3 — Private runtime context

Given a message arrives
When runtime context is built
Then it may include relationship memory, self-state, calendar/journal/social state, and media status.

The private context must not be sent back to the user as visible chat text.

### R4 — Memory separation

Given user memory and persona self-state exist
When either is updated
Then user relationship memory and persona self-state remain separate JSON documents.

### R5 — Image generation

Given `WAVESPEED_API_KEY` is present
When real image generation is requested
Then the production path uses Wavespeed.

Given `WAVESPEED_API_KEY` is missing
When tests or local validation run
Then image generation uses mock mode or blocks real mode with a structured reason.

### R6 — Public/private media gates

Given a public media request
When policy evaluates it
Then it must be platform-safe, canon-consistent, and grounded in a draft/life/calendar source.

Given a private or sensitive media request
When policy evaluates it
Then trust/consent gates apply or the request is blocked.

### R7 — Social drafts

Given the social planner creates a draft
When the draft is saved
Then it includes `groundedIn` references and starts as draft/needs_qa, not published.

Given a draft claims a real event
When the event is not grounded
Then manager QA blocks it with `ungrounded_claim`.

### R8 — Publishing

Given a draft is unapproved
When mock publisher is called
Then publishing is refused.

Given real publishing is requested
When default env flags are unchanged
Then the system uses browser/noVNC handoff docs and does not auto-publish.

### R9 — Manager audit

Given drafts/media/jobs/storage exist
When manager audit runs
Then it reports stale drafts, stuck media jobs, unsafe media, canon drift, ungrounded claims, and publishing blockers.

## Out of scope for first implementation

- real auto-publishing by default;
- real API calls in tests;
- provider swap away from Wavespeed;
- SaaS dashboard as primary product;
- merging memory and self-state;
- hidden use of secret values.
