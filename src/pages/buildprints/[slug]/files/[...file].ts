import fs from 'node:fs';
import path from 'node:path';
import { buildprints, getBuildprint } from '@/lib/buildprints';

const buildprintsRoot = process.env.BUILDPRINTS_SOURCE || '/root/blueprint/buildprints';
const sourceRawRoot = process.env.BUILDPRINTS_RAW_SOURCE || 'https://raw.githubusercontent.com/DomEscobar/agent-buildprint/main/buildprints';

export function getStaticPaths() {
  const paths: { params: { slug: string; file: string } }[] = [];
  for (const bp of buildprints) {
    for (const file of bp.files) paths.push({ params: { slug: bp.slug, file: file.path } });
  }
  return paths;
}

function safeFilePath(file: string) {
  const normalized = path.posix.normalize(file.replaceAll('\\', '/'));
  if (normalized.startsWith('../') || normalized === '..' || path.posix.isAbsolute(normalized)) return null;
  return normalized;
}

function contentTypeFor(file: string) {
  const ext = path.extname(file).toLowerCase();
  return ext === '.json' ? 'application/json; charset=utf-8' : ext === '.md' ? 'text/markdown; charset=utf-8' : 'text/plain; charset=utf-8';
}

async function readRawFile(slug: string, file: string) {
  const root = path.resolve(buildprintsRoot, slug);
  const requested = path.resolve(root, ...file.split('/'));
  if (requested.startsWith(root + path.sep) && fs.existsSync(requested) && fs.statSync(requested).isFile()) {
    return fs.readFileSync(requested, 'utf8');
  }

  const rawUrl = `${sourceRawRoot}/${slug}/${file.split('/').map(encodeURIComponent).join('/')}`;
  const response = await fetch(rawUrl);
  if (!response.ok) return null;
  return response.text();
}

export async function GET({ params }: { params: { slug: string; file: string } }) {
  const bp = getBuildprint(params.slug);
  if (!bp) return new Response('not found\n', { status: 404 });
  const file = safeFilePath(params.file);
  if (!file || !bp.files.some((item) => item.path === file)) return new Response('not found\n', { status: 404 });

  const body = await readRawFile(bp.slug, file);
  if (body === null) return new Response('not found\n', { status: 404 });
  return new Response(body, { headers: { 'content-type': contentTypeFor(file) } });
}
