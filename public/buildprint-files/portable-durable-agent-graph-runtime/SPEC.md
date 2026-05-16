# SPEC

## State Schema

- A schema is a map from key to value type and optional reducer.
- Default channel behavior is last value, one update per key per superstep.
- Reducer channel behavior merges multiple updates for one key in deterministic order.
- Invalid update keys are rejected or ignored according to a documented strictness flag. Default: reject.

## Nodes

- A node is a named callable.
- Input is the current state or a custom `Send.arg`.
- Output may be:
  - partial state dict;
  - `Command`;
  - list of `Command`/partial updates for advanced cases.
- Duplicate node names and reserved names `START`/`END` fail compile or registration.

## Edges

- `add_edge(start, end)` creates a directed edge.
- `START` may only be a source.
- `END` may only be a target.
- Multi-start waiting edges are optional for v1; if implemented, all starts must complete before the target runs.

## Conditional Routing

- `add_conditional_edges(source, route_fn, path_map=None)` runs `route_fn(state)` after `source`.
- Route output may be a node name, `END`, a list of node names, or optional `Send`.
- `path_map` maps route labels to node names.
- Unknown route targets fail compile when statically known or fail at runtime with a clear error.

## Compile Validation

Must reject:
- no entrypoint from `START`;
- edge source unknown except `START`;
- edge target unknown except `END`;
- branch target unknown when path map is provided;
- interrupt-before/after unknown node;
- duplicate node names;
- reserved node names.

## Runtime

- `invoke(input, config)` returns final values by default.
- `stream(input, config, stream_mode)` yields event payloads.
- `thread_id` is required when a checkpointer is configured.
- `checkpoint_id` optionally selects a previous checkpoint to restore.
- INFERRED clean-room simplification: execution is deterministic and single-process. Do not claim Pregel concurrency/performance parity.

## Checkpointing

Checkpoint fields:
- `v`;
- `id`;
- `ts`;
- `channel_values`;
- `channel_versions`;
- `versions_seen`;
- `updated_channels`.

Checkpoint tuple:
- `config`;
- `checkpoint`;
- `metadata`;
- `parent_config`;
- `pending_writes`.

In-memory saver methods:
- `get_tuple(config)`;
- `list(config, before=None, limit=None)`;
- `put(config, checkpoint, metadata, new_versions)`;
- `put_writes(config, writes, task_id, task_path="")`;
- `delete_thread(thread_id)`.

## Interrupt/Resume

- `interrupt(value)` records an interrupt and stops the run.
- Interrupt requires a checkpointer.
- Resume uses `Command(resume=...)`.
- Runtime resumes from saved state and re-enters the interrupted node according to documented implementation semantics.

## Stream Mode Boundary

Core proof must cover `values`, `updates`, `checkpoints`, and `tasks` with documented local payload shapes. `debug` may be implemented as a composition of checkpoint/task events. `custom` may be local-only. `messages` is OUT_OF_SCOPE for provider/LLM token streaming unless a local mocked message source is explicitly implemented and labeled.

## Serializer Safety

- Default serializer accepts only JSON primitives, arrays, and objects.
- Non-primitive tagged values require an allowlist.
- Pickle or equivalent arbitrary-code deserialization is prohibited by default.
- Loading untrusted checkpoint bytes is unsafe unless strict allowlist mode is active.
