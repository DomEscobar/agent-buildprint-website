import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Database } from 'bun:sqlite';

export type EngagementCounts = {
  slug: string;
  views: number;
  likes: number;
  liked: boolean;
};

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const clientIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Clock = () => Date;

type StatRow = {
  views_total: number;
  likes_total: number;
};

export function utcDay(date: Date) {
  return date.toISOString().slice(0, 10);
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

  function assertSlug(slug: string) {
    if (!slugPattern.test(slug)) throw new Error('invalid_slug');
  }

  function assertClientId(clientId: string) {
    if (!clientIdPattern.test(clientId)) throw new Error('invalid_client_id');
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

  return {
    getEngagement,
    recordView: recordViewTx,
    toggleLike: toggleLikeTx,
    health() {
      db.query('SELECT 1').get();
      return { ok: true, database: 'ok' };
    },
    close() {
      db.close();
    },
  };
}
