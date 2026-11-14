# Phase 3 — Authentication, RBAC & Account Security

**Status:** Implemented and verified (Phase 3.A and 3.B)  
**Scope:** Phase 3.A backend API, Phase 3.B frontend integration  
**Product:** RumahKodingku Academy  
**Last updated:** 2026-11-13

## 1. Document Map

| Document               | Purpose                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `README.md`            | Decisions, architecture, RBAC, profile schema, contracts, environment, exit criteria |
| `phase-3a-backend.md`  | Backend tasks, migrations, services, tests, verification                             |
| `phase-3b-frontend.md` | Split auth UI, client integration, profile UI, E2E                                   |

Phase 3.B MUST NOT start before Phase 3.A is complete and its API contract is stable.

## 2. Goal

Deliver safe browser authentication and account security:

- Email/password registration and login.
- JWT access and refresh tokens in HttpOnly cookies.
- Refresh rotation, reuse detection, logout revocation.
- Email verification and password reset.
- CSRF protection for cookie-authenticated mutations.
- Redis-backed rate limits for sensitive auth endpoints.
- Database-backed RBAC based on Spatie Laravel Permission v8.
- Separate account and profile data.
- Private avatar upload.
- Split 7:3 auth UI with strong brand presence.
- Permission-based authorization on backend and navigation on frontend.

## 3. Non-goals

- Admin MFA/TOTP enrollment and device-session UI: Phase 10.
- Full role/permission CRUD API and admin UI: Phase 9.
- Teams or multi-tenant role scoping.
- Wildcard permissions and super-admin bypass.
- OAuth/OIDC, magic links, passkeys.
- Email address change.
- Public profile pages.
- Social login buttons that are not implemented.
- General catch-all BFF.
- Storing tokens in JavaScript-readable storage.

## 4. Locked Decisions

| Topic                       | Decision                                                                                                                                |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Browser/API topology        | Same-origin `/api/v1` reverse proxy. Production edge routes to API; local Next rewrite for development. No BFF contract.                |
| Auth stack                  | `@nestjs/authentication` + `@nestjs/authorization` with MySQL adapters and contract tests.                                              |
| Token model                 | JWT access token + opaque refresh token, both in HttpOnly cookies. Do not use package session-cookie mode.                              |
| Access token TTL            | 15 minutes.                                                                                                                             |
| Refresh token TTL           | 30 days.                                                                                                                                |
| Refresh family absolute TTL | 90 days.                                                                                                                                |
| Cookie names                | `access_token`, `refresh_token`; host-only, `HttpOnly`, `Secure` in production, `SameSite=Lax`, `Path=/`.                               |
| Password                    | 12–128 characters; scrypt defaults (OWASP N=2^17, r=8, p=1); no forced composition rules.                                               |
| Email verification          | Required before learner/admin access. Login is allowed while unverified so the user can resend verification.                            |
| Registration                | Creates account + profile + verification email. Does not create a session; login is manual.                                             |
| Avatar                      | JPG/PNG/WebP only, max 2 MB, private to the owner; no public avatar URL.                                                                |
| CSRF                        | Double-submit token bound to a random `csrf-session` HttpOnly cookie, not IP.                                                           |
| Rate limits                 | Strict per endpoint; see section 9.                                                                                                     |
| Email delivery              | Resend SMTP in production, Mailpit locally; existing `@nestjs/mail` SMTP transport.                                                     |
| RBAC                        | Five Spatie-style tables; permissions are checked, role names are data.                                                                 |
| Guard                       | `guard_name = "api"`. No teams.                                                                                                         |
| Default role                | `roles.is_default = true`; registration queries it. No role-name check in application code.                                             |
| Initial RBAC seed           | `user` role (default), `admin` role, `admin.access` permission.                                                                         |
| Admin bootstrap             | Idempotent CLI `auth:create-admin`; never auto-run during production boot.                                                              |
| Profile storage             | `users` is account-only; `users_profile` stores the full user profile.                                                                  |
| Profile visibility          | Private in Phase 3. No public profile endpoint.                                                                                         |
| Auth UI                     | Desktop 7:3 split; 6:4 at 1024–1279; stacked below 1024.                                                                                |
| Left panel                  | Abstract branded visual, logo, value props, animated learning-path card, icons. No fake testimonials, ratings, counts, or stock photos. |
| 21st.dev                    | Design inspiration only. Do not copy code/assets without a compatible license.                                                          |
| Admin MFA                   | Deferred to Phase 10.                                                                                                                   |
| Session UI                  | Logout current session only; password reset revokes all sessions.                                                                       |
| Auth schema                 | Add RBAC tables, `users_profile`, `refresh_token_families`; extend email-token tables.                                                  |
| CI                          | Run on `dev` push and pull requests to `dev`, `main`, and `master`.                                                                     |

## 5. Architecture

### 5.1 Runtime topology

```text
Browser
  │  https://academy.rumahkodingku.com
  ├── HTML / RSC ──────────────→ Next.js web (apps/web)
  └── /api/v1/* ───────────────→ Edge reverse proxy (Coolify/Traefik)
                                      │
                                      └──→ NestJS API (apps/api)
                                              │
                                              ├── MySQL
                                              ├── Redis
                                              └── Mail (Resend SMTP / Mailpit)
```

Rules:

- Browser sees one origin: the web host.
- Auth cookies are host-only on the web host and sent to `/api/v1/*`.
- Production edge proxy forwards `/api/v1/*` to the API. Preserve `Cookie`, `Set-Cookie`, `X-Forwarded-For`, `X-Forwarded-Proto`, and `Host`.
- Local development uses a Next.js rewrite from `/api/v1/:path*` to `${API_URL}/api/v1/:path*`. This is a transparent network proxy, not an application BFF.
- No catch-all route handler BFF. No token mirroring in JavaScript.
- `NEXT_PUBLIC_SERVER_URL` is the browser-visible same-origin base (`http://localhost:3001` locally, `https://academy.rumahkodingku.com` in production).
- `API_URL` is the server-side internal API base (`http://localhost:3000` locally).
- `apps/web/src/lib/api/server.ts` uses `API_URL` and forwards the incoming cookie header.
- `apps/web/src/lib/api/client.ts` uses `NEXT_PUBLIC_SERVER_URL`, so browser calls remain same-origin.

### 5.2 Authentication flow

#### Register

1. Normalize email: trim, lowercase, Unicode NFC.
2. Validate name, email, password policy.
3. Reject duplicate email with a safe conflict response.
4. Hash password with `PasswordHasher`.
5. In one transaction:
   - Create user with `emailVerifiedAt = null`.
   - Create `users_profile` with `display_name = name`.
   - Find `roles.is_default = true` for `guard_name = "api"` and assign it.
6. After commit, send verification email through `EmailVerificationService.send()`.
7. Return `201` with the safe user DTO. Do not set cookies.

Email delivery is best-effort after the account commit: a mail failure is logged safely, registration still succeeds, and the user can resend verification.

#### Login

1. Normalize email.
2. Find user by normalized email.
3. Verify password with `PasswordHasher.verify(password, hash ?? null)`; unknown users still perform a dummy verification.
4. Reject suspended/deleted users with the same generic invalid-credentials response.
5. Issue access + refresh tokens with `TokenService.issue(user.id, { method: "password" })`.
6. Set `access_token` and `refresh_token` cookies.
7. Return `200` with `AuthUser`, including roles, permissions, and profile.

#### Refresh

1. Read `refresh_token` cookie.
2. If absent, return generic `401` and clear cookies.
3. Call `TokenService.refresh(refreshToken)`.
4. On success, rotate both cookies, re-read user/profile/RBAC, and return `AuthUser`.
5. On reuse, expiry, or invalid token, clear cookies and return generic `401`. Reuse revokes the whole family inside the package/store.

#### Logout

1. Read `refresh_token` cookie.
2. Call `TokenService.revoke(refreshToken)`; unknown/malformed tokens still return `204`.
3. Clear both auth cookies.
4. Return `204`.

#### Protected request

1. Middleware copies `access_token` cookie to `Authorization: Bearer …` only when no Authorization header exists.
2. `JwtBearerProvider` verifies the JWT.
3. Provider loads user, profile, roles, and permissions from MySQL.
4. Deleted/suspended users are rejected.
5. Global authentication guard resolves the user.
6. Global authorization guard applies `@Can` policy or `@Can.Anyone()`.

### 5.3 RBAC model

Use five Spatie-style tables.

#### `roles`

| Column                     | Type                  | Notes                                |
| -------------------------- | --------------------- | ------------------------------------ |
| `id`                       | char(36)              | UUID v7 PK                           |
| `name`                     | varchar(64)           | e.g. `user`, `admin`; data, not code |
| `guard_name`               | varchar(64)           | `api`                                |
| `description`              | varchar(255) nullable | admin-facing                         |
| `is_default`               | boolean default false | exactly one default per guard        |
| `created_at`, `updated_at` | datetime              | BaseEntity                           |

Indexes: unique `(name, guard_name)`, index `(guard_name, is_default)`.

#### `permissions`

| Column                     | Type                  | Notes               |
| -------------------------- | --------------------- | ------------------- |
| `id`                       | char(36)              | UUID v7 PK          |
| `name`                     | varchar(128)          | e.g. `admin.access` |
| `guard_name`               | varchar(64)           | `api`               |
| `description`              | varchar(255) nullable |                     |
| `created_at`, `updated_at` | datetime              |                     |

Index: unique `(name, guard_name)`.

#### `role_has_permissions`

| Column          | Type     | Notes                   |
| --------------- | -------- | ----------------------- |
| `role_id`       | char(36) | FK roles, CASCADE       |
| `permission_id` | char(36) | FK permissions, CASCADE |

Composite PK `(role_id, permission_id)`.

#### `model_has_roles`

| Column       | Type        | Notes             |
| ------------ | ----------- | ----------------- |
| `role_id`    | char(36)    | FK roles, CASCADE |
| `model_type` | varchar(64) | `user`            |
| `model_id`   | char(36)    | user UUID         |

Composite PK `(role_id, model_type, model_id)`. Index `(model_type, model_id)`. No FK to `users` because the pivot is polymorphic.

#### `model_has_permissions`

| Column          | Type        | Notes                   |
| --------------- | ----------- | ----------------------- |
| `permission_id` | char(36)    | FK permissions, CASCADE |
| `model_type`    | varchar(64) | `user`                  |
| `model_id`      | char(36)    | user UUID               |

Composite PK `(permission_id, model_type, model_id)`. Index `(model_type, model_id)`.

No teams, no wildcard permissions in Phase 3.

### 5.4 RBAC service and policy

`RbacService` responsibilities:

```ts
type AccessSnapshot = {
  roles: string[];
  permissions: string[];
};

getAccess(userId: string, guardName = "api"): Promise<AccessSnapshot>;
hasPermission(userId: string, permission: string, guardName = "api"): Promise<boolean>;
getDefaultRole(guardName = "api"): Promise<RoleRecord>;
assignDefaultRole(userId: string): Promise<void>;
assignRole(userId: string, roleId: string): Promise<void>;
removeRole(userId: string, roleId: string): Promise<void>;
givePermissionToRole(roleId: string, permissionId: string): Promise<void>;
syncRolePermissions(roleId: string, permissionIds: string[]): Promise<void>;
```

Rules:

- Permission resolution merges direct `model_has_permissions` and permissions from all assigned roles.
- No role-name comparison outside seed/CLI/tests.
- `AuthUser.permissions` is the only authorization input for `PermissionPolicy`.
- Validate at startup: exactly one default role per guard; `admin.access` exists.
- Use request-scoped in-memory cache only. Redis permission caching is deferred until role-management volume justifies it.
- User deletion must remove RBAC pivot rows in the future deletion workflow. Phase 3 has no user deletion.

Policies:

| Policy                | Ability    | Rule                                    |
| --------------------- | ---------- | --------------------------------------- |
| `PermissionPolicy`    | `has`      | `user.permissions.includes(permission)` |
| `EmailVerifiedPolicy` | `verified` | `user.emailVerified === true`           |
| `OwnershipPolicy`     | `owns`     | `user.id === ownerId`                   |

Usage:

```ts
@Can(PermissionPolicy, "has", () => [PERMISSIONS.ADMIN_ACCESS])
```

`PERMISSIONS.ADMIN_ACCESS = "admin.access"` is a permission constant, not a role. Frontend may use the same permission for navigation visibility; it is not a security boundary.

### 5.5 Seed and admin bootstrap

`apps/api/src/cli/seed-rbac.ts`:

- Upsert `user` role with `is_default = true`.
- Upsert `admin` role.
- Upsert `admin.access` permission.
- Attach `admin.access` to `admin`.
- Idempotent.
- No application role-name checks.

`apps/api/src/cli/create-admin.ts`:

- Command: `pnpm --filter api auth:create-admin`.
- Reads `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD` from env or prompts.
- Creates user + profile if absent.
- Ensures seed exists.
- Assigns admin role by querying the role record.
- Never auto-runs during API boot.

### 5.6 User and profile schema

#### `users` — account only

Keep:

- `id`, `email`, `password_hash`, `status`, `email_verified_at`, `created_at`, `updated_at`.

Remove:

- `name`, `avatar_storage_key`, `profile` JSON, `role` enum.

`UserStatus` remains account status (`ACTIVE`, `SUSPENDED`, `DELETED`); it is not RBAC.

#### `users_profile`

| Column                     | Type         | Required | Notes                        |
| -------------------------- | ------------ | -------- | ---------------------------- |
| `id`                       | char(36)     | yes      | UUID v7 PK                   |
| `user_id`                  | char(36)     | yes      | unique FK users, CASCADE     |
| `display_name`             | varchar(100) | yes      | shown in UI                  |
| `full_name`                | varchar(255) | no       | legal/full name              |
| `username`                 | varchar(50)  | no       | lowercase, unique when set   |
| `bio`                      | text         | no       | max 500 chars app validation |
| `headline`                 | varchar(120) | no       | e.g. “Frontend Learner”      |
| `avatar_storage_key`       | varchar(512) | no       | private storage key          |
| `phone`                    | varchar(32)  | no       | private                      |
| `country_code`             | char(2)      | no       | ISO 3166-1 alpha-2           |
| `city`                     | varchar(100) | no       |                              |
| `timezone`                 | varchar(64)  | no       | IANA, nullable               |
| `locale`                   | varchar(5)   | yes      | `id`/`en`, default `id`      |
| `website_url`              | varchar(512) | no       | http/https only              |
| `github_url`               | varchar(512) | no       | http/https only              |
| `linkedin_url`             | varchar(512) | no       | http/https only              |
| `x_url`                    | varchar(512) | no       | http/https only              |
| `instagram_url`            | varchar(512) | no       | http/https only              |
| `email_notifications`      | boolean      | yes      | default true                 |
| `in_app_notifications`     | boolean      | yes      | default true                 |
| `created_at`, `updated_at` | datetime     | yes      |                              |

Indexes: unique `user_id`, unique `username`, index `country_code`.

All profile fields are private in Phase 3. No public profile route.

### 5.7 Migration sequence

`AddRbacAndUserProfiles`:

1. Create RBAC tables.
2. Create `users_profile`.
3. Insert baseline roles/permissions:
   - `user` role, `is_default = true`
   - `admin` role
   - `admin.access` permission
   - attach permission to admin
4. Backfill `users_profile` from `users`:
   - `display_name = users.name`
   - `avatar_storage_key = users.avatar_storage_key`
   - `locale = 'id'`
   - notification defaults true
5. Map legacy `users.role`:
   - `ADMIN` -> admin role
   - `USER` -> user role
   - insert into `model_has_roles` with `model_type = 'user'`
6. Drop `users.role`, `users.name`, `users.avatar_storage_key`, `users.profile`.
7. Add FKs/indexes.

Also add `refresh_token_families` and extend `refresh_sessions`/email-token tables as described in Phase 3.A.

Migration rules:

- Review generated SQL manually; TypeORM may not express composite PK/FK correctly.
- Test fresh DB and upgrade-from-Phase-2 DB.
- Down migration restores columns only in a safe test database; production rollback is forward-fix.
- Existing sessions may be invalidated; document.

### 5.8 Token and cookie contract

| Cookie          | Value                  | TTL            | Flags                                                                   |
| --------------- | ---------------------- | -------------- | ----------------------------------------------------------------------- |
| `access_token`  | JWT access token       | 15 minutes     | `HttpOnly`, `Secure` in production, `SameSite=Lax`, `Path=/`, host-only |
| `refresh_token` | Opaque refresh token   | 30 days        | `HttpOnly`, `Secure` in production, `SameSite=Lax`, `Path=/`, host-only |
| `csrf-token`    | Signed CSRF token      | session cookie | `HttpOnly`, `Secure` in production, `SameSite=Lax`, `Path=/`            |
| `csrf-session`  | Random CSRF binding id | 7 days         | `HttpOnly`, `Secure` in production, `SameSite=Lax`, `Path=/`            |

Never set `Domain`. Staging and production cookies must not be shared.

### 5.9 CSRF

- `GET /api/v1/csrf/token` ensures `csrf-session` exists and returns a signed token in the response body.
- The browser stores the token in memory only.
- Every non-GET auth request sends `x-csrf-token`, including login, register, refresh, logout, forgot, reset, verify, resend, and avatar. This prevents login CSRF as well as session CSRF.
- `csrf-csrf` `getSessionIdentifier` reads `csrf-session`, not `req.ip`.
- Invalid or missing token returns `403 application/problem+json` with `code: "INVALID_CSRF_TOKEN"`.
- Payment webhooks are exempt from CSRF but MUST use provider signature verification in Phase 5.

### 5.10 Rate limits

All limits are configurable and stored in Redis. Keys include the action and relevant identity; raw passwords and raw refresh tokens are never used as keys.

| Endpoint                         | Limit | Window     | Key                          |
| -------------------------------- | ----- | ---------- | ---------------------------- |
| `POST /auth/register`            | 5     | 15 minutes | IP                           |
| `POST /auth/login`               | 10    | 15 minutes | IP + normalized email        |
| `POST /auth/refresh`             | 30    | 1 minute   | IP + SHA-256(refresh cookie) |
| `POST /auth/forgot-password`     | 3     | 15 minutes | IP + normalized email        |
| `POST /auth/reset-password`      | 5     | 15 minutes | IP                           |
| `POST /auth/verify-email`        | 10    | 15 minutes | IP                           |
| `POST /auth/resend-verification` | 3     | 15 minutes | IP + normalized email        |
| `POST /users/me/avatar`          | 10    | 15 minutes | authenticated user           |

Exceeded limits return `429` Problem Details and `Retry-After`.

### 5.11 API endpoints

All responses use the existing envelope and Problem Details conventions.

| Method | Path                        | Access        | CSRF | Request                     | Success                                    |
| ------ | --------------------------- | ------------- | ---- | --------------------------- | ------------------------------------------ |
| POST   | `/auth/register`            | Public        | Yes  | `{ name, email, password }` | `201 { data: { user } }`                   |
| POST   | `/auth/login`               | Public        | Yes  | `{ email, password }`       | `200 { data: { user } }` + cookies         |
| POST   | `/auth/refresh`             | Public        | Yes  | refresh cookie              | `200 { data: { user } }` + rotated cookies |
| POST   | `/auth/logout`              | Authenticated | Yes  | refresh cookie              | `204`                                      |
| GET    | `/users/me`                 | Authenticated | No   | —                           | `200 { data: { user } }`                   |
| PATCH  | `/users/me`                 | Authenticated | Yes  | profile fields              | `200 { data: { user } }`                   |
| POST   | `/users/me/avatar`          | Authenticated | Yes  | multipart `file`            | `200 { data: { avatarUrl } }`              |
| GET    | `/users/me/avatar`          | Authenticated | No   | —                           | image stream or `404`                      |
| DELETE | `/users/me/avatar`          | Authenticated | Yes  | —                           | `204`                                      |
| POST   | `/auth/forgot-password`     | Public        | Yes  | `{ email }`                 | `202 { data: { accepted: true } }`         |
| POST   | `/auth/reset-password`      | Public        | Yes  | `{ token, password }`       | `200 { data: { reset: true } }`            |
| POST   | `/auth/verify-email`        | Public        | Yes  | `{ token }`                 | `200 { data: { email } }`                  |
| POST   | `/auth/resend-verification` | Public        | Yes  | `{ email }`                 | `202 { data: { accepted: true } }`         |

`AuthUser` shape:

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
    avatarUrl: string | null; // "/api/v1/users/me/avatar"
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

### 5.12 Profile update DTO

```ts
{
  displayName?: string;        // 1–100
  fullName?: string | null;    // max 255
  username?: string | null;    // [a-z0-9_]{3,30}
  bio?: string | null;         // max 500
  headline?: string | null;    // max 120
  phone?: string | null;       // max 32
  countryCode?: string | null; // ISO 3166-1 alpha-2
  city?: string | null;        // max 100
  timezone?: string | null;    // IANA
  locale?: "id" | "en";
  websiteUrl?: string | null;  // http/https
  githubUrl?: string | null;   // http/https
  linkedinUrl?: string | null; // http/https
  xUrl?: string | null;        // http/https
  instagramUrl?: string | null;// http/https
  emailNotifications?: boolean;
  inAppNotifications?: boolean;
}
```

Reject unknown fields. Never accept `role`, `permissions`, `status`, `email`, `emailVerified`, or `password`.

### 5.13 Error codes

| Code                        | Status      | Use                                                      |
| --------------------------- | ----------- | -------------------------------------------------------- |
| `AUTH_INVALID_CREDENTIALS`  | 401         | Unknown email, wrong password, suspended/deleted account |
| `AUTH_UNAUTHENTICATED`      | 401         | Missing/invalid access token                             |
| `AUTH_REFRESH_INVALID`      | 401         | Missing/expired/invalid refresh token                    |
| `AUTH_REFRESH_REUSED`       | 401         | Refresh reuse detected; family revoked                   |
| `AUTH_EMAIL_UNVERIFIED`     | 403         | Verified-email policy denied                             |
| `AUTH_FORBIDDEN`            | 403         | Permission/policy denied                                 |
| `AUTH_EMAIL_TAKEN`          | 409         | Registration email already exists                        |
| `AUTH_USERNAME_TAKEN`       | 409         | Profile username already exists                          |
| `AUTH_TOKEN_INVALID`        | 400         | Reset/verification token unknown, used, or expired       |
| `AUTH_PASSWORD_POLICY`      | 422         | Password outside 12–128 characters                       |
| `AUTH_PROFILE_INVALID`      | 422         | Invalid profile field/url/timezone                       |
| `AUTH_AVATAR_INVALID`       | 415/413/422 | Wrong type, too large, or invalid upload                 |
| `AUTH_RATE_LIMITED`         | 429         | Rate limit exceeded                                      |
| `RBAC_DEFAULT_ROLE_MISSING` | 500         | Startup/seed configuration error                         |

Login/refresh/reset messages must not reveal whether an account exists.

## 6. Frontend Auth UI

### 6.1 Split layout

Create `AuthSplitLayout`:

- ≥1280px: `grid-template-columns: minmax(0, 7fr) minmax(360px, 3fr)`.
- 1024–1279px: `6fr / 4fr` to protect form width.
- <1024px: stacked; compact brand strip on top, form below.
- Right panel min width 360px, max 420px; form vertically centered.
- Page height `min-h-svh`; no horizontal overflow.

### 6.2 Left panel, 70%

Content:

- Logo mark on white surface + wordmark.
- Eyebrow `Learn · Build · Grow`.
- Headline: “Bangun kemampuan teknologi yang bisa dibuktikan.”
- Supporting copy: kursus terstruktur, proyek nyata, sertifikat.
- Three value chips with icons: `BookOpen`, `FolderGit2`, `Award`.
- Abstract visual: CSS/SVG learning-path card with steps, subtle grid, soft radial glow, floating code/lesson tiles.
- One quiet entrance animation; `prefers-reduced-motion: reduce` disables it.
- No fake testimonials, ratings, student counts, or stock photos.
- No social login buttons until providers exist.

Visual direction:

- Deep navy + Academy blue accent; brand mark remains unmodified.
- Use semantic tokens plus a small set of auth-panel tokens if needed; no hardcoded colors in page code.
- Light/dark both designed; left panel may remain deep-toned in both themes for brand continuity, while the form panel follows the theme.

### 6.3 Right panel, 30%

- Form card on `surface-default`/`popover`, border and shadow token.
- Max width 380–420px.
- Page title and short description.
- Email/password fields with visible labels.
- Show/hide password control.
- Inline validation and server error alert.
- Loading button with disabled state.
- Links: register, forgot password, login.
- Language switch and theme toggle at the top of the panel or auth shell.
- No social buttons.
- No “remember me” unless session policy supports it.

### 6.4 Responsive behavior

| Viewport  | Layout                                      |
| --------- | ------------------------------------------- |
| ≥1280     | 7:3 split                                   |
| 1024–1279 | 6:4 split                                   |
| 768–1023  | stacked; compact brand strip + form         |
| <768      | stacked; logo/header + form, minimal visual |

### 6.5 21st.dev references

Use as inspiration only:

- “Split Sign In Form” by Diar Muradi: https://21st.dev/@diarmuradi/components/sign-in-3
- “Sign In Split Screen” by felipemenezes098: https://21st.dev/@felipemenezes098/components/sign-in-6
- “Sign Up Split Panel” by Diar Muradi: https://21st.dev/@diarmuradi/components/sign-up-1

What to borrow:

- Clear split composition.
- Branded left panel.
- Compact form column.
- Password visibility control.
- Strong form hierarchy.

What not to copy:

- Code or assets without a compatible license.
- Social login buttons that do not work.
- Fake testimonials/avatars.
- Decorative effects that hurt contrast or performance.

### 6.6 Auth pages

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/verify-email`
- `/me` profile
- `/forbidden`

All auth pages share `AuthSplitLayout`. Profile uses the account shell, not the split layout.

## 7. Phase 3.A / 3.B Boundary

### Phase 3.A — Backend

- RBAC + profile + auth schema migration.
- RBAC repositories/service/policy.
- Seed and admin CLI.
- Auth domain, providers, controllers, DTOs.
- Cookies, JWT, refresh rotation, logout.
- CSRF session binding.
- Rate limits.
- Email verification/reset delivery.
- Profile and avatar API.
- OpenAPI/API docs.
- Unit, store contract, migration, and API integration tests.
- CI.

### Phase 3.B — Frontend

- Same-origin rewrite and environment.
- Auth API client/hooks.
- Split 7:3 auth layout and pages.
- Session-aware shell and route guards.
- Permission-based navigation.
- Profile and avatar UI.
- E2E, accessibility, visual checks.
- CI/final docs.

## 8. Review Focus

These are the failure modes most likely to ship broken:

1. **Cookie loss through the proxy.** Login succeeds at the API but the browser never stores/resends the cookie through `/api/v1`.
2. **Refresh reuse race.** Concurrent refresh requests both succeed or a revoked family accepts a later token.
3. **CSRF binding mismatch.** `csrf-session` is missing or changes between token issue and mutation.
4. **Email token double use.** Two requests consume the same reset/verification token.
5. **RBAC bypass.** A user without `admin.access` reaches an admin policy; direct permissions/role permissions are merged incorrectly.
6. **Role hardcoding.** Application code compares role names instead of permissions.
7. **Profile leakage.** `users` still contains profile columns, or profile data is exposed publicly.
8. **Migration data loss.** Backfill runs after columns are dropped, or existing role/profile data is not mapped.
9. **Proxy-derived IP.** Rate limits key on the edge proxy IP instead of the client IP.
10. **Avatar abuse.** Content-type spoofing, oversized file, path traversal, or private file served without auth.
11. **Open redirect.** `next` accepts `//evil.example` or absolute URLs.
12. **Split layout collapse.** Form/narrow column unusable at 1024, or horizontal overflow at 390.

Each item must have a test in the owning task.

## 9. Exit Criteria

Phase 3 is complete when:

- Fresh MySQL migration runs cleanly; RBAC, `users_profile`, refresh families, and email-token fields exist.
- Upgrade migration from Phase 2 backfills profile and RBAC before dropping old columns.
- Store contract tests pass with `concurrent: true`.
- RBAC seed is idempotent; exactly one default role; `admin.access` exists.
- Registration creates account + profile + default role atomically.
- Admin CLI creates user/profile and assigns admin role.
- No application code compares role names; permission checks pass tests.
- `POST /auth/register`, login, refresh, logout, me, profile, avatar, forgot/reset, verify/resend pass API integration tests.
- Refresh rotation/reuse detection pass; reuse revokes family.
- Missing/invalid CSRF returns 403; valid token succeeds.
- Rate limits return 429 with `Retry-After`.
- User without `admin.access` is denied; unverified user denied learner/admin; owner-only access enforced.
- Cookies are host-only, HttpOnly, Secure in production, SameSite=Lax, Path=/.
- Avatar rejects wrong type/oversize and is readable only by its owner.
- Profile fields validate and never accept role/status/email/permissions.
- Auth pages render 7:3/6:4/stacked as specified, light/dark, keyboard-only, 390/768/1024/1440.
- E2E covers register → verify → login → refresh → logout → reset → profile → avatar.
- CI is green on `dev`.
- Docs, OpenAPI, and env examples are synchronized.

## 10. Verification Matrix

| Layer             | Command                                              | Expected                                 |
| ----------------- | ---------------------------------------------------- | ---------------------------------------- |
| Types             | `pnpm check-types`                                   | exit 0                                   |
| Lint              | `pnpm lint`                                          | exit 0                                   |
| Format            | `pnpm format:check`                                  | exit 0                                   |
| Unit              | `pnpm test`                                          | all pass                                 |
| Store contract    | `pnpm --filter api test:contract`                    | all contracts pass, concurrency on       |
| API integration   | `pnpm --filter api test:integration`                 | all pass                                 |
| Build             | `pnpm build`                                         | exit 0                                   |
| E2E               | `pnpm exec playwright test`                          | all browsers pass                        |
| Migration         | fresh MySQL + `db:migrate`                           | all migrations, all tables               |
| Migration upgrade | Phase 2 DB + new migration                           | profile/RBAC backfilled, columns dropped |
| RBAC seed         | `pnpm --filter api db:seed:rbac` twice               | idempotent                               |
| Admin CLI         | `pnpm --filter api auth:create-admin`                | admin user/profile/role created          |
| API smoke         | health/live/ready + auth flow                        | 200/204 as specified                     |
| Security          | CSRF, rate limit, permission, ownership, token reuse | expected 4xx                             |
| Visual            | 390/768/1024/1440 light/dark                         | no overflow, focus visible, 7:3 at wide  |

## 11. Environment

```dotenv
# web
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
API_URL=http://localhost:3000
AUTH_SESSION_COOKIE=access_token
AUTH_REFRESH_COOKIE=refresh_token
WEB_APP_URL=http://localhost:3001

# api
JWT_TTL=15m
JWT_REFRESH_TTL=30d
JWT_REFRESH_ABSOLUTE_TTL=90d
TRUST_PROXY=false
WEB_APP_URL=http://localhost:3001
AUTH_RATE_LIMIT_REGISTER=5
AUTH_RATE_LIMIT_LOGIN=10
AUTH_RATE_LIMIT_REFRESH=30
AUTH_RATE_LIMIT_FORGOT=3
AUTH_RATE_LIMIT_RESET=5
AUTH_RATE_LIMIT_VERIFY=10
AUTH_RATE_LIMIT_RESEND=3
AUTH_RATE_LIMIT_AVATAR=10
AUTH_RATE_LIMIT_WINDOW_SECONDS=900
AUTH_RATE_LIMIT_REFRESH_WINDOW_SECONDS=60
```

Production `TRUST_PROXY=true`; `NEXT_PUBLIC_SERVER_URL=https://academy.rumahkodingku.com`; `API_URL` internal service URL.

## 12. Risks

| Risk                                          | Mitigation                                                                              |
| --------------------------------------------- | --------------------------------------------------------------------------------------- |
| Polymorphic RBAC pivots have no user FK       | User deletion workflow must delete pivots; Phase 3 has no deletion. Document invariant. |
| Spatie roles are still seeded names           | Application never checks names; only permissions. Add grep/test.                        |
| Migration drops `users.role/name/avatar`      | Test upgrade from Phase 2; backfill profile/RBAC before drop.                           |
| 7:3 form column too narrow                    | 6:4 at 1024; min 360px; stack below 1024.                                               |
| Left visual feels generic                     | Brand-specific content, product value props, abstract learning path; no fake proof.     |
| Auth package 0.1.x                            | Pin versions; store contract tests; integration tests on every upgrade.                 |
| Same-origin proxy does not forward Set-Cookie | Playwright test through web origin before building auth UI.                             |
| MySQL lacks `DELETE ... RETURNING`            | Transaction + `SELECT ... FOR UPDATE` + delete for email token consume.                 |
| Rate-limit IP wrong behind proxy              | Configure `trust proxy`; test with `X-Forwarded-For`.                                   |
| Resend SMTP unavailable locally               | Mailpit local; Resend SMTP only staging/production.                                     |
| Permission changes stale                      | Load permissions per request from MySQL; access token carries identity only.            |

## 13. References

RBAC:

- Spatie Laravel Permission v8: https://spatie.be/docs/laravel-permission/v8/introduction
- Spatie schema: https://deepwiki.com/spatie/laravel-permission/1.3-database-schema-and-migrations
- Spatie multiple guards: https://deepwiki.com/spatie/laravel-permission/4.2-multiple-guards
- Spatie cache behavior: https://deepwiki.com/spatie/laravel-permission/2.3-permissionregistrar-and-caching-system

Auth UI inspiration:

- Split Sign In Form, Diar Muradi: https://21st.dev/@diarmuradi/components/sign-in-3
- Sign In Split Screen, felipemenezes098: https://21st.dev/@felipemenezes098/components/sign-in-6
- Sign Up Split Panel, Diar Muradi: https://21st.dev/@diarmuradi/components/sign-up-1

These are references only. Do not copy code or assets without a compatible license. Replace testimonial content with factual product value propositions.
