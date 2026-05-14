import { buildprints, buildprintUrls } from '@/lib/buildprints';

export function GET() {
  return new Response(JSON.stringify({
    schema: 'https://agent-buildprint.com/schemas/registry-index.v1.json',
    generatedAt: new Date().toISOString(),
    agentUse: {
      llms: '/llms.txt',
      rule: 'Agents should use JSON, agent.md, package manifests, and raw files instead of scraping human UI cards.',
    },
    buildprints: buildprints.map((bp) => ({
      slug: bp.slug,
      title: bp.title,
      summary: bp.summary,
      category: bp.category,
      tier: bp.tier,
      status: bp.status,
      runtime: bp.runtime,
      stack: bp.stack,
      difficulty: bp.difficulty,
      files: bp.files.map((file) => file.path),
      urls: buildprintUrls(bp),
      githubUrl: bp.githubUrl,
      rawBaseUrl: bp.rawBaseUrl,
    })),
  }, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
