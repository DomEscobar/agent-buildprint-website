# Implementation Plan

## Phase 1: Stabilize Contracts

- Define canonical JSON schemas for analysis request/response, script object, generate request/response, job status, gallery metadata, and publish request.
- Add provider adapter interfaces around Gemini, ElevenLabs, fal.ai, Upload-Post, and S3.
- Add test doubles for each adapter.

## Phase 2: Harden Runtime

- Replace in-memory job maps with durable job storage.
- Persist job logs, provider request IDs, and output asset manifest.
- Add resumable retries around provider calls and FFmpeg composition.
- Move API key storage out of client localStorage for hosted deployments.

## Phase 3: Validate Media Pipeline

- Add sample fixtures for manual description mode.
- Add dry-run mode that skips paid providers and uses local fixtures.
- Test FFmpeg subtitle escaping, b-roll insertion timing, and final output dimensions.
- Test Remotion render proxy and output URL conversion.

## Phase 4: Publish and Gallery

- Validate Upload-Post handoff with a sandbox account.
- Validate S3 gallery metadata, public URLs, and SEO pages.
- Add moderation/consent controls for uploaded actor photos and generated actor use.

## Source Anchors

- Current AI Shorts orchestration: `saasshorts.py:1290-1474`
- Current backend generation route: `app.py:2069-2216`
- Current social handoff: `app.py:1823-1893`
- Current gallery pages: `app.py:1896-2046`

