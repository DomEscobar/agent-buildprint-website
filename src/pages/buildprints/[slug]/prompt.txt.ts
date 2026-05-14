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
Read the package files in the manifest order.
Follow alignment/question rules before implementation.
Do not scrape human UI cards.

${bp.copyPrompt}
`;
  return new Response(prompt, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
