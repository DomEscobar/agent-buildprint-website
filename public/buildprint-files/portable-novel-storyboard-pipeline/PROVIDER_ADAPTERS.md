# Provider Adapters

## Default Rule

Default build and tests use mock providers only. No network calls are allowed unless an explicit live adapter is enabled by environment variable.

## Interfaces

```ts
interface TextProvider {
  generate(input: {
    system?: string;
    messages: { role: "system" | "assistant" | "user"; content: string }[];
    tools?: Record<string, unknown>;
    signal?: AbortSignal;
  }): Promise<{ text: string; raw?: unknown }>;
}

interface ImageProvider {
  run(input: {
    prompt: string;
    referenceList?: MediaRef[];
    size: "1K" | "2K" | "4K";
    aspectRatio: `${number}:${number}`;
    signal?: AbortSignal;
  }): Promise<MediaBlob>;
}

interface VideoProvider {
  run(input: {
    prompt: string;
    referenceList?: MediaRef[];
    mode: VideoMode | VideoMode[];
    duration: number;
    resolution: string;
    aspectRatio: "16:9" | "9:16";
    audio?: boolean;
    signal?: AbortSignal;
  }): Promise<MediaBlob>;
}
```

## Mock Providers

- Text mock returns deterministic XML by stage.
- Image mock returns deterministic `mock://image/{hash}` media.
- Video mock returns deterministic `mock://video/{hash}` media.
- Mock failure can be triggered by input marker `__FAIL__`.
- Mock delay/cancel can be triggered by test options.

## Optional Live Adapter Pattern

Enable only when:

- `TOONFLOW_ENABLE_LIVE_PROVIDERS=1`
- provider-specific env vars are present,
- tests are not running with `NO_NETWORK=1`.

Live adapter configuration:

- Never persist raw API keys in project data.
- Read secrets from process env.
- Wrap SDK/provider errors into portable `errorReason`.
- Save only normalized media metadata and task IDs.

## Evidence

- Source resolves model config dynamically and executes vendor functions from TypeScript code: `src/utils/ai.ts:113-140`.
- Image/video wrappers call `imageRequest`/`videoRequest` and save results through storage: `src/utils/ai.ts:246-321`.
- Vendor code is read/compiled from `vendor/{id}.ts`: `src/utils/vendor.ts:15-41`.
- VM exposes provider SDKs, fetch, axios, image helpers, and polling: `src/utils/vm.ts:16-55`, `src/utils/vm.ts:88-105`.
- Template exports `textRequest`, `imageRequest`, `videoRequest`, `ttsRequest`: `data/vendor/null.ts:120-188`.

## Clean-Room Boundary

Do not reimplement Toonflow's editable vendor VM in phase 1. Provide typed adapters and a mock default. A later phase may add editable adapter code, but it must be sandboxed and separately reviewed.
