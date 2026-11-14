# Phase 0 Backlog Seed

**Status:** Ready for project-board import  
**Source:** `../product/decision-log.md`, `../product/business-rules.md`, `../product/functional-requirements.md`, `development-roadmap.md`

This is the prioritized backlog created from the approved Phase 0 decisions. Each ticket MUST be copied to the project board with the phase, FR/BR references, acceptance criteria, dependencies, tests, and security notes.

## 1. Foundation and data

| ID     | Phase | Outcome                                                          | References                                                       | Acceptance criteria                                                                                                    |
| ------ | ----- | ---------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| RK-001 | 2     | Identity schema: users, refresh sessions, audit base             | FR-AUTH-01–FR-AUTH-07, BR-001–BR-006                             | Migrations run on fresh MySQL; hashes/constraints/indexes reviewed; no raw token storage.                              |
| RK-002 | 2     | Course/catalog schema: categories, courses, sections, lessons    | FR-PUB-01–FR-PUB-06, FR-LEARN-01–FR-LEARN-03, BR-010–BR-019      | `course_sections` used; draft/published/archived states; ordered sections/lessons; migrations tested.                  |
| RK-003 | 2     | Commerce schema: orders, payments, refunds, coupons, redemptions | FR-COM-01–FR-COM-10, BR-020–BR-031, BR-090–BR-096, BR-164–BR-167 | IDR integer; unique constraints for provider refs/idempotency; refund state machine; coupon limits; migrations tested. |
| RK-004 | 2     | Learning schema: enrollments, progress, completion               | FR-LEARN-04–FR-LEARN-08, BR-100–BR-110                           | Enrollment unique; progress unique per user/lesson; completion formula matches DEC-001.                                |
| RK-005 | 2     | Quiz schema: quizzes, questions, options, attempts, answers      | FR-QUIZ-01–FR-QUIZ-06, BR-120–BR-128                             | One lesson/section association; answer keys protected; attempt/time/pass fields; migrations tested.                    |
| RK-006 | 2     | Project/certificate schema                                       | FR-PROJ-01–FR-PROJ-05, FR-CERT-01–FR-CERT-05, BR-130–BR-146      | Versioned submissions; one active certificate per enrollment; reissue history; migrations tested.                      |
| RK-007 | 2     | Outbox and notification schema                                   | FR-NOTIF-01–FR-NOTIF-02, BR-170–BR-177                           | Transactional outbox; idempotent consumers; retry metadata; no duplicate financial side effects.                       |
| RK-008 | 2     | Design system primitives and app shell                           | Design system, FR-LEARN-08, FR-PUB-01                            | Keyboard/focus states; light/dark; empty/loading/error patterns; no guessed brand assets.                              |
| RK-009 | 2     | Local marketing content model                                    | FR-PUB-07, BR-175                                                | Typed homepage content and fixtures; no LMS data in marketing content.                                                 |

## 2. Authentication and account

| ID     | Phase | Outcome                                       | References                                                     | Acceptance criteria                                                                                                                 |
| ------ | ----- | --------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| RK-010 | 3     | Auth API: register/login/refresh/logout/me    | FR-AUTH-01–FR-AUTH-07, BR-001–BR-006, BR-178, DEC-006, DEC-015 | Host-only HttpOnly cookies; refresh rotation/reuse detection; CSRF; Redis rate limits; generic errors; admin MFA before production. |
| RK-011 | 3     | Auth UI: login/register/recovery/verification | FR-AUTH-01–FR-AUTH-07, DEC-006                                 | Safe `next` redirect; accessible forms; no token storage; E2E auth flow.                                                            |
| RK-012 | 3     | Profile/account UI and avatar upload          | FR-AUTH-04, DEC-005                                            | Allowed type/size; authorized access; no path traversal; responsive/accessible.                                                     |

## 3. Product slices

| ID     | Phase | Outcome                                                | References                                                                                     | Acceptance criteria                                                                                                  |
| ------ | ----- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| RK-013 | 4     | Course authoring API/UI                                | FR-LEARN-01–FR-LEARN-03, BR-010–BR-019                                                         | ADMIN CRUD; unique slug; publish/unpublish audit; preview; YouTube validation; rich-text sanitization.               |
| RK-014 | 4     | Public catalog/detail UI                               | FR-PUB-01–FR-PUB-07                                                                            | Only published; filters/sorting/pagination; SEO/sitemap/robots; cache tags; accessible states.                       |
| RK-015 | 5     | Orders/payment/enrollment/refund                       | FR-COM-01–FR-COM-10, DEC-003, DEC-011                                                          | Server total; idempotent order/fulfillment; verified webhook; one enrollment; full refund lifecycle.                 |
| RK-016 | 6     | Learning player/progress/certificate                   | FR-LEARN-04–FR-LEARN-08, FR-CERT-01–FR-CERT-05, DEC-001, DEC-004                               | Enrollment enforced; resume; completion formula; certificate verification/reissue audit.                             |
| RK-017 | 7     | Quiz authoring and attempt UI                          | FR-QUIZ-01–FR-QUIZ-06, DEC-002                                                                 | Server grading; attempt/time/pass policy; answer key hidden; review after submit.                                    |
| RK-018 | 8     | Roadmap/community/notifications                        | FR-ROAD-01–FR-ROAD-04, FR-COMM-01–FR-COMM-04, FR-NOTIF-01                                      | Sequential unlock; membership does not grant paid access; moderation audit; polling fallback.                        |
| RK-019 | 9     | Wishlist/reviews/coupons/announcements/admin analytics | FR-WISH-01, FR-REVIEW-01–FR-REVIEW-02, FR-COUPON-01, FR-ANN-01, FR-SET-01, FR-ADM-01–FR-ADM-05 | Unique wishlist; pre-moderated reviews; one coupon; audited settings; MySQL reports.                                 |
| RK-020 | 10    | Security/accessibility/performance/launch hardening    | Roadmap Phase 10, cross-phase DoD, BR-179                                                      | Threat-model tests; WCAG checks; Web Vitals; daily backup restore (RPO 24h/RTO 4h); staging UAT; rollback rehearsal. |

## 4. Dependencies

- RK-001 before RK-010 and RK-011.
- RK-002 before RK-008, RK-013, RK-014.
- RK-003 before RK-015.
- RK-004 before RK-016.
- RK-005 before RK-017.
- RK-006 before certificate issuance in RK-016.
- RK-007 before notification delivery in RK-018.
- RK-010 before protected learner/admin flows.
- Phase 10 after all functional phases and exit gates.

## 5. Ticket template

Every board ticket includes:

- Phase/task ID and outcome.
- FR/BR references.
- Acceptance criteria and failure cases.
- Dependencies.
- Test levels (unit/integration/API/E2E/security).
- Migration and data impact.
- Security/privacy/audit notes.
- Documentation impact.
