# Subagent Orchestration

## Principle

Fresh subagent per task. Do not dump whole session context into implementation workers. Build a precise packet from the plan: task text, relevant files, constraints, expected checks, and reporting schema.

## Per-task loop

```text
Coordinator reads full plan
  → dispatch implementer with one task
  → implementer self-reviews and reports DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED
  → coordinator dispatches spec reviewer
  → if spec gaps, re-dispatch implementer with targeted fix
  → coordinator dispatches code-quality reviewer
  → if quality gaps, re-dispatch implementer with targeted fix
  → mark task complete
```

## Report schema

```json
{
  "status": "DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED",
  "files_changed": [],
  "tests_run": [],
  "commits": [],
  "concerns": [],
  "next_context_needed": null
}
```

## Safety rules

- Subagents must not invent missing plan details.
- BLOCKED means change context/model/task shape, not blind retry.
- Reviewers must inspect code independently; do not trust implementer summaries.
- Parallel execution needs file ownership or separate worktrees.
