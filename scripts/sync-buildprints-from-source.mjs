#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const args = process.argv.slice(2);
const sourceArgIndex = args.indexOf('--source');
const sourceRoot = path.resolve(root, sourceArgIndex >= 0 ? args[sourceArgIndex + 1] : '../agent-buildprint');
const sourceBuildprints = path.join(sourceRoot, 'buildprints');
const registryPath = path.join(root, 'src/lib/buildprints.ts');

if (!fs.existsSync(sourceBuildprints)) {
  console.error(`Missing source Buildprints directory: ${sourceBuildprints}`);
  process.exit(1);
}
if (!fs.existsSync(registryPath)) {
  console.error(`Missing website loader: ${registryPath}`);
  process.exit(1);
}

function trackedFiles(slug) {
  const prefix = `buildprints/${slug}/`;
  const output = execFileSync('git', ['-C', sourceRoot, 'ls-files', '--cached', '--others', '--exclude-standard', prefix], { encoding: 'utf8' }).trim();
  return output ? output.split(/\r?\n/).map((file) => file.slice(prefix.length)).filter(Boolean) : [];
}

function hasManualRegistry(text) {
  return /const\s+buildprints\s*:\s*Buildprint\[\]\s*=\s*\[/.test(text)
    || /files:\s*\[\s*\{\s*path:\s*['"]/.test(text)
    || /selectedOutputFiles\s*\(/.test(text);
}

const registryText = fs.readFileSync(registryPath, 'utf8');
if (hasManualRegistry(registryText)) {
  console.error('src/lib/buildprints.ts still contains manual Buildprint registry/file arrays. It must remain a loader.');
  process.exit(1);
}

const errors = [];
const slugs = fs.readdirSync(sourceBuildprints, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

let published = 0;
for (const slug of slugs) {
  const files = trackedFiles(slug);
  if (!files.includes('BUILDPRINT.md')) continue;

  const publicationPath = path.join(sourceBuildprints, slug, 'publication.json');
  let publication = {};
  if (fs.existsSync(publicationPath)) {
    try {
      publication = JSON.parse(fs.readFileSync(publicationPath, 'utf8'));
    } catch (error) {
      errors.push(`${slug}: invalid publication.json: ${error.message}`);
      continue;
    }
  }

  if (publication.publish === false) continue;
  published++;
  if (publication.slug && publication.slug !== slug) errors.push(`${slug}: publication slug is ${publication.slug}`);
  if (publication.schema && publication.schema !== 'agent-buildprint/publication.v1') errors.push(`${slug}: invalid publication schema ${publication.schema}`);

  for (const excluded of publication.fileExcludes ?? []) {
    if (!files.includes(excluded)) errors.push(`${slug}: fileExcludes references missing tracked file ${excluded}`);
  }
}

if (errors.length) {
  console.error(`Source publication validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Source Buildprint validation passed: ${published} published Buildprint(s). No website source files were rewritten.`);
