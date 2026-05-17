import test from 'node:test';
import assert from 'node:assert/strict';
import { answer, evaluate, retrieve, rerank } from '../src/rag.js';

const user = { tenantId: 'acme', userId: 'member' };

test('hybrid retrieval finds exact and semantic RAG contexts', () => {
  assert.equal(retrieve('raw body signature webhook', user, 'lexical')[0].chunk.id, 'c-webhook');
  assert.equal(retrieve('How should I search long documents with tree summaries?', user, 'hybrid')[0].chunk.id, 'c-raptor');
});

test('reranking preserves relevant top context with citations', () => {
  const ranked = rerank('global corpus themes relationships', retrieve('global corpus themes relationships', user, 'hybrid'));
  assert.equal(ranked[0].chunk.id, 'c-graph');
  assert.equal(ranked[0].citation.chunkId, 'c-graph');
});

test('answer is grounded and cites retrieved chunks', () => {
  const result = answer('Can I get money back for Pro?', user);
  assert.match(result.answer, /14 days/);
  assert.equal(result.citations[0].chunkId, 'c-refund');
});

test('unsupported query refuses instead of hallucinating', () => {
  const result = answer('What is the CEO private phone number?', user);
  assert.equal(result.confidence, 'insufficient-evidence');
  assert.equal(result.citations.length, 0);
});

test('tenant and private permissions block unauthorized retrieval', () => {
  assert.equal(retrieve('Project Falcon July', user, 'hybrid').some((c) => c.chunk.id === 'c-private-roadmap'), false);
  assert.equal(retrieve('Project Falcon July', { tenantId: 'acme', userId: 'owner' }, 'hybrid')[0].chunk.id, 'c-private-roadmap');
});

test('eval harness emits machine-readable retrieval metrics', () => {
  const report = evaluate([{ id: 'webhook', query: 'verify raw body before state mutation', user, expectedChunkIds: ['c-webhook'], expectedAnswerContains: ['verify'], forbiddenClaims: [] }]);
  assert.equal(report[0].recallAt5, 1);
  assert.equal(report[0].mrr, 1);
  assert.equal(report[0].topChunkId, 'c-webhook');
});
