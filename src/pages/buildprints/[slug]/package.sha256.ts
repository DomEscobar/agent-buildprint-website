import { createHash } from 'node:crypto';
import { buildprints, getBuildprint, packageManifest } from '@/lib/buildprints';

export function getStaticPaths() {
  return buildprints.filter((bp) => bp.sourceManifest?.runtime).map((bp) => ({ params: { slug: bp.slug } }));
}

export function GET({ params }: { params: { slug: string } }) {
  const bp = getBuildprint(params.slug);
  if (!bp?.sourceManifest?.runtime) return new Response('not found\n', { status: 404 });
  // Exactly the serialization used by package.json.ts; no self-referential digest.
  const bytes = JSON.stringify(packageManifest(bp), null, 2);
  return new Response(`${createHash('sha256').update(bytes).digest('hex')}  package.json\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
