# Perfect RAG / Retrieval OS Plan

## Phase 0 — Align corpus and threat model

Identify document types, tenants, permissions, freshness needs, answer-risk level, and latency/cost budget.

## Phase 1 — Contracts and fixtures

Create source, chunk, index, query, candidate, reranked context, answer, trace, and eval-case contracts. Add a small fixture corpus with public/private documents and expected retrieval labels.

## Phase 2 — Ingestion and chunking

Normalize text, preserve source metadata, create stable chunk ids, retain source spans, estimate token counts, and optionally add contextual chunk summaries.

## Phase 3 — Hybrid retrieval

Implement lexical/sparse and dense retrieval adapters. In proof mode, use deterministic local scorers. In production, adapt to the chosen search engine/vector store.

## Phase 4 — Fusion, filtering, and reranking

Normalize scores, fuse channels, dedupe by chunk id, enforce permissions, then rerank top candidates.

## Phase 5 — Grounded answer generation

Build a token-budgeted context pack. Generate cited answers only from provided context. Refuse when support is missing.

## Phase 6 — Evaluation harness

Measure recall@k, MRR, nDCG-like ranking quality, citation support, refusal behavior, permission filtering, latency, and cost placeholders.

## Phase 7 — Optional advanced modules

Add HyDE/query rewrite, RAPTOR, GraphRAG, Self-RAG/CRAG, ColBERT, SPLADE, or live reranker adapters only when evals justify complexity.
