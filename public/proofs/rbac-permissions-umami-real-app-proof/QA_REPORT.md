# QA Report

## Fixture path

```text
/tmp/agb-umami
```

## Host

```text
https://github.com/umami-software/umami
c0ea3aefbee7a3429ee2f824b06dc4a9dbe0b7e1
```

## Loaded package

```text
https://agent-buildprint.com/buildprints/rbac-permissions/package.json
```

## Snapshot files

`agb start` downloaded `14` snapshot files.

## Dependency setup

Plain install was attempted:

```bash
npm install
```

It failed on an existing peer dependency conflict:

```text
ERESOLVE unable to resolve dependency tree
@hello-pangea/dnd@17.0.0 peer react@"^18.0.0"
root project react@"^19.2.5"
```

Install then succeeded with:

```bash
npm install --legacy-peer-deps
```

Result:

```text
added 1108 packages, and audited 1109 packages in 2m
18 vulnerabilities (10 moderate, 8 high)
```

## Default test command attempt

```bash
npm test -- src/permissions/agb-rbac.test.ts
```

Result:

```text
failed before loading tests: Umami's default Vitest setup imports @testing-library/dom, which is absent in this fresh dependency tree.
```

## Proof command

```bash
npx vitest run --config vitest.agb-rbac.config.ts
```

## Output

```text
RUN  v4.1.8 /tmp/agb-umami

Test Files  1 passed (1)
Tests       4 passed (4)
Start at    20:58:59
Duration    596ms (transform 206ms, setup 0ms, import 251ms, tests 12ms, environment 0ms)
```

## Checks

- Admin allow path: passed.
- Normal user deny path: passed.
- View-only user deny path: passed.
- Missing user deny path: passed.
- Missing role deny path: passed.
- Unknown role deny path: passed.
- Unknown permission deny path: passed.
- Selected existing Umami permission helpers call central AGB RBAC helper: passed.
- Receipt written: passed.

## Notes

This proof intentionally avoids changing Umami's database, role persistence, and broad permission model. It verifies a bounded real-app integration fixture against an existing authorization surface.

