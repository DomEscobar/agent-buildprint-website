import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export type BuildprintCategory = 'Framework / Architecture' | 'Product OS' | 'Feature / Extension' | 'Workflow OS' | 'Mapped Project';
export type BuildprintTier = 'basic' | 'strong' | 'agent-grade';
export type BuildprintStatus = 'publishable-draft' | 'dry-run-needed' | 'validated';

export type BuildprintFile = { path: string; purpose: string; required: boolean };
export type BuildprintTrustBadge = { label: string; detail: string; tone?: 'success' | 'info' | 'warning' | 'neutral' };
export type BuildprintPublicStatus = { label: string; explanation: string };
export type BuildprintVisualRun = {
  image?: string;
  demoUrl?: string;
  alt: string;
  caption?: string;
  status?: string;
};
export type BuildprintPublication = {
  schema: 'agent-buildprint/publication.v1';
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
  featured?: boolean;
  summary: string;
  promise: string;
  includes: string[];
  risks: string[];
  checks: string[];
  trustBadges?: BuildprintTrustBadge[];
  publicStatus?: BuildprintPublicStatus;
  updatedAt?: string;
  visualRun?: BuildprintVisualRun;
  proofUrl?: string;
  plainDescription?: string;
  whatYouGet?: string[];
  whatYouNeed?: string[];
  architectureFlow?: string[];
  howToUse?: Array<{ title: string; detail: string }>;
  resultChecklist?: string[];
  copyPrompt?: string;
  originGithubUrl?: string;
  originLabel?: string;
  publish?: boolean;
  fileExcludes?: string[];
};
export type Buildprint = Omit<BuildprintPublication, 'schema' | 'publish' | 'fileExcludes' | 'copyPrompt'> & {
  files: BuildprintFile[];
  githubUrl: string;
  rawBaseUrl: string;
  copyPrompt: string;
};

export const repoUrl = 'https://github.com/DomEscobar/agent-buildprint';
export const siteBase = import.meta.env.PUBLIC_SITE_BASE || 'https://agent-buildprint.com';
const publicationSchema = 'agent-buildprint/publication.v1';
const defaultLocalBuildprintsRoot = [
  path.resolve(process.cwd(), '../agent-buildprint/buildprints'),
  '/root/blueprint/buildprints',
].find((candidate) => fs.existsSync(candidate)) ?? path.resolve(process.cwd(), '../agent-buildprint/buildprints');
const buildprintsRoot = process.env.BUILDPRINTS_SOURCE || defaultLocalBuildprintsRoot;
const rawSourceRoot = process.env.BUILDPRINTS_RAW_SOURCE || 'https://raw.githubusercontent.com/DomEscobar/agent-buildprint/main/buildprints';
const githubApiRoot = process.env.BUILDPRINTS_GITHUB_API || 'https://api.github.com/repos/DomEscobar/agent-buildprint/git/trees/main?recursive=1';
const githubCommitsApiRoot = process.env.BUILDPRINTS_GITHUB_COMMITS_API || 'https://api.github.com/repos/DomEscobar/agent-buildprint/commits';

export const canonicalFilePurposes: Record<string, string> = {
  'BUILDPRINT.md': 'compatibility bootstrap or package contract',
  'README.md': 'human overview, non-authoritative',
  'SPEC.md': 'behavior requirements, when present',
  'PLAN.md': 'execution index, when present',
  'CONTRACTS.md': 'interface/data contracts, when present',
  'START_HERE.md': 'executable packet start router',
  'PRE_IMPLEMENTATION_QUESTIONS.md': 'pre-coding question gate and safe defaults',
  'blueprint.yaml': 'machine-readable executable packet router',
  '02-context/context-map.yaml': 'active context and capability routing',
  '02-context/team-stack.yaml': 'team-pack routing and quality gates',
  '02-context/ux-contract.md': 'UX workflow and interaction contract',
  '02-context/design-quality-bar.md': 'visual quality and browser proof gate',
  '03-capabilities/capability-index.yaml': 'capability dependency and status index',
  '08-evaluation/acceptance.yaml': 'planned acceptance proof gates',
  '09-evidence/evidence-ledger.jsonl': 'proof and blocker evidence ledger seed',
  'TEST_MATRIX.md': 'risk-to-test alignment, when present',
  'VALIDATION_TEMPLATE.md': 'completion report template, when present',
  'checks/acceptance.md': 'acceptance checklist',
  'questions.md': 'configuration interview',
};

function normalizePath(file: string) {
  return file.replaceAll('\\', '/');
}

function filePurpose(file: string) {
  if (canonicalFilePurposes[file]) return canonicalFilePurposes[file];
  if (file.startsWith('03-capabilities/')) return 'executable capability packet file';
  if (file.startsWith('capabilities/')) return 'capability pack execution file';
  if (file.startsWith('plans/')) return 'phase rail';
  if (file.startsWith('proof/')) return 'offline proof artifact';
  if (file.startsWith('conformance/')) return 'target-app conformance artifact';
  if (file.startsWith('evals/')) return 'evaluation harness artifact';
  if (file.startsWith('schemas/')) return 'schema artifact';
  if (file.startsWith('policies/')) return 'policy artifact';
  if (file.endsWith('.yaml') || file.endsWith('.json')) return 'machine-readable mirror';
  return 'Buildprint package file';
}

function isOptional(file: string) {
  return file.startsWith('schemas/') || file.startsWith('policies/');
}

function localBuildprintSlugs() {
  if (!fs.existsSync(buildprintsRoot)) return null;
  return fs.readdirSync(buildprintsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(buildprintsRoot, entry.name, 'BUILDPRINT.md')))
    .map((entry) => entry.name)
    .sort();
}

function localTrackedFiles(slug: string) {
  const root = path.resolve(buildprintsRoot, '..');
  try {
    const prefix = `buildprints/${slug}/`;
    const output = execFileSync('git', ['-C', root, 'ls-files', '--cached', '--others', '--exclude-standard', prefix], { encoding: 'utf8' }).trim();
    if (output) return output.split(/\r?\n/)
      .map((file) => file.slice(prefix.length))
      .filter(Boolean)
      .filter((file) => fs.existsSync(path.join(buildprintsRoot, slug, file)))
      .sort((a, b) => a.localeCompare(b));
  } catch {
    // Fall back to filesystem walk outside Git checkouts.
  }

  const dir = path.join(buildprintsRoot, slug);
  const files: string[] = [];
  const walk = (current: string, base = dir) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (['.git', 'node_modules', 'dist'].includes(entry.name)) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full, base);
      else if (entry.isFile()) files.push(normalizePath(path.relative(base, full)));
    }
  };
  walk(dir);
  return files.sort((a, b) => a.localeCompare(b));
}

function localUpdatedAt(slug: string) {
  if (!fs.existsSync(buildprintsRoot)) return undefined;
  const root = path.resolve(buildprintsRoot, '..');
  try {
    const output = execFileSync('git', ['-C', root, 'log', '-1', '--format=%cI', '--', `buildprints/${slug}`], { encoding: 'utf8' }).trim();
    return output || undefined;
  } catch {
    return undefined;
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return response.json() as Promise<T>;
}

async function githubTreeFiles() {
  const data = await fetchJson<{ tree: Array<{ path: string; type: string }> }>(githubApiRoot);
  return data.tree.filter((entry) => entry.type === 'blob').map((entry) => entry.path);
}

async function githubUpdatedAt(slug: string) {
  const url = `${githubCommitsApiRoot}?path=${encodeURIComponent(`buildprints/${slug}`)}&per_page=1`;
  const commits = await fetchJson<Array<{ commit?: { committer?: { date?: string } } }>>(url);
  return commits[0]?.commit?.committer?.date;
}


async function fetchOptionalJson<T>(url: string): Promise<T | null> {
  const response = await fetch(url);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return response.json() as Promise<T>;
}

async function fetchOptionalText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) return '';
  return response.text();
}

function localText(slug: string, file: string) {
  const localPath = path.join(buildprintsRoot, slug, normalizePath(file));
  return fs.existsSync(localPath) ? fs.readFileSync(localPath, 'utf8') : '';
}

function stripMarkdownInline(text: string) {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[*_#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstHeading(text: string) {
  const heading = text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? '';
  return stripMarkdownInline(heading.replace(/^BUILDPRINT:\s*/i, ''));
}

function firstParagraph(text: string) {
  return stripMarkdownInline(text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith('#') && !block.startsWith('```')) ?? '');
}

function yamlScalar(text: string, key: string) {
  const match = text.match(new RegExp(`^${key}:\\s*(.+)$`, 'mi'));
  return match?.[1]?.trim().replace(/^['\"]|['\"]$/g, '');
}

function yamlBlockScalars(text: string, key: string) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => new RegExp(`^${key}:\\s*$`, 'i').test(line));
  if (start < 0) return [];
  const values: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (/^\S/.test(line)) break;
    const item = line.match(/^\s+-\s+(.+)$/)?.[1]?.trim();
    if (item) values.push(item.replace(/^['\"]|['\"]$/g, ''));
  }
  return values;
}

function originFromBlueprint(blueprint: string) {
  return yamlScalar(blueprint, 'originGithubUrl')
    ?? yamlScalar(blueprint, 'origin_github_url')
    ?? yamlScalar(blueprint, 'source_github_url')
    ?? yamlScalar(blueprint, 'github_url')
    ?? blueprint.match(/https:\/\/github\.com\/[^\s)\]"']+/)?.[0]?.replace(/[.,;]+$/, '');
}

function labelFromGithub(url?: string) {
  const match = url?.match(/github\.com\/([^/]+\/[^/#?]+)/);
  return match?.[1]?.replace(/\.git$/, '');
}

function hasFile(files: string[], file: string) {
  return files.includes(file);
}

function firstPhaseFile(files: string[]) {
  return files.find((file) => /^03-phases\/\d{2}-.+\.md$/.test(file));
}

function packetShape(files: string[]) {
  const isCapabilityPacket = hasFile(files, 'START_HERE.md') && hasFile(files, 'blueprint.yaml');
  const isExecutableBlueprint = hasFile(files, '01-questions.md') && hasFile(files, '02-project-setup.md') && hasFile(files, 'blueprint.yaml') && hasFile(files, '03-phases/phase-index.yaml');
  const firstPhase = firstPhaseFile(files);
  const readOrder = (isCapabilityPacket
    ? ['BUILDPRINT.md', 'START_HERE.md', 'blueprint.yaml', '02-context/context-map.yaml', 'PRE_IMPLEMENTATION_QUESTIONS.md', '02-context/team-stack.yaml', '02-context/ux-contract.md', '02-context/design-quality-bar.md']
    : isExecutableBlueprint
      ? ['BUILDPRINT.md', '01-questions.md', '02-project-setup.md', 'blueprint.yaml', '03-phases/phase-index.yaml', firstPhase, '04-review.md', '05-handover.md'].filter((file): file is string => Boolean(file))
      : ['BUILDPRINT.md']).filter((file) => hasFile(files, file));
  const canonicalStart = isCapabilityPacket ? 'START_HERE.md' : 'BUILDPRINT.md';
  const instructionRule = isCapabilityPacket
    ? 'Do not scrape human cards. Use this manifest, agent.md, and raw files. BUILDPRINT.md is the compatibility bootstrap, then START_HERE.md and blueprint.yaml route the executable packet. Load only the active capability packet named by the router/context map; do not read unrelated capability packets upfront.'
    : isExecutableBlueprint
      ? 'Do not scrape human cards. Use this manifest, agent.md, and raw files. BUILDPRINT.md is the canonical execution authority. Complete 01-questions.md and 02-project-setup.md before phase work; blueprint.yaml and other structured files are machine-readable mirrors/routers, not competing instructions.'
      : 'Do not scrape human cards. Use this manifest, agent.md, and raw files. BUILDPRINT.md is the canonical start file and owns the required read order, phase gates, and acceptance gates. Structured control files are machine-readable mirrors only.';
  return { isCapabilityPacket, isExecutableBlueprint, canonicalStart, readOrder, instructionRule };
}

function uniformAgentPrompt(bp: Pick<Buildprint, 'slug' | 'title' | 'files'>) {
  const urls = {
    agent: `${siteBase}/buildprints/${bp.slug}/agent.md`,
    manifest: `${siteBase}/buildprints/${bp.slug}/package.json`,
  };
  const shape = packetShape(bp.files.map((file) => file.path));
  const formattedReadOrder = shape.readOrder.map((file) => `\`${file}\``).join(' -> ');
  return `Use the Agent Buildprint at ${urls.agent}.

Fetch ${urls.manifest}.
Read order: ${formattedReadOrder}.
${shape.instructionRule}
Follow alignment/question rules before implementation.
Do not scrape human UI cards.

First bootstrap exact snapshots: agb start ${urls.manifest} .
If agb is not installed, clone https://github.com/DomEscobar/agent-buildprint and run node agent-buildprint/bin/agb.js start ${urls.manifest} .
Then read .buildprint/next-agent.md and continue. Do not write Buildprint snapshots manually.

If the Buildprint requires it, finish with a chat handover summarizing outcome, evidence, known gaps, and recommended next direction.`;
}

async function loadPublication(slug: string): Promise<Partial<BuildprintPublication> | null> {
  const localPath = path.join(buildprintsRoot, slug, 'publication.json');
  if (fs.existsSync(localPath)) return JSON.parse(fs.readFileSync(localPath, 'utf8'));
  return fetchOptionalJson<BuildprintPublication>(`${rawSourceRoot}/${slug}/publication.json`);
}

type SourceRecord = {
  slug: string;
  publication: Partial<BuildprintPublication> | null;
  files: string[];
  readme: string;
  buildprint: string;
  blueprint: string;
};

async function loadSourceRecords(): Promise<SourceRecord[]> {
  const localSlugs = localBuildprintSlugs();
  if (localSlugs) {
    return Promise.all(localSlugs.map(async (slug) => ({
      slug,
      publication: await loadPublication(slug),
      files: localTrackedFiles(slug),
      readme: localText(slug, 'README.md'),
      buildprint: localText(slug, 'BUILDPRINT.md'),
      blueprint: localText(slug, 'blueprint.yaml'),
    })));
  }

  const treeFiles = await githubTreeFiles();
  const slugs = [...new Set(treeFiles
    .map((file) => file.match(/^buildprints\/([^/]+)\/BUILDPRINT\.md$/)?.[1])
    .filter(Boolean) as string[])]
    .sort();
  return Promise.all(slugs.map(async (slug) => ({
    slug,
    publication: await loadPublication(slug),
    files: treeFiles
      .filter((file) => file.startsWith(`buildprints/${slug}/`))
      .map((file) => file.slice(`buildprints/${slug}/`.length))
      .sort((a, b) => a.localeCompare(b)),
    readme: await fetchOptionalText(`${rawSourceRoot}/${slug}/README.md`),
    buildprint: await fetchOptionalText(`${rawSourceRoot}/${slug}/BUILDPRINT.md`),
    blueprint: await fetchOptionalText(`${rawSourceRoot}/${slug}/blueprint.yaml`),
  })));
}

function normalizePublication(record: SourceRecord): Buildprint | null {
  const publication = record.publication ?? {};
  if (publication.publish === false) return null;
  if (publication.schema && publication.schema !== publicationSchema) throw new Error(`${record.slug}: invalid publication schema ${publication.schema}`);
  const excludes = new Set((publication.fileExcludes ?? []).map(normalizePath));
  const fileList = record.files.map(normalizePath).filter((file) => !excludes.has(file));
  const files = fileList.map((file) => ({ path: file, purpose: filePurpose(file), required: !isOptional(file) }));
  const title = publication.title || firstHeading(record.readme) || firstHeading(record.buildprint) || record.slug.split('-').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ');
  const originGithubUrl = publication.originGithubUrl ?? originFromBlueprint(record.blueprint);
  const summary = publication.summary || firstParagraph(record.readme) || firstParagraph(record.buildprint) || `${title} Agent Buildprint.`;
  const runtime = publication.runtime?.length ? publication.runtime : (yamlBlockScalars(record.blueprint, 'runtime').length ? yamlBlockScalars(record.blueprint, 'runtime') : ['Executable Buildprint packet']);
  const stack = publication.stack?.length ? publication.stack : (yamlBlockScalars(record.blueprint, 'stack').length ? yamlBlockScalars(record.blueprint, 'stack') : ['BUILDPRINT.md', 'blueprint.yaml', 'raw package files'].filter((file) => fileList.includes(file)));
  const category = publication.category ?? (originGithubUrl ? 'Mapped Project' : yamlScalar(record.blueprint, 'primary') === 'product' ? 'Product OS' : 'Framework / Architecture');
  const normalized: Buildprint = {
    slug: publication.slug ?? record.slug,
    title,
    creator: publication.creator ?? 'Agent Buildprint',
    category: category as BuildprintCategory,
    tier: publication.tier ?? 'agent-grade',
    status: publication.status ?? 'validated',
    runtime,
    stack,
    iconKeys: publication.iconKeys,
    difficulty: publication.difficulty ?? 'Advanced',
    featured: publication.featured,
    summary,
    promise: publication.promise ?? summary,
    includes: publication.includes ?? fileList.filter((file) => ['README.md', 'BUILDPRINT.md', '01-questions.md', '02-project-setup.md', 'blueprint.yaml', '04-review.md', '05-handover.md'].includes(file) || file.startsWith('03-phases/')).slice(0, 14),
    risks: publication.risks ?? ['Dead controls or placeholder UX presented as complete', 'Provider/runtime blockers hidden behind canned output', 'Source scope silently narrowed during implementation'],
    checks: publication.checks ?? ['Bootstrap exact snapshots with agb start', 'Run packet/build/test checks required by the Buildprint', 'Inspect the implemented product path directly', 'Finish with honest blocker/evidence handover'],
    trustBadges: publication.trustBadges,
    publicStatus: publication.publicStatus,
    updatedAt: publication.updatedAt ?? localUpdatedAt(record.slug),
    visualRun: publication.visualRun,
    proofUrl: publication.proofUrl,
    plainDescription: publication.plainDescription || summary,
    whatYouGet: publication.whatYouGet,
    whatYouNeed: publication.whatYouNeed,
    architectureFlow: publication.architectureFlow,
    howToUse: publication.howToUse,
    resultChecklist: publication.resultChecklist,
    originGithubUrl,
    originLabel: publication.originLabel ?? labelFromGithub(originGithubUrl),
    files,
    githubUrl: `${repoUrl}/tree/main/buildprints/${record.slug}`,
    rawBaseUrl: `${siteBase}/buildprints/${record.slug}/files`,
    copyPrompt: '',
  };
  normalized.copyPrompt = uniformAgentPrompt(normalized);
  return normalized;
}

export const buildprints = (await loadSourceRecords())
  .map(normalizePublication)
  .filter((item): item is Buildprint => Boolean(item))
  .sort((a, b) => a.slug.localeCompare(b.slug));

export function implementationEstimate(bp: Pick<Buildprint, 'tier' | 'category' | 'difficulty' | 'files' | 'checks'>) {
  let minutes = bp.tier === 'basic' ? 15 : bp.tier === 'strong' ? 25 : 35;
  if (bp.category === 'Product OS' || bp.category === 'Mapped Project') minutes += 5;
  if (bp.category === 'Workflow OS') minutes += 5;
  if (bp.category === 'Feature / Extension') minutes -= 5;
  if (bp.difficulty === 'Advanced') minutes += 5;
  const low = Math.max(15, Math.round((minutes - 10) / 15) * 15);
  const high = Math.max(30, Math.round((minutes + 10) / 15) * 15);
  return `${low}-${high} min`;
}

export const categories = ['All', 'Framework / Architecture', 'Product OS', 'Feature / Extension', 'Workflow OS', 'Mapped Project'] as const;
export const tiers = ['All', 'basic', 'strong', 'agent-grade'] as const;
export const getBuildprint = (slug: string) => buildprints.find((item) => item.slug === slug);
export const liveBuildprints = buildprints;

export async function buildprintFileText(slug: string, filePath: string) {
  const localPath = path.join(buildprintsRoot, slug, normalizePath(filePath));
  if (fs.existsSync(localPath)) return fs.readFileSync(localPath, 'utf8');
  const response = await fetch(`${rawSourceRoot}/${slug}/${normalizePath(filePath)}`);
  if (!response.ok) return '';
  return response.text();
}

export function buildprintUrls(bp: Buildprint) {
  return {
    human: `/buildprints/${bp.slug}/`,
    agent: `/buildprints/${bp.slug}/agent.md`,
    manifest: `/buildprints/${bp.slug}/package.json`,
    prompt: `/buildprints/${bp.slug}/prompt.txt`,
    files: bp.rawBaseUrl,
  };
}

export function packageManifest(bp: Buildprint) {
  const urls = buildprintUrls(bp);
  const { canonicalStart, readOrder, instructionRule } = packetShape(bp.files.map((item) => item.path));
  return {
    schema: `${siteBase}/schemas/buildprint-package.v1.json`,
    slug: bp.slug,
    title: bp.title,
    category: bp.category,
    tier: bp.tier,
    status: bp.status,
    publicStatus: bp.publicStatus,
    updatedAt: bp.updatedAt,
    visualRun: bp.visualRun,
    proofUrl: bp.proofUrl,
    runtime: bp.runtime,
    stack: bp.stack,
    canonicalStart,
    readOrder,
    entrypoints: {
      human: urls.human,
      agent: urls.agent,
      manifest: urls.manifest,
      prompt: urls.prompt,
      github: bp.githubUrl,
      originGithub: bp.originGithubUrl,
      proof: bp.proofUrl,
      visualDemo: bp.visualRun?.demoUrl,
      rawBase: bp.rawBaseUrl,
    },
    bootstrap: {
      command: `agb start ${siteBase}/buildprints/${bp.slug}/package.json`,
      fallbackCommand: `git clone https://github.com/DomEscobar/agent-buildprint && node agent-buildprint/bin/agb.js start ${siteBase}/buildprints/${bp.slug}/package.json`,
      stateDir: '.buildprint',
      snapshotMode: 'download_exact',
      rule: 'Do not write, summarize, or regenerate snapshot files manually. Use agb start to download exact files from this manifest.',
    },
    files: bp.files.map((file) => ({ ...file, rawUrl: `${bp.rawBaseUrl}/${file.path}` })),
    instructions: {
      canonicalStart,
      readOrder,
      rule: instructionRule,
    },
  };
}
