# RBAC Permissions Capability Receipt

## Changed Files

- `src/rbac.js`
- `src/admin-report.js`
- `test/rbac.test.js`
- `.buildprint/host-assessment.md`
- `.buildprint/capability-plan.md`
- `.buildprint/capability-receipt.md`

## Implemented Policy

Roles:

- `admin`
- `member`

Permissions:

- `admin.report.read`

Policy:

- `admin` can `admin.report.read`
- `member` has no privileged permissions
- unknown user is denied
- unknown role is denied
- missing role is denied

## Protected Surfaces

- `readAdminReportForRequest(request)` protects `readAdminReport()` through the central RBAC helper.

## Verification Commands

```bash
npm test
```

Result:

```text
tests 4
pass 4
fail 0
```

## Runtime Or Fixture Checks

Passed:

- admin can access the protected admin report
- member is denied access to the protected admin report
- missing role is denied with `missing_role`
- central permission helper denies unknown users and roles
- central permission helper allows admin and denies member

## Proof Level

`fixture`

## Known Risks

- This fixture has no database persistence.
- This fixture has no HTTP router.
- Production RBAC would need host-specific bootstrap and migration decisions.

## Not Proven

- HTTP middleware integration
- database-backed role persistence
- production authorization behavior
