# Target Stack Adapters

Keep the same contracts in every stack. Only swap infrastructure adapters.

## Node / TypeScript

- API: Express, Fastify, Next.js route handlers, Hono, NestJS
- Jobs: BullMQ, Temporal, plain worker, serverless queue
- Search: Postgres full-text + pgvector, Meilisearch, Typesense, Elasticsearch/OpenSearch, Qdrant, Weaviate, Pinecone
- Eval: Vitest/Jest/node:test with JSON fixture reports

## Python

- API: FastAPI, Django, Flask
- Jobs: Celery, Dramatiq, RQ, Temporal
- Search: Postgres tsvector + pgvector, Elasticsearch/OpenSearch, Qdrant, Weaviate, Pinecone
- Eval: pytest with JSON fixture reports

## Ruby / Rails

- API: Rails controllers/jobs
- Jobs: Sidekiq/ActiveJob
- Search: pg_search + pgvector, Elasticsearch/OpenSearch, Meilisearch
- Eval: RSpec/Minitest fixture cases

## Go

- API: net/http, chi, Gin, Fiber
- Jobs: goroutines + queue, Temporal, asynq
- Search: Postgres full-text + pgvector, OpenSearch, Qdrant, Weaviate
- Eval: `go test` with JSON snapshots

## PHP / Laravel

- API: Laravel controllers
- Jobs: queues/workers
- Search: Scout/Meilisearch, Elasticsearch/OpenSearch, Postgres + vector extension
- Eval: Pest/PHPUnit fixture cases

## Universal rules

- Permission filters before context packing.
- Source ids/chunk ids are stable and citeable.
- Test mode never calls live model/search providers by default.
- Eval report is machine-readable and checked in CI.
