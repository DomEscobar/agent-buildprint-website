# Phase 01 — OpenClaw Skeleton

## Goal

Create the runnable OpenClaw-shaped project skeleton.

## Files

- `package.json`
- `.env.example`
- `AGENTS.md`, `SOUL.md`, `USER.md`
- `config/openclaw.json`
- `docker/Dockerfile`
- `docker/docker-compose.yml`
- `docker/entrypoint.sh`
- skill folders with `SKILL.md` and executable placeholders

## Steps

1. Create scripts required by `BUILDPRINT.md`.
2. Add all env names from the environment contract.
3. Create Docker/runtime structure.
4. Create OpenClaw config that loads extension and skills.

## Do not

- build Express/Next as the main runtime;
- omit OpenClaw config/skills;
- put real secrets in files.

## Exit criteria

- file tree exists;
- `npm run test:static` can be added later without changing structure;
- missing keys are placeholders only.
