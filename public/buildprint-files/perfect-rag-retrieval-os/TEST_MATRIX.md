# Perfect RAG / Retrieval OS Test Matrix

| Risk | Required check |
| --- | --- |
| Vector-only RAG misses exact identifiers | lexical and hybrid retrieval tests include identifier-heavy query |
| Lexical-only RAG misses semantic paraphrase | dense/hybrid tests include paraphrase query |
| Bad ordering hurts answers | reranker improves or preserves target chunk rank |
| Hallucinated answer | unsupported query returns insufficient-evidence/refusal |
| Citation laundering | answer citations must reference selected chunks |
| Tenant/private data leak | private chunk cannot appear for unauthorized user |
| Chunk context loss | contextualized chunk branch is tested on ambiguous chunk |
| Eval-free drift | `npm test` or equivalent runs retrieval and answer eval harness |
| Live provider dependence | default tests pass without network/API credentials |
