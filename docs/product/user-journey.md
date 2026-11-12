# User Journeys

## Actors

Visitor (unauthenticated), USER (learner), ADMIN, and external services (Midtrans, email provider, YouTube, Strapi marketing CMS, PostHog).

## 1. Discover and purchase

Visitor browses catalog and course detail. Detail shows outcomes, curriculum preview, requirements, instructor/author information, price, certificate conditions, and lifetime-access terms. Course discovery supports featured, newest, and popular (30-day enrollment) sorting.

Purchase requires login/registration if needed. Backend validates publication and calculates IDR price, applies at most one coupon, snapshots the total, creates a pending order, and requests a payment session through the provider adapter. Browser opens the provider payment flow. Midtrans notification/webhook is verified server-side; backend reconciles reference, amount, currency, and payment state, marks payment paid, and creates enrollment once. User sees the course in My Learning. Redirect alone never proves payment success.

Edge cases: pending, failed, expired, duplicate/out-of-order webhook, browser closed, successful payment with failed redirect, amount mismatch, coupon invalid, and unavailable course.

## 2. Learn

USER opens My Learning, selects an enrolled course, sees ordered sections and lessons, and opens a lesson. Backend checks enrollment and roadmap prerequisites. Lesson renders YouTube or sanitized rich text. Preview lessons may be visible without enrollment where configured. Progress persists per lesson. Required quizzes appear at configured lesson or section points.

Course completion requires all required lessons, all required quizzes, final project approval when enabled, and any additional requirements. The learner can resume on another device.

## 3. Roadmap

USER sees ordered courses and prerequisite state. Roadmaps are always sequential: the next course unlocks after the previous course is completed. The learner still purchases each paid course individually. Roadmap membership never grants free access.

## 4. Quiz

ADMIN configures quiz location (exactly one lesson or section), questions, pass score, time limit, attempt policy, randomization, and answer reveal. USER submits answers. Backend grades multiple choice, multiple select, true/false, and short answer (exact match after normalization), stores the attempt, and updates progress according to configuration. Correct answers are not exposed before submission.

## 5. Final project

ADMIN enables or disables the final project per course and defines instructions, rubric, required links, file policy, and minimum score. USER submits a GitHub URL, deployment URL, description, optional notes, and optional files. Each resubmission creates a new immutable version. ADMIN reviews and either requests revision with actionable feedback or approves. Resubmissions are unlimited; history is preserved. There is no rejected state.

## 6. Certificate

System evaluates required lessons, required quizzes, final-project approval when enabled, and additional requirements. It issues one active certificate per enrollment idempotently. USER views/downloads the PDF and shares the verification link or QR code. If a certificate is revoked, it remains findable and verifies as invalid. ADMIN may reissue as a new record with an audit trail.

## 7. Community

USER creates course discussion topics/replies and lesson-level questions/answers. Enrollment restrictions apply to course-specific areas unless explicitly public. Users can edit/delete their own content and report abuse. ADMIN moderates, pins, locks, records accepted answers, and audits actions. In-app notifications are delivered in realtime through Socket.io with polling fallback.

## 8. Refund

USER submits a full-refund request and reason. ADMIN checks payment state, policy, and evidence; may approve, reject, or request information. Provider refund is initiated only after approval. Enrollment is revoked only after refund success is confirmed, unless a separately approved fraud/security hold applies. Partial refunds are out of scope.

## 9. Reviews, wishlist, and coupons

USER can save courses to a unique wishlist. After completing a course, USER can submit one rating/review; it stays `PENDING` until ADMIN publishes it. At checkout, USER may apply one coupon. Coupon eligibility, limits, and discount are validated server-side.

## 10. Admin and analytics

ADMIN manages users, courses, sections, lessons, quizzes, roadmaps, project reviews, community moderation, refunds, orders, payments, certificates, reviews, coupons, announcements, and platform settings. Sensitive actions require confirmation and audit logging.

In-app and email notifications cover payment, enrollment, review, certificate, and community events. Email uses a transactional outbox. Admin financial and learning reports are computed from MySQL; PostHog supplies product analytics and feature flags only. Strapi supplies marketing content only.
