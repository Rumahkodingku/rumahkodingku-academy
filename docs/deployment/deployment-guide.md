# Deployment Guide — VPS + Coolify

## Topology

Initial single-node topology: VPS with Coolify; Next.js web container; NestJS API container on Node.js 24 LTS; MySQL with persistent volume; Redis; Strapi marketing CMS; persistent upload volume; Coolify reverse proxy/TLS; optional worker for notifications/reconciliation. This is not highly available by default.

```text
Internet
  └── Coolify reverse proxy / TLS
      ├── web (Next.js)
      ├── api (NestJS, Node 24)
      ├── strapi (marketing CMS)
      ├── mysql (private, persistent volume)
      └── redis (private)
```

## Environments

Separate local, CI/test, staging, production. Never reuse production database credentials, Redis, payment secrets, or Strapi content in lower environments.

## Configuration

Use Coolify-managed environment variables/secrets for app URLs, DB connection, Redis URL, JWT signing/session settings, cookie domain/security, Midtrans server/client keys and notification verification, upload root/policies, email provider, CORS origins, Socket.io origins, Strapi URL/token, PostHog key/host, logging/monitoring. Never commit actual values.

Minimum variable groups:

- Web: `NEXT_PUBLIC_SERVER_URL`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_STRAPI_URL`, `STRAPI_API_TOKEN`.
- API: `DATABASE_URL`, `CORS_ORIGIN`, `REDIS_URL`, `JWT_*`, `CSRF_SECRET`, `MIDTRANS_*`, `UPLOAD_ROOT`, `EMAIL_*`, `GARAGE_*`, `STRAPI_URL`, `POSTHOG_API_KEY`, `POSTHOG_HOST`, `LOG_LEVEL`, `METRICS_*`.
- Strapi: database connection, app keys, public URL, media storage configuration.

## Containers and persistence

Build immutable images from pinned dependencies; avoid `latest`; run non-root where practical; configure health checks; persist MySQL data, Strapi uploads, and LMS uploads on dedicated volumes; restrict permissions; keep backups outside the same VPS failure domain where possible.

- Web and API use Node.js 24 LTS images.
- Redis is private; persistence is optional because it is cache/rate-limit only.
- Strapi is a separate service with its own database/schema and backup. It is provisioned separately in Coolify; local compose may run without it because LMS core does not depend on Strapi.
- Do not run the API as Bun.

## Network

HTTPS for web/API; prefer same-site topology for cookies; strict CORS allowlist; expose only reverse-proxy ports; keep MySQL, Redis, and Strapi admin private; configure trusted proxy correctly. Socket.io requires WebSocket upgrade support at the proxy. If API instances scale horizontally, configure sticky sessions or a Socket.io adapter and shared upload storage.

## Release procedure

1. Review release notes/migrations and verify backup.
2. Build/test immutable images on Node 24.
3. Deploy staging and run migrations.
4. Run smoke and critical E2E tests.
5. Confirm Midtrans production notification URL and credentials.
6. Deploy production.
7. Apply backward-compatible migrations before dependent code.
8. Verify health, auth, payment, learning, upload, notification, and Strapi flows.
9. Monitor logs, webhook processing, Redis, errors, and disk.
10. Record release and operator.

## Database

TypeORM synchronize disabled. Review migration SQL; back up first; prefer additive changes; run migrations as a controlled release step; prepare forward-fix/rollback. Do not assume reversing a migration is safe after data writes. IDR integer money; no float columns.

## File storage

Mount stable persistent storage root; store relative keys in DB; keep uploads outside executable/public app root; monitor disk; back up DB and files consistently; test restore; retain submission evidence according to approved policy.

## Backup/recovery

Recommended daily DB backup and more frequent file backup based on approved RPO; encrypted off-site copy; approved retention; documented RPO/RTO; regular restore drills. Back up Strapi content and LMS files separately. A backup is not valid until restore-tested.

## Monitoring

CPU/memory/disk/container restarts; HTTP availability/latency/errors; MySQL health/slow queries; Redis health/latency; Midtrans notification failures/reconciliation; upload failures/disk; backup status; certificate issuance errors; Socket.io connection/error rates; Strapi availability; outbox lag.

## Security

HTTPS, Coolify secrets, strong DB/Redis credentials, private MySQL/Redis/Strapi admin, Secure HttpOnly cookies, CSRF, CORS allowlist, rate limits, admin MFA recommended, upload restrictions, patching, audit, encrypted backups. Never expose PostHog keys with server privileges; never send secrets or payment data to PostHog. Strapi must not receive LMS personal data.

## Rollback

Keep previous image versions. Roll back app image when safe; do not blindly reverse destructive migrations. Use forward-fix or tested restore for incompatible schema. Verify webhook processing and outbox state after rollback and record incident timeline.

## Local service setup

Local development uses Docker Compose for all infrastructure services:

- MySQL: `3308` (container `3306`)
- Redis: `6380` (container `6379`)
- Strapi: `1337` (community image `vshadbolt/strapi:latest`)
- Prometheus: `9091` (container `9090`)
- Grafana: `3100` (container `3000`)
- Databasus: `4005`
- Garage: `3904` S3 API, `3905` RPC, `3906` K2V, `3907` admin (container `3900`-`3903`)
- Mailpit: `8026` UI, `1026` SMTP
- Cloudflared: profile `tunnel`, no public port

Application processes can still run with `pnpm dev` for hot reload. Before production, verify:

```sh
docker compose config
docker compose up -d
docker compose --profile tunnel up -d
```

Local backup must be restore-tested before production. Mailpit is development-only. Garage can be introduced while MVP still uses local filesystem, but migration must be planned before switching storage.
