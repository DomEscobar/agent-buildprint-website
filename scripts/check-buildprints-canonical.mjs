#!/usr/bin/env node
import fs from 'node:fs';
import { assertPromptReadOrder, normalizeCopyPrompt, resolveReadOrder, formatReadOrder } from '../src/lib/read-order.mjs';
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

function sourcePublication(slug) {
  if (!sourceBuildprints) return null;
  const publicationPath = path.join(sourceBuildprints, slug, 'publication.json');
  if (!fs.existsSync(publicationPath)) return null;
  return JSON.parse(fs.readFileSync(publicationPath, 'utf8'));
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
  if (pkg.runtime?.schema === 'agb/runtime/v2') {
    const compatibility = pkg.compatibility;
    const sourceCli = compatibility?.sourceCli;
    const serialized = JSON.stringify(pkg);
    if (serialized.includes('undefined')) errors.push(`${slug}: generated v2 package contains an undefined command or value`);
    if (!sourceCli) {
      errors.push(`${slug}: v2 package is missing sourceCli compatibility metadata`);
    } else {
      if (compatibility.packageCliVersion !== sourceCli.npmVersion) errors.push(`${slug}: package CLI version disagrees with source publication metadata`);
      if (compatibility.packageCliSupportsRuntime !== sourceCli.npmSupportsRuntime) errors.push(`${slug}: package CLI support disagrees with source publication metadata`);
      const expectedRegistryAvailability = sourceCli.npmPublished === true ? 'available' : sourceCli.npmPublished === false ? 'unavailable' : 'check-required';
      const npmRouteAvailable = sourceCli.npmSupportsRuntime && expectedRegistryAvailability === 'available';
      if (compatibility.registryAvailability !== expectedRegistryAvailability) errors.push(`${slug}: generated registry availability disagrees with source publication metadata`);
      if (npmRouteAvailable) {
        if (!pkg.bootstrap?.command?.includes(`agent-buildprint@${sourceCli.npmVersion}`)) errors.push(`${slug}: npm-supported v2 package does not install its declared CLI version`);
        if (!pkg.bootstrap?.command?.includes(`node_modules/agent-buildprint/buildprints/${slug}/package.json`)) errors.push(`${slug}: npm-supported v2 package does not use its bundled local manifest`);
      } else {
        if (/npm install[^\n]*agent-buildprint@/.test(pkg.bootstrap?.command ?? '')) errors.push(`${slug}: unavailable npm route is still the primary bootstrap command`);
        if (!pkg.bootstrap?.command?.includes('/bin/agb.js') || !pkg.bootstrap?.command?.includes(`/buildprints/${slug}/package.json`)) errors.push(`${slug}: unavailable npm route does not fall back to one matching source CLI and packet`);
        if (pkg.bootstrap?.fallbackCommand) errors.push(`${slug}: source-primary v2 package unexpectedly advertises a fallback command`);
      }
      if (!sourceCli.commit && !pkg.bootstrap?.sourceSetup?.includes('rev-parse HEAD')) errors.push(`${slug}: unpinned current-source setup does not record its checkout HEAD`);
    }
    if (/npm install[^\n]*agent-buildprint@0\.0\.17/.test(serialized)) errors.push(`${slug}: generated v2 compatibility text installs obsolete npm 0.0.17`);
    const agentPath = path.join(dist, 'buildprints', slug, 'agent.md');
    const agentText = fs.existsSync(agentPath) ? fs.readFileSync(agentPath, 'utf8') : '';
    if (!agentText || /checkout --detach undefined|npm install[^\n]*agent-buildprint@0\.0\.17/.test(agentText)) errors.push(`${slug}: generated agent guide has broken or obsolete v2 routing`);
  }
  const expectedRawBase = `https://agent-buildprint.com/buildprints/${slug}/files`;
  if (pkg.entrypoints?.rawBase !== expectedRawBase) {
    errors.push(`${slug}: rawBase is ${pkg.entrypoints?.rawBase}, expected ${expectedRawBase}`);
  }
  const pkgFilePaths = (pkg.files || []).map((file) => file.path);
  for (const file of pkg.files || []) {
    const rawPath = file.rawUrl ? new URL(file.rawUrl).pathname : `/buildprints/${slug}/files/${file.path}`;
    const filePath = path.join(dist, ...rawPath.split('/').filter(Boolean));
    if (!fs.existsSync(filePath)) errors.push(`${slug}: manifest file missing from canonical generated route: ${file.path}`);
  }

  const expectedSourceFiles = trackedSourceFiles(slug);
  if (expectedSourceFiles && !sameList(pkgFilePaths, expectedSourceFiles)) {
    const missing = expectedSourceFiles.filter((file) => !pkgFilePaths.includes(file));
    const extra = pkgFilePaths.filter((file) => !expectedSourceFiles.includes(file));
    const orderMismatch = !missing.length && !extra.length;
    errors.push(`${slug}: website package file list drifted from source publication/tracked files${missing.length ? `; missing ${missing.join(', ')}` : ''}${extra.length ? `; extra ${extra.join(', ')}` : ''}${orderMismatch ? '; same files but different order' : ''}`);
  }

  const publication = sourcePublication(slug);
  const promptPath = path.join(dist, 'buildprints', slug, 'prompt.txt');
  const promptText = fs.existsSync(promptPath) ? fs.readFileSync(promptPath, 'utf8').trim() : '';
  try {
    const order = resolveReadOrder(pkg.instructions?.readOrder, undefined, pkgFilePaths);
    if (!sameList(pkg.readOrder ?? [], order)) throw new Error('top-level readOrder differs from instructions');
    const sourceManifestPath = sourceBuildprints && path.join(sourceBuildprints, slug, 'package.json');
    if (sourceManifestPath && fs.existsSync(sourceManifestPath)) {
      const sourceOrder = JSON.parse(fs.readFileSync(sourceManifestPath, 'utf8')).instructions?.readOrder;
      if (sourceOrder !== undefined && !sameList(resolveReadOrder(sourceOrder, undefined, pkgFilePaths), order)) {
        throw new Error('generated readOrder differs from source manifest');
      }
    }
    assertPromptReadOrder(promptText, order);
    const agent = fs.readFileSync(path.join(dist, 'buildprints', slug, 'agent.md'), 'utf8');
    if (!agent.includes(`2. ${formatReadOrder(order)}`) || !agent.includes(promptText)) throw new Error('agent guide differs from canonical order/prompt');
    if (publication?.copyPrompt && promptText !== normalizeCopyPrompt(publication.copyPrompt, order)) {
      throw new Error('dist prompt.txt does not match normalized source publication.json copyPrompt');
    }
  } catch (error) {
    errors.push(`${slug}: ${error.message}`);
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
