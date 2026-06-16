import { buildprints, buildprintUrls } from '@/lib/buildprints';
import { useCaseType } from '@/lib/registry';

export function GET() {
  const lines = [
    '# Agent Buildprint',
    '',
    'Agent Buildprint is an agent-readable registry of executable work packets for coding agents.',
    '',
    'Use this site as an agent by fetching machine-readable endpoints, not scraping UI cards.',
    '',
    '## Primary endpoints',
    '',
    '- Registry JSON: /buildprints/index.json',
    '- Buildprint agent guide: /buildprints/{slug}/agent.md',
    '- Buildprint package manifest: /buildprints/{slug}/package.json',
    '- Copyable prompt: /buildprints/{slug}/prompt.txt',
    '- Static raw files: use each manifest file rawUrl',
    '',
    '## Buildprint types',
    '',
    '- Products',
    '- Integrations',
    '',
    '## Package tiers',
    '',
    '- basic: compact package with a canonical start file and checks',
    '- strong: adds structured contracts, execution/evaluation rails, or proof artifacts',
    '- agent-grade: executable packet with router/read-order, capability packets, evaluation gates, and evidence/blocker ledger where applicable',
    '',
    '## Available Buildprints',
    '',
    ...buildprints.flatMap((bp) => {
      const urls = buildprintUrls(bp);
      return [
        `### ${bp.title}`,
        `- slug: ${bp.slug}`,
        `- type: ${useCaseType(bp)}`,
        `- tier: ${bp.tier}`,
        `- status: ${bp.status}`,
        `- agent: ${urls.agent}`,
        `- manifest: ${urls.manifest}`,
        `- prompt: ${urls.prompt}`,
        '',
      ];
    }),
  ];

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
