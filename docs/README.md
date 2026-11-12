# RumahKodingku Academy Documentation

**Version:** 1.3.0 | **Status:** Baseline approved | **Tagline:** Learn · Build · Grow

This package is the shared source of truth for product, design, engineering, QA, and operations.

## Document map

- `PLAN.md`: product vision, scope, users, outcomes, phases, and confirmed product decisions.
- `product/`: user journeys, functional requirements, business rules, and the approved Phase 0 decision log.
- `architecture/`: system boundaries, monorepo, technology decisions.
- `architecture/nextjs-architecture.md`: Next.js App Router rendering, routing, data, auth, caching, i18n, testing, and migration baseline.
- `architecture/strapi-content-model.md`: marketing-only Strapi content contract, boundary, permissions, and fixtures.
- `database/`: relational model and ERD.
- `api/`: REST contract baseline.
- `design/`: design brief, visual direction, tokens, UX rules.
- `development/`: roadmap, coding standards, testing, local setup, and the Phase 0 backlog seed.
- `deployment/`: VPS + Coolify operating guide.
- `payments/payment-provider-decision.md`: approved provider direction and onboarding constraints.

## Confirmed decisions

Brand RumahKodingku Academy; parent brand RumahKodingku; tagline Learn · Build · Grow; Academy accent `#2563EB`; Next.js + NestJS on Node.js 24 LTS; Turborepo + pnpm; MySQL + TypeORM; local filesystem storage; VPS + Coolify; Midtrans as initial provider candidate (merchant approval pending), provider adapter + local mock sandbox; JWT access/refresh tokens in HttpOnly cookies; roles USER and ADMIN; individual one-time course purchase with lifetime access; optional quizzes configured by ADMIN; final project configurable per course, with GitHub URL + deployment URL required when enabled and optional files; unlimited resubmissions; automatic certificate after completion requirements and ADMIN approval; ordered multi-course roadmaps with mandatory sequential progression; course forum and lesson Q&A; YouTube or rich-text lessons; case-by-case ADMIN refund review with full refunds only in the MVP.

Supporting MVP services:

- Redis: cache and rate limiting. Not the source of truth for orders, payments, enrollments, or refresh sessions.
- Socket.io: in-app notification delivery with polling fallback.
- PostHog: product analytics and feature flags. Admin financial reports come from MySQL.
- i18n: Indonesian default; structure ready for English.
- Strapi: marketing content only. Course, user, order, and enrollment data stay in NestJS/MySQL.

Canonical API contract: `/api/v1`, success envelope `{ "data": {}, "meta": {} }`, RFC 9457 Problem Details errors (`application/problem+json`) with `type`, `title`, `status`, `detail`, `instance`, `code`, `requestId`, and optional `errors`. Swagger is at `/swagger`, Scalar at `/reference`, OpenAPI JSON at `/swagger-json`. CSRF token is issued by `GET /api/v1/csrf/token` and sent as `x-csrf-token`.

Canonical learning structure: `Course → Section → Lesson`; database table `course_sections`.

Canonical money representation: IDR integer. Never use floating point for money.

## Phase 0 decisions

The approved Phase 0 decision log is `product/decision-log.md`. It records the initial policy for:

- Course completion: required lessons, required quizzes, and final project approval when enabled.
- Quiz: multiple choice, multiple select, true/false, short answer; 70% pass; 3 attempts; 30 minutes; review after submission.
- Refund: 14 days from confirmed payment; evidence required; full refund only; access revoked after confirmed success.
- Certificate: `RumahKodingku Academy` issuer; `RK-YYYY-XXXXXX` code; name/course/date/issuer/status verification; reissue creates a new record.
- Uploads: 10 MB; JPG/JPEG/PNG/WebP/PDF/ZIP; 5 files per submission; 1-year retention; no malware scan in the MVP.
- Domains: `academy.rumahkodingku.com` and `api.rumahkodingku.com`; host-only auth cookies; staging isolated on separate hostnames.
- Email: Resend with `academy@rumahkodingku.com`.
- Analytics: minimal event taxonomy; MySQL remains the source for financial and learning reports.
- Tax/fee: show the final payable amount and any explicit fee line before payment confirmation.
- Coupons: max 100% discount, minimum purchase 0, global limit 100, per-user limit 1, no stacking.
- Admin MFA: required before production launch.
- Backup: daily database backup, 7-day retention, RPO 24 hours, RTO 4 hours.

## Normative terms

**MUST** = mandatory; **SHOULD** = recommended; **MAY** = optional. “Recommended default” and “TBD” are not confirmed business decisions.

## Payment provider decision

Midtrans is the preferred initial provider candidate because its official onboarding documentation lists an Individual merchant category requiring owner KTP and NPWP. This is not an approval guarantee: merchant review and acceptance of online course/digital education sales must be confirmed directly with Midtrans. Xendit is not the initial choice while the business remains an unregistered individual; reconsider it if the business later registers as a recognized legal entity. Local mock payment is for development only; Midtrans Sandbox is for provider integration testing; neither may grant production enrollment.

## Assumptions requiring approval

These remain TBD and MUST NOT be implemented as fixed business rules without approval:

- Production sizing and capacity validation.
- Review moderation SLA.
- Final legal review and publication of terms, privacy, refund, community, and retention wording.
- Official parent-brand assets and final Academy logo lockup.

Resolved Phase 0 items are recorded in `product/decision-log.md`; do not reopen them without a superseding decision.

## AI-agent instructions

Read this file and relevant documents before changing code. Inspect the real repository and package versions. Do not invent business rules, roles, APIs, entities, environment variables, or dependencies. Backend authorization is authoritative. Add tests with behavior changes. Update all affected docs when contracts change. Never log secrets, tokens, cookies, or sensitive payment data.

When docs and code disagree, stop and reconcile both. The repository uses `apps/api` and Node.js 24 LTS. Do not reintroduce `apps/server` or Bun; treat any divergence as a defect to fix.

## Conflict resolution

Business behavior is governed by `product/business-rules.md`; functional acceptance by `product/functional-requirements.md`; technical contracts by architecture/database/API docs; visual rules by design docs. If conflicts exist, stop and propose a synchronized correction rather than guessing.
