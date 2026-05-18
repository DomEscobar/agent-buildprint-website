#!/usr/bin/env node
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const slug = process.argv.find((arg) => arg.startsWith('--slug='))?.slice('--slug='.length) || 'portable-novel-storyboard-pipeline';
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
  buildprintJson: `${base}/buildprints/${slug}/files/buildprint.json`,
};

const prompt = fetchText(urls.prompt);
const agent = fetchText(urls.agent);
const manifest = JSON.parse(fetchText(urls.manifest));
const readme = fetchText(urls.readme);
const buildprintJson = JSON.parse(fetchText(urls.buildprintJson));

save('live-prompt.txt', prompt);
save('live-agent.md', agent);
save('live-package.json', JSON.stringify(manifest, null, 2) + '\n');
save('live-README.md', readme);
save('live-buildprint.json', JSON.stringify(buildprintJson, null, 2) + '\n');

assert(prompt.includes('Read `BUILDPRINT.md` first'), 'prompt tells agents to read BUILDPRINT.md first');
assert(!prompt.includes('Read the package files in the manifest order'), 'prompt does not instruct manifest-order reading');
assert(agent.includes('Read `BUILDPRINT.md` first'), 'agent guide tells agents to read BUILDPRINT.md first');
assert(!agent.includes('Read files in order:'), 'agent guide does not render a competing read-order list');
assert(manifest.instructions?.canonicalStart === 'BUILDPRINT.md', 'manifest canonicalStart is BUILDPRINT.md', { canonicalStart: manifest.instructions?.canonicalStart });
assert(Array.isArray(manifest.instructions?.readOrder) && manifest.instructions.readOrder.length === 1 && manifest.instructions.readOrder[0] === 'BUILDPRINT.md', 'manifest readOrder only points to BUILDPRINT.md', { readOrder: manifest.instructions?.readOrder });
assert(manifest.files?.[0]?.path === 'BUILDPRINT.md', 'manifest files list starts with BUILDPRINT.md', { firstFile: manifest.files?.[0]?.path });
assert(readme.includes('This README is only a package overview') && !readme.includes('## V2 Read Order'), 'README does not contain a competing V2 read-order list');
assert(buildprintJson.canonicalStart === 'BUILDPRINT.md', 'buildprint.json canonicalStart is BUILDPRINT.md');
assert(buildprintJson.authoritySpine === 'BUILDPRINT.md', 'buildprint.json uses authoritySpine instead of co-equal authority list', { authoritySpine: buildprintJson.authoritySpine });
assert(!Object.prototype.hasOwnProperty.call(buildprintJson, 'authority'), 'buildprint.json has no ambiguous authority array');
assert(Array.isArray(buildprintJson.mirrorFiles) && buildprintJson.mirrorFiles.includes('phases.yaml'), 'buildprint.json declares structured files as mirrors');

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
