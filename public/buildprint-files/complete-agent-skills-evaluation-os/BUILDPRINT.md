# BUILDPRINT — Complete Agent Skills Evaluation OS

## Mission

Build an evaluation operating system for complete coding-agent setups: skills, agents, commands, hooks, MCP servers, instructions, permissions, routers, subagents, and workflow rules.

The system must answer:

1. Is the setup valid and installed exactly as expected?
2. Are skills and components discoverable without manual prompting?
3. Do individual skills work in sandboxed tasks?
4. Does the agent follow required process order, not only final output?
5. Do subagents and parallel sessions preserve context, ownership, and merge safety?
6. Is the loadout worth its token/context cost?
7. Can results be reproduced in CI with stored evidence?

## Architecture

```text
Setup Snapshot
  → Static Lint
  → Loadout Inventory
  → Skill Unit Tests
  → Activation Evals
  → Transcript Process Checks
  → E2E Task Bench
  → Multi-Agent Safety
  → Scorecard + CI Reports
```

## Canonical modules

### 1. Setup Snapshot
Capture the target setup under test. Include installed skills, commands, agents, hooks, MCP servers, permissions, model/router config, and source commit or package lock.

### 2. Static Lint
Validate files before behavior tests. Check frontmatter, names, paths, hook schemas, MCP refs, permissions, tool declarations, forbidden patterns, and broken links.

### 3. Loadout Inventory
Measure context footprint, active/dormant artifacts, duplicates, loaded token tax, active token cost, and stale components.

### 4. Skill Unit Tests
Run one skill at a time in fresh sandboxes with fixtures and deterministic assertions on files, commands, JSON, stdout/stderr, response content, latency, and token use.

### 5. Activation Evals
Generate positive and negative prompts for every skill/agent/command/hook/MCP component. Score recall, precision, wrong-component activation, and ask-clarify behavior.

### 6. Transcript Process Checks
Check event order and forbidden shortcuts. Examples: skill loaded before writing, failing test before implementation, approval before destructive action, review before finish.

### 7. E2E Task Bench
Run complete repo tasks requiring multiple skills: plan → implement → test → review → finish. Score artifacts, tests, safety, recovery, and evidence.

### 8. Multi-Agent Safety
Evaluate delegation briefs, subagent JSON outputs, file ownership, worktree isolation, merge conflicts, stale state, and parent-context loss.

### 9. Scorecard + Reports
Produce machine-readable and human reports: JSON, Markdown, HTML/JUnit if implemented, stored transcripts, artifacts, diffs, and a weighted score.

## Non-goals

- Do not claim deterministic evaluation of model intelligence.
- Do not treat one happy-path chat transcript as proof.
- Do not require one specific agent vendor.
- Do not auto-install untrusted tools without explicit approval.
- Do not publish credentials, transcripts containing secrets, or private repo content.

## Implementation rule

Default proof mode must be offline and deterministic. Live agent/provider runs are optional adapters behind explicit configuration.
