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
  return createApp(db, { githubClientId: '', githubClientSecret: '' });
}

function signedInApp(now = new Date('2026-05-29T12:00:00.000Z')) {
  const db = openEngagementDb(':memory:', () => now);
  openDbs.push(db);
  const user = db.upsertGithubUser({ githubId: 123, githubLogin: 'DomEscobar', displayName: 'Dom' });
  const session = db.createSession(user.id);
  const app = createApp(db, {
    githubClientId: '',
    githubClientSecret: '',
    adminGithubLogins: 'DomEscobar',
    fetch: async (url) => {
      if (String(url).includes('/contents/')) {
        return Response.json([
          { name: 'BUILDPRINT.md' },
          {
            name: 'package.json',
            content: btoa(JSON.stringify({
              name: 'buildprint-mapper-os',
              files: [
                { path: 'BUILDPRINT.md', rawUrl: 'https://raw.githubusercontent.com/DomEscobar/agent-buildprint/main/buildprints/buildprint-mapper-os/BUILDPRINT.md' },
                { path: 'blueprint.yaml', rawUrl: 'https://raw.githubusercontent.com/DomEscobar/agent-buildprint/main/buildprints/buildprint-mapper-os/blueprint.yaml' },
              ],
              instructions: {
                canonicalStart: 'BUILDPRINT.md',
                readOrder: ['BUILDPRINT.md', 'blueprint.yaml'],
              },
            })),
          },
          { name: 'blueprint.yaml' },
          { name: 'README.md' },
        ]);
      }
      return Response.json({});
    },
  });
  return { app, cookie: `agb_session=${session.token}` };
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

test('auth reports signed out user and honest unconfigured GitHub OAuth', async () => {
  const app = makeApp();

  expect(await body(await app.fetch(request('/api/auth/me')))).toEqual({ user: null, admin: false });
  expect((await app.fetch(request('/api/auth/github/start'))).status).toBe(503);
  expect((await app.fetch(request('/api/me/profile', { method: 'PATCH', body: JSON.stringify({ displayName: 'Dom' }) }))).status).toBe(401);
});

test('community Buildprint submissions publish immediately, list, promote, and remove', async () => {
  const { app, cookie } = signedInApp();

  expect((await app.fetch(request('/api/me/buildprints', { method: 'POST', body: JSON.stringify({ githubUrl: 'https://not-github.example/repo' }), headers: { cookie } }))).status).toBe(400);

  const createdResponse = await app.fetch(request('/api/me/buildprints', {
    method: 'POST',
    headers: { cookie, 'content-type': 'application/json' },
    body: JSON.stringify({ githubUrl: 'https://github.com/DomEscobar/agent-buildprint/tree/main/buildprints/buildprint-mapper-os' }),
  }));
  expect(createdResponse.status).toBe(201);
  const created = await body(createdResponse);
  expect(created.submission).toMatchObject({ visibility: 'published', source: 'community', scanStatus: 'passed', trustBadge: null, discoveryTier: 'normal' });
  expect((created.submission as { badges: string[] }).badges).toContain('complete-package');
  expect((created.submission as { badges: string[] }).badges).toContain('canonical-read-order');
  expect((created.submission as { scanScore: number }).scanScore).toBeGreaterThanOrEqual(55);

  const publicList = await body(await app.fetch(request('/api/community-buildprints')));
  expect((publicList.submissions as unknown[]).length).toBe(1);

  const promoted = await body(await app.fetch(request(`/api/admin/buildprints/${(created.submission as { id: string }).id}/trust`, {
    method: 'PATCH',
    headers: { cookie, 'content-type': 'application/json' },
    body: JSON.stringify({ reviewStatus: 'reviewed', trustBadge: 'verified' }),
  })));
  expect(promoted.submission).toMatchObject({ reviewStatus: 'reviewed', trustBadge: 'verified' });

  const removeResponse = await app.fetch(request(`/api/me/buildprints/${(created.submission as { id: string }).id}`, { method: 'DELETE', headers: { cookie } }));
  expect(removeResponse.status).toBe(200);
  const mineAfterRemove = await body(await app.fetch(request('/api/me/buildprints', { headers: { cookie } })));
  expect((mineAfterRemove.submissions as unknown[]).length).toBe(0);
  const afterRemove = await body(await app.fetch(request('/api/community-buildprints')));
  expect((afterRemove.submissions as unknown[]).length).toBe(0);
});

test('high-risk or missing GitHub submissions stay manageable but hidden from public discovery', async () => {
  const db = openEngagementDb(':memory:', () => new Date('2026-05-29T12:00:00.000Z'));
  openDbs.push(db);
  const user = db.upsertGithubUser({ githubId: 456, githubLogin: 'MapperUser', displayName: 'Mapper' });
  const session = db.createSession(user.id);
  const app = createApp(db, {
    githubClientId: '',
    githubClientSecret: '',
    fetch: async (url) => {
      if (String(url).includes('/repos/sketchy/missing')) return new Response('{}', { status: 404 });
      return Response.json({});
    },
  });

  const createdResponse = await app.fetch(request('/api/me/buildprints', {
    method: 'POST',
    headers: { cookie: `agb_session=${session.token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ githubUrl: 'https://github.com/sketchy/missing' }),
  }));
  expect(createdResponse.status).toBe(201);
  const created = await body(createdResponse);
  expect(created.submission).toMatchObject({ visibility: 'published', scanStatus: 'failed', discoveryTier: 'hidden' });

  const mine = await body(await app.fetch(request('/api/me/buildprints', { headers: { cookie: `agb_session=${session.token}` } })));
  expect((mine.submissions as unknown[]).length).toBe(1);
  const publicList = await body(await app.fetch(request('/api/community-buildprints')));
  expect((publicList.submissions as unknown[]).length).toBe(0);
});

test('legacy buildprint.json submissions are limited until they publish current package metadata', async () => {
  const db = openEngagementDb(':memory:', () => new Date('2026-05-29T12:00:00.000Z'));
  openDbs.push(db);
  const user = db.upsertGithubUser({ githubId: 789, githubLogin: 'LegacyMapper', displayName: 'Legacy Mapper' });
  const session = db.createSession(user.id);
  const app = createApp(db, {
    githubClientId: '',
    githubClientSecret: '',
    fetch: async (url) => {
      if (String(url).includes('/contents/')) {
        return Response.json([
          { name: 'BUILDPRINT.md' },
          { name: 'buildprint.json' },
          { name: 'README.md' },
        ]);
      }
      return Response.json({});
    },
  });

  const createdResponse = await app.fetch(request('/api/me/buildprints', {
    method: 'POST',
    headers: { cookie: `agb_session=${session.token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ githubUrl: 'https://github.com/legacy/old-buildprint' }),
  }));
  expect(createdResponse.status).toBe(201);
  const created = await body(createdResponse);
  expect(created.submission).toMatchObject({ scanStatus: 'warning', discoveryTier: 'limited' });
  expect((created.submission as { badges: string[] }).badges).toContain('legacy-router');
  expect((created.submission as { badges: string[] }).badges).not.toContain('complete-package');
});

test('GitHub OAuth callback creates session and editable profile', async () => {
  const db = openEngagementDb(':memory:', () => new Date('2026-05-29T12:00:00.000Z'));
  openDbs.push(db);
  const app = createApp(db, {
    siteUrl: 'https://agent-buildprint.test',
    githubClientId: 'client',
    githubClientSecret: 'secret',
    cookieSecure: true,
    fetch: async (url) => {
      if (String(url).includes('/access_token')) return Response.json({ access_token: 'token' });
      return Response.json({ id: 123, login: 'DomEscobar', name: 'Dom', avatar_url: 'https://github.com/avatar.png', bio: 'Builder', blog: 'dom.example' });
    },
  });

  const start = await app.fetch(request('/api/auth/github/start'));
  const stateCookie = start.headers.get('set-cookie') || '';
  const state = stateCookie.match(/agb_oauth_state=([^;]+)/)?.[1] || '';
  const callback = await app.fetch(request(`/api/auth/github/callback?code=abc&state=${state}`, { headers: { cookie: `agb_oauth_state=${state}` } }));
  const sessionCookie = callback.headers.get('set-cookie') || '';
  const session = sessionCookie.match(/agb_session=([^;]+)/)?.[1] || '';

  expect(callback.status).toBe(302);
  expect(session.length).toBeGreaterThan(20);
  const me = await body(await app.fetch(request('/api/auth/me', { headers: { cookie: `agb_session=${session}` } })));
  expect(me.user).toMatchObject({ githubLogin: 'DomEscobar', displayName: 'Dom' });

  const updated = await body(await app.fetch(request('/api/me/profile', {
    method: 'PATCH',
    headers: { cookie: `agb_session=${session}` },
    body: JSON.stringify({ displayName: 'Dom E', bio: 'Buildprint maintainer', websiteUrl: 'agent-buildprint.com' }),
  })));
  expect(updated.user).toMatchObject({ displayName: 'Dom E', bio: 'Buildprint maintainer', websiteUrl: 'https://agent-buildprint.com/' });
});
