# Threat Model

## Assets

- Imported story text.
- Generated scripts and media prompts.
- Provider credentials.
- Local media files.
- JWT/session tokens.
- Editable Skill and provider code.

## Observed Risks

- Plaintext default user password and plaintext password comparison (`src/lib/initDB.ts:23-25`; `src/routes/login/login.ts:26-41`).
- Dynamic provider TypeScript execution via vm2 (`src/utils/vm.ts:16-55`).
- Provider input values injected into runtime adapter object (`src/utils/ai.ts:120-130`).
- Long-lived JWT expiry (`src/routes/login/login.ts:32-41`).

## Buildprint Requirements

- Hash passwords in any rebuild.
- Treat provider credentials as secrets outside Buildprint.
- Use allowlisted provider adapter APIs.
- Redact prompts/logs if they include story/customer data.
- Disable live providers by default in tests.

