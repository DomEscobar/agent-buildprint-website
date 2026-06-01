import { randomBytes } from 'node:crypto';
import { openEngagementDb } from './db';

type EngagementDb = ReturnType<typeof openEngagementDb>;

type AppOptions = {
  siteUrl?: string;
  githubClientId?: string;
  githubClientSecret?: string;
  cookieSecure?: boolean;
  fetch?: typeof fetch;
};

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

function json(body: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...jsonHeaders, ...headers } });
}

function redirect(location: string, headers: HeadersInit = {}) {
  const responseHeaders = new Headers(headers);
  responseHeaders.set('location', location);
  return new Response(null, { status: 302, headers: responseHeaders });
}

function notFound() {
  return json({ error: 'not_found' }, 404);
}

function methodNotAllowed() {
  return json({ error: 'method_not_allowed' }, 405);
}

async function readJson(request: Request) {
  return request.json().catch(() => null);
}

async function readClientId(request: Request) {
  const payload = await readJson(request);
  return typeof payload?.clientId === 'string' ? payload.clientId : '';
}

function parseCookies(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const result = new Map<string, string>();
  for (const part of cookie.split(';')) {
    const [rawKey, ...rawValue] = part.trim().split('=');
    if (!rawKey) continue;
    result.set(rawKey, decodeURIComponent(rawValue.join('=')));
  }
  return result;
}

function cookie(name: string, value: string, options: { maxAge?: number; expires?: string; httpOnly?: boolean; secure?: boolean; sameSite?: 'Lax' | 'Strict' | 'None'; path?: string } = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${options.path || '/'}`, `SameSite=${options.sameSite || 'Lax'}`];
  if (options.httpOnly ?? true) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');
  if (typeof options.maxAge === 'number') parts.push(`Max-Age=${options.maxAge}`);
  if (options.expires) parts.push(`Expires=${new Date(options.expires).toUTCString()}`);
  return parts.join('; ');
}

function appendSetCookie(headers: Headers, value: string) {
  headers.append('set-cookie', value);
}

function sessionToken(request: Request) {
  return parseCookies(request).get('agb_session') || '';
}

function oauthState(request: Request) {
  return parseCookies(request).get('agb_oauth_state') || '';
}

function publicRuntime(options: Required<Pick<AppOptions, 'siteUrl'>> & AppOptions) {
  return {
    github: {
      enabled: Boolean(options.githubClientId && options.githubClientSecret),
    },
  };
}

export function createApp(db: EngagementDb, options: AppOptions = {}) {
  const siteUrl = (options.siteUrl || process.env.SITE_URL || 'https://agent-buildprint.com').replace(/\/$/, '');
  const githubClientId = options.githubClientId ?? process.env.GITHUB_CLIENT_ID ?? '';
  const githubClientSecret = options.githubClientSecret ?? process.env.GITHUB_CLIENT_SECRET ?? '';
  const cookieSecure = options.cookieSecure ?? (process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE !== 'false' : siteUrl.startsWith('https://'));
  const requestFetch = options.fetch ?? fetch;

  function authHeadersForLogin(userId: string) {
    const session = db.createSession(userId);
    const headers = new Headers();
    appendSetCookie(headers, cookie('agb_session', session.token, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: 'Lax',
      expires: session.expiresAt,
    }));
    return headers;
  }

  return {
    async fetch(request: Request) {
      const url = new URL(request.url);

      if (url.pathname === '/api/health') {
        if (request.method !== 'GET') return methodNotAllowed();
        try {
          return json(db.health());
        } catch {
          return json({ ok: false, database: 'error' }, 500);
        }
      }

      if (url.pathname === '/api/config') {
        if (request.method !== 'GET') return methodNotAllowed();
        return json(publicRuntime({ siteUrl, githubClientId, githubClientSecret }));
      }

      if (url.pathname === '/api/auth/me') {
        if (request.method !== 'GET') return methodNotAllowed();
        return json({ user: db.getUserBySessionToken(sessionToken(request)) });
      }

      if (url.pathname === '/api/auth/logout') {
        if (request.method !== 'POST') return methodNotAllowed();
        const token = sessionToken(request);
        if (token) db.deleteSessionToken(token);
        return json({ ok: true }, 200, {
          'set-cookie': cookie('agb_session', '', { maxAge: 0, secure: cookieSecure, sameSite: 'Lax' }),
        });
      }

      if (url.pathname === '/api/auth/github/start') {
        if (request.method !== 'GET') return methodNotAllowed();
        if (!githubClientId || !githubClientSecret) return json({ error: 'github_oauth_not_configured' }, 503);
        const state = randomBytes(24).toString('base64url');
        const authorize = new URL('https://github.com/login/oauth/authorize');
        authorize.searchParams.set('client_id', githubClientId);
        authorize.searchParams.set('redirect_uri', `${siteUrl}/api/auth/github/callback`);
        authorize.searchParams.set('scope', 'read:user');
        authorize.searchParams.set('state', state);
        return redirect(authorize.href, {
          'set-cookie': cookie('agb_oauth_state', state, { maxAge: 10 * 60, secure: cookieSecure, sameSite: 'Lax' }),
        });
      }

      if (url.pathname === '/api/auth/github/callback') {
        if (request.method !== 'GET') return methodNotAllowed();
        if (!githubClientId || !githubClientSecret) return json({ error: 'github_oauth_not_configured' }, 503);
        const code = url.searchParams.get('code') || '';
        const state = url.searchParams.get('state') || '';
        if (!code || !state || state !== oauthState(request)) return json({ error: 'invalid_oauth_state' }, 400);

        const tokenResponse = await requestFetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { accept: 'application/json', 'content-type': 'application/json' },
          body: JSON.stringify({ client_id: githubClientId, client_secret: githubClientSecret, code, redirect_uri: `${siteUrl}/api/auth/github/callback` }),
        });
        const tokenPayload = await tokenResponse.json().catch(() => null) as { access_token?: string; error?: string } | null;
        if (!tokenResponse.ok || !tokenPayload?.access_token) return json({ error: tokenPayload?.error || 'github_token_exchange_failed' }, 502);

        const userResponse = await requestFetch('https://api.github.com/user', {
          headers: { accept: 'application/vnd.github+json', authorization: `Bearer ${tokenPayload.access_token}`, 'user-agent': 'agent-buildprint-auth' },
        });
        const gh = await userResponse.json().catch(() => null) as { id?: number; login?: string; name?: string; avatar_url?: string; bio?: string; blog?: string } | null;
        if (!userResponse.ok || typeof gh?.id !== 'number' || typeof gh?.login !== 'string') return json({ error: 'github_user_fetch_failed' }, 502);

        const user = db.upsertGithubUser({
          githubId: gh.id,
          githubLogin: gh.login,
          displayName: gh.name || gh.login,
          avatarUrl: gh.avatar_url || '',
          bio: gh.bio || '',
          websiteUrl: gh.blog || '',
        });
        return redirect('/profile/', authHeadersForLogin(user.id));
      }

      if (url.pathname === '/api/me/profile') {
        const user = db.getUserBySessionToken(sessionToken(request));
        if (!user) return json({ error: 'unauthorized' }, 401);
        if (request.method === 'GET') return json({ user });
        if (request.method !== 'PATCH') return methodNotAllowed();
        return json({ user: db.updateUserProfile(user.id, await readJson(request)) });
      }

      const userMatch = url.pathname.match(/^\/api\/users\/([^/]+)$/);
      if (userMatch) {
        if (request.method !== 'GET') return methodNotAllowed();
        try {
          const user = db.getUserByLogin(decodeURIComponent(userMatch[1]));
          return user ? json({ user }) : notFound();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'bad_request';
          return message === 'invalid_github_login' ? json({ error: message }, 400) : json({ error: 'server_error' }, 500);
        }
      }

      const match = url.pathname.match(/^\/api\/buildprints\/([^/]+)\/(engagement|view|like)$/);
      if (!match) return notFound();

      const [, slug, action] = match;

      try {
        if (action === 'engagement') {
          if (request.method !== 'GET') return methodNotAllowed();
          const clientId = url.searchParams.get('clientId') || undefined;
          return json(db.getEngagement(slug, clientId));
        }

        if (action === 'view') {
          if (request.method !== 'POST') return methodNotAllowed();
          return json(db.recordView(slug, await readClientId(request)));
        }

        if (action === 'like') {
          if (request.method !== 'POST') return methodNotAllowed();
          return json(db.toggleLike(slug, await readClientId(request)));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'bad_request';
        if (message === 'invalid_slug' || message === 'invalid_client_id') {
          return json({ error: message }, 400);
        }
        return json({ error: 'server_error' }, 500);
      }

      return notFound();
    },
  };
}
