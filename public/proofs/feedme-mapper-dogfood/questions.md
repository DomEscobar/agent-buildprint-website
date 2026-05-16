# Decisions

## Required Now

| # | Decision | Safe default | Simulated answer |
|---|---|---|---|
| 1 | Confirm selected candidate/scope | Candidate 1: Static RSS Update Pipeline Contract | Select Candidate 1 |
| 2 | Choose fidelity target | `workflow-proof` + `contract-parity`; runtime proof only if cheap/applicable | Use `workflow-proof` + `contract-parity`; add compact runtime proof |
| 3 | Choose provider/export posture | Mock providers; static JSON artifact only | Mock LLM/RSS providers; do not claim provider/feed-source/export parity |
| 4 | Choose source-stack posture | Keep portable while preserving observed contracts | Portable Node/TypeScript-style contract is acceptable |

## Appendix — Ask Only If Touched

- QUESTION: Should generated summaries always be Chinese, as the observed prompt requests?
- QUESTION: Should failed source updates keep the process exit status successful if at least one source succeeds?
- QUESTION: Should generated feed HTML be sanitized before UI rendering?
- QUESTION: Should `DATA_DIR` override be part of the intended update contract or removed from Docker scripts?
- QUESTION: Are retries, rate limits, or backoff required for RSS and LLM provider calls?

