# BUILDPRINT_CANDIDATES

> Scope selection required before final extraction. This repo appears large, mixed, or multi-scope.

## 1. AI Workflow Buildprint

- Scope: LLM calls, prompts, tools, model adapters, grounding and safety checks
- Estimated tier: agent-grade
- Why reusable: AI workflows need explicit contracts for inputs, outputs, tools, costs, and safety gates.
- Included paths:
  - app/(chat)/api/chat/[id]/stream/route.ts
  - app/(chat)/api/chat/route.ts
  - app/(chat)/api/chat/schema.ts
  - app/(chat)/chat/[id]/page.tsx
  - components/ai-elements/code-block.tsx
  - components/ai-elements/conversation.tsx
  - components/ai-elements/message.tsx
  - components/ai-elements/model-selector.tsx
  - components/ai-elements/prompt-input.tsx
  - components/ai-elements/reasoning.tsx
  - components/ai-elements/shimmer.tsx
  - components/ai-elements/suggestion.tsx
  - components/ai-elements/tool.tsx
  - components/chat/app-sidebar.tsx
  - components/chat/artifact-actions.tsx
  - components/chat/artifact-close-button.tsx
  - components/chat/artifact-messages.tsx
  - components/chat/artifact.tsx
  - components/chat/auth-form.tsx
  - components/chat/chat-header.tsx
  - components/chat/code-editor.tsx
  - components/chat/console.tsx
  - components/chat/create-artifact.tsx
  - components/chat/data-stream-handler.tsx
- Excluded paths:
  - none yet
- Risks:
  - AI/tool calls
  - ungrounded output
  - external API dependency
- Questions:
  - Which model/provider behavior is required vs replaceable?

## 2. Auth / Session Buildprint

- Scope: login, registration, sessions, roles, permission checks
- Estimated tier: strong
- Why reusable: Auth and permission rules are high-risk and reusable across SaaS products.
- Included paths:
  - app/(auth)/api/auth/[...nextauth]/route.ts
  - app/(auth)/api/auth/guest/route.ts
  - app/(auth)/auth.config.ts
  - app/(auth)/auth.ts
  - app/(auth)/login/page.tsx
  - app/(auth)/register/page.tsx
  - components/chat/auth-form.tsx
  - tests/e2e/auth.test.ts
- Excluded paths:
  - none yet
- Risks:
  - auth/session handling
  - permission drift
- Questions:
  - What roles and permissions are intended?

## 3. Data Infrastructure Buildprint

- Scope: cache, queues, search, background jobs, and provider lifecycle
- Estimated tier: strong
- Why reusable: Infrastructure integrations are reusable but need explicit failure, retry, and local-development contracts.
- Included paths:
  - vercel-template.json
  - vercel.json
- Excluded paths:
  - none yet
- Risks:
  - external infrastructure dependency
  - data consistency drift
- Questions:
  - Which provider resources are production-critical vs optional?

## 4. Web App Route/API Buildprint

- Scope: public pages, API routes, routing contracts, page/data boundaries
- Estimated tier: strong
- Why reusable: Routes and API handlers provide a reusable implementation map for web app structure.
- Included paths:
  - app/(auth)/login/page.tsx
  - app/(auth)/register/page.tsx
  - app/(chat)/chat/[id]/page.tsx
  - app/(chat)/page.tsx
  - app/(auth)/api/auth/[...nextauth]/route.ts
  - app/(auth)/api/auth/guest/route.ts
  - app/(chat)/api/chat/[id]/stream/route.ts
  - app/(chat)/api/chat/route.ts
  - app/(chat)/api/document/route.ts
  - app/(chat)/api/files/upload/route.ts
  - app/(chat)/api/history/route.ts
  - app/(chat)/api/messages/route.ts
  - app/(chat)/api/models/route.ts
  - app/(chat)/api/suggestions/route.ts
  - app/(chat)/api/vote/route.ts
- Excluded paths:
  - none yet
- Risks:
  - route drift
  - API contract drift
- Questions:
  - Which routes are public, authenticated, or internal?

## 5. app Folder Buildprint

- Scope: Reusable slice under app/
- Estimated tier: basic
- Why reusable: This folder appears to define a major implementation slice or example set.
- Included paths:
  - app/(auth)/actions.ts
  - app/(auth)/api/auth/[...nextauth]/route.ts
  - app/(auth)/api/auth/guest/route.ts
  - app/(auth)/auth.config.ts
  - app/(auth)/auth.ts
  - app/(auth)/layout.tsx
  - app/(auth)/login/page.tsx
  - app/(auth)/register/page.tsx
  - app/(chat)/actions.ts
  - app/(chat)/api/chat/[id]/stream/route.ts
  - app/(chat)/api/chat/route.ts
  - app/(chat)/api/chat/schema.ts
  - app/(chat)/api/document/route.ts
  - app/(chat)/api/files/upload/route.ts
  - app/(chat)/api/history/route.ts
  - app/(chat)/api/messages/route.ts
  - app/(chat)/api/models/route.ts
  - app/(chat)/api/suggestions/route.ts
  - app/(chat)/api/vote/route.ts
  - app/(chat)/chat/[id]/page.tsx
  - app/(chat)/layout.tsx
  - app/(chat)/opengraph-image.png
  - app/(chat)/page.tsx
  - app/(chat)/twitter-image.png
- Excluded paths:
  - none yet
- Risks:
  - none detected
- Questions:
  - Should this folder be extracted as one Buildprint or split further?

