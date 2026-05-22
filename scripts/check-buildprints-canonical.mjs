#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const registryPath = path.join(dist, 'buildprints', 'index.json');
const liveSmoke = process.argv.includes('--live');
const sourceBuildprints = process.env.BUILDPRINTS_SOURCE ? path.resolve(root, process.env.BUILDPRINTS_SOURCE) : null;

if (!fs.existsSync(registryPath)) {
  console.error('Missing dist/buildprints/index.json. Run npm run build first.');
  process.exit(1);
}

if (sourceBuildprints && !fs.existsSync(sourceBuildprints)) {
  console.error(`BUILDPRINTS_SOURCE does not exist: ${sourceBuildprints}`);
  process.exit(1);
}

function sourceManifestFiles(slug) {
  if (!sourceBuildprints) return null;
  const manifestPath = path.join(sourceBuildprints, slug, 'manifest.json');
  if (!fs.existsSync(manifestPath)) return null;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!Array.isArray(manifest.files)) return null;
  return manifest.files.map((file) => String(file).split(path.sep).join('/')).filter(Boolean);
}

function sameList(a, b) {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const items = registry.buildprints || [];
const errors = [];

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

  const expectedSourceFiles = sourceManifestFiles(slug);
  if (expectedSourceFiles && !sameList(pkgFilePaths, expectedSourceFiles)) {
    const missing = expectedSourceFiles.filter((file) => !pkgFilePaths.includes(file));
    const extra = pkgFilePaths.filter((file) => !expectedSourceFiles.includes(file));
    const orderMismatch = !missing.length && !extra.length;
    errors.push(`${slug}: website package file list drifted from source manifest${missing.length ? `; missing ${missing.join(', ')}` : ''}${extra.length ? `; extra ${extra.join(', ')}` : ''}${orderMismatch ? '; same files but different order' : ''}`);
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

console.log(`Buildprint canonical check passed: ${items.length} package(s), canonical /buildprints/{slug}/files rawBase, all manifest files present${sourceBuildprints ? ', source manifests match' : ''}${liveSmoke ? ', live smoke passed' : ''}.`);
