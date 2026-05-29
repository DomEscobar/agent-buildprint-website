# Production deploy automation

Production deploys are triggered by GitHub push webhooks from:

- `DomEscobar/agent-buildprint`
- `DomEscobar/agent-buildprint-website`

Both webhooks call the production host endpoint:

- `POST https://agent-buildprint.com/_github/agent-buildprint-deploy`

The endpoint verifies the GitHub `X-Hub-Signature-256` HMAC secret, ignores non-`push` events, ignores non-`main` refs, and only accepts the two allowed repos above. Accepted pushes start `agent-buildprint-deploy.service` asynchronously.

## Production host units

- `agent-buildprint-deploy-webhook.service` — localhost Node webhook receiver, proxied by nginx.
- `agent-buildprint-deploy.service` — oneshot deploy runner.

## Deploy script

The service runs:

```bash
scripts/deploy-production.sh
```

The script pulls source + website repos, runs validations, rebuilds Docker Compose, deploys, and verifies public health/package/bootstrap smoke checks. It uses a file lock so overlapping webhooks do not run concurrent deploys.

## Logs and health checks

On the production host:

```bash
systemctl status agent-buildprint-deploy-webhook.service
systemctl status agent-buildprint-deploy.service
journalctl -u agent-buildprint-deploy-webhook.service -n 100 --no-pager
tail -n 200 /var/log/agent-buildprint/deploy.log
```

Public health:

```bash
curl -fsS https://agent-buildprint.com/api/health
```

## Important behavior

A deploy only publishes when the gates pass. If `agent-buildprint` is currently failing tests, the webhook still fires but the deploy stops before rebuilding production.
