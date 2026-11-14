# Database Design — MySQL + TypeORM

## Principles

Relational integrity; normalized transactional/learning data; explicit foreign keys; production migrations; UTC timestamps; exact money representation (IDR integer, never FLOAT/DOUBLE); unique constraints for idempotency. Do not cascade-delete financial, certificate, submission, or audit history.

## Entity catalogue

### Identity

- `users`: account only — email, password hash, status (`ACTIVE`/`SUSPENDED`/`DELETED`), email verified timestamp, timestamps. No role or profile columns.
- `users_profile`: one-to-one user profile — display name, full name, username, bio, headline, avatar storage key, phone, country code, city, timezone, locale, website/GitHub/LinkedIn/X/Instagram URLs, email/in-app notification preferences, timestamps.
- `roles`: RBAC role name, guard name (`api`), description, default-role flag, timestamps.
- `permissions`: RBAC permission name, guard name, description, timestamps.
- `role_has_permissions`: role/permission pivot.
- `model_has_roles`: polymorphic user-role pivot (`model_type='user'`, `model_id` UUID).
- `model_has_permissions`: polymorphic direct user-permission pivot.
- `refresh_token_families`: user, absolute expiry, revoked timestamp.
- `refresh_sessions`: hashed token, family, expiry, family expiry, used timestamp, claims, revoked time, device metadata, user.
- `email_verification_tokens`, `password_reset_tokens`: hashed token, email, optional fingerprint, expiry, consumed time, user.

### Catalog

- `courses`: slug, title, short/full description, thumbnail/banner file references, category, difficulty, language, estimated duration, learning outcomes, prerequisites, instructor name/bio/avatar, price, discount, status, completion policy, final-project enabled flag, featured flag, publishedAt, created/updated timestamps.
- `course_sections`: course, title, description, ordered position.
- `lessons`: section, title, description, content type (`YOUTUBE_VIDEO`/`RICH_TEXT`), video reference, rich-text body, duration, required flag, preview flag, ordered position, status.
- `categories`: name, slug, description, ordered position, active flag.
- `course_categories`: course/category join.

### Commerce

- `orders`: user, order number, status, currency (`IDR`), subtotal, discount total, coupon code snapshot, total, idempotency key, timestamps.
- `order_items`: order, course, course title/price snapshot.
- `payments`: order, provider, provider reference, method, status, amount, currency, paid/expired timestamps, raw metadata reference.
- `payment_webhook_events`: provider, provider event ID, payload hash, processing state, processed timestamp, error metadata.
- `refund_requests`: order/payment, user, reason, evidence, amount, status, reviewer, decision reason, provider reference, timestamps.
- `coupons`: code, type (`PERCENTAGE`/`FIXED`), value, maximum discount, minimum purchase, starts/expires, global limit, per-user limit, active flag, eligible course scope.
- `coupon_redemptions`: coupon, user, order, redeemed amount, timestamp.

### Learning

- `enrollments`: unique user+course, source (`PURCHASE`/`FREE`/`ADMIN_GRANT`), source order/reference, granted_by, reason, status (`ACTIVE`/`SUSPENDED`/`REVOKED`), timestamps.
- `lesson_progress`: unique user+lesson, status (`NOT_STARTED`/`IN_PROGRESS`/`COMPLETED`), completed timestamp.
- `quizzes`: course, optional lesson/section reference (exactly one), title, description, pass score, time limit, attempt limit, randomize questions/options, answer reveal timing, required flag, status.
- `quiz_questions`: quiz, type (`MULTIPLE_CHOICE`/`MULTIPLE_SELECT`/`TRUE_FALSE`/`SHORT_ANSWER`), prompt, explanation, ordered position, points, normalized answer key for short answer.
- `quiz_options`: question, label, is correct, ordered position.
- `quiz_attempts`: quiz, user, attempt number, started/submitted timestamps, score, passed flag, status.
- `quiz_answers`: attempt, question, selected option references or short-answer text, awarded points, correct flag.

### Roadmap

- `roadmaps`: slug, title, description, thumbnail file reference, status, timestamps.
- `roadmap_courses`: roadmap, course, ordered position. Unique roadmap+position and roadmap+course.

Roadmaps are always sequential. No optional-prerequisite column is required in the MVP.

### Project and certificate

- `final_projects`: course, title, description, instructions, requirements, submission guide, deadline, minimum score, files enabled flag, enabled flag.
- `project_rubric_criteria`: final project, label, weight, ordered position. Weights must total 100.
- `project_submissions`: final project, user, version, GitHub URL, deployment URL, description, notes, status (`SUBMITTED`/`UNDER_REVIEW`/`REVISION_REQUIRED`/`APPROVED`), reviewer, feedback, reviewed timestamp.
- `submission_files`: submission, storage key, display filename, MIME, extension, byte size, checksum, timestamps.
- `submission_scores`: submission, rubric criterion, score, reviewer.
- `certificates`: enrollment, user, course, unique number, verification code, issuer, issued timestamp, status (`ISSUED`/`REVOKED`), revoked timestamp/reason, reissued_from_certificate_id, PDF file reference.

### Community and engagement

- `discussion_topics`: course, author, title, body, pinned, locked, moderation state, timestamps.
- `discussion_replies`: topic, author, body, moderation state, timestamps.
- `lesson_questions`: lesson/course, author, body, accepted answer reference, moderation state, timestamps.
- `lesson_answers`: question, author, body, accepted flag, moderation state, timestamps.
- `content_reports`: reporter, resource type/ID, reason, status, moderator, resolution, timestamps.
- `course_reviews`: enrollment, user, course, rating 1–5, body, status (`PENDING`/`PUBLISHED`/`REJECTED`), moderated_by, timestamps. One review per enrollment.
- `wishlists`: unique user+course, timestamps.
- `notifications`: user, type, title, body, resource reference, read timestamp, timestamps.
- `notification_outbox`: notification event type, recipient, payload, status, attempts, next attempt, sent timestamp. Used only for notification delivery.
- `outbox_events`: generic transactional outbox for critical asynchronous events. Event type, event version, aggregate type/ID, payload, status (`PENDING`/`PROCESSING`/`PUBLISHED`/`FAILED`/`DEAD`), attempts, available timestamp, published timestamp, last error. Committed in the same transaction as the business state change.
- `announcements`: title, body, audience, status, starts/expires, author, timestamps.
- `platform_settings`: key, value, description, updated_by, timestamps.
- `audit_logs`: actor, action, resource type/ID, before/after metadata, request ID, timestamp.

## Relationships

User 1:1 profile, 1:N refresh families/sessions, orders, enrollments, progress, attempts, submissions, reviews, wishlists, notifications. User N:M roles and permissions through polymorphic RBAC pivots. Order 1:N items/payments/refunds. Course 1:N sections, enrollments, quizzes, final project, certificates, reviews. Section 1:N lessons. Quiz 1:N questions/attempts; question 1:N options. Roadmap 1:N ordered roadmap-course entries. Project 1:N submissions; submission 1:N files/scores. Enrollment 1:N certificates over time (one active).

## Constraints and indexes

Unique: normalized `users.email`, `users_profile.user_id`, `users_profile.username`, role+guard, permission+guard, course slug, category slug, order number, provider+provider reference, provider+webhook event ID, user+course enrollment, user+lesson progress, certificate number, certificate verification code, roadmap+position, roadmap+course, coupon code, project+user+version, wishlist user+course, review enrollment. `coupon_redemptions.order_id` is unique to enforce one coupon per order; coupon+user limits are enforced transactionally.

Active certificate uniqueness: enforce one `ISSUED` certificate per enrollment. MySQL has no partial unique index, so use a generated nullable `active_enrollment_id` unique column or an equivalent transaction-safe constraint. Never rely on client checks.

Indexes: RBAC by model type/id and guard; refresh sessions by family; email tokens by token hash/user; orders by user/status/date; payments by order/status/reference; refunds by order/status; lessons by section/position; submissions by project/user/status/date; notifications by user/read/date; `outbox_events` by status/available timestamp and aggregate; `notification_outbox` by status/next attempt; reviews by course/status/date; audit by actor/action/date.

## Data and deletion rules

Use BIGINT or UUID consistently; opaque public IDs are recommended. Passwords are hashed. Refresh tokens are stored hashed/session-based. URLs are validated. JSON is reserved for variable metadata, not core relationships. Archive courses without breaking historical orders/certificates. User deletion/anonymization and retention periods require approved privacy policy. Financial, certificate, submission, and audit history must not be cascade-deleted.

## TypeORM

Production `synchronize` MUST be false. Use reviewed migrations. Avoid eager relations by default and load explicitly. Use transaction manager/QueryRunner for multi-entity workflows. Do not return entities directly from controllers.

## File metadata

Store relative storage key, sanitized display filename, detected MIME, extension, byte size, checksum (optional), uploader, owning resource, and timestamps. Never accept arbitrary absolute paths from clients.

## Implementation conventions

- Primary keys are UUID v7, generated in the application layer with the `uuid` npm package (`v7()`); do not use auto-increment or MySQL-generated UUIDs.
- All timestamps are UTC `DATETIME` columns. Application code converts to the display timezone at the edge.
- Money columns are integer IDR. FLOAT, DOUBLE, and DECIMAL are forbidden for IDR amounts.
- TypeORM `synchronize` remains `false`. Use explicit, reviewed migrations.
- Multi-record workflows use a transaction-scoped `EntityManager` or `QueryRunner`. Do not mix transaction and global repository writes.
- Financial, certificate, submission, and audit history must not cascade-delete. Use `RESTRICT` or `SET NULL` deliberately.
- One active certificate per enrollment is enforced by the nullable unique `certificates.active_enrollment_id` column, maintained by the certificate workflow.
- `quizzes` enforces exactly one of `lesson_id` or `section_id` through `CK_quizzes_lesson_or_section`. TypeORM 1.1.2 does not emit this check reliably, so the migration carries it explicitly.
- `outbox_events` is the generic transactional outbox for critical events. `notification_outbox` remains notification-specific. The dispatcher and retry worker are Phase 8 work; Phase 2 provides only the durable table.
- Migration generation must be followed by a manual review for check constraints, index duplication, foreign-key actions, and money/timestamp types.
