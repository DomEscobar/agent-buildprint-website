import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export type BuildprintCategory = 'Framework / Architecture' | 'Product OS' | 'Feature / Extension' | 'Workflow OS' | 'Mapped Project';
export type BuildprintTier = 'basic' | 'strong' | 'agent-grade';
export type BuildprintStatus = 'publishable-draft' | 'dry-run-needed' | 'validated';

export type BuildprintFile = { path: string; purpose: string; required: boolean };
export type BuildprintTrustBadge = { label: string; detail: string; tone?: 'success' | 'info' | 'warning' | 'neutral' };
export type BuildprintPublicStatus = { label: string; explanation: string };
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
  plainDescription?: string;
  whatYouGet?: string[];
  whatYouNeed?: string[];
  architectureFlow?: string[];
  howToUse?: Array<{ title: string; detail: string }>;
  resultChecklist?: string[];
  copyPrompt: string;
  originGithubUrl?: string;
  originLabel?: string;
  publish?: boolean;
  fileExcludes?: string[];
};
export type Buildprint = Omit<BuildprintPublication, 'schema' | 'publish' | 'fileExcludes'> & {
  files: BuildprintFile[];
  githubUrl: string;
  rawBaseUrl: string;
};

export const repoUrl = 'https://github.com/DomEscobar/agent-buildprint';
export const siteBase = import.meta.env.PUBLIC_SITE_BASE || 'https://agent-buildprint.com';
const publicationSchema = 'agent-buildprint/publication.v1';
const buildprintsRoot = process.env.BUILDPRINTS_SOURCE || path.resolve(process.cwd(), '../agent-buildprint/buildprints');
const rawSourceRoot = process.env.BUILDPRINTS_RAW_SOURCE || 'https://raw.githubusercontent.com/DomEscobar/agent-buildprint/main/buildprints';
const githubApiRoot = process.env.BUILDPRINTS_GITHUB_API || 'https://api.github.com/repos/DomEscobar/agent-buildprint/git/trees/main?recursive=1';

export const canonicalFilePurposes: Record<string, string> = {
  'BUILDPRINT.md': 'compatibility bootstrap or package contract',
  'README.md': 'human overview, non-authoritative',
  'SPEC.md': 'legacy behavior requirements, when present',
  'PLAN.md': 'legacy execution index, when present',
  'CONTRACTS.md': 'legacy interface/data contracts, when present',
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
  'TEST_MATRIX.md': 'legacy risk-to-test alignment, when present',
  'VALIDATION_TEMPLATE.md': 'legacy completion report template, when present',
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

function localPublicationFiles() {
  if (!fs.existsSync(buildprintsRoot)) return null;
  return fs.readdirSync(buildprintsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(buildprintsRoot, entry.name, 'publication.json')))
    .map((entry) => entry.name)
    .sort();
}

function localTrackedFiles(slug: string) {
  const root = path.resolve(buildprintsRoot, '..');
  try {
    const prefix = `buildprints/${slug}/`;
    const output = execFileSync('git', ['-C', root, 'ls-files', '--cached', '--others', '--exclude-standard', prefix], { encoding: 'utf8' }).trim();
    if (output) return output.split(/\r?\n/).map((file) => file.slice(prefix.length)).filter(Boolean).sort((a, b) => a.localeCompare(b));
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

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return response.json() as Promise<T>;
}

async function githubTreeFiles() {
  const data = await fetchJson<{ tree: Array<{ path: string; type: string }> }>(githubApiRoot);
  return data.tree.filter((entry) => entry.type === 'blob').map((entry) => entry.path);
}

async function loadPublication(slug: string): Promise<BuildprintPublication> {
  const localPath = path.join(buildprintsRoot, slug, 'publication.json');
  if (fs.existsSync(localPath)) return JSON.parse(fs.readFileSync(localPath, 'utf8'));
  return fetchJson<BuildprintPublication>(`${rawSourceRoot}/${slug}/publication.json`);
}

async function loadSourceRecords() {
  const localSlugs = localPublicationFiles();
  if (localSlugs) {
    return Promise.all(localSlugs.map(async (slug) => ({
      publication: await loadPublication(slug),
      files: localTrackedFiles(slug),
    })));
  }

  const treeFiles = await githubTreeFiles();
  const slugs = [...new Set(treeFiles
    .map((file) => file.match(/^buildprints\/([^/]+)\/publication\.json$/)?.[1])
    .filter(Boolean) as string[])]
    .sort();
  return Promise.all(slugs.map(async (slug) => ({
    publication: await loadPublication(slug),
    files: treeFiles
      .filter((file) => file.startsWith(`buildprints/${slug}/`))
      .map((file) => file.slice(`buildprints/${slug}/`.length))
      .sort((a, b) => a.localeCompare(b)),
  })));
}

function normalizePublication(record: { publication: BuildprintPublication; files: string[] }): Buildprint | null {
  const publication = record.publication;
  if (publication.publish === false) return null;
  if (publication.schema !== publicationSchema) throw new Error(`${publication.slug}: invalid publication schema ${publication.schema}`);
  const excludes = new Set((publication.fileExcludes ?? []).map(normalizePath));
  const files = record.files
    .map(normalizePath)
    .filter((file) => !excludes.has(file))
    .map((file) => ({ path: file, purpose: filePurpose(file), required: !isOptional(file) }));
  return {
    ...publication,
    files,
    githubUrl: `${repoUrl}/tree/main/buildprints/${publication.slug}`,
    rawBaseUrl: `${siteBase}/buildprints/${publication.slug}/files`,
  };
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
  const hasFile = (file: string) => bp.files.some((item) => item.path === file);
  const isCapabilityPacket = hasFile('START_HERE.md') && hasFile('blueprint.yaml');
  const isExecutableBlueprint = hasFile('01-questions.md') && hasFile('02-project-setup.md') && hasFile('blueprint.yaml') && hasFile('03-phases/phase-index.yaml');
  const firstPhase = bp.files.map((item) => item.path).find((file) => /^03-phases\/\d{2}-.+\.md$/.test(file));
  const readOrder = (isCapabilityPacket
    ? ['BUILDPRINT.md', 'START_HERE.md', 'blueprint.yaml', '02-context/context-map.yaml', 'PRE_IMPLEMENTATION_QUESTIONS.md', '02-context/team-stack.yaml', '02-context/ux-contract.md', '02-context/design-quality-bar.md']
    : isExecutableBlueprint
      ? ['BUILDPRINT.md', '01-questions.md', '02-project-setup.md', 'blueprint.yaml', '03-phases/phase-index.yaml', firstPhase, '04-evaluation.md', '05-evidence/evidence-ledger.jsonl'].filter((file): file is string => Boolean(file))
      : ['BUILDPRINT.md']).filter(hasFile);
  const canonicalStart = isCapabilityPacket ? 'START_HERE.md' : 'BUILDPRINT.md';
  const instructionRule = isCapabilityPacket
    ? 'Do not scrape human cards. Use this manifest, agent.md, and raw files. BUILDPRINT.md is the compatibility bootstrap, then START_HERE.md and blueprint.yaml route the executable packet. Load only the active capability packet named by the router/context map; do not read unrelated capability packets upfront.'
    : isExecutableBlueprint
      ? 'Do not scrape human cards. Use this manifest, agent.md, and raw files. BUILDPRINT.md is the canonical execution authority. Complete 01-questions.md and 02-project-setup.md before phase work; blueprint.yaml and other structured files are machine-readable mirrors/routers, not competing instructions.'
      : 'Do not scrape human cards. Use this manifest, agent.md, and raw files. BUILDPRINT.md is the canonical start file and owns the required read order, phase gates, and acceptance gates. Structured control files are machine-readable mirrors only.';
  return {
    schema: `${siteBase}/schemas/buildprint-package.v1.json`,
    slug: bp.slug,
    title: bp.title,
    category: bp.category,
    tier: bp.tier,
    status: bp.status,
    publicStatus: bp.publicStatus,
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
