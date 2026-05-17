# STATIC_LINT

Static checks run before behavior tests.

## Checks

- `SKILL.md` frontmatter parses.
- Skill names are stable, lowercase/slug-safe where required.
- Descriptions are directive enough to route, not vague marketing.
- Referenced files exist.
- Hooks use supported events and valid commands.
- MCP server declarations have command/transport/permission boundaries.
- Agent files declare role, tools, and output shape where possible.
- Permissions are least-privilege.
- Secrets are not embedded in config.
- External actions are approval-gated.

## Tool mapping

- Use `agent-sh/agnix` for broad agent-config linting.
- Use custom rules for project-specific policies.
- Use `motiful/skill-forge` style checks for skill package publish readiness.
