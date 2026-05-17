# Bootstrap and Routing

## Bootstrap responsibilities

- Establish that relevant skills must be used before responses/actions.
- Define instruction priority: explicit human/project instructions first, methodology skills next, default model behavior last.
- Teach runtime-specific tool mappings for non-native harnesses.
- Prevent double-injection and repeated disk reads where possible.
- Ensure the skill registry path is registered before skill discovery.

## Routing model

Routing should combine:

1. **Skill metadata** — `name` and activation `description`.
2. **Bootstrap pressure** — if a skill might apply, load it.
3. **Workflow transitions** — brainstorming hands off to writing-plans; writing-plans hands off to execution; execution hands off to finishing.
4. **Negative gates** — prohibit implementation, fixes, or completion when prerequisite evidence is missing.

## Adapter contract

Each runtime adapter must answer:

- How are skills discovered?
- How is bootstrap injected once per session/conversation?
- How are subagents/tasks spawned?
- How are todos tracked?
- How are transcripts/logs captured for evals?
- How are file edits, shell commands, and git operations authorized?
