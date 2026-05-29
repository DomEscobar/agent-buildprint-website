import { afterEach, expect, test } from 'bun:test';
import { createApp } from './app';
import { openEngagementDb } from './db';

const clientA = '11111111-1111-4111-8111-111111111111';
const clientB = '22222222-2222-4222-8222-222222222222';
const slug = 'buildprint-mapper-os';
const openDbs: Array<{ close: () => void }> = [];

function makeApp(now = new Date('2026-05-29T12:00:00.000Z')) {
  const db = openEngagementDb(':memory:', () => now);
  openDbs.push(db);
  return createApp(db);
}

function request(path: string, init?: RequestInit) {
  return new Request(`http://localhost${path}`, init);
}

async function body(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

afterEach(() => {
  while (openDbs.length) openDbs.pop()?.close();
});

test('engagement starts at zero for a valid slug', async () => {
  const app = makeApp();
  const response = await app.fetch(request(`/api/buildprints/${slug}/engagement?clientId=${clientA}`));

  expect(response.status).toBe(200);
  expect(await body(response)).toEqual({ slug, views: 0, likes: 0, liked: false });
});

test('views are deduped per client and UTC day', async () => {
  const app = makeApp();
  const init = { method: 'POST', body: JSON.stringify({ clientId: clientA }) };

  expect((await body(await app.fetch(request(`/api/buildprints/${slug}/view`, init)))).views).toBe(1);
  expect((await body(await app.fetch(request(`/api/buildprints/${slug}/view`, init)))).views).toBe(1);
  expect((await body(await app.fetch(request(`/api/buildprints/${slug}/view`, {
    method: 'POST',
    body: JSON.stringify({ clientId: clientB }),
  })))).views).toBe(2);
});

test('likes toggle on and off per client', async () => {
  const app = makeApp();
  const init = { method: 'POST', body: JSON.stringify({ clientId: clientA }) };

  expect(await body(await app.fetch(request(`/api/buildprints/${slug}/like`, init)))).toMatchObject({ likes: 1, liked: true });
  expect(await body(await app.fetch(request(`/api/buildprints/${slug}/like`, init)))).toMatchObject({ likes: 0, liked: false });
});

test('invalid slug and client id return bad request', async () => {
  const app = makeApp();

  expect((await app.fetch(request('/api/buildprints/Bad_Slug/engagement'))).status).toBe(400);
  expect((await app.fetch(request(`/api/buildprints/${slug}/view`, {
    method: 'POST',
    body: JSON.stringify({ clientId: 'not-a-client' }),
  }))).status).toBe(400);
});

test('health verifies database access', async () => {
  const app = makeApp();
  const response = await app.fetch(request('/api/health'));

  expect(response.status).toBe(200);
  expect(await body(response)).toEqual({ ok: true, database: 'ok' });
});
