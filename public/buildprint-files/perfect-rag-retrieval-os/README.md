# Perfect RAG / Retrieval OS Buildprint

A stack-adaptable Buildprint for production-grade RAG: ingestion, chunking, permissions, hybrid retrieval, fusion, reranking, grounded answer generation, refusal behavior, and regression eval gates.

This is not "vector DB + prompt". The blueprint encodes the benchmark-backed pattern: **hybrid first-stage retrieval + reranking/late interaction + citation-grounded generation + repeatable evals**.

## Default proof

The included proof is an offline TypeScript fixture implementation. It makes no network calls and uses deterministic lexical/dense-like scoring so coding agents can test the architecture without API keys.

```bash
cd proof
npm test
```

## Research basis

Research artifact: `/root/.openclaw/workspace/research/perfect-rag-benchmark-2026-05-17`

Evidence-backed sources include BEIR, MTEB, ColBERT, SPLADE, HyDE, RAPTOR, Self-RAG, CRAG, GraphRAG, Anthropic Contextual Retrieval, Ragas, LlamaIndex retrieval eval, SentenceTransformers retrieve-rerank, Vespa retrieval eval, and FlagEmbedding.
