# QA Report

## Fixture path

```text
/tmp/agb-rbac-runtime-fixture
```

## Loaded package

```text
https://agent-buildprint.com/buildprints/rbac-permissions/package.json
```

## Snapshot files

`agb start` downloaded `14` snapshot files.

## Command

```bash
npm test
```

## Output

```text
> test
> node --test

✔ admin can access the protected admin report
✔ member is denied access to the protected admin report
✔ missing role is denied with an actionable state
✔ central permission helper denies unknown users and roles
tests 4
pass 4
fail 0
```

## Checks

- Admin allow path: passed.
- Member deny path: passed.
- Missing-role deny path: passed.
- Unknown user/role deny behavior: passed.
- Receipt written: passed.

## Notes

This test intentionally avoids external services and provider keys. It validates local fixture behavior and Capability Buildprint workflow adherence.

