#!/usr/bin/env node
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const slug = process.argv.find((arg) => arg.startsWith('--slug='))?.slice('--slug='.length) || 'api-key-management';
const runCodex = process.argv.includes('--run-codex');
const base = process.argv.find((arg) => arg.startsWith('--base='))?.slice('--base='.length) || 'https://agent-buildprint.com';
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = process.argv.find((arg) => arg.startsWith('--out='))?.slice('--out='.length) || `/tmp/agb-codex-drift-${slug}-${stamp}`;
mkdirSync(outDir, { recursive: true });

function fetchText(url) {
  return execFileSync('curl', ['-fsSL', url], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
}

function save(name, content) {
  writeFileSync(join(outDir, name), content);
}

function assert(condition, message, details = {}) {
  checks.push({ ok: Boolean(condition), message, details });
}

const checks = [];
const urls = {
  page: `${base}/buildprints/${slug}/`,
  prompt: `${base}/buildprints/${slug}/prompt.txt`,
  agent: `${base}/buildprints/${slug}/agent.md`,
  manifest: `${base}/buildprints/${slug}/package.json`,
  readme: `${base}/buildprints/${slug}/files/README.md`,
};

const prompt = fetchText(urls.prompt);
const agent = fetchText(urls.agent);
const manifest = JSON.parse(fetchText(urls.manifest));
const readme = fetchText(urls.readme);

save('live-prompt.txt', prompt);
save('live-agent.md', agent);
save('live-package.json', JSON.stringify(manifest, null, 2) + '\n');
save('live-README.md', readme);

const hasManifestFile = (path) => manifest.files?.some((file) => file.path === path);
let buildprintJson = null;
if (hasManifestFile('buildprint.json')) {
  buildprintJson = JSON.parse(fetchText(`${base}/buildprints/${slug}/files/buildprint.json`));
  save('live-buildprint.json', JSON.stringify(buildprintJson, null, 2) + '\n');
}
const isCapabilityPacket = hasManifestFile('START_HERE.md') && hasManifestFile('blueprint.yaml');
const isExecutableBlueprint = hasManifestFile('01-questions.md') && hasManifestFile('02-project-setup.md') && hasManifestFile('blueprint.yaml') && hasManifestFile('03-phases/phase-index.yaml');
const expectedCanonicalStart = isCapabilityPacket ? 'START_HERE.md' : 'BUILDPRINT.md';
const expectedReadOrder = manifest.instructions?.readOrder || (isCapabilityPacket ? ['BUILDPRINT.md', 'START_HERE.md', 'blueprint.yaml'] : ['BUILDPRINT.md']);

assert(!prompt.includes('Read the package files in the manifest order'), 'prompt does not instruct manifest-order reading');
assert(!agent.includes('Read files in order:'), 'agent guide does not render a competing legacy read-order list');
assert(prompt.includes(`Read order: ${expectedReadOrder.map((file) => `\`${file}\``).join(' -> ')}`), 'prompt renders expected package read order', { expectedReadOrder });
assert(agent.includes(`Read order: ${expectedReadOrder.map((file) => `\`${file}\``).join(' -> ')}`), 'agent guide renders expected package read order', { expectedReadOrder });
assert(manifest.instructions?.canonicalStart === expectedCanonicalStart, 'manifest canonicalStart matches packet type', { canonicalStart: manifest.instructions?.canonicalStart, expectedCanonicalStart });
assert(Array.isArray(manifest.instructions?.readOrder) && JSON.stringify(manifest.instructions.readOrder) === JSON.stringify(expectedReadOrder), 'manifest readOrder is explicit and stable', { readOrder: manifest.instructions?.readOrder, expectedReadOrder });
assert(manifest.files?.some((file) => file.path === 'BUILDPRINT.md'), 'manifest files include BUILDPRINT.md compatibility bootstrap');
if (isCapabilityPacket) {
  assert(expectedReadOrder.includes('BUILDPRINT.md') && expectedReadOrder.includes('START_HERE.md') && expectedReadOrder.includes('blueprint.yaml'), 'capability packet readOrder includes compatibility bootstrap and router files', { expectedReadOrder });
  assert(readme.includes('START_HERE.md') && readme.includes('blueprint.yaml'), 'README routes capability packet readers to START_HERE.md and blueprint.yaml');
  assert(Boolean(buildprintJson), 'capability packet publishes buildprint.json compatibility router');
  if (buildprintJson) {
    assert(buildprintJson.schema === 'agent-buildprint/v2', 'buildprint.json declares executable packet v2 schema', { schema: buildprintJson.schema });
    assert(buildprintJson.packet === 'blueprint.yaml', 'buildprint.json points to blueprint.yaml packet', { packet: buildprintJson.packet });
    assert(buildprintJson.canonicalStart === 'BUILDPRINT.md', 'buildprint.json keeps BUILDPRINT.md as compatibility bootstrap', { canonicalStart: buildprintJson.canonicalStart });
    assert(!Object.prototype.hasOwnProperty.call(buildprintJson, 'authority'), 'buildprint.json has no ambiguous authority array');
  }
} else if (isExecutableBlueprint) {
  assert(expectedReadOrder.includes('BUILDPRINT.md') && expectedReadOrder.includes('01-questions.md') && expectedReadOrder.includes('02-project-setup.md') && expectedReadOrder.includes('03-phases/phase-index.yaml'), 'executable-blueprint readOrder includes setup gate and phase router', { expectedReadOrder });
  assert(!readme.includes('## V2 Read Order') && !readme.includes('Read files in order:') && !readme.includes('Read the package files in the manifest order'), 'README does not contain a competing read-order list');
  assert(readme.includes('/agent.md') || readme.includes('agb start'), 'README routes readers through agent guide or manifest bootstrap');
  assert(!hasManifestFile('buildprint.json'), 'executable-blueprint does not publish legacy buildprint.json router');
  assert(manifest.instructions?.rule?.includes('BUILDPRINT.md is the canonical execution authority'), 'manifest rule declares BUILDPRINT.md canonical authority');
  assert(manifest.instructions?.rule?.includes('machine-readable mirrors') || manifest.instructions?.rule?.includes('structured files are machine-readable mirrors'), 'manifest rule declares structured files as mirrors');
} else {
  assert(!readme.includes('## V2 Read Order') && !readme.includes('Read files in order:') && !readme.includes('Read the package files in the manifest order'), 'README does not contain a competing read-order list');
  if (buildprintJson) {
    assert(buildprintJson.canonicalStart === 'BUILDPRINT.md', 'buildprint.json canonicalStart is BUILDPRINT.md');
    assert(buildprintJson.authoritySpine === 'BUILDPRINT.md', 'buildprint.json uses authoritySpine instead of co-equal authority list', { authoritySpine: buildprintJson.authoritySpine });
    assert(!Object.prototype.hasOwnProperty.call(buildprintJson, 'authority'), 'buildprint.json has no ambiguous authority array');
    assert(Array.isArray(buildprintJson.mirrorFiles) && buildprintJson.mirrorFiles.includes('phases.yaml'), 'buildprint.json declares structured files as mirrors');
  } else {
    assert(manifest.instructions?.canonicalStart === 'BUILDPRINT.md', 'manifest canonicalStart replaces absent buildprint.json router');
  }
}

if (runCodex) {
  const task = `You are a coding agent drift test-runner. Run the live website Agent Buildprint prompt below as a real coding agent would, but STOP after bootstrap and authority/read-order inspection. Do not implement the app.\n\nRequired actions:\n1. Follow the prompt's bootstrap instruction.\n2. Read .buildprint/next-agent.md and .buildprint/snapshots/BUILDPRINT.md.\n3. Inspect enough mirror/lower-authority files to judge if they compete.\n4. Write CODEX_READ_ORDER_REPORT.md with exact commands, files read, authority verdict, mirror verdict, lower-authority verdict, and any confusion/blockers.\n\n--- LIVE WEBSITE PROMPT START ---\n${prompt}\n--- LIVE WEBSITE PROMPT END ---\n`;
  save('codex-task.txt', task);
  const result = spawnSync('codex', [
    'exec',
    '--dangerously-bypass-approvals-and-sandbox',
    '--skip-git-repo-check',
    '-C', outDir,
    '-o', join(outDir, 'codex-last-message.txt'),
    '-',
  ], { input: task, encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  save('codex-run.stdout.log', result.stdout || '');
  save('codex-run.stderr.log', result.stderr || '');
  assert(result.status === 0, 'codex run exits successfully', { status: result.status, signal: result.signal });

  const reportPath = join(outDir, 'CODEX_READ_ORDER_REPORT.md');
  const report = existsSync(reportPath) ? readFileSync(reportPath, 'utf8') : '';
  assert(Boolean(report), 'Codex wrote CODEX_READ_ORDER_REPORT.md');
  assert(/BUILDPRINT\.md[^\n]*(canonical|authority)|canonical[^\n]*BUILDPRINT\.md/i.test(report), 'Codex report identifies BUILDPRINT.md as canonical authority');
  assert(/do not (materially )?compete|not competing|do not compete|mirror/i.test(report), 'Codex report treats structured files as mirrors/not competing');
  const hardDriftLines = report.split(/\r?\n/).filter((line) => {
    const normalized = line.toLowerCase();
    return normalized.includes('manifest order overrode')
      || normalized.includes('readme wins')
      || normalized.includes('agent_handoff wins')
      || normalized.includes('co-equal authority')
      || normalized.includes('coequal authority');
  });
  assert(hardDriftLines.length === 0, 'Codex report has no hard authority drift markers', { hardDriftLines });
}

const failed = checks.filter((check) => !check.ok);
const summary = {
  slug,
  base,
  outDir,
  runCodex,
  passed: failed.length === 0,
  checks,
};
save('drift-summary.json', JSON.stringify(summary, null, 2) + '\n');
save('drift-summary.md', `# Codex Read-Order Drift Summary\n\n- slug: ${slug}\n- base: ${base}\n- outDir: ${outDir}\n- codexRun: ${runCodex}\n- result: ${failed.length ? 'FAIL' : 'PASS'}\n\n## Checks\n\n${checks.map((check) => `- ${check.ok ? 'PASS' : 'FAIL'} — ${check.message}${Object.keys(check.details || {}).length ? ` — ${JSON.stringify(check.details)}` : ''}`).join('\n')}\n`);

console.log(`Codex read-order drift check: ${failed.length ? 'FAIL' : 'PASS'}`);
console.log(`Artifacts: ${outDir}`);
for (const check of checks) console.log(`${check.ok ? '✓' : '✗'} ${check.message}`);
if (failed.length) process.exit(1);
