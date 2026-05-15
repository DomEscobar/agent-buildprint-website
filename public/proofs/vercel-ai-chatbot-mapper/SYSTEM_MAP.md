# SYSTEM_MAP

## Project

- Name: chatbot
- Root: /tmp/agb-github-map-smoke/repos/vercel__ai-chatbot
- Files scanned: 180
- Package manager: pnpm
- Scope selection required: yes

## Architecture zones

### Frontend / UI
- OBSERVED route: app/(auth)/login/page.tsx
- OBSERVED route: app/(auth)/register/page.tsx
- OBSERVED route: app/(chat)/chat/[id]/page.tsx
- OBSERVED route: app/(chat)/page.tsx

### API / backend
- OBSERVED API: app/(auth)/api/auth/[...nextauth]/route.ts
- OBSERVED API: app/(auth)/api/auth/guest/route.ts
- OBSERVED API: app/(chat)/api/chat/[id]/stream/route.ts
- OBSERVED API: app/(chat)/api/chat/route.ts
- OBSERVED API: app/(chat)/api/document/route.ts
- OBSERVED API: app/(chat)/api/files/upload/route.ts
- OBSERVED API: app/(chat)/api/history/route.ts
- OBSERVED API: app/(chat)/api/messages/route.ts
- OBSERVED API: app/(chat)/api/models/route.ts
- OBSERVED API: app/(chat)/api/suggestions/route.ts
- OBSERVED API: app/(chat)/api/vote/route.ts

### Data model
- OBSERVED data/model file: app/(chat)/api/models/route.ts
- OBSERVED data/model file: drizzle.config.ts
- OBSERVED data/model file: lib/ai/models.mock.ts
- OBSERVED data/model file: lib/ai/models.test.ts
- OBSERVED data/model file: lib/ai/models.ts
- OBSERVED data/model file: lib/db/migrations/0000_initial.sql
- OBSERVED data/model file: lib/db/migrations/meta/_journal.json

### Integrations
- INFERRED integration: ai
- INFERRED integration: auth
- INFERRED integration: database
- INFERRED integration: cache

### Subprojects / examples
- OBSERVED package.json: . (chatbot)

## Risk zones
- AI/tool calls
- auth/session handling
- file upload / storage

## Human review needed

- Confirm which candidate Buildprint should be extracted.
- Confirm which observed modules are legacy vs desired architecture.
- Confirm auth, billing, external-write, and data lifecycle rules.
