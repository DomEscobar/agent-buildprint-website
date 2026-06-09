import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash, randomBytes } from 'node:crypto';
import { Database } from 'bun:sqlite';

export type EngagementCounts = {
  slug: string;
  views: number;
  likes: number;
  liked: boolean;
};

export type PublicUser = {
  id: string;
  githubId: number;
  githubLogin: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  websiteUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type BuildprintSubmission = {
  id: string;
  userId: string;
  githubUrl: string;
  normalizedGithubUrl: string;
  title: string;
  owner: string;
  repo: string;
  sourcePath: string;
  sourceBranch: string;
  visibility: 'published' | 'removed';
  source: 'community' | 'official';
  reviewStatus: 'unreviewed' | 'reviewed' | 'rejected';
  trustBadge: null | 'verified' | 'official' | 'featured';
  scanStatus: 'pending' | 'passed' | 'warning' | 'failed';
  scanSummary: string;
  scanScore: number;
  discoveryTier: 'normal' | 'limited' | 'hidden';
  badges: string[];
  tags: string[];
  submittedBy: Pick<PublicUser, 'id' | 'githubLogin' | 'displayName' | 'avatarUrl'>;
  createdAt: string;
  updatedAt: string;
  removedAt: string;
};

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const clientIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const githubLoginPattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

type Clock = () => Date;

type StatRow = {
  views_total: number;
  likes_total: number;
};

type UserRow = {
  id: string;
  github_id: number;
  github_login: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  website_url: string;
  created_at: string;
  updated_at: string;
};

type SessionRow = {
  id: string;
  user_id: string;
  expires_at: string;
};

type SubmissionRow = {
  id: string;
  user_id: string;
  github_url: string;
  normalized_github_url: string;
  title: string;
  owner: string;
  repo: string;
  source_path: string;
  source_branch: string;
  visibility: 'published' | 'removed';
  source: 'community' | 'official';
  review_status: 'unreviewed' | 'reviewed' | 'rejected';
  trust_badge: null | 'verified' | 'official' | 'featured';
  scan_status: 'pending' | 'passed' | 'warning' | 'failed';
  scan_summary: string;
  scan_score: number;
  discovery_tier: 'normal' | 'limited' | 'hidden';
  badges_json: string;
  tags_json: string;
  created_at: string;
  updated_at: string;
  removed_at: string;
  github_login: string;
  display_name: string;
  avatar_url: string;
};

export function utcDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function createSessionToken() {
  return randomBytes(32).toString('base64url');
}

function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    githubId: row.github_id,
    githubLogin: row.github_login,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    websiteUrl: row.website_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function parseJsonArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function toSubmission(row: SubmissionRow): BuildprintSubmission {
  return {
    id: row.id,
    userId: row.user_id,
    githubUrl: row.github_url,
    normalizedGithubUrl: row.normalized_github_url,
    title: row.title,
    owner: row.owner,
    repo: row.repo,
    sourcePath: row.source_path,
    sourceBranch: row.source_branch,
    visibility: row.visibility,
    source: row.source,
    reviewStatus: row.review_status,
    trustBadge: row.trust_badge,
    scanStatus: row.scan_status,
    scanSummary: row.scan_summary,
    scanScore: row.scan_score ?? 0,
    discoveryTier: row.discovery_tier || 'limited',
    badges: parseJsonArray(row.badges_json),
    tags: parseJsonArray(row.tags_json),
    submittedBy: {
      id: row.user_id,
      githubLogin: row.github_login,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    removedAt: row.removed_at,
  };
}

function cleanProfileText(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function cleanUrl(value: unknown) {
  const raw = cleanProfileText(value, 300);
  if (!raw) return '';
  try {
    const parsed = new URL(raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    return parsed.href;
  } catch {
    return '';
  }
}

export function openEngagementDb(databasePath: string, clock: Clock = () => new Date()) {
  if (databasePath !== ':memory:') mkdirSync(dirname(databasePath), { recursive: true });

  const db = new Database(databasePath, { create: true });
  if (databasePath !== ':memory:') db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(`
    CREATE TABLE IF NOT EXISTS buildprint_stats (
      slug TEXT PRIMARY KEY,
      views_total INTEGER NOT NULL DEFAULT 0 CHECK (views_total >= 0),
      likes_total INTEGER NOT NULL DEFAULT 0 CHECK (likes_total >= 0),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS buildprint_view_events (
      slug TEXT NOT NULL,
      client_id TEXT NOT NULL,
      viewed_on TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (slug, client_id, viewed_on)
    );

    CREATE TABLE IF NOT EXISTS buildprint_likes (
      slug TEXT NOT NULL,
      client_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (slug, client_id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      github_id INTEGER NOT NULL UNIQUE,
      github_login TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL DEFAULT '',
      avatar_url TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      website_url TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

    CREATE TABLE IF NOT EXISTS buildprint_submissions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      github_url TEXT NOT NULL,
      normalized_github_url TEXT NOT NULL,
      title TEXT NOT NULL,
      owner TEXT NOT NULL,
      repo TEXT NOT NULL,
      source_path TEXT NOT NULL DEFAULT '',
      source_branch TEXT NOT NULL DEFAULT 'main',
      visibility TEXT NOT NULL DEFAULT 'published' CHECK (visibility IN ('published', 'removed')),
      source TEXT NOT NULL DEFAULT 'community' CHECK (source IN ('community', 'official')),
      review_status TEXT NOT NULL DEFAULT 'unreviewed' CHECK (review_status IN ('unreviewed', 'reviewed', 'rejected')),
      trust_badge TEXT CHECK (trust_badge IN ('verified', 'official', 'featured')),
      scan_status TEXT NOT NULL DEFAULT 'pending' CHECK (scan_status IN ('pending', 'passed', 'warning', 'failed')),
      scan_summary TEXT NOT NULL DEFAULT '',
      scan_score INTEGER NOT NULL DEFAULT 0,
      discovery_tier TEXT NOT NULL DEFAULT 'limited' CHECK (discovery_tier IN ('normal', 'limited', 'hidden')),
      badges_json TEXT NOT NULL DEFAULT '["community"]',
      tags_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      removed_at TEXT NOT NULL DEFAULT ''
    );

    CREATE INDEX IF NOT EXISTS buildprint_submissions_user_id_idx ON buildprint_submissions(user_id);
    CREATE INDEX IF NOT EXISTS buildprint_submissions_visibility_idx ON buildprint_submissions(visibility, updated_at);
  `);

  for (const migration of [
    "ALTER TABLE buildprint_submissions ADD COLUMN scan_score INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE buildprint_submissions ADD COLUMN discovery_tier TEXT NOT NULL DEFAULT 'limited' CHECK (discovery_tier IN ('normal', 'limited', 'hidden'))",
  ]) {
    try { db.exec(migration); } catch { /* column already exists */ }
  }
  db.exec('CREATE INDEX IF NOT EXISTS buildprint_submissions_discovery_idx ON buildprint_submissions(visibility, discovery_tier, scan_score, updated_at);');

  const ensureStats = db.query(`
    INSERT OR IGNORE INTO buildprint_stats (slug, created_at, updated_at)
    VALUES ($slug, $now, $now)
  `);
  const selectStats = db.query<StatRow, [string]>('SELECT views_total, likes_total FROM buildprint_stats WHERE slug = ?');
  const selectLike = db.query<{ present: number }, [string, string]>('SELECT 1 AS present FROM buildprint_likes WHERE slug = ? AND client_id = ?');
  const insertView = db.query(`
    INSERT OR IGNORE INTO buildprint_view_events (slug, client_id, viewed_on, created_at)
    VALUES ($slug, $clientId, $viewedOn, $now)
  `);
  const incrementViews = db.query('UPDATE buildprint_stats SET views_total = views_total + 1, updated_at = $now WHERE slug = $slug');
  const insertLike = db.query('INSERT INTO buildprint_likes (slug, client_id, created_at) VALUES ($slug, $clientId, $now)');
  const deleteLike = db.query('DELETE FROM buildprint_likes WHERE slug = $slug AND client_id = $clientId');
  const incrementLikes = db.query('UPDATE buildprint_stats SET likes_total = likes_total + 1, updated_at = $now WHERE slug = $slug');
  const decrementLikes = db.query(`
    UPDATE buildprint_stats
    SET likes_total = CASE WHEN likes_total > 0 THEN likes_total - 1 ELSE 0 END,
        updated_at = $now
    WHERE slug = $slug
  `);

  const selectUserByGithubId = db.query<UserRow, [number]>('SELECT * FROM users WHERE github_id = ?');
  const selectUserByLogin = db.query<UserRow, [string]>('SELECT * FROM users WHERE lower(github_login) = lower(?)');
  const selectUserBySessionHash = db.query<UserRow, [string, string]>(`
    SELECT users.* FROM users
    JOIN sessions ON sessions.user_id = users.id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?
  `);
  const insertUser = db.query(`
    INSERT INTO users (id, github_id, github_login, display_name, avatar_url, bio, website_url, created_at, updated_at)
    VALUES ($id, $githubId, $githubLogin, $displayName, $avatarUrl, $bio, $websiteUrl, $now, $now)
  `);
  const updateGithubUser = db.query(`
    UPDATE users SET github_login = $githubLogin, avatar_url = $avatarUrl, updated_at = $now
    WHERE github_id = $githubId
  `);
  const updateProfile = db.query(`
    UPDATE users SET display_name = $displayName, bio = $bio, website_url = $websiteUrl, updated_at = $now
    WHERE id = $id
  `);
  const insertSession = db.query(`
    INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at)
    VALUES ($id, $userId, $tokenHash, $now, $expiresAt)
  `);
  const deleteSession = db.query('DELETE FROM sessions WHERE token_hash = ?');
  const deleteExpiredSessions = db.query('DELETE FROM sessions WHERE expires_at <= ?');

  const submissionSelect = `
    SELECT buildprint_submissions.*, users.github_login, users.display_name, users.avatar_url
    FROM buildprint_submissions
    JOIN users ON users.id = buildprint_submissions.user_id
  `;
  const selectPublicSubmissions = db.query<SubmissionRow, []>(`${submissionSelect} WHERE visibility = 'published' AND review_status != 'rejected' AND discovery_tier != 'hidden' ORDER BY CASE discovery_tier WHEN 'normal' THEN 0 ELSE 1 END, scan_score DESC, datetime(buildprint_submissions.updated_at) DESC LIMIT 200`);
  const selectUserSubmissions = db.query<SubmissionRow, [string]>(`${submissionSelect} WHERE user_id = ? AND visibility = 'published' ORDER BY datetime(buildprint_submissions.updated_at) DESC`);
  const selectSubmissionById = db.query<SubmissionRow, [string]>(`${submissionSelect} WHERE buildprint_submissions.id = ?`);
  const insertSubmission = db.query(`
    INSERT INTO buildprint_submissions (
      id, user_id, github_url, normalized_github_url, title, owner, repo, source_path, source_branch,
      visibility, source, review_status, trust_badge, scan_status, scan_summary, scan_score, discovery_tier, badges_json, tags_json, created_at, updated_at
    ) VALUES (
      $id, $userId, $githubUrl, $normalizedGithubUrl, $title, $owner, $repo, $sourcePath, $sourceBranch,
      'published', 'community', 'unreviewed', NULL, $scanStatus, $scanSummary, $scanScore, $discoveryTier, $badgesJson, '[]', $now, $now
    )
  `);
  const updateSubmissionScan = db.query(`
    UPDATE buildprint_submissions
    SET title = $title, scan_status = $scanStatus, scan_summary = $scanSummary, scan_score = $scanScore, discovery_tier = $discoveryTier, badges_json = $badgesJson, updated_at = $now
    WHERE id = $id
  `);
  const removeSubmission = db.query(`
    UPDATE buildprint_submissions SET visibility = 'removed', removed_at = $now, updated_at = $now WHERE id = $id AND user_id = $userId
  `);
  const promoteSubmission = db.query(`
    UPDATE buildprint_submissions
    SET source = $source, review_status = $reviewStatus, trust_badge = $trustBadge, updated_at = $now
    WHERE id = $id
  `);

  function assertSlug(slug: string) {
    if (!slugPattern.test(slug)) throw new Error('invalid_slug');
  }

  function assertClientId(clientId: string) {
    if (!clientIdPattern.test(clientId)) throw new Error('invalid_client_id');
  }

  function assertGithubLogin(login: string) {
    if (!githubLoginPattern.test(login)) throw new Error('invalid_github_login');
  }

  function touchStats(slug: string, now = clock().toISOString()) {
    ensureStats.run({ $slug: slug, $now: now });
  }

  function getEngagement(slug: string, clientId?: string): EngagementCounts {
    assertSlug(slug);
    if (clientId) assertClientId(clientId);

    touchStats(slug);
    const row = selectStats.get(slug);
    return {
      slug,
      views: row?.views_total ?? 0,
      likes: row?.likes_total ?? 0,
      liked: clientId ? Boolean(selectLike.get(slug, clientId)) : false,
    };
  }

  const recordViewTx = db.transaction((slug: string, clientId: string) => {
    assertSlug(slug);
    assertClientId(clientId);
    const current = clock();
    const now = current.toISOString();
    touchStats(slug, now);
    const inserted = insertView.run({
      $slug: slug,
      $clientId: clientId,
      $viewedOn: utcDay(current),
      $now: now,
    });
    if (inserted.changes > 0) incrementViews.run({ $slug: slug, $now: now });
    return getEngagement(slug, clientId);
  });

  const toggleLikeTx = db.transaction((slug: string, clientId: string) => {
    assertSlug(slug);
    assertClientId(clientId);
    const now = clock().toISOString();
    touchStats(slug, now);
    if (selectLike.get(slug, clientId)) {
      deleteLike.run({ $slug: slug, $clientId: clientId });
      decrementLikes.run({ $slug: slug, $now: now });
    } else {
      insertLike.run({ $slug: slug, $clientId: clientId, $now: now });
      incrementLikes.run({ $slug: slug, $now: now });
    }
    return getEngagement(slug, clientId);
  });

  const upsertGithubUserTx = db.transaction((input: {
    githubId: number;
    githubLogin: string;
    displayName?: string;
    avatarUrl?: string;
    bio?: string;
    websiteUrl?: string;
  }) => {
    assertGithubLogin(input.githubLogin);
    const now = clock().toISOString();
    const existing = selectUserByGithubId.get(input.githubId);
    if (existing) {
      updateGithubUser.run({
        $githubId: input.githubId,
        $githubLogin: input.githubLogin,
        $avatarUrl: cleanUrl(input.avatarUrl),
        $now: now,
      });
      return toPublicUser(selectUserByGithubId.get(input.githubId)!);
    }
    const id = randomBytes(16).toString('hex');
    insertUser.run({
      $id: id,
      $githubId: input.githubId,
      $githubLogin: input.githubLogin,
      $displayName: cleanProfileText(input.displayName || input.githubLogin, 80),
      $avatarUrl: cleanUrl(input.avatarUrl),
      $bio: cleanProfileText(input.bio, 240),
      $websiteUrl: cleanUrl(input.websiteUrl),
      $now: now,
    });
    return toPublicUser(selectUserByGithubId.get(input.githubId)!);
  });

  function createSession(userId: string, days = 30) {
    const token = createSessionToken();
    const nowDate = clock();
    const expires = new Date(nowDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
    insertSession.run({
      $id: randomBytes(16).toString('hex'),
      $userId: userId,
      $tokenHash: hashSessionToken(token),
      $now: nowDate.toISOString(),
      $expiresAt: expires,
    });
    return { token, expiresAt: expires };
  }

  function getUserBySessionToken(token?: string) {
    if (!token) return null;
    const row = selectUserBySessionHash.get(hashSessionToken(token), clock().toISOString());
    return row ? toPublicUser(row) : null;
  }

  function getUserByLogin(login: string) {
    assertGithubLogin(login);
    const row = selectUserByLogin.get(login);
    return row ? toPublicUser(row) : null;
  }

  function updateUserProfile(userId: string, payload: unknown) {
    const input = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
    const current = db.query<UserRow, [string]>('SELECT * FROM users WHERE id = ?').get(userId);
    if (!current) throw new Error('not_found');
    const displayName = cleanProfileText(input.displayName ?? current.display_name, 80) || current.github_login;
    const bio = cleanProfileText(input.bio ?? current.bio, 240);
    const websiteUrl = cleanUrl(input.websiteUrl ?? current.website_url);
    updateProfile.run({
      $id: userId,
      $displayName: displayName,
      $bio: bio,
      $websiteUrl: websiteUrl,
      $now: clock().toISOString(),
    });
    return toPublicUser(db.query<UserRow, [string]>('SELECT * FROM users WHERE id = ?').get(userId)!);
  }

  function createBuildprintSubmission(userId: string, input: {
    githubUrl: string;
    normalizedGithubUrl: string;
    title: string;
    owner: string;
    repo: string;
    sourcePath: string;
    sourceBranch: string;
    scanStatus?: 'pending' | 'passed' | 'warning' | 'failed';
    scanSummary?: string;
    badges?: string[];
    scanScore?: number;
    discoveryTier?: 'normal' | 'limited' | 'hidden';
  }) {
    const now = clock().toISOString();
    const id = randomBytes(16).toString('hex');
    insertSubmission.run({
      $id: id,
      $userId: userId,
      $githubUrl: cleanProfileText(input.githubUrl, 600),
      $normalizedGithubUrl: cleanProfileText(input.normalizedGithubUrl, 600),
      $title: cleanProfileText(input.title, 120),
      $owner: cleanProfileText(input.owner, 80),
      $repo: cleanProfileText(input.repo, 120),
      $sourcePath: cleanProfileText(input.sourcePath, 300),
      $sourceBranch: cleanProfileText(input.sourceBranch, 120) || 'main',
      $scanStatus: input.scanStatus || 'pending',
      $scanSummary: cleanProfileText(input.scanSummary, 500),
      $scanScore: Math.max(0, Math.min(100, Math.round(input.scanScore ?? 0))),
      $discoveryTier: input.discoveryTier || 'limited',
      $badgesJson: JSON.stringify([...(new Set(['community', ...(input.badges || [])]))]),
      $now: now,
    });
    return toSubmission(selectSubmissionById.get(id)!);
  }

  function updateBuildprintSubmissionScan(id: string, input: { title?: string; scanStatus: 'pending' | 'passed' | 'warning' | 'failed'; scanSummary: string; scanScore: number; discoveryTier: 'normal' | 'limited' | 'hidden'; badges: string[] }) {
    const current = selectSubmissionById.get(id);
    if (!current) throw new Error('not_found');
    updateSubmissionScan.run({
      $id: id,
      $title: cleanProfileText(input.title || current.title, 120),
      $scanStatus: input.scanStatus,
      $scanSummary: cleanProfileText(input.scanSummary, 500),
      $scanScore: Math.max(0, Math.min(100, Math.round(input.scanScore))),
      $discoveryTier: input.discoveryTier,
      $badgesJson: JSON.stringify([...(new Set(['community', ...input.badges]))]),
      $now: clock().toISOString(),
    });
    return toSubmission(selectSubmissionById.get(id)!);
  }

  function listPublicBuildprintSubmissions() {
    return selectPublicSubmissions.all().map(toSubmission);
  }

  function listUserBuildprintSubmissions(userId: string) {
    return selectUserSubmissions.all(userId).map(toSubmission);
  }

  function removeUserBuildprintSubmission(userId: string, id: string) {
    const result = removeSubmission.run({ $id: id, $userId: userId, $now: clock().toISOString() });
    if (result.changes < 1) throw new Error('not_found');
    return { ok: true };
  }

  function promoteBuildprintSubmission(id: string, input: { source?: 'community' | 'official'; reviewStatus?: 'unreviewed' | 'reviewed' | 'rejected'; trustBadge?: null | 'verified' | 'official' | 'featured' }) {
    const current = selectSubmissionById.get(id);
    if (!current) throw new Error('not_found');
    promoteSubmission.run({
      $id: id,
      $source: input.source || current.source,
      $reviewStatus: input.reviewStatus || current.review_status,
      $trustBadge: input.trustBadge ?? current.trust_badge,
      $now: clock().toISOString(),
    });
    return toSubmission(selectSubmissionById.get(id)!);
  }

  return {
    getEngagement,
    recordView: recordViewTx,
    toggleLike: toggleLikeTx,
    upsertGithubUser: upsertGithubUserTx,
    createSession,
    getUserBySessionToken,
    getUserByLogin,
    updateUserProfile,
    createBuildprintSubmission,
    updateBuildprintSubmissionScan,
    listPublicBuildprintSubmissions,
    listUserBuildprintSubmissions,
    removeUserBuildprintSubmission,
    promoteBuildprintSubmission,
    deleteSessionToken(token: string) {
      deleteSession.run(hashSessionToken(token));
    },
    health() {
      db.query('SELECT 1').get();
      deleteExpiredSessions.run(clock().toISOString());
      return { ok: true, database: 'ok' };
    },
    close() {
      db.close();
    },
  };
}
