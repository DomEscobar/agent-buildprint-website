// @ts-nocheck
export const START = '__start__';
export const END = '__end__';

export class Command {
  constructor({ update = null, resume = null, goto = null } = {}) {
    this.update = update;
    this.resume = resume;
    this.goto = goto;
  }
}

export class Send {
  constructor(node, arg) {
    this.node = node;
    this.arg = arg;
  }
}

export class InterruptSignal extends Error {
  constructor(value, id) {
    super('Graph interrupted');
    this.name = 'InterruptSignal';
    this.value = value;
    this.id = id;
  }
}

let activeRuntime = null;
export function interrupt(value) {
  if (!activeRuntime) throw new Error('interrupt() may only be called from a graph node');
  return activeRuntime.interrupt(value);
}

export class StateSchema {
  constructor(shape) {
    this.shape = new Map(Object.entries(shape));
  }
  keys() { return [...this.shape.keys()]; }
  has(key) { return this.shape.has(key); }
  reducer(key) { return this.shape.get(key)?.reducer ?? null; }
  validateUpdate(update, strict = true) {
    if (!update || typeof update !== 'object' || Array.isArray(update)) throw new Error('Node update must be an object');
    for (const [key, value] of Object.entries(update)) {
      const spec = this.shape.get(key);
      if (!spec) {
        if (strict) throw new Error(`Unknown state key: ${key}`);
        continue;
      }
      if (spec.type && value != null && typeof value !== spec.type) throw new Error(`Invalid type for ${key}: expected ${spec.type}`);
    }
  }
}

export class InMemoryCheckpointSaver {
  constructor() {
    this.threads = new Map();
    this.seq = 0;
  }
  _thread(threadId) {
    if (!this.threads.has(threadId)) this.threads.set(threadId, []);
    return this.threads.get(threadId);
  }
  getTuple(config) {
    const { thread_id, checkpoint_id } = config?.configurable ?? {};
    if (!thread_id) throw new Error('thread_id required');
    const list = this._thread(thread_id);
    if (!list.length) return null;
    if (checkpoint_id) return list.find((x) => x.checkpoint.id === checkpoint_id) ?? null;
    return list[list.length - 1];
  }
  list(config, { before = null, limit = null } = {}) {
    const { thread_id } = config?.configurable ?? {};
    if (!thread_id) throw new Error('thread_id required');
    let out = [...this._thread(thread_id)];
    if (before?.configurable?.checkpoint_id) {
      const idx = out.findIndex((x) => x.checkpoint.id === before.configurable.checkpoint_id);
      if (idx >= 0) out = out.slice(0, idx);
    }
    return limit ? out.slice(-limit) : out;
  }
  put(config, checkpoint, metadata = {}, new_versions = {}) {
    const { thread_id } = config?.configurable ?? {};
    if (!thread_id) throw new Error('thread_id required');
    const id = checkpoint.id ?? `ckpt-${++this.seq}`;
    const parent = this.getTuple(config)?.config ?? null;
    const nextConfig = { configurable: { ...config.configurable, checkpoint_id: id } };
    const tuple = { config: nextConfig, checkpoint: { ...checkpoint, id }, metadata, parent_config: parent, pending_writes: checkpoint.pending_writes ?? [] };
    this._thread(thread_id).push(tuple);
    return nextConfig;
  }
  put_writes(config, writes, task_id, task_path = '') {
    const tuple = this.getTuple(config);
    if (!tuple) throw new Error('No checkpoint to attach writes to');
    for (const [key, value] of writes) tuple.pending_writes.push([task_id, key, value, task_path]);
  }
  delete_thread(threadId) { this.threads.delete(threadId); }
}

export class SafeSerializer {
  constructor({ allowedTags = [] } = {}) {
    this.allowedTags = new Set(allowedTags);
  }
  dumps(value) { return JSON.stringify(value); }
  loads(text) {
    const visit = (v) => {
      if (!v || typeof v !== 'object') return v;
      if (Array.isArray(v)) return v.map(visit);
      if ('__tag' in v && !this.allowedTags.has(v.__tag)) throw new Error(`Blocked tagged type: ${v.__tag}`);
      return Object.fromEntries(Object.entries(v).map(([k, val]) => [k, visit(val)]));
    };
    return visit(JSON.parse(text));
  }
}

export class GraphBuilder {
  constructor(schema) {
    this.schema = schema instanceof StateSchema ? schema : new StateSchema(schema);
    this.nodes = new Map();
    this.edges = new Map();
    this.conditional = new Map();
    this.compiled = false;
  }
  add_node(name, fn) {
    if ([START, END].includes(name)) throw new Error(`Reserved node name: ${name}`);
    if (this.nodes.has(name)) throw new Error(`Duplicate node: ${name}`);
    this.nodes.set(name, fn);
    return this;
  }
  add_edge(start, end) {
    if (start === END) throw new Error('END cannot be a start node');
    if (end === START) throw new Error('START cannot be an end node');
    if (!this.edges.has(start)) this.edges.set(start, []);
    this.edges.get(start).push(end);
    return this;
  }
  add_conditional_edges(source, routeFn, pathMap = null) {
    this.conditional.set(source, { routeFn, pathMap });
    return this;
  }
  set_entry_point(name) { return this.add_edge(START, name); }
  set_finish_point(name) { return this.add_edge(name, END); }
  compile({ checkpointer = null, durability = 'sync' } = {}) {
    const allSources = new Set([...this.edges.keys(), ...this.conditional.keys()]);
    if (!allSources.has(START)) throw new Error('Graph must have an entrypoint');
    for (const source of allSources) if (source !== START && !this.nodes.has(source)) throw new Error(`Unknown edge source: ${source}`);
    for (const [source, targets] of this.edges) {
      for (const target of targets) if (target !== END && !this.nodes.has(target)) throw new Error(`Unknown edge target: ${target}`);
    }
    for (const [source, branch] of this.conditional) {
      if (!this.nodes.has(source) && source !== START) throw new Error(`Unknown conditional source: ${source}`);
      if (branch.pathMap) for (const target of Object.values(branch.pathMap)) if (target !== END && !this.nodes.has(target)) throw new Error(`Unknown conditional target: ${target}`);
    }
    this.compiled = true;
    return new CompiledGraph({ schema: this.schema, nodes: new Map(this.nodes), edges: cloneMap(this.edges), conditional: new Map(this.conditional), checkpointer, durability });
  }
}

function cloneMap(map) { return new Map([...map].map(([k, v]) => [k, [...v]])); }
function clone(v) { return JSON.parse(JSON.stringify(v)); }
function configThread(config) { return config?.configurable?.thread_id; }

class CompiledGraph {
  constructor({ schema, nodes, edges, conditional, checkpointer, durability }) {
    this.schema = schema; this.nodes = nodes; this.edges = edges; this.conditional = conditional; this.checkpointer = checkpointer; this.durability = durability;
  }
  get_state(config) {
    const tuple = this.checkpointer?.getTuple(config);
    if (!tuple) return { values: {}, config, metadata: {}, parent_config: null, pending_writes: [], next: [] };
    return { values: clone(tuple.checkpoint.channel_values), config: tuple.config, metadata: tuple.metadata, parent_config: tuple.parent_config, pending_writes: clone(tuple.pending_writes), next: tuple.metadata.next ?? [] };
  }
  invoke(input, config = {}) {
    let last = null;
    for (const event of this.stream(input, config, { stream_mode: 'values' })) last = event;
    return last?.values ?? this.get_state(config).values;
  }
  async ainvoke(input, config = {}) {
    let last = null;
    for await (const event of this.astream(input, config, { stream_mode: 'values' })) last = event;
    return last?.values ?? this.get_state(config).values;
  }
  async *astream(input, config = {}, options = {}) {
    for (const event of this.stream(input, config, options)) yield event;
  }
  *stream(input, config = {}, { stream_mode = 'values' } = {}) {
    if (this.checkpointer && !configThread(config)) throw new Error('thread_id required when checkpointer is configured');
    const existing = this.checkpointer?.getTuple(config);
    let state = existing ? clone(existing.checkpoint.channel_values) : {};
    if (existing?.pending_writes?.length) {
      state = this.applyTaskWrites(state, existing.pending_writes.map(([task, key, value]) => [task, key, value]));
    }
    let pendingResume = null;
    if (input instanceof Command) {
      if (input.update) state = this.applyUpdates(state, [['__command__', input.update]]);
      pendingResume = input.resume;
    } else if (input && typeof input === 'object') {
      state = this.applyUpdates(state, [['__input__', input]]);
    }
    let runnable = input instanceof Command && input.goto ? arr(input.goto) : (existing?.metadata?.next?.length ? existing.metadata.next : (this.edges.get(START) ?? []));
    let step = existing?.metadata?.step ?? 0;
    let lastConfig = existing?.config ?? config;
    const emit = (kind, payload) => ({ mode: stream_mode, kind, ...payload });
    while (runnable.length) {
      step += 1;
      const writes = [];
      const taskEvents = [];
      const next = [];
      for (const nodeEntry of runnable) {
        const nodeName = nodeEntry instanceof Send ? nodeEntry.node : nodeEntry;
        const nodeInput = nodeEntry instanceof Send ? nodeEntry.arg : state;
        if (nodeName === END) continue;
        const fn = this.nodes.get(nodeName);
        if (!fn) throw new Error(`Unknown node at runtime: ${nodeName}`);
        const taskId = `${step}:${nodeName}`;
        taskEvents.push({ type: 'task_start', id: taskId, name: nodeName, input: clone(nodeInput) });
        const runtime = { resume: pendingResume, interrupted: false, interrupt(value) { throw new InterruptSignal(value, `interrupt-${taskId}`); } };
        try {
          activeRuntime = runtime;
          const output = fn(Object.freeze(clone(nodeInput)), { resume: pendingResume });
          activeRuntime = null;
          const nodeWrites = this.outputToWrites(output, nodeName);
          writes.push(...nodeWrites.map(([k, v]) => [nodeName, k, v]));
          taskEvents.push({ type: 'task_finish', id: taskId, name: nodeName, result: Object.fromEntries(nodeWrites), error: null, interrupts: [] });
          const projectedState = this.applyTaskWrites(state, nodeWrites.map(([k, v]) => [nodeName, k, v]));
          for (const dest of this.routeAfter(nodeName, projectedState, output)) next.push(dest);
        } catch (err) {
          activeRuntime = null;
          if (err instanceof InterruptSignal) {
            const metadata = { step, source: 'interrupt', next: [nodeName], interrupt: { value: err.value, id: err.id } };
            lastConfig = this.saveCheckpoint(lastConfig, state, metadata, writes);
            const event = emit('interrupt', { value: err.value, id: err.id, state: clone(state) });
            if (stream_mode === 'tasks') yield emit('tasks', { tasks: taskEvents });
            yield event;
            return;
          }
          lastConfig = this.ensureCheckpoint(lastConfig, state, { step, source: 'error', next: [nodeName], failed: nodeName });
          this.savePendingWrites(lastConfig, writes);
          throw err;
        }
      }
      state = this.applyTaskWrites(state, writes);
      const metadata = { step, source: 'loop', next: [...new Set(next)].filter((x) => x !== END) };
      lastConfig = this.saveCheckpoint(lastConfig, state, metadata, writes);
      if (stream_mode === 'updates') yield emit('updates', { updates: writes.map(([node, key, value]) => ({ node, key, value })) });
      else if (stream_mode === 'checkpoints') yield emit('checkpoint', this.get_state(lastConfig));
      else if (stream_mode === 'tasks') yield emit('tasks', { tasks: taskEvents });
      else if (stream_mode === 'debug') yield emit('debug', { checkpoint: this.get_state(lastConfig), tasks: taskEvents });
      else yield emit('values', { values: clone(state) });
      runnable = metadata.next;
      pendingResume = null;
    }
  }
  outputToWrites(output, nodeName) {
    if (output == null) return [];
    if (output instanceof Command) return output.update ? Object.entries(output.update) : [];
    if (Array.isArray(output)) return output.flatMap((x) => this.outputToWrites(x, nodeName));
    this.schema.validateUpdate(output);
    return Object.entries(output);
  }
  routeAfter(nodeName, state, output) {
    if (output instanceof Command && output.goto) return arr(output.goto).map((x) => x instanceof Send ? x.node : x);
    const branch = this.conditional.get(nodeName);
    if (branch) {
      const raw = branch.routeFn(state);
      return arr(raw).map((r) => branch.pathMap ? branch.pathMap[r] : r);
    }
    return this.edges.get(nodeName) ?? [];
  }
  applyUpdates(state, updates) { return this.applyTaskWrites(state, updates.map(([node, update]) => [node, null, update])); }
  applyTaskWrites(state, writes) {
    const grouped = new Map();
    for (const [, key, value] of writes) {
      if (key === null) for (const [k, v] of Object.entries(value)) push(grouped, k, v);
      else push(grouped, key, value);
    }
    const next = { ...state };
    for (const [key, values] of grouped) {
      const reducer = this.schema.reducer(key);
      if (!reducer && values.length > 1) throw new Error(`Multiple writes to non-reducer key: ${key}`);
      next[key] = reducer ? values.reduce((acc, v) => acc === undefined ? v : reducer(acc, v), next[key]) : values[values.length - 1];
    }
    return next;
  }
  savePendingWrites(config, writes) {
    if (!this.checkpointer || this.durability === 'exit') return;
    for (const [node, key, value] of writes) this.checkpointer.put_writes(config, [[key, value]], node);
  }
  ensureCheckpoint(config, state, metadata) {
    if (!this.checkpointer) return config;
    if (this.checkpointer.getTuple(config)) return config;
    return this.checkpointer.put(config, { v: 1, ts: new Date(0).toISOString(), channel_values: clone(state), channel_versions: {}, versions_seen: {}, updated_channels: [], pending_writes: [] }, metadata, {});
  }
  saveCheckpoint(config, state, metadata, writes) {
    if (!this.checkpointer) return config;
    const prev = this.checkpointer.getTuple(config);
    const versions = { ...(prev?.checkpoint.channel_versions ?? {}) };
    const updated = [...new Set(writes.map(([, key]) => key).filter(Boolean))];
    for (const key of updated) versions[key] = String((Number(versions[key] ?? 0) || 0) + 1);
    const checkpoint = { v: 1, ts: new Date(0).toISOString(), channel_values: clone(state), channel_versions: versions, versions_seen: {}, updated_channels: updated, pending_writes: [] };
    const nextConfig = this.checkpointer.put(config, checkpoint, metadata, versions);
    if (this.durability !== 'exit') this.savePendingWrites(nextConfig, writes);
    return nextConfig;
  }
}
function push(map, k, v) { if (!map.has(k)) map.set(k, []); map.get(k).push(v); }
function arr(v) { return Array.isArray(v) ? v : (v == null ? [] : [v]); }
