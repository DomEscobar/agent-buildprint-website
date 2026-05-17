# CONTRACTS

## ProviderConfig

```ts
type ProviderConfig = {
  id: string;
  kind: 'fake' | 'openai-compatible' | 'anthropic' | 'bedrock' | 'local';
  model: string;
  contextWindowTokens: number;
  maxOutputTokens: number;
  supportsTools: boolean;
  supportsStreaming: boolean;
  env?: { apiKey?: string; baseUrl?: string };
};
```

## RuntimeEvent

```ts
type RuntimeEvent =
  | { type: 'turn.started'; sessionId: string; messageId: string }
  | { type: 'model.delta'; text: string }
  | { type: 'tool.requested'; tool: string; input: unknown }
  | { type: 'tool.allowed' | 'tool.denied'; tool: string; reason?: string }
  | { type: 'tool.result'; tool: string; output: unknown }
  | { type: 'skill.selected'; skill: string }
  | { type: 'mcp.tool_mapped'; serverId: string; tool: string }
  | { type: 'team.task'; taskId: string; status: 'created' | 'started' | 'completed' | 'failed' }
  | { type: 'memory.compacted'; episodeId: string; retainedMessages: number }
  | { type: 'telemetry.usage'; input: number; output: number; total: number }
  | { type: 'turn.completed'; sessionId: string; finalText: string }
  | { type: 'turn.failed'; sessionId: string; error: string };
```

## ToolSpec

```ts
type ToolSpec = {
  name: string;
  description: string;
  risk: 'safe' | 'read' | 'write' | 'network' | 'shell';
  inputSchema: Record<string, unknown>;
  handler: (input: unknown, ctx: ToolContext) => Promise<unknown>;
};
```

## SkillSpec

```ts
type SkillSpec = {
  name: string;
  description: string;
  triggers: string[];
  instructions: string;
  resources?: string[];
  scripts?: string[];
  enabled: boolean;
};
```

## MemoryState

```ts
type MemoryState = {
  longTerm: string;
  todayEpisode: string;
  history: Array<{ role: 'user' | 'assistant' | 'tool' | 'system'; content: string; at: string }>;
  checkpoint?: unknown;
  attachments: Array<{ id: string; name: string; sourceSpan?: string }>;
};
```

## TeamTask

```ts
type TeamTask = {
  id: string;
  role: string;
  input: string;
  status: 'created' | 'started' | 'completed' | 'failed';
  result?: string;
  events: RuntimeEvent[];
};
```
