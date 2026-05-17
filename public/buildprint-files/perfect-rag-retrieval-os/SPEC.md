# Perfect RAG / Retrieval OS Spec

## Goal

Implement a portable RAG feature/system that retrieves relevant, permission-safe evidence and generates citation-grounded answers with measurable quality gates.

## Functional requirements

1. Ingest document sources with stable source ids, checksums, updated timestamps, metadata, and access scopes.
2. Split sources into chunks with stable ids, source spans, token estimates, and metadata.
3. Optionally add contextualized chunk text that preserves document-local meaning.
4. Build/update two first-stage search surfaces:
   - lexical/sparse fields for exact terms and identifiers
   - dense semantic embeddings or deterministic proof substitute
5. Accept queries with optional filters and user/tenant identity.
6. Retrieve candidates from lexical/sparse and dense channels.
7. Normalize/fuse scores and deduplicate candidates.
8. Enforce permission/tenant filters before context packing.
9. Rerank the top candidates with a stronger scorer or late-interaction adapter.
10. Generate answers with citations to chunk/source ids.
11. Refuse or return insufficient-evidence when the selected context does not support the answer.
12. Produce trace logs containing retrieval channels, scores, selected contexts, latency/cost placeholders, and refusal reason.
13. Run eval cases covering retrieval recall, MRR/nDCG, faithfulness, answer correctness, refusal, and permission filtering.

## Non-goals for default proof

- No live vector database.
- No real embedding API.
- No real reranker API.
- No real LLM provider call.
- No claim of universal benchmark SOTA.

## Acceptance behavior

A generated implementation passes when fixture evals show:

- hybrid retrieval returns expected chunks where lexical-only or dense-only can miss targeted cases
- reranking improves hard-case ordering or preserves correct top contexts
- cited answers quote/support claims from retrieved context
- unsupported questions refuse
- private/tenant-mismatched chunks are not retrieved into the answer path
