# Source Trace

Mapped source: `obra/superpowers` at commit `f2cbfbefebbfef77321e4c9abc9e949826bea9d7`.

## Evidence table

| Claim | Source evidence |
|---|---|
| Superpowers is a complete coding-agent methodology built from composable skills plus initial instructions. | `README.md:1-7` |
| The intended flow is to clarify/build spec before writing code, then make an implementation plan, then run subagent-driven development. | `README.md:9-19` |
| It supports multiple harnesses: Claude Code, Codex CLI/App, Factory Droid, Gemini CLI, OpenCode, Cursor, Copilot CLI. | `README.md:31-152` |
| Basic workflow includes brainstorming, worktrees, writing plans, subagent-driven-development/executing-plans, TDD, code review, finishing branch. | `README.md:154-170` |
| Skill library includes TDD, systematic debugging, verification, brainstorming, writing plans, executing plans, dispatching parallel agents, review, worktrees, subagent development, writing skills, using-superpowers. | `README.md:172-193` |
| `brainstorming` hard-gates implementation until design approval. | `skills/brainstorming/SKILL.md:12-14` |
| `writing-plans` requires bite-sized tasks with exact files, code, commands, expected output, DRY/YAGNI/TDD. | `skills/writing-plans/SKILL.md:36-120` |
| `subagent-driven-development` uses fresh subagent per task plus spec-compliance then code-quality review. | `skills/subagent-driven-development/SKILL.md:6-14`, `:42-87` |
| TDD skill has iron law: no production code without failing test first; delete code written before tests. | `skills/test-driven-development/SKILL.md:31-45` |
| Systematic debugging requires root cause investigation before fixes. | `skills/systematic-debugging/SKILL.md:16-23`, `:46-87` |
| `using-superpowers` requires relevant skills before any response/action and defines instruction priority. | `skills/using-superpowers/SKILL.md:10-24`, `:44-76` |
| OpenCode plugin injects bootstrap content and registers skills path. | `.opencode/plugins/superpowers.js:55-133` |
| Plugin metadata exposes skills to Codex and declares planning/TDD/debugging/workflow capabilities. | `.codex-plugin/plugin.json:1-47` |
| Claude plugin metadata describes core skills library and MIT license. | `.claude-plugin/plugin.json:1-19` |
| Harness support acceptance requires clean session prompt “Let's make a react todo list” to auto-trigger brainstorming before code. | `AGENTS.md:67-86` |
| Skill changes require eval evidence and adversarial pressure testing. | `AGENTS.md:88-99` |
| Integration tests verify skill invocation, subagent dispatch, TodoWrite, implementation files, passing tests, commits, and no extra features. | `docs/testing.md:40-64`, `:73-98` |
| There are dedicated skill-triggering and explicit-skill-request test runners. | `tests/skill-triggering/run-all.sh:10-60`, `tests/explicit-skill-requests/run-all.sh:17-70` |

## Mapping caveat

Line numbers were inspected from the pinned local clone. Re-check if mapping a later source commit.
