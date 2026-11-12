# API Specification

## Conventions

- Base path `/api/v1`; HTTPS.
- JSON except multipart uploads.
- ISO 8601 UTC timestamps.
- Server-calculated money represented as IDR integer.
- DTOs only, never raw TypeORM entities.
- Consistent pagination (`page`, `limit`, `sort`, `order`) with a documented maximum limit.
- Stable application error codes.
- Canonical learning structure: `Course → Section → Lesson`.

## Response envelope

Success:

```json
{ "data": {}, "meta": { "requestId": "req_..." } }
```

Error uses RFC 9457 Problem Details with `Content-Type: application/problem+json`:

```json
{
  "type": "https://rumahkodingku.com/problems/validation-error",
  "title": "Bad Request",
  "status": 400,
  "detail": "Request validation failed",
  "instance": "/api/v1/orders",
  "code": "VALIDATION_ERROR",
  "requestId": "req_...",
  "errors": []
}
```

Never expose stack traces, SQL, secrets, or internal file paths.

## Health and documentation

- `GET /api/v1/health` and `GET /api/v1/health/ready` return Terminus readiness output (MySQL and Redis).
- `GET /api/v1/health/live` returns a lightweight liveness response.
- `GET /swagger` serves Swagger UI.
- `GET /reference` serves Scalar API Reference.
- `GET /swagger-json` serves the OpenAPI document.

## CSRF

- `GET /api/v1/csrf/token` returns `{ "data": { "csrfToken": "..." }, "meta": {} }` and sets the CSRF cookie.
- Cookie-authenticated mutations must send the token in `x-csrf-token`.

## Authentication

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
- `PATCH /auth/me`
- `POST /auth/avatar`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`
- `POST /auth/resend-verification`

Set/clear HttpOnly cookies; apply Redis-backed rate limits and CSRF/origin protections.

## Public catalog

- `GET /courses`
- `GET /courses/:slug`
- `GET /categories`
- `GET /roadmaps`
- `GET /roadmaps/:slug`
- `GET /certificates/verify/:code`

Only published public fields are returned; previews are explicit. Catalog supports search, category/difficulty filters, sorting, featured, newest, and popular (30-day enrollment).

## Commerce

User:

- `POST /orders`
- `GET /orders`
- `GET /orders/:id`
- `POST /orders/:id/payment-session`
- `GET /payments/:id`
- `POST /orders/:id/refund-requests`
- `POST /checkout/coupons/validate`

Admin:

- `/admin/orders`
- `/admin/payments`
- `/admin/refund-requests`
- `/admin/refund-requests/:id`
- `/admin/coupons`
- `/admin/coupons/:id`

Order request contains course ID, optional coupon code, and optional idempotency key. Price, discount, and total are server-derived. One coupon per order. Webhook endpoint is provider-specific, for example `POST /payments/webhooks/midtrans`; it uses the official verification contract and does not require browser cookies. Full refunds only.

## Learning

- `GET /me/enrollments`
- `GET /courses/:courseId/learning`
- `GET /lessons/:lessonId`
- `GET /lessons/:lessonId/preview`
- `PUT /lessons/:lessonId/progress`
- `GET /courses/:courseId/progress`

Every protected endpoint checks enrollment and roadmap prerequisites. Preview lessons are explicitly marked.

## Quiz

- `GET /quizzes/:quizId`
- `POST /quizzes/:quizId/attempts`
- `GET /quiz-attempts/:attemptId`
- `POST /quiz-attempts/:attemptId/submit`
- `GET /me/quiz-attempts`

Correct answers are omitted from learner responses. Short answer is exact-match graded after normalization.

## Roadmap

- `GET /roadmaps`
- `GET /roadmaps/:roadmapId/progress`
- Admin CRUD under `/admin/roadmaps` and `/admin/roadmaps/:id/courses`

Roadmaps are always sequential.

## Project and certificate

User:

- `GET /courses/:courseId/final-project`
- `POST /final-projects/:id/submissions`
- `GET /final-projects/:id/submissions`
- `GET /submissions/:id`
- `POST /submissions/:id/files`
- `GET /me/certificates`
- `GET /certificates/:id`
- `GET /certificates/:id/download`
- `GET /certificates/verify/:code`

Admin:

- `/admin/courses/:id/final-project`
- `/admin/final-projects/:id/rubric`
- `/admin/project-submissions`
- `/admin/project-submissions/:id/review`
- `/admin/certificates`
- `/admin/certificates/:id/revoke`
- `/admin/certificates/:id/reissue`

Submission requires GitHub URL and deployment URL when the final project is enabled. Files are optional. Review decisions are `REVISION_REQUIRED` and `APPROVED`; no rejected state. Certificate reissue creates a new record.

## Community

Course discussion:

- `GET/POST /courses/:courseId/discussions`
- `GET /discussions/:id`
- `PATCH/DELETE /discussions/:id`
- `POST /discussions/:id/replies`
- `PATCH/DELETE /discussion-replies/:id`
- `POST /content-reports`

Lesson Q&A:

- `GET/POST /lessons/:lessonId/questions`
- `POST /lesson-questions/:id/answers`
- `PATCH/DELETE /lesson-questions/:id`
- `PATCH/DELETE /lesson-answers/:id`
- `POST /lesson-answers/:id/accept`

Admin moderation under `/admin/community`, including pin, lock, hide, and report resolution.

## Engagement

- `GET/POST/DELETE /me/wishlist`
- `GET/POST /courses/:courseId/reviews`
- `GET /me/reviews`
- `PATCH/DELETE /reviews/:id`
- `GET /me/notifications`
- `POST /me/notifications/:id/read`
- `POST /me/notifications/read-all`
- `GET /me/notifications/unread-count`

Admin review moderation under `/admin/reviews`.

## Admin resources

- `/admin/users`
- `/admin/users/:id`
- `/admin/users/:id/status`
- `/admin/courses`
- `/admin/courses/:id/sections`
- `/admin/sections/:id/lessons`
- `/admin/categories`
- `/admin/quizzes`
- `/admin/roadmaps`
- `/admin/announcements`
- `/admin/settings`
- `/admin/analytics`
- `/admin/reports`
- `/admin/audit-logs`

Each endpoint documents request/response, auth, permission, validation, transitions, errors, and tests. Generate OpenAPI from actual DTOs and keep it synchronized.

## Realtime events

Socket.io namespace `/notifications`, authenticated with the same session identity as REST.

Server events:

- `notification.created`
- `notification.read`
- `notification.unread_count`

Client may fall back to polling via `GET /me/notifications`. Never accept a client-supplied user ID as identity.

## Status codes and security

200 success; 201 created; 202 accepted; 204 no content; 400 malformed; 401 unauthenticated; 403 forbidden; 404 not found/not visible; 409 conflict; 422 semantic validation if adopted consistently; 429 rate limited; 500/503 server/dependency failure.

Validate DTOs, ownership, roles, CSRF, rate limits, idempotency, webhook authenticity, and upload policies. Admin financial/learning analytics are computed from MySQL; PostHog is not a financial source of truth. Strapi content is marketing-only.
