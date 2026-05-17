# Skill Library

## Core skills to reproduce

| Skill | Purpose | Hard gate |
|---|---|---|
| `using-superpowers` | Bootstrap discipline and skill lookup | Check skills before action |
| `brainstorming` | Turn rough ideas into approved design/spec | No implementation before design approval |
| `writing-plans` | Convert approved design into executable small tasks | No vague/TODO tasks; exact files and checks |
| `using-git-worktrees` | Isolate work on a branch/worktree | Baseline setup/tests before implementation |
| `test-driven-development` | Red/green/refactor behavior | No production code without failing test first |
| `systematic-debugging` | Root cause before fixes | No fix before evidence gathering |
| `subagent-driven-development` | Fresh implementer per task + two-stage review | Spec review before quality review |
| `executing-plans` | Sequential execution with checkpoints | Follow plan, verify each task |
| `requesting-code-review` | Review before continuing/finishing | Critical issues block progress |
| `receiving-code-review` | Address review feedback | Do not hand-wave issues |
| `finishing-a-development-branch` | Final verification and branch disposition | Present merge/PR/keep/discard options |
| `verification-before-completion` | Check fix actually works | Evidence before done claim |
| `writing-skills` | Create/modify skills | Eval evidence required |

## Skill design rules

- Activation description is part of runtime behavior; tune it as carefully as code.
- Keep process skills forceful when they guard high-risk agent behavior.
- Put supporting prompts/references next to the skill.
- Every hard gate needs an eval or transcript test.
