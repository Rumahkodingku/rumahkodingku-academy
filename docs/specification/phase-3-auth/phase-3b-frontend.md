# Phase 3.B — Frontend Auth, RBAC & Profile Integration

**Status:** Final implementation plan  
**Depends on:** Phase 3.A API contract and green backend tests  
**Produces:** Split auth UI, session-aware shell, profile/avatar UI, E2E

## 1. Scope

Phase 3.B covers `apps/web`, its env/config, client/server auth integration, tests, and docs. Do not change API business rules in this phase.

Deliverables:

- Same-origin `/api/v1` proxy in development and production.
- Browser auth client with CSRF and one-shot refresh retry.
- 7:3 split auth layout and auth pages.
- Session-aware public header and protected layouts.
- Permission-based navigation.
- Profile page with full profile fields and avatar upload/remove.
- Admin/user route protection and forbidden handling.
- Playwright auth E2E.
- Updated local-setup and Next.js architecture docs.

## 2. Global Constraints

- Read `docs/specification/phase-3-auth/README.md` first.
- Use existing UI primitives in `apps/web/src/components/ui/`.
- Use semantic tokens only; no hardcoded colors.
- Use `Field`, `Input`, `Button`, `Alert`, `Card`, `Badge`, `EmptyState`, `ErrorState`.
- Auth tokens never touch JavaScript-readable storage.
- The web app may read the session only through `GET /auth/me`.
- `proxy.ts` may only do optimistic cookie checks; it is not an authorization boundary.
- Client-side validation is UX only; server validation is authoritative.
- Every form has loading, error, success, and disabled states.
- Safe `next` redirect: only same-origin absolute paths; reject `//` and external URLs.
- Default UI language Indonesian; English-ready keys.
- No admin MFA UI or device-session list in Phase 3.B.
- Never compare role names in frontend code. Use `permissions`.
- Do not use social-login UI because providers are not implemented.

## 3. AuthUser Contract

```ts
type AuthUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  roles: string[];
  permissions: string[];
  profile: {
    displayName: string;
    fullName: string | null;
    username: string | null;
    bio: string | null;
    headline: string | null;
    avatarUrl: string | null;
    phone: string | null;
    countryCode: string | null;
    city: string | null;
    timezone: string | null;
    locale: "id" | "en";
    websiteUrl: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    xUrl: string | null;
    instagramUrl: string | null;
    emailNotifications: boolean;
    inAppNotifications: boolean;
  };
};
```

Permissions are for UI visibility only. Backend policy remains authoritative.

## 4. Task B1 — Same-origin proxy and environment

### Files

- Modify `apps/web/next.config.ts`.
- Modify `packages/env/src/web.ts`.
- Modify `apps/web/.env.example`.
- Modify `apps/web/src/lib/api/client.ts`.
- Modify `apps/web/src/lib/api/server.ts` only if base URL changes.
- Modify `apps/web/src/proxy.ts`.
- Modify `docs/development/local-setup.md`.
- Modify `docs/architecture/nextjs-architecture.md`.

### Behavior

Local development:

- Browser calls `http://localhost:3001/api/v1/*`.
- Next rewrite proxies to `API_URL` (`http://localhost:3000/api/v1/*`).
- API `Set-Cookie` response headers pass through unchanged.
- Browser stores cookies for `localhost` and sends them back to `/api/v1/*`.

Production:

- Browser calls `https://academy.rumahkodingku.com/api/v1/*`.
- Edge reverse proxy routes `/api/v1/*` to the NestJS API service.
- Cookies are host-only on `academy.rumahkodingku.com`.
- No catch-all Next route handler BFF.

Environment:

```dotenv
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
API_URL=http://localhost:3000
AUTH_SESSION_COOKIE=access_token
AUTH_REFRESH_COOKIE=refresh_token
WEB_APP_URL=http://localhost:3001
```

### Steps

- [ ] Write a failing Playwright test that logs in through `/api/v1/auth/login` and asserts the browser receives `access_token` and `refresh_token` cookies for the web origin.
- [ ] Add the local rewrite and env changes.
- [ ] Verify `Set-Cookie` forwarding in Chromium, Firefox, and WebKit.
- [ ] Verify `GET /api/v1/users/me` through the web origin sends the cookie.
- [ ] Verify server components (`apiServerFetch`) still call `API_URL` directly and forward browser cookies.
- [ ] Update `proxy.ts` to use `AUTH_SESSION_COOKIE`; do not decode JWT or query MySQL/Redis.
- [ ] Document production edge routing.

### Verification

```bash
pnpm --filter web dev
pnpm exec playwright test apps/web/e2e/auth-proxy.spec.ts
```

Expected: login response sets both cookies for the web origin; `/users/me` returns the user; no CORS error; no token in JavaScript storage.

### Commit

`feat(web): add same-origin auth proxy and cookie environment`

## 5. Task B2 — Auth API client and hooks

### Files

- Modify `apps/web/src/lib/api/client.ts` (CSRF bootstrap, 401 refresh retry).
- Create `apps/web/src/features/auth/api/auth.ts`.
- Modify `apps/web/src/features/auth/api/session.ts`.
- Modify `apps/web/src/features/auth/types.ts`.
- Create `apps/web/src/features/auth/permissions.ts`.
- Create `apps/web/src/features/auth/api/client.test.ts`.
- Modify `apps/web/src/lib/api/schema.d.ts` after OpenAPI regeneration.

### API surface

```ts
useLogin(): UseMutationResult<AuthUser, ApiProblemError, LoginInput>;
useRegister(): UseMutationResult<AuthUser, ApiProblemError, RegisterInput>;
useLogout(): UseMutationResult<void, ApiProblemError, void>;
useForgotPassword(): UseMutationResult<void, ApiProblemError, { email: string }>;
useResetPassword(): UseMutationResult<void, ApiProblemError, { token: string; password: string }>;
useVerifyEmail(): UseMutationResult<{ email: string }, ApiProblemError, { token: string }>;
useResendVerification(): UseMutationResult<void, ApiProblemError, { email: string }>;
useUpdateProfile(): UseMutationResult<AuthUser, ApiProblemError, ProfilePatch>;
useUploadAvatar(): UseMutationResult<{ avatarUrl: string }, ApiProblemError, File>;
useRemoveAvatar(): UseMutationResult<void, ApiProblemError, void>;
```

`permissions.ts`:

```ts
export const PERMISSIONS = {
  ADMIN_ACCESS: "admin.access",
} as const;

export function hasPermission(user: AuthUser | null, permission: string): boolean;
```

No role-name checks.

### Client rules

- Before any non-GET auth request, ensure a CSRF token exists; call `GET /csrf/token` once and keep it in memory. This includes login, register, refresh, logout, forgot, reset, verify, resend, and avatar.
- On `403` with `INVALID_CSRF_TOKEN`, fetch a new token and retry once.
- On `401` from a protected request, attempt `POST /auth/refresh` once, then retry the original request once.
- Do not recursively refresh on `/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/forgot-password`, `/auth/reset-password`, or `/auth/verify-email`. The refresh request itself still needs a CSRF token.
- Never retry more than once; never loop.
- Invalidate `authKeys.session` after login, logout, password reset, and profile update.
- Clear user-scoped caches on logout.
- Do not read or write auth cookies.
- Client uses `credentials: "include"` / `withCredentials: true`.

### Steps

- [ ] Write failing tests for CSRF retry and refresh retry using a mocked Axios adapter.
- [ ] Implement CSRF bootstrap and one-shot refresh logic.
- [ ] Implement auth hooks and query keys.
- [ ] Regenerate API types from OpenAPI.
- [ ] Test that a second 401 does not trigger a refresh loop.
- [ ] Test permission helper and no role-name usage.

### Verification

```bash
pnpm --filter web test -- features/auth
pnpm --filter web check-types
```

### Commit

`feat(web): add auth API client, permissions, and mutations`

## 6. Task B3 — Split auth layout and pages

### Files

- Create `apps/web/src/features/auth/components/auth-split-layout.tsx`.
- Create `apps/web/src/features/auth/components/auth-brand-panel.tsx`.
- Create `apps/web/src/features/auth/components/auth-form-panel.tsx`.
- Create `apps/web/src/app/[locale]/(auth)/layout.tsx`.
- Create `apps/web/src/app/[locale]/(auth)/login/page.tsx`.
- Create `apps/web/src/app/[locale]/(auth)/register/page.tsx`.
- Create `apps/web/src/app/[locale]/(auth)/forgot-password/page.tsx`.
- Create `apps/web/src/app/[locale]/(auth)/reset-password/page.tsx`.
- Create `apps/web/src/app/[locale]/(auth)/verify-email/page.tsx`.
- Create forms:
  - `login-form.tsx`
  - `register-form.tsx`
  - `forgot-password-form.tsx`
  - `reset-password-form.tsx`
  - `verify-email-panel.tsx`
  - `verification-banner.tsx`
  - `silent-refresh.tsx`
- Modify i18n files `id/common.json`, `en/common.json`.

### Layout specification

`AuthSplitLayout`:

- ≥1280px: `grid-template-columns: minmax(0, 7fr) minmax(360px, 3fr)`.
- 1024–1279px: `6fr / 4fr` to protect form width.
- <1024px: stacked; compact brand strip on top, form below.
- Right panel min width 360px, max 420px; form vertically centered.
- `min-h-svh`; no horizontal overflow.
- Background and surfaces use semantic tokens.

`AuthBrandPanel` (left, 70%):

- Logo mark on white tile + wordmark; mark unmodified.
- Eyebrow `Learn · Build · Grow`.
- Headline: “Bangun kemampuan teknologi yang bisa dibuktikan.”
- Supporting copy: kursus terstruktur, proyek nyata, sertifikat.
- Three value chips with `BookOpen`, `FolderGit2`, `Award`.
- Abstract learning-path card:
  - 3 steps: “Pilih jalur”, “Bangun proyek”, “Buktikan kemampuan”.
  - CSS/SVG composition with subtle grid, radial glow, floating code/lesson tiles.
- One quiet entrance animation; `prefers-reduced-motion: reduce` disables it.
- No fake testimonials, ratings, counts, or stock photos.
- No social login buttons.

`AuthFormPanel` (right, 30%):

- Card on `surface-default`/`popover`; border/shadow token.
- Max width 380–420px.
- Page title + short description.
- Visible labels; inline errors; server error `Alert`.
- Password show/hide control.
- Loading button with disabled state.
- Links: register, forgot password, login.
- Language and theme controls in the panel header.
- No “remember me” unless session policy supports it.

### Responsive behavior

| Viewport  | Layout                                      |
| --------- | ------------------------------------------- |
| ≥1280     | 7:3 split                                   |
| 1024–1279 | 6:4 split                                   |
| 768–1023  | stacked; compact brand strip + form         |
| <768      | stacked; logo/header + form, minimal visual |

### 21st.dev references

Inspiration only:

- “Split Sign In Form” by Diar Muradi: https://21st.dev/@diarmuradi/components/sign-in-3
- “Sign In Split Screen” by felipemenezes098: https://21st.dev/@felipemenezes098/components/sign-in-6
- “Sign Up Split Panel” by Diar Muradi: https://21st.dev/@diarmuradi/components/sign-up-1

Borrow: split composition, branded panel, compact form, password visibility, hierarchy.

Do not copy: code/assets without a compatible license, fake testimonials/avatars, non-working social buttons, heavy decorative effects.

### Page behavior

Login:

- Email/password.
- Generic error for invalid credentials.
- On success, invalidate session and redirect to safe `next` or `/learn`.
- Link to register and forgot password.

Register:

- Name, email, password, confirm password.
- Client-side password confirmation only; server enforces 12–128.
- On success, show “check your email” state with login link and resend option.
- Do not set/expect cookies.

Forgot password:

- Email.
- Always show generic success, even for unknown email.

Reset password:

- Read `token` from search params.
- New password + confirmation.
- On success, show success and link to login; do not auto-login.

Verify email:

- Read `token` from search params.
- Show a button “Verifikasi email”; POST only on user action.
- Handle missing/expired/used token with a resend path.

Resend verification:

- Available from verify page and verification banner.
- Always generic success.

Silent refresh:

- `(auth)/layout` renders `SilentRefresh`.
- If `access_token` is absent but `refresh_token` is present, call `POST /api/v1/auth/refresh` with CSRF, then redirect to safe `next`.
- Show a skeleton while refreshing; do not flash the login form.
- If refresh fails, render normal login.
- Do not run on reset/verify pages with their own token flows.

### Steps

- [ ] Write failing component tests for validation, loading, server error, password visibility, and safe redirect.
- [ ] Implement `AuthSplitLayout`, brand panel, form panel.
- [ ] Implement auth pages and forms using existing primitives.
- [ ] Add i18n keys for labels, errors, and states.
- [ ] Ensure forms are keyboard accessible and errors are linked with `aria-describedby`.
- [ ] Add `next` parsing through `safeNextPath`.
- [ ] Test 7:3 at 1440, 6:4 at 1024, stacked at 768/390.
- [ ] Test light/dark and reduced motion.

### Verification

```bash
pnpm --filter web test -- features/auth
pnpm --filter web check-types
pnpm exec playwright test apps/web/e2e/auth-layout.spec.ts
```

### Commit

`feat(web): add 7:3 split auth layout and pages`

## 7. Task B4 — Session-aware shell and route guards

### Files

- Modify `apps/web/src/lib/auth/session.ts`.
- Modify `apps/web/src/lib/auth/redirect.ts` and tests.
- Create `apps/web/src/components/account-menu.tsx`.
- Modify `apps/web/src/components/layout/public-header.tsx`.
- Create `apps/web/src/app/[locale]/forbidden/page.tsx`.
- Modify `(account)/layout.tsx`, `(admin)/layout.tsx`, `(learn)/layout.tsx`, `(commerce)/layout.tsx`.
- Modify `apps/web/src/proxy.ts`.

### Behavior

`getSession()`:

- Calls `GET /auth/me` with forwarded cookies.
- Returns `AuthUser | null`.
- Handles 401 as `null`; network failure is an error, not a logout.
- Cached per request with React `cache()`.

`requireUser(locale)`:

- Redirects to `/login?next=<current>` when unauthenticated.

`requireVerified(locale)`:

- Requires session and `emailVerified`; otherwise redirect to `/verify-email?next=<current>`.

`requirePermission(locale, permission)`:

- Requires session and `permissions.includes(permission)`.
- Non-authorized redirects to `/forbidden`.

`requireAdmin(locale)`:

- Uses `requirePermission(locale, PERMISSIONS.ADMIN_ACCESS)`.
- Never checks role names.

Header:

- Show `Masuk` when logged out.
- Show `profile.displayName`/avatar menu when logged in.
- Provide `Profil`, `Keluar`, and permission-based entries.
- Do not display sensitive data.
- Invalidate session query after logout.

Proxy:

- Keep optimistic protected-path cookie check.
- Do not redirect authenticated users away from auth pages based only on cookie presence; avoid stale-cookie loops.
- Preserve locale rewrite behavior.

### Steps

- [ ] Write failing tests for `requireVerified`, `requirePermission`, `requireAdmin`, and `safeNextPath` (`//evil`, absolute URL).
- [ ] Implement session helpers and forbidden page.
- [ ] Implement account menu and header integration.
- [ ] Protect learner/admin with verified policy; account and commerce with user-only until product requires otherwise.
- [ ] Test expired cookie behavior: access cookie expiry redirects to login, `SilentRefresh` succeeds when refresh cookie is valid, then returns to safe `next`; if refresh fails, show login without a loop.
- [ ] Test admin nav uses `admin.access`, not role names.

### Verification

```bash
pnpm --filter web test -- auth redirect
pnpm --filter web check-types
```

### Commit

`feat(web): integrate session, permissions, and route guards`

## 8. Task B5 — Profile and avatar UI

### Files

- Create `apps/web/src/app/[locale]/(account)/me/page.tsx`.
- Create `apps/web/src/features/auth/components/profile-form.tsx`.
- Create `apps/web/src/features/auth/components/avatar-upload.tsx`.
- Create `apps/web/src/features/auth/api/avatar.ts`.
- Create tests under `apps/web/src/features/auth/components/`.
- Modify i18n files.

### Behavior

Profile:

- Show and edit:
  - displayName, fullName, username, bio, headline
  - phone, countryCode, city, timezone, locale
  - websiteUrl, githubUrl, linkedinUrl, xUrl, instagramUrl
  - emailNotifications, inAppNotifications
- Email and status read-only.
- Verification status badge.
- Role/permission data read-only; never editable.
- Update via `PATCH /auth/me`; strict payload.
- Show success/error inline feedback.
- Never send role, status, email, emailVerified, permissions, or password.

Avatar:

- Native file input; accept JPEG/PNG/WebP.
- Client validation: 2 MB, image types; server remains authoritative.
- Preview before upload.
- Upload/remove through multipart FormData.
- Avatar URL `/api/v1/users/me/avatar` with cache bust after update.
- Fallback initials when no avatar.
- Keyboard-accessible controls and labels.

### Steps

- [ ] Write failing tests for profile field validation and forbidden fields.
- [ ] Write failing tests for avatar type/size validation.
- [ ] Implement profile page and avatar component.
- [ ] Test upload success, 413/415/422, remove, unauthorized.
- [ ] Verify private avatar cannot load without a session.
- [ ] Check mobile layout and focus states.

### Verification

```bash
pnpm --filter web test -- profile avatar
pnpm --filter web check-types
```

### Commit

`feat(web): add full profile and private avatar UI`

## 9. Task B6 — Playwright auth E2E and visual review

### Files

- Create `apps/web/e2e/auth.spec.ts`.
- Create `apps/web/e2e/auth-layout.spec.ts`.
- Create `apps/web/e2e/auth-helpers.ts`.
- Modify `playwright.config.ts` if env/services need setup.
- Modify `docs/development/testing-strategy.md` if needed.

### Scenarios

1. Register → Mailpit verification email → verify → login.
2. Login → reload → session persists.
3. Access token expiry/refresh simulation → protected request refreshes once.
4. Logout → refresh token revoked → protected route redirects to login.
5. Forgot password → Mailpit reset link → reset → old session revoked.
6. Wrong password → generic error.
7. Unverified user → learner route denied → verify/resend flow.
8. User without `admin.access` → `/admin` denied; admin fixture allowed.
9. CSRF missing → mutation rejected.
10. Profile update → fields persist; role/status/email rejected.
11. Avatar upload → visible to owner; unauthenticated request 401.
12. Safe `next`: `/login?next=%2F%2Fevil.example` must not redirect off-site.
13. Mobile 390: auth forms usable, no horizontal overflow.
14. Layout: 7:3 at 1440, 6:4 at 1024, stacked at 768/390.
15. Light/dark screenshots, keyboard-only submit, reduced motion.

### Mailpit helper

- Fetch messages from `http://localhost:8026/api/v1/messages`.
- Extract verification/reset URL from HTML.
- Do not print tokens in test logs; use assertion helpers.

### Steps

- [ ] Write E2E tests before final UI polish where practical.
- [ ] Add deterministic test users/fixtures through API or DB setup.
- [ ] Run Chromium, Firefox, WebKit.
- [ ] Capture screenshots for light/dark at 390/768/1024/1440.
- [ ] Verify focus visibility and keyboard-only submit.

### Verification

```bash
docker compose up -d mysql redis mailpit
pnpm exec playwright test
```

### Commit

`test(web): cover auth, RBAC, profile, and layout end to end`

## 10. Task B7 — CI, accessibility, and final verification

### Files

- Modify `.github/workflows/ci.yml`.
- Modify `docs/development/local-setup.md`.
- Modify `docs/architecture/nextjs-architecture.md`.
- Modify `docs/specification/phase-3-auth/README.md` if decisions change.
- Modify `docs/development/development-roadmap.md` Phase 3 status.

### Steps

- [ ] Add E2E job with MySQL, Redis, Mailpit, web/API services.
- [ ] Ensure CI runs on `dev`.
- [ ] Run `pnpm check-types`, `pnpm lint`, `pnpm format:check`, `pnpm test`, `pnpm build`.
- [ ] Run `pnpm --filter api test:contract`, `pnpm --filter api test:integration`.
- [ ] Run RBAC seed and admin CLI in CI smoke.
- [ ] Run Playwright all browsers.
- [ ] Verify auth cookie flags in production-mode test configuration.
- [ ] Verify no password/token appears in logs, audit rows, or client bundle.
- [ ] Verify no role-name comparison in web/API code.
- [ ] Update roadmap Phase 3 status with evidence.
- [ ] Record screenshots or visual evidence.

### Commit

`docs(auth): record Phase 3 completion and verification`

## 11. Phase 3.B Exit Checklist

- [ ] Login, register, forgot, reset, verify pages work.
- [ ] Auth layout is 7:3 at 1440, 6:4 at 1024, stacked at 768/390.
- [ ] Session persists across reload and refresh rotates once.
- [ ] Logout revokes refresh session.
- [ ] Unverified user cannot reach learner/admin.
- [ ] User without `admin.access` cannot reach admin.
- [ ] Profile fields update; forbidden fields rejected.
- [ ] Avatar private and owner-only.
- [ ] CSRF and safe redirect tests pass.
- [ ] Keyboard/focus, light/dark, reduced motion pass.
- [ ] E2E passes Chromium, Firefox, WebKit.
- [ ] CI green on `dev`.
- [ ] Docs and OpenAPI types synchronized.
