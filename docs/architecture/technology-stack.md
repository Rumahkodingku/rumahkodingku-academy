# Technology Stack

## Confirmed

| Layer                   | Choice                                                 |
| ----------------------- | ------------------------------------------------------ |
| Frontend                | Next.js 16 + React 19                                  |
| Backend                 | NestJS on Node.js 24 LTS, `apps/api`                   |
| Language                | TypeScript strict mode                                 |
| Monorepo                | Turborepo + pnpm                                       |
| Database                | MySQL 8                                                |
| ORM                     | TypeORM                                                |
| Auth                    | JWT access + refresh in HttpOnly cookies               |
| Payment                 | Midtrans (initial provider; merchant approval pending) |
| File storage            | Local filesystem on persistent VPS storage             |
| Cache/rate limit        | Redis                                                  |
| Realtime                | Socket.io                                              |
| Product analytics/flags | PostHog                                                |
| Marketing CMS           | Strapi (marketing content only)                        |
| i18n                    | i18next; Indonesian default, English-ready             |
| Deployment              | VPS + Coolify                                          |
| Lint/format             | oxlint + oxfmt                                         |
| Tests                   | Vitest + Playwright                                    |
| API docs                | Swagger + Scalar                                       |
| API errors              | RFC 9457 Problem Details                               |
| Auth                    | `@nestjs/authentication` + `@nestjs/authorization`     |
| Mail                    | `@nestjs/mail` + Handlebars                            |
| File storage            | `@nestjs/storage` (local, S3/Garage)                   |
| Realtime                | NestJS WebSocket gateway + Socket.io                   |

## API and money

- REST base path `/api/v1`.
- Success envelope `{ "data": {}, "meta": {} }`.
- Error envelope RFC 9457 Problem Details (`application/problem+json`) with `type`, `title`, `status`, `detail`, `instance`, `code`, `requestId`, and optional `errors`.
- DTO validation on every external input.
- IDR integer for all money. Never use floating point.
- ISO 8601 UTC timestamps.

## Version policy

Select mutually compatible stable versions at implementation start, record exact versions in manifests/lockfile/container tags, avoid `latest`, and upgrade through tested pull requests. The lockfile is the authority for installed versions; this document describes the chosen stack, not a substitute for the lockfile.

## MySQL/TypeORM

Use InnoDB and utf8mb4; production `synchronize=false`; schema changes through reviewed migrations; explicit indexes/constraints; transactions for payment fulfillment, enrollment, certificate issuance, coupon redemption, and project version creation; IDR integer money; UTC timestamps; DTO mapping.

## Next.js

Use App Router. Prefer server components for data pages; client components only for interactivity. Centralize the typed API client and error handling. Never expose secrets through public env variables. Backend authorization is authoritative. UI defaults to Indonesian and uses the i18n structure for future English translations.

## Payment provider — Midtrans initially

Use a provider-neutral backend adapter; implement Midtrans as the first provider. Use Midtrans Sandbox for integration testing and a separate local mock provider for local development. Verify notifications using the current official Midtrans contract; persist provider/event references; implement idempotency and reconciliation; validate supported payment/refund capabilities and the merchant’s digital-education product classification before launch. Never use sandbox credentials or mock outcomes in production. MVP supports full refunds only.

## Redis and Socket.io

Redis is used for cache and rate limiting, not as the source of truth for orders, payments, enrollments, or refresh sessions. Socket.io delivers in-app notifications with polling fallback; authenticate socket connections and never trust client-supplied user identity.

## PostHog and Strapi

PostHog supplies product analytics and feature flags; admin financial/learning reports remain MySQL-derived. Strapi supplies marketing content only and must not become a second source of truth for course, user, order, or enrollment data.

## Local storage

Use a dedicated persistent volume, generated opaque names, metadata records, backup/restore, and disk monitoring. Single-node local storage is not shared storage; plan migration before horizontal API scaling.
