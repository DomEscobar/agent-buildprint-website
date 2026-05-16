# Head-To-Foot QA

## Selected Proof Depth

- Selected: compact mocked runtime proof for the RSS update pipeline.
- OUT_OF_SCOPE: browser journey QA, live provider QA, hosted deployment QA.

## Gates

### 1. Static Safety

- Check generated Buildprint files for secret-looking values.
- Confirm only env names are included.
- Confirm non-claims prohibit provider/feed-source/hosted/full-clone parity.

### 2. Unit / Contract

- Filename utility contract.
- Feed item normalization contract.
- Merge/idempotency contract.
- Summary fallback contract.
- All-source continuation contract.

### 3. Build / Runtime

- Run scratch proof tests with Node only.
- No install or live network should be required.

### 4. Runtime Happy Path

- Mock one source with one new item.
- Mock LLM returns a deterministic summary.
- Assert output artifact has source metadata, item, summary, and `lastUpdated`.

### 5. Runtime Negative Paths

- Mock missing env.
- Mock RSS fetch failure.
- Mock LLM summary failure.
- Mock malformed prior data.

### 6. Responsive / UX Smoke

- OUT_OF_SCOPE for selected candidate.
- If UI candidate is later selected, run Playwright CLI against a generated reader and test source switching plus summary/original tabs.

### 7. Optional Live Provider / Export

- OUT_OF_SCOPE unless explicitly selected and credentials are supplied.

