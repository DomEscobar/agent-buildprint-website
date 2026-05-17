# Contracts

## Skill metadata

```yaml
---
name: skill-name
description: Use when ...
---
```

## Generated spec path

`docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`

## Generated plan path

`docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`

## Plan task shape

```markdown
### Task N: Component Name

**Files:**
- Create: `path/file.ext`
- Modify: `path/existing.ext:line-range`
- Test: `tests/path/file.test.ext`

- [ ] Step 1: Write failing test
- [ ] Step 2: Run test and confirm expected failure
- [ ] Step 3: Implement minimal code
- [ ] Step 4: Run tests and confirm pass
- [ ] Step 5: Commit
```

## Transcript event requirements

A validation transcript should prove:

- bootstrap/skill loaded,
- correct skill activated,
- prohibited premature action did not occur,
- required docs/files/tests/commits exist,
- final claim includes evidence.
