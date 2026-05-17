export type Risk = 'safe' | 'read' | 'write' | 'network' | 'shell';
export type Role = 'system' | 'user' | 'assistant' | 'tool';

export type RuntimeEvent =
  | { type: 'turn.started'; sessionId: string; messageId: string }
  | { type: 'skill.selected'; skill: string }
  | { type: 'model.delta'; text: string }
  | { type: 'tool.requested'; tool: string; input: unknown }
  | { type: 'tool.allowed' | 'tool.denied'; tool: string; reason?: string }
  | { type: 'tool.result'; tool: string; output: unknown }
  | { type: 'mcp.tool_mapped'; serverId: string; tool: string }
  | { type: 'team.task'; taskId: string; status: 'created' | 'started' | 'completed' | 'failed' }
  | { type: 'memory.compacted'; episodeId: string; retainedMessages: number }
  | { type: 'telemetry.usage'; input: number; output: number; total: number }
  | { type: 'turn.completed'; sessionId: string; finalText: string };

export type Message = { role: Role; content: string; at: string };
export type ProviderConfig = { id: string; model: string; contextWindowTokens: number; supportsStreaming: boolean; supportsTools: boolean };
export type ToolSpec = { name: string; risk: Risk; description: string; handler: (input: unknown) => Promise<unknown> };
export type SkillSpec = { name: string; triggers: string[]; instructions: string; enabled: boolean };
export type TeamTask = { id: string; role: string; input: string; status: 'created' | 'started' | 'completed' | 'failed'; result?: string; events: RuntimeEvent[] };

export class MemoryStore {
  longTerm = 'User prefers concise, evidence-backed answers.';
  todayEpisode = '';
  history: Message[] = [];
  checkpoint: Message[] | undefined;
  compactCount = 0;

  append(role: Role, content: string) {
    this.history.push({ role, content, at: new Date(0).toISOString() });
  }

  writeCheckpoint() { this.checkpoint = [...this.history]; }
  clearCheckpoint() { this.checkpoint = undefined; }

  compact(retain = 4) {
    const old = this.history.slice(0, Math.max(0, this.history.length - retain));
    if (!old.length) return undefined;
    this.compactCount += 1;
    const episodeId = `episode-${this.compactCount}`;
    this.todayEpisode += `\n${episodeId}: ${old.map((m) => `${m.role}:${m.content}`).join(' | ')}`;
    this.history = this.history.slice(-retain);
    return { episodeId, retainedMessages: this.history.length };
  }
}

export class Telemetry {
  input = 0; output = 0;
  record(input: number, output: number) { this.input += input; this.output += output; }
  get total() { return this.input + this.output; }
}

export class FakeProvider {
  constructor(public config: ProviderConfig) {}
  async *stream(prompt: string): AsyncGenerator<string> {
    if (prompt.toLowerCase().includes('audit')) {
      yield 'I will use the code audit skill. ';
      yield '[tool:todo.create:{"title":"audit repo"}] ';
      yield 'Delegating critic.';
      return;
    }
    if (prompt.toLowerCase().includes('mcp')) {
      yield 'Mapping MCP tool. [tool:mcp.echo:{"text":"hello"}]';
      return;
    }
    if (prompt.toLowerCase().includes('shell')) {
      yield 'Requesting shell. [tool:shell.run:{"cmd":"rm -rf /"}]';
      return;
    }
    yield 'Streaming '; yield 'personal '; yield 'agent response.';
  }
}

export class ToolRegistry {
  private tools = new Map<string, ToolSpec>();
  constructor(private allowedRisks: Set<Risk> = new Set(['safe', 'read', 'write'])) {}
  register(tool: ToolSpec) { this.tools.set(tool.name, tool); }
  list() { return [...this.tools.values()]; }
  async run(name: string, input: unknown): Promise<{ allowed: boolean; output?: unknown; reason?: string }> {
    const tool = this.tools.get(name);
    if (!tool) return { allowed: false, reason: 'unknown tool' };
    if (!this.allowedRisks.has(tool.risk)) return { allowed: false, reason: `${tool.risk} tools require approval` };
    return { allowed: true, output: await tool.handler(input) };
  }
}

export class SkillRegistry {
  constructor(public skills: SkillSpec[]) {}
  select(message: string) {
    const lower = message.toLowerCase();
    return this.skills.find((s) => s.enabled && s.triggers.some((t) => lower.includes(t.toLowerCase())));
  }
}

export class FakeMcpAdapter {
  constructor(private tools: ToolRegistry) {}
  map(serverId: string, tool: string, handler: (input: unknown) => Promise<unknown>): RuntimeEvent {
    const name = `mcp.${tool}`;
    this.tools.register({ name, risk: 'safe', description: `MCP ${serverId}/${tool}`, handler });
    return { type: 'mcp.tool_mapped', serverId, tool: name };
  }
}

export class TeamBus {
  tasks: TeamTask[] = [];
  create(role: string, input: string): RuntimeEvent[] {
    const task: TeamTask = { id: `task-${this.tasks.length + 1}`, role, input, status: 'created', events: [] };
    this.tasks.push(task);
    const events: RuntimeEvent[] = [
      { type: 'team.task', taskId: task.id, status: 'created' },
      { type: 'team.task', taskId: task.id, status: 'started' },
      { type: 'team.task', taskId: task.id, status: 'completed' },
    ];
    task.status = 'completed'; task.result = `${role} checked: ${input}`; task.events = events;
    return events;
  }
}

function estimateTokens(text: string) { return Math.max(1, Math.ceil(text.length / 4)); }
function parseToolCalls(text: string): Array<{ name: string; input: unknown }> {
  const calls: Array<{ name: string; input: unknown }> = [];
  const re = /\[tool:([\w.]+):(\{[^\]]*\})\]/g;
  for (const match of text.matchAll(re)) calls.push({ name: match[1], input: JSON.parse(match[2]) });
  return calls;
}

export class AgentRuntime {
  public events: RuntimeEvent[] = [];
  public memory = new MemoryStore();
  public telemetry = new Telemetry();
  public tools = new ToolRegistry();
  public skills = new SkillRegistry([{ name: 'code-audit', triggers: ['audit'], instructions: 'Audit code with evidence.', enabled: true }]);
  public team = new TeamBus();
  public mcp = new FakeMcpAdapter(this.tools);

  constructor(public provider = new FakeProvider({ id: 'fake', model: 'fake-agent', contextWindowTokens: 120, supportsStreaming: true, supportsTools: true })) {
    this.tools.register({ name: 'todo.create', risk: 'write', description: 'Create a todo', handler: async (input) => ({ id: 'todo-1', ...input as object }) });
    this.tools.register({ name: 'shell.run', risk: 'shell', description: 'Run shell command', handler: async () => 'should-not-run' });
    this.events.push(this.mcp.map('fake-server', 'echo', async (input) => input));
  }

  async turn(message: string) {
    const sessionId = 'session-1';
    this.events.push({ type: 'turn.started', sessionId, messageId: `msg-${this.memory.history.length + 1}` });
    this.memory.append('user', message);
    this.memory.writeCheckpoint();
    const skill = this.skills.select(message);
    if (skill) this.events.push({ type: 'skill.selected', skill: skill.name });
    const context = `${this.memory.longTerm}\n${this.memory.todayEpisode}\n${skill?.instructions ?? ''}\n${message}`;
    let finalText = '';
    for await (const delta of this.provider.stream(context)) {
      finalText += delta;
      this.events.push({ type: 'model.delta', text: delta });
    }
    for (const call of parseToolCalls(finalText)) {
      this.events.push({ type: 'tool.requested', tool: call.name, input: call.input });
      const result = await this.tools.run(call.name, call.input);
      if (!result.allowed) this.events.push({ type: 'tool.denied', tool: call.name, reason: result.reason });
      else {
        this.events.push({ type: 'tool.allowed', tool: call.name });
        this.events.push({ type: 'tool.result', tool: call.name, output: result.output });
        this.memory.append('tool', `${call.name}: ${JSON.stringify(result.output)}`);
      }
    }
    if (message.toLowerCase().includes('audit')) this.events.push(...this.team.create('critic', 'review audit plan'));
    const input = estimateTokens(context); const output = estimateTokens(finalText);
    this.telemetry.record(input, output);
    this.events.push({ type: 'telemetry.usage', input, output, total: this.telemetry.total });
    this.memory.append('assistant', finalText.replace(/\[tool:[^\]]+\]/g, '').trim());
    if (this.telemetry.total > this.provider.config.contextWindowTokens * 0.6) {
      const compacted = this.memory.compact(4);
      if (compacted) this.events.push({ type: 'memory.compacted', ...compacted });
    }
    this.memory.clearCheckpoint();
    this.events.push({ type: 'turn.completed', sessionId, finalText: this.memory.history.at(-1)?.content ?? '' });
    return { finalText, events: this.events, memory: this.memory, telemetry: this.telemetry };
  }
}
