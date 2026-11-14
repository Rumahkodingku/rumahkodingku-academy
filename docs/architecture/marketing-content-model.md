# Marketing Content Model

**Status:** MVP local content contract  
**Scope:** Marketing content only  
**Runtime:** Local typed fixtures in `apps/web/src/marketing`.

## 1. Boundary

Marketing content MUST NOT own or serve LMS data. The following data stays in MySQL behind NestJS:

- users, sessions, roles, profiles
- courses, sections, lessons, categories
- orders, payments, refunds, coupons, enrollments
- quizzes, progress, projects, submissions, certificates
- discussions, notifications, audit logs

Marketing content is limited to the homepage surface:

| Kind     | Source                               | Purpose                                                   |
| -------- | ------------------------------------ | --------------------------------------------------------- |
| Homepage | `apps/web/src/marketing/fixtures.ts` | Hero, feature grid, learning steps, statement, proof, CTA |
| Media    | `apps/web/public/imagery`            | Local editorial and product imagery                       |

The TypeScript contract in `apps/web/src/marketing/content-types.ts` is the source of truth.

## 2. Content Types

### 2.1 Homepage

| Field               | Type                 | Required | Notes                      |
| ------------------- | -------------------- | -------- | -------------------------- |
| `hero.eyebrow`      | string               | yes      | Small label above headline |
| `hero.title`        | string               | yes      | Main headline              |
| `hero.description`  | text                 | yes      | Supporting copy            |
| `hero.primaryCta`   | `MarketingLink`      | yes      | Primary action             |
| `hero.secondaryCta` | `MarketingLink`      | no       | Secondary action           |
| `hero.note`         | text                 | no       | Supporting note            |
| `hero.artifact`     | `MarketingArtifact`  | no       | Local editorial media      |
| `features`          | `MarketingFeature[]` | yes      | Value propositions         |
| `steps`             | `MarketingStep[]`    | yes      | Ordered learning steps     |
| `statement`         | `MarketingStatement` | no       | Editorial statement        |
| `proof`             | `MarketingProof`     | no       | Evidence points            |
| `cta`               | `MarketingCta`       | no       | Closing call to action     |

### 2.2 Shared Shapes

`MarketingLink`:

| Field      | Type    | Required |
| ---------- | ------- | -------- |
| `label`    | string  | yes      |
| `href`     | string  | yes      |
| `external` | boolean | no       |

`MarketingMedia`:

| Field             | Type   | Required |
| ----------------- | ------ | -------- |
| `url`             | string | yes      |
| `alternativeText` | string | no       |
| `caption`         | string | no       |
| `width`           | number | no       |
| `height`          | number | no       |

`MarketingFeature`:

| Field         | Type                               | Required |
| ------------- | ---------------------------------- | -------- |
| `icon`        | `course`, `project`, `certificate` | yes      |
| `title`       | string                             | yes      |
| `description` | text                               | yes      |

`MarketingStep`:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| `title`       | string | yes      |
| `description` | text   | yes      |

`MarketingArtifact`:

| Field     | Type             | Required |
| --------- | ---------------- | -------- |
| `media`   | `MarketingMedia` | yes      |
| `caption` | string           | no       |

`MarketingStatement`:

| Field     | Type   | Required |
| --------- | ------ | -------- |
| `eyebrow` | string | no       |
| `title`   | string | yes      |
| `body`    | text   | yes      |

`MarketingProof`:

| Field         | Type     | Required |
| ------------- | -------- | -------- |
| `eyebrow`     | string   | no       |
| `title`       | string   | yes      |
| `description` | text     | yes      |
| `points`      | string[] | yes      |

`MarketingCta`:

| Field          | Type            | Required |
| -------------- | --------------- | -------- |
| `eyebrow`      | string          | no       |
| `title`        | string          | yes      |
| `description`  | text            | no       |
| `primaryCta`   | `MarketingLink` | yes      |
| `secondaryCta` | `MarketingLink` | no       |

## 3. Localization

- Default locale: `id`.
- Additional locale: `en`.
- Each locale has its own typed fixture entry.
- Missing translations fall back to the default locale only when the content contract allows it. Do not mix Indonesian and English in one rendered page.

## 4. Access

- `getMarketingHomepage(locale)` returns the local fixture for the requested locale.
- No network request, token, or CMS runtime is involved.
- Keep marketing content independent from LMS data.
- Client components may receive typed content as props.

## 5. Development and Editing

- Edit `apps/web/src/marketing/fixtures.ts` directly.
- Keep `MarketingMedia.url` pointed at local assets under `apps/web/public`.
- Add tests in `apps/web/test/unit/marketing/content.test.ts` when the contract changes.
- Keep LMS data out of the marketing module.
