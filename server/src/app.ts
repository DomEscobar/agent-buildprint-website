import { randomBytes } from 'node:crypto';
import { openEngagementDb } from './db';

type EngagementDb = ReturnType<typeof openEngagementDb>;

type AppOptions = {
  siteUrl?: string;
  githubClientId?: string;
  githubClientSecret?: string;
  adminGithubLogins?: string;
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

function normalizeGithubUrl(raw: unknown) {
  if (typeof raw !== 'string') throw new Error('invalid_github_url');
  const input = raw.trim();
  if (!input || input.length > 600) throw new Error('invalid_github_url');
  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    throw new Error('invalid_github_url');
  }
  if (parsed.protocol !== 'https:' || parsed.hostname.toLowerCase() !== 'github.com') throw new Error('github_url_required');
  const parts = parsed.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  const [owner, repoRaw] = parts;
  const repo = repoRaw?.replace(/\.git$/, '');
  if (!owner || !repo || !/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repo)) throw new Error('invalid_github_url');
  let branch = 'main';
  let sourcePath = '';
  if (parts[2] === 'tree' || parts[2] === 'blob') {
    branch = parts[3] || 'main';
    sourcePath = parts.slice(4).join('/');
  }
  const normalized = `https://github.com/${owner}/${repo}${sourcePath ? `/tree/${branch}/${sourcePath}` : ''}`;
  const title = sourcePath.split('/').filter(Boolean).pop() || repo;
  return { githubUrl: input, normalizedGithubUrl: normalized, owner, repo, sourceBranch: branch, sourcePath, title };
}

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

function textFromBase64(value: unknown, max = 80_000) {
  if (typeof value !== 'string') return '';
  try {
    return atob(value.replace(/\n/g, '')).slice(0, max);
  } catch {
    return '';
  }
}

type GithubContentItem = { name?: unknown; download_url?: string; content?: string };

function contentItemName(item: unknown) {
  return typeof item === 'object' && item && 'name' in item ? String((item as GithubContentItem).name || '').toLowerCase() : '';
}

async function textFromContentItem(item: GithubContentItem | undefined, requestFetch: typeof fetch, max = 80_000) {
  if (!item) return '';
  if (item.content) return textFromBase64(item.content, max);
  if (item.download_url) {
    const response = await requestFetch(item.download_url, { headers: { 'user-agent': 'agent-buildprint-submission-scan' } });
    if (response.ok) return (await response.text()).slice(0, max);
  }
  return '';
}

function containsAny(haystack: string, needles: string[]) {
  return needles.some((needle) => haystack.includes(needle));
}

async function scanGithubBuildprint(input: ReturnType<typeof normalizeGithubUrl>, requestFetch: typeof fetch) {
  const badges = ['community'];
  const notes: string[] = [];
  let score = 20;
  try {
    const scanHeaders = { accept: 'application/vnd.github+json', 'user-agent': 'agent-buildprint-submission-scan' };
    const repoResponse = await requestFetch(`https://api.github.com/repos/${input.owner}/${input.repo}`, { headers: scanHeaders });
    if (!repoResponse.ok) {
      return { scanStatus: 'failed' as const, scanSummary: repoResponse.status === 404 ? 'Submitted but hidden from discovery: GitHub repo was not found.' : `Submitted but hidden from discovery: repo scan returned HTTP ${repoResponse.status}.`, scanScore: 0, discoveryTier: 'hidden' as const, badges: unique([...badges, 'needs-review']) };
    }
    const repo = await repoResponse.json().catch(() => ({})) as { description?: string; fork?: boolean; stargazers_count?: number; forks_count?: number; size?: number; created_at?: string; default_branch?: string; owner?: { login?: string; type?: string } };
    if (repo.description) score += 6;
    if ((repo.stargazers_count || 0) > 0) score += 4;
    if ((repo.forks_count || 0) > 0) score += 2;
    if ((repo.size || 0) > 0) score += 6;
    if (repo.fork) { score -= 8; badges.push('fork'); }
    if (repo.owner?.type === 'Organization') { score += 3; badges.push('org-owner'); }
    const created = repo.created_at ? Date.parse(repo.created_at) : 0;
    if (created && Date.now() - created > 14 * 24 * 60 * 60 * 1000) { score += 6; badges.push('established-repo'); }
    else notes.push('new repo');

    const apiUrl = new URL(`https://api.github.com/repos/${input.owner}/${input.repo}/contents/${input.sourcePath}`);
    apiUrl.searchParams.set('ref', input.sourceBranch || repo.default_branch || 'main');
    const response = await requestFetch(apiUrl.href, { headers: scanHeaders });
    if (!response.ok) {
      return { scanStatus: 'warning' as const, scanSummary: response.status === 404 ? 'Submitted with limited discovery: GitHub path could not be fetched yet.' : `Submitted with limited discovery: path scan returned HTTP ${response.status}.`, scanScore: Math.max(10, score - 15), discoveryTier: 'limited' as const, badges: unique([...badges, 'needs-review']) };
    }
    const payload = await response.json().catch(() => null) as unknown;
    const items = Array.isArray(payload) ? payload as GithubContentItem[] : payload && typeof payload === 'object' ? [payload as GithubContentItem] : [];
    const names = new Set(items.map(contentItemName));
    const fileNames = [...names].join(' ');
    badges.push('scanned');
    if (names.has('readme.md')) { score += 10; badges.push('readme'); } else notes.push('no README at submitted path');
    if (names.has('license') || names.has('license.md') || names.has('license.txt')) { score += 4; badges.push('license'); }
    const hasEntrypoint = names.has('buildprint.md');
    const hasPackageManifest = names.has('package.json');
    const hasBlueprintRouter = names.has('blueprint.yaml');
    const hasLegacyRouter = names.has('buildprint.json');
    if (hasEntrypoint) score += 20;
    if (hasPackageManifest) { score += 18; badges.push('package-manifest'); }
    if (hasBlueprintRouter) { score += 10; badges.push('blueprint-router'); }
    if (hasLegacyRouter) { score += 5; badges.push('legacy-router'); }
    if (containsAny(fileNames, ['agents.md', 'claude.md', 'cursor', 'codex', 'openclaw', 'mcp'])) { score += 7; badges.push('agent-workflow'); }
    if (containsAny(fileNames, ['src', 'app', 'server', 'package.json', 'pyproject.toml', 'go.mod'])) { score += 6; badges.push('implementation'); }

    const readmeItem = items.find((item) => contentItemName(item) === 'readme.md');
    const readme = await textFromContentItem(readmeItem, requestFetch);
    const packageJsonItem = items.find((item) => contentItemName(item) === 'package.json');
    let hasCanonicalPackage = false;
    if (packageJsonItem) {
      const packageText = await textFromContentItem(packageJsonItem, requestFetch);
      const packageJson = JSON.parse(packageText || '{}') as { name?: unknown; slug?: unknown; files?: unknown; instructions?: { canonicalStart?: unknown; readOrder?: unknown } };
      const manifestFiles = Array.isArray(packageJson.files) ? packageJson.files as Array<{ path?: unknown; rawUrl?: unknown }> : [];
      const manifestPaths = manifestFiles.map((file) => String(file.path || ''));
      const readOrder = Array.isArray(packageJson.instructions?.readOrder) ? packageJson.instructions.readOrder.map(String) : [];
      const hasCanonicalStart = packageJson.instructions?.canonicalStart === 'BUILDPRINT.md';
      const hasBuildprintFile = manifestPaths.includes('BUILDPRINT.md');
      const hasRawUrls = manifestFiles.some((file) => typeof file.rawUrl === 'string' && file.rawUrl.startsWith('http'));
      if (typeof packageJson.name === 'string' || typeof packageJson.slug === 'string') score += 2;
      if (hasCanonicalStart && readOrder.includes('BUILDPRINT.md')) { score += 10; badges.push('canonical-read-order'); }
      else notes.push('package.json missing canonical BUILDPRINT.md read order');
      if (hasBuildprintFile) score += 6;
      else notes.push('package.json does not list BUILDPRINT.md');
      if (hasRawUrls) { score += 6; badges.push('raw-file-manifest'); }
      else notes.push('package.json has no rawUrl file entries');
      if (readOrder.length > 1) { score += 4; badges.push('read-order'); }
      hasCanonicalPackage = hasCanonicalStart && readOrder.includes('BUILDPRINT.md') && hasBuildprintFile;
    }
    const scanText = `${input.owner} ${input.repo} ${input.sourcePath} ${repo.description || ''} ${readme}`.toLowerCase();
    const seriousSafety = [
      /-----begin (rsa |open)?private key-----/i,
      /gh[pousr]_[a-z0-9_]{30,}/i,
      /sk-[a-z0-9]{32,}/i,
      /aws_secret_access_key/i,
      /curl\s+[^|\n]+\|\s*(sudo\s+)?(bash|sh)/i,
      /wget\s+[^|\n]+\|\s*(sudo\s+)?(bash|sh)/i,
      /xmrig|cryptominer|walletsteal|token grabber/i,
    ];
    const softSafety = ['phishing', 'credential harvester', 'free nitro', 'crack serial', 'malware'];
    if (seriousSafety.some((pattern) => pattern.test(readme))) {
      return { scanStatus: 'failed' as const, scanSummary: 'Submitted but hidden from discovery: scanner found secrets-looking text or unsafe install patterns.', scanScore: Math.max(0, score - 55), discoveryTier: 'hidden' as const, badges: unique([...badges, 'security-review']) };
    }
    if (containsAny(scanText, softSafety)) { score -= 24; badges.push('needs-review'); notes.push('safety language'); }
    if (/official|admin|anthropic|openai|github|microsoft/.test(`${input.owner}/${input.repo}`.toLowerCase()) && repo.owner?.type !== 'Organization') {
      score -= 12;
      badges.push('needs-review');
      notes.push('possible impersonation wording');
    }

    if (hasEntrypoint && hasCanonicalPackage) {
      badges.push('complete-package', 'complete-files', 'runnable-candidate');
      const finalScore = Math.max(0, Math.min(100, score));
      return { scanStatus: finalScore >= 55 ? 'passed' as const : 'warning' as const, scanSummary: finalScore >= 55 ? 'Published with normal discovery. Scanner found a current Buildprint package manifest, canonical read order, repo context, and no high-risk signals.' : `Published with limited discovery. ${notes.join('; ') || 'Scanner wants more repo context.'}`, scanScore: finalScore, discoveryTier: finalScore >= 55 ? 'normal' as const : 'limited' as const, badges: unique(badges) };
    }
    if (hasEntrypoint && hasPackageManifest) return { scanStatus: 'warning' as const, scanSummary: `Published with limited discovery. Scanner found BUILDPRINT.md and package.json, but the package manifest is missing current canonical metadata. ${notes.join('; ')}`, scanScore: Math.max(25, Math.min(70, score)), discoveryTier: 'limited' as const, badges: unique([...badges, 'needs-review']) };
    if (hasEntrypoint && hasLegacyRouter) return { scanStatus: 'warning' as const, scanSummary: 'Published with limited discovery. Scanner found BUILDPRINT.md with legacy buildprint.json metadata; add package.json with canonical read order for normal discovery.', scanScore: Math.max(20, Math.min(68, score)), discoveryTier: 'limited' as const, badges: unique([...badges, 'needs-review']) };
    if (hasEntrypoint) return { scanStatus: 'warning' as const, scanSummary: 'Published with limited discovery. Scanner found BUILDPRINT.md but current package metadata may be missing.', scanScore: Math.max(20, Math.min(65, score)), discoveryTier: 'limited' as const, badges: unique([...badges, 'needs-review']) };
    return { scanStatus: 'warning' as const, scanSummary: 'Published with limited discovery. This looks like a normal GitHub project; run Mapper OS if it still needs Buildprint files.', scanScore: Math.max(10, Math.min(55, score)), discoveryTier: 'limited' as const, badges: unique([...badges, 'needs-review']) };
  } catch {
    return { scanStatus: 'warning' as const, scanSummary: 'Published with limited discovery. Scanner could not complete; retry/review later.', scanScore: Math.max(10, Math.min(45, score)), discoveryTier: 'limited' as const, badges: unique([...badges, 'needs-review']) };
  }
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
  const adminGithubLogins = (options.adminGithubLogins ?? process.env.ADMIN_GITHUB_LOGINS ?? 'DomEscobar').split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
  const cookieSecure = options.cookieSecure ?? (process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE !== 'false' : siteUrl.startsWith('https://'));
  const requestFetch = options.fetch ?? fetch;

  function currentUser(request: Request) {
    return db.getUserBySessionToken(sessionToken(request));
  }

  function isAdmin(user: { githubLogin: string } | null) {
    return Boolean(user && adminGithubLogins.includes(user.githubLogin.toLowerCase()));
  }

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
        const user = currentUser(request);
        return json({ user, admin: isAdmin(user) });
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
        const user = currentUser(request);
        if (!user) return json({ error: 'unauthorized' }, 401);
        if (request.method === 'GET') return json({ user });
        if (request.method !== 'PATCH') return methodNotAllowed();
        return json({ user: db.updateUserProfile(user.id, await readJson(request)) });
      }

      if (url.pathname === '/api/community-buildprints') {
        if (request.method !== 'GET') return methodNotAllowed();
        return json({ submissions: db.listPublicBuildprintSubmissions() });
      }

      if (url.pathname === '/api/me/buildprints') {
        const user = currentUser(request);
        if (!user) return json({ error: 'unauthorized' }, 401);
        if (request.method === 'GET') return json({ submissions: db.listUserBuildprintSubmissions(user.id) });
        if (request.method !== 'POST') return methodNotAllowed();
        try {
          const input = normalizeGithubUrl((await readJson(request))?.githubUrl);
          let submission = db.createBuildprintSubmission(user.id, { ...input, scanStatus: 'pending', scanSummary: 'Published instantly as Community. Scan queued.', badges: ['community'] });
          const scan = await scanGithubBuildprint(input, requestFetch);
          submission = db.updateBuildprintSubmissionScan(submission.id, { title: input.title, ...scan });
          return json({ submission }, 201);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'bad_request';
          if (['invalid_github_url', 'github_url_required'].includes(message)) return json({ error: message }, 400);
          return json({ error: 'server_error' }, 500);
        }
      }

      const mySubmissionMatch = url.pathname.match(/^\/api\/me\/buildprints\/([^/]+)$/);
      if (mySubmissionMatch) {
        const user = currentUser(request);
        if (!user) return json({ error: 'unauthorized' }, 401);
        if (request.method !== 'DELETE') return methodNotAllowed();
        try {
          return json(db.removeUserBuildprintSubmission(user.id, decodeURIComponent(mySubmissionMatch[1])));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'bad_request';
          return message === 'not_found' ? notFound() : json({ error: 'server_error' }, 500);
        }
      }

      const promoteMatch = url.pathname.match(/^\/api\/admin\/buildprints\/([^/]+)\/trust$/);
      if (promoteMatch) {
        const user = currentUser(request);
        if (!isAdmin(user)) return json({ error: user ? 'forbidden' : 'unauthorized' }, user ? 403 : 401);
        if (request.method !== 'PATCH') return methodNotAllowed();
        try {
          const payload = await readJson(request) as { source?: 'community' | 'official'; reviewStatus?: 'unreviewed' | 'reviewed' | 'rejected'; trustBadge?: null | 'verified' | 'official' | 'featured' } | null;
          return json({ submission: db.promoteBuildprintSubmission(decodeURIComponent(promoteMatch[1]), payload || {}) });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'bad_request';
          return message === 'not_found' ? notFound() : json({ error: 'server_error' }, 500);
        }
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
