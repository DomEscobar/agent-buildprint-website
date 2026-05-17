# System Map

## Layers

1. **Install surface** — plugin manifests or runtime extension config register the harness with an agent runtime.
2. **Bootstrap surface** — session-start or first-message injection loads the “use skills first” rule and tool mappings.
3. **Skill registry** — directory of skill modules with activation descriptions and supporting references/scripts.
4. **Workflow router** — descriptions plus bootstrap pressure route user requests to the correct process skill.
5. **Methodology skills** — brainstorming, planning, TDD, debugging, review, finishing, worktrees, writing skills.
6. **Subagent orchestration** — fresh implementer and reviewer agents receive task-specific context and report status.
7. **Project artifacts** — generated specs/plans live in predictable docs paths and become the task contract.
8. **Validation harness** — transcript and prompt tests confirm that skills trigger and workflow order is obeyed.

## Main happy path

```text
User wants to build
  → bootstrap says check skills first
  → brainstorming activates
  → design is approved
  → writing-plans produces exact task plan
  → using-git-worktrees creates isolated workspace when appropriate
  → subagent-driven-development executes tasks
  → test-driven-development enforces red/green/refactor
  → requesting-code-review / receiving-code-review close loops
  → finishing-a-development-branch verifies and asks merge/PR/keep/discard
```

## Key insight

The “product” is behavior shaping. The repository is mostly text, but the actual system boundary includes prompt injection, runtime skill discovery, task/delegation tools, transcript output, git state, and generated docs.
