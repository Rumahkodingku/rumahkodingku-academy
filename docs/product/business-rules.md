# Business Rules

This document is normative for business behavior.

## Identity

- BR-001: Initial roles are USER and ADMIN only.
- BR-002: Authorization is enforced server-side on every protected operation.
- BR-003: Client-supplied role/ownership fields are never trusted.
- BR-004: Course instructor/author information is descriptive text on the course. It does not create a role or login.
- BR-005: Production web is `academy.rumahkodingku.com`; production API is `api.rumahkodingku.com`. Auth cookies are host-only (no `Domain` attribute), `HttpOnly`, `Secure` in production, and `SameSite=Lax`. Staging hosts are isolated; cookies must never be shared between staging and production.
- BR-006: Cookie-authenticated mutations require a CSRF token. CORS allows only the configured web origin with credentials.

## Courses and purchases

- BR-010: Only published courses are purchasable.
- BR-011: Initial model is individual course purchase; no roadmap bundle checkout.
- BR-012: Server calculates and snapshots price at order creation.
- BR-013: Client price/amount/payment status is never trusted.
- BR-014: One successful purchase creates at most one active user-course enrollment.
- BR-015: Access is lifetime after successful purchase, subject to confirmed refund/fraud/account enforcement.
- BR-016: Later price changes do not change prior order snapshots.
- BR-017: ADMIN may grant free access or create free enrollments. Every grant records source, actor, reason, and timestamp.
- BR-018: Enrollment sources are `PURCHASE`, `FREE`, and `ADMIN_GRANT`. Enrollment and order remain separate records.
- BR-019: Course discovery definitions are fixed: featured = admin flag; newest = `publishedAt`; popular = enrollment count in the last 30 days.

## Payments

- BR-020: Midtrans is the preferred initial payment provider, subject to merchant approval and confirmation that online course/digital education sales are accepted.
- BR-020a: Payment business logic MUST be provider-neutral; Midtrans is the first production adapter.
- BR-020b: A local mock provider is allowed only for local development. Midtrans Sandbox is used for integration testing. Neither mock nor sandbox payment may create production enrollment.
- BR-020c: If Midtrans rejects onboarding or the business later changes legal status, evaluate another provider (including Xendit) without rewriting order/enrollment domain logic.
- BR-021: Order begins `PENDING`.
- BR-022: Only verified provider events or trusted provider reconciliation establish `PAID`.
- BR-023: Browser redirect is informational only.
- BR-024: Webhook verification, replay protection, and idempotency are mandatory.
- BR-025: Amount, currency, merchant reference, and provider reference must match.
- BR-026: Failed/expired/cancelled payments grant no enrollment.
- BR-027: Duplicate/out-of-order events cannot regress a paid state.
- BR-028: Money is stored and compared as IDR integer. Floating point is forbidden.
- BR-029: One coupon is allowed per order. A second coupon is rejected.
- BR-030: Checkout snapshots subtotal, discount, coupon code, total, currency, and course price.
- BR-031: The learner-facing course price is the final payable amount. Any tax, payment fee, or additional charge is shown as an explicit line item before payment confirmation; it is never hidden in the total. The server calculates the amount.

## Refunds

- BR-090: Refunds are reviewed by ADMIN case by case; a request does not imply approval.
- BR-091: MVP supports full refunds only. Partial refunds are out of scope.
- BR-092: Eligibility depends on approved policy, evidence, payment state, and provider capabilities.
- BR-093: Record amount, reviewer, reason, provider reference, and outcome.
- BR-094: Refund statuses are `REQUESTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `PROCESSING`, `SUCCEEDED`, `FAILED`.
- BR-095: Revoke access only after confirmed refund success (`SUCCEEDED`), unless an approved fraud/security hold applies.
- BR-096: Refund requests are accepted within 14 calendar days from the confirmed payment date. The request must include the order ID, reason, and at least one supporting artifact such as a payment receipt, error screenshot, or access log. ADMIN may request additional evidence.

## Roadmap and learning

- BR-100: Roadmap courses are ordered and always sequential.
- BR-101: There is no optional-prerequisite mode in the MVP.
- BR-102: Prior course requirements must be satisfied before the next course is unlocked.
- BR-103: Roadmap membership does not grant course access; paid course access also requires enrollment.
- BR-104: Each lesson is `YOUTUBE_VIDEO` or `RICH_TEXT`.
- BR-105: YouTube origin/reference is validated.
- BR-106: Rich text is sanitized.
- BR-107: Lessons may be required or optional; preview is configured per lesson.
- BR-108: Progress is tracked per user/lesson.
- BR-109: Course completion requires all required lessons, all required quizzes, and final project approval when the final project is enabled. No other hidden completion rule is allowed.
- BR-110: Video watch percentage is not proof of learning unless explicitly implemented and disclosed.

## Quiz

- BR-120: Quiz is optional and attaches to exactly one lesson or one section.
- BR-121: ADMIN controls quiz settings, including required status, pass score, time limit, attempts, randomization, and answer reveal timing.
- BR-122: Answer keys are server-only before submission.
- BR-123: Supported question types are multiple choice, multiple select, true/false, and short answer.
- BR-124: Short answer is auto-graded by exact match after trim, case, and whitespace normalization.
- BR-125: The default pass score is 70%. The default attempt limit is 3 attempts. The default time limit is 30 minutes. ADMIN may configure these values per quiz within approved limits.
- BR-126: Quiz affects completion only when configured as required and passed.
- BR-127: Attempts are retained.
- BR-128: Answer review is available after submission. Answer keys are never exposed before submission. Short answer is exact-match after trim, case, and whitespace normalization.

## Final project

- BR-130: Final project is configurable per course; it may be disabled.
- BR-131: When enabled, submission requires a GitHub repository URL and a live deployment URL.
- BR-132: Supporting files are optional and controlled by course configuration.
- BR-133: Uploads validate size, MIME, extension, authorization, and generated storage key. Maximum size is 10 MB per file; allowed types are JPG/JPEG, PNG, WebP, PDF, and ZIP; maximum 5 files per final-project submission. Uploads are retained for 1 year from upload unless audit/legal retention requires longer. Malware scanning is not part of the MVP and is recorded as an accepted risk.
- BR-134: Resubmission is unlimited. Each resubmission is a new immutable version.
- BR-135: ADMIN records decision, score, and feedback.
- BR-136: Review decisions are `REVISION_REQUIRED` and `APPROVED`. There is no `REJECTED` state.
- BR-137: Only `APPROVED` satisfies the project requirement.

## Certificate

- BR-140: Certificate requires all configured learning requirements and project approval where the final project is enabled.
- BR-141: Issuance is automatic and idempotent.
- BR-142: One active certificate per enrollment. A revoked certificate may be reissued as a new record.
- BR-143: Manual correction/revocation is exceptional and audited.
- BR-144: Revoked certificates remain searchable and verify as invalid.
- BR-145: Public verification discloses only approved fields.
- BR-146: Certificate issuer is `RumahKodingku Academy`. Certificate code format is `RK-YYYY-XXXXXX`, where `XXXXXX` is a unique six-character uppercase alphanumeric code. Public verification shows learner name, course title, issue date, issuer, and status (`VALID`/`REVOKED`). Reissue revokes the old record and creates a new record; history is preserved.

## Community

- BR-150: Posting requires authentication.
- BR-151: Course-specific discussion requires course access unless configured public.
- BR-152: Lesson Q&A is linked to lesson/course.
- BR-153: ADMIN moderation actions are recorded.
- BR-154: Users may edit/delete their own content according to policy; moderation hides or removes violating content.
- BR-155: Reports create a moderation record and do not auto-delete content.

## Reviews, wishlist, and coupons

- BR-160: Review/rating is available only after the course is completed.
- BR-161: One review per enrollment.
- BR-162: Reviews start `PENDING` and appear publicly only after ADMIN publishes them.
- BR-163: Wishlist entries are unique per user/course.
- BR-164: Coupons have code, type, value, maximum discount, minimum purchase, validity period, global limit, per-user limit, eligible courses, and active status.
- BR-165: Coupon redemption is recorded and cannot exceed configured limits.
- BR-166: One coupon per order; coupons never make the server-derived total negative.
- BR-167: MVP coupon limits: maximum discount 100% of course price, minimum purchase 0, global limit 100 uses, per-user limit 1, and no stacking. ADMIN may configure a stricter coupon.

## Notifications and admin operations

- BR-170: In-app notifications are delivered through Socket.io with polling fallback.
- BR-171: Email notifications use Resend with sender `academy@rumahkodingku.com` and a transactional outbox; notification failure must not roll back core transactions. Domain verification and production API key are external setup tasks.
- BR-172: Notifications never include secrets, tokens, cookies, or unnecessary personal data.
- BR-173: Sensitive admin actions are audited.
- BR-174: Admin analytics and financial reports are computed from MySQL, not PostHog.
- BR-175: Announcements and platform settings are managed by ADMIN and audited when they affect public behavior. Initial settings cover announcement banner, support contact, maintenance notice, and public feature toggles. Announcements have title, body, audience, publish window, active flag, and audit metadata.
- BR-176: PostHog uses the minimal approved event taxonomy in `product/decision-log.md`. Events never include passwords, tokens, cookies, payment secrets, or unnecessary personal data.
- BR-177: Retention baseline: uploads 1 year; application logs 30 days; product analytics 12 months; audit and financial records follow applicable legal/tax requirements and are not removed by routine cleanup. Account deletion removes personal data except records that must be retained.
- BR-178: Admin MFA is required before production launch. The mechanism must be compatible with the authentication stack and covered by recovery procedures.
- BR-179: Backup baseline: daily database backup, 7-day retention, RPO 24 hours, RTO 4 hours. Restore must be tested before production launch.

## Recommended states

Order: `PENDING`, `PAID`, `FAILED`, `EXPIRED`, `CANCELLED`, `REFUND_PENDING`, `REFUNDED`. Enrollment: `ACTIVE`, `SUSPENDED`, `REVOKED`. Course: `DRAFT`, `PUBLISHED`, `ARCHIVED`. Progress: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`. Project: `SUBMITTED`, `UNDER_REVIEW`, `REVISION_REQUIRED`, `APPROVED`. Refund: `REQUESTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `PROCESSING`, `SUCCEEDED`, `FAILED`. Certificate: `ISSUED`, `REVOKED`. Review: `PENDING`, `PUBLISHED`, `REJECTED`. Enforce valid state transitions; never accept arbitrary client status.
