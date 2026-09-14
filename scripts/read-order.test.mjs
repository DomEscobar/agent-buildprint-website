import test from 'node:test';
import assert from 'node:assert/strict';
import { formatReadOrder, normalizeCopyPrompt, resolveReadOrder, assertPromptReadOrder } from '../src/lib/read-order.mjs';

const order = ['BUILDPRINT.md', '00-goal.md'];
const canonical = 'Read order: `BUILDPRINT.md` -> `00-goal.md`.';
const releaseProse = 'For hosted phase routing, use https://agent-buildprint.com/buildprints/standalone-isometric-game/files/package.json and load only the applicable phase entry and active loop.\nUse agent-buildprint@0.1.0; current-source production gates need a fresh matching checkout. Neither route updates snapshots. Preserve approvals.';

test('formatter retains agent-guide grammar', () => assert.equal(formatReadOrder(order), canonical));
test('e470c09 recurrence normalizes without losing release/phase prose', () => {
  assert.equal(normalizeCopyPrompt(`Read BUILDPRINT.md, then 00-goal.md. ${releaseProse}`, order), `${canonical} ${releaseProse}`);
});
test('manifest change replaces stale canonical order, not appends', () => {
  assert.equal(normalizeCopyPrompt(`${canonical}\n${releaseProse}`, ['BUILDPRINT.md']), `Read order: \`BUILDPRINT.md\`.\n${releaseProse}`);
});
test('stale informal order follows manifest changes', () => {
  assert.equal(normalizeCopyPrompt('Read OLD.md, then OTHER.md. Keep this.', order), `${canonical} Keep this.`);
});
test('missing order is generated and custom prose retained', () => {
  assert.equal(normalizeCopyPrompt(releaseProse, order), `${canonical}\n\n${releaseProse}`);
});
test('duplicate competing sentences removed but adjacent prose retained', () => {
  const actual = normalizeCopyPrompt(`${canonical} Keep A. Read OLD.md, then OTHER.md. Keep B.`, order);
  assert.equal(actual, `${canonical} Keep A.  Keep B.`);
  assertPromptReadOrder(actual, order);
});
test('normalization is idempotent', () => {
  const once = normalizeCopyPrompt(`Read BUILDPRINT.md, then 00-goal.md. ${releaseProse}`, order);
  assert.equal(normalizeCopyPrompt(once, order), once);
});
test('unknown order grammar fails closed rather than creating conflicting instructions', () => {
  for (const text of ['Read files in order: all files.', 'Read order: whatever you like.', 'Read the package files in the manifest order.', 'Read OLD.md before BUILDPRINT.md.', `${canonical} Read OTHER.md then OLD.md without stopping.`]) {
    assert.throws(() => normalizeCopyPrompt(text, order), /Ambiguous/);
  }
});
test('output assertion rejects missing, stale, informal and duplicate orders', () => {
  for (const text of ['Keep prose.', 'Read order: `OLD.md`.', 'Read BUILDPRINT.md, then 00-goal.md.', `${canonical}\n${canonical}`]) {
    assert.throws(() => assertPromptReadOrder(text, order));
  }
});
test('manifest order validates type, nonempty, duplicates, paths and published membership', () => {
  for (const invalid of [null, [], 'BUILDPRINT.md', ['../secret.md'], ['BUILDPRINT.md','BUILDPRINT.md'], ['MISSING.md'], ['BAD`\n.md']]) {
    assert.throws(() => resolveReadOrder(invalid, order, order), /Invalid/);
  }
  assert.deepEqual(resolveReadOrder(undefined, order, order), order);
  assert.deepEqual(resolveReadOrder(['00-goal.md'], order, order), ['00-goal.md']);
});
test('custom prompt type/control injection rejected', () => {
  for (const text of [null, {}, '\u0000CANONICAL_READ_ORDER\u0000']) assert.throws(() => normalizeCopyPrompt(text, order));
});

test('authority prose mentioning required read order is preserved', () => {
  const text = 'BUILDPRINT.md owns the required read order, phase gates, and acceptance gates.';
  assert.equal(normalizeCopyPrompt(text, order), `${canonical}\n\n${text}`);
});
