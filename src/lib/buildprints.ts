export type BuildprintCategory = 'Framework / Architecture' | 'Product OS' | 'Feature / Extension' | 'Workflow OS' | 'Mapped Project';
export type BuildprintTier = 'basic' | 'strong' | 'agent-grade' | 'planned';
export type BuildprintStatus = 'draft' | 'publishable-draft' | 'dry-run-needed' | 'validated' | 'coming-soon';

export type BuildprintFile = { path: string; purpose: string; required: boolean };
export type BuildprintTrustBadge = { label: string; detail: string; tone?: 'success' | 'info' | 'warning' };
export type Buildprint = {
  slug: string;
  title: string;
  creator: string;
  category: BuildprintCategory;
  tier: BuildprintTier;
  status: BuildprintStatus;
  runtime: string[];
  stack: string[];
  iconKeys?: string[];
  difficulty: 'Medium' | 'Advanced';
  summary: string;
  promise: string;
  includes: string[];
  risks: string[];
  files: BuildprintFile[];
  checks: string[];
  trustBadges?: BuildprintTrustBadge[];
  copyPrompt: string;
  githubUrl: string;
  rawBaseUrl: string;
  featured?: boolean;
  planned?: boolean;
};

export const repoUrl = 'https://github.com/DomEscobar/agent-buildprint';
export const rawRepoBase = 'https://raw.githubusercontent.com/DomEscobar/agent-buildprint/23d843e';
// Production DNS for agent-buildprint.com is not yet serving this static site.
// Keep generated manifests/CLI bootstrap commands on the live preview origin until DNS is cut over.
export const siteBase = import.meta.env.PUBLIC_SITE_BASE || 'https://agent-buildprint.com';

export const canonicalFilePurposes: Record<string, string> = {
  'BUILDPRINT.md': 'architecture truth / coding-agent contract',
  'SPEC.md': 'behavior truth / requirements',
  'PLAN.md': 'execution index',
  'plans/*.md': 'tiny phase task rails',
  'CONTRACTS.md': 'interfaces and data contracts',
  'DEFAULT_PRESET.md': 'configurable defaults, no fixed identity',
  'TEST_MATRIX.md': 'risk-to-test alignment',
  'VALIDATION_TEMPLATE.md': 'completion report template',
  'questions.md': 'configuration interview',
};

const rawFor = (slug: string) => `${rawRepoBase}/buildprints/${slug}`;
const localPrompt = (slug: string, title: string) => `Use the ${title} Buildprint. First bootstrap exact snapshots: agb start ${siteBase}/buildprints/${slug}/package.json . If agb is not installed, clone https://github.com/DomEscobar/agent-buildprint and run node agent-buildprint/bin/agb.js start ${siteBase}/buildprints/${slug}/package.json . Then read .buildprint/next-agent.md and continue. Do not write Buildprint snapshots manually.`;
const agentTrustBadges: BuildprintTrustBadge[] = [
  { label: 'Snapshot bootstrap passed', detail: 'agb start downloaded exact Markdown snapshots; HTML/parked-domain responses are rejected.', tone: 'success' },
  { label: 'Codex dry-run passed', detail: 'A fresh Codex run built a fixture-safe implementation from the Buildprint package.', tone: 'success' },
  { label: 'Tests pass', detail: 'Dry-run implementation completed its local tests/static checks without real credentials.', tone: 'success' },
  { label: 'Gated publishing', detail: 'Publishing is manual/mock/approval-gated by default, never raw auto-publish.', tone: 'info' },
];

export const buildprints: Buildprint[] = [
  {
    slug: 'ai-influencer-os',
    title: 'AI Influencer OS',
    creator: 'Agent Buildprint',
    category: 'Product OS',
    tier: 'agent-grade',
    status: 'validated',
    runtime: ['OpenClaw'],
    stack: ['OpenClaw', 'Persona memory', 'Wavespeed', 'Social publishing', 'Docker'],
    iconKeys: ['openclaw', 'json', 'docker'],
    difficulty: 'Advanced',
    featured: true,
    summary: 'OpenClaw AI creator system with configurable persona, memory, life continuity, Wavespeed images, social drafts, QA, and publishing handoff.',
    promise: 'An agent-grade Buildprint package for a full AI influencer system. The architecture is fixed; persona, voice, channels, content lanes, and approval policy stay configurable.',
    includes: ['OpenClaw runtime shape', 'Configurable persona preset', 'Relationship memory', 'Life state and journal', 'Wavespeed image skill', 'Social drafts and media queue', 'Manager audit', 'Browser/noVNC publishing handoff'],
    risks: ['Generic chatbot drift', 'Fixed persona/name leakage', 'Ungrounded public claims', 'Unsafe media requests', 'Image provider drift', 'Auto-publishing by default'],
    files: [
      { path: 'BUILDPRINT.md', purpose: canonicalFilePurposes['BUILDPRINT.md'], required: true },
      { path: 'SPEC.md', purpose: canonicalFilePurposes['SPEC.md'], required: true },
      { path: 'PLAN.md', purpose: canonicalFilePurposes['PLAN.md'], required: true },
      { path: 'plans/00-alignment.md', purpose: 'phase 00 alignment rail', required: true },
      { path: 'plans/01-openclaw-skeleton.md', purpose: 'phase 01 runtime skeleton rail', required: true },
      { path: 'plans/02-persona-runtime.md', purpose: 'phase 02 persona runtime rail', required: true },
      { path: 'plans/03-memory-life-state.md', purpose: 'phase 03 memory/life rail', required: true },
      { path: 'plans/04-wavespeed-image.md', purpose: 'phase 04 Wavespeed image rail', required: true },
      { path: 'plans/05-social-planner.md', purpose: 'phase 05 social planner rail', required: true },
      { path: 'plans/06-publisher-handoff.md', purpose: 'phase 06 publisher handoff rail', required: true },
      { path: 'plans/07-manager-audit.md', purpose: 'phase 07 manager audit rail', required: true },
      { path: 'plans/08-tests-validation.md', purpose: 'phase 08 tests and validation rail', required: true },
      { path: 'CONTRACTS.md', purpose: canonicalFilePurposes['CONTRACTS.md'], required: true },
      { path: 'DEFAULT_PRESET.md', purpose: canonicalFilePurposes['DEFAULT_PRESET.md'], required: true },
      { path: 'TEST_MATRIX.md', purpose: canonicalFilePurposes['TEST_MATRIX.md'], required: true },
      { path: 'VALIDATION_TEMPLATE.md', purpose: canonicalFilePurposes['VALIDATION_TEMPLATE.md'], required: true },
      { path: 'questions.md', purpose: canonicalFilePurposes['questions.md'], required: true },
    ],
    checks: ['OpenClaw runtime command/blocker exists', 'LLM analyzer adapter prevents keyword-only drift', 'Wavespeed real adapter shape exists', 'Tests use mock image mode without external APIs', 'User memory and self-state are separate', 'noVNC handoff service shape exists', 'Publishing is mock/manual-gated by default'],
    trustBadges: agentTrustBadges,
    githubUrl: `${repoUrl}/tree/main/buildprints/ai-influencer-os`,
    rawBaseUrl: rawFor('ai-influencer-os'),
    copyPrompt: `${localPrompt('ai-influencer-os', 'AI Influencer OS')} Do not auto-publish by default.`,
  },
  {
    slug: 'automated-ai-blog-os',
    title: 'Automated AI Blog OS',
    creator: 'Agent Buildprint',
    category: 'Product OS',
    tier: 'agent-grade',
    status: 'validated',
    runtime: ['Astro/MDX'],
    stack: ['Astro/MDX', 'Research scanner', 'Idea scoring', 'SEO checks', 'Approval queue'],
    iconKeys: ['astro', 'md', 'json'],
    difficulty: 'Advanced',
    featured: true,
    summary: 'Approval-gated AI blog publishing system that researches topics, scores ideas, drafts visual posts, validates SEO/build output, and publishes only through configured gates.',
    promise: 'An agent-grade Buildprint package for automated AI blogging: source scanning, idea scoring, content memory, draft generation, visual plans, claim grounding, SEO validation, approval queue, and gated publishing/scheduling.',
    includes: ['Source scanner', 'Rubric-based idea scoring', 'Content memory', 'Draft generator with source/claim maps', 'Visual post templates', 'Claim grounding validator', 'SEO/build/feed validator', 'Approval queue', 'Gated publisher/scheduler', 'Manager audit'],
    risks: ['Generic SEO filler', 'Unsourced claims', 'Source laundering', 'Repeated content angles', 'Fake expertise', 'Broken metadata/RSS/sitemap/llms outputs', 'Publishing without approval', 'External API calls in tests'],
    files: [
      { path: 'BUILDPRINT.md', purpose: canonicalFilePurposes['BUILDPRINT.md'], required: true },
      { path: 'SPEC.md', purpose: canonicalFilePurposes['SPEC.md'], required: true },
      { path: 'PLAN.md', purpose: canonicalFilePurposes['PLAN.md'], required: true },
      { path: 'plans/00-alignment.md', purpose: 'phase 00 alignment rail', required: true },
      { path: 'plans/01-content-skeleton.md', purpose: 'phase 01 content skeleton rail', required: true },
      { path: 'plans/02-source-scanner.md', purpose: 'phase 02 source scanner rail', required: true },
      { path: 'plans/03-idea-scoring.md', purpose: 'phase 03 idea scoring rail', required: true },
      { path: 'plans/04-drafting-visuals.md', purpose: 'phase 04 drafting and visuals rail', required: true },
      { path: 'plans/05-seo-claim-validation.md', purpose: 'phase 05 SEO and claim validation rail', required: true },
      { path: 'plans/06-approval-publishing.md', purpose: 'phase 06 approval and publishing rail', required: true },
      { path: 'plans/07-manager-audit.md', purpose: 'phase 07 manager audit rail', required: true },
      { path: 'plans/08-tests-validation.md', purpose: 'phase 08 tests and validation rail', required: true },
      { path: 'CONTRACTS.md', purpose: canonicalFilePurposes['CONTRACTS.md'], required: true },
      { path: 'DEFAULT_PRESET.md', purpose: canonicalFilePurposes['DEFAULT_PRESET.md'], required: true },
      { path: 'TEST_MATRIX.md', purpose: canonicalFilePurposes['TEST_MATRIX.md'], required: true },
      { path: 'VALIDATION_TEMPLATE.md', purpose: canonicalFilePurposes['VALIDATION_TEMPLATE.md'], required: true },
      { path: 'questions.md', purpose: canonicalFilePurposes['questions.md'], required: true },
      { path: 'checks/acceptance.md', purpose: 'acceptance checklist', required: true },
      { path: 'policies/publishing.md', purpose: 'publishing safety policy', required: true },
      { path: 'prompts/implement.md', purpose: 'implementation prompt', required: true },
      { path: 'prompts/qa.md', purpose: 'QA/review prompt', required: true },
      { path: 'diagrams/architecture.md', purpose: 'architecture diagram', required: false },
      { path: 'schemas/buildprint.meta.json', purpose: 'package metadata schema example', required: false },
      { path: 'README.md', purpose: 'package overview', required: false },
    ],
    checks: ['Sources are captured as records, not invented', 'Ideas use explicit scoring rubric', 'Drafts include source map and claim map', 'Ungrounded factual claims block publishing', 'SEO metadata, structured data, sitemap/RSS/llms, and build are validated', 'Unapproved drafts cannot publish by default', 'Tests run without real network/publishing credentials', 'Manager audit reports stale/weak/blocked items'],
    trustBadges: agentTrustBadges,
    githubUrl: `${repoUrl}/tree/main/buildprints/automated-ai-blog-os`,
    rawBaseUrl: `${siteBase}/buildprint-files/automated-ai-blog-os`,
    copyPrompt: `${localPrompt('automated-ai-blog-os', 'Automated AI Blog OS')} Build the approval-gated AI blog pipeline with source scanning, idea scoring, draft generation, claim/SEO validation, approval queue, gated publishing/scheduling, manager audit, and tests. Do not auto-publish by default.`,
  },
  {
    slug: 'buildprint-mapper-os',
    title: 'Buildprint Mapper OS',
    creator: 'Agent Buildprint',
    category: 'Workflow OS',
    tier: 'agent-grade',
    status: 'draft',
    runtime: ['Codex/Cursor/Claude Code', 'optional agb bootstrap'],
    stack: ['Repository analysis', 'System decomposition', 'Buildprint extraction', 'Submission review'],
    iconKeys: ['md', 'json', 'typescript'],
    difficulty: 'Advanced',
    featured: true,
    summary: 'Turn an existing repo into scoped Buildprint candidates, then select one candidate or path for a focused Buildprint instead of flattening the whole project.',
    promise: 'An official workflow Buildprint for creator submissions: evidence-backed system maps, scoped Buildprint candidates, human scope selection, selected extraction, reversal validation, and an honest gap report.',
    includes: ['Safety and secrets boundary', 'Repo census', 'SYSTEM_MAP.md', 'BUILDPRINT_CANDIDATES.md', 'Human scope decision gate', 'Progressive questions.md', 'Clean-room reversal report', 'QA_PLAN.md', 'TRACEABILITY_MATRIX.md', 'Single Buildprint extraction', 'Hierarchical System Buildprint extraction', 'Submission checklist', 'Golden eval targets'],
    risks: ['Whole-repo sludge', 'Secret leakage', 'Hallucinated intent', 'Invented validation results', 'Missing scope', 'Vague marketplace submissions', 'Unclear module boundaries', 'Generic QA plans', 'Missing traceability'],
    files: [
      { path: 'BUILDPRINT.md', purpose: canonicalFilePurposes['BUILDPRINT.md'], required: true },
      { path: 'SPEC.md', purpose: canonicalFilePurposes['SPEC.md'], required: true },
      { path: 'PLAN.md', purpose: canonicalFilePurposes['PLAN.md'], required: true },
      { path: 'plans/00-safety-boundaries.md', purpose: 'phase 00 safety and write boundaries', required: true },
      { path: 'plans/01-repo-census.md', purpose: 'phase 01 deterministic repo facts', required: true },
      { path: 'plans/02-system-map.md', purpose: 'phase 02 architecture zones and subsystem boundaries', required: true },
      { path: 'plans/03-candidate-buildprints.md', purpose: 'phase 03 candidate Buildprint discovery', required: true },
      { path: 'plans/04-scope-decision.md', purpose: 'phase 04 human scope selection gate', required: true },
      { path: 'plans/05-single-extraction.md', purpose: 'phase 05 selected module extraction', required: true },
      { path: 'plans/06-system-extraction.md', purpose: 'phase 06 hierarchical system extraction', required: true },
      { path: 'plans/07-validation-submission.md', purpose: 'phase 07 validation and submission checklist', required: true },
      { path: 'CONTRACTS.md', purpose: canonicalFilePurposes['CONTRACTS.md'], required: true },
      { path: 'TEST_MATRIX.md', purpose: canonicalFilePurposes['TEST_MATRIX.md'], required: true },
      { path: 'VALIDATION_TEMPLATE.md', purpose: canonicalFilePurposes['VALIDATION_TEMPLATE.md'], required: true },
      { path: 'questions.md', purpose: canonicalFilePurposes['questions.md'], required: true },
      { path: 'README.md', purpose: 'creator-facing mapper overview', required: false },
      { path: 'policies/safety.md', purpose: 'secret and safety policy', required: true },
      { path: 'policies/quality.md', purpose: 'max-quality precision, edge-case, and proof policy', required: true },
      { path: 'templates/QA_PLAN.md', purpose: 'scope-derived QA journey template', required: true },
      { path: 'templates/TRACEABILITY_MATRIX.md', purpose: 'source evidence to requirement/check traceability template', required: true },
      { path: 'templates/CAPABILITY_BASELINE.md', purpose: 'famous-product capability and non-parity boundary template', required: false },
      { path: 'templates/THREAT_MODEL.md', purpose: 'security and abuse-case template', required: false },
      { path: 'templates/DATA_LIFECYCLE.md', purpose: 'data ownership/lifecycle/retention template', required: false },
      { path: 'templates/ARCHITECTURE_VIEWS.md', purpose: 'context/container/component/runtime/deployment views template', required: false },
      { path: 'templates/DECISIONS.md', purpose: 'ADR-style mapping decisions template', required: false },
      { path: 'templates/OBSERVABILITY.md', purpose: 'logs/metrics/traces/runbook template', required: false },
      { path: 'templates/QUALITY_SCORECARD.md', purpose: 'publish-readiness and evidence scorecard template', required: false },
      { path: 'checks/acceptance.md', purpose: 'submission acceptance checks', required: true },
      { path: 'prompts/discover.md', purpose: 'candidate discovery prompt', required: true },
      { path: 'prompts/extract-selected.md', purpose: 'selected Buildprint extraction prompt', required: true },
      { path: 'schemas/candidate.schema.json', purpose: 'candidate record schema', required: false },
    ],
    checks: ['Large repos produce candidates before final package unless full-system mode is selected', 'Generated files contain no secret values', 'Claims are labeled OBSERVED/INFERRED/QUESTION', 'Scope includes included/excluded paths', 'QA plan is derived from mapped flows', 'Traceability matrix links evidence to requirements and checks', 'Submission checklist reports commands run and known gaps', 'No validation results are invented', 'Golden eval examples include stripe-saas, ai-blog-os, malicious-secrets, admin-dashboard, and large-monorepo'],
    trustBadges: [
      { label: 'Submission workflow', detail: 'Defines the official reviewable path from existing repo to scoped Buildprint package.', tone: 'info' },
      { label: 'Safety-first extraction', detail: 'Requires no app-code changes, no secret copying, and explicit unknowns.', tone: 'success' },
      { label: 'Blueprint-first workflow', detail: 'The mapper works as pure coding-agent instructions; CLI bootstrap is optional, not required.', tone: 'success' },
      { label: 'Traceable QA', detail: 'Requires source evidence → requirement → reversal/QA checks instead of generic demo validation.', tone: 'success' },
    ],
    githubUrl: `${repoUrl}/tree/main/buildprints/buildprint-mapper-os`,
    rawBaseUrl: `${siteBase}/buildprints/buildprint-mapper-os/files`,
    copyPrompt: `${localPrompt('buildprint-mapper-os', 'Buildprint Mapper OS')} Use it to map this repo into SYSTEM_MAP.md and BUILDPRINT_CANDIDATES.md first. Ask me to choose one candidate, then extract only that selected scope into buildprint-submission/. Do not require a CLI, do not copy secrets, and do not flatten the repo into one vague document.`,
  },
  {
    slug: 'stripe-billing-extension',
    title: 'Stripe Billing Extension',
    creator: 'Agent Buildprint',
    category: 'Feature / Extension',
    tier: 'basic',
    status: 'dry-run-needed',
    runtime: ['TypeScript'],
    stack: ['TypeScript', 'Stripe', 'Webhooks', 'SaaS'],
    iconKeys: ['typescript', 'stripe', 'json'],
    difficulty: 'Medium',
    featured: true,
    summary: 'Add SaaS billing without forgetting checkout, subscriptions, trials, portal, webhooks, entitlement checks, and billing UI.',
    promise: 'A practical extension Buildprint for the paid-app foundation coding agents often implement incompletely.',
    includes: ['Checkout session', 'Subscriptions and trials', 'Customer portal', 'Webhook handler', 'Subscription state model', 'Entitlement guards', 'Billing settings UI'],
    risks: ['Webhook signature skipped', 'Frontend state trusted for access', 'Failed payment states ignored', 'Portal exposed without auth', 'Subscription state drift'],
    files: [{ path: 'BUILDPRINT.md', purpose: canonicalFilePurposes['BUILDPRINT.md'], required: true }],
    checks: ['Webhook signatures verified', 'Premium access uses server-side subscription state', 'Portal requires authenticated customer', 'Failed/canceled/trialing states handled'],
    githubUrl: `${repoUrl}/tree/main/buildprints/stripe-billing-extension`,
    rawBaseUrl: rawFor('stripe-billing-extension'),
    copyPrompt: `${localPrompt('stripe-billing-extension', 'Stripe Billing Extension')} Implement billing with verified webhooks, server-side subscription state, entitlements, and tests.`,
  },
  {
    slug: 'langgraph-vanilla-ts-agent',
    title: 'Vanilla TS Agent Contract',
    creator: 'Agent Buildprint',
    category: 'Framework / Architecture',
    tier: 'strong',
    status: 'draft',
    runtime: ['TypeScript'],
    stack: ['Vanilla TypeScript', 'Agent contracts', 'Schemas', 'Policy checks'],
    iconKeys: ['typescript', 'json', 'md'],
    difficulty: 'Medium',
    featured: true,
    summary: 'Framework-light agent architecture inspired by graph workflows, without locking generated code into a runtime framework.',
    promise: 'A technical architecture Buildprint for typed agent nodes, routes, policies, and tests.',
    includes: ['Node contracts', 'Route specs', 'State schema', 'Prompt contracts', 'Side-effect policy', 'Example runner'],
    risks: ['Runtime lock-in', 'Untyped outputs', 'Unclear side effects', 'Prompt/schema drift'],
    files: [{ path: 'BUILDPRINT.md', purpose: canonicalFilePurposes['BUILDPRINT.md'], required: true }],
    checks: ['No framework runtime import', 'Schemas exist', 'Routes are testable', 'Side effects are declared'],
    githubUrl: `${repoUrl}/tree/main/langgraph`,
    rawBaseUrl: `${rawRepoBase}/langgraph`,
    copyPrompt: 'Use the Vanilla TS Agent Contract Buildprint. Keep generated code framework-light, typed, policy-aware, and testable. Do not import LangGraph runtime packages unless explicitly requested.',
  },
  {
    slug: 'auth-teams-rbac', title: 'Auth + Teams RBAC', creator: 'Agent Buildprint', category: 'Feature / Extension', tier: 'planned', status: 'coming-soon', runtime: ['Next.js', 'TypeScript'], stack: ['Auth', 'Teams', 'RBAC'], iconKeys: ['typescript', 'json'], difficulty: 'Medium', planned: true, summary: 'Team accounts, roles, invitations, and permission checks agents usually miss.', promise: 'Coming soon.', includes: [], risks: [], files: [], checks: [], githubUrl: repoUrl, rawBaseUrl: rawRepoBase, copyPrompt: 'Coming soon.'
  },
  {
    slug: 'admin-dashboard', title: 'Admin Dashboard', creator: 'Agent Buildprint', category: 'Feature / Extension', tier: 'planned', status: 'coming-soon', runtime: ['React', 'TypeScript'], stack: ['Tables', 'Filters', 'Actions', 'Audit logs'], iconKeys: ['typescript', 'json'], difficulty: 'Medium', planned: true, summary: 'A safe admin dashboard with search, filters, guarded actions, and auditability.', promise: 'Coming soon.', includes: [], risks: [], files: [], checks: [], githubUrl: repoUrl, rawBaseUrl: rawRepoBase, copyPrompt: 'Coming soon.'
  },
  {
    slug: 'ai-support-desk-os', title: 'AI Support Desk OS', creator: 'Agent Buildprint', category: 'Product OS', tier: 'planned', status: 'coming-soon', runtime: ['OpenClaw', 'Helpdesk'], stack: ['Tickets', 'Knowledge base', 'Escalation'], iconKeys: ['openclaw', 'json', 'md'], difficulty: 'Advanced', planned: true, summary: 'Support agent system with knowledge retrieval, escalation, QA, and human handoff.', promise: 'Coming soon.', includes: [], risks: [], files: [], checks: [], githubUrl: repoUrl, rawBaseUrl: rawRepoBase, copyPrompt: 'Coming soon.'
  }
];

export const categories = ['All', 'Framework / Architecture', 'Product OS', 'Feature / Extension', 'Workflow OS', 'Mapped Project'] as const;
export const tiers = ['All', 'basic', 'strong', 'agent-grade', 'planned'] as const;
export const getBuildprint = (slug: string) => buildprints.find((item) => item.slug === slug);
export const liveBuildprints = buildprints.filter((bp) => !bp.planned);
export const plannedBuildprints = buildprints.filter((bp) => bp.planned);

export function buildprintUrls(bp: Buildprint) {
  return { human: `/buildprints/${bp.slug}/`, agent: `/buildprints/${bp.slug}/agent.md`, manifest: `/buildprints/${bp.slug}/package.json`, prompt: `/buildprints/${bp.slug}/prompt.txt`, files: bp.rawBaseUrl };
}

export function packageManifest(bp: Buildprint) {
  const urls = buildprintUrls(bp);
  return {
    schema: `${siteBase}/schemas/buildprint-package.v1.json`,
    slug: bp.slug,
    title: bp.title,
    category: bp.category,
    tier: bp.tier,
    status: bp.status,
    runtime: bp.runtime,
    stack: bp.stack,
    entrypoints: { human: urls.human, agent: urls.agent, manifest: urls.manifest, prompt: urls.prompt, github: bp.githubUrl, rawBase: bp.rawBaseUrl },
    bootstrap: {
      command: `agb start ${siteBase}/buildprints/${bp.slug}/package.json`,
      fallbackCommand: `git clone https://github.com/DomEscobar/agent-buildprint && node agent-buildprint/bin/agb.js start ${siteBase}/buildprints/${bp.slug}/package.json`,
      stateDir: '.buildprint',
      snapshotMode: 'download_exact',
      rule: 'Do not write, summarize, or regenerate snapshot files manually. Use agb start to download exact files from this manifest.'
    },
    files: bp.files.map((file) => ({ ...file, rawUrl: `${bp.rawBaseUrl}/${file.path}` })),
    instructions: {
      readOrder: ['BUILDPRINT.md', 'SPEC.md', 'PLAN.md', ...bp.files.filter((file) => file.path.startsWith('plans/')).map((file) => file.path), 'CONTRACTS.md', 'DEFAULT_PRESET.md', 'TEST_MATRIX.md', 'VALIDATION_TEMPLATE.md', 'questions.md'].filter((path) => bp.files.some((file) => file.path === path)),
      rule: 'Do not scrape human cards. Use this manifest, agent.md, and raw files.',
    },
  };
}
