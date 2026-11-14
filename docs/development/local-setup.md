# Local Development Setup

This guide is the entry point for running RumahKodingku Academy locally. It complements `development-roadmap.md` and the deployment guide.

## 1. Prerequisites

- Node.js 24 LTS.
- pnpm 10.34 or the pinned version in `package.json`.
- Docker Desktop or Docker Engine with Compose.
- Git.

## 2. Clone and install

```sh
git clone <repository-url>
cd rumahkodingku-academy
pnpm install
```

Do not use `npm` or `yarn`. The lockfile is authoritative.

## 3. Configure environment

```sh
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Minimum local values:

- `apps/api/.env`:
  - `DATABASE_URL=mysql://academy_user:academy_password@localhost:3308/rumahkodingku_academy`
  - `REDIS_URL=redis://localhost:6380`
  - `CORS_ORIGIN=http://localhost:3001`
  - `NODE_ENV=development`
  - `JWT_REFRESH_TTL=30d`
  - `JWT_REFRESH_ABSOLUTE_TTL=90d`
  - `WEB_APP_URL=http://localhost:3001`
  - `TRUST_PROXY=false`
- `apps/web/.env`:
  - `NEXT_PUBLIC_SERVER_URL=http://localhost:3001`
  - `NEXT_PUBLIC_SITE_URL=http://localhost:3001`
  - `API_URL=http://localhost:3000`
  - `AUTH_SESSION_COOKIE=access_token`
  - `AUTH_REFRESH_COOKIE=refresh_token`

Never commit real credentials. `.env` files are ignored.

## 4. Start infrastructure

```sh
docker compose up -d mysql redis mailpit
docker compose ps
```

Expected ports:

- MySQL: `localhost:3308`
- Redis: `localhost:6380`
- Mailpit UI: `http://localhost:8026`

## 5. Run database migrations

```sh
pnpm --filter @rumahkodingku-academy/db db:migrate
```

Expected: `Ran 0 migration(s)` on an up-to-date database. The migration seeds the `user` and `admin` RBAC roles, the `admin.access` permission, and the default role. `synchronize` is disabled; schema changes require migrations.

Seed RBAC idempotently when needed:

```sh
pnpm --filter @rumahkodingku-academy/db db:seed:rbac
```

## 6. Create the first admin

```sh
DATABASE_URL=mysql://academy_user:academy_password@localhost:3308/rumahkodingku_academy \
ADMIN_EMAIL=admin@example.com \
ADMIN_NAME="Academy Admin" \
ADMIN_PASSWORD="replace-with-a-long-password" \
pnpm --filter @rumahkodingku-academy/db auth:create-admin
```

The command is idempotent and does not run automatically at API boot. Use a strong password and do not commit it.

## 7. Start applications

All applications:

```sh
pnpm dev
```

Single application:

```sh
pnpm dev:web   # http://localhost:3001
pnpm dev:api   # http://localhost:3000/api/v1
pnpm dev:docs  # http://localhost:4000
```

## 8. Useful endpoints

- API health: `http://localhost:3000/api/v1/health`
- API live: `http://localhost:3000/api/v1/health/live`
- Swagger: `http://localhost:3000/swagger`
- Scalar: `http://localhost:3000/reference`
- OpenAPI JSON: `http://localhost:3000/swagger-json`
- CSRF token: `http://localhost:3000/api/v1/csrf/token`
- Metrics: `http://localhost:9090/metrics`

## 9. Verification

```sh
pnpm format:check
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

Focused tests:

```sh
pnpm --filter web test
pnpm --filter api test
pnpm --filter web test -- <file>
pnpm --filter api test -- <file>
```

Web unit and component tests live in `apps/web/test/unit/`; Playwright journeys live in `apps/web/test/e2e/`.

End-to-end tests need MySQL, Redis, and Mailpit:

```sh
docker compose up -d mysql redis mailpit
pnpm exec playwright install --with-deps chromium firefox webkit
pnpm exec playwright test
```

`playwright.config.ts` starts the web and API dev servers automatically, sets high auth rate limits for the test run, and reads Mailpit at `http://localhost:8026`. Run one project or file while iterating:

```sh
pnpm exec playwright test --project=chromium
pnpm exec playwright test apps/web/test/e2e/auth.spec.ts --workers=1
```

API storage contract and integration tests need a migrated test database and Redis:

```sh
docker compose exec -T mysql mysql -uroot -prootpassword -e "CREATE DATABASE IF NOT EXISTS rumahkodingku_academy_test"
docker compose exec -T mysql mysql -uroot -prootpassword -e "GRANT ALL PRIVILEGES ON rumahkodingku_academy_test.* TO 'academy_user'@'%'; FLUSH PRIVILEGES"

DATABASE_URL=mysql://academy_user:academy_password@localhost:3308/rumahkodingku_academy_test \
  pnpm --filter @rumahkodingku-academy/db db:migrate
DATABASE_URL=mysql://academy_user:academy_password@localhost:3308/rumahkodingku_academy_test \
REDIS_URL=redis://localhost:6380 \
  pnpm --filter api test:contract
DATABASE_URL=mysql://academy_user:academy_password@localhost:3308/rumahkodingku_academy_test \
REDIS_URL=redis://localhost:6380 \
  pnpm --filter api test:integration
```

Run contract tests and integration tests sequentially. Both truncate shared auth tables.

## 10. Database workflow

```sh
pnpm --filter @rumahkodingku-academy/db db:migrate
pnpm --filter @rumahkodingku-academy/db db:revert
pnpm --filter @rumahkodingku-academy/db db:generate <migration-name>
pnpm --filter @rumahkodingku-academy/db check-types
```

Run migrations as a controlled step. Do not enable production schema synchronization.

## 11. Troubleshooting

- **MySQL connection refused:** ensure `docker compose up -d mysql` is healthy and the port is `3308`. The API `.env` must use the `academy_user` database on port `3308`.
- **Redis timeout:** ensure Redis is on `6380` and `REDIS_URL` matches. The API `.env` must use `redis://localhost:6380`, not `6379`.
- **Env validation fails:** check `.env` values and required server variables.
- **Port already in use:** the Docker Compose `api` service also uses port `3000`. Run `docker compose stop api` before `pnpm dev:api`, or set `PORT` to another value.
- **Migration fails:** verify `DATABASE_URL`, MySQL user, and that migrations run from `packages/db`.
- **Build fails after dependency changes:** run `pnpm install`, then `pnpm build`.

## 12. Rules

- Use `pnpm`, not `npm` or `yarn`.
- Do not commit `.env` or credentials.
- Run migrations as a controlled step.
- Keep `synchronize` disabled.
- Follow `coding-guidelines.md` and `testing-strategy.md`.
