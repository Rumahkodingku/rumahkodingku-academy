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
- E2E: `pnpm exec playwright test` (root config; `testDir` `apps/web/test/e2e`, baseURL `http://localhost:3001`, auto-starts API and web).
- DB: `pnpm db:push` / `pnpm db:studio` are declared but `packages/db` has no scripts, so they currently no-op.

## Package boundaries

- `apps/web`: Next.js 16, React 19, Tailwind 4, React Compiler, typed routes. Env via `packages/env/web` (`NEXT_PUBLIC_SERVER_URL`, default `http://localhost:3000`). API client base is `${NEXT_PUBLIC_SERVER_URL}/api/v1`.
- `apps/api`: NestJS on Node.js 24. Entry `src/main.ts`, listens on 3000, global prefix `/api/v1`, CORS from `CORS_ORIGIN`. Dev runs `tsdown` watch plus `node --watch dist/main.mjs`; build `tsdown` -> `dist/main.mjs`; start `node dist/main.mjs`. Direct node commands need cwd `apps/api` so `.env` loads; prefer `pnpm --filter api start`.
- `apps/docs`: Fumadocs + Next. Dev on 4000; build/check-types run `fumadocs-mdx` first.
- `packages/db`: TypeORM DataSource, `synchronize` is enabled only when `NODE_ENV !== "production"`. Exports `AppDataSource`, `initializeDatabase`, `db`, RBAC constants, seeds, and CLI scripts (`db:seed:rbac`, `auth:create-admin`); production must use migrations.
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
- Redis is cache/rate-limit only, never source of truth for orders/payments/enrollments/refresh sessions. Socket.io delivers in-app notifications with polling fallback. PostHog is product analytics/flags only; admin reports come from MySQL. Marketing content is local typed content in apps/web; LMS data stays in MySQL/NestJS.
- Default UI language is Indonesian (`id`); i18n is ready for English (`en`).
- TypeORM entity/migration globs are relative to process cwd; run DB work from `packages/db` or adjust globs when adding entities.
- `pnpm test` runs web unit/component tests and API unit tests; Playwright is not part of `pnpm test`. Web tests live under `apps/web/test/unit`; E2E under `apps/web/test/e2e`.
- Husky pre-commit runs lint-staged: `oxlint` + `oxfmt --write` on staged files.
- CI (`.github/workflows/ci.yml`): Node 24, frozen lockfile, format check, lint, check-types, build, test, contract/integration tests, and a Playwright job with MySQL, Redis, and Mailpit on push/PR to `dev`/`main`/`master`.
- `docker-compose.yml` maps web 3001, API 3000, MySQL 3308, Redis 6380, Prometheus 9091, Grafana 3100, Mailpit 8026/1026; Cloudflared is profile `tunnel`. Verify env values before use.
- Local infra commands: `docker compose config`, `docker compose up -d`, `docker compose --profile tunnel up -d`, `docker compose down`.
- `bts.jsonc` is generator metadata and may lag after manual migrations. Treat package manifests, lockfile, and `docs/PLAN.md` as authoritative for the current code.

<!-- antislop:start -->

## antislop

For UI, copy, people, mobile layout, or code comments work, read these installed skill files directly (use these paths even if a same-named global skill exists):

- Core filter, always on: `antislop`: `.agents/skills/antislop/SKILL.md`
- UI / visual: `antislop-ui`: `.agents/skills/antislop-ui/SKILL.md`
- Copy & text: `antislop-copywriting`: `.agents/skills/antislop-copywriting/SKILL.md`
- People: `antislop-human`: `.agents/skills/antislop-human/SKILL.md`
- Mobile / responsive: `antislop-layoutmobile`: `.agents/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `antislop-code`: `.agents/skills/antislop-code/SKILL.md`
  Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
  Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
  If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
  To update antislop later: `npx antislop-ai --update`, or run `npx antislop-ai` and pick Overwrite them.

<!-- antislop:end -->
