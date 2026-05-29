import { openEngagementDb } from './db';

type EngagementDb = ReturnType<typeof openEngagementDb>;

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function notFound() {
  return json({ error: 'not_found' }, 404);
}

function methodNotAllowed() {
  return json({ error: 'method_not_allowed' }, 405);
}

async function readClientId(request: Request) {
  const payload = await request.json().catch(() => null);
  return typeof payload?.clientId === 'string' ? payload.clientId : '';
}

export function createApp(db: EngagementDb) {
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
