# Phase 3.A — Backend Authentication, RBAC & Profiles

**Status:** Final implementation plan  
**Depends on:** Phase 2 schema, same-origin proxy decision  
**Produces:** Stable auth/RBAC/profile API for Phase 3.B

## 1. Scope

Phase 3.A covers `apps/api`, `packages/db`, API tests, API docs, and CI. Do not build web pages in this phase.

Deliverables:

- Additive migration for RBAC, `users_profile`, refresh families, and email-token fields.
- Spatie-style RBAC tables, service, seed, permission policy.
- Admin bootstrap CLI.
- MySQL storage adapters for `@nestjs/authentication`.
- Auth domain, controllers, DTOs, providers.
- JWT access/refresh cookies, rotation, reuse detection, logout.
- CSRF session binding.
- Redis rate limits.
- Email verification and password reset delivery.
- Profile update and private avatar API.
- OpenAPI contract and API integration tests.
- Green CI on `dev`.

## 2. Global Constraints

- Follow `docs/specification/phase-3-auth/README.md`.
- Keep entities in `packages/db`.
- Use UUID v7 via the `uuid` package; never add a local UUID util.
- `synchronize` remains `false`; every schema change is a reviewed migration.
- Success envelope: `{ data, meta }`. Errors: RFC 9457 Problem Details with `application/problem+json`, `code`, `requestId`.
- Never return raw TypeORM entities. Map to DTOs.
- Never log passwords, tokens, cookies, CSRF secrets, email-token values, or RBAC secrets.
- Backend authorization is authoritative.
- Do not compare role names in application code. Check permissions.
- Do not implement admin MFA, role/permission CRUD, or device-session UI in Phase 3.
- Do not use `SessionCookieProvider`; use JWT access + refresh tokens.
- Every new route must declare `@Public`, `@Can.Anyone()`, or a policy.

## 3. Task A1 — Decisions, docs, CI baseline

### Files

- Modify `docs/product/decision-log.md` (new auth/RBAC/profile/UI decisions).
- Modify `docs/architecture/nestjs-architecture.md` (RBAC, auth stores, permission policies).
- Modify `docs/architecture/nextjs-architecture.md` (same-origin proxy, cookie topology).
- Modify `docs/api/api-specification.md` (endpoints, AuthUser, profile fields).
- Modify `docs/database/database-design.md` (RBAC, profile, auth schema).
- Modify `docs/development/local-setup.md` (proxy, Mailpit, auth env, seed/CLI).
- Modify `.github/workflows/ci.yml` (trigger `dev`; test DB; auth integration job).
- Modify `package.json`, `apps/api/package.json` (scripts/dev deps).

### Steps

- [ ] Add decision-log entries for auth transport, token lifetimes, password/verification, CSRF, rate limits, avatar, RBAC, profile, split UI, MFA deferral.
- [ ] Update docs to same-origin `/api/v1` topology. State no catch-all BFF.
- [ ] Add CI triggers for `dev` push and PRs to `dev`, `main`, `master`.
- [ ] Add MySQL test database step and `test:integration`/`test:contract` scripts.
- [ ] Add `supertest` and `@types/supertest` as API dev dependencies.
- [ ] Verify YAML and scripts with `pnpm check-types`, `pnpm lint`, `pnpm format:check`.

### Verification

- Docs contain no contradictory cookie/BFF/profile/RBAC statements.
- CI YAML parses and includes test database env.
- `pnpm --filter api test` still passes.

### Commit

`docs(auth): define Phase 3 auth, RBAC, and profile architecture`

## 4. Task A2 — Auth, RBAC, and profile schema migration

### Files

- Create `packages/db/src/entities/user-profile.entity.ts`.
- Create `packages/db/src/entities/role.entity.ts`.
- Create `packages/db/src/entities/permission.entity.ts`.
- Create `packages/db/src/entities/role-has-permission.entity.ts`.
- Create `packages/db/src/entities/model-has-role.entity.ts`.
- Create `packages/db/src/entities/model-has-permission.entity.ts`.
- Create `packages/db/src/entities/refresh-token-family.entity.ts`.
- Modify `packages/db/src/entities/user.entity.ts`.
- Modify `packages/db/src/entities/refresh-session.entity.ts`.
- Modify `packages/db/src/entities/email-verification-token.entity.ts`.
- Modify `packages/db/src/entities/password-reset-token.entity.ts`.
- Modify `packages/db/src/entities/index.ts`.
- Create `packages/db/src/migrations/<timestamp>-AddRbacAndUserProfiles.ts`.
- Modify `docs/database/database-design.md`.

### 4.1 `users` changes

Keep only account fields:

- `id`, `email`, `password_hash`, `status`, `email_verified_at`, `created_at`, `updated_at`.

Remove:

- `name`
- `avatar_storage_key`
- `profile` JSON
- `role` enum and `UserRole` enum export

Add relation:

```ts
@OneToOne(() => UserProfile, (profile) => profile.user)
profile!: Relation<UserProfile>;
```

`UserStatus` remains.

### 4.2 `users_profile`

```ts
@Entity("users_profile")
@Index(["userId"], { unique: true })
@Index(["username"], { unique: true })
@Index(["countryCode"])
class UserProfile extends BaseEntity {
  userId: string; // char(36), unique
  displayName: string; // varchar(100)
  fullName?: string | null; // varchar(255)
  username?: string | null; // varchar(50), lowercase
  bio?: string | null; // text
  headline?: string | null; // varchar(120)
  avatarStorageKey?: string | null; // varchar(512)
  phone?: string | null; // varchar(32)
  countryCode?: string | null; // char(2)
  city?: string | null; // varchar(100)
  timezone?: string | null; // varchar(64)
  locale: string; // varchar(5), default "id"
  websiteUrl?: string | null; // varchar(512)
  githubUrl?: string | null; // varchar(512)
  linkedinUrl?: string | null; // varchar(512)
  xUrl?: string | null; // varchar(512)
  instagramUrl?: string | null; // varchar(512)
  emailNotifications: boolean; // default true
  inAppNotifications: boolean; // default true
  user: Relation<User>;
}
```

`user_id` FK to `users`, `ON DELETE CASCADE`.

### 4.3 RBAC entities

`Role`:

- `id`, `name`, `guardName`, `description`, `isDefault`, timestamps.
- Unique `(name, guardName)`.
- Index `(guardName, isDefault)`.

`Permission`:

- `id`, `name`, `guardName`, `description`, timestamps.
- Unique `(name, guardName)`.

`RoleHasPermission`:

- Composite PK `(roleId, permissionId)`.
- FKs to roles/permissions, CASCADE.

`ModelHasRole`:

- Composite PK `(roleId, modelType, modelId)`.
- Index `(modelType, modelId)`.
- FK role CASCADE.
- No FK to users (polymorphic).

`ModelHasPermission`:

- Composite PK `(permissionId, modelType, modelId)`.
- Index `(modelType, modelId)`.
- FK permission CASCADE.
- No FK to users.

Use `model_type = "user"`, `guard_name = "api"`.

### 4.4 Refresh and email token changes

`refresh_token_families`:

- `id`, `user_id` FK RESTRICT, `expires_at`, `revoked_at`, timestamps.
- Index `user_id`, `(user_id, revoked_at)`.

`refresh_sessions` additions:

- `family_id` char(36) nullable FK family RESTRICT.
- `family_expires_at` datetime nullable.
- `used_at` datetime nullable.
- `claims` json nullable.
- Index `family_id`.

`email_verification_tokens` / `password_reset_tokens` additions:

- `email` varchar(255) nullable.
- `fingerprint` varchar(128) nullable.

Legacy rows with null family/email are invalid for auth. Document that pre-production sessions are invalidated.

### 4.5 Migration data order

`AddRbacAndUserProfiles`:

1. Create RBAC tables.
2. Create `users_profile`.
3. Insert baseline roles/permissions:
   - `user` role with `is_default = true`, `guard_name = 'api'`
   - `admin` role
   - `admin.access` permission
   - attach permission to admin
4. Backfill `users_profile`:
   - `display_name = users.name`
   - `avatar_storage_key = users.avatar_storage_key`
   - `locale = 'id'`
   - notification defaults true
5. Map legacy `users.role`:
   - `ADMIN` -> admin role
   - `USER` -> user role
   - insert `model_has_roles` rows with `model_type='user'`
6. Drop `users.role`, `users.name`, `users.avatar_storage_key`, `users.profile`.
7. Add refresh family/email-token columns and FKs.
8. Add indexes.

Rules:

- Review generated SQL manually; TypeORM may not express composite PK/FK correctly.
- Test fresh DB and upgrade from Phase 2.
- Down migration restores old columns only in a safe test DB; production rollback is forward-fix.
- Existing sessions invalidated; document.

### Steps

- [ ] Write failing metadata tests for RBAC entities, profile relation, and dropped user fields.
- [ ] Add entities/exports.
- [ ] Generate migration.
- [ ] Review and edit migration SQL for composite keys/FKs/backfill order.
- [ ] Run migration on local MySQL.
- [ ] Run migration on fresh test DB.
- [ ] Run upgrade test from a Phase 2 schema dump.
- [ ] Revert/up on local DB.
- [ ] Verify no `UserRole` export remains.

### Verification

```bash
pnpm --filter @rumahkodingku-academy/db check-types
DATABASE_URL=... pnpm --filter @rumahkodingku-academy/db db:migrate
SHOW CREATE TABLE users_profile;
SHOW CREATE TABLE model_has_roles;
SHOW COLUMNS FROM users;
```

### Commit

`feat(db): add RBAC, user profiles, and auth session families`

## 5. Task A3 — Repositories, stores, and RBAC service

### Files

- Create `apps/api/src/modules/rbac/rbac.constants.ts`.
- Create `apps/api/src/modules/rbac/rbac.repository.ts`.
- Create `apps/api/src/modules/rbac/rbac.service.ts`.
- Create `apps/api/src/modules/rbac/rbac.types.ts`.
- Create `apps/api/src/modules/auth/auth.types.ts`.
- Create `apps/api/src/modules/auth/repositories/auth-users.repository.ts`.
- Create `apps/api/src/modules/auth/repositories/user-profile.repository.ts`.
- Create `apps/api/src/modules/auth/stores/typeorm-refresh-token.store.ts`.
- Create `apps/api/src/modules/auth/stores/typeorm-email-token.store.ts`.
- Create `apps/api/test/contract/refresh-token.store.contract.test.ts`.
- Create `apps/api/test/contract/email-token.store.contract.test.ts`.
- Create `apps/api/test/integration/setup.ts`.
- Create `apps/api/vitest.integration.config.mts`.

### Interfaces

`RbacService`:

```ts
type AccessSnapshot = { roles: string[]; permissions: string[] };

getAccess(userId: string, guardName = "api"): Promise<AccessSnapshot>;
hasPermission(userId: string, permission: string, guardName = "api"): Promise<boolean>;
getDefaultRole(guardName = "api"): Promise<RoleRecord>;
assignDefaultRole(userId: string): Promise<void>;
assignRole(userId: string, roleId: string): Promise<void>;
removeRole(userId: string, roleId: string): Promise<void>;
givePermissionToRole(roleId: string, permissionId: string): Promise<void>;
syncRolePermissions(roleId: string, permissionIds: string[]): Promise<void>;
```

`AuthUsersRepository`:

- `findById(id): Promise<AuthUserRecord | null>`
- `findByEmail(email): Promise<AuthUserRecord | null>`
- `createAccount(input): Promise<AuthUserRecord>`
- `updatePassword(userId, passwordHash): Promise<void>`
- `markEmailVerified(userId, email): Promise<boolean>`
- `updateAvatar(userId, storageKey | null): Promise<void>`

`UserProfileRepository`:

- `findByUserId(userId)`
- `create(userId, displayName, locale)`
- `update(userId, patch)`
- `findByUsername(username)`

Store providers register with `AuthenticationStorage.registerSource()`:

- refresh store: `{ refreshTokens: this }`
- email store: `{ emailTokens: this }`

### Store mapping

Refresh store:

- `record.id` -> `refresh_sessions.token_hash`.
- `record.familyId` -> `family_id`.
- `record.familyExpiresAt` -> `family_expires_at`.
- `record.usedAt` -> `used_at`.
- `record.claims` -> `claims`.
- `markRefreshTokenUsed` must be one conditional `UPDATE ... WHERE token_hash = ? AND used_at IS NULL`.
- `saveRefreshToken` must refuse to save into a revoked family.
- `revokeRefreshTokenFamily` must update the family row and all its tokens in one transaction.
- `revokeUserRefreshTokens` must revoke all families of the user.
- Purge expired families/tokens opportunistically.

Email store:

- `record.id` -> `token_hash`.
- `record.email` -> `email`.
- `record.fingerprint` -> `fingerprint`.
- Purpose maps to `email_verification_tokens` or `password_reset_tokens`.
- `consumeEmailToken` MUST use a transaction with `SELECT ... FOR UPDATE` then `DELETE`; MySQL has no `DELETE ... RETURNING`.
- `saveEmailToken` prunes expired tokens and caps pending tokens per user/purpose at 5.
- `deleteUserEmailTokens` deletes only that user/purpose.

RBAC repository:

- Load roles by user via `model_has_roles` + `roles`.
- Load direct permissions via `model_has_permissions` + `permissions`.
- Load role permissions via `role_has_permissions` + `permissions`.
- Merge permission names.
- `getDefaultRole` queries `roles.is_default = true`.
- `assignDefaultRole` fails if no default role.

### Steps

- [ ] Write failing store contract tests with `authenticationStoreContract`, `contracts: ["refreshTokens"]`/`["emailTokens"]`, `concurrent: true`.
- [ ] Write failing RBAC tests: default role, direct permission, role permission, merge, removal.
- [ ] Implement stores with `DataSource` transactions.
- [ ] Implement RBAC repository/service.
- [ ] Run contract and integration tests.
- [ ] Test concurrent email-token consumption: exactly one succeeds.
- [ ] Test refresh family revocation for a token saved after revocation.

### Verification

```bash
pnpm --filter api test:contract
pnpm --filter api test:integration -- rbac auth-store
```

### Commit

`feat(api): add RBAC service and MySQL auth stores`

## 6. Task A4 — Auth domain and endpoints

### Files

- Create `apps/api/src/modules/auth/auth.module.ts`.
- Create `apps/api/src/modules/auth/auth.controller.ts`.
- Create `apps/api/src/modules/auth/auth.service.ts`.
- Create `apps/api/src/modules/auth/auth-cookies.ts`.
- Create `apps/api/src/modules/auth/auth.middleware.ts` (cookie -> Bearer bridge).
- Create `apps/api/src/modules/auth/providers/jwt-auth.provider.ts`.
- Create `apps/api/src/modules/auth/providers/email-verification.handler.ts`.
- Create `apps/api/src/modules/auth/providers/auth-audit.listener.ts`.
- Create DTOs under `apps/api/src/modules/auth/dto/`.
- Create `apps/api/test/integration/auth.api.test.ts`.
- Modify `apps/api/src/infrastructure/security/security.module.ts`.
- Modify `apps/api/src/app.module.ts`.
- Modify `apps/api/src/main.ts` (middleware, trust proxy).

### Module configuration

```ts
AuthenticationModule.forRoot({
  accessToken: {
    key: env.JWT_SECRET,
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    ttl: env.JWT_TTL,
  },
  refreshToken: {
    ttl: env.JWT_REFRESH_TTL,
    absoluteTtl: env.JWT_REFRESH_ABSOLUTE_TTL,
  },
  password: {}, // scrypt defaults
  emailVerification: { url: `${env.WEB_APP_URL}/verify-email`, ttl: "24h" },
  globalGuard: true,
  allowInMemoryStorage: false,
});
```

`AuthorizationModule.forRoot({ globalGuard: true })`.

### Provider details

`JwtAuthProvider`:

- Extends `JwtBearerProvider<AuthUser>` and registers via `AuthenticationRegistry.registerProvider(this)`.
- `validate(claims)` loads user + profile + RBAC access by `claims.sub`.
- Rejects missing, deleted, or suspended users.
- Returns `AuthUser` with `roles`, `permissions`, `profile`.
- Never returns `passwordHash`.

`AuthMiddleware`:

- If no `Authorization` header and `access_token` cookie exists, set `Authorization: Bearer <cookie>`.
- Do not log the token.
- Do not override existing Authorization header.

`EmailVerificationHandler`:

- Registers via `AuthenticationRegistry.registerHandler("emailVerification", this)`.
- `send(link)` renders and sends `verify-email.hbs`.
- `markVerified(userId, email)` uses conditional update.
- `isVerified(user)` returns `user.emailVerified`.

Password reset uses a small app-owned service over `EmailTokenStore` instead of `PasswordResetService`. The package's reset service requires a `sessions` store even though this app uses JWT refresh families only. The app-owned flow keeps the same security properties:

- Generate a 256-bit single-use token; store only its SHA-256 base64url hash.
- Store purpose `password-reset`, email, expiry, and fingerprint of the old password hash.
- Send `reset-password.hbs` through `AuthMailService`.
- Consume the token atomically, verify expiry/email/fingerprint, hash the new password, update the user, and revoke all refresh-token families.

`AuthAuditListener`:

- Subscribes to `AuthenticationEvents.events$`.
- Writes safe audit metadata to `audit_logs`.
- Never writes tokens, passwords, cookies, or raw email-token values.

### Endpoint behavior

- Register: create account + profile + default role in one transaction; send verification; return `201`; no cookies. Mail failure is best-effort after commit.
- Login: verify; issue tokens; set cookies; return `AuthUser`.
- Refresh: rotate cookies; return `AuthUser`; clear cookies on failure.
- Logout: revoke refresh family; clear cookies; 204.
- Me: return `AuthUser`.
- Patch me: profile fields only; strict DTO.
- Forgot/resend: always 202.
- Reset: reset password, revoke all sessions, clear cookies, return 200.
- Verify: verify token, return email.
- Avatar: profile avatar key; private serve.

### Steps

- [ ] Write failing API integration tests for register, login, me, refresh, logout.
- [ ] Implement `AuthService` and DTOs.
- [ ] Implement registration transaction: account + profile + default role.
- [ ] Implement providers, module wiring, middleware.
- [ ] Add cookie helper tests: flags, Max-Age, clearing, production Secure.
- [ ] Add integration tests for unverified login allowed but verified policy denied.
- [ ] Add integration tests for duplicate email, invalid credentials, suspended user, deleted user.
- [ ] Add integration test for refresh reuse and logout revocation.
- [ ] Add audit tests: sign-in/sign-out/reset/verify events without secrets.

### Verification

```bash
pnpm --filter api test -- auth
pnpm --filter api test:integration -- auth.api
```

### Commit

`feat(api): implement auth API with RBAC, profiles, and JWT cookies`

## 7. Task A5 — Authorization policies and guards

### Files

- Create `apps/api/src/modules/rbac/policies/permission.policy.ts`.
- Create `apps/api/src/modules/auth/policies/email-verified.policy.ts`.
- Create `apps/api/src/modules/auth/policies/ownership.policy.ts`.
- Create `apps/api/test/integration/auth-authorization.test.ts`.
- Modify `apps/api/src/infrastructure/security/security.module.ts`.

### Policy details

```ts
@Policy()
export class PermissionPolicy {
  has(user: AuthUser | null, permission: string) {
    return user?.permissions.includes(permission) ?? false;
  }
}

@Policy()
export class EmailVerifiedPolicy {
  verified(user: AuthUser | null) {
    return user?.emailVerified === true;
  }
}

@Policy()
export class OwnershipPolicy {
  owns(user: AuthUser | null, ownerId: string) {
    return user?.id === ownerId;
  }
}
```

Usage:

```ts
@Can(PermissionPolicy, "has", () => [PERMISSIONS.ADMIN_ACCESS])
```

### Steps

- [ ] Write failing unit tests for guest, USER, unverified USER, verified USER, admin.
- [ ] Write a failing integration test with a test-only controller using `@Can(PermissionPolicy, "has")`, `@Can(EmailVerifiedPolicy, "verified")`, and `@Can(OwnershipPolicy, "owns")`.
- [ ] Implement policies.
- [ ] Enable global authorization guard and add `@Can.Anyone()` to authenticated routes without policy.
- [ ] Ensure `@Public` is present on health and CSRF; public auth routes still require CSRF for POST.
- [ ] Test: user without `admin.access` receives 403; unverified receives 403; wrong owner receives 403.
- [ ] Add a grep-based test/CI check that application code does not compare `role ===`, `roleName`, or hardcoded role names.

### Verification

```bash
pnpm --filter api test -- policy
pnpm --filter api test:integration -- authorization
```

### Commit

`feat(api): enforce permission, verification, and ownership policies`

## 8. Task A6 — CSRF session binding and rate limits

### Files

- Modify `apps/api/src/modules/csrf/csrf.ts`.
- Modify `apps/api/src/modules/csrf/csrf.controller.ts`.
- Create `apps/api/src/modules/csrf/csrf.test.ts`.
- Create `apps/api/src/modules/auth/auth-rate-limit.guard.ts`.
- Create `apps/api/src/modules/auth/auth-rate-limit.service.ts`.
- Create `apps/api/src/modules/auth/auth-rate-limit.test.ts`.
- Modify `apps/api/src/infrastructure/redis/redis.module.ts` if needed.
- Modify `apps/api/src/main.ts` for trust proxy.
- Modify `packages/env/src/server.ts` for limits/trust proxy.

### CSRF

- Add `ensureCsrfSession` middleware before `csrfProtection`.
- If `csrf-session` cookie is absent, set a random 32-byte hex value:
  - `HttpOnly`, `SameSite=Lax`, `Secure` in production, `Path=/`, `Max-Age=7d`.
- `getSessionIdentifier` reads `csrf-session`; never `req.ip`.
- `GET /csrf/token` must set the session cookie and return the token.
- Every non-GET auth endpoint requires `x-csrf-token`.
- Preserve webhook exemption; webhook authenticity is Phase 5.

### Rate limits

`AuthRateLimitService` uses `RedisService.client`.

Keys:

- `auth:rl:register:<ip>`
- `auth:rl:login:<ip>:<sha256(email)>`
- `auth:rl:refresh:<ip>:<sha256(refresh cookie)>`
- `auth:rl:forgot:<ip>:<sha256(email)>`
- `auth:rl:reset:<ip>`
- `auth:rl:verify:<ip>`
- `auth:rl:resend:<ip>:<sha256(email)>`
- `auth:rl:avatar:<userId>`

Use `INCR` + `PEXPIRE` on first hit. Return `429` with `Retry-After` and Problem Details.

Never store raw email or refresh token in Redis keys; use SHA-256.

### Proxy

- Add `TRUST_PROXY` env, default `false`.
- When true, configure Express `trust proxy` with the approved hop count.
- Test `X-Forwarded-For` produces the correct rate-limit key.

### Steps

- [ ] Write failing CSRF tests: missing session, wrong session, valid token, invalid token.
- [ ] Write failing rate-limit tests with fake Redis: first N pass, N+1 returns 429; key does not contain raw email.
- [ ] Implement session cookie and guard.
- [ ] Add integration tests for each auth endpoint limit.
- [ ] Test 429 Problem Details and `Retry-After`.
- [ ] Test rate-limit isolation between two IPs and two emails.

### Verification

```bash
pnpm --filter api test -- csrf rate-limit
pnpm --filter api test:integration -- security
```

### Commit

`feat(api): bind CSRF to session cookie and add auth rate limits`

## 9. Task A7 — Email, profile, and avatar

### Files

- Create `apps/api/templates/verify-email.hbs`.
- Create `apps/api/templates/reset-password.hbs`.
- Modify `apps/api/templates/welcome.hbs` if registration uses it.
- Create `apps/api/src/modules/auth/auth-mail.service.ts`.
- Create `apps/api/src/modules/auth/avatar.service.ts`.
- Add profile/avatar routes to `auth.controller.ts` or a dedicated controller.
- Create `apps/api/src/modules/auth/profile.test.ts`.
- Create `apps/api/src/modules/auth/avatar.test.ts`.
- Modify `packages/env/src/server.ts` for SMTP/Resend and `WEB_APP_URL`.

### Email

- Verification link: `${WEB_APP_URL}/verify-email?token=...`.
- Reset link: `${WEB_APP_URL}/reset-password?token=...`.
- Send through the existing `@nestjs/mail` service.
- Local: Mailpit SMTP (`localhost:1026`).
- Production: Resend SMTP (`smtp.resend.com`, port 465 or 587, user `resend`, password API key).
- Templates contain no tokens in logs.

### Profile

- `PATCH /auth/me` updates `users_profile` only.
- Strict DTO; reject role/status/email/permissions/password.
- Normalize username lowercase; unique check returns `AUTH_USERNAME_TAKEN`.
- Validate URLs http/https, timezone IANA, country code ISO, locale `id`/`en`.
- Return full `AuthUser`.

### Avatar

- Store in `users_profile.avatar_storage_key`.
- `POST /auth/avatar`:
  - `FileInterceptor("file", { storage: uploadToDisk({ contentTypes: ["image/jpeg","image/png","image/webp"], limits: { fileSize: 2_000_000, files: 1 }, key: ... }) })`.
  - Key: `avatars/<uuid><extension>`; never use original filename.
  - Update profile; delete old key after successful update. If DB update fails, delete the newly stored key.
  - Return `{ avatarUrl: "/api/v1/auth/avatar" }`.
- `GET /auth/avatar`:
  - Authenticated; `serveFile(disk, key, { req, res, disposition: "inline", cacheControl: "private, max-age=0, must-revalidate" })`.
  - Missing avatar -> 404.
- `DELETE /auth/avatar`: delete file and null the column; 204.

### Steps

- [ ] Write failing tests for verification email link and reset email link.
- [ ] Write failing profile tests: allowed fields, rejected role/status/email, URL/timezone/username validation.
- [ ] Write failing avatar tests: valid JPEG/PNG/WebP, oversized, spoofed type, unauthorized, private read, old file deletion.
- [ ] Implement mail service, templates, profile update, avatar storage.
- [ ] Test Mailpit delivery locally; assert subject/link presence.
- [ ] Test invalid/expired/used verification and reset tokens.

### Verification

```bash
docker compose up -d mailpit
pnpm --filter api test -- profile avatar mail
pnpm --filter api test:integration -- email
```

### Commit

`feat(api): add profile, private avatar, verification, and reset delivery`

## 10. Task A8 — RBAC seed, admin CLI, startup validation

### Files

- Create `apps/api/src/cli/seed-rbac.ts`.
- Create `apps/api/src/cli/create-admin.ts`.
- Create `apps/api/src/cli/cli-utils.ts`.
- Create `apps/api/src/modules/rbac/rbac.constants.ts` if not already created.
- Create `apps/api/src/modules/rbac/rbac.seed.test.ts`.
- Modify `apps/api/package.json` scripts:
  - `db:seed:rbac`
  - `auth:create-admin`
- Modify `docs/development/local-setup.md`.

### Seed

Idempotent upserts:

- `user` role, `guard_name = api`, `is_default = true`.
- `admin` role, `guard_name = api`.
- `admin.access` permission, `guard_name = api`.
- attach `admin.access` to `admin`.

No role-name checks in application code.

### Startup validation

`RbacService.onModuleInit`:

- Exactly one default role for `api`.
- `admin.access` exists.
- Fail fast with a safe error if invalid.

### Admin CLI

`auth:create-admin`:

- Reads `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD` from env or prompts.
- Validates password 12–128.
- Creates user + profile if absent.
- Assigns admin role by querying the seeded role.
- Idempotent: existing admin user gets role if missing.
- Never runs automatically at API boot.

### Steps

- [ ] Write failing seed tests: run twice, one default role, permission attached.
- [ ] Write failing startup test: missing default role fails boot.
- [ ] Write failing admin CLI test: creates user/profile/role; second run is idempotent.
- [ ] Implement seed/CLI/validation.
- [ ] Document CLI usage and security note.

### Verification

```bash
pnpm --filter api db:seed:rbac
pnpm --filter api db:seed:rbac
pnpm --filter api auth:create-admin
```

### Commit

`feat(api): seed RBAC and add admin bootstrap CLI`

## 11. Task A9 — OpenAPI, integration suite, and CI

### Files

- Modify `apps/api/src/main.ts` Swagger setup if needed.
- Modify `docs/api/api-specification.md`.
- Create `apps/api/test/integration/auth.security.test.ts`.
- Create `apps/api/test/integration/auth.helpers.ts`.
- Create `apps/api/test/integration/migration-upgrade.test.ts`.
- Modify `apps/api/package.json` scripts.
- Modify `.github/workflows/ci.yml`.

### Integration test matrix

- Migration fresh DB + upgrade from Phase 2.
- RBAC seed idempotency; default role; permission resolution.
- Registration account+profile+default role atomicity.
- Duplicate email; invalid credentials; suspended/deleted user.
- Login unverified allowed; verified policy denied.
- Refresh rotation success; reuse revokes family.
- Logout revokes refresh token.
- CSRF missing/invalid/valid.
- Rate limits per endpoint.
- Permission policy: user without `admin.access` denied.
- Ownership denied for wrong owner.
- Profile update allowed fields; role/status/email rejected; username unique; URL/timezone validation.
- Forgot/reset: generic 202, single-use, expiry, password change invalidates sessions.
- Verify email: single-use, expiry, wrong email.
- Avatar: type/size/auth/private.
- Cookie flags.
- No token/password in logs/audit.
- No application role-name comparisons.

### Steps

- [ ] Generate OpenAPI and inspect auth/RBAC/profile schemas.
- [ ] Regenerate `apps/web/src/lib/api/schema.d.ts` in Phase 3.B after contract freeze.
- [ ] Add CI steps:
  - create test database
  - run migrations
  - seed RBAC
  - run unit tests
  - run store contract tests
  - run API integration tests
  - build
- [ ] Run full suite locally.
- [ ] Update docs with actual response examples.

### Verification

```bash
pnpm check-types
pnpm lint
pnpm format:check
pnpm test
pnpm --filter api test:contract
pnpm --filter api test:integration
pnpm build
```

### Commit

`test(api): cover auth, RBAC, profile, and migration security`

## 12. Phase 3.A Exit Checklist

- [ ] Migration fresh and upgrade pass.
- [ ] RBAC seed idempotent; exactly one default role; `admin.access` exists.
- [ ] Admin CLI idempotent.
- [ ] Store contracts pass with concurrency.
- [ ] Auth, RBAC, profile, avatar, CSRF, rate limit tests pass.
- [ ] No application role-name comparison.
- [ ] OpenAPI and docs synchronized.
- [ ] CI green on `dev`.
- [ ] No secrets in logs or client bundle.
