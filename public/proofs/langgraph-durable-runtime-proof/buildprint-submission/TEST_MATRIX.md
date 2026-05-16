# TEST MATRIX

| Test | Required Behavior |
|---|---|
| Simple A to B graph | `START -> A -> B -> END` invokes both nodes and returns final state. |
| Conditional route | Route function chooses one destination based on state. |
| Reducer merge | Two same-step writes to reducer key merge deterministically. |
| Invalid graph compile failure | Missing entrypoint, unknown target, or duplicate node fails before execution. |
| Checkpoint restore | Reusing `thread_id` restores latest checkpoint; explicit `checkpoint_id` restores selected state. |
| Interrupt then resume | Node interrupts, stream exposes interrupt, `Command(resume=...)` continues. |
| Failed superstep keeps successful pending write | One node succeeds, another fails; successful pending write is stored and replayed on resume/retry simulation. |
| Stream event snapshots | Core modes `values`, `updates`, `checkpoints`, and `tasks` emit documented local shapes; `debug` may compose checkpoint/task events; `custom` is local-only if implemented; provider/LLM `messages` streaming is non-core unless mocked and labeled. |
| Serializer safety gate | Unknown tagged type fails in strict mode; pickle/equivalent disabled by default. |
| No network/provider calls | Core tests pass without API keys, network, model providers, LangSmith, or cloud services. |
