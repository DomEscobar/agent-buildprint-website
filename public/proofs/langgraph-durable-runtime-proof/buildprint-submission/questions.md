# Questions

- QUESTION: Should the first implementation enforce types with runtime validators, static typing conventions, or both?
- QUESTION: Should reducers merge writes by node registration order, task id, or emitted write order?
- QUESTION: Should `Send` fanout be in v1, or should conditional routing initially allow only node names and `END`?
- QUESTION: Should checkpoint IDs be monotonic timestamps, UUIDv7-like strings, or simple counters per thread?
- QUESTION: Should stream `messages` be omitted from core until a local mocked message source exists?
- QUESTION: Should interrupt resume values map by interrupt id only, or also support "next pending interrupt" shorthand?
- QUESTION: Should invalid node output be a runtime error that checkpoints successful siblings, or should it fail the whole superstep before any pending writes are stored?
