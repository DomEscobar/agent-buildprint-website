import { createApp } from './app';
import { openEngagementDb } from './db';

const port = Number.parseInt(process.env.PORT || '3000', 10);
const databasePath = process.env.DATABASE_PATH || '/data/engagement.sqlite';
const db = openEngagementDb(databasePath);
const app = createApp(db);

Bun.serve({
  port,
  fetch: app.fetch,
});

console.log(`engagement api listening on :${port}`);
