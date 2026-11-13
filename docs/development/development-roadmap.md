# Comprehensive Development Roadmap — RumahKodingku Academy

**Version:** 1.3.0 | **Target:** Production-ready platform | **Execution:** Milestone-based

## 1. Baseline

This roadmap follows the approved product and technical decisions:

- Brand RumahKodingku Academy; parent brand RumahKodingku; tagline Learn · Build · Grow; Academy accent `#2563EB`.
- Next.js 16 + React 19, NestJS on Node.js 24 LTS in `apps/api`, Turborepo + pnpm, MySQL, TypeORM.
- Redis for cache and rate limiting; Socket.io for in-app notifications; PostHog for product analytics/flags; i18next with Indonesian default and English-ready structure; Strapi for marketing content only.
- JWT access + refresh tokens in HttpOnly cookies.
- Midtrans as preferred initial payment provider, subject to merchant onboarding approval; provider-neutral adapter; local mock for development and Midtrans Sandbox for integration tests.
- Local filesystem on persistent VPS storage.
- VPS deployment managed with Coolify.
- Roles USER and ADMIN only.
- Individual one-time course purchase with lifetime access.
- IDR integer money.
- Optional quizzes attached to exactly one lesson or section.
- Final project configurable per course; GitHub URL and deployment URL required when enabled; optional files; unlimited versioned resubmissions; no rejected state.
- Full refunds only; case-by-case ADMIN review.
- Automatic certificate after configured learning requirements and project approval where enabled; one active certificate per enrollment; reissue creates a new record.
- Ordered multi-course roadmaps with mandatory sequential progression.
- Course forum, lesson-level Q&A, YouTube or rich-text lesson content.
- One coupon per order; pre-moderated reviews; unique wishlists.
- API `/api/v1` with `{ data, meta }` success envelope and RFC 9457 Problem Details errors (`application/problem+json`).

## 2. Execution principles

1. Deliver vertical slices: UI, API, data, authorization, validation, tests, and docs together.
2. Backend is authoritative for pricing, coupons, payment, enrollment, progress, quiz grading, project review, certificates, reviews, and permissions.
3. Do not skip a phase whose exit criteria have not passed.
4. Do not convert assumptions into business rules without approval.
5. Production TypeORM `synchronize` MUST be false; use reviewed migrations.
6. Never grant enrollment from browser redirect alone.
7. Never commit or log secrets, tokens, cookies, or sensitive payment information.
8. Preserve financial, assessment, submission, certificate, and audit history.
9. Keep documentation and code synchronized. The backend lives in `apps/api` on Node.js 24; do not reintroduce `apps/server` or Bun.

## 3. Phase 0 — Product and policy readiness

**Goal:** close high-impact product decisions before building dependent behavior.

Approved decisions are recorded in `docs/product/decision-log.md`.

Tasks:

- Review all documents and resolve contradictions.
- Approve course completion formula: required lessons, required quizzes, final project when enabled, and additional requirements.
- Approve quiz question types, pass-score default, attempt policy, time limit, and answer review behavior.
- Approve refund window, evidence, full-refund rules, and access revocation timing.
- Approve certificate issuer, number format, verification fields, reissue and revocation policy.
- Approve upload limits, extensions/MIME, file count, retention, and malware-scanning approach.
- Confirm currency, payment methods, tax/fee display, and Midtrans merchant onboarding.
- Select email provider and sending domain.
- Confirm staging/production domains, DNS, and cookie domain strategy.
- Approve terms, privacy, refund wording, community rules, and data retention.
- Approve analytics event taxonomy, platform settings, and announcement scope.
- Create backlog tickets linked to FR/BR IDs and define acceptance criteria.

Deliverables: approved decision log (`docs/product/decision-log.md`), prioritized backlog (`docs/development/phase-0-backlog.md`), brand assets, external account checklist, Strapi content model.

Exit gate: no unresolved ambiguity affecting money, access, privacy, security, certificate eligibility, or data retention.

Status: Phase 0 decisions approved on 12 November 2026 in `docs/product/decision-log.md`. External setup (Midtrans onboarding, Resend domain verification, DNS/TLS, final legal review, official brand assets) remains pending but does not change the approved behavior.

## 4. Phase 1 — Repository and engineering foundation

Tasks:

- Inspect the existing repository before restructuring.
- Keep the NestJS API in `apps/api` with package/script name `api`.
- Keep runtime on Node.js 24 LTS: no Bun scripts/types; `@types/node`, `tsx` dev, Node build/start, Docker, and CI are aligned.
- Initialize/pin pnpm workspace and package-manager version.
- Configure Turborepo tasks: dev, build, lint, typecheck, test, format.
- Add shared packages only where justified: config, db, env, contracts, UI, utilities.
- Configure TypeScript strict mode, oxlint, oxfmt, and import boundaries.
- Add safe `.env.example`; configure local/test MySQL and Redis.
- Configure TypeORM, migration scripts, and seed scripts.
- Add API health endpoint, structured logging, request IDs, and `/api/v1` prefix.
- Implement canonical success/error response helpers and global exception filter.
- Add CI for frozen install, format check, lint, typecheck, tests, and build on Node 24.
- Exclude vendored `.agents/skills` from application lint.
- Document local setup and developer workflow.

Deliverables: reproducible monorepo, running web/API/docs, MySQL + Redis connection, migration baseline, green CI.

Exit gate: a new developer can clone, install, configure, run, test, and build using the docs; no secrets committed.

Status: Phase 1 foundation is implemented. Import boundaries are enforced through `.oxlintrc.json` (`no-restricted-imports`). Seed scripts and a separate test environment are intentionally deferred until the first entity and integration-test database exist.

## 5. Phase 2 — Architecture, data, and design foundations

Tasks:

- Establish API response/error conventions, DTO validation, and exception handling.
- Decide ID strategy, timestamps, naming conventions, and transaction patterns.
- Create initial migrations for users, sessions, courses, sections, lessons, categories, and audit base.
- Add enrollment, orders, payments, refunds, coupons, and coupon redemptions.
- Add quiz, roadmap, final project, rubric, certificate, review, wishlist, announcement, settings, and outbox tables.
- Verify migrations against a fresh disposable MySQL database in CI.
- Import official RumahKodingku logo and brand assets; use Academy Blue `#2563EB` as accent only.
- Define typography, neutral/semantic colors, spacing, breakpoints, radii, and elevation.
- Build accessible primitives: buttons, fields, selects, alerts, dialogs, tables, tabs, badges, skeletons, empty states.
- Build global layout, navigation, responsive container, and typography.
- Configure i18next with Indonesian default and English-ready resources.
- Define loading, empty, error, forbidden, and not-found patterns.
- Configure Strapi marketing content model and rendering boundary.

Deliverables: API/data foundation, design tokens, reusable components, responsive app shell, marketing-content integration.

Exit gate: migrations run cleanly; UI primitives have keyboard/focus states; parent brand colors are sourced from official assets, not guessed; Strapi cannot serve LMS data.

Status: Phase 2 implemented. Data foundation has 45 tables, UUID v7 entities, an initial schema migration, an additive outbox migration, and a CI migration verification step. Design foundations include semantic tokens, Geist typography, the official logo lockup, accessible Base UI primitives, responsive public shell, loading/empty/error/not-found patterns, Storybook 10 stories, and a marketing-only Strapi content contract with a server-only fetch boundary. Local exit-gate verification passes: fresh MySQL migration, primitive keyboard/focus tests, Playwright public-shell test, and a production build. The GitHub Actions run remains pending until this branch is pushed. Feature pages, the real Strapi app, and auth routes stay in later phases.

## 6. Phase 3 — Authentication and account security

Tasks:

- Registration with normalized email and secure password hashing.
- Login with safe generic error messages.
- Issue JWT access and refresh tokens via HttpOnly cookies.
- Configure Secure, HttpOnly, SameSite, Path, and domain flags correctly.
- Persist refresh sessions in MySQL; store token hashes/session identifiers, not raw tokens.
- Implement refresh rotation, reuse detection, and logout revocation.
- Add CSRF/origin protection for cookie-authenticated mutations.
- Rate-limit registration, login, refresh, and password reset using Redis.
- Implement USER/ADMIN guards and resource ownership checks.
- Prevent users from changing roles or privileged fields.
- Build profile UI, avatar upload, password reset, and email verification.
- Add unit, API integration, and E2E tests.

Exit gate: USER cannot access ADMIN APIs or other users' private resources; refresh rotation, logout, CSRF, and Redis rate-limit protections pass tests.

Status: Phase 3.A backend implemented. Adds a five-table RBAC schema (`roles`, `permissions`, `role_has_permissions`, `model_has_roles`, `model_has_permissions`, `guard_name=api`), `users_profile`, refresh-token families, and hashed email/reset tokens through migration `1794530367494-AddRbacAndUserProfiles`. Auth endpoints cover register, login, refresh rotation with reuse revocation, logout, session read/update, private avatar, email verification, resend, forgot, and reset. All non-GET auth endpoints require CSRF; auth routes use Redis rate limits with `Retry-After`. Authorization checks use `PermissionPolicy`, `EmailVerifiedPolicy`, and `OwnershipPolicy` helpers; role names are seed data only. Bootstrap CLIs `db:seed:rbac` and `auth:create-admin` are idempotent. Verification: `pnpm check-types`, `pnpm lint`, `pnpm format:check`, `pnpm test` (web 31, API 29), store contract tests (3), auth API integration tests (9), `pnpm build`, and API boot health checks (`/health/live`, `/health`) all pass locally. Phase 3.B frontend integration remains pending; `apps/web` still reads a local `role` field.

## 7. Phase 4 — Public site, catalog, and course authoring

Tasks:

- Build landing page using approved brand direction and Strapi marketing content.
- Build course catalog with search, filters, pagination, and featured/newest/popular sorting.
- Build course detail with outcomes, curriculum preview, prerequisites, price, lifetime-access terms, instructor/author, and certificate conditions.
- Ensure only published courses appear publicly and can be purchased.
- Add SEO metadata, sitemap, robots rules, and social metadata.
- Build admin shell and navigation.
- Implement course CRUD, unique slug, draft/published/archived states, and featured flag.
- Implement ordered section and lesson CRUD using `course_sections`.
- Support YouTube video lessons with validated URL and safe embed allowlist.
- Support rich-text editor with server-side sanitization.
- Add preview-before-publish and required/optional/preview lesson settings.
- Audit publish/unpublish and material content changes.

Exit gate: ADMIN can author and publish a course; visitors see only published content; XSS payloads are sanitized; invalid YouTube sources are rejected; discovery sorting matches the canonical definitions.

## 8. Phase 5 — Orders, payment, enrollment, and refunds

Tasks:

- Finalize order/payment/refund state machine and IDR integer money representation.
- Create order and order-item snapshots.
- Create orders using server-side current course price.
- Implement one coupon per order; validate eligibility, limits, and discount server-side.
- Prevent duplicate orders/fulfillment with idempotency and constraints.
- Implement the provider-neutral payment adapter and Midtrans integration using the current official API. Keep local mock and Midtrans Sandbox isolated from production.
- Persist provider references, amount, currency, and internal order reference.
- Verify webhook authenticity; persist and deduplicate event IDs.
- Reconcile amount, currency, reference, and provider state.
- Atomically mark payment paid and create enrollment once.
- Implement recovery/reconciliation for missed webhooks.
- Build checkout, coupon, pending/success/failed/expired screens.
- Build purchase history and admin payment lookup.
- Implement full-refund request, ADMIN review, provider processing, and enrollment revocation after confirmed success.
- Test forged, duplicate, delayed, out-of-order, mismatched, coupon, and refund cases.

Exit gate: verified success creates exactly one enrollment; failure/expiry creates none; browser redirect alone never grants access; full refund lifecycle is auditable; sandbox end-to-end flow passes.

## 9. Phase 6 — Learning player, progress, and certificates

Tasks:

- Enforce enrollment and roadmap prerequisite checks on every protected learning endpoint.
- Build My Learning dashboard.
- Build course player and section/lesson navigation.
- Render responsive YouTube lessons and sanitized rich text.
- Implement per-user/per-lesson progress with uniqueness constraint.
- Support required/optional/preview lessons and completion evaluator.
- Add next/previous lesson and resume behavior where appropriate.
- Show progress summary, completion requirements, and locked-state explanations.
- Implement certificate eligibility, unique number, verification code, PDF, QR, public verification, revocation, and reissue as a new record.
- Test direct API access, persistence, duplicate completion, concurrent updates, and concurrent issuance.

Exit gate: enrolled learner can resume across sessions; non-enrolled learner cannot access paid lessons; completion follows approved policy; no certificate before all requirements pass; reissue preserves audit history.

## 10. Phase 7 — Quiz and assessment

Tasks:

- Approve initial question types: multiple choice, multiple select, true/false, short answer.
- Implement quiz association with exactly one lesson or section.
- Build ADMIN question/option authoring and settings.
- Configure pass score, time limit, attempts, randomization, answer reveal, and required status.
- Build learner quiz instructions, attempt, and result UI.
- Grade objective questions and short answer server-side. Short answer uses exact match after trim/case/whitespace normalization.
- Persist attempts, answers, scores, and pass/fail.
- Ensure answer keys are never returned before submission.
- Connect required quiz status to course completion.
- Test scoring, normalization, attempt policy, concurrency, and answer leakage.

Exit gate: ADMIN can attach quizzes; backend grading is authoritative; configured attempt, time, pass, and reveal rules are enforced.

## 11. Phase 8 — Learning roadmaps and community

Tasks:

- Implement roadmap and ordered roadmap-course model.
- Build ADMIN roadmap CRUD and mandatory ordering.
- Configure sequential prerequisite evaluator.
- Build public roadmap detail and learner progress view.
- Distinguish completed, prerequisite-satisfied, locked, not-purchased, and available states.
- Enforce both prerequisite completion and paid enrollment.
- Handle archived/removed courses without corrupting history.
- Implement course discussion topics/replies and lesson Q&A.
- Enforce authentication, enrollment restrictions, edit/delete, report, pin/lock, accepted answer, moderation status, and moderation history.
- Implement in-app notifications with Socket.io and polling fallback.
- Configure email provider and transactional outbox.
- Test bypass through direct API calls, moderation audit, and notification retry safety.

Exit gate: roadmap order is enforced server-side and membership never grants unpaid access; community permissions are enforced; moderation is auditable; notification retries do not duplicate financial or learning actions.

## 12. Phase 9 — Supporting features, admin operations, and analytics

Tasks:

- Implement wishlist with unique user/course constraint.
- Implement course review/rating after completion; one review per enrollment; `PENDING` until ADMIN publishes.
- Implement coupon ADMIN CRUD and checkout validation; one coupon per order.
- Implement announcements and audited platform settings.
- Build admin user management, enrollment/order/payment lookup, and audit log viewer.
- Build MySQL-derived analytics: revenue, top courses, enrollment trend, completion rate, quiz pass rate, project approval rate, review time, certificates.
- Configure PostHog product analytics and feature flags; exclude financial/admin reports from PostHog.
- Add confirmation for high-risk actions and enforce admin MFA before production launch.
- Test permissions, state transitions, coupon limits, review moderation, and analytics correctness.

Exit gate: supporting features are usable; each sensitive action is auditable; analytics match MySQL source data; no PII or payment data leaks to PostHog.

## 13. Phase 10 — Security, accessibility, performance, reliability, and launch

Security:

- Threat-model auth, payment, coupon, upload, admin, community, review, and certificate flows.
- Test IDOR, privilege escalation, CSRF, CORS, CSP, headers, rate limits.
- Test XSS, YouTube allowlist, MIME spoofing, path traversal, upload abuse.
- Test webhook forgery, replay, duplicate, and out-of-order delivery.
- Test Socket.io identity spoofing and notification authorization.
- Scan dependencies and container images; review secrets and logs.
- Resolve critical/high findings or document approved mitigations.

Accessibility:

- Keyboard-only and screen-reader checks.
- Labels, errors, semantic structure, contrast, focus visibility.
- Zoom/reflow, responsive layouts, reduced motion.
- Captions/transcript guidance for video content.
- i18n layout checks with longer English strings.

Performance/reliability:

- Measure Core Web Vitals.
- Optimize images, fonts, bundles, and route loading.
- Review MySQL indexes/slow queries, Redis hit rate, and API concurrency.
- Test upload/storage capacity behavior.
- Test payment reconciliation/retries, app restart, migrations, and daily backup restore against RPO 24 hours / RTO 4 hours.
- Validate health checks, alerts, incident runbooks, Strapi availability, and Redis degradation behavior.

Staging/UAT/release:

- Provision staging in Coolify with domains, TLS, env vars, MySQL, Redis, Strapi, and persistent file volume.
- Configure Midtrans Sandbox notification URL and verify notification handling.
- Run all migrations from an empty database.
- Seed controlled test courses and test accounts.
- Run full automated E2E and manual UAT as Visitor, USER, and ADMIN.
- Verify email templates, links, uploads, backups, monitoring, and disk alerts.
- Rehearse deployment and rollback.
- Obtain sign-off for terms, privacy, refund, certificate, and brand.
- Freeze release scope and record known issues.

Exit gate: no unresolved critical vulnerabilities; critical regression passes; backup restore is demonstrated; accessibility/performance thresholds are approved and met; production smoke and controlled payment reconciliation pass.

## 14. Cross-phase Definition of Done

A task is done only when:

- Acceptance criteria pass.
- Validation and authorization are implemented.
- Applicable loading, empty, success, and error states exist.
- Unit/integration/E2E tests are added at appropriate levels.
- UI is responsive and accessible.
- Logs are safe and useful.
- Migrations are reviewed and tested.
- API/docs are updated.
- CI passes and code review is complete.

## 15. Release gates

| Gate                    | Evidence                                                                  |
| ----------------------- | ------------------------------------------------------------------------- |
| G0 Product ready        | Approved policies and backlog                                             |
| G1 Foundation ready     | Reproducible setup, green CI                                              |
| G2 Security baseline    | Auth, role, CSRF, Redis rate limits, safe storage                         |
| G3 Commerce ready       | Verified webhook, idempotent enrollment, coupon and full-refund lifecycle |
| G4 Learning ready       | Access, progress, quiz, sequential roadmap rules                          |
| G5 Assessment ready     | Versioned project review, certificate eligibility, reissue audit          |
| G6 Operations ready     | Refund, admin, analytics, announcements, settings, audit                  |
| G7 Production candidate | Security, accessibility, performance, restore                             |
| G8 Launch approved      | Staging UAT and owner sign-off                                            |
| G9 Stable handover      | Hypercare and runbooks complete                                           |

## 16. Parallel work and dependencies

Can run in parallel once interfaces are agreed:

- Design system and repository foundation.
- Public catalog UI and catalog API.
- Admin course editor and course-management API.
- Course player shell and progress API.
- Quiz authoring and learner quiz UI after contract freeze.
- Community UI and API after moderation/access rules are agreed.
- Strapi marketing content and public page shell.
- Coolify pipeline and app development after environment contract is defined.

Must remain sequential:

- Payment fulfillment after identity/order/data foundation.
- Enrollment before protected learning.
- Completion rules before certificate eligibility.
- Project approval before certificate issuance.
- Sequential roadmap before roadmap progress UI.
- Backup/restore proof before production.
- Staging UAT before production deployment.

## 17. Project board conventions

Statuses: Backlog → Ready → In Progress → Code Review → QA → Done; use Blocked when dependency prevents progress.

Every ticket must include phase/task ID, FR/BR reference, outcome, acceptance criteria, dependencies, tests, documentation impact, and security/risk notes. A phase is complete only after exit criteria and release-gate evidence pass.

## 18. Post-launch improvements (not initial commitments)

Prioritize from measured user feedback: course discovery/conversion, learning analytics, notification preferences, richer authoring, object storage before horizontal scaling, queue/search/CDN when justified. Roadmap bundles, additional roles, mobile apps, partial refunds, and new payment models require explicit product approval.
