import { buildprints, getBuildprint, packageManifest } from '@/lib/buildprints';

export function getStaticPaths() {
  return buildprints.map((bp) => ({ params: { slug: bp.slug } }));
}

export function GET({ params }: { params: { slug: string } }) {
  const bp = getBuildprint(params.slug);
  if (!bp) return new Response('# Not found\n', { status: 404, headers: { 'content-type': 'text/markdown; charset=utf-8' } });
  const manifest = packageManifest(bp);
  const readOrder = manifest.instructions.readOrder.length ? manifest.instructions.readOrder : bp.files.map((file) => file.path);
  const md = `# ${bp.title} — Agent Guide

${bp.summary}

## Agent instruction

Do not scrape the human UI. Use this agent guide, the package manifest, and raw Buildprint files.

1. Fetch package manifest: \`${manifest.entrypoints.manifest}\`
2. Read \`BUILDPRINT.md\` first. It owns the required read order, phase gates, and acceptance gates.
3. Use structured control files only as machine-readable mirrors, not competing instructions.
4. Follow the Buildprint's alignment/question rules before implementation.
5. Run required validation and write the requested validation report.

## Metadata

- slug: \`${bp.slug}\`
- category: \`${bp.category}\`
- tier: \`${bp.tier}\`
- status: \`${bp.status}\`
- runtime: ${bp.runtime.join(', ')}
- stack: ${bp.stack.join(', ')}

## Entrypoints

- Human page: ${manifest.entrypoints.human}
- Manifest JSON: ${manifest.entrypoints.manifest}
- Prompt: ${manifest.entrypoints.prompt}
- GitHub: ${manifest.entrypoints.github}
- Raw base: ${manifest.entrypoints.rawBase}

## Files

${bp.files.map((file) => `- \`${file.path}\` — ${file.purpose} (${file.required ? 'required' : 'optional'})`).join('\n')}

## Copyable implementation prompt

\`\`\`txt
${bp.copyPrompt}
\`\`\`
`;
  return new Response(md, { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
}
