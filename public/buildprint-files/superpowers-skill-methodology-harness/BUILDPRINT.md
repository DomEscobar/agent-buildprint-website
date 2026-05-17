# Buildprint: Superpowers Skill Methodology Harness

## Promise

Build a portable skill-methodology harness for coding agents that turns good engineering practice into executable agent behavior: relevant skills are loaded before responses, implementation is gated by design and plans, code is produced with TDD, subagents execute isolated tasks, and completion is blocked until review and verification evidence exists.

## Non-goals

- Do not copy `obra/superpowers` text verbatim into a public clone.
- Do not claim official Superpowers compatibility unless installing the real plugin.
- Do not build a marketplace/dashboard/control-plane as the core product.
- Do not treat static skill files as sufficient; activation and transcripts are part of the product.

## Architecture

```text
Plugin / install surface
  → Session bootstrap / “use skills before action” rule
  → Skill discovery + activation descriptions
  → Mandatory workflow graph
  → Design/spec docs
  → Implementation plans
  → Worktree or isolated branch execution
  → TDD loop
  → Subagent implement/review loops
  → Finish branch + validation
  → Transcript/eval harness
```

## Required files in an implementation

- `skills/<name>/SKILL.md` with frontmatter `name` and `description`.
- A bootstrap instruction loaded at session start.
- Agent-specific adapters for at least one runtime: Claude Code, Codex, OpenCode, Gemini, Cursor, or Copilot CLI.
- Project docs directory for generated specs and plans.
- Tests/evals that prove automatic activation on realistic prompts.

## Status

Public Buildprint status: `dry-run-needed`. The package is mapped and build-verified, but still needs a clean-room runnable reversal proof before it should be called validated.
