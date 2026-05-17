# Complete Agent Skills Evaluation OS Buildprint

A stack-adaptable Buildprint for evaluating a complete coding-agent skills setup - not just one `SKILL.md` file.

The blueprint combines static config linting, install snapshot/parity, loadout/token inventory, skill-level sandbox tests, component activation tests, transcript/order checks, end-to-end task benchmarks, multi-agent safety cases, and CI scorecards.

## Why this exists

A skills setup can look good while failing in practice:

- the files are invalid or silently ignored;
- the installed setup is not the setup you think you are testing;
- the right skill exists but does not activate;
- the agent produces plausible output while skipping the required process;
- subagents collide on files or lose parent context;
- the loadout taxes every turn with unused context.

This Buildprint evaluates the whole system from install to behavior.

## Default proof

The included proof is an offline JavaScript implementation of the evaluation pipeline and scoring model. It uses fixture objects only and makes no network or agent calls.

```bash
cd proof
npm test
```

## Research basis

Research artifacts:

- `/root/.openclaw/workspace/research/newer-superpowers-like-2026-05-17/`
- `/root/.openclaw/workspace/research/complete-agent-skills-eval-stack-2026-05-17/`

Primary source pressure came from `balyakin/skill-eval-runner`, `sjnims/cc-plugin-eval`, `obra/superpowers`, `agent-sh/agnix`, `David-CKS/claude-skill-router`, `robester0403/Local-Loadout-Smithery`, `Powerjackie/delegate-kit`, `wan-huiyan/agent-traffic-control`, `slash9494/ai-config-sync-manager`, `TakumaAida/agents-deploy`, `motiful/skill-forge`, and `agent-sh/agentsys`.
