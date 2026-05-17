# MULTI_AGENT_SAFETY

Multi-agent setups fail differently from single-agent skills.

## Required checks

- Parent context is included in subagent brief.
- Subagent role is explicit: research, execute, review, QA.
- Tool permissions are role-appropriate.
- Output is machine-mergeable JSON or a strict schema.
- File ownership is declared and respected.
- Worktrees/branches are isolated.
- Parallel sessions do not claim the same issue or edit same files silently.
- Merge/rebase conflicts are handled with evidence.
- Subagent failures are surfaced, not hidden.

## Tool mapping

- `Powerjackie/delegate-kit`: delegation brief and JSON output contracts.
- `wan-huiyan/agent-traffic-control`: parallel sessions, issue claiming, worktree isolation, PR conflict recovery.
