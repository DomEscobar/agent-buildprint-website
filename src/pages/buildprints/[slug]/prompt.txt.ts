import { buildprints, getBuildprint, buildprintUrls } from '@/lib/buildprints';

export function getStaticPaths() {
  return buildprints.map((bp) => ({ params: { slug: bp.slug } }));
}

export function GET({ params }: { params: { slug: string } }) {
  const bp = getBuildprint(params.slug);
  if (!bp) return new Response('not found\n', { status: 404 });
  const urls = buildprintUrls(bp);
  const prompt = `Use the Agent Buildprint at ${urls.agent}.

Fetch ${urls.manifest}.
Read \`BUILDPRINT.md\` first; it is the canonical authority and owns the required read order, phase gates, and acceptance gates.
Use structured control files only as machine-readable mirrors, not competing instructions.
Follow alignment/question rules before implementation.
Do not scrape human UI cards.
If the Buildprint requires it, finish with a chat handover summarizing outcome, evidence, known gaps, and recommended next direction.

${bp.copyPrompt}
`;
  return new Response(prompt, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
