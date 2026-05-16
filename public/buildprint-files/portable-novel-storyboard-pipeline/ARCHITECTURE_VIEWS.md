# Architecture Views

## Component View

`API/Agent Facade -> Workflow Services -> Repositories -> Adapter Interfaces -> Mock/Live Providers`

## State View

Chapter: `new -> event_pending -> event_ready | event_failed`

Script: `draft -> ready -> asset_extracting -> asset_ready | asset_failed`

Storyboard: `draft -> row_ready -> image_pending | not_generated -> image_ready | image_failed`

Video: `prompt_ready -> generating -> success | failed -> selected`

## Deployment View

Phase 1 proof can run as a local process with fixture files and mock providers. Live deployment needs auth, secret store, object storage, job queue, and observability.

