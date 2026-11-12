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

<!-- SECTION_6 -->

## 7. Routing and App Router Structure

<!-- SECTION_7 -->

## 8. Feature Module Structure

<!-- SECTION_8 -->

## 9. Ownership and Dependency Rules

<!-- SECTION_9 -->

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
