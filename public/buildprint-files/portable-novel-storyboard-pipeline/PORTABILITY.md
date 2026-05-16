# Portability

The rebuild may use any stack. Preserve contracts, states, and module boundaries rather than framework choices.

Portable substitutions:

- SQLite -> any transactional local or server DB.
- Socket.IO chat -> websocket, SSE, or job API.
- Markdown Skills -> versioned prompt/config documents.
- vm2 provider scripts -> safer plugin modules or registered provider classes.
- `/oss` local files -> local object store, S3-compatible bucket, or test fixture store.

Do not preserve plaintext password storage or unrestricted dynamic provider execution as-is.

