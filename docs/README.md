# RumahKodingku Academy Documentation

**Version:** 1.3.0 | **Status:** Baseline approved | **Tagline:** Learn · Build · Grow

This package is the shared source of truth for product, design, engineering, QA, and operations.

## Document map

- `PLAN.md`: product vision, scope, users, outcomes, phases, and confirmed product decisions.
- `product/`: user journeys, functional requirements, business rules.
- `architecture/`: system boundaries, monorepo, technology decisions.
- `architecture/nextjs-architecture.md`: Next.js App Router rendering, routing, data, auth, caching, i18n, testing, and migration baseline.
- `database/`: relational model and ERD.
- `api/`: REST contract baseline.
- `design/`: design brief, visual direction, tokens, UX rules.
- `development/`: roadmap, coding standards, testing.
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

## Normative terms

**MUST** = mandatory; **SHOULD** = recommended; **MAY** = optional. “Recommended default” and “TBD” are not confirmed business decisions.

## Payment provider decision

Midtrans is the preferred initial provider candidate because its official onboarding documentation lists an Individual merchant category requiring owner KTP and NPWP. This is not an approval guarantee: merchant review and acceptance of online course/digital education sales must be confirmed directly with Midtrans. Xendit is not the initial choice while the business remains an unregistered individual; reconsider it if the business later registers as a recognized legal entity. Local mock payment is for development only; Midtrans Sandbox is for provider integration testing; neither may grant production enrollment.

## Assumptions requiring approval

These remain TBD and MUST NOT be implemented as fixed business rules without approval:

- Quiz default pass score, attempt limits, and time limits.
- Upload size/MIME/extension limits, file count, retention, and malware-scanning approach.
- Refund eligibility window and required evidence.
- Certificate numbering format, issuer wording, verification fields, and PDF template.
- Email provider and sending domain.
- Staging/production domains and cookie-domain strategy.
- Backup RPO/RTO and production sizing.
- Tax/fee display.
- Admin MFA rollout.
- PostHog event taxonomy and exact analytics metric definitions.
- Platform settings and announcement content model.
- Coupon value limits and review moderation SLA.

## AI-agent instructions

Read this file and relevant documents before changing code. Inspect the real repository and package versions. Do not invent business rules, roles, APIs, entities, environment variables, or dependencies. Backend authorization is authoritative. Add tests with behavior changes. Update all affected docs when contracts change. Never log secrets, tokens, cookies, or sensitive payment data.

When docs and code disagree, stop and reconcile both. The repository uses `apps/api` and Node.js 24 LTS. Do not reintroduce `apps/server` or Bun; treat any divergence as a defect to fix.

## Conflict resolution

Business behavior is governed by `product/business-rules.md`; functional acceptance by `product/functional-requirements.md`; technical contracts by architecture/database/API docs; visual rules by design docs. If conflicts exist, stop and propose a synchronized correction rather than guessing.
