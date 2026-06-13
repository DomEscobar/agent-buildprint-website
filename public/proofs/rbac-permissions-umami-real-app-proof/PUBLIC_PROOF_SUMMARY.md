# RBAC Permissions Umami Real-App Integration Fixture Proof

## Status

Passed.

## What was tested

The live `rbac-permissions` Capability Buildprint was loaded into a pinned Umami checkout with:

```bash
node /root/agent-buildprint/bin/agb.js start https://agent-buildprint.com/buildprints/rbac-permissions/package.json .
```

Host:

```text
https://github.com/umami-software/umami
commit c0ea3aefbee7a3429ee2f824b06dc4a9dbe0b7e1
```

The proof followed the Capability Buildprint workflow:

1. Loaded the live package and `14` snapshot files.
2. Wrote `.buildprint/host-assessment.md`.
3. Wrote `.buildprint/capability-plan.md`.
4. Added a central AGB RBAC helper for selected Umami user-admin permissions.
5. Routed existing Umami permission helpers through that central helper.
6. Ran focused allow/deny tests.
7. Published the exact code patch as `UMAMI_PATCH.diff`.
8. Wrote `.buildprint/capability-receipt.md`.

## Verification command

```bash
npx vitest run --config vitest.agb-rbac.config.ts
```

## Result

```text
Test Files  1 passed (1)
Tests       4 passed (4)
Duration    596ms
```

## Claims proven

- A real OSS production app, Umami, can host the RBAC Permissions Capability workflow.
- The workflow produced host assessment, capability plan, and capability receipt.
- Selected existing Umami user-admin permission helpers route through a central AGB RBAC helper.
- Admin user is allowed for selected user-admin permissions.
- Normal user is denied.
- View-only user is denied.
- Missing user is denied.
- Missing role is denied.
- Unknown role is denied.
- Unknown permission is denied through the central helper.

## Claim boundary

This is a `real-app-integration-fixture` proof.

Not claimed:

- production deployment behavior
- live HTTP authorization behavior
- full Umami authorization migration
- database migration or role persistence changes
- team, website, report, board, pixel, link, or entity permission migration
