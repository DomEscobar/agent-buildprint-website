#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const args = process.argv.slice(2);
const sourceArgIndex = args.indexOf('--source');
const sourceRoot = path.resolve(root, sourceArgIndex >= 0 ? args[sourceArgIndex + 1] : '../agent-buildprint');
const sourceBuildprints = path.join(sourceRoot, 'buildprints');
const targetPath = path.join(root, 'src/lib/buildprints.ts');

if (!fs.existsSync(sourceBuildprints)) {
  console.error(`Missing source Buildprints directory: ${sourceBuildprints}`);
  process.exit(1);
}
if (!fs.existsSync(targetPath)) {
  console.error(`Missing website registry: ${targetPath}`);
  process.exit(1);
}

const canonicalPurposes = new Map([
  ['BUILDPRINT.md', "canonicalFilePurposes['BUILDPRINT.md']"],
  ['README.md', "canonicalFilePurposes['README.md']"],
  ['SPEC.md', "canonicalFilePurposes['SPEC.md']"],
  ['PLAN.md', "canonicalFilePurposes['PLAN.md']"],
  ['CONTRACTS.md', "canonicalFilePurposes['CONTRACTS.md']"],
  ['EXECUTION_PROTOCOL.md', "canonicalFilePurposes['EXECUTION_PROTOCOL.md']"],
  ['IMPLEMENTATION_PLAN.md', "canonicalFilePurposes['IMPLEMENTATION_PLAN.md']"],
  ['TEST_MATRIX.md', "canonicalFilePurposes['TEST_MATRIX.md']"],
  ['VALIDATION_TEMPLATE.md', "canonicalFilePurposes['VALIDATION_TEMPLATE.md']"],
  ['VERIFICATION.md', "canonicalFilePurposes['VERIFICATION.md']"],
  ['checks/acceptance.md', "canonicalFilePurposes['checks/acceptance.md']"],
  ['questions.md', "canonicalFilePurposes['questions.md']"],
  ['DEFAULT_PRESET.md', "canonicalFilePurposes['DEFAULT_PRESET.md']"],
]);

const requiredCore = new Set([
  'BUILDPRINT.md',
  'README.md',
  'SPEC.md',
  'CONTRACTS.md',
  'PLAN.md',
  'EXECUTION_PROTOCOL.md',
  'IMPLEMENTATION_PLAN.md',
  'TEST_MATRIX.md',
  'VALIDATION_TEMPLATE.md',
  'VERIFICATION.md',
  'checks/acceptance.md',
]);

function walkFiles(dir, base = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  const out = [];
  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      out.push(...walkFiles(full, base));
    } else if (entry.isFile()) {
      out.push(path.relative(base, full).split(path.sep).join('/'));
    }
  }
  return out;
}

function orderFiles(files) {
  const core = ['BUILDPRINT.md', 'README.md', 'SPEC.md', 'CONTRACTS.md', 'PLAN.md', 'EXECUTION_PROTOCOL.md', 'IMPLEMENTATION_PLAN.md', 'TEST_MATRIX.md', 'VALIDATION_TEMPLATE.md', 'VERIFICATION.md', 'checks/acceptance.md'];
  const coreRank = new Map(core.map((file, index) => [file, index]));
  return [...files].sort((a, b) => {
    const ar = coreRank.has(a) ? coreRank.get(a) : 1000;
    const br = coreRank.has(b) ? coreRank.get(b) : 1000;
    if (ar !== br) return ar - br;
    return a.localeCompare(b);
  });
}

function gitTrackedFiles(sourceRoot, slug) {
  const gitDir = path.join(sourceRoot, '.git');
  if (!fs.existsSync(gitDir)) return null;
  const prefix = `buildprints/${slug}/`;
  const output = execFileSync('git', ['-C', sourceRoot, 'ls-files', prefix], { encoding: 'utf8' }).trim();
  if (!output) return [];
  return output.split(/\r?\n/).map((file) => file.slice(prefix.length)).filter(Boolean);
}

function purposeExpr(file, previous) {
  if (previous?.purposeExpr) return previous.purposeExpr;
  if (canonicalPurposes.has(file)) return canonicalPurposes.get(file);
  if (file.startsWith('plans/')) return `'phase rail'`;
  if (file.startsWith('proof/')) return `'offline proof artifact'`;
  if (file.startsWith('conformance/')) return `'target-app conformance artifact'`;
  if (file.startsWith('evals/')) return `'evaluation harness artifact'`;
  if (file.startsWith('schemas/')) return `'schema artifact'`;
  if (file.startsWith('policies/')) return `'policy artifact'`;
  if (file.endsWith('.yaml') || file.endsWith('.json')) return `'machine-readable mirror'`;
  return `'Buildprint package file'`;
}

function requiredFor(file, previous) {
  if (previous) return previous.required;
  if (requiredCore.has(file)) return true;
  if (file.startsWith('proof/') || file.startsWith('conformance/') || file.startsWith('evals/')) return true;
  if (file.startsWith('plans/')) return true;
  return !['schemas/', 'policies/'].some((prefix) => file.startsWith(prefix));
}

function findMatching(text, start, open = '[', close = ']') {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function parseExistingFiles(block) {
  const map = new Map();
  const re = /\{\s*path:\s*'([^']+)'\s*,\s*purpose:\s*([^,]+(?:\[[^\]]+\])?)\s*,\s*required:\s*(true|false)\s*\}/g;
  for (const match of block.matchAll(re)) {
    map.set(match[1], { purposeExpr: match[2].trim(), required: match[3] === 'true' });
  }
  return map;
}

let text = fs.readFileSync(targetPath, 'utf8');
const sourceSlugs = fs.readdirSync(sourceBuildprints, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

let changed = false;
let touched = 0;

for (const slug of sourceSlugs) {
  const slugNeedle = `slug: '${slug}'`;
  const slugIndex = text.indexOf(slugNeedle);
  if (slugIndex < 0) {
    console.warn(`Website registry has no entry for source Buildprint: ${slug}`);
    continue;
  }
  const objectStart = text.lastIndexOf('  {', slugIndex);
  const objectEnd = findMatching(text, objectStart + 2, '{', '}');
  if (objectStart < 0 || objectEnd < 0) throw new Error(`Could not locate object for ${slug}`);
  const objectText = text.slice(objectStart, objectEnd + 1);
  const filesKey = objectText.indexOf('files: [');
  if (filesKey < 0) {
    console.warn(`Website registry entry for ${slug} uses a shared/generated files expression; skipping file array sync.`);
    continue;
  }
  const filesArrayStart = objectStart + filesKey + 'files: '.length;
  const filesArrayEnd = findMatching(text, filesArrayStart, '[', ']');
  if (filesArrayEnd < 0) throw new Error(`Could not locate files array end for ${slug}`);
  const oldArray = text.slice(filesArrayStart, filesArrayEnd + 1);
  const previous = parseExistingFiles(oldArray);
  const trackedFiles = gitTrackedFiles(sourceRoot, slug);
  const sourceFiles = orderFiles(trackedFiles ?? walkFiles(path.join(sourceBuildprints, slug)));
  const lines = sourceFiles.map((file) => {
    const prev = previous.get(file);
    return `      { path: '${file}', purpose: ${purposeExpr(file, prev)}, required: ${requiredFor(file, prev)} },`;
  });
  const newArray = `[\n${lines.join('\n')}\n    ]`;
  if (oldArray !== newArray) {
    text = text.slice(0, filesArrayStart) + newArray + text.slice(filesArrayEnd + 1);
    changed = true;
  }
  touched++;
}

fs.writeFileSync(targetPath, text);
console.log(`${changed ? 'Updated' : 'No changes for'} ${touched} Buildprint file manifests from ${sourceBuildprints}`);
