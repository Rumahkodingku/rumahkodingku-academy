# Strapi Marketing Content Model

**Status:** Phase 2 contract  
**Scope:** Marketing content only  
**Runtime:** Strapi is not deployed from this repository yet. Phase 4 will create the Strapi app.

## 1. Boundary

Strapi MUST NOT own or serve LMS data. The following data stays in MySQL behind NestJS:

- users, sessions, roles, profiles
- courses, sections, lessons, categories
- orders, payments, refunds, coupons, enrollments
- quizzes, progress, projects, submissions, certificates
- discussions, notifications, audit logs

Only these marketing content types are allowed through the web integration:

| Kind            | API name          | Purpose                                                   |
| --------------- | ----------------- | --------------------------------------------------------- |
| Single type     | `homepage`        | Public home hero, feature grid, learning steps            |
| Single type     | `site-setting`    | Site name, tagline, logo, navigation, footer, default SEO |
| Collection type | `marketing-pages` | Static marketing pages such as about, privacy, terms      |

The allowlist lives in `apps/web/src/strapi/content-types.ts`. Collection and single helpers accept only these names. The TypeScript contract is the source of truth until the Strapi app exists.

## 2. Content Types

### 2.1 `site-setting` (single type)

| Field         | Type                                 | Required | Notes                    |
| ------------- | ------------------------------------ | -------- | ------------------------ |
| `siteName`    | string                               | yes      | `RumahKodingku Academy`  |
| `tagline`     | string                               | yes      | `Learn · Build · Grow`   |
| `description` | text                                 | yes      | Short public description |
| `logo`        | media (single image)                 | no       | Official logo asset      |
| `nav`         | component `shared.link` (repeatable) | yes      | Public navigation        |
| `footerText`  | text                                 | yes      | Short footer copy        |
| `seoDefault`  | component `shared.seo`               | no       | Default metadata         |

### 2.2 `homepage` (single type)

| Field               | Type                                    | Required | Notes                      |
| ------------------- | --------------------------------------- | -------- | -------------------------- |
| `hero.eyebrow`      | string                                  | yes      | Small label above headline |
| `hero.title`        | string                                  | yes      | Main headline              |
| `hero.description`  | text                                    | yes      | Supporting copy            |
| `hero.primaryCta`   | component `shared.link`                 | yes      | Primary action             |
| `hero.secondaryCta` | component `shared.link`                 | no       | Secondary action           |
| `features`          | component `blocks.feature` (repeatable) | yes      | Three value propositions   |
| `steps`             | component `blocks.step` (repeatable)    | yes      | Ordered learning steps     |
| `seo`               | component `shared.seo`                  | no       | Page metadata              |

### 2.3 `marketing-pages` (collection type)

| Field    | Type                   | Required | Notes            |
| -------- | ---------------------- | -------- | ---------------- |
| `title`  | string                 | yes      | Page title       |
| `slug`   | uid (from title)       | yes      | Unique slug      |
| `blocks` | dynamic zone           | yes      | Marketing blocks |
| `seo`    | component `shared.seo` | no       | Page metadata    |

Allowed dynamic-zone components:

- `blocks.hero`
- `blocks.feature-grid`
- `blocks.steps`
- `blocks.rich-text`
- `blocks.faq`
- `blocks.cta`

## 3. Shared Components

### `shared.link`

| Field      | Type    | Required |
| ---------- | ------- | -------- |
| `label`    | string  | yes      |
| `href`     | string  | yes      |
| `external` | boolean | no       |

### `shared.seo`

| Field             | Type   | Required |
| ----------------- | ------ | -------- |
| `metaTitle`       | string | yes      |
| `metaDescription` | text   | yes      |
| `metaImage`       | media  | no       |
| `keywords`        | string | no       |
| `canonicalURL`    | string | no       |
| `metaRobots`      | string | no       |

### `blocks.feature`

| Field         | Type                                    | Required |
| ------------- | --------------------------------------- | -------- |
| `icon`        | enum `course`, `project`, `certificate` | yes      |
| `title`       | string                                  | yes      |
| `description` | text                                    | yes      |

### `blocks.step`

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| `title`       | string | yes      |
| `description` | text   | yes      |

### `shared.artifact`

| Field     | Type   | Required |
| --------- | ------ | -------- |
| `media`   | media  | yes      |
| `caption` | string | no       |

### `shared.statement`

| Field     | Type   | Required |
| --------- | ------ | -------- |
| `eyebrow` | string | no       |
| `title`   | string | yes      |
| `body`    | text   | yes      |

### `shared.proof`

| Field         | Type                | Required |
| ------------- | ------------------- | -------- |
| `eyebrow`     | string              | no       |
| `title`       | string              | yes      |
| `description` | text                | yes      |
| `points`      | string (repeatable) | yes      |

### `shared.cta`

| Field          | Type                    | Required |
| -------------- | ----------------------- | -------- |
| `eyebrow`      | string                  | no       |
| `title`        | string                  | yes      |
| `description`  | text                    | no       |
| `primaryCta`   | component `shared.link` | yes      |
| `secondaryCta` | component `shared.link` | no       |

### `blocks.faq`

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `question` | string | yes      |
| `answer`   | text   | yes      |

## 4. Localization

- Default locale: `id`.
- Additional locale: `en`.
- Every marketing content type must enable Strapi i18n.
- The web app passes `locale` on every read.
- Missing translations fall back to the default locale only when the content contract allows it. Do not mix Indonesian and English in one rendered page.

## 5. Permissions and Tokens

Strapi public role:

- `find` and `findOne` for `homepage`, `site-setting`, and `marketing-pages`.
- No `create`, `update`, or `delete`.
- No access to LMS collections. Those collections do not exist in Strapi.

Web app:

- `NEXT_PUBLIC_STRAPI_URL` is public and safe.
- `STRAPI_API_TOKEN` is server-only. Never prefix it with `NEXT_PUBLIC_`.
- Authenticated reads use `apps/web/src/strapi/server.ts`.
- Browser-safe helpers must use the same content allowlist.
- Never import `apps/web/src/strapi/server.ts` from a client component.

## 6. Development Fallback

`apps/web/src/strapi/fixtures.ts` contains typed Indonesian and English fixtures. `getHomepage`, `getSiteSettings`, and `getMarketingPage` return fixtures only when:

- `NODE_ENV !== "production"`, and
- the Strapi request fails.

Production failures surface as errors. Fixtures are not a production content source.

## 7. Phase 4 Handoff

When the Strapi app is created:

1. Create the content types and components exactly as described above.
2. Enable i18n with `id` and `en`.
3. Configure public read permissions and a server API token.
4. Seed the `homepage` and `site-setting` entries from the fixtures.
5. Run a contract test against the live Strapi schema.
6. Keep LMS data out of Strapi.
