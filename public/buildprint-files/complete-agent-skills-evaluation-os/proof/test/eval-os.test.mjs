import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createSetupSnapshot,
  staticLint,
  loadoutInventory,
  evaluateSkillUnit,
  evaluateActivation,
  checkTranscriptOrder,
  evaluateMultiAgent,
  runOfflineEvaluation,
} from '../src/eval-os.mjs';

const snapshot = createSetupSnapshot({
  id: 'demo',
  target: 'claude-code',
  skills: [
    { id: 'tdd', name: 'test-driven-development', description: 'ALWAYS use this when implementing behavior changes and write tests first.', estimatedLoadedTokens: 450, requiredFiles: ['SKILL.md'] },
    { id: 'review', name: 'requesting-code-review', description: 'Use before completion to request a structured code review.', estimatedLoadedTokens: 350, requiredFiles: ['SKILL.md'] },
  ],
  agents: [{ id: 'reviewer', estimatedLoadedTokens: 300 }],
  commands: [], hooks: [], mcpServers: [],
  permissions: { externalPublish: 'ask' },
});

test('snapshot records component count and loaded token footprint', () => {
  assert.equal(snapshot.componentCount, 3);
  assert.equal(snapshot.estimatedLoadedTokens, 1100);
});

test('static lint passes valid setup and blocks unsafe publish permission', () => {
  assert.equal(staticLint(snapshot).passed, true);
  const bad = createSetupSnapshot({ id: 'bad', skills: [{ id: 'x', name: 'Bad Name', description: 'short', requiredFiles: ['../secret'] }], permissions: { externalPublish: 'allow' } });
  const result = staticLint(bad);
  assert.equal(result.passed, false);
  assert.ok(result.findings.length >= 2);
});

test('loadout inventory flags high-cost dormant artifacts', () => {
  const inventory = loadoutInventory(snapshot, { tdd: 4 });
  assert.deepEqual(inventory.dormantIds.sort(), ['review', 'reviewer']);
  assert.equal(inventory.loadedTokens, 1100);
});

test('skill unit evaluator separates assertion failures from activation', () => {
  assert.equal(evaluateSkillUnit({ assertions: [{ type: 'file_exists', pass: true }] }).passed, true);
  const failed = evaluateSkillUnit({ assertions: [{ type: 'json_schema', pass: false, hardFail: true }] });
  assert.equal(failed.passed, false);
  assert.equal(failed.hardFailed, true);
});

test('activation eval scores positive and negative routing cases', () => {
  const result = evaluateActivation([
    { expectedComponents: ['tdd'], actualComponents: ['tdd'] },
    { forbiddenComponents: ['review'], actualComponents: [] },
    { expectedComponents: ['review'], actualComponents: ['tdd'] },
  ]);
  assert.equal(result.recall, 0.5);
  assert.ok(result.wrongActivations >= 1);
  assert.ok(result.score < 100);
});

test('transcript checker enforces skill before write', () => {
  const good = checkTranscriptOrder([
    { type: 'skill_load', name: 'test-driven-development' },
    { type: 'file_write', name: 'src/app.ts' },
  ], [{ before: { type: 'skill_load', name: 'test-driven-development' }, after: { type: 'file_write' }, hardFail: true }]);
  assert.equal(good.passed, true);
  const bad = checkTranscriptOrder([{ type: 'file_write', name: 'src/app.ts' }], [{ before: { type: 'skill_load', name: 'test-driven-development' }, after: { type: 'file_write' }, hardFail: true }]);
  assert.equal(bad.passed, false);
});

test('multi-agent evaluator catches context and file ownership failures', () => {
  const result = evaluateMultiAgent([
    { id: 'a', parentContextIncluded: true, fileOwnershipRespected: true, outputSchemaValid: true },
    { id: 'b', parentContextIncluded: false, fileOwnershipRespected: false, outputSchemaValid: true },
  ]);
  assert.equal(result.passed, false);
  assert.equal(result.findings.filter((f) => f.severity === 'error').length, 2);
});

test('offline evaluation aggregates layers and hard failures', () => {
  const result = runOfflineEvaluation({
    snapshot,
    usage: { tdd: 2, review: 1, reviewer: 1 },
    skillResults: [{ id: 'tdd-case', assertions: [{ type: 'file_exists', pass: true }] }],
    activationCases: [{ expectedComponents: ['tdd'], actualComponents: ['tdd'] }],
    transcriptEvents: [{ type: 'skill_load', name: 'test-driven-development' }, { type: 'file_write', name: 'src/app.ts' }],
    invariants: [{ before: { type: 'skill_load', name: 'test-driven-development' }, after: { type: 'file_write' }, hardFail: true }],
    multiAgentRuns: [{ id: 'ok', parentContextIncluded: true, fileOwnershipRespected: true, outputSchemaValid: true }],
  });
  assert.equal(result.hardFailed, false);
  assert.ok(result.total >= 85);
});
