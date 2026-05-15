# SELECTED_CANDIDATE

## AI Workflow Buildprint

- Scope: LLM calls, prompts, tools, model adapters, grounding and safety checks
- Estimated tier: agent-grade
- Why reusable: AI workflows need explicit contracts for inputs, outputs, tools, costs, and safety gates.

## Included paths
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

## Excluded paths
- none yet

## Risks
- AI/tool calls
- ungrounded output
- external API dependency

## Questions before implementation
- Which model/provider behavior is required vs replaceable?

## Agent instruction

Use this selected candidate as the extraction scope. Treat listed paths as the starting boundary, then ask before crossing into unrelated modules. Do not claim validation until checks have actually run.
