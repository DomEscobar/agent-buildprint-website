# HEAD_TO_FOOT_QA

Before claiming a generated implementation is done, run these gates:

1. **Static gate**: typecheck/lint/build.
2. **Unit/contract gate**: provider, memory, tools, skills, MCP, telemetry, team tests.
3. **Mock runtime gate**: full fake-provider chat turn with tool result and streamed events.
4. **Persistence gate**: checkpoint survives failed/aborted turn and can be inspected.
5. **Browser gate** if UI exists: real click/type path from bootstrap to final answer, screenshot, and rendered telemetry/memory check.
6. **Security gate**: dangerous tool denial and no secrets in repo/output.
7. **Parity gate**: safe claims/non-claims checked against `PARITY_CLAIMS.md`.

Record commands, pass/fail, screenshots, and known gaps in the implementation validation report.
