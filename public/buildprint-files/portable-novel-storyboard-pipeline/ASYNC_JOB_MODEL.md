# Async Job Model

## Job States

Use portable states:

- `queued`
- `running`
- `success`
- `failure`
- `cancelled`
- `retrying`

Map observed source states:

- Novel `eventState: 0/1/-1` -> `pending|running` / `success` / `failure`.
- Script `extractState: 2/0/1/-1` -> `queued` / `running` / `success` / `failure`.
- Video `生成中/生成成功/生成失败` -> `running` / `success` / `failure`.
- Task `进行中/已完成/生成失败` -> `running` / `success` / `failure`.

Evidence: `src/routes/novel/addNovel.ts:31-39`, `src/routes/script/extractAssets.ts:72-74`, `src/routes/script/extractAssets.ts:171-174`, `src/routes/production/workbench/generateVideo.ts:78-122`, `src/utils/taskRecord.ts:3-7`.

## Job Record

```ts
type JobRecord = {
  id: string;
  projectId: string;
  kind: "event" | "scriptAgent" | "assetExtraction" | "productionAgent" | "image" | "video" | "export";
  ownerType: "chapter" | "script" | "asset" | "storyboardRow" | "track" | "project";
  ownerId: string;
  idempotencyKey: string;
  state: JobState;
  attempt: number;
  inputHash: string;
  outputRef?: string;
  errorReason?: string;
  startedAt?: string;
  finishedAt?: string;
  cancelledAt?: string;
};
```

## Idempotency

- Use `kind:ownerType:ownerId:inputHash` as default idempotency key.
- If a matching `success` exists, return the prior output unless `force=true`.
- If `running` exists, return the existing job.
- If `failure` exists and retry requested, increment `attempt` and keep prior failure reason.

## Cancellation

- UI stop button aborts agent/provider controller.
- If cancelled before mutation, no artifact is written.
- If cancelled after partial provider submission, mark job `cancelled` and keep any external task id in job metadata; do not promote media to success.
- Source socket handlers abort current controller on new chat and on `stop`; model this behavior in webapp services.

Evidence: `src/socket/routes/scriptAgent.ts:48-89`, `src/socket/routes/productionAgent.ts:59-99`.

## Retry

- Retry failed event extraction per chapter.
- Retry failed XML parse from raw output repair loop.
- Retry failed image/video generation per asset/storyboard row/track.
- Do not duplicate media rows for the same owner/idempotency key; update or supersede.

## Persistence Rule

All async transitions are durable:

1. Create `queued`.
2. Mark `running` before provider/agent call.
3. Validate output.
4. Mutate artifact state transactionally.
5. Mark `success` or `failure`.

For web-only proof, an in-memory store is acceptable only if tests can snapshot the same job lifecycle.
