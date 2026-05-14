import { buildprints, getBuildprint, packageManifest } from '@/lib/buildprints';

export function getStaticPaths() {
  return buildprints.map((bp) => ({ params: { slug: bp.slug } }));
}

export function GET({ params }: { params: { slug: string } }) {
  const bp = getBuildprint(params.slug);
  if (!bp) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404 });
  return new Response(JSON.stringify(packageManifest(bp), null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
