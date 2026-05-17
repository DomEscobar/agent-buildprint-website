import assert from 'node:assert/strict';
import test from 'node:test';
import { AgentRuntime } from '../src/runtime.js';

test('streams deltas before completing a turn', async () => {
  const runtime = new AgentRuntime();
  const result = await runtime.turn('hello');
  const deltaIndexes = result.events.map((e, i) => e.type === 'model.delta' ? i : -1).filter((i) => i >= 0);
  const completeIndex = result.events.findIndex((e) => e.type === 'turn.completed');
  assert.ok(deltaIndexes.length >= 2);
  assert.ok(Math.max(...deltaIndexes) < completeIndex);
  assert.match(result.memory.history.at(-1)!.content, /Streaming personal agent response/);
});

test('selects a skill, executes safe write tool, delegates critic, and records telemetry', async () => {
  const runtime = new AgentRuntime();
  const result = await runtime.turn('audit this project');
  assert.ok(result.events.some((e) => e.type === 'skill.selected' && e.skill === 'code-audit'));
  assert.ok(result.events.some((e) => e.type === 'tool.allowed' && e.tool === 'todo.create'));
  assert.ok(result.events.some((e) => e.type === 'tool.result' && e.tool === 'todo.create'));
  assert.ok(result.events.some((e) => e.type === 'team.task' && e.status === 'completed'));
  assert.ok(result.events.some((e) => e.type === 'telemetry.usage' && e.total > 0));
});

test('denies shell tool by default and keeps runtime alive', async () => {
  const runtime = new AgentRuntime();
  const result = await runtime.turn('please run shell');
  assert.ok(result.events.some((e) => e.type === 'tool.denied' && e.tool === 'shell.run' && /approval/.test(e.reason ?? '')));
  assert.ok(result.events.some((e) => e.type === 'turn.completed'));
});

test('maps and executes fake MCP tool through same tool policy', async () => {
  const runtime = new AgentRuntime();
  const result = await runtime.turn('use mcp please');
  assert.ok(result.events.some((e) => e.type === 'mcp.tool_mapped' && e.tool === 'mcp.echo'));
  assert.ok(result.events.some((e) => e.type === 'tool.allowed' && e.tool === 'mcp.echo'));
  assert.ok(result.events.some((e) => e.type === 'tool.result' && e.tool === 'mcp.echo'));
});

test('compacts memory under context pressure while retaining recent messages', async () => {
  const runtime = new AgentRuntime();
  await runtime.turn('audit '.repeat(80));
  await runtime.turn('audit '.repeat(80));
  assert.ok(runtime.events.some((e) => e.type === 'memory.compacted'));
  assert.ok(runtime.memory.history.length <= 5);
  assert.match(runtime.memory.todayEpisode, /episode-/);
  assert.equal(runtime.memory.checkpoint, undefined);
});
