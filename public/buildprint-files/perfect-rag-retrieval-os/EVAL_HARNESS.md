# Eval Harness

## Retrieval metrics

- recall@k: did expected chunks appear in top-k?
- MRR: how early is the first expected chunk?
- nDCG-like score: are expected chunks ranked above distractors?
- channel contribution: lexical/dense/sparse/hyde/graph/tree source of each selected candidate

## Answer metrics

- faithfulness: every claim must be supported by cited chunks
- answer correctness: expected answer points appear
- refusal quality: unsupported questions avoid fabricated answers
- citation precision: cited chunks are actually selected and relevant
- noise sensitivity: distractor chunks do not change final answer

## Operational metrics

- latency by stage
- candidate count by stage
- token budget used
- provider cost placeholders
- permission filter drops

## Required fixture cases

1. exact identifier query
2. semantic paraphrase query
3. ambiguous chunk needing contextualization
4. private/tenant mismatch query
5. unsupported question requiring refusal
6. hard distractor requiring rerank
