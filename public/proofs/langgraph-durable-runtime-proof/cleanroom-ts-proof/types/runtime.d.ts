export const START: '__start__';
export const END: '__end__';

export type PrimitiveTypeName = 'string' | 'number' | 'boolean' | 'object' | 'undefined' | 'function';
export type Reducer<TValue = unknown> = (current: TValue | undefined, update: TValue) => TValue;
export type StateSpec<TState extends Record<string, unknown>> = {
  [K in keyof TState]: { type?: PrimitiveTypeName; reducer?: Reducer<TState[K]> };
};
export type RunnableConfig = { configurable?: { thread_id?: string; checkpoint_id?: string; checkpoint_ns?: string; [key: string]: unknown } };
export type StreamMode = 'values' | 'updates' | 'checkpoints' | 'tasks' | 'debug' | 'custom' | 'messages';
export type GraphNode<TState extends Record<string, unknown>, TOutput = Partial<TState> | Command<TState> | Array<Partial<TState> | Command<TState>>> =
  (input: Readonly<TState> | unknown, context: { resume?: unknown }) => TOutput;
export type RouteResult = string | Send | Array<string | Send>;
export type CheckpointTuple<TState extends Record<string, unknown> = Record<string, unknown>> = {
  config: RunnableConfig;
  checkpoint: {
    v: number;
    id: string;
    ts: string;
    channel_values: TState;
    channel_versions: Record<string, string>;
    versions_seen: Record<string, Record<string, string>>;
    updated_channels: string[];
  };
  metadata: Record<string, unknown>;
  parent_config: RunnableConfig | null;
  pending_writes: Array<[taskId: string, key: string, value: unknown, taskPath?: string]>;
};

export class Command<TState extends Record<string, unknown> = Record<string, unknown>> {
  update: Partial<TState> | null;
  resume: unknown;
  goto: string | Send | Array<string | Send> | null;
  constructor(args?: { update?: Partial<TState> | null; resume?: unknown; goto?: string | Send | Array<string | Send> | null });
}

export class Send<TArg = unknown> {
  node: string;
  arg: TArg;
  constructor(node: string, arg: TArg);
}

export class InterruptSignal extends Error {
  value: unknown;
  id: string;
  constructor(value: unknown, id: string);
}

export function interrupt<T = unknown>(value: unknown): T;

export class StateSchema<TState extends Record<string, unknown> = Record<string, unknown>> {
  constructor(shape: StateSpec<TState>);
  keys(): Array<keyof TState>;
  has(key: keyof TState | string): boolean;
  reducer<K extends keyof TState>(key: K): Reducer<TState[K]> | null;
  validateUpdate(update: Partial<TState>, strict?: boolean): void;
}

export class InMemoryCheckpointSaver<TState extends Record<string, unknown> = Record<string, unknown>> {
  getTuple(config: RunnableConfig): CheckpointTuple<TState> | null;
  list(config: RunnableConfig, options?: { before?: RunnableConfig | null; limit?: number | null }): Array<CheckpointTuple<TState>>;
  put(config: RunnableConfig, checkpoint: Omit<CheckpointTuple<TState>['checkpoint'], 'id'> & { id?: string }, metadata?: Record<string, unknown>, new_versions?: Record<string, string>): RunnableConfig;
  put_writes(config: RunnableConfig, writes: Array<[key: string, value: unknown]>, task_id: string, task_path?: string): void;
  delete_thread(threadId: string): void;
}

export class SafeSerializer {
  constructor(options?: { allowedTags?: string[] });
  dumps(value: unknown): string;
  loads<T = unknown>(text: string): T;
}

export class GraphBuilder<TState extends Record<string, unknown> = Record<string, unknown>> {
  constructor(schema: StateSpec<TState> | StateSchema<TState>);
  add_node(name: string, fn: GraphNode<TState>): this;
  add_edge(start: string, end: string): this;
  add_conditional_edges(source: string, routeFn: (state: Readonly<TState>) => RouteResult, pathMap?: Record<string, string> | null): this;
  set_entry_point(name: string): this;
  set_finish_point(name: string): this;
  compile(options?: { checkpointer?: InMemoryCheckpointSaver<TState> | null; durability?: 'sync' | 'async' | 'exit' }): CompiledGraph<TState>;
}

export class CompiledGraph<TState extends Record<string, unknown> = Record<string, unknown>> {
  get_state(config: RunnableConfig): { values: TState; config: RunnableConfig; metadata: Record<string, unknown>; parent_config: RunnableConfig | null; pending_writes: CheckpointTuple<TState>['pending_writes']; next: string[] };
  invoke(input: Partial<TState> | Command<TState>, config?: RunnableConfig): TState;
  ainvoke(input: Partial<TState> | Command<TState>, config?: RunnableConfig): Promise<TState>;
  stream(input: Partial<TState> | Command<TState>, config?: RunnableConfig, options?: { stream_mode?: StreamMode }): Generator<Record<string, unknown>, void, unknown>;
  astream(input: Partial<TState> | Command<TState>, config?: RunnableConfig, options?: { stream_mode?: StreamMode }): AsyncGenerator<Record<string, unknown>, void, unknown>;
}
