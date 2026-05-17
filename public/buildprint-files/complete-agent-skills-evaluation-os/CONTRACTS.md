# CONTRACTS

## SetupSnapshot

```ts
type SetupSnapshot = {
  id: string;
  target: 'claude-code' | 'codex' | 'opencode' | 'cursor' | 'generic';
  createdAt: string;
  sourceRefs: { kind: 'git' | 'package' | 'local'; ref: string }[];
  skills: SkillRef[];
  agents: ComponentRef[];
  commands: ComponentRef[];
  hooks: ComponentRef[];
  mcpServers: ComponentRef[];
  permissions: Record<string, unknown>;
  router?: ComponentRef;
};
```

## SkillRef

```ts
type SkillRef = {
  id: string;
  path: string;
  name: string;
  description: string;
  triggers: string[];
  estimatedLoadedTokens: number;
  requiredFiles: string[];
};
```

## EvalCase

```ts
type EvalCase = {
  id: string;
  layer: 'static' | 'loadout' | 'skill-unit' | 'activation' | 'transcript' | 'e2e' | 'multi-agent' | 'safety';
  prompt?: string;
  fixtures?: string[];
  expectedComponents?: string[];
  forbiddenComponents?: string[];
  assertions: Assertion[];
  hardFail?: boolean;
};
```

## TranscriptEvent

```ts
type TranscriptEvent = {
  ts: string;
  actor: 'user' | 'assistant' | 'tool' | 'subagent' | 'system';
  type: 'message' | 'skill_load' | 'tool_call' | 'file_write' | 'command' | 'test' | 'review' | 'approval' | 'finish';
  name?: string;
  payload?: unknown;
};
```

## Scorecard

```ts
type Scorecard = {
  total: number;
  hardFailed: boolean;
  layers: Record<string, { score: number; passed: number; failed: number; warnings: number }>;
  findings: Finding[];
};
```
