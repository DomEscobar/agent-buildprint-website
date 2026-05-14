# Phase 04 — Wavespeed Image Skill

## Goal

Implement the image skill with Wavespeed real mode and mock test mode.

## Files

- `skills/influencer-image/SKILL.md`
- `skills/influencer-image/influencer-image`
- `skills/influencer-image/config.json`
- `extensions/influencer-persona/media-flow.js`
- `policies/media.md` reference behavior

## Steps

1. Implement real-mode gate using `WAVESPEED_API_KEY`.
2. Implement mock mode for tests.
3. Route public/private media through policy.
4. Return structured block reasons.

## Do not

- use another production image provider;
- call Wavespeed in tests;
- treat public and private media the same.

## Exit criteria

- missing key uses mock/blocked real mode;
- low-trust sensitive request is blocked;
- public request requires platform-safe/canon/grounding checks.
