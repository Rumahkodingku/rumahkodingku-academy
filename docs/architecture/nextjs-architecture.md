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

The current `apps/web` is a starter, not the target. The table below is the migration baseline. It MUST be updated when a gap is closed.

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

The browser and the Next.js server call NestJS directly.

- Browser calls use `NEXT_PUBLIC_SERVER_URL` + `/api/v1`, `withCredentials: true`, the CSRF header, and RFC 9457 error handling.
- Server calls use a server-only `API_URL` (internal Docker/Coolify hostname allowed) and forward the incoming session cookie.
- A catch-all BFF proxy is NOT the default. It adds a second contract, latency, and a place for authorization drift.
- A narrow Route Handler MAY be added later for a concrete reason: third-party webhook verification, an endpoint that must hide a server-only token, or a same-origin upload bridge. It MUST use a fixed endpoint allowlist and MUST NOT become a general proxy.

### 5.3 Cookie and Origin Topology

- Production SHOULD use a same-site topology (for example `academy.example.com` and `api.example.com`) so HttpOnly `SameSite=Lax` cookies work without weakening the policy.
- If the deployment must be cross-site, the API cookie policy, CORS allowlist, and CSRF strategy MUST be reviewed together. Do not set `SameSite=None` casually.
- CORS MUST allow only the configured web origin and MUST allow credentials.
- The web app MUST NOT set or read authentication cookies directly; the API owns them.
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

- Each route group SHOULD have an `error.tsx` with a retry action.
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

<!-- SECTION_10 -->

## 11. State Management

<!-- SECTION_11 -->

## 12. Caching and Revalidation

<!-- SECTION_12 -->

## 13. Authentication and Session

<!-- SECTION_13 -->

## 14. Authorization and Route Protection

<!-- SECTION_14 -->

## 15. Forms, Mutations, and Validation

<!-- SECTION_15 -->

## 16. Internationalization and Locale Routing

<!-- SECTION_16 -->

## 17. UI System and Styling

<!-- SECTION_17 -->

## 18. Loading, Error, Empty, and Unauthorized States

<!-- SECTION_18 -->

## 19. Security

<!-- SECTION_19 -->

## 20. Performance

<!-- SECTION_20 -->

## 21. Accessibility

<!-- SECTION_21 -->

## 22. SEO and Metadata

<!-- SECTION_22 -->

## 23. Testing

<!-- SECTION_23 -->

## 24. Observability and Analytics

<!-- SECTION_24 -->

## 25. Deployment and Configuration

<!-- SECTION_25 -->

## 26. Architectural Anti-Patterns

<!-- SECTION_26 -->

## 27. Definition of Done

<!-- SECTION_27 -->

## 28. Migration Roadmap and Appendices

<!-- SECTION_28 -->
