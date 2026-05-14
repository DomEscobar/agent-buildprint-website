# CONTRACTS

Use these names and shapes unless the user explicitly confirms alternatives.

## Functions

```ts
buildRuntimeContext(userId: string): Promise<RuntimeContext>
classifyIntent(message: string, context: RuntimeContext): Promise<AnalyzerResult>
evaluateMediaRequest(request: MediaRequest, user: UserMemory, self: SelfState): PolicyDecision
planSocialDraft(input: PlanningInput): SocialDraft
auditSystemState(input: AuditInput): AuditReport
publishDraft(draftId: string, options: PublishOptions): PublishResult
```

## Data shapes

```ts
type UserMemory = {
  userId: string
  trust: number
  stage: 'cold' | 'warm' | 'close'
  facts: string[]
  preferences: string[]
  openLoops: string[]
  recentMessages: { role: 'user' | 'persona'; text: string; at: string }[]
  relationshipNotes: string[]
  mediaBudget: { remaining: number; resetAt?: string }
}

type SelfState = {
  mood: string
  energy: number
  socialBattery: number
  currentArcs: string[]
  contentBacklog: string[]
  lastUpdated: string
}

type RuntimeContext = {
  private: true
  self: Pick<SelfState, 'mood' | 'energy' | 'socialBattery' | 'currentArcs'>
  relationship: Pick<UserMemory, 'trust' | 'stage' | 'facts' | 'preferences' | 'openLoops'>
  calendarSummary: string[]
  journalSummary: string[]
  socialSummary: string[]
  mediaStatus: string[]
}

type AnalyzerResult = {
  intent: 'chat' | 'recall' | 'media_request' | 'social_question' | 'calendar_question'
  mediaRequest?: MediaRequest
  factsToRemember: string[]
  openLoops: string[]
  suggestedPosture: string
}

type MediaRequest = {
  id: string
  requesterUserId?: string
  visibility: 'public' | 'private'
  prompt: string
  adultIntent: boolean
  includeFace: boolean
}

type PolicyDecision =
  | { allowed: true; mode: 'real' | 'mock'; reason: string }
  | { allowed: false; code: string; reason: string }

type SocialDraft = {
  id: string
  platform: 'instagram' | 'tiktok' | 'x' | 'youtube_shorts' | 'mock'
  caption: string
  visualPrompt?: string
  groundedIn: string[]
  status: 'draft' | 'needs_qa' | 'approved' | 'blocked' | 'published'
  qaNotes: string[]
}

type AuditReport = {
  status: 'pass' | 'warn' | 'fail'
  findings: { id: string; severity: 'info' | 'warn' | 'fail'; message: string; file?: string }[]
}
```
