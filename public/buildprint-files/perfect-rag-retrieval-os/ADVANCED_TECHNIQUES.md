# Advanced Techniques

Enable these only when eval cases show they help.

## HyDE / query rewrite / multi-query

Useful when user queries are short, vague, or semantically far from source wording. Costs extra model calls and can introduce false detail, so trace generated queries.

## SPLADE / sparse neural retrieval

Useful when exact-term matching and semantic expansion are both important. Usually needs specialized indexing.

## ColBERT / late interaction

Strong retrieval quality for many search tasks, but with higher index/runtime complexity than single-vector retrieval.

## Cross-encoder or BGE reranker

Recommended second-stage scorer for top candidates. Keep first-stage retrieval broad and fast; rerank top-N.

## RAPTOR

Useful for long documents and multi-level abstraction. Adds summary tree ingestion and update complexity.

## GraphRAG

Useful for global corpus questions, entity/theme exploration, and query-focused summarization over a whole collection. Not a default support-bot requirement.

## Self-RAG / CRAG

Useful for adaptive retrieval, critique, and correction when retrieval quality varies. Adds orchestration and latency; gate with evals.

## Contextual retrieval

Prepend or store chunk-specific context when chunks lose meaning outside the parent document. Validate with recall@k and answer faithfulness.
