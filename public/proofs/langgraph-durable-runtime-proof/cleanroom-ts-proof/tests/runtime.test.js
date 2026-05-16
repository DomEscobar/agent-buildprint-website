import test from 'node:test';
import assert from 'node:assert/strict';
import { Command, GraphBuilder, InMemoryCheckpointSaver, SafeSerializer, START, END, Send, interrupt } from '../dist/runtime.js';

const schema = () => ({
  count: { type: 'number' },
  route: { type: 'string' },
  log: { reducer: (a, b) => [...(a ?? []), ...(Array.isArray(b) ? b : [b])] },
  answer: { type: 'string' },
});

test('simple A to B graph invokes both nodes and returns final state', () => {
  const graph = new GraphBuilder(schema())
    .add_node('A', () => ({ count: 1, log: ['A'] }))
    .add_node('B', (s) => ({ count: s.count + 1, log: ['B'] }))
    .set_entry_point('A')
    .add_edge('A', 'B')
    .set_finish_point('B')
    .compile();
  assert.deepEqual(graph.invoke({}), { count: 2, log: ['A', 'B'] });
});

test('conditional route chooses destination based on state', () => {
  const graph = new GraphBuilder(schema())
    .add_node('set', () => ({ route: 'right' }))
    .add_node('left', () => ({ count: 1 }))
    .add_node('right', () => ({ count: 2 }))
    .set_entry_point('set')
    .add_conditional_edges('set', (s) => s.route, { left: 'left', right: 'right' })
    .set_finish_point('left')
    .set_finish_point('right')
    .compile();
  assert.equal(graph.invoke({}).count, 2);
});

test('reducer merge accepts same-step writes deterministically', () => {
  const graph = new GraphBuilder(schema())
    .add_node('A', () => ({ log: ['A'] }))
    .add_node('B', () => ({ log: ['B'] }))
    .add_node('Join', () => ({ count: 1 }))
    .add_edge(START, 'A')
    .add_edge(START, 'B')
    .add_edge('A', 'Join')
    .add_edge('B', 'Join')
    .set_finish_point('Join')
    .compile();
  assert.deepEqual(graph.invoke({}).log, ['A', 'B']);
});

test('invalid graph compile fails before execution', () => {
  assert.throws(() => new GraphBuilder(schema()).add_node('A', () => ({})).compile(), /entrypoint/);
  assert.throws(() => new GraphBuilder(schema()).add_node('A', () => ({})).add_node('A', () => ({})), /Duplicate/);
  assert.throws(() => new GraphBuilder(schema()).add_node('A', () => ({})).add_edge(START, 'Missing').compile(), /Unknown edge target/);
});

test('checkpoint restore uses latest and selected checkpoint', () => {
  const saver = new InMemoryCheckpointSaver();
  const graph = new GraphBuilder(schema())
    .add_node('inc', (s) => ({ count: (s.count ?? 0) + 1 }))
    .set_entry_point('inc')
    .set_finish_point('inc')
    .compile({ checkpointer: saver });
  const config = { configurable: { thread_id: 't1' } };
  assert.equal(graph.invoke({ count: 0 }, config).count, 1);
  const first = saver.getTuple(config).checkpoint.id;
  assert.equal(graph.invoke(new Command({ goto: 'inc' }), config).count, 2);
  assert.equal(graph.get_state(config).values.count, 2);
  assert.equal(graph.get_state({ configurable: { thread_id: 't1', checkpoint_id: first } }).values.count, 1);
});

test('interrupt then resume continues from saved state', () => {
  const saver = new InMemoryCheckpointSaver();
  const graph = new GraphBuilder(schema())
    .add_node('ask', (s, ctx) => {
      if (!ctx.resume) interrupt('age?');
      return { answer: ctx.resume };
    })
    .set_entry_point('ask')
    .set_finish_point('ask')
    .compile({ checkpointer: saver });
  const config = { configurable: { thread_id: 't-int' } };
  const events = [...graph.stream({}, config, { stream_mode: 'values' })];
  assert.equal(events.at(-1).kind, 'interrupt');
  assert.equal(events.at(-1).value, 'age?');
  assert.equal(graph.invoke(new Command({ resume: '42' }), config).answer, '42');
});

test('failed superstep stores successful pending writes', () => {
  const saver = new InMemoryCheckpointSaver();
  const graph = new GraphBuilder(schema())
    .add_node('good', () => ({ log: ['good'] }))
    .add_node('bad', () => { throw new Error('boom'); })
    .add_edge(START, 'good')
    .add_edge(START, 'bad')
    .compile({ checkpointer: saver });
  const config = { configurable: { thread_id: 't-fail' } };
  assert.throws(() => [...graph.stream({}, config)], /boom/);
  const pending = saver.getTuple(config).pending_writes;
  assert.ok(pending.some(([task, key]) => task === 'good' && key === 'log'));
});

test('stream event snapshots emit documented local shapes', () => {
  const saver = new InMemoryCheckpointSaver();
  const graph = new GraphBuilder(schema()).add_node('A', () => ({ count: 1 })).set_entry_point('A').set_finish_point('A').compile({ checkpointer: saver });
  for (const mode of ['values', 'updates', 'checkpoints', 'tasks', 'debug']) {
    const events = [...graph.stream({}, { configurable: { thread_id: `stream-${mode}` } }, { stream_mode: mode })];
    assert.ok(events.length >= 1, mode);
    assert.equal(events[0].mode, mode);
  }
});

test('serializer safety gate rejects unknown tagged values', () => {
  const serializer = new SafeSerializer({ allowedTags: ['Allowed'] });
  assert.deepEqual(serializer.loads(serializer.dumps({ ok: { __tag: 'Allowed', value: 1 } })).ok.value, 1);
  assert.throws(() => serializer.loads('{"bad":{"__tag":"Evil","payload":"x"}}'), /Blocked tagged type/);
});

test('Send fanout routes custom args into target nodes', () => {
  const graph = new GraphBuilder({ log: { reducer: (a, b) => [...(a ?? []), ...(Array.isArray(b) ? b : [b])] } })
    .add_node('split', () => ({}))
    .add_node('worker', (arg) => ({ log: [arg.item] }))
    .set_entry_point('split')
    .add_conditional_edges('split', () => [new Send('worker', { item: 'one' }), new Send('worker', { item: 'two' })])
    .set_finish_point('worker')
    .compile();
  assert.deepEqual(graph.invoke({}).log, ['one', 'two']);
});

test('async invoke/stream surfaces mirror sync proof surface', async () => {
  const graph = new GraphBuilder(schema())
    .add_node('A', () => ({ count: 1 }))
    .set_entry_point('A')
    .set_finish_point('A')
    .compile();
  assert.deepEqual(await graph.ainvoke({}), { count: 1 });
  const events = [];
  for await (const event of graph.astream({}, {}, { stream_mode: 'updates' })) events.push(event);
  assert.equal(events[0].kind, 'updates');
});

test('pending writes replay into state and resume only failed node', () => {
  const saver = new InMemoryCheckpointSaver();
  let repaired = false;
  const makeGraph = () => new GraphBuilder(schema())
    .add_node('good', () => ({ log: ['good'] }))
    .add_node('bad', () => repaired ? { count: 7 } : (() => { throw new Error('boom'); })())
    .add_edge(START, 'good')
    .add_edge(START, 'bad')
    .set_finish_point('bad')
    .compile({ checkpointer: saver });
  const config = { configurable: { thread_id: 't-replay' } };
  assert.throws(() => [...makeGraph().stream({}, config)], /boom/);
  repaired = true;
  const resumed = makeGraph().invoke({}, config);
  assert.deepEqual(resumed.log, ['good']);
  assert.equal(resumed.count, 7);
});
