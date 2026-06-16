import { buildprintFileText, packageManifest } from '@/lib/buildprints';
import type { buildprints } from '@/lib/buildprints';

type Buildprint = typeof buildprints[number];
export type BuildprintType = 'Products' | 'Integrations';

export const updatedDate = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' });

export const updatedLabel = (value?: string) => {
  if (!value) return 'Source synced';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Source synced' : updatedDate.format(date);
};

export const sourceParts = (href: string) => {
  const match = href.match(/github\.com\/([^/]+\/[^/]+)(?:\/tree\/([^/]+)\/(.+))?/);
  return {
    repo: match?.[1] ?? 'DomEscobar/agent-buildprint',
    branch: match?.[2] ?? 'main',
    sourcePath: match?.[3] ?? '',
  };
};

export const compactNumber = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

export const contextTier = (tokens: number) => tokens < 20000 ? 'Small context' : tokens < 80000 ? 'Medium context' : tokens < 200000 ? 'Large context' : 'Huge context';

export const contextSort = (label: string) => ['Small context', 'Medium context', 'Large context', 'Huge context'].indexOf(label);

export const useCaseType = (bp: Buildprint): BuildprintType => {
  const text = `${bp.slug} ${bp.title} ${bp.summary} ${bp.category} ${bp.runtime.join(' ')} ${bp.stack.join(' ')}`.toLowerCase();
  if (bp.category === 'Product OS' || bp.category === 'Mapped Project') return 'Products';
  if (bp.category === 'Feature / Extension') return 'Integrations';
  if (bp.files.some((file) => ['capability.yaml', 'apply.md', 'verify.md', 'compatibility.md'].includes(file.path))) return 'Integrations';
  if (text.includes('product') || text.includes('app') || text.includes('studio')) return 'Products';
  return 'Integrations';
};

export const signalFor = (bp: Buildprint, bootstrapReady: boolean, hasRuns: boolean) => {
  const names = new Set(bp.files.map((file) => file.path.toLowerCase()));
  const text = `${bp.slug} ${bp.title} ${bp.summary} ${bp.runtime.join(' ')} ${bp.stack.join(' ')}`.toLowerCase();
  const signals = new Set<string>();
  if (bootstrapReady) signals.add('Buildprint-ready');
  if (hasRuns || names.has('package.json') || names.has('buildprint.json')) signals.add('Runnable');
  if (names.has('license') || names.has('license.md') || names.has('license.txt')) signals.add('Has license');
  if (text.includes('agent') || text.includes('openclaw') || text.includes('codex') || text.includes('mcp') || names.has('agents.md') || names.has('claude.md')) signals.add('Agent workflow');
  if (bp.updatedAt && Date.now() - new Date(bp.updatedAt).getTime() < 45 * 24 * 60 * 60 * 1000) signals.add('Recently updated');
  return [...signals];
};

export const contextEstimateFor = async (bp: Buildprint) => {
  const files = await Promise.all(bp.files.map(async (file) => buildprintFileText(bp.slug, file.path)));
  const fileChars = files.reduce((sum, text) => sum + text.length, 0);
  const manifestChars = JSON.stringify(packageManifest(bp)).length;
  const bootstrapChars = bp.copyPrompt.length + manifestChars;
  const estimatedTokens = Math.ceil((fileChars + bootstrapChars) / 4) + 1500;
  const tier = contextTier(estimatedTokens);
  return {
    fileChars,
    estimatedTokens,
    tier,
    label: `~${compactNumber.format(estimatedTokens)} tokens`,
  };
};

export const countBy = (values: string[]) => [...new Map([...new Set(values)].map((value) => [value, values.filter((item) => item === value).length])).entries()];

export const buildRegistryModel = async (items: readonly Buildprint[]) => {
  const cards = await Promise.all(items.map(async (bp) => {
    const source = sourceParts(bp.githubUrl);
    const entrypoint = bp.files.find((file) => file.path === 'BUILDPRINT.md')?.path ?? bp.files[0]?.path ?? 'BUILDPRINT.md';
    const hasRuns = Boolean(bp.proofUrl || bp.visualRun?.demoUrl);
    const bootstrapReady = bp.files.some((file) => file.path === entrypoint) && Boolean(bp.copyPrompt);
    const context = await contextEstimateFor(bp);
    const type = useCaseType(bp);
    const trust = 'Official';
    const signals = signalFor(bp, bootstrapReady, hasRuns);
    return { bp, source, entrypoint, hasRuns, bootstrapReady, context, type, trust, signals };
  }));
  const recentCards = [...cards].sort((a, b) => new Date(b.bp.updatedAt ?? 0).getTime() - new Date(a.bp.updatedAt ?? 0).getTime());
  const sourceCount = new Set(cards.map((card) => card.source.repo)).size;
  const runnableCount = cards.filter((card) => card.bootstrapReady).length;
  const trustCounts = countBy(cards.map((card) => card.trust));
  const typeCounts = countBy(cards.map((card) => card.type));
  const contextCounts = countBy(cards.map((card) => card.context.tier)).sort((a, b) => contextSort(a[0]) - contextSort(b[0]));
  const signalCounts = countBy(cards.flatMap((card) => card.signals)).filter(([, count]) => count > 0);
  return { cards, recentCards, sourceCount, runnableCount, trustCounts, typeCounts, contextCounts, signalCounts };
};

export type RegistryModel = Awaited<ReturnType<typeof buildRegistryModel>>;
export type RegistryCard = RegistryModel['cards'][number];
