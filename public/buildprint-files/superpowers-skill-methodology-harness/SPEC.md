# Specification

## Functional requirements

- The harness MUST load bootstrap instructions at the beginning of a session or before the first user-task response.
- The bootstrap MUST require checking relevant skills before action, including before clarifying questions when a skill might apply.
- Skills MUST have machine-readable metadata sufficient for runtime discovery and routing.
- Creative/build/change requests MUST activate a design/spec workflow before implementation.
- Approved designs MUST transition into implementation plans with exact file paths, test commands, expected results, and small task granularity.
- Implementation MUST prefer isolated branches/worktrees when the workflow calls for it.
- Feature, bugfix, refactor, and behavior-change work MUST use failing-test-first TDD unless the human explicitly grants an exception.
- Debugging MUST gather root-cause evidence before proposing fixes.
- Plan execution MUST support either sequential checkpoint execution or fresh subagent per task with two-stage review.
- Completion MUST include verification evidence, not just “done”.

## Behavioral invariants

- No code before approved design for creative/build work.
- No production code before failing test for implementation work.
- No fix before root-cause investigation for bugs.
- No subagent inherits broad hidden context by default; provide exact task context.
- Review order is spec compliance before code quality.
- Skill modifications require eval evidence.

## Acceptance prompt

A clean session receiving:

```text
Let's make a react todo list
```

MUST load the bootstrap and activate brainstorming before writing implementation code.
