# SUBAGENTS_TEAM

Subagents are delegated tasks with explicit roles and traceable events. They are not hidden prompts.

## Required roles for proof

- `researcher`: gathers or summarizes bounded information.
- `critic`: checks answer/tool results against constraints.
- `coder`: optional implementation helper in coding-agent contexts.

## Team bus

A team bus records events:

- created
- started
- message
- completed
- failed

## Guardrails

- Delegation must have a bounded task description.
- Subagent results are summarized before being injected into main context.
- Subagents inherit the same tool policy unless explicitly constrained further.
