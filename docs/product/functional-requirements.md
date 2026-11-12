# Functional Requirements

Priority: P0 release blocker; P1 core; P2 enhancement.

## Public catalog

- FR-PUB-01 P0: Public landing, catalog, and course detail exist.
- FR-PUB-02 P0: Course detail shows outcomes, curriculum preview, requirements, price, access terms, instructor/author information, and certificate conditions.
- FR-PUB-03 P1: Catalog supports search, category and difficulty filters, pagination, and sorting.
- FR-PUB-04 P0: Unpublished courses cannot be purchased.
- FR-PUB-05 P1: Featured, newest, and popular discovery are available. Featured uses an admin flag; newest uses `publishedAt`; popular uses enrollment count in the last 30 days.
- FR-PUB-06 P1: Public roadmap catalog/detail and certificate verification pages exist.
- FR-PUB-07 P1: About, FAQ, Contact, and marketing content are available. Strapi may supply marketing content only.

## Identity

- FR-AUTH-01 P0: Register, login, logout, refresh session.
- FR-AUTH-02 P0: JWT access/refresh tokens use HttpOnly cookies.
- FR-AUTH-03 P0: Backend enforces USER/ADMIN roles and ownership.
- FR-AUTH-04 P1: User can view and update permitted profile fields, including avatar upload.
- FR-AUTH-05 P1: Password reset and email verification are implemented before production.
- FR-AUTH-06 P0: Logout revokes refresh session server-side.
- FR-AUTH-07 P1: Rate limits apply to registration, login, refresh, and password reset using Redis.
- FR-AUTH-08 P1: UI defaults to Indonesian; i18n structure supports English without refactoring.

## Commerce

- FR-COM-01 P0: USER purchases an individual course once.
- FR-COM-02 P0: Backend calculates and snapshots price, discount, coupon, and total as IDR integer.
- FR-COM-03 P0: Midtrans payment session/charge flow and verified notification/webhook are implemented after merchant onboarding; use a provider-neutral payment adapter.
- FR-COM-03a P0: Local mock payment and Midtrans Sandbox are strictly separated from production credentials and data.
- FR-COM-04 P0: Enrollment only follows verified payment success or an audited ADMIN grant/free enrollment.
- FR-COM-05 P0: Webhook and fulfillment are idempotent.
- FR-COM-06 P0: Lifetime access is granted subject to confirmed refund/fraud enforcement.
- FR-COM-07 P1: User views order/payment history and order detail.
- FR-COM-08 P1: User submits a full-refund request; ADMIN reviews and records a decision.
- FR-COM-09 P1: One coupon can be applied per order; validation returns clear failure states.
- FR-COM-10 P0: Browser redirect alone never grants access.

## Learning

- FR-LEARN-01 P0: ADMIN manages courses, sections, and ordered lessons.
- FR-LEARN-02 P0: Lesson content is YouTube video or rich text.
- FR-LEARN-03 P0: Rich text is sanitized before rendering.
- FR-LEARN-04 P0: Paid content checks enrollment and roadmap prerequisite.
- FR-LEARN-05 P0: Lesson progress persists.
- FR-LEARN-06 P1: Lessons can be required/optional.
- FR-LEARN-07 P1: Preview lessons can be configured and accessed without enrollment.
- FR-LEARN-08 P1: Course player shows next/previous lesson, resume, completion requirements, and locked-state explanations.

## Quiz and roadmap

- FR-QUIZ-01 P1: ADMIN attaches optional quizzes to exactly one lesson or section.
- FR-QUIZ-02 P1: ADMIN configures questions, pass score, time limit, attempts, randomization, answer reveal, required status, and active status.
- FR-QUIZ-03 P1: Backend grades multiple choice, multiple select, true/false, and short answer.
- FR-QUIZ-04 P0: Short answer is exact-match graded after trim, case, and whitespace normalization.
- FR-QUIZ-05 P0: Answer keys are not exposed before submission.
- FR-QUIZ-06 P1: User can view attempt history and results according to policy.
- FR-ROAD-01 P1: ADMIN creates ordered roadmaps.
- FR-ROAD-02 P1: Roadmap progression is always sequential.
- FR-ROAD-03 P0: Roadmap never grants paid access.
- FR-ROAD-04 P1: Learner sees completed, current, locked, and not-purchased states.

## Project and certificate

- FR-PROJ-01 P1: ADMIN enables/disables final project per course and defines instructions, rubric, required links, file policy, and minimum score.
- FR-PROJ-02 P1: USER submits GitHub URL, deployment URL, description, optional notes, and optional files.
- FR-PROJ-03 P1: Unlimited resubmissions create immutable versions.
- FR-PROJ-04 P1: ADMIN approves or requests revision with feedback. No rejected status.
- FR-PROJ-05 P1: ADMIN sees submission history, rubric scores, reviewer, and timestamps.
- FR-CERT-01 P1: Automatic certificate only after all configured requirements and project approval where enabled.
- FR-CERT-02 P0: Issuance is idempotent; one active certificate per enrollment.
- FR-CERT-03 P1: Public verification uses an unguessable identifier and minimal disclosure.
- FR-CERT-04 P1: User downloads certificate PDF and shares verification link/QR.
- FR-CERT-05 P1: ADMIN revokes and reissues certificates with audit trail; reissue creates a new record.

## Community, engagement, and admin

- FR-COMM-01 P1: Course forum supports topics and replies.
- FR-COMM-02 P1: Lesson Q&A supports questions and answers.
- FR-COMM-03 P1: ADMIN moderates, pins, locks, and records accepted answers.
- FR-COMM-04 P1: Users can report content; reports enter a moderation queue.
- FR-NOTIF-01 P1: Notify payment, enrollment, review, replies, certificate events.
- FR-NOTIF-02 P1: In-app notifications use Socket.io with polling fallback; email uses a transactional outbox.
- FR-REVIEW-01 P2: User rates 1–5 and writes one review after completing a course.
- FR-REVIEW-02 P2: Reviews are `PENDING` and appear publicly only after ADMIN publishes them.
- FR-WISH-01 P2: User adds/removes courses from a unique wishlist.
- FR-COUPON-01 P2: ADMIN creates coupons; user validates one coupon at checkout.
- FR-ANN-01 P2: ADMIN manages announcements visible to users.
- FR-SET-01 P2: ADMIN manages audited platform settings.
- FR-ADM-01 P0: ADMIN manages content, reviews projects/refunds, and moderates community.
- FR-ADM-02 P0: Sensitive admin actions are audited.
- FR-ADM-03 P0: All external input is validated server-side.
- FR-ADM-04 P1: ADMIN sees users, enrollment, orders, payments, certificates, and audit records.
- FR-ADM-05 P2: ADMIN analytics/reports use MySQL as the source of truth and cover revenue, enrollment, completion, quiz pass rate, project approval, review time, and certificates.

Acceptance: each requirement has happy/failure tests, permission tests, loading/empty/error states, safe logging, and updated docs.
