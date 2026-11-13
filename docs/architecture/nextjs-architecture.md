# Next.js Frontend Architecture

**Project:** RumahKodingku Academy  
**Document:** `nextjs-architecture.md`  
**Document type:** Frontend Technical Architecture Specification  
**Status:** Architecture baseline  
**Audience:** Frontend developers, technical leads, reviewers, and AI coding agents  
**Framework:** Next.js 16 (App Router)  
**UI runtime:** React 19  
**Styling:** Tailwind CSS 4 + Base UI  
**API:** NestJS REST under `/api/v1`  
**Marketing content:** Strapi (marketing only)  
**Monorepo:** pnpm Workspaces + Turborepo

> **Normative language:** The words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY express requirements. MUST and MUST NOT are mandatory constraints. SHOULD and SHOULD NOT are strong recommendations that require a documented reason to deviate. MAY indicates an optional choice.

---

## 1. Purpose and Scope

### 1.1 Purpose

This document defines the target frontend architecture for RumahKodingku Academy. It is the authoritative reference for designing, implementing, reviewing, testing, and operating the Next.js application in `apps/web`.

It is written for human engineers and AI coding agents. It specifies rendering boundaries, routing, ownership, data access, authentication, caching, internationalization, security, testing, deployment, and the procedure for changing frontend code.

### 1.2 Goals

The frontend MUST:

- Render public marketing and catalog pages with strong SEO and fast first paint.
- Deliver a secure learner area and admin area backed by the NestJS API.
- Keep server components as the default and client JavaScript as small as practical.
- Make loading, empty, error, unauthorized, and offline states explicit.
- Keep business rules authoritative in NestJS and Strapi limited to marketing content.
- Remain testable at unit, component, API-contract, accessibility, and end-to-end levels.
- Be deployable as a standalone Node.js application on the existing VPS + Coolify topology.

### 1.3 In Scope

- Next.js App Router structure and route groups.
- Server and Client Component boundaries.
- Feature module organization and ownership.
- Browser and server data access to NestJS and Strapi.
- TanStack Query and Zustand usage.
- Caching, revalidation, and rendering strategy.
- Authentication UI, session reads, and optimistic route protection.
- Forms, mutations, validation, and file upload entry points.
- Internationalization and locale-aware routing.
- UI system, design tokens, and component ownership.
- Security, accessibility, performance, SEO, testing, observability, and deployment.
- Migration from the current starter state to the target state.

### 1.4 Out of Scope

The following remain governed by their own documents:

- NestJS domain rules, controllers, use cases, and API contracts.
- Database schema, entities, migrations, and transaction rules.
- Product business rules and pricing.
- Detailed visual design specifications and brand assets.
- Infrastructure-as-code and Coolify-specific manifests.
- Strapi content modeling beyond the frontend rendering contract.

### 1.5 Repository Context and Verification Rule

The repository currently contains a Next.js starter in `apps/web`, a NestJS API in `apps/api`, a Fumadocs app in `apps/docs`, and shared packages for environment, configuration, and database access.

This document describes the **target architecture**, not a claim that every folder, component, cache tag, or route already exists. Before changing code, developers and AI agents MUST inspect the actual repository state, package versions, exports, environment schema, and current implementation. Never assume a path or feature exists because it appears in this specification.

When this document conflicts with the current implementation, follow the approved architecture unless a newer approved decision or ADR supersedes it. Record the conflict and the migration step; do not silently reinterpret the architecture.

### 1.6 Related Documents

- `nestjs-architecture.md` — backend authority and API behavior.
- `system-architecture.md` — system context and service boundaries.
- `monorepo-structure.md` — workspace ownership.
- `technology-stack.md` — confirmed stack.
- `../api/api-specification.md` — REST contract.
- `../design/design-system.md` — tokens, components, and accessibility foundations.
- `../development/coding-guidelines.md` — repository coding rules.
- `../development/testing-strategy.md` — test levels and quality gates.

## 2. Approved Architecture Decisions

| ID      | Area                 | Decision                                                                                     | Status   |
| ------- | -------------------- | -------------------------------------------------------------------------------------------- | -------- |
| WEB-001 | Routing              | Next.js App Router under `src/app`                                                           | Accepted |
| WEB-002 | Rendering            | Server Components by default; Client Components only at interactive leaves                   | Accepted |
| WEB-003 | Organization         | Feature-based modules under `src/features`                                                   | Accepted |
| WEB-004 | API access           | RSC calls NestJS directly; browser calls NestJS directly with credentials                    | Accepted |
| WEB-005 | API types            | Generate TypeScript types from the NestJS OpenAPI document                                   | Accepted |
| WEB-006 | Client server-state  | TanStack Query                                                                               | Accepted |
| WEB-007 | Client UI-state      | Zustand only for ephemeral, cross-component UI state                                         | Accepted |
| WEB-008 | Caching              | Explicit ISR, fetch cache, and tags; no `cacheComponents` in the baseline                    | Accepted |
| WEB-009 | Internationalization | Keep i18next; locale routing as-needed with `[locale]`                                       | Accepted |
| WEB-010 | Authentication       | HttpOnly cookies owned by NestJS; `proxy.ts` only performs optimistic checks                 | Accepted |
| WEB-011 | Mutations            | TanStack Query mutations from the browser; Server Actions only for Next-local concerns       | Accepted |
| WEB-012 | Deployment           | `output: "standalone"` on Node.js 24 LTS behind HTTPS                                        | Accepted |
| WEB-013 | Marketing content    | Strapi is accessed through a server-only adapter                                             | Accepted |
| WEB-014 | BFF                  | No catch-all BFF proxy; direct API is the default                                            | Accepted |
| WEB-015 | Testing              | Vitest for synchronous units; Playwright for async RSC and journeys; Storybook for UI states | Accepted |

Any change to an accepted decision MUST be recorded as an Architecture Decision Record with context, alternatives, consequences, migration impact, and approval.

## 3. Current State and Target

`apps/web` was a starter at the start of the migration. The table below records that baseline; the status table in Section 3.1 records what has been implemented. It MUST be updated when a gap is closed.

| Area              | Current baseline                                                 | Target                                                         | Migration phase |
| ----------------- | ---------------------------------------------------------------- | -------------------------------------------------------------- | --------------- |
| Home route        | `app/page.tsx` is entirely `"use client"`                        | Server Component page; client islands only                     | Foundation      |
| Routing           | Flat `app/`; no route groups or locale segment                   | Grouped routes under `app/[locale]/`                           | Foundation      |
| Locale            | i18next client-only; no locale URL; unsupported `fr` file exists | `id` at root, `en` under `/en`; only supported locales shipped | Foundation      |
| Middleware        | No `proxy.ts`                                                    | Locale rewrite and optimistic auth redirect                    | Foundation      |
| Feature structure | Components and utilities mixed in `src/components`, `src/lib`    | `src/features/<domain>` with server/client boundaries          | Foundation      |
| API access        | Browser-only Axios client                                        | Browser client plus server-only fetch with cookie forwarding   | Data layer      |
| API types         | Hand-written types                                               | Generated OpenAPI schema plus thin typed wrappers              | Data layer      |
| Auth              | No session DAL or route guard                                    | Session DAL, protected layouts, optimistic `proxy.ts`          | Auth shell      |
| Marketing         | Strapi helpers are generic                                       | Server-only Strapi adapter with cache tags and SEO mapping     | Marketing       |
| Caching           | No explicit strategy                                             | Cache matrix in Section 12                                     | Marketing       |
| UI system         | Base UI primitives and Tailwind exist                            | Tokenized UI primitives and feature-level composition          | Hardening       |
| Security          | No CSP/security headers                                          | CSP, `server-only`, sanitized rich text, image allowlist       | Hardening       |
| Testing           | Vitest configured; no web tests                                  | Unit, component, E2E, accessibility coverage                   | Per phase       |
| Storybook         | Storybook 10 and addons 8 are inconsistent                       | One aligned major version before UI expansion                  | Hardening       |

The current state is recorded for planning. It MUST NOT be treated as an approved exception to the target.

### 3.1 Implementation Status

| Phase                            | Status              | Notes                                                                                                                                                                      |
| -------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 0 — approval and inventory | Done                | Document reviewed and accepted.                                                                                                                                            |
| Phase 1 — foundation             | Done                | Locale segment, as-needed proxy, marketing group, providers, metadata, sitemap/robots, image allowlist, starter home converted to a Server Component.                      |
| Phase 2 — data layer             | Done                | Browser client, server-only fetch, generated OpenAPI schema from the current API, Problem Details mapping, query client, tests.                                            |
| Phase 3 — auth shell             | Infrastructure only | Session DAL, route guards, protected route-group layouts, optimistic cookie check. Auth UI is intentionally deferred until the backend auth API and UI are built together. |
| Phase 4 — marketing/catalog      | Pending             | Public pages and Strapi rendering.                                                                                                                                         |
| Phase 5 — learning               | Pending             | Learner dashboard, player, quiz, project, certificate.                                                                                                                     |
| Phase 6 — commerce               | Pending             | Checkout and payment status.                                                                                                                                               |
| Phase 7 — admin                  | Pending             | Administration screens.                                                                                                                                                    |
| Phase 8 — hardening              | Pending             | CSP enforcement, accessibility, performance, Storybook alignment, full E2E.                                                                                                |

The generated OpenAPI snapshot currently covers the implemented API surface only; it will grow as backend domains are added.

## 4. Architecture Principles

1. **Server-first rendering.** Render data on the server unless interactivity requires the browser. Every client boundary is a bundle-size and hydration decision.
2. **Smallest client boundary.** Put `"use client"` on the smallest component that needs state, events, browser APIs, or client hooks. Never mark an entire page as a client component for one widget.
3. **One source of truth per concern.** NestJS owns LMS data, authorization, payments, and sessions. Strapi owns marketing content only. The frontend owns presentation, navigation, and optimistic UX.
4. **No duplicated business rules.** Price, coupon, enrollment, progress, grading, certificate eligibility, and project decisions stay server-side. The UI explains and displays; it does not decide.
5. **URLs are navigation state.** Filters, pagination, tabs, sorting, and search SHOULD be represented in the URL when they are shareable or reload-safe. Ephemeral overlays stay in component state.
6. **Explicit states.** Every data-driven surface has loading, empty, error, unauthorized, and partial states. A blank screen is a defect.
7. **Accessibility by default.** Semantic HTML, keyboard access, focus management, and readable contrast are part of the definition of done, not a later pass.
8. **Measure performance.** Prefer server rendering, streaming, image optimization, and small bundles. Do not guess; use Web Vitals and bundle analysis.
9. **No hidden environment access.** Browser and server environment values come from `packages/env/web`; components do not read `process.env` directly.
10. **Boring, explicit boundaries.** Prefer a clear feature module over a clever abstraction. Do not add a layer, package, or state library until a concrete need exists.
11. **Progressive enhancement where practical.** Forms and navigation SHOULD remain understandable without client JavaScript, except where rich interaction is essential.
12. **Indonesian first.** Default copy, metadata, and error messages are Indonesian. English is a supported locale, not a second design.

## 5. Topology and Responsibilities

```text
Browser
  ├── HTML / RSC payload / static assets ← Next.js server
  ├── client mutations and query polling ─→ NestJS /api/v1
  └── Socket.io notifications ───────────→ NestJS /notifications

Next.js server
  ├── server fetch with forwarded cookies ─→ NestJS /api/v1
  ├── server-only Strapi adapter ─────────→ Strapi /api
  └── generated metadata/sitemap/OG ──────→ public output

NestJS
  ├── MySQL (source of truth)
  ├── Redis (cache, throttling)
  ├── providers (mail, storage, payments)
  └── Socket.io gateway

Strapi
  └── marketing content only; never LMS data
```

### 5.1 Responsibilities

| Path/service       | Owns                                                                     | Must not own                                                          |
| ------------------ | ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `apps/web`         | Routing, rendering, UI/UX, client state, SEO, i18n, frontend security    | Business rules, pricing, enrollment, grading, server authorization    |
| `apps/api`         | REST contract, authentication, authorization, transactions, domain rules | UI composition, Strapi content                                        |
| Strapi             | Marketing pages, articles, categories, authors, media for marketing      | Courses, users, orders, payments, enrollments, progress, certificates |
| `packages/env/web` | Validated browser and server environment schema                          | Business logic                                                        |
| `packages/config`  | TypeScript/tooling baseline                                              | Runtime state                                                         |
| `packages/db`      | DataSource, entities, migrations                                         | Frontend access                                                       |

### 5.2 Direct API Decision

The browser and the Next.js server reach NestJS through a same-origin `/api/v1` reverse proxy.

- Browser calls use the web origin (`NEXT_PUBLIC_SERVER_URL` + `/api/v1`), `withCredentials: true`, the CSRF header, and RFC 9457 error handling.
- Local development uses a Next.js rewrite from `/api/v1/:path*` to `${API_URL}/api/v1/:path*`. Production routes `/api/v1/*` at the edge (Coolify/Traefik) to the API service.
- Server calls use the server-only `API_URL` and forward the incoming session cookie.
- This is a transparent network reverse proxy, not an application BFF. It preserves the single API contract and host-only cookies.
- A catch-all Next Route Handler BFF is prohibited. A narrow Route Handler MAY be added later for a concrete reason: third-party webhook verification, an endpoint that must hide a server-only token, or a same-origin upload bridge. It MUST use a fixed endpoint allowlist.

### 5.3 Cookie and Origin Topology

- Production web is `academy.rumahkodingku.com`; production API is `api.rumahkodingku.com`.
- Staging uses isolated hosts: `staging-academy.rumahkodingku.com` and `staging-api.rumahkodingku.com`.
- Auth cookies are host-only (no `Domain` attribute), `HttpOnly`, `Secure` in production, and `SameSite=Lax`. Staging and production cookies MUST NOT be shared.
- CORS MUST allow only the configured web origin and MUST allow credentials.
- The web app MUST NOT set or read authentication cookies in JavaScript; the API owns them. Server-side session reads forward the incoming cookie.
- `NEXT_PUBLIC_SERVER_URL` is the web origin; `API_URL` is the internal API origin.
- CSRF tokens are fetched from `GET /api/v1/csrf/token` and sent as `x-csrf-token` on cookie-authenticated mutations.

## 6. Rendering Model

### 6.1 Default: Server Components

Pages, layouts, and data-oriented sections MUST be Server Components unless they need client behavior. Server Components may:

- Fetch data directly from NestJS or Strapi.
- Read cookies and headers through server-only APIs.
- Access server-only environment values.
- Render Client Components as children or leaves.
- Stream content with Suspense.

Server Components MUST NOT:

- Use `useState`, `useEffect`, event handlers, or browser APIs.
- Import a module marked `server-only` from a Client Component.
- Pass functions, class instances, or secrets to Client Components.

### 6.2 When a Client Component Is Required

Use `"use client"` only when the component needs one or more of:

- State or reducers.
- Event handlers (`onClick`, `onChange`, `onSubmit`).
- Lifecycle effects.
- Browser-only APIs (`window`, `document`, `localStorage`, `IntersectionObserver`).
- Client-only hooks or libraries.
- A third-party component that is not Server Component compatible.

A Client Component SHOULD be a leaf. If a page needs one interactive widget, the page remains a Server Component and renders the widget as a child.

### 6.3 Composition Rules

- Server Components MAY import and render Client Components.
- Client Components MUST NOT import Server Components directly. They may receive Server Components through the `children` prop or another serializable slot.
- Props crossing the boundary MUST be serializable. Do not pass functions, Dates with methods, class instances, or Promises outside the supported `use` pattern.
- Providers that use context or browser APIs belong in a Client Component wrapper near the root layout. Keep the provider surface small.
- Client Components MUST NOT re-fetch data that the server already provided unless freshness or interactivity requires it. Pass initial data or use hydration deliberately.

### 6.4 Async Route Props

In the target Next.js version, `params` and `searchParams` are Promises in pages and layouts. Code MUST await them before use:

```tsx
export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // ...
}
```

Do not rely on synchronous route props from older Next.js versions.

### 6.5 Streaming and Suspense

- Use `loading.tsx` for route-level loading UI.
- Use `<Suspense>` around independent async sections so one slow query does not block the whole page.
- Fetch independent data in parallel; avoid sequential waterfalls.
- Keep the static shell useful while dynamic content streams.
- Do not wrap the entire page in a single Suspense boundary if sections can resolve independently.

### 6.6 Error and Not-Found Boundaries

- Each route group SHOULD have an `error.tsx` with a retry action. `error.tsx` is a Client Component and receives a `reset` function.
- `not-found.tsx` MUST render a useful recovery path, not a bare message.
- Errors from the API are normalized before they reach the boundary; do not expose raw stack traces or SQL.
- Expected business rejections (validation, forbidden, conflict) SHOULD be rendered inline or as Problem Details messages, not thrown as unhandled errors.

### 6.7 Server Actions

Server Actions are stable but are not the default data layer.

- Use them for Next-local concerns: locale switching, theme preference, simple contact/newsletter flows, and redirects that do not need to become a general API.
- Do not use them for parallel data fetching; Server Functions are dispatched sequentially by the client.
- If an action calls NestJS, it MUST forward the session cookie, obtain a CSRF token, validate authorization server-side, and keep secrets on the server.
- Server Actions MUST validate their input; do not trust `FormData`.
- When deployed behind a proxy or multiple hosts, configure `experimental.serverActions.allowedOrigins` and a stable `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`.
- Core LMS mutations use the browser API client and TanStack Query, as decided in WEB-011.

### 6.8 Partial Prerendering and Cache Components

`cacheComponents` enables the `use cache` model and Partial Prerendering. It is NOT enabled in the baseline because the team has not yet standardized cache boundaries for every route.

- The baseline uses route segment revalidation, `fetch` cache options, and cache tags.
- `cacheComponents` MAY be adopted later after marketing and catalog caching are stable.
- Adoption requires a new decision, a cache review, and updated tests.

### 6.9 React Compiler

React Compiler is enabled in `next.config.ts`. Components SHOULD be written as plain idiomatic React.

- Do not add `useMemo` or `useCallback` only to satisfy an imagined compiler limitation.
- Add manual memoization only with a measured reason.
- Keep components pure and avoid mutating props or external state during render.

### 6.10 Rendering Checklist

Before marking a page complete:

- The page is a Server Component by default.
- Every `"use client"` boundary has a concrete interactivity reason.
- Route props are awaited.
- Independent data loads are parallel or streamed.
- Loading, error, and not-found states exist.
- No secret or server-only module crosses into a client bundle.
- The page has a useful static shell and a clear primary action.

## 7. Routing and App Router Structure

### 7.1 Target App Tree

```text
apps/web/src/app/
├── [locale]/
│   ├── layout.tsx                 # html/body, providers, locale, metadata base
│   ├── error.tsx                  # route-tree error boundary
│   ├── not-found.tsx              # locale-aware 404
│   ├── (marketing)/
│   │   ├── layout.tsx             # public header/footer
│   │   ├── page.tsx               # /
│   │   ├── courses/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── roadmaps/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── certificates/verify/[code]/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── about/page.tsx
│   │   ├── faq/page.tsx
│   │   └── contact/page.tsx
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── verify-email/page.tsx
│   ├── (commerce)/
│   │   ├── checkout/page.tsx
│   │   └── checkout/[orderId]/page.tsx
│   ├── (learn)/
│   │   ├── layout.tsx             # learner shell + session guard
│   │   ├── learn/page.tsx
│   │   ├── learn/courses/[courseId]/page.tsx
│   │   ├── learn/lessons/[lessonId]/page.tsx
│   │   ├── learn/quizzes/[quizId]/page.tsx
│   │   ├── learn/quizzes/attempts/[attemptId]/page.tsx
│   │   ├── learn/projects/[projectId]/page.tsx
│   │   └── learn/certificates/page.tsx
│   ├── (account)/
│   │   ├── layout.tsx             # account shell + session guard
│   │   ├── me/page.tsx
│   │   ├── me/orders/page.tsx
│   │   ├── me/notifications/page.tsx
│   │   ├── me/wishlist/page.tsx
│   │   ├── me/reviews/page.tsx
│   │   └── me/settings/page.tsx
│   └── (admin)/
│       ├── layout.tsx             # admin shell + ADMIN guard
│       └── admin/...
├── global-not-found.tsx
├── sitemap.ts
├── robots.ts
└── api/                            # only Next-specific endpoints, never a general BFF
```

The exact admin child routes follow the confirmed API and product scope. A route that has no backend contract MUST be marked `planned` in the route table and MUST NOT ship as a fake page.

### 7.2 Route Groups

| Group         | Purpose                                                             | Default access   | Layout               |
| ------------- | ------------------------------------------------------------------- | ---------------- | -------------------- |
| `(marketing)` | Landing, catalog, public roadmap, verification, blog, company pages | Public           | Public header/footer |
| `(auth)`      | Login, registration, recovery, verification                         | Guest            | Minimal auth shell   |
| `(commerce)`  | Checkout and payment status                                         | USER             | Checkout shell       |
| `(learn)`     | Course player, progress, quizzes, final project, certificates       | USER with access | Learner shell        |
| `(account)`   | Profile, orders, notifications, wishlist, reviews, settings         | USER             | Account shell        |
| `(admin)`     | Administration and reporting                                        | ADMIN            | Admin shell          |

Route groups do not appear in URLs. They exist to share layouts and boundaries.

### 7.3 Route Map

| URL                                   | Page                | Group         | Access        | API dependency  |
| ------------------------------------- | ------------------- | ------------- | ------------- | --------------- |
| `/`                                   | Home                | `(marketing)` | Public        | Catalog/Strapi  |
| `/courses`                            | Catalog/search      | `(marketing)` | Public        | Catalog         |
| `/courses/[slug]`                     | Course detail       | `(marketing)` | Public        | Catalog         |
| `/roadmaps`                           | Roadmap catalog     | `(marketing)` | Public        | Roadmaps        |
| `/roadmaps/[slug]`                    | Roadmap detail      | `(marketing)` | Public        | Roadmaps        |
| `/certificates/verify/[code]`         | Public verification | `(marketing)` | Public        | Certificates    |
| `/blog`, `/blog/[slug]`               | Marketing content   | `(marketing)` | Public        | Strapi          |
| `/about`, `/faq`, `/contact`          | Company/help        | `(marketing)` | Public        | Strapi/local    |
| `/login`                              | Login               | `(auth)`      | Guest         | Auth            |
| `/register`                           | Registration        | `(auth)`      | Guest         | Auth            |
| `/forgot-password`                    | Request reset       | `(auth)`      | Guest         | Auth            |
| `/reset-password`                     | Reset password      | `(auth)`      | Guest         | Auth            |
| `/verify-email`                       | Verify email        | `(auth)`      | Guest         | Auth            |
| `/checkout`                           | Start checkout      | `(commerce)`  | USER          | Orders          |
| `/checkout/[orderId]`                 | Payment status      | `(commerce)`  | USER          | Orders/Payments |
| `/learn`                              | Learning dashboard  | `(learn)`     | USER          | Enrollments     |
| `/learn/courses/[courseId]`           | Course player       | `(learn)`     | Enrolled USER | Learning        |
| `/learn/lessons/[lessonId]`           | Lesson              | `(learn)`     | Enrolled USER | Learning        |
| `/learn/quizzes/[quizId]`             | Quiz                | `(learn)`     | Enrolled USER | Quizzes         |
| `/learn/quizzes/attempts/[attemptId]` | Attempt/result      | `(learn)`     | Enrolled USER | Quizzes         |
| `/learn/projects/[projectId]`         | Final project       | `(learn)`     | Enrolled USER | Projects        |
| `/learn/certificates`                 | My certificates     | `(learn)`     | USER          | Certificates    |
| `/me`                                 | Account overview    | `(account)`   | USER          | Users           |
| `/me/orders`                          | Order history       | `(account)`   | USER          | Orders          |
| `/me/notifications`                   | Notifications       | `(account)`   | USER          | Notifications   |
| `/me/wishlist`                        | Wishlist            | `(account)`   | USER          | Wishlist        |
| `/me/reviews`                         | Reviews             | `(account)`   | USER          | Reviews         |
| `/me/settings`                        | Profile/settings    | `(account)`   | USER          | Users           |
| `/admin`                              | Admin dashboard     | `(admin)`     | ADMIN         | Admin/Analytics |
| `/admin/courses`                      | Course management   | `(admin)`     | ADMIN         | Courses         |
| `/admin/orders`                       | Orders              | `(admin)`     | ADMIN         | Orders          |
| `/admin/payments`                     | Payments            | `(admin)`     | ADMIN         | Payments        |
| `/admin/refund-requests`              | Refunds             | `(admin)`     | ADMIN         | Refunds         |
| `/admin/coupons`                      | Coupons             | `(admin)`     | ADMIN         | Coupons         |
| `/admin/users`                        | Users               | `(admin)`     | ADMIN         | Users           |
| `/admin/community`                    | Moderation          | `(admin)`     | ADMIN         | Community       |
| `/admin/reviews`                      | Review moderation   | `(admin)`     | ADMIN         | Reviews         |
| `/admin/roadmaps`                     | Roadmaps            | `(admin)`     | ADMIN         | Roadmaps        |
| `/admin/certificates`                 | Certificates        | `(admin)`     | ADMIN         | Certificates    |
| `/admin/analytics`                    | Analytics/reports   | `(admin)`     | ADMIN         | Analytics       |
| `/admin/audit-logs`                   | Audit trail         | `(admin)`     | ADMIN         | Audit           |
| `/admin/settings`                     | Platform settings   | `(admin)`     | ADMIN         | Admin           |

The route map is UX routing, not the API contract. API paths, payloads, and status codes remain in `docs/api/api-specification.md`. Add `planned` to this table only when a product requirement and API contract exist.

### 7.4 Locale Routing (As-Needed)

- Supported locales: `id` (default) and `en`.
- Indonesian URLs have no prefix: `/courses`.
- English URLs have the `en` prefix: `/en/courses`.
- `src/proxy.ts` rewrites unprefixed requests to the default locale and passes prefixed requests through.
- The proxy MUST skip `_next`, static assets, `/api`, and files with extensions.
- The proxy MUST prevent `/en/en/...` by short-circuiting when the path already starts with a supported locale.
- `generateStaticParams` returns the supported locales for locale-aware segments.
- The root layout lives at `src/app/[locale]/layout.tsx` and sets `<html lang={locale}>`.
- A `NEXT_LOCALE` cookie MAY remember an explicit user preference, but the URL remains authoritative for the rendered locale.
- Do not ship unsupported locale files. `public/locales/fr` MUST be removed unless French becomes an approved locale.

### 7.5 Proxy Responsibilities

`src/proxy.ts` (Next.js 16 replacement for `middleware.ts`) MAY do only:

- Locale rewrite/redirect.
- Optimistic authentication redirect based on cookie presence.
- Redirect authenticated users away from auth pages.
- Add request correlation headers when needed.

It MUST NOT:

- Query MySQL or Redis.
- Validate a JWT with a shared secret.
- Perform role checks as the only authorization.
- Fetch user profile data on every request.
- Rewrite arbitrary destinations or act as a general API proxy.

### 7.6 Route Handlers

Route Handlers under `src/app/api` are an exception, not the default API layer.

Allowed uses:

- Next-specific metadata or revalidation endpoints that cannot be done in a page.
- A narrow integration that must hide a server-only token.
- An upload bridge when the browser cannot call the API directly.
- Webhook verification owned by the frontend deployment (rare; prefer NestJS).

Rules:

- Use a fixed endpoint allowlist; never forward an arbitrary path.
- Validate input and method.
- Do not duplicate NestJS domain logic.
- Return RFC 9457-compatible errors when the response is consumed by the app.
- Document the endpoint in the route table and API notes.

### 7.7 Metadata Files

- `sitemap.ts` generates public URLs for both locales.
- `robots.ts` disallows `/learn`, `/me`, `/admin`, and auth flows.
- `opengraph-image.tsx` MAY generate default social images.
- `global-not-found.tsx` requires `experimental.globalNotFound: true` in `next.config.ts`; enable it only when the app needs a full-document 404 outside the locale layout.
- Static files that are not routes live in `public/` and MUST not contain secrets.

## 8. Feature Module Structure

### 8.1 Standard Feature Module

```text
src/features/<domain>/
├── components/              # domain presentation and composition
├── hooks/                   # client hooks, query/mutation wrappers
├── api/                     # query keys, browser calls, TanStack Query hooks
├── server/                  # server-only queries and data access
├── schemas/                 # Zod input and UI validation
├── types.ts                 # frontend view/domain types
├── utils.ts                 # pure helpers
└── index.ts                 # public surface for other features
```

Not every module needs every folder. Add a folder only when it has real content. Do not create empty layers.

### 8.2 Rules

- `src/app` contains routing, layouts, boundaries, and page composition only.
- Feature components MUST NOT contain raw API transport logic. Use `api/` or `server/`.
- `server/` files MUST start with `import "server-only";`.
- `api/` files may be imported by Client Components; they MUST NOT import server-only modules.
- A feature exposes only what other features need through `index.ts`. Consumers MUST NOT deep-import another feature’s internal files.
- Shared presentational components move to `components/ui` or `components/shared` only when at least two features use them.
- Feature-specific business presentation (labels, status mapping, empty copy) stays in the feature.
- Landmark business rules remain on the server; feature code maps API results into view models.

### 8.3 Initial Feature Modules

| Feature         | Responsibility                                              |
| --------------- | ----------------------------------------------------------- |
| `auth`          | Login, registration, recovery, verification UI, session DAL |
| `account`       | Profile, settings, orders, notifications, wishlist, reviews |
| `marketing`     | Landing, about, FAQ, contact, Strapi-rendered pages         |
| `catalog`       | Course catalog, search, filters, course detail              |
| `checkout`      | Order creation, coupon validation, payment status           |
| `learning`      | Learner dashboard, course player, lesson progress           |
| `quiz`          | Quiz attempt, submission, result                            |
| `project`       | Final project submission, versions, review status           |
| `certificate`   | User certificates, download, public verification            |
| `roadmap`       | Public roadmap catalog and learner progression              |
| `community`     | Course discussions, lesson Q&A, reports                     |
| `notifications` | In-app list, unread count, socket/polling fallback          |
| `admin`         | Admin shell and administrative workflows                    |

Feature names describe business capabilities, not UI components. A folder named `dashboard`, `cards`, or `helpers` is not a feature.

### 8.4 Public Surface

`index.ts` exports only what another feature or route may use:

- Public components.
- Public query keys.
- Public hooks when cross-feature composition is legitimate.
- Public types.

If an export is only used inside the feature, do not export it. Remove `index.ts` completely if nothing is shared.

### 8.5 Naming

- Folders: kebab-case or the established repository convention.
- Components: PascalCase file and export.
- Hooks: `use-*.ts` file, `use*` export.
- Query keys: `featureKeys` object.
- Server functions: verb-first, for example `getCourseForPlayer`.
- Client mutation hooks: `useCreateOrder`, `useSubmitQuizAttempt`.
- Zod schemas: `<Entity>Schema`, input types derived with `z.infer`.
- Avoid vague names: `data.ts`, `helpers.ts`, `manager.ts`, `service.ts` in the feature root unless the responsibility is obvious.

## 9. Ownership and Dependency Rules

### 9.1 Ownership

| Path                     | Owns                                                        | Must not own                                                 |
| ------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------ |
| `src/app/`               | Routing, layouts, boundaries, page composition              | Domain rules, transport details, cross-feature orchestration |
| `src/features/`          | Domain UI, query/mutation hooks, view models, feature copy  | Another feature’s private files, backend business rules      |
| `src/components/ui/`     | Primitive design-system components                          | Domain data, API calls, feature copy                         |
| `src/components/shared/` | App-wide presentational composition                         | Domain-specific policy                                       |
| `src/components/layout/` | Header, footer, shells, navigation chrome                   | Page data fetching beyond navigation needs                   |
| `src/lib/api/`           | Browser/server transport, generated schema, Problem Details | Business rules, React rendering                              |
| `src/lib/strapi/`        | Server-only marketing adapter, media helpers, SEO mapping   | LMS data                                                     |
| `src/lib/auth/`          | Session DAL, route guards, auth view helpers                | Token issuance, refresh rotation, password hashing           |
| `src/lib/i18n/`          | Server/client i18n setup, locale metadata                   | Page copy decisions                                          |
| `src/config/`            | Env access, navigation, site metadata                       | Secrets in client code                                       |
| `src/types/`             | Technology-neutral shared frontend types                    | Business behavior                                            |
| `src/proxy.ts`           | Locale and optimistic auth redirect                         | Authorization decisions, DB calls                            |

### 9.2 Import Matrix

| Importer →          | `app` | `features`                         | `components/ui` | `components/shared` | `lib`          | `config` | `types` |
| ------------------- | ----- | ---------------------------------- | --------------- | ------------------- | -------------- | -------- | ------- |
| `app`               | —     | Yes                                | Yes             | Yes                 | Yes            | Yes      | Yes     |
| `features/<self>`   | No    | Yes                                | Yes             | Yes                 | Yes            | Yes      | Yes     |
| `features/<other>`  | No    | Public `index.ts` only             | Yes             | Yes                 | Yes            | Yes      | Yes     |
| `components/ui`     | No    | No                                 | Yes             | Yes                 | Pure utilities | No       | Yes     |
| `components/shared` | No    | Public presentational exports only | Yes             | Yes                 | Yes            | Yes      | Yes     |
| `lib`               | No    | No                                 | No              | No                  | Yes            | Yes      | Yes     |
| `lib/strapi`        | No    | No                                 | No              | No                  | `lib/strapi`   | Yes      | Yes     |

Rules:

- `app` MAY import feature modules; features MUST NOT import `app`.
- Shared UI MUST NOT depend on a feature.
- `lib` MUST NOT import React components or feature state.
- Server-only modules MUST NOT be imported by client modules.
- Generated API files MUST NOT be edited manually.

### 9.3 Server-Only Boundaries

These modules MUST start with `import "server-only";`:

- `src/lib/api/server.ts`
- `src/lib/strapi/server.ts`
- `src/lib/strapi/client.ts` (authenticated client)
- `src/lib/auth/session.ts`
- Any feature `server/` module that reads cookies, secrets, or privileged data.

The browser client, query hooks, and presentational components MUST remain free of these imports. Violations are build defects, not style nits.

### 9.4 When to Share

Before moving code to `components/shared`, `lib`, or a package, ask:

1. Is it used by at least two features?
2. Is it free of domain policy?
3. Does it have a stable interface?
4. Would duplication be worse than the abstraction?

If the answer is no, keep it in the feature. Do not create `packages/ui` or `packages/contracts` until a concrete, repeated need exists.

### 9.5 Circular Dependencies

- Features MUST NOT import each other cyclically.
- If two features need each other, move the shared contract to `types/`, `lib/`, or a shared component, or reconsider ownership.
- `forwardRef`-style workarounds are not acceptable for architectural cycles.
- Route composition belongs in `app`, not inside a feature.

## 10. Data Fetching and API Client

### 10.1 Contract

All LMS data comes from NestJS under `/api/v1`.

- Success: `{ data, meta }`.
- Error: RFC 9457 Problem Details with `Content-Type: application/problem+json`, `type`, `title`, `status`, `detail`, `instance`, `code`, `requestId`, and optional `errors`.
- Authentication uses HttpOnly cookies owned by the API.
- Cookie-authenticated mutations send `x-csrf-token`.
- The frontend MUST NOT call MySQL, Redis, or provider SDKs directly.

### 10.2 Browser Client

`src/lib/api/client.ts` is the only browser transport.

- Base URL: `${NEXT_PUBLIC_SERVER_URL}/api/v1`.
- `withCredentials: true`.
- Default `Accept: application/json` and `Content-Type: application/json` for JSON requests.
- Timeout: 10 seconds for normal requests; uploads use a streaming uploader.
- Request interceptor attaches the CSRF token for non-GET requests when available.
- Response interceptor converts Problem Details into `ApiProblemError`.
- 401 handling redirects to login or refreshes once through the API; it MUST NOT loop.
- The client MUST NOT read or write auth cookies.

### 10.3 Server Fetch

`src/lib/api/server.ts` is server-only.

- `import "server-only";`
- Base URL: `API_URL` (server-only), falling back to `NEXT_PUBLIC_SERVER_URL` only in local development.
- Forward the incoming cookie header with `cookies()`.
- Accept an explicit cache policy:
  - `no-store` for authenticated user data.
  - `next: { revalidate, tags }` for public catalog/marketing data.
- Return typed data or throw `ApiProblemError`.
- Do not keep a module-level token or user object.
- Do not log the cookie header.

### 10.4 Generated API Types

Types are generated from the NestJS OpenAPI document.

- Tool: `openapi-typescript`.
- Source: `GET /swagger-json` in development or a committed `openapi.json` snapshot for deterministic CI.
- Output: `src/lib/api/schema.d.ts`.
- Script: `pnpm --filter web generate:api`.
- The generated file MUST be committed and reviewed when the API contract changes.
- Hand-written transport wrappers use `schema` types; do not hand-maintain duplicate payload types.
- CI SHOULD fail when generated types are stale relative to the committed schema.

### 10.5 Query Keys and Query Functions

Each feature owns a query key factory:

```ts
export const courseKeys = {
  all: ["courses"] as const,
  list: (filters: CourseFilters) => [...courseKeys.all, "list", filters] as const,
  detail: (slug: string) => [...courseKeys.all, "detail", slug] as const,
  player: (courseId: string) => [...courseKeys.all, "player", courseId] as const,
};
```

Rules:

- Query keys are stable, serializable, and scoped by feature.
- Filters and pagination are part of the key.
- Server and client use the same key names when data is shared.
- Mutations invalidate the smallest relevant key, not the entire cache.
- Do not use array index as a key for lists.

### 10.6 Error Normalization

- `ApiProblemError` exposes `status`, `code`, `requestId`, `errors`, and a safe user message.
- Validation errors map to form fields when `errors` provides field paths.
- 401 → login/refresh flow.
- 403 → permission-denied state.
- 404 → not-found state.
- 409 → conflict message with a recovery action.
- 429 → retry-after message.
- 5xx → generic recovery state; never expose internal details.
- Unknown errors are logged server-side or reported to observability; the UI shows a safe message.

### 10.7 Pagination and Filtering

- Use the API’s documented `page`, `limit`, `sort`, and `order` conventions.
- Keep filters, search, and page in the URL when shareable.
- Do not fetch all rows and filter in the browser when the API supports server-side filtering.
- Preserve scroll position on back navigation where practical.
- Show total counts and empty states honestly.

### 10.8 When a BFF Is Allowed

Direct API is the default. A narrow Route Handler MAY be added only if:

- A server-only credential must never reach the browser.
- A third-party service requires a same-origin callback.
- A response must be transformed for a browser-only integration that cannot use the API contract.
- The route uses a fixed allowlist and is covered by tests.

A catch-all `/api/proxy/[...path]` is prohibited.

### 10.9 Retries and Timeouts

- GET requests MAY retry transient network failures with bounded attempts.
- Mutations MUST NOT retry automatically unless the operation is idempotent and documented.
- Payment/order mutations MUST send an idempotency key when the API supports it.
- Uploads use progress and cancellation; do not silently retry a partially completed upload.
- Timeouts produce a recoverable error state, not an infinite spinner.

### 10.10 Environment Variables

| Variable                   | Scope            | Purpose                                      |
| -------------------------- | ---------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SERVER_URL`   | Browser + server | Public API origin                            |
| `NEXT_PUBLIC_SITE_URL`     | Browser + server | Public web origin for metadata/sitemap       |
| `API_URL`                  | Server only      | Internal API origin for RSC/server fetch     |
| `AUTH_SESSION_COOKIE`      | Server only      | Cookie name used for optimistic proxy checks |
| `NEXT_PUBLIC_STRAPI_URL`   | Browser + server | Public Strapi media/content origin           |
| `STRAPI_API_TOKEN`         | Server only      | Authenticated Strapi reads                   |
| `NEXT_PUBLIC_POSTHOG_KEY`  | Browser          | Product analytics                            |
| `NEXT_PUBLIC_POSTHOG_HOST` | Browser          | PostHog host                                 |

All values MUST be validated through `packages/env/web`. Components and library files MUST NOT read `process.env` directly.

## 11. State Management

### 11.1 State Categories

| State                             | Owner                      | Tool                        |
| --------------------------------- | -------------------------- | --------------------------- |
| Server data fetched on the server | RSC                        | Server fetch + props        |
| Client-cached server data         | TanStack Query             | Query cache                 |
| Shareable navigation state        | URL                        | search params               |
| Ephemeral local UI                | Component                  | `useState`/`useReducer`     |
| Cross-component UI state          | Client store               | Zustand                     |
| Auth session                      | Server                     | Cookie + session DAL        |
| Realtime notifications            | TanStack Query + Socket.io | Query cache + socket events |

### 11.2 TanStack Query

Use TanStack Query for client-side server state:

- Infinite lists, polling, live status, and mutations.
- Data that must refresh after a client action.
- Data shared across client components.
- Socket-driven cache updates.
- Optimistic mutation flows.

Do not use it as a replacement for RSC data on initial page load. If the server already fetched the data, pass it as `initialData` or hydrate only when the client needs immediate interaction.

### 11.3 Zustand

Use Zustand only for ephemeral UI state that is shared across components:

- Sidebar open/closed.
- Command palette.
- Multi-step draft UI that is not ready for the URL.
- Density or view preferences that are not server data.

Do not store:

- User profiles, orders, enrollments, or course content.
- Auth tokens.
- API responses that belong in TanStack Query.
- State that should survive reload and is shareable; put it in the URL.

### 11.4 URL State

Use `searchParams` for:

- Search query.
- Category, difficulty, and price filters.
- Sort and order.
- Page number.
- Tabs that represent distinct views.

Rules:

- Parse and validate search params with Zod.
- Ignore unknown params safely.
- Preserve unrelated params when updating one value.
- Do not put secrets or long-lived sensitive data in the URL.

### 11.5 Hydration and Initial Data

- Prefer server-rendered data and no client refetch on mount.
- When hydrating a query, ensure the server query and client query use the same key and shape.
- Do not serialize large trees unnecessarily; pass only the data the client needs.
- Dates cross the boundary as ISO strings, not `Date` instances.

### 11.6 Realtime Notifications

- Socket.io is the primary in-app notification channel.
- TanStack Query polling is the fallback when the socket is disconnected.
- Socket authentication uses the same session cookie as REST.
- The client MUST NOT send a user ID as proof of identity.
- On `notification.created`, update the notification query cache and unread count.
- On reconnect, refetch the notification list and unread count.

### 11.7 Logout and Cache Reset

On logout:

- Call the API logout endpoint.
- Clear TanStack Query cache for user-scoped data.
- Clear Zustand user-scoped UI state.
- Disconnect the socket.
- Redirect to the public home or login page.
- Do not leave stale personal data in memory or storage.

## 12. Caching and Revalidation

### 12.1 Cache Matrix

| Data                     | Source  | Strategy                 | Tag / key            |
| ------------------------ | ------- | ------------------------ | -------------------- |
| Marketing page           | Strapi  | ISR, about 1 hour        | `strapi:page:<slug>` |
| Blog list                | Strapi  | ISR, about 1 hour        | `strapi:blog`        |
| Blog detail              | Strapi  | ISR, about 1 hour        | `strapi:blog:<slug>` |
| Course catalog           | NestJS  | 60 seconds               | `catalog:courses`    |
| Course detail (public)   | NestJS  | 60–300 seconds           | `course:<id>`        |
| Public roadmap           | NestJS  | 300 seconds              | `roadmaps`           |
| Certificate verification | NestJS  | `no-store` or very short | none                 |
| Learner area             | NestJS  | `no-store`               | none                 |
| Account area             | NestJS  | `no-store`               | none                 |
| Admin area               | NestJS  | `no-store`               | none                 |
| Session/user             | NestJS  | per-request `cache()`    | none                 |
| Static assets            | Next.js | immutable                | file hash            |

### 12.2 Rules

- Private, personalized, or role-dependent data MUST NOT be cached in a shared cache.
- `revalidateTag(tag, "max")` is the Next.js 16 form when tag invalidation is used.
- `revalidatePath` is acceptable for a specific public page whose content changed.
- Mutations that change catalog or marketing data MUST invalidate the affected tag.
- A cache tag name MUST be stable and documented in the feature that owns it.
- Do not cache by URL alone when the response depends on cookies or locale.
- Locale-specific content MUST include the locale in the cache key or tag.
- Do not use `force-cache` as a default. Choose it explicitly.

### 12.3 Marketing Content

- Strapi content is public and cacheable unless preview/draft mode is active.
- Draft/preview mode MUST use a server-only token and MUST NOT be enabled for anonymous users.
- Media URLs are normalized through the Strapi adapter; do not expose internal admin URLs.
- SEO metadata from Strapi is mapped explicitly, not dumped as raw HTML.

### 12.4 Catalog

- Public course catalog can tolerate short staleness.
- After an admin publishes or unpublishes a course, invalidate the catalog and course tags.
- Price and availability shown on the client are display values; checkout recalculates on the server.
- Enrollment-dependent course access is never cached as public content.

### 12.5 Cache Components

`cacheComponents` / `use cache` is not part of the baseline.

If adopted later:

- Define cache boundaries per route.
- Add `cacheLife` and `cacheTag` for every cached function.
- Re-test personalization, cookies, and locale behavior.
- Update this matrix and the Definition of Done.
- Record the decision as an ADR.

### 12.6 HTTP Cache Headers

- Static assets: long-lived immutable cache.
- HTML: follow the Next.js route strategy; do not add a conflicting CDN rule.
- API responses: NestJS owns API cache headers. The web client MUST NOT cache API responses in a service worker unless a concrete offline requirement exists.
- `no-store` applies to authenticated and personalized responses.

## 13. Authentication and Session

### 13.1 Ownership

NestJS owns authentication:

- Access and refresh tokens.
- HttpOnly cookies.
- Refresh token rotation.
- Session revocation.
- Password reset and email verification.
- Rate limiting.
- CSRF token issuance.

The web app owns the presentation and session _reads_:

- Login/register/recovery forms.
- Redirects and protected layouts.
- Session-aware navigation.
- Optimistic route protection.

### 13.2 Cookie Policy

- Authentication cookies MUST be HttpOnly.
- Cookies MUST be Secure in production.
- `SameSite` policy MUST match the deployment topology; prefer same-site subdomains with `Lax`.
- The web app MUST NOT read, write, or mirror auth cookies in JavaScript.
- Token values MUST NOT be placed in localStorage, sessionStorage, IndexedDB, or a non-HttpOnly cookie.
- The API owns cookie names and domains. The frontend reads only the session through the API.

### 13.3 Proxy Rules

`src/proxy.ts` performs optimistic checks only.

- A protected path without a session cookie redirects to `/login?next=<safe-path>`.
- An authenticated user visiting `/login` or `/register` may be redirected to `/learn`.
- The proxy reads cookie presence, not a decoded JWT role.
- The proxy MUST NOT query MySQL/Redis or call `/auth/me` on every request.
- The `next` parameter MUST be validated as a local path; never redirect to an external URL.

### 13.4 Session DAL

`src/lib/auth/session.ts` is server-only.

```ts
import "server-only";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export async function getSession(): Promise<SessionUser | null>;
export async function requireUser(): Promise<SessionUser>;
export async function requireAdmin(): Promise<SessionUser>;
```

Behavior:

- `getSession()` calls `GET /auth/me` with the incoming cookie and caches the result per request with React `cache()`.
- `requireUser()` redirects to login with a safe `next` path when unauthenticated.
- `requireAdmin()` requires an authenticated `ADMIN`; otherwise render the forbidden state or redirect.
- A network failure is not the same as unauthenticated. Render a dependency-error state; do not silently log the user out.
- The DAL MUST NOT accept a user ID or role from the client as proof of identity.

### 13.5 Protected Layouts

- `(learn)/layout.tsx` calls `requireUser()`.
- `(account)/layout.tsx` calls `requireUser()`.
- `(admin)/layout.tsx` calls `requireAdmin()`.
- The API still checks authorization on every request; layout guards are UX only.
- Do not fetch sensitive data in a layout before the guard resolves.

### 13.6 Auth Flows

- Login: POST credentials, API sets cookies, client invalidates session query, redirect to safe `next` or `/learn`.
- Register: POST registration, handle email-verification requirement, redirect to the documented next step.
- Refresh: the API rotates cookies. The client retries a failed request at most once after a successful refresh.
- Logout: POST logout, API revokes the refresh session, client clears user cache and socket, redirect to `/`.
- Forgot/reset password: always show a neutral response that does not reveal whether an email exists.
- Verification: handle expired/invalid tokens with a recovery path.

### 13.7 Client Session Query

Client components MAY use a TanStack Query wrapper around `/auth/me` for navigation state. The query:

- Uses the same data shape as the DAL.
- Is not the authorization source.
- Is cleared on logout.
- Is not persisted to localStorage.

### 13.8 Failure Semantics

| Status | UI behavior                                                       |
| ------ | ----------------------------------------------------------------- |
| 401    | Attempt refresh once; if still unauthenticated, redirect to login |
| 403    | Render permission-denied state; do not retry                      |
| 404    | Render not-found state                                            |
| 409    | Show conflict and a recovery action                               |
| 429    | Show retry-after and disable submit temporarily                   |
| 5xx    | Show generic recovery; log with request ID                        |

Never reveal whether another user’s resource exists when the API intentionally returns 404 for unauthorized access.

## 14. Authorization and Route Protection

### 14.1 Security Boundary

Frontend route protection is a user-experience feature, not a security boundary. Every protected operation MUST be authorized by NestJS.

The frontend MUST NOT:

- Decide that a user may access a course from client state alone.
- Hide a destructive action and assume the API is safe without its own check.
- Trust a role, user ID, entitlement, price, or status supplied by the browser.
- Render sensitive data before the server has authorized the request.

### 14.2 Roles

The initial roles are:

- `USER` — learner and buyer.
- `ADMIN` — platform administrator.

Additional roles require a product decision and a backend permission model. The frontend MUST NOT invent roles or permission strings.

### 14.3 Access Matrix

| Surface                  | Guest             | USER                        | ADMIN                    |
| ------------------------ | ----------------- | --------------------------- | ------------------------ |
| Marketing/catalog        | Yes               | Yes                         | Yes                      |
| Certificate verification | Yes               | Yes                         | Yes                      |
| Login/register           | Yes               | Redirect                    | Redirect                 |
| Checkout                 | Redirect to login | Yes                         | Yes                      |
| Learner area             | Redirect to login | Yes, with entitlement check | Yes if enrolled          |
| Account area             | Redirect to login | Yes                         | Yes                      |
| Admin area               | Redirect to login | Forbidden                   | Yes                      |
| Admin mutations          | No                | No                          | Yes + backend permission |

Entitlement and ownership are checked by the API on every request. The UI may use the same data to explain locked states, but it MUST not grant access.

### 14.4 Admin UI Rules

- The admin layout calls `requireAdmin()`.
- The API still checks the role and resource permission.
- Destructive actions require confirmation and show the resource name.
- Sensitive changes display an audit hint: actor, action, resource, timestamp when available.
- Admin tables do not render data the current permission cannot access.
- Admin routes are excluded from search indexing and analytics pageviews that would leak private paths.

### 14.5 Ownership Checks

For user-owned resources (orders, submissions, reviews, certificates, notifications):

- The API returns only the current user’s records, or 404 when disclosure is unsafe.
- The frontend does not construct “other user” URLs.
- A copied URL to another user’s resource must fail at the API, not just render an empty page.
- Client-side ownership checks are explanatory only.

### 14.6 Socket Authorization

- The socket handshake uses the same session identity as REST.
- The client never sends a user ID as identity proof.
- The server joins rooms; the client does not choose arbitrary rooms.
- On logout or session revocation, disconnect the socket and clear user-scoped caches.

### 14.7 Forbidden State

- Render a clear “Anda tidak memiliki akses” state.
- Offer a safe next action: back to dashboard, contact support, or login with another account.
- Do not reveal the protected resource’s contents.
- Log the event without sensitive data.

## 15. Forms, Mutations, and Validation

### 15.1 Default Mutation Path

Core LMS mutations use the browser API client and TanStack Query:

- Create order.
- Apply coupon.
- Start payment.
- Update profile.
- Submit quiz attempt.
- Submit final project.
- Mark notification read.
- Create/update/delete community content.

The flow:

1. Validate input with a Zod schema.
2. Ensure a CSRF token is available for cookie-authenticated mutations.
3. Call the typed browser client.
4. Map Problem Details to fields or a form-level message.
5. Invalidate affected query keys and public cache tags when needed.
6. Show a persistent success/failure state for money, access, or assessment outcomes.

### 15.2 Server Actions

Server Actions are allowed only for Next-local concerns:

- Locale preference.
- Theme preference.
- Contact/newsletter forms that do not require LMS data.
- Simple redirects or local state changes.

If a Server Action calls NestJS:

- Forward the session cookie.
- Obtain and send the CSRF token.
- Validate input and authorization.
- Never expose the API token or session in the client.
- Do not use it for parallel data fetching.

### 15.3 Validation

- Client validation is for UX and immediate feedback.
- Server validation is authoritative.
- Share simple field rules through Zod schemas in `features/<domain>/schemas`.
- Do not duplicate price, coupon, entitlement, grading, or payment calculations in the client.
- Validate URL params and search params with Zod.
- Validate file type and size before upload; the API validates again.

### 15.4 Error Mapping

- Field errors from `ProblemDetails.errors` attach to the matching form field.
- Form-level errors render above the submit button or in an inline alert.
- `requestId` is shown in a copyable support detail, not in the primary message.
- Do not display raw API messages that contain internal details.
- Unexpected errors produce a retry path and a generic Indonesian message.

### 15.5 Optimistic Updates

Optimistic updates MAY be used for:

- Notification read state.
- Wishlist toggle.
- Review draft visibility.
- Small UI preferences.

They MUST NOT be used for:

- Payment success.
- Enrollment access.
- Quiz grading.
- Certificate issuance.
- Project approval.
- Refund decisions.

Every optimistic mutation needs a rollback path and a final server-confirmed state.

### 15.6 Double Submit and Idempotency

- Disable submit while a mutation is pending.
- Use an idempotency key for order/payment creation when the API supports it.
- Do not create a second order because the user clicked twice.
- After a timeout, show “cek status” instead of silently retrying a money operation.

### 15.7 File Uploads

- Upload entry points use the approved uploader (Uppy/Tus/XHR) and the API’s authorized upload flow.
- Do not upload directly to a bucket from the browser with long-lived credentials.
- Show progress, cancellation, and failure recovery.
- Validate size/type before upload.
- Never trust a user-provided storage path.
- Final project files are optional only when the course configuration says so.

### 15.8 Forms Checklist

- Label, description, and error are associated with the input.
- Required fields are clear.
- Submit is disabled during pending state.
- Success is visible without relying only on a toast.
- Failure preserves user input.
- Keyboard-only submission works.
- The form works at mobile widths.
- The form does not expose server secrets or internal IDs unnecessarily.

## 16. Internationalization and Locale Routing

### 16.1 Supported Locales

- `id` — Indonesian, default.
- `en` — English, ready but not required for every new string on day one.
- No other locale ships until a product decision approves it.
- `public/locales/fr` and any unsupported translation file MUST be removed.

### 16.2 URL Strategy

Locale routing is as-needed:

- Indonesian: `/`, `/courses`, `/learn`.
- English: `/en`, `/en/courses`, `/en/learn`.
- The locale is a route segment: `src/app/[locale]/...`.
- `proxy.ts` rewrites unprefixed requests to the default locale.
- Requests that already start with a supported locale pass through.
- The proxy MUST prevent double prefixes such as `/en/en/courses`.
- Static assets, `_next`, `/api`, and files with extensions are excluded from locale rewriting.

### 16.3 Root Layout and Locale

- `src/app/[locale]/layout.tsx` is the root layout.
- It sets `<html lang={locale}>` and `dir="ltr"`.
- It loads the locale dictionary and wraps the app in the theme, query, analytics, and toast providers.
- `generateStaticParams` returns the supported locales.
- Unknown locale segments return the not-found state; they do not silently fall back to `id` without a redirect decision.

### 16.4 i18next Setup

Keep i18next and react-i18next.

- Server: create or load a per-request i18n instance with the locale dictionary; never share mutable request state globally.
- Client: initialize once in a client provider with the active locale and namespaces.
- Use namespaces by feature (`common`, `auth`, `catalog`, `learning`, `admin`).
- Translation keys are stable and descriptive.
- Missing keys are development errors; production falls back to the default locale and logs safely.
- Do not translate API error codes with ad-hoc string matching in components; map known codes to messages in one place.

### 16.5 Formatting

Use `Intl` for:

- Dates and times (ISO input, localized output).
- Numbers.
- Currency. Money is IDR integer; format for display only.
- Relative time.
- Lists.

Do not hardcode `Rp`, separators, month names, or date order outside the formatter.

### 16.6 Content Rules

- All user-facing copy goes through translation keys.
- Do not concatenate translated sentence fragments; use complete messages with interpolation.
- Indonesian copy is the source of truth for product tone.
- English copy is reviewed for meaning, not word-for-word translation.
- `alt`, `aria-label`, metadata, empty states, and validation messages are all translated.
- Strapi content is localized by its own locale fields; do not machine-translate without review.

### 16.7 SEO and hreflang

- Public pages emit `hreflang` alternates for `id` and `en`.
- Canonical URLs include the correct locale prefix.
- `sitemap.ts` includes both locales and excludes private routes.
- `robots.ts` disallows learner/account/admin/auth routes.
- Metadata title/description come from the locale dictionary or Strapi SEO fields.

### 16.8 Locale Switching

- Switching locale preserves the current path when an equivalent route exists.
- If the path is not available in the target locale, redirect to the target locale home or the closest public page.
- Persist the explicit preference in `NEXT_LOCALE` only as a hint; the URL remains authoritative.
- Do not reload the entire app for a locale switch when a client transition is sufficient.

## 17. UI System and Styling

### 17.1 Design System Authority

The visual baseline is `docs/design/design-system.md`.

- Academy accent: `#2563EB`.
- Light and dark themes.
- Semantic tokens before primitive values.
- WCAG 2.2 AA target.
- Components use semantic tokens, not hardcoded colors or spacing.

### 17.2 Styling Stack

- Tailwind CSS 4 for utility composition.
- Base UI for accessible primitives.
- CVA for component variants.
- `cn` / `tailwind-merge` for class composition.
- `tw-animate-css` for approved motion utilities.
- Lucide icons as the single icon family unless an approved asset requires otherwise.

Do not add a second UI kit or CSS-in-JS runtime without an ADR.

### 17.3 Component Layers

| Layer              | Location                       | Responsibility                                                            |
| ------------------ | ------------------------------ | ------------------------------------------------------------------------- |
| Primitives         | `components/ui`                | Button, input, dialog, table, badge, skeleton, toast; no domain knowledge |
| Layout             | `components/layout`            | Header, footer, shells, navigation                                        |
| Shared composition | `components/shared`            | Empty state, error state, page header, data table wrapper                 |
| Feature UI         | `features/<domain>/components` | Domain-specific cards, forms, tables, player controls                     |
| Pages              | `app/[locale]/**`              | Composition and routing only                                              |

### 17.4 Component Rules

- A component has one responsibility.
- Props are explicit; avoid boolean explosions. Use variants or composition.
- Server Components do not receive event handlers.
- Client Components are leaf-level unless a provider/interaction boundary needs more.
- Do not put API calls inside primitive components.
- Do not put feature copy inside `components/ui`.
- Do not use `dangerouslySetInnerHTML` outside a sanitized content renderer.
- Provide loading, disabled, error, and empty variants where the component owns a data surface.

### 17.5 Theme

- Respect OS preference on first visit.
- Persist an explicit user choice.
- Prevent theme flash during initial render.
- Use semantic tokens in both themes.
- Test dialogs, popovers, tables, code blocks, charts, and third-party embeds in dark mode.
- Do not implement dark mode as a global color inversion.

### 17.6 Responsive Layout

- Design mobile-first.
- Learner video/lesson player must remain usable at small widths.
- Admin tables transform or scroll deliberately; do not hide critical columns without an inspection path.
- Touch targets aim for 44×44 CSS pixels where practical.
- Avoid fixed heights that clip translated text.

### 17.7 Motion

- Micro feedback: 100–160 ms.
- Standard transitions: 160–240 ms.
- Larger panels: 200–300 ms.
- Respect `prefers-reduced-motion`.
- Motion must not delay an essential action or carry information unavailable in static form.

### 17.8 Storybook

Storybook is the visual contract for UI states.

- Stories cover default, loading, empty, error, disabled, and mobile states for shared components.
- Domain stories live near the feature, not in a generic `stories/` dump.
- Storybook dependencies MUST use one consistent major version before UI expansion.
- Stories MUST NOT depend on live production APIs.
- A component with no Storybook coverage may still ship, but its states must be covered by tests or E2E.

### 17.9 Governance

- Token changes are reviewed with contrast and theme impact.
- New component variants require a real use case.
- Deprecated components are removed or documented.
- Accessibility issues block release for critical flows.
- Visual QA happens in a real browser, not only in code review.

## 18. Loading, Error, Empty, and Unauthorized States

Every data-driven surface MUST define these states. A blank screen is not an acceptable fallback.

### 18.1 Loading

- Route-level: `loading.tsx` or a route-owned Suspense fallback.
- Section-level: skeleton that matches the final layout.
- Mutation-level: disabled submit, spinner, and a status message.
- Navigation-level: Next.js link prefetch/pending state where available.
- Do not show an infinite spinner. After a timeout, show a recoverable error.

### 18.2 Empty

- Explain what is empty and why.
- Provide the primary next action.
- Distinguish “no data yet” from “no results for this filter”.
- Do not use an empty illustration as the only message.
- Keep the page header and navigation usable.

### 18.3 Error

- Show a safe message and a retry action.
- Keep the request ID available in a details/support affordance.
- Do not expose stack traces, SQL, or internal paths.
- A validation error belongs inline, not in a generic error page.
- A dependency failure (API down) is distinct from a business rejection.

### 18.4 Unauthorized and Forbidden

- Unauthenticated: redirect to login with a safe `next` path.
- Authenticated but forbidden: render a permission-denied page.
- Do not disclose whether a private resource exists.
- Provide a path back to the user’s dashboard or support.

### 18.5 Partial Data

- If one section fails, keep the rest of the page usable.
- Mark the failed section and offer retry.
- Do not replace the entire page with an error because one widget failed.

### 18.6 Offline and Timeout

- Mutations show a recoverable timeout message.
- Payment/order flows must provide a “check status” action instead of encouraging a duplicate purchase.
- Uploads show progress and allow cancellation/retry.
- Realtime notifications fall back to polling when the socket is unavailable.

### 18.7 Persistent Outcomes

Payment, enrollment, project review, quiz result, and certificate outcomes MUST remain visible in page state or history.

- Do not rely only on a toast.
- Do not navigate away before the server confirms the final state.
- Use a result page or a persistent status card for money/access outcomes.

### 18.8 State Checklist

For every page and major component:

- Loading.
- Empty.
- Error with recovery.
- Unauthorized/forbidden.
- Partial data.
- Offline/timeout for mutations.
- Success confirmation.
- Mobile and keyboard behavior.
- Dark theme.
- Localized copy.

## 19. Security

### 19.1 Trust Boundaries

- Browser input is untrusted.
- Client-side authorization is explanatory only.
- Session identity comes from the API-verified cookie, never from a client-supplied user ID or role.
- Strapi content is trusted only after sanitization for rich text.
- Server-only environment values never cross into a client bundle.

### 19.2 Server-Only Code

The following MUST be server-only:

- Session DAL and route guards.
- Server API fetch.
- Authenticated Strapi client and token.
- Any code that reads `API_URL`, `STRAPI_API_TOKEN`, or other secrets.
- Any code that reads cookies or private headers.

Use `import "server-only";` and verify the production build does not include these modules in client chunks.

### 19.3 Environment and Secrets

- `NEXT_PUBLIC_*` values are public by definition. Never put a secret behind that prefix.
- `STRAPI_API_TOKEN` is server-only.
- PostHog keys are project public keys; still do not send secrets, tokens, payment data, or unnecessary PII.
- Do not commit `.env` files.
- Validate all values through `packages/env/web`.
- Components and feature code MUST NOT read `process.env` directly.

### 19.4 Security Headers and CSP

The app MUST send:

- `Content-Security-Policy`.
- `Strict-Transport-Security` in production.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy`.
- `X-Frame-Options` or a CSP `frame-ancestors` equivalent.
- `Permissions-Policy` for unused browser capabilities.

CSP rollout:

1. Start in report-only mode and collect violations.
2. Allow only required script/style/font/image/connect/frame sources.
3. Use nonces for inline scripts where Next.js requires them; implement via `proxy.ts`.
4. Enforce after the report is clean.
5. Do not add `unsafe-eval` or broad `*` sources to silence violations.

### 19.5 CSRF

- Cookie-authenticated mutations MUST send `x-csrf-token`.
- The token comes from `GET /api/v1/csrf/token`.
- The browser client fetches and caches the token for the session.
- Server-side fetches forward the cookie; they do not bypass CSRF for browser-originated mutations.
- GET/HEAD/OPTIONS do not require the token.
- Payment webhooks are API-only and use provider signature verification, not browser CSRF.

### 19.6 XSS and Rich Text

- Do not use `dangerouslySetInnerHTML` without a sanitizer.
- Sanitize Strapi rich text on the server with an allowlist of tags/attributes.
- Lesson rich text follows the same rule.
- URLs from content are validated; reject `javascript:` and unexpected protocols.
- User-generated content is rendered as text by default.
- Markdown, if introduced, uses a safe renderer with raw HTML disabled or sanitized.

### 19.7 Images and Remote Content

- Configure `images.remotePatterns` only for approved Strapi and storage hosts.
- Do not proxy arbitrary remote images.
- Validate image dimensions and alt text from content.
- Do not use user-provided URLs as `src` without host validation.
- YouTube embeds use the privacy-enhanced domain where possible.

### 19.8 Uploads

- Upload through the API’s authorized flow.
- Do not store long-lived storage credentials in the browser.
- Validate file type and size on both client and server.
- Generate opaque storage keys on the server.
- Do not render user-uploaded HTML/SVG as active content.
- Show upload progress and cancellation.

### 19.9 Server Actions

- Only use Server Actions for approved cases (Section 15.2).
- Validate input.
- Verify the session and authorization.
- Configure `experimental.serverActions.allowedOrigins` when behind a proxy or multiple hosts.
- Set a stable `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` for multi-instance deployments.
- Keep the default body size limit unless a reviewed upload flow requires otherwise.

### 19.10 Authentication and Cookies

- Auth cookies are HttpOnly, Secure in production, and SameSite according to deployment.
- The web app never reads token values.
- Logout revokes the refresh session on the API.
- Session errors do not reveal whether an account exists.
- Admin access requires a server-side role check plus API authorization.

### 19.11 Privacy and Analytics

- Collect only events needed for product decisions.
- Do not send passwords, tokens, cookies, payment details, or unnecessary personal data to PostHog.
- Do not include email/name in event properties unless approved and minimized.
- Admin financial and learning reports come from MySQL via the API, not PostHog.
- Redact request IDs and user identifiers where they are not needed.

### 19.12 Dependency and Supply Chain

- Keep Next.js, React, and UI dependencies patched.
- Review new dependencies for bundle size, license, maintenance, and security.
- Do not add a second UI kit or a large client library without an ADR.
- Run the repository’s audit/CI checks.
- Do not enable remote code execution or arbitrary script injection through configuration.

### 19.13 Error Exposure

- Never render stack traces, SQL, internal paths, or provider credentials.
- Use safe Indonesian messages.
- Include `requestId` for support.
- Log internal details server-side only.

## 20. Performance

### 20.1 Budgets

Target Core Web Vitals on a mid-range mobile device:

| Metric | Target                     |
| ------ | -------------------------- |
| LCP    | ≤ 2.5 s                    |
| CLS    | ≤ 0.1                      |
| INP    | ≤ 200 ms                   |
| TTFB   | ≤ 800 ms on the app server |

Budgets are measured on representative pages (home, catalog, course detail, learner dashboard), not only in development.

### 20.2 Server-First

- Fetch on the server when the data is needed for first render.
- Stream slow sections.
- Keep the static shell useful.
- Avoid client-side waterfalls.
- Do not ship a client component whose only job is to fetch data that the server could have fetched.

### 20.3 Client Bundle

- Every `"use client"` boundary increases JavaScript cost.
- Split large widgets with `dynamic()` only when the interaction is deferred.
- Do not import a heavy chart/editor/uploader into the initial bundle.
- Analyze the bundle before adding a dependency.
- Keep third-party scripts out of the critical path.
- Do not duplicate a library already provided by the framework or the design system.

### 20.4 Images

- Use `next/image` for content images.
- Provide `sizes` for responsive layouts.
- Use `priority` only for the actual LCP image.
- Use appropriate formats and dimensions; do not upscale.
- Set explicit width/height or aspect ratio to prevent layout shift.
- Lazy-load below-the-fold media.

### 20.5 Fonts

- Use `next/font`.
- Subset to needed glyphs.
- Avoid multiple font families without a design reason.
- Prevent layout shift with `display: swap` and fallback metrics.
- Do not load fonts from an unapproved third-party host.

### 20.6 Streaming and Suspense

- Use sibling Suspense boundaries for independent sections.
- Keep fallbacks layout-stable.
- Do not block the whole page on a slow personalized widget.
- Avoid nested Suspense that causes visible content jumps.

### 20.7 Navigation and Prefetch

- Prefetch links that the user is likely to visit.
- Do not prefetch expensive personalized routes indiscriminately.
- Use `startTransition` for non-urgent client navigation where appropriate.
- Preserve scroll position on back navigation.

### 20.8 Caching

- Follow the cache matrix.
- Public content should be cacheable.
- Private content must not be cached.
- Revalidate tags after mutations.
- Do not use cache as a substitute for a fast query.

### 20.9 React Compiler

React Compiler is enabled. Write idiomatic React; do not add manual memoization without measurement. Measure the actual bundle and render behavior when optimizing.

### 20.10 Measurement

- Use Web Vitals reporting.
- Use bundle analysis in CI or before major releases.
- Test on a throttled connection and mid-range device.
- Compare before/after for performance changes.
- Record regressions with the page and metric.

## 21. Accessibility

### 21.1 Target

WCAG 2.2 AA for all user-facing flows. Accessibility is part of the Definition of Done, not a post-launch audit.

### 21.2 Semantics

- Use semantic HTML first: `button`, `a`, `label`, `table`, `nav`, `main`, `header`, `footer`, headings in order.
- Do not use a `div` as a button.
- Every page has one clear `h1`.
- Landmark regions are present and not duplicated.
- Lists use list semantics; tables use table semantics.

### 21.3 Keyboard

- Every interactive control is reachable by keyboard.
- Focus order follows the visual order.
- Dialogs trap focus and return focus on close.
- Menus, tabs, and comboboxes support arrow keys and Escape.
- Skip-to-content link is available.
- No keyboard trap outside an intentional modal.

### 21.4 Focus

- Focus is always visible.
- Focus styles meet contrast requirements.
- Route changes move focus to the page heading or a sensible landmark.
- Do not remove outlines without a replacement.
- Error summaries receive focus when validation fails.

### 21.5 Forms

- Every input has a programmatic label.
- Required state is conveyed in text, not color alone.
- Errors are associated with the field and announced.
- Help text is linked with `aria-describedby`.
- Disabled and pending states are understandable.
- Do not use placeholder as the only label.

### 21.6 Contrast and Visuals

- Normal text contrast ≥ 4.5:1; large text ≥ 3:1.
- Non-text UI and focus indicators ≥ 3:1.
- Do not use color alone to convey status.
- Check light and dark themes.
- Check disabled, hover, active, and error states.
- Support 200% zoom and reflow.

### 21.7 Target Size

- Aim for 44×44 CSS px for touch targets.
- Exceptions must be reviewed against WCAG 2.2 criteria.
- Icon-only buttons need an accessible name.

### 21.8 Motion

- Respect `prefers-reduced-motion`.
- Do not auto-play distracting animation.
- Motion must not be the only signal of a state change.
- Loading skeletons should be calm and optional for reduced motion.

### 21.9 Media

- Video/lesson embeds provide captions or transcripts where available.
- Do not autoplay audio.
- Provide controls for playback and volume.
- YouTube embeds use a privacy-enhanced domain where possible and have a fallback link.

### 21.10 Tables and Data

- Column headers are programmatic.
- Sort state is announced.
- Pagination controls are labeled.
- Empty/loading states are announced.
- Mobile transformation preserves meaning.

### 21.11 Language

- `<html lang>` matches the locale.
- Language changes inside content use `lang` attributes where needed.
- Error messages are localized.

### 21.12 Testing

- Keyboard-only pass for auth, checkout, learning, and admin critical flows.
- Automated accessibility scan in Playwright where practical.
- Manual screen-reader spot check before major release.
- Accessibility defects on critical flows block release.

## 22. SEO and Metadata

### 22.1 Metadata

- Use `generateMetadata` for dynamic pages.
- The root layout defines a title template and default description.
- Every public page has a unique title and description.
- Private pages are `noindex`.
- Metadata is localized for `id` and `en`.

### 22.2 Canonical and Alternates

- Public pages emit a canonical URL.
- Locale alternates use `hreflang` for `id` and `en`.
- `x-default` points to the Indonesian page when appropriate.
- Avoid duplicate URLs caused by trailing slashes, query variants, or locale prefixes.

### 22.3 Open Graph and Social

- Provide Open Graph and Twitter card metadata.
- Use a stable default image and page-specific images where available.
- Course pages use the course cover image and title.
- Certificate verification pages avoid exposing private learner data.
- OG images are generated or cached server-side; do not expose signed private URLs.

### 22.4 Sitemap and Robots

- `sitemap.ts` includes public marketing, catalog, roadmap, blog, and certificate verification URLs.
- `robots.ts` disallows `/learn`, `/me`, `/admin`, `/login`, `/register`, and other private routes.
- Sitemap entries include locale alternates.
- Do not include unpublished courses or revoked certificates.

### 22.5 Structured Data

- Use JSON-LD for course, organization, breadcrumb, and article where relevant.
- Certificate verification pages use minimal disclosure; do not embed personal data.
- Validate structured data before release.
- Do not invent ratings or reviews that the product does not have.

### 22.6 Strapi SEO

- Map Strapi SEO fields to Next metadata explicitly.
- Sanitize rich text and metadata.
- Do not render raw Strapi HTML into `<head>`.
- Preview/draft content is not indexed.

### 22.7 Private Routes

- Learner, account, checkout, and admin routes are not indexed.
- Auth pages are not indexed.
- Error pages return the correct status codes.
- Avoid exposing internal IDs in public URLs when a slug or public code exists.

## 23. Testing

### 23.1 Test Levels

| Level     | Tool                          | Scope                                                                        |
| --------- | ----------------------------- | ---------------------------------------------------------------------------- |
| Unit      | Vitest + Testing Library      | Synchronous components, hooks, utils, Zod schemas, query keys, formatters    |
| Component | Storybook + interaction tests | Visual states, keyboard interactions, responsive variants                    |
| Contract  | TypeScript + generated schema | API type drift, envelope and Problem Details types                           |
| E2E       | Playwright                    | Auth, catalog, checkout, learning, admin, i18n, accessibility-critical flows |
| Security  | Playwright + targeted checks  | Route guards, CSRF, XSS sanitization, secret leakage                         |

Vitest does not support async Server Components. Use Playwright for pages that await server data.

### 23.2 Unit Tests

Cover:

- Pure formatters and validators.
- Query key factories.
- Problem Details mapping.
- Form error mapping.
- Client-side state transitions.
- Permission-driven UI visibility.
- Locale-aware formatting.

Avoid asserting implementation details of React internals.

### 23.3 Component Tests

Cover:

- Loading, empty, error, forbidden, and success states.
- Keyboard interaction.
- Focus management.
- Responsive variants.
- Dark theme.
- Long translated strings.

### 23.4 E2E Tests

Critical journeys:

1. Register/login/logout/refresh.
2. Browse catalog and open a course.
3. Create order, apply coupon, complete mock payment.
4. Verify enrollment appears after verified payment.
5. Play a lesson and persist progress.
6. Take a quiz and see the result.
7. Submit a final project and view review status.
8. View/download a certificate and verify publicly.
9. Admin reviews a project and a refund.
10. Locale switch preserves the correct page.
11. Unauthorized user cannot open learner/admin routes.
12. CSRF rejection is handled safely.

E2E uses deterministic fixtures and a disposable environment. Never use production data.

### 23.5 Contract Tests

- Generate API types from the committed OpenAPI schema.
- Typecheck web code against the generated schema.
- Add a CI check for stale generated output.
- Test Problem Details handling for 400/401/403/404/409/429/500.

### 23.6 Accessibility Tests

- Automated scan on critical pages.
- Keyboard-only pass for auth, checkout, learning, and admin.
- Focus order and dialog behavior.
- Form error announcement.

### 23.7 Test Data

- Use factories and fixtures.
- Keep test users separate from real accounts.
- Reset disposable databases only.
- Never use production Redis, Strapi, or payment credentials.
- Mock payment outcomes are labeled and never grant production access.

### 23.8 CI Gates

PR:

- Format.
- Lint.
- Typecheck.
- Unit tests.
- Relevant E2E or component tests.
- Build.

Release:

- Full E2E.
- Accessibility pass.
- Performance smoke.
- API contract check.
- Migration/deployment verification.

### 23.9 Coverage Policy

Do not optimize for a global percentage. Prioritize auth, money, access control, assessment, certificate, and error recovery. A critical flow without a test is unfinished.

## 24. Observability and Analytics

### 24.1 Web Vitals

- Report LCP, CLS, INP, TTFB, and FCP.
- Attach the route group and page name, not raw query strings with sensitive values.
- Use the metrics to prioritize performance work.
- Do not send personal data in analytics properties.

### 24.2 Product Analytics

PostHog is product analytics and feature flags only.

- Use a typed event wrapper in `lib/analytics`.
- Event names are stable and documented.
- Capture pageviews and key product events, not every click.
- Do not send passwords, tokens, cookies, payment details, or unnecessary PII.
- Admin financial/learning reports come from MySQL via the API, not PostHog.
- Feature flags are UI hints; authorization remains server-side.

### 24.3 Error Observability

- Error boundaries report unexpected client errors with route and request ID when available.
- API Problem Details include `requestId`; surface it in support details.
- Server-side errors are logged by the API; the web app does not duplicate sensitive details.
- A chosen error-tracking service MAY be added later; it MUST scrub secrets and PII.
- Do not log cookies or authorization headers.

### 24.4 Realtime and Fallback

- Track socket connection failures and polling fallback usage.
- Do not log notification payloads with personal data.
- Alert when notification delivery is degraded.

### 24.5 Server Logs

- Include route/request ID when forwarding to the API.
- Do not log response bodies containing personal data.
- Log dependency failures with safe context.
- Correlate frontend errors with API request IDs where possible.

### 24.6 Dashboards

Minimum dashboards:

- Web Vitals by page group.
- Error rate by route group.
- API dependency failures.
- Socket connection and fallback rate.
- Checkout/login failure rate.
- Build/deploy success and cache hit behavior.

### 24.7 Privacy

- Analytics and logs follow data minimization.
- Retention is defined by the platform policy.
- User deletion/revocation must clear user-scoped client caches.
- Do not use analytics to reconstruct financial state.

## 25. Deployment and Configuration

### 25.1 Runtime

- Next.js 16 on Node.js 24 LTS.
- `output: "standalone"`.
- React Compiler and typed routes enabled.
- HTTPS only.
- Same-origin or same-site topology preferred for cookies.

### 25.2 Environment Matrix

| Variable                   | Build time | Runtime | Exposure        |
| -------------------------- | ---------- | ------- | --------------- |
| `NEXT_PUBLIC_SERVER_URL`   | Yes        | Yes     | Public          |
| `API_URL`                  | No         | Yes     | Server only     |
| `NEXT_PUBLIC_STRAPI_URL`   | Yes        | Yes     | Public          |
| `STRAPI_API_TOKEN`         | No         | Yes     | Server only     |
| `NEXT_PUBLIC_POSTHOG_KEY`  | Yes        | Yes     | Public          |
| `NEXT_PUBLIC_POSTHOG_HOST` | Yes        | Yes     | Public          |
| `NODE_ENV`                 | Yes        | Yes     | Public behavior |

`NEXT_PUBLIC_*` values are baked into the client bundle at build time. Changing them requires a rebuild.

### 25.3 Docker

- Multi-stage build.
- Builder installs the workspace, generates the standalone output, and builds.
- Runner copies only the standalone output, static assets, and public files.
- Run as a non-root user.
- Do not copy `.env`, source maps with secrets, or development tooling.
- Health check uses a lightweight route.
- Graceful shutdown drains requests.

### 25.4 API Connectivity

- `API_URL` uses the internal service hostname in Docker/Coolify where possible.
- The browser uses the public API URL from `NEXT_PUBLIC_SERVER_URL`.
- Do not route browser traffic through the Next.js server unless a reviewed BFF case exists.
- CORS allowlist must match the deployed web origin exactly.

### 25.5 Caching and CDN

- Static assets are immutable and fingerprinted.
- HTML caching follows Next.js output and the cache matrix.
- Do not put a CDN rule in front of authenticated pages that overrides `no-store`.
- Image optimization runs on the Next.js server; the deployment needs sufficient CPU/memory or an approved external loader.

### 25.6 Health and Readiness

- Provide a lightweight health endpoint or use the root page.
- Readiness should reflect the ability to serve the app, not Strapi availability.
- Do not expose dependency credentials in health output.
- Configure Coolify health checks and restart policy.

### 25.7 Rollback

- Keep the previous image.
- Roll back the web image independently of API migrations when the contract remains compatible.
- Verify auth, catalog, checkout, and learner entry after rollback.
- Record the incident and the deployed versions.

### 25.8 Build and Release

- CI: frozen install, format, lint, typecheck, tests, build.
- Generate API types before typecheck when the contract changed.
- Deploy staging, run smoke/E2E, then production.
- Apply API migrations before dependent web changes.
- Verify environment values before deployment.
- Do not build production with development API URLs.

### 25.9 Observability in Deployment

- Emit Web Vitals.
- Check error rate after deploy.
- Check socket/polling fallback.
- Check image optimization failures.
- Check API 5xx and 429 rates.
- Record the release and operator.

## 26. Architectural Anti-Patterns

The following are prohibited unless a documented exception is approved.

1. **Page-level client components.** Marking an entire page or layout `"use client"` because one widget needs state.
2. **Client-side data fetching for first render.** Fetching data in `useEffect` that the server could have rendered.
3. **Token storage in the browser.** Putting access/refresh tokens in localStorage, sessionStorage, IndexedDB, or a readable cookie.
4. **Frontend JWT verification.** Sharing `JWT_SECRET` with the web app or trusting a decoded role as authorization.
5. **Client-supplied identity.** Accepting a user ID, role, entitlement, price, or status from the browser as proof.
6. **Caching private data.** Shared caches for learner, account, checkout, or admin responses.
7. **Unsanitized HTML.** `dangerouslySetInnerHTML` without a server-side allowlist sanitizer.
8. **Direct `process.env` access.** Reading environment values in components or feature code instead of `packages/env/web`.
9. **Server-only imports in client code.** Importing session, Strapi token, or server fetch modules into a client bundle.
10. **Business logic duplication.** Recalculating price, coupon, eligibility, progress, grading, or refund rules in the UI.
11. **`any` API responses.** Disabling type safety instead of fixing the contract or generated type.
12. **Manual generated-file edits.** Editing `schema.d.ts` or other generated output.
13. **Domain-aware primitives.** Putting course/order/lesson concepts into `components/ui`.
14. **Server Actions for data fetching.** Using actions as a parallel data-loading layer.
15. **Waterfall rendering.** Sequential awaits that could be parallel or streamed.
16. **URL/local-state conflict.** Two sources of truth for filters, pagination, or selected tabs.
17. **Silent failure.** A mutation that fails without a visible recovery path.
18. **Toast-only outcomes.** Payment, access, assessment, or certificate results shown only in a transient toast.
19. **Unbounded retries.** Retrying mutations or uploads without idempotency and a limit.
20. **Unapproved UI dependencies.** Adding a second component library or CSS runtime without an ADR.

## 27. Definition of Done

### 27.1 Architecture

- [ ] Correct route group and feature module identified.
- [ ] Page is a Server Component unless a documented client reason exists.
- [ ] Client boundary is the smallest practical leaf.
- [ ] No server-only module imported by client code.
- [ ] No cross-feature private import.
- [ ] No business rule duplicated from NestJS.
- [ ] No new shared abstraction without a second consumer.

### 27.2 Data and API

- [ ] Browser and server clients are used correctly.
- [ ] API types are generated from the committed OpenAPI schema.
- [ ] Success and Problem Details envelopes are handled.
- [ ] Query keys are stable and scoped.
- [ ] Pagination/filtering use the API contract.
- [ ] No direct database/Redis/provider access from the browser.
- [ ] `API_URL` is server-only; `NEXT_PUBLIC_*` contains no secrets.

### 27.3 Auth and Authorization

- [ ] Protected layout uses `requireUser`/`requireAdmin`.
- [ ] `proxy.ts` performs only optimistic checks.
- [ ] No token is stored in browser storage.
- [ ] Backend authorization remains authoritative.
- [ ] 401/403/404 behavior is defined.
- [ ] Logout clears user caches and socket state.

### 27.4 Rendering and States

- [ ] Loading, empty, error, forbidden, and partial states exist.
- [ ] Async route props are awaited.
- [ ] Independent data is parallelized or streamed.
- [ ] Payment/access/assessment outcomes persist in page state.
- [ ] Timeout and retry behavior is safe.
- [ ] No infinite spinner.

### 27.5 Caching

- [ ] Cache matrix is followed.
- [ ] Private data is `no-store`.
- [ ] Public content has an explicit TTL/tag.
- [ ] Mutations invalidate affected tags/keys.
- [ ] Locale is part of the cache identity when needed.

### 27.6 UI and i18n

- [ ] Semantic tokens are used; no hardcoded palette.
- [ ] Components use the approved UI layer.
- [ ] All user-facing copy is translated.
- [ ] `id` and `en` keys are complete for the surface.
- [ ] Dates/numbers/currency use `Intl`.
- [ ] Unsupported locale files removed.
- [ ] Dark theme checked.
- [ ] Mobile and keyboard behavior checked.

### 27.7 Accessibility

- [ ] Semantic HTML and heading order.
- [ ] Keyboard access and visible focus.
- [ ] Labels, errors, and descriptions associated.
- [ ] Contrast checked.
- [ ] Reduced motion respected.
- [ ] Dialog/menu focus management.
- [ ] Critical flow keyboard pass.

### 27.8 Security

- [ ] No secret in client bundle.
- [ ] CSP/security headers applied.
- [ ] Rich text sanitized.
- [ ] Images restricted to approved hosts.
- [ ] CSRF token sent on mutations.
- [ ] No unsafe `dangerouslySetInnerHTML`.
- [ ] Error responses do not leak internals.
- [ ] Analytics excludes PII/secrets.

### 27.9 Performance and SEO

- [ ] Client bundle inspected when adding dependencies.
- [ ] Images optimized with dimensions/sizes.
- [ ] Fonts loaded via `next/font`.
- [ ] Web Vitals measured for the page.
- [ ] Public metadata/canonical/hreflang present.
- [ ] Private pages are `noindex`.
- [ ] Sitemap/robots updated when public routes change.

### 27.10 Testing and Operations

- [ ] Unit tests for new logic.
- [ ] Component/E2E coverage for the changed surface.
- [ ] Contract typecheck passes.
- [ ] Accessibility check passes for critical flow.
- [ ] Typecheck, lint, format, build pass.
- [ ] Deployment/env impact documented.
- [ ] API contract changes reflected in `docs/api/api-specification.md`.

## 28. Migration Roadmap and Appendices

### 28.1 Migration Principles

- Migrate in vertical slices; do not rewrite the whole app in one branch.
- Every phase must leave the app deployable.
- Do not mix a framework migration with a product feature unless the feature is the reason for the phase.
- Keep the NestJS API contract stable; update generated types with the contract.
- Reconcile documentation when a decision changes.
- Do not delete working code until its replacement is covered by tests.

### 28.2 Phase 0 — Approval and Inventory

Tasks:

- Review and approve this document.
- Inventory current routes, components, env values, and Strapi usage.
- Confirm supported locales (`id`, `en`).
- Confirm same-site cookie topology and production domains.
- Confirm Storybook version alignment owner.
- Confirm the analytics event taxonomy owner.
- Decide whether `cacheComponents` remains deferred after catalog stabilization.

Exit criteria:

- This document is approved.
- No unresolved decision affects auth, money, access, or privacy.

### 28.3 Phase 1 — Foundation

Tasks:

- Add `API_URL` and any missing Strapi/PostHog values to `packages/env/web`.
- Move to `src/app/[locale]/layout.tsx`.
- Add `src/proxy.ts` for locale as-needed and optimistic auth redirect.
- Add route groups and remove the unsupported `fr` locale.
- Convert the home page to a Server Component.
- Add root providers for theme, TanStack Query, i18n, analytics, and toasts.
- Add `error.tsx`, `not-found.tsx`, and `global-not-found.tsx`.
- Add base metadata, `sitemap.ts`, and `robots.ts`.
- Add `images.remotePatterns` for approved hosts.

Exit criteria:

- `id` and `en` URLs render correctly.
- No double locale prefix.
- Home is server-rendered.
- No unsupported locale file.
- Build/typecheck/lint pass.

### 28.4 Phase 2 — Data Layer

Tasks:

- Add `openapi-typescript` and `generate:api`.
- Generate and commit `src/lib/api/schema.d.ts`.
- Create browser client with CSRF/ProblemDetails interceptors.
- Create server-only fetch with cookie forwarding and cache policy.
- Add query key conventions and error normalization.
- Add a contract typecheck to CI.
- Add test coverage for Problem Details mapping and query keys.

Exit criteria:

- Browser and server calls both work against NestJS.
- No hand-written duplicate API payload types.
- Generated types are current.
- CSRF mutation path works.

### 28.5 Phase 3 — Auth Shell

Tasks:

- Build `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`.
- Add `getSession`, `requireUser`, `requireAdmin`.
- Add protected `(learn)`, `(account)`, and `(admin)` layouts.
- Add 401 refresh-once behavior and logout cache reset.
- Add safe `next` redirect handling.
- Add auth E2E tests.

Exit criteria:

- Guest, USER, and ADMIN routes behave as specified.
- No token is readable by JavaScript.
- Logout revokes the session and clears caches.
- Refresh loop cannot occur.

### 28.6 Phase 4 — Marketing, Catalog, and Public Pages

Tasks:

- Build the public shell and landing page.
- Build catalog with filters, search, pagination, and sorting.
- Build course detail with curriculum preview, price, outcomes, and certificate conditions.
- Build roadmap catalog/detail and certificate verification.
- Add Strapi-backed about/FAQ/contact/blog with server-only adapter.
- Add metadata, JSON-LD, sitemap entries, and cache tags.
- Add marketing/catalog E2E and accessibility checks.

Exit criteria:

- Public pages are server-rendered/cacheable.
- SEO metadata and hreflang are correct.
- Course prices are displayed but never trusted for checkout.
- Empty/error states work.

### 28.7 Phase 5 — Learning

Tasks:

- Build learner dashboard and enrolled course list.
- Build course player with lesson navigation, resume, and locked-state explanations.
- Persist lesson progress.
- Build quiz attempt/result UI.
- Build final project submission with version history.
- Build certificate list/download and public verification.
- Add notification list with socket and polling fallback.

Exit criteria:

- Non-enrolled users cannot access paid content.
- Progress persists and resumes.
- Quiz answer keys are never exposed before submission.
- Project outcomes remain visible.
- Certificate verification discloses minimal data.

### 28.8 Phase 6 — Commerce

Tasks:

- Build order creation and coupon validation.
- Build checkout/payment status with provider redirect handling.
- Never treat a redirect as payment confirmation.
- Build order history and refund request.
- Add idempotent submit behavior.
- Add money E2E with the local mock provider.

Exit criteria:

- Duplicate submit does not create duplicate orders.
- Payment success is shown only after verified API state.
- Enrollment appears after verified payment.
- Refund state is visible and auditable.

### 28.9 Phase 7 — Admin

Tasks:

- Build admin shell with `requireAdmin`.
- Build course/section/lesson management.
- Build orders, payments, refunds, coupons, users, community, reviews, roadmaps, certificates, analytics, audit, and settings screens as contracted.
- Add confirmation, audit context, and dense-table behavior.
- Add admin E2E and permission tests.

Exit criteria:

- USER cannot access admin routes or mutations.
- Destructive actions require confirmation.
- Admin lists are paginated and filterable.
- Sensitive actions show audit context.

### 28.10 Phase 8 — Hardening and Cutover

Tasks:

- Enable CSP report-only, resolve violations, enforce.
- Fix accessibility findings on critical flows.
- Run performance budgets and bundle analysis.
- Align Storybook versions and cover shared states.
- Add remaining E2E, security, and accessibility checks.
- Verify deployment env, same-site cookies, CORS, and CSRF.
- Run backup/rollback checks with operations.
- Update all affected documentation.

Exit criteria:

- Full CI green.
- Critical E2E green on staging.
- CSP enforced.
- No critical accessibility defect.
- Performance budgets met or accepted with a documented exception.
- Rollback path tested.

### Appendix A — Route Map

See Section 7.3. The route map is a UX contract, not an API contract.

### Appendix B — Environment Matrix

| Variable                   | Scope  | Required                      | Notes                                             |
| -------------------------- | ------ | ----------------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_SERVER_URL`   | Public | Yes                           | API origin for browser                            |
| `NEXT_PUBLIC_SITE_URL`     | Public | Yes                           | Web origin for canonical URLs and sitemap         |
| `API_URL`                  | Server | Yes in deployment             | Internal API origin; may equal public URL locally |
| `AUTH_SESSION_COOKIE`      | Server | Yes                           | Cookie name for optimistic proxy checks           |
| `NEXT_PUBLIC_STRAPI_URL`   | Public | Yes if Strapi content is used | Marketing content/media                           |
| `STRAPI_API_TOKEN`         | Server | If authenticated Strapi reads | Never expose                                      |
| `NEXT_PUBLIC_POSTHOG_KEY`  | Public | Optional                      | Product analytics                                 |
| `NEXT_PUBLIC_POSTHOG_HOST` | Public | Optional                      | Defaults to PostHog US host                       |
| `NODE_ENV`                 | Both   | Yes                           | `development`, `test`, `production`               |

All variables are validated by `packages/env/web`. `NEXT_PUBLIC_*` changes require a rebuild.

### Appendix C — Cache Matrix

See Section 12.1. Public content is cacheable; learner/account/admin is `no-store`; session data is per-request only.

### Appendix D — Dependency Rules Summary

- `app` → `features`, `components`, `lib`, `config`.
- `features` → own files, `components/ui`, `components/shared`, `lib`, `config`.
- `components/ui` → no features, no app.
- `lib` → no React components, no feature state.
- Server-only modules → never imported by client modules.
- Generated API files → never edited manually.
- Cross-feature access → public `index.ts` only.

### Appendix E — References

Official Next.js 16 documentation:

- Project structure: <https://nextjs.org/docs/app/getting-started/project-structure>
- Server and Client Components: <https://nextjs.org/docs/app/getting-started/server-and-client-components>
- Fetching data: <https://nextjs.org/docs/app/getting-started/fetching-data>
- Caching: <https://nextjs.org/docs/app/getting-started/caching>
- Revalidating: <https://nextjs.org/docs/app/getting-started/revalidating>
- Cache Components: <https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents>
- Backend for Frontend: <https://nextjs.org/docs/app/guides/backend-for-frontend>
- Authentication: <https://nextjs.org/docs/app/guides/authentication>
- Data security: <https://nextjs.org/docs/app/guides/data-security>
- Server Actions: <https://nextjs.org/docs/app/guides/server-actions>
- Internationalization: <https://nextjs.org/docs/app/guides/internationalization>
- Testing with Vitest: <https://nextjs.org/docs/app/guides/testing/vitest>
- Testing with Playwright: <https://nextjs.org/docs/app/guides/testing/playwright>
- Next.js 16 upgrade guide: <https://nextjs.org/docs/app/guides/upgrading/version-16>

Project references:

- `nestjs-architecture.md`
- `system-architecture.md`
- `monorepo-structure.md`
- `technology-stack.md`
- `../api/api-specification.md`
- `../design/design-system.md`
- `../development/coding-guidelines.md`
- `../development/testing-strategy.md`

### 28.11 Final Architecture Statement

`apps/web` is a server-first Next.js 16 App Router application organized by business feature modules. Server Components render public and authenticated pages; Client Components exist only for interaction, browser APIs, and client-side server state. NestJS remains the source of truth for authentication, authorization, LMS data, money, access, and assessment. Strapi supplies marketing content only. The browser and the Next.js server call NestJS directly, with HttpOnly cookies, CSRF protection, RFC 9457 errors, and generated API types. Caching is explicit and user-aware. Internationalization uses i18next with as-needed locale routing. Security, accessibility, performance, and testability are part of every feature's definition of done, not a final phase.
