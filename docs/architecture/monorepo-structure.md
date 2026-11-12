# Monorepo Structure — Turborepo + pnpm

## Current tree

```text
repo/
├── apps/
│   ├── web/                 # Next.js frontend
│   ├── api/                 # NestJS API (Node.js 24 LTS)
│   └── docs/                # Fumadocs documentation
├── packages/
│   ├── config/              # Shared tooling config
│   ├── db/                  # TypeORM data source, entities, migrations
│   └── env/                 # Runtime environment validation
├── docs/                    # Product and engineering documentation
├── infra/                   # Deployment and operational scripts (planned)
├── .github/workflows/       # CI
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── turbo.json
```

`packages/contracts`, `packages/ui`, and `packages/utils` are planned only when a concrete shared need exists. Do not create empty shared packages.

## Ownership

- `apps/web` owns Next.js routes, rendering, UI, i18n, API client, and marketing-content rendering.
- `apps/api` owns NestJS modules, domain logic, validation, authorization, TypeORM, migrations, uploads, payments, notifications, and integration adapters.
- `apps/docs` owns Fumadocs content and documentation UI.
- `packages/db` owns the data source, entities, and migrations.
- `packages/env` owns validated server/web environment schemas.
- `packages/config` owns shared TypeScript and tooling configuration.
- Strapi is a separate marketing service; it never owns LMS data.

## Dependency rules

Apps may import shared packages; shared packages must not import apps. Browser code must not import server-only modules. Avoid circular dependencies and use explicit exports. Business rules remain authoritative in `apps/api`, not duplicated in UI.

## Workspace conventions

Use pnpm workspaces, pin the package-manager version, commit the lockfile, and use Turborepo tasks for build, lint, typecheck, test, and format. Do not cache migrations, deploys, or other side effects. Provide `.env.example` without secrets and separate local/test/staging/production environments.

Tooling:

- TypeScript strict mode via `packages/config/tsconfig.base.json`.
- Lint with oxlint.
- Format with oxfmt.
- Unit/API tests with Vitest.
- E2E with Playwright.
- Node.js 24 LTS for apps and CI.

## CI

Run frozen-lockfile install, format check, lint, typecheck, unit/integration tests, and production build. Validate migrations against disposable MySQL. Exclude vendored `.agents/skills` from application lint. Never run destructive resets against production.
