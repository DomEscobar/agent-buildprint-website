# Superpowers Skill Methodology Harness Buildprint

A source-backed Buildprint for rebuilding a Superpowers-style coding-agent skill setup: bootstrap instructions, mandatory skill activation, brainstorming-before-code, spec/plan docs, TDD, subagent-driven execution, code review, finishing workflow, and transcript-based harness acceptance tests.

Source inspiration: [`obra/superpowers`](https://github.com/obra/superpowers), pinned during mapping at commit `f2cbfbefebbfef77321e4c9abc9e949826bea9d7`.

This is a **methodology harness Buildprint**, not a package-manager dashboard and not a verbatim clone. It defines the durable architecture and behavioral contracts an agent setup must reproduce.

## Read order

1. `BUILDPRINT.md`
2. `SOURCE_TRACE.md`
3. `SYSTEM_MAP.md`
4. `SPEC.md`
5. `BOOTSTRAP_AND_ROUTING.md`
6. `SKILL_LIBRARY.md`
7. `WORKFLOW.md`
8. `SUBAGENT_ORCHESTRATION.md`
9. `TEST_MATRIX.md`
10. `VALIDATION_REPORT.md`
11. `questions.md`

## Core claim

A useful skill harness is not “some skill files on disk.” It needs:

- a session-start bootstrap that forces skill lookup before action,
- skills with sharp activation descriptions and hard gates,
- a canonical workflow from idea → design → plan → isolated implementation → TDD → review → finish,
- subagent/task isolation with review loops,
- transcript/eval tests proving the harness actually triggers.
