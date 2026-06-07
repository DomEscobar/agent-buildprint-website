#!/usr/bin/env node
import crypto from 'node:crypto';
import http from 'node:http';
import { spawn } from 'node:child_process';

const host = process.env.DEPLOY_WEBHOOK_HOST || '127.0.0.1';
const port = Number(process.env.DEPLOY_WEBHOOK_PORT || '43118');
const path = process.env.DEPLOY_WEBHOOK_PATH || '/_github/agent-buildprint-deploy';
const secret = process.env.DEPLOY_WEBHOOK_SECRET || '';
const deployService = process.env.DEPLOY_SERVICE || 'agent-buildprint-deploy.service';
const allowedRepos = new Set((process.env.DEPLOY_ALLOWED_REPOS || 'DomEscobar/agent-buildprint,DomEscobar/agent-buildprint-website').split(',').map((repo) => repo.trim()).filter(Boolean));

if (!secret) {
  console.error('Missing DEPLOY_WEBHOOK_SECRET');
  process.exit(1);
}

function timingSafeEqual(a, b) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && crypto.timingSafeEqual(aBuffer, bBuffer);
}

function verifySignature(body, signature) {
  if (!signature?.startsWith('sha256=')) return false;
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(body).digest('hex')}`;
  return timingSafeEqual(expected, signature);
}

function startDeploy() {
  const child = spawn('systemctl', ['start', deployService], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
}

function respond(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(`${JSON.stringify(body)}\n`);
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    respond(res, 200, { ok: true });
    return;
  }

  if (req.method !== 'POST' || req.url !== path) {
    respond(res, 404, { ok: false, error: 'not_found' });
    return;
  }

  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    if (!verifySignature(body, req.headers['x-hub-signature-256'])) {
      respond(res, 401, { ok: false, error: 'bad_signature' });
      return;
    }

    const event = req.headers['x-github-event'];
    let payload;
    try {
      payload = JSON.parse(body.toString('utf8'));
    } catch {
      respond(res, 400, { ok: false, error: 'bad_json' });
      return;
    }

    if (event === 'ping') {
      respond(res, 200, { ok: true, event: 'ping' });
      return;
    }

    const repo = payload?.repository?.full_name;
    if (event !== 'push' || payload?.ref !== 'refs/heads/main' || !allowedRepos.has(repo)) {
      respond(res, 202, { ok: true, ignored: true, event, repo, ref: payload?.ref });
      return;
    }

    startDeploy();
    respond(res, 202, { ok: true, deploy: 'started', repo, after: payload?.after });
  });
});

server.listen(port, host, () => {
  console.log(`Agent Buildprint deploy webhook listening on http://${host}:${port}${path}`);
});
