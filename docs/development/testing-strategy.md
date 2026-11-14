# Testing Strategy

## Goals

Verify business correctness, security, data integrity, payment reliability, UX, and production readiness.

## Levels

- Unit: domain services, validators, price/coupon calculations, transitions, permissions, grading, completion and certificate eligibility.
- Integration: NestJS + disposable MySQL, TypeORM, transactions, migrations, Redis, storage, provider adapters, outbox.
- API: HTTP auth, ownership, role, validation, errors, pagination, state transitions, idempotency.
- E2E: Playwright critical journeys across web/API, including realtime notification fallback.
- Security: IDOR, privilege escalation, CSRF, XSS, SQL injection resilience, brute force, upload abuse, webhook forgery/replay, secret leakage, Socket.io identity spoofing, admin MFA and recovery.
- Performance: catalog, learning player, admin lists, checkout/webhook under representative load, Redis rate limiting.
- Recovery: daily backup restore, RPO 24 hours, RTO 4 hours, migration rollback/forward-fix.

## Critical scenarios

Auth: valid/invalid login, refresh rotation/reuse, logout revocation, expired session, USER denied ADMIN, CSRF token issuance/enforcement/origin behavior, Redis rate-limit behavior.

API contract: RFC 9457 error shape, `application/problem+json`, stable `code`, `requestId`, and validation `errors`. Swagger and Scalar routes remain reachable.

Mail/storage/realtime: Handlebars template rendering, Resend transport isolation, local/S3 disk selection, authorized file access, WebSocket notification delivery, and polling fallback. Upload validation covers 10 MB, JPG/JPEG/PNG/WebP/PDF/ZIP, and the 5-file limit.

Commerce: server amount, IDR integer, coupon validation, one coupon per order, successful webhook creates one enrollment, duplicate webhook idempotent, forged event rejected, amount/currency/reference mismatch rejected, failed/expired no enrollment, browser redirect alone no access, reconciliation recovers missed event, full refund only, 14-day window and evidence enforcement, access revoked only after confirmed refund.

Learning: enrolled access/non-enrolled denial, preview access, roadmap prerequisite, progress persistence, rich-text XSS sanitized, invalid YouTube host rejected, completion formula.

Quiz: objective and short-answer grading, short-answer normalization, answer key hidden, default pass 70, 3 attempts, 30-minute limit, review after submit, required quiz completion, exactly one lesson/section association.

Project/certificate: URL/file validation, optional files, 10 MB/type/5-file limits, versioned resubmission, prior version immutable, ADMIN-only review, no certificate before approval where enabled, concurrent eligibility issues one certificate, `RK-YYYY-XXXXXX` code format, verification fields, revoked certificate verifies invalid, reissue creates a new record.

Community/engagement: ownership, enrollment, moderation audit, report flow, pinned/locked state, accepted answers, review pre-moderation, wishlist uniqueness, refund audit, user cannot change own role, notification delivery and fallback.

Admin/analytics: MySQL-derived reports, audit records, announcement/settings permissions, coupon limits, user status changes.

## Test data

Factories and deterministic fixtures; separate databases; Midtrans Sandbox credentials only; no real user/payment data; reset only disposable databases. Never use production Redis data in tests.

## Quality gates

PR: format, lint, typecheck, unit, relevant integration, build. Release: full integration/E2E, migrations, security, accessibility, performance smoke, backup/restore, manual critical journeys.

## Severity

Critical: data loss, unauthorized access, payment corruption, privilege escalation, certificate fraud; blocks release. High: core journey/security/privacy; blocks unless accepted with mitigation. Medium: degraded with workaround. Low: cosmetic/minor.

Record environment, commit/build, counts, failures, limitations, severity, and release decision. Investigate flaky tests; do not routinely ignore retries.
