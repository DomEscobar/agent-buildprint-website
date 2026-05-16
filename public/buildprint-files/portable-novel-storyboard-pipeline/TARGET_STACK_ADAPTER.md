# Target Stack Adapter

No target stack is required.

Recommended clean-room proof stack:

- TypeScript service modules.
- In-memory repositories for tests.
- Optional SQLite adapter after tests pass.
- Mock text/image/video providers.
- Optional simple REST API for QA.

Adapter interfaces to implement:

- `TextProvider`
- `ImageProvider`
- `VideoProvider`
- `AssetStore`
- `ExportWriter`
- `Clock/IdGenerator` for deterministic tests

