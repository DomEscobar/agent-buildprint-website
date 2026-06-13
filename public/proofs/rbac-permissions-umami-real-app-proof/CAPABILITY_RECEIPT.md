# RBAC Permissions Capability Receipt

## Host

- Host repo: `https://github.com/umami-software/umami`
- Host commit: `c0ea3aefbee7a3429ee2f824b06dc4a9dbe0b7e1`
- Capability: `rbac-permissions`
- Capability loaded with: `node /root/agent-buildprint/bin/agb.js start https://agent-buildprint.com/buildprints/rbac-permissions/package.json .`
- Snapshots downloaded: `14`

## Changed Files

- `src/permissions/agb-rbac.ts`
- `src/permissions/agb-rbac.test.ts`
- `src/permissions/user.ts`
- `vitest.agb-rbac.config.ts`
- `.buildprint/host-assessment.md`
- `.buildprint/capability-plan.md`
- `.buildprint/capability-receipt.md`

## Implemented Policy

Roles:

- `admin`
- `user`
- `view-only`

Permissions:

- `user:create`
- `users:view`
- `user:delete`

Policy:

- `admin` can `user:create`
- `admin` can `users:view`
- `admin` can `user:delete`
- `user` has no selected user-admin permissions
- `view-only` has no selected user-admin permissions
- missing user is denied
- missing role is denied
- unknown role is denied
- unknown permission is denied

## Protected Surfaces

The following existing Umami permission helpers now route through `hasAgbRbacPermission(...)`:

- `canCreateUser({ user })`
- `canViewUsers({ user })`
- `canDeleteUser({ user })`

Existing owner/self helpers were intentionally left unchanged:

- `canViewUser({ user }, viewedUserId)`
- `canUpdateUser({ user }, viewedUserId)`

## Verification Commands

Initial package command:

```bash
npm test -- src/permissions/agb-rbac.test.ts
```

Result:

```text
failed before loading tests: Umami's default Vitest setup imports @testing-library/dom, which is absent in this fresh dependency tree.
```

Proof command:

```bash
npx vitest run --config vitest.agb-rbac.config.ts
```

Result:

```text
Test Files  1 passed (1)
Tests       4 passed (4)
Duration    596ms
```

## Runtime Or Fixture Checks

Passed:

- admin can create users
- admin can view users
- admin can delete users
- normal user is denied
- view-only user is denied
- missing user is denied
- missing role is denied
- unknown role is denied
- unknown permission is denied through the central helper
- selected existing Umami user-admin permission helpers call the central AGB RBAC helper

## Proof Level

`real-app-integration-fixture`

## Known Risks

- This proof does not start Umami's HTTP server.
- This proof does not exercise browser UI or live API requests.
- This proof covers one bounded user-admin permission path, not every Umami permission module.
- Full default `npm test` was not used because the default UI test setup requires `@testing-library/dom` in this fresh install.

## Not Proven

- Production deployment behavior
- Full Umami authorization migration
- Team, website, report, board, pixel, link, and entity permission modules
- Database-backed role migration, because Umami already has role persistence

