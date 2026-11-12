# Coding Guidelines

## Principles

Readable, explicit, maintainable code; TypeScript strict mode; testable business logic; no silent behavior changes.

## TypeScript

Avoid `any`; narrow `unknown`; define DTOs and public return types; use consistent finite-state types; keep shared contracts framework-neutral. Use Node.js 24 LTS types. Do not add Bun-specific globals or runtime assumptions.

## NestJS

Domain modules; controllers handle transport; services implement use cases; DTO validation on all external input; guards and ownership policies; explicit transactions; dependency injection; DTO mapping; safe errors; provider adapters behind interfaces.

API responses use:

- Success: `{ data, meta }`.
- Error: RFC 9457 Problem Details with `Content-Type: application/problem+json` and `type`, `title`, `status`, `detail`, `instance`, `code`, `requestId`, and optional `errors`.

Use `/api/v1` as the global prefix. Never return raw TypeORM entities. API docs are served at `/swagger` and `/reference`; the OpenAPI JSON is at `/swagger-json`.

Cookie-authenticated mutations require the CSRF token from `GET /api/v1/csrf/token` in the `x-csrf-token` header.

Use `@nestjs/mail` with Handlebars templates, `@nestjs/storage` with local/S3 disks, and NestJS WebSocket gateways for realtime notifications.

## TypeORM

Production synchronize disabled; reviewed migrations only; explicit relation loading; avoid N+1; define constraints/indexes intentionally; transactions for payment fulfillment, enrollment, certificate issuance, coupon redemption, and project version creation; no cascade deletion of financial, submission, or audit history.

Use `course_sections`, not `course_modules`. Money is IDR integer, never floating point.

## Next.js

App Router conventions; server components for data-oriented views; client components only for interactivity; centralized typed API client; loading/empty/error/unauthorized states; backend authorization authoritative; no secrets in public env variables.

Default UI language is Indonesian. Use the i18n layer for user-facing copy; keep keys stable and English-ready.

## Redis, Socket.io, PostHog, Strapi

- Redis: cache and rate limiting only. Never make it the source of truth for orders, payments, enrollments, or refresh sessions.
- Socket.io: in-app notifications. Authenticate the socket and derive identity from the session, never from client input. Provide polling fallback.
- PostHog: product analytics and feature flags only. Never send secrets or sensitive payment data. Admin reports use MySQL.
- Strapi: marketing content only. Do not store course, user, order, enrollment, or progress data there.

## Security

Validate/normalize input; sanitize rich text; parameterized ORM; CSRF protection; rate limits; redact secrets/tokens/cookies/payment data; validate uploads; generated storage keys; never build paths from user strings; verify webhooks/idempotency.

## Error handling

Stable application error codes. Distinguish validation, auth, authorization, not found, conflict, rate limit, and dependency failures. Return safe messages; log internal details with request ID.

## Tooling

- Lint: oxlint.
- Format: oxfmt.
- Typecheck: `pnpm check-types`.
- Unit/API tests: Vitest.
- E2E: Playwright.

Do not add ESLint/Prettier config unless the team explicitly changes tooling.

## Git/PR

Focused branches and reviewable PRs. Include purpose, scope, tests, migration notes, screenshots/API examples, rollback concerns. CI required. Never commit `.env`, credentials, dumps, user uploads, or generated secrets.

## AI coding agents

Read docs, inspect repository, verify versions and conventions, do not invent dependencies/endpoints/entities/env vars, add tests, avoid unrelated refactors, update docs, and report assumptions. The backend lives in `apps/api` on Node.js 24; do not reintroduce `apps/server` or Bun.
