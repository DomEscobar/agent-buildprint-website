import fs from 'node:fs';
import path from 'node:path';
import { buildprints, getBuildprint } from '@/lib/buildprints';

const buildprintsRoot = process.env.BUILDPRINTS_SOURCE || '/root/blueprint/buildprints';

function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

export function getStaticPaths() {
  const paths: { params: { slug: string; file: string } }[] = [];
  for (const bp of buildprints) {
    const root = path.join(buildprintsRoot, bp.slug);
    for (const file of listFiles(root)) {
      const rel = path.relative(root, file).replaceAll(path.sep, '/');
      paths.push({ params: { slug: bp.slug, file: rel } });
    }
  }
  return paths;
}

export function GET({ params }: { params: { slug: string; file: string } }) {
  const bp = getBuildprint(params.slug);
  if (!bp) return new Response('not found\n', { status: 404 });
  const root = path.resolve(buildprintsRoot, bp.slug);
  const requested = path.resolve(root, params.file);
  if (!requested.startsWith(root + path.sep) || !fs.existsSync(requested) || !fs.statSync(requested).isFile()) {
    return new Response('not found\n', { status: 404 });
  }
  const ext = path.extname(requested).toLowerCase();
  const contentType = ext === '.json' ? 'application/json; charset=utf-8' : ext === '.md' ? 'text/markdown; charset=utf-8' : 'text/plain; charset=utf-8';
  return new Response(fs.readFileSync(requested, 'utf8'), { headers: { 'content-type': contentType } });
}
