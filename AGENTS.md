# rumahkodingku-academy

pnpm workspaces + Turborepo. Apps: `apps/web` (Next.js), `apps/api` (NestJS, Node.js 24 LTS), `apps/docs` (Fumadocs). API base path is `/api/v1`.

## Commands

- Install: `pnpm install`
- Dev all: `pnpm dev`. URLs: web `http://localhost:3001`, API `http://localhost:3000/api/v1`, docs `http://localhost:4000`.
- Single app: `pnpm dev:web`, `pnpm dev:api`, `pnpm dev:docs`.
- Typecheck all: `pnpm check-types`.
- Lint: `pnpm lint` (oxlint; excludes vendored `.agents/skills`).
- Format: `pnpm format`; check only: `pnpm format:check`.
- Build all: `pnpm build`; docs build: `pnpm build:docs` (runs `fumadocs-mdx`).
- Commit check: `pnpm commitlint --edit <file>`; Husky runs it on `commit-msg`.
- Unit tests: `pnpm test` = `pnpm --filter web test && pnpm --filter api test`; both use `vitest run --passWithNoTests`. Focused: `pnpm --filter web test -- <file>` or `pnpm --filter api test -- <file>`.
- E2E: `pnpm exec playwright test` (root config; `testDir` `apps/web/e2e`, baseURL `http://localhost:3001`, auto-starts `pnpm dev`).
- DB: `pnpm db:push` / `pnpm db:studio` are declared but `packages/db` has no scripts, so they currently no-op.

## Package boundaries

- `apps/web`: Next.js 16, React 19, Tailwind 4, React Compiler, typed routes. Env via `packages/env/web` (`NEXT_PUBLIC_SERVER_URL`, default `http://localhost:3000`). API client base is `${NEXT_PUBLIC_SERVER_URL}/api/v1`.
- `apps/api`: NestJS on Node.js 24. Entry `src/index.ts`, listens on 3000, global prefix `/api/v1`, CORS from `CORS_ORIGIN`. Dev uses `tsx watch`; build `tsdown` -> `dist/index.mjs`; start `node dist/index.mjs`. Direct node commands need cwd `apps/api` so `.env` loads; prefer `pnpm --filter api start`.
- `apps/docs`: Fumadocs + Next. Dev on 4000; build/check-types run `fumadocs-mdx` first.
- `packages/db`: TypeORM DataSource, `synchronize` is enabled only when `NODE_ENV !== "production"`. Exports `AppDataSource`, `initializeDatabase`, `db`. No package scripts yet; production must use migrations.
- `packages/env`: t3 env. Server requires `DATABASE_URL`, `CORS_ORIGIN`; web requires `NEXT_PUBLIC_SERVER_URL`.
- `packages/config`: shared tsconfig base; `types: ["node"]`.

## Conventions and quirks

- API success envelope: `{ data, meta }`. Errors use RFC 9457 Problem Details (`application/problem+json`) with `type`, `title`, `status`, `detail`, `instance`, `code`, `requestId`, and optional `errors`. Filter lives in `apps/api/src/problem-details/problem-details.filter.ts`.
- API docs: Swagger at `/swagger`, Scalar at `/reference`; OpenAPI JSON at `/swagger-json`.
- CSRF: `GET /api/v1/csrf/token` returns a token; cookie-auth mutations must send `x-csrf-token`.
- Security/mail/storage/realtime baseline: `@nestjs/authentication`, `@nestjs/authorization`, `@nestjs/mail`, `@nestjs/storage`, `@nestjs/websockets`; auth providers/stores are not implemented yet.
- Learning structure is `Course → Section → Lesson`; use `course_sections`, not `course_modules`.
- Money is IDR integer; never float. Full refunds only in the MVP. One coupon per order.
- Final project is configurable per course; when enabled, GitHub URL + deployment URL are required, files optional. Review decisions are `REVISION_REQUIRED` or `APPROVED`; there is no `REJECTED`.
- Roadmaps are always sequential. Certificate reissue creates a new record; one active certificate per enrollment.
- Redis is cache/rate-limit only, never source of truth for orders/payments/enrollments/refresh sessions. Socket.io delivers in-app notifications with polling fallback. PostHog is product analytics/flags only; admin reports come from MySQL. Strapi is marketing-only; LMS data stays in MySQL/NestJS.
- Default UI language is Indonesian (`id`); i18n is ready for English (`en`).
- TypeORM entity/migration globs are relative to process cwd; run DB work from `packages/db` or adjust globs when adding entities.
- `pnpm test` currently runs seven API unit tests; Playwright is not part of `pnpm test`.
- Husky pre-commit runs lint-staged: `oxlint` + `oxfmt --write` on staged files.
- CI (`.github/workflows/ci.yml`): Node 24, frozen lockfile, format check, lint, check-types, build, test on push/PR to `main`/`master`.
- `docker-compose.yml` maps web 3001, API 3000, MySQL 3308, Redis 6380, Strapi 1337, Prometheus 9091, Grafana 3100, Databasus 4005, Garage 3904-3907, Mailpit 8026/1026; Cloudflared is profile `tunnel`. Verify env values before use.
- Local infra commands: `docker compose config`, `docker compose up -d`, `docker compose --profile tunnel up -d`, `docker compose down`.
- `bts.jsonc` is generator metadata and may lag after manual migrations. Treat package manifests, lockfile, and `docs/PLAN.md` as authoritative for the current code.
