# TEST_MATRIX

| Risk | Required test |
|---|---|
| Provider routing silently calls wrong model | fake provider route assertion |
| Streaming only tested as final string | event stream contains deltas before completion |
| Tool execution from raw text | schema/policy gate test |
| Shell/write/network risk | denial test for disallowed high-risk tool |
| Skill bloat | selected skill only is injected |
| MCP drift | fake MCP mapped tool test |
| Memory loss | checkpoint + compaction retention test |
| Hidden subagent behavior | team task events test |
| Token telemetry missing | normalized usage and compaction threshold test |
| UI smoke missed | browser/runtime happy path if UI exists |
| Overclaiming clone parity | `PARITY_CLAIMS.md` reviewed before publish |
