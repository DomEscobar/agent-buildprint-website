# Validation Report

## Status

Initial local package/proof validation passed. Local static manifest bootstrap also passed. Full public live bootstrap still must be checked after publish/deploy.

## Research validation

Deepresearch artifact validated successfully:

- 18 sources fetched
- 16 evidence-backed claims
- report written
- artifact manager validation passed

Artifact path: `/root/.openclaw/workspace/research/perfect-rag-benchmark-2026-05-17`

## Local proof target

The included proof must pass:

```bash
cd proof
npm test
```

Validated coverage:

- lexical, dense-like, hybrid, and reranked retrieval comparison
- cited grounded answer
- unsupported-question refusal
- private/tenant filtering
- JSON eval report generation

Local result: `npm test` passed 6/6 proof tests.

Local static bootstrap result: `node /root/blueprint/bin/agb.js start http://127.0.0.1:4199/buildprints/perfect-rag-retrieval-os/package.json .` downloaded 17 snapshot files; running `npm test` from `.buildprint/snapshots/proof` passed 6/6 tests.
