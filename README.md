# rumahkodingku-academy

Course-based learning platform for RumahKodingku Academy.

## Applications

- `apps/web` — Next.js 16 frontend, port 3001.
- `apps/api` — NestJS API on Node.js 24 LTS, port 3000, base path `/api/v1`.
- `apps/docs` — Fumadocs documentation, port 4000.
- `packages/db` — TypeORM data source, entities, and migrations.
- `packages/env` — validated server/web environment.
- `packages/config` — shared TypeScript and tooling config.

Redis, Socket.io, PostHog, i18next, and Strapi are part of the MVP support stack. Strapi is marketing-content only; LMS data stays in MySQL through NestJS.

## Setup

```sh
pnpm install
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```

Create the `.env` files if examples are not present. Local development needs MySQL and Redis. Never commit real credentials.

## Local development

```sh
pnpm dev          # all apps
pnpm dev:web      # web only, http://localhost:3001
pnpm dev:api      # API only, http://localhost:3000/api/v1
pnpm dev:docs     # docs only, http://localhost:4000
```

## API

- Base path: `http://localhost:3000/api/v1`
- Health: `http://localhost:3000/api/v1/health`
- Swagger: `http://localhost:3000/swagger`
- Scalar: `http://localhost:3000/reference`
- CSRF token: `http://localhost:3000/api/v1/csrf/token`

Errors use RFC 9457 Problem Details (`application/problem+json`).

## Verification

```sh
pnpm format:check
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

Product and engineering decisions live in `docs/PLAN.md` and the supporting documents under `docs/`.
