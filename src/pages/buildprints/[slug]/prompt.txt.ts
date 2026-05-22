import { buildprints, getBuildprint, buildprintUrls, packageManifest } from '@/lib/buildprints';

export function getStaticPaths() {
  return buildprints.map((bp) => ({ params: { slug: bp.slug } }));
}

export function GET({ params }: { params: { slug: string } }) {
  const bp = getBuildprint(params.slug);
  if (!bp) return new Response('not found\n', { status: 404 });
  const urls = buildprintUrls(bp);
  const manifest = packageManifest(bp);
  const readOrder = manifest.instructions.readOrder.length ? manifest.instructions.readOrder : [manifest.instructions.canonicalStart];
  const formattedReadOrder = readOrder.map((file) => `\`${file}\``).join(' -> ');
  const prompt = `Use the Agent Buildprint at ${urls.agent}.

Fetch ${urls.manifest}.
Read order: ${formattedReadOrder}.
${manifest.instructions.rule}
Follow alignment/question rules before implementation.
Do not scrape human UI cards.
If the Buildprint requires it, finish with a chat handover summarizing outcome, evidence, known gaps, and recommended next direction.

${bp.copyPrompt}
`;
  return new Response(prompt, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
