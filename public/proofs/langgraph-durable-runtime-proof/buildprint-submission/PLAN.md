# PLAN

1. Implement schema and channels.
   - `LastValueChannel`.
   - `ReducerChannel`.
   - schema validation and default channel construction.

2. Implement builder.
   - node registry;
   - edge registry;
   - conditional route registry;
   - entry/finish helpers;
   - compile validation.

3. Implement compiled runtime.
   - deterministic superstep loop;
   - state snapshot;
   - update application;
   - `invoke`;
   - `stream`.

4. Implement checkpointing.
   - checkpoint object;
   - checkpoint tuple;
   - in-memory saver;
   - thread/checkpoint config;
   - pending writes.

5. Implement interrupts.
   - interrupt sentinel/exception;
   - `Command(resume=...)`;
   - resumed run path;
   - snapshot tasks/interrupts.

6. Implement serializer safety.
   - primitive JSON serializer;
   - tagged allowlist gate;
   - unsafe mode disabled by default.

7. Add optional non-core demos.
   - mocked ToolNode with local functions only;
   - tiny ReAct-like loop without network/provider calls.

8. Complete tests and reversal proof.
   - use `TEST_MATRIX.md`;
   - ensure no network/provider calls;
   - ensure no source code copying from LangGraph.
