#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const dist = path.join(root, 'dist');
const registryPath = path.join(dist, 'buildprints', 'index.json');
const liveSmoke = process.argv.includes('--live');
const sourceBuildprints = process.env.BUILDPRINTS_SOURCE ? path.resolve(root, process.env.BUILDPRINTS_SOURCE) : null;
const sourceRoot = sourceBuildprints ? path.dirname(sourceBuildprints) : null;
const loaderPath = path.join(root, 'src', 'lib', 'buildprints.ts');

if (!fs.existsSync(registryPath)) {
  console.error('Missing dist/buildprints/index.json. Run npm run build first.');
  process.exit(1);
}

if (sourceBuildprints && !fs.existsSync(sourceBuildprints)) {
  console.error(`BUILDPRINTS_SOURCE does not exist: ${sourceBuildprints}`);
  process.exit(1);
}

function walkFiles(dir, base = dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['.git', 'dist', 'node_modules'].includes(entry.name)) continue;
      out.push(...walkFiles(full, base));
    } else if (entry.isFile()) {
      out.push(path.relative(base, full).split(path.sep).join('/'));
    }
  }
  return out;
}

function trackedSourceFiles(slug) {
  if (!sourceBuildprints) return null;
  const slugDir = path.join(sourceBuildprints, slug);
  if (!fs.existsSync(slugDir)) return null;
  const publicationPath = path.join(slugDir, 'publication.json');
  if (!fs.existsSync(publicationPath)) return null;
  const publication = JSON.parse(fs.readFileSync(publicationPath, 'utf8'));
  const excludes = new Set(publication.fileExcludes ?? []);

  let files = null;
  if (sourceRoot && fs.existsSync(path.join(sourceRoot, '.git'))) {
    const prefix = `buildprints/${slug}/`;
    const output = execFileSync('git', ['-C', sourceRoot, 'ls-files', '--cached', '--others', '--exclude-standard', prefix], { encoding: 'utf8' }).trim();
    files = output ? output.split(/\r?\n/).map((file) => file.slice(prefix.length)).filter(Boolean) : [];
  }
  files ??= walkFiles(slugDir);
  return files.filter((file) => !excludes.has(file)).sort((a, b) => a.localeCompare(b));
}

function sameList(a, b) {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const items = registry.buildprints || [];
const errors = [];

if (fs.existsSync(loaderPath)) {
  const loaderText = fs.readFileSync(loaderPath, 'utf8');
  if (/const\s+buildprints\s*:\s*Buildprint\[\]\s*=\s*\[/.test(loaderText)
    || /files:\s*\[\s*\{\s*path:\s*['"]/.test(loaderText)
    || /selectedOutputFiles\s*\(/.test(loaderText)) {
    errors.push('src/lib/buildprints.ts contains manual Buildprint registry/file arrays; expected loader-only implementation');
  }
}

for (const bp of items) {
  const slug = bp.slug;
  const pkgPath = path.join(dist, 'buildprints', slug, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    errors.push(`${slug}: missing package.json`);
    continue;
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const expectedRawBase = `https://agent-buildprint.com/buildprints/${slug}/files`;
  if (pkg.entrypoints?.rawBase !== expectedRawBase) {
    errors.push(`${slug}: rawBase is ${pkg.entrypoints?.rawBase}, expected ${expectedRawBase}`);
  }
  const pkgFilePaths = (pkg.files || []).map((file) => file.path);
  for (const file of pkg.files || []) {
    const filePath = path.join(dist, 'buildprints', slug, 'files', ...file.path.split('/'));
    if (!fs.existsSync(filePath)) errors.push(`${slug}: manifest file missing from canonical generated route: ${file.path}`);
  }

  const expectedSourceFiles = trackedSourceFiles(slug);
  if (expectedSourceFiles && !sameList(pkgFilePaths, expectedSourceFiles)) {
    const missing = expectedSourceFiles.filter((file) => !pkgFilePaths.includes(file));
    const extra = pkgFilePaths.filter((file) => !expectedSourceFiles.includes(file));
    const orderMismatch = !missing.length && !extra.length;
    errors.push(`${slug}: website package file list drifted from source publication/tracked files${missing.length ? `; missing ${missing.join(', ')}` : ''}${extra.length ? `; extra ${extra.join(', ')}` : ''}${orderMismatch ? '; same files but different order' : ''}`);
  }

  if (liveSmoke) {
    const buildprintFile = (pkg.files || []).find((file) => file.path === 'BUILDPRINT.md');
    const smokeUrl = buildprintFile?.rawUrl;
    if (!smokeUrl) {
      errors.push(`${slug}: missing BUILDPRINT.md rawUrl for live smoke`);
    } else {
      try {
        const response = await fetch(smokeUrl, { method: 'HEAD' });
        if (!response.ok) errors.push(`${slug}: live raw BUILDPRINT.md returned ${response.status}`);
      } catch (error) {
        errors.push(`${slug}: live raw BUILDPRINT.md failed: ${error.message}`);
      }
    }
  }
}

if (errors.length) {
  console.error(`Buildprint canonical check failed (${errors.length}):`);
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log(`Buildprint canonical check passed: ${items.length} package(s), canonical /buildprints/{slug}/files rawBase, all manifest files present${sourceBuildprints ? ', source publications/tracked files match' : ''}${liveSmoke ? ', live smoke passed' : ''}.`);
