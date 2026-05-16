# CONTRACTS

## Builder Contract

- `add_node(name, fn)` registers exactly one callable for `name`.
- `add_edge(start, end)` records one directed transition.
- `add_conditional_edges(source, route_fn, path_map)` records route logic.
- `compile()` returns an immutable `CompiledGraph`.
- Mutating a builder after compile must not mutate existing compiled graphs.

## Node Contract

- Node input is read-only for the current superstep.
- Node output is converted to writes.
- Partial state dict updates only listed keys.
- Multiple writes to a non-reducer key in one superstep fail.
- Reducer keys merge multiple writes.

## Runtime Contract

- A superstep applies node writes only after all nodes selected for that step have run or the step fails.
- Successful pending writes are persisted before checkpoint application when a checkpointer exists and the configured durability mode permits it.
- `invoke` is equivalent to consuming `stream(..., stream_mode="values")` and returning the final value in this clean-room API design.
- Stream events are ordered by runtime occurrence.

## Checkpoint Saver Contract

- `thread_id` identifies an independent run history.
- `checkpoint_id` identifies a specific checkpoint within a thread.
- `put` returns config containing the new checkpoint id.
- `put_writes` associates task writes with the current checkpoint id.
- `get_tuple` returns pending writes with checkpoint metadata.

## Interrupt Contract

- Interrupt produces a payload with value and id.
- Interrupted runs are resumable only with a checkpoint.
- Resume values are passed through `Command(resume=...)`.

## Serializer Contract

- Serializer must refuse unknown tagged types in strict mode.
- Serializer must not deserialize executable payloads by default.
- Tests must prove unsafe payload rejection.
