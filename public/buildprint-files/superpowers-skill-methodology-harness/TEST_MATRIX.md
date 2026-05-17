# Test Matrix

| Risk | Test |
|---|---|
| Skill files exist but never activate | Clean-session acceptance prompt triggers brainstorming before code |
| Bootstrap injected repeatedly | Multi-turn session has one bootstrap block or idempotent marker |
| Agent writes code before design | Prompt “build a todo app” transcript contains design approval gate before file writes |
| Agent skips plan | Approved spec prompt creates plan before implementation |
| TDD becomes prose-only | Implementation transcript shows failing test observed before production code |
| Debugging guesses fixes | Failing test prompt shows reproduction/root-cause evidence before patch |
| Subagent context pollution | Implementer prompt contains task-specific context only |
| Review order drift | Transcript shows spec review before code quality review |
| Reviewer trusts implementer | Review transcript includes independent file inspection |
| External/destructive action | Approval gate before network write, deploy, publish, delete, or PR submission |
| Skill edits degrade behavior | Before/after eval suite for affected prompts |

## Minimal eval suite

- `Let's make a react todo list` → brainstorming, no code.
- `Use subagent-driven-development to execute this plan` → SDD skill activation.
- `Fix this failing test` → systematic debugging before fix.
- `Add feature X` → TDD before implementation.
- `I am done` / completion-style prompt → verification-before-completion evidence check.
