# Perfect RAG / Retrieval OS Buildprint

## Mission

Build a production-grade retrieval augmented generation system that can be adapted to any backend stack while preserving the essential contracts:

1. source ingestion with ownership, versioning, metadata, and access scopes
2. chunking with stable ids, source spans, and optional contextualized text
3. hybrid retrieval using lexical/sparse plus dense semantic candidates
4. candidate fusion, dedupe, and tenant/permission filtering
5. reranking or late interaction over top candidates
6. context packing within a token budget
7. grounded answer generation with citations
8. refusal / insufficient-evidence behavior
9. repeatable retrieval and answer-quality eval gates
10. traces for debugging latency, cost, scores, and evidence

## Core principle

Never call plain vector search "done". A serious RAG system needs measurable retrieval quality and an answer layer that can say "I do not have enough evidence".

## Architecture flow

Documents → Normalize → Chunk → Contextualize → Dense + lexical/sparse index → Hybrid retrieve → Fuse/dedupe/filter → Rerank → Context pack → Grounded answer → Eval/trace

## Required implementation boundaries

- All retrieved contexts must carry source/citation metadata.
- Permission/tenant filters must apply before answer generation.
- Generation must cite retrieved evidence or refuse.
- Retrieval variants must be measurable against fixture eval cases.
- Tests must not require real model, vector database, or provider credentials.
- Live embeddings, vector stores, rerankers, and LLM providers are adapters, not hard dependencies.

## Optional advanced modules

- HyDE/query rewriting/multi-query expansion for recall.
- SPLADE-style sparse neural retrieval.
- ColBERT-style late interaction.
- Cross-encoder/BGE reranker.
- RAPTOR tree summaries for long documents.
- GraphRAG for global corpus questions.
- Self-RAG/CRAG-style adaptive retrieve/critique/correct loop.
