import { createApp } from './app';
import { openEngagementDb } from './db';

const port = Number.parseInt(process.env.PORT || '3000', 10);
const databasePath = process.env.DATABASE_PATH || '/data/engagement.sqlite';
const db = openEngagementDb(databasePath);
const app = createApp(db, {
  siteUrl: process.env.SITE_URL,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  cookieSecure: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE !== 'false' : undefined,
});

Bun.serve({
  port,
  fetch: app.fetch,
});

console.log(`engagement api listening on :${port}`);
