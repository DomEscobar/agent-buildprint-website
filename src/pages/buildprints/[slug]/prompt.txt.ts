import { buildprints, getBuildprint } from '@/lib/buildprints';

export function getStaticPaths() {
  return buildprints.map((bp) => ({ params: { slug: bp.slug } }));
}

export function GET({ params }: { params: { slug: string } }) {
  const bp = getBuildprint(params.slug);
  if (!bp) return new Response('not found\n', { status: 404 });
  const prompt = `${bp.copyPrompt}
`;
  return new Response(prompt, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
