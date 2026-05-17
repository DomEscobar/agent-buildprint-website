# Perfect RAG / Retrieval OS Contracts

```ts
type AccessScope = { tenantId: string; visibility: 'public' | 'private'; allowedUserIds?: string[] };

type DocumentSource = {
  id: string;
  uri: string;
  title: string;
  checksum: string;
  updatedAt: string;
  metadata: Record<string, string>;
  access: AccessScope;
};

type Chunk = {
  id: string;
  sourceId: string;
  text: string;
  contextualText?: string;
  metadata: Record<string, string>;
  span: { start: number; end: number };
  tokenEstimate: number;
  access: AccessScope;
};

type QueryPlan = {
  query: string;
  rewrittenQueries: string[];
  filters: Record<string, string>;
  user: { tenantId: string; userId: string };
  strategy: 'lexical' | 'dense' | 'hybrid' | 'hybrid-rerank';
};

type Candidate = {
  chunkId: string;
  channel: 'lexical' | 'dense' | 'sparse' | 'hyde' | 'graph' | 'tree';
  rawScore: number;
  normalizedScore: number;
  reason: string;
};

type RerankedContext = {
  chunk: Chunk;
  rank: number;
  score: number;
  citation: { sourceId: string; chunkId: string; title: string; uri: string };
  quotedSpan: string;
};

type RagAnswer = {
  answer: string;
  citations: Array<{ sourceId: string; chunkId: string; title: string }>;
  confidence: 'high' | 'medium' | 'low' | 'insufficient-evidence';
  refusalReason?: string;
};

type EvalCase = {
  id: string;
  query: string;
  user: { tenantId: string; userId: string };
  expectedChunkIds: string[];
  expectedAnswerContains: string[];
  forbiddenClaims: string[];
};
```

## Adapter contracts

- `EmbeddingAdapter.embed(texts)` returns vectors or proof tokens.
- `LexicalIndex.search(query, filters)` returns lexical candidates.
- `DenseIndex.search(query, filters)` returns semantic candidates.
- `Reranker.rerank(query, candidates)` returns ordered contexts.
- `Generator.answer(query, contexts)` returns cited answer or refusal.
- `Evaluator.run(cases)` returns machine-readable metrics.
