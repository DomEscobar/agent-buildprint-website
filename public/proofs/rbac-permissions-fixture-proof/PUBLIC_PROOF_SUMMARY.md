# RBAC Permissions Fixture Proof

## Status

Passed.

## What was tested

The live `rbac-permissions` Capability Buildprint was loaded with:

```bash
node /root/agent-buildprint/bin/agb.js start https://agent-buildprint.com/buildprints/rbac-permissions/package.json /tmp/agb-rbac-runtime-fixture
```

The fixture then followed the Capability Buildprint workflow:

1. Loaded the live package and `14` snapshot files.
2. Wrote `.buildprint/host-assessment.md`.
3. Wrote `.buildprint/capability-plan.md`.
4. Implemented a deny-by-default RBAC policy.
5. Wired a protected server-side function surface.
6. Ran fixture tests.
7. Wrote `.buildprint/capability-receipt.md`.

## Verification command

```bash
npm test
```

## Result

```text
tests 4
pass 4
fail 0
```

## Claims proven

- Admin user can access the protected admin report.
- Member user is denied.
- Missing role is denied with an actionable `missing_role` state.
- Central permission helper denies unknown users and unknown roles.
- The applying workflow produced host assessment, capability plan, and capability receipt.

## Claim boundary

This is fixture proof, not production proof.

Not claimed:

- database-backed role persistence
- HTTP middleware integration
- team/workspace scoped RBAC
- production authorization behavior

