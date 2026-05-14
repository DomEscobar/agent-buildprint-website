export type BuildprintCategory = 'Framework / Architecture' | 'Product OS' | 'Feature / Extension' | 'Workflow OS' | 'Mapped Project';
export type BuildprintTier = 'basic' | 'strong' | 'agent-grade' | 'planned';
export type BuildprintStatus = 'draft' | 'publishable-draft' | 'dry-run-needed' | 'validated' | 'coming-soon';

export type BuildprintFile = { path: string; purpose: string; required: boolean };
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
  copyPrompt: string;
  githubUrl: string;
  rawBaseUrl: string;
  featured?: boolean;
  planned?: boolean;
};

export const repoUrl = 'https://github.com/DomEscobar/agent-buildprint';
export const rawRepoBase = 'https://raw.githubusercontent.com/DomEscobar/agent-buildprint/main';
export const siteBase = 'https://agent-buildprint.com';

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

export const buildprints: Buildprint[] = [
  {
    slug: 'ai-influencer-os',
    title: 'AI Influencer OS',
    creator: 'Agent Buildprint',
    category: 'Product OS',
    tier: 'agent-grade',
    status: 'dry-run-needed',
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
    checks: ['OpenClaw shape exists', 'Wavespeed is production image path', 'Tests use mock image mode without external APIs', 'User memory and self-state are separate', 'Publishing is mock/manual-gated by default'],
    githubUrl: `${repoUrl}/tree/main/buildprints/ai-influencer-os`,
    rawBaseUrl: rawFor('ai-influencer-os'),
    copyPrompt: `${localPrompt('ai-influencer-os', 'AI Influencer OS')} Do not auto-publish by default.`,
  },
  {
    slug: 'ai-editorial-os',
    title: 'AI Editorial OS',
    creator: 'Agent Buildprint',
    category: 'Workflow OS',
    tier: 'basic',
    status: 'dry-run-needed',
    runtime: ['Astro/MDX'],
    stack: ['Astro/MDX', 'Research workflow', 'SEO checks', 'Visual posts'],
    iconKeys: ['astro', 'md', 'json'],
    difficulty: 'Medium',
    featured: true,
    summary: 'Editorial workflow that researches ideas, scores them, drafts visual posts, and only publishes after approval and SEO/build checks.',
    promise: 'A workflow Buildprint for a blog/content system that researches and drafts without auto-publishing slop.',
    includes: ['Research scan', 'Idea scoring', 'Draft workflow', 'Source tracking', 'Manual approval', 'SEO/build publish checklist'],
    risks: ['Generic AI content', 'Unsourced claims', 'SEO metadata drift', 'Broken sitemap/RSS', 'Publishing without human approval'],
    files: [{ path: 'BUILDPRINT.md', purpose: canonicalFilePurposes['BUILDPRINT.md'], required: true }],
    checks: ['Sources are attached', 'Post includes workflow/prompt value', 'SEO metadata and build pass', 'Manual approval before publish'],
    githubUrl: `${repoUrl}/tree/main/buildprints/ai-editorial-os`,
    rawBaseUrl: rawFor('ai-editorial-os'),
    copyPrompt: `${localPrompt('ai-editorial-os', 'AI Editorial OS')} Build a content workflow with sources, scoring, approval, and SEO/build checks before publish.`,
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
  return { human: `/buildprints/${bp.slug}/`, agent: `/buildprints/${bp.slug}/agent.md`, manifest: `/buildprints/${bp.slug}/package.json`, prompt: `/buildprints/${bp.slug}/prompt.txt`, files: `/buildprint-files/${bp.slug}/` };
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
    files: bp.files.map((file) => ({ ...file, rawUrl: `${bp.rawBaseUrl}/${file.path}`, siteUrl: `/buildprint-files/${bp.slug}/${file.path}` })),
    instructions: {
      readOrder: ['BUILDPRINT.md', 'SPEC.md', 'PLAN.md', ...bp.files.filter((file) => file.path.startsWith('plans/')).map((file) => file.path), 'CONTRACTS.md', 'DEFAULT_PRESET.md', 'TEST_MATRIX.md', 'VALIDATION_TEMPLATE.md', 'questions.md'].filter((path) => bp.files.some((file) => file.path === path)),
      rule: 'Do not scrape human cards. Use this manifest, agent.md, and raw files.',
    },
  };
}
