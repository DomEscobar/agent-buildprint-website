#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const registryPath = path.join(dist, 'buildprints', 'index.json');
const liveSmoke = process.argv.includes('--live');

if (!fs.existsSync(registryPath)) {
  console.error('Missing dist/buildprints/index.json. Run npm run build first.');
  process.exit(1);
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
  for (const file of pkg.files || []) {
    const filePath = path.join(dist, 'buildprints', slug, 'files', ...file.path.split('/'));
    if (!fs.existsSync(filePath)) errors.push(`${slug}: manifest file missing from canonical generated route: ${file.path}`);
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

console.log(`Buildprint canonical check passed: ${items.length} package(s), canonical /buildprints/{slug}/files rawBase, all manifest files present${liveSmoke ? ', live smoke passed' : ''}.`);
