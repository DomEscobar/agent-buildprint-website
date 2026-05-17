export type Visibility = 'public' | 'private';
export type User = { tenantId: string; userId: string };
export type AccessScope = { tenantId: string; visibility: Visibility; allowedUserIds?: string[] };
export type Chunk = { id: string; sourceId: string; title: string; uri: string; text: string; contextualText?: string; access: AccessScope; tags: string[] };
export type Candidate = { chunk: Chunk; channel: 'lexical' | 'dense'; rawScore: number; score: number; reason: string };
export type RankedContext = { chunk: Chunk; rank: number; score: number; citation: { sourceId: string; chunkId: string; title: string; uri: string }; quotedSpan: string };
export type Answer = { answer: string; confidence: 'high' | 'medium' | 'insufficient-evidence'; citations: Array<{ sourceId: string; chunkId: string; title: string }>; refusalReason?: string };
export type EvalCase = { id: string; query: string; user: User; expectedChunkIds: string[]; expectedAnswerContains: string[]; forbiddenClaims?: string[] };

const synonyms: Record<string, string[]> = {
  refund: ['refund', 'money', 'back', 'return'],
  webhook: ['webhook', 'signature', 'verify', 'raw', 'body'],
  permission: ['permission', 'tenant', 'private', 'access', 'scope'],
  raptor: ['raptor', 'tree', 'summary', 'long', 'document'],
  graph: ['graph', 'global', 'themes', 'corpus'],
};

export const fixtureChunks: Chunk[] = [
  { id: 'c-refund', sourceId: 's-policy', title: 'Refund policy', uri: 'docs://refund', text: 'Pro plan refunds are available within 14 days when usage is below 100 retrieval queries.', contextualText: 'Billing policy for SaaS subscriptions.', access: { tenantId: 'acme', visibility: 'public' }, tags: ['billing', 'refund'] },
  { id: 'c-webhook', sourceId: 's-security', title: 'Webhook security', uri: 'docs://webhook', text: 'Webhook handlers must verify signatures against the raw request body before mutating subscription or entitlement state.', contextualText: 'Security control for billing and event ingestion.', access: { tenantId: 'acme', visibility: 'public' }, tags: ['webhook', 'security'] },
  { id: 'c-private-roadmap', sourceId: 's-roadmap', title: 'Private roadmap', uri: 'docs://roadmap', text: 'Project Falcon launches a confidential enterprise RAG product in July.', access: { tenantId: 'acme', visibility: 'private', allowedUserIds: ['owner'] }, tags: ['private', 'roadmap'] },
  { id: 'c-raptor', sourceId: 's-rag', title: 'Advanced RAG techniques', uri: 'docs://rag', text: 'RAPTOR builds a tree of clustered summaries so retrieval can use both local chunks and higher-level summaries for long documents.', contextualText: 'Long-document retrieval strategy.', access: { tenantId: 'acme', visibility: 'public' }, tags: ['rag', 'raptor'] },
  { id: 'c-graph', sourceId: 's-rag', title: 'Advanced RAG techniques', uri: 'docs://rag', text: 'GraphRAG is useful for global corpus questions such as themes, entities, and relationships across a whole document collection.', contextualText: 'Corpus-level retrieval strategy.', access: { tenantId: 'acme', visibility: 'public' }, tags: ['rag', 'graph'] },
];

const stopwords = new Set(['a', 'an', 'and', 'are', 'can', 'do', 'for', 'how', 'i', 'is', 'of', 'or', 'the', 'to', 'what', 'with']);
const tokenize = (text: string) => new Set(text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((token) => token && !stopwords.has(token)));
const allowed = (chunk: Chunk, user: User) => chunk.access.tenantId === user.tenantId && (chunk.access.visibility === 'public' || chunk.access.allowedUserIds?.includes(user.userId));
const lexicalScore = (query: string, chunk: Chunk) => {
  const q = tokenize(query); const c = tokenize(`${chunk.text} ${chunk.contextualText ?? ''} ${chunk.tags.join(' ')}`);
  return [...q].filter((t) => c.has(t)).length;
};
const denseLikeScore = (query: string, chunk: Chunk) => {
  const q = tokenize(query); const expanded = new Set<string>();
  for (const token of q) { expanded.add(token); for (const [root, list] of Object.entries(synonyms)) if (token === root || list.includes(token)) list.forEach((x) => expanded.add(x)); }
  const c = tokenize(`${chunk.text} ${chunk.contextualText ?? ''} ${chunk.tags.join(' ')}`);
  return [...expanded].filter((t) => c.has(t)).length / Math.max(1, expanded.size);
};

export function retrieve(query: string, user: User, strategy: 'lexical' | 'dense' | 'hybrid' = 'hybrid', k = 5): Candidate[] {
  const candidates: Candidate[] = [];
  for (const chunk of fixtureChunks.filter((c) => allowed(c, user))) {
    if (strategy !== 'dense') {
      const raw = lexicalScore(query, chunk); if (raw > 0) candidates.push({ chunk, channel: 'lexical', rawScore: raw, score: raw, reason: 'term overlap' });
    }
    if (strategy !== 'lexical') {
      const raw = denseLikeScore(query, chunk); if (raw > 0) candidates.push({ chunk, channel: 'dense', rawScore: raw, score: raw * 3, reason: 'semantic expansion' });
    }
  }
  const fused = new Map<string, Candidate>();
  for (const c of candidates) {
    const prev = fused.get(c.chunk.id);
    if (!prev) fused.set(c.chunk.id, c);
    else fused.set(c.chunk.id, { ...c, channel: prev.channel, score: prev.score + c.score, reason: `${prev.reason}; ${c.reason}` });
  }
  return [...fused.values()].sort((a, b) => b.score - a.score).slice(0, k);
}

export function rerank(query: string, candidates: Candidate[]): RankedContext[] {
  const q = tokenize(query);
  return candidates.map((c) => {
    const phraseBoost = [...q].some((t) => c.chunk.tags.includes(t)) ? 2 : 0;
    const score = c.score + phraseBoost + Math.min(2, c.chunk.text.length / 160);
    return { chunk: c.chunk, rank: 0, score, citation: { sourceId: c.chunk.sourceId, chunkId: c.chunk.id, title: c.chunk.title, uri: c.chunk.uri }, quotedSpan: c.chunk.text };
  }).sort((a, b) => b.score - a.score).map((r, i) => ({ ...r, rank: i + 1 }));
}

export function answer(query: string, user: User): Answer {
  const contexts = rerank(query, retrieve(query, user, 'hybrid', 6)).slice(0, 3);
  if (contexts.length === 0 || contexts[0].score < 1.2) return { answer: 'I do not have enough retrieved evidence to answer that.', confidence: 'insufficient-evidence', citations: [], refusalReason: 'no-supporting-context' };
  const top = contexts[0];
  return { answer: `${top.quotedSpan} [${top.citation.chunkId}]`, confidence: top.score > 3 ? 'high' : 'medium', citations: contexts.map((c) => ({ sourceId: c.citation.sourceId, chunkId: c.citation.chunkId, title: c.citation.title })) };
}

export function evaluate(cases: EvalCase[]) {
  return cases.map((testCase) => {
    const ranked = rerank(testCase.query, retrieve(testCase.query, testCase.user, 'hybrid', 5));
    const ids = ranked.map((r) => r.chunk.id);
    const firstExpected = ids.findIndex((id) => testCase.expectedChunkIds.includes(id));
    const ragAnswer = answer(testCase.query, testCase.user);
    return { id: testCase.id, recallAt5: testCase.expectedChunkIds.some((id) => ids.includes(id)) ? 1 : 0, mrr: firstExpected >= 0 ? 1 / (firstExpected + 1) : 0, topChunkId: ids[0] ?? null, answer: ragAnswer };
  });
}
