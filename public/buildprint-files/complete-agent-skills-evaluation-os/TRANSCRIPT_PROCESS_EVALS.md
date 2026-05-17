# TRANSCRIPT_PROCESS_EVALS

Transcript checks prove the agent followed the intended workflow.

## Required invariants

- Skill loads before the first tool/file action it governs.
- Planning/brainstorming happens before coding when required.
- Failing test or test plan exists before implementation for TDD skills.
- Review happens before completion.
- User approval precedes destructive/external actions.
- Safety refusal or clarification occurs before risky operations.
- Final answer cites validation evidence and known gaps.

## Event order examples

```text
skill_load:brainstorming < file_write
skill_load:test-driven-development < test < file_write:src
skill_load:requesting-code-review < review < finish
approval < external_publish
```

## Source pressure

Superpowers-style transcript tests are the strongest model here: they evaluate behavior in real sessions, not only final artifacts.
