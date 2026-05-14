import { buildprints, buildprintUrls } from '@/lib/buildprints';

export function GET() {
  const lines = [
    '# Agent Buildprint',
    '',
    'Agent Buildprint is an agent-readable registry of software construction plans.',
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
    '- Framework / Architecture',
    '- Product OS',
    '- Feature / Extension',
    '- Workflow OS',
    '- Mapped Project',
    '',
    '## Package tiers',
    '',
    '- basic: BUILDPRINT.md plus checks',
    '- strong: adds SPEC.md, PLAN.md, CONTRACTS.md',
    '- agent-grade: adds plans/*.md, TEST_MATRIX.md, VALIDATION_TEMPLATE.md and stronger alignment rails',
    '',
    '## Available Buildprints',
    '',
    ...buildprints.flatMap((bp) => {
      const urls = buildprintUrls(bp);
      return [
        `### ${bp.title}`,
        `- slug: ${bp.slug}`,
        `- category: ${bp.category}`,
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
