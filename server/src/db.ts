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
  `);

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

  return {
    getEngagement,
    recordView: recordViewTx,
    toggleLike: toggleLikeTx,
    upsertGithubUser: upsertGithubUserTx,
    createSession,
    getUserBySessionToken,
    getUserByLogin,
    updateUserProfile,
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
