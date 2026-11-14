# Phase 4 — Public Site, Catalog, and Course Authoring (Frontend-First)

**Status:** Approved plan  
**Scope:** `apps/web` frontend-first with typed fixtures  
**Backend:** Deferred to the next vertical slice  
**Last updated:** 2026-11-14

---

## 1. Goal

Build a complete public course experience that lets visitors discover courses, understand the curriculum, evaluate outcomes, and open a course detail page. Add a minimal admin shell that establishes the future course-authoring entry point without implementing backend CRUD yet.

This phase is intentionally frontend-first. The UI contract, fixtures, interaction model, and tests define the target. The NestJS course API follows after the UI is stable.

---

## 2. Locked Decisions

| Area             | Decision                                                                        |
| ---------------- | ------------------------------------------------------------------------------- |
| Data source      | Typed fixtures inside `apps/web`                                                |
| Reference        | Coursera for trust and information architecture                                 |
| Composition      | Editorial index, not Vyora-style layout                                         |
| Public hierarchy | Catalog index, editorial rows, detail with sticky price panel                   |
| Visual language  | Blue, white, black, neutral grays, light-only                                   |
| Brand accent     | Academy Blue `#2563EB`                                                          |
| Catalog filters  | Search, category, difficulty, language, price, sort, pagination                 |
| Sorting          | Featured, newest, title (popularity deferred until real enrollment data exists) |
| Admin            | Minimal shell only; no authoring CRUD                                           |
| Media            | Real UI artifacts, diagrams, and typography; no stock photos                    |
| Rich text        | Render trusted fixture content; no editor yet                                   |
| Backend          | Deferred                                                                        |

---

## 3. Routes

| Route             | Purpose                                    | Rendering                     |
| ----------------- | ------------------------------------------ | ----------------------------- |
| `/`               | Marketing landing with catalog CTA         | Server + client islands       |
| `/courses`        | Course catalog with URL-driven discovery   | Server shell + client filters |
| `/courses/[slug]` | Public course detail for published courses | Server                        |
| `/admin`          | Admin shell minimal                        | Server, permission guarded    |
| `/learn`          | Existing learner placeholder               | Server                        |

Draft and archived courses must return `notFound()` on public detail routes.

---

## 4. Public Page Hierarchy

### 4.1 `/courses` — catalog

1. Editorial hero:
   - Page title.
   - Short description.
   - Total published course count.
   - Primary search input.
2. Catalog workspace:
   - Left filter rail on desktop.
   - Result toolbar: result count, sort select, active filters.
   - Result rows: title, short description, categories, difficulty, duration, lesson count, price, CTA.
   - Pagination.
3. Empty state when filters return no results.
4. Mobile:
   - Filters collapse into a custom sheet/dialog.
   - Result rows stack.
   - No horizontal overflow.

URL contract:

```text
/courses?q=nextjs&category=frontend&difficulty=beginner&language=id&price=paid&sort=newest&page=2
```

### 4.2 `/courses/[slug]` — detail

1. Breadcrumb back to catalog.
2. Editorial hero:
   - Category labels.
   - Title and short description.
   - Instructor, difficulty, duration, language.
   - Primary CTA and preview lesson CTA if available.
3. Detail body:
   - Learning outcomes.
   - Prerequisites.
   - Curriculum sections and lessons.
   - Instructor block.
   - Certificate and final-project conditions.
   - Lifetime-access explanation.
4. Sticky price panel on desktop:
   - Price and discount.
   - CTA.
   - Access terms.
5. Mobile price panel below hero.
6. Related or next courses from the same category.

No testimonials, fake ratings, invented popularity, or fabricated outcomes.

---

## 5. Data Contract

File: `apps/web/src/features/courses/types.ts`

```ts
export type CourseDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type CourseLanguage = "id" | "en";

export type CourseLessonType = "YOUTUBE_VIDEO" | "RICH_TEXT";

export type CourseInstructor = {
  name: string;
  bio?: string | null;
  avatarKey?: string | null;
};

export type CourseLesson = {
  id: string;
  title: string;
  description?: string | null;
  contentType: CourseLessonType;
  videoReference?: string | null;
  richTextBody?: string | null;
  durationMinutes: number;
  required: boolean;
  preview: boolean;
  position: number;
  status: "DRAFT" | "PUBLISHED";
};

export type CourseSection = {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  lessons: CourseLesson[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  difficulty: CourseDifficulty;
  language: CourseLanguage;
  estimatedDurationMinutes: number;
  learningOutcomes: string[];
  prerequisites: string[];
  instructor: CourseInstructor;
  price: number;
  discountPrice?: number | null;
  currency: "IDR";
  status: CourseStatus;
  featured: boolean;
  finalProjectEnabled: boolean;
  certificateEnabled: boolean;
  publishedAt?: string | null;
  sections: CourseSection[];
  categories: string[];
};

export type CatalogFilters = {
  query: string;
  category: string;
  difficulty: CourseDifficulty | "ALL";
  language: CourseLanguage | "ALL";
  price: "all" | "free" | "paid";
  sort: "featured" | "newest" | "title";
  page: number;
  pageSize: number;
};
```

---

## 6. Fixture Set

File: `apps/web/src/features/courses/fixtures.ts`

### 6.1 Required volume

- 12 courses.
- 2 locales: `id` and `en`.
- 4 categories: Frontend, Backend, DevOps, Data.
- 3 sections per course.
- 4 lessons per section.
- 1 featured course.
- 1 draft course.
- 1 archived course.
- 1 free course.

### 6.2 Course list

| Slug                       | Title                                         | Category | Difficulty   | Status    |
| -------------------------- | --------------------------------------------- | -------- | ------------ | --------- |
| `nextjs-app-router`        | Next.js App Router: Fondasi ke Produksi       | Frontend | Intermediate | Published |
| `react-19-patterns`        | React 19: Composition dan Performance         | Frontend | Intermediate | Published |
| `typescript-real-projects` | TypeScript untuk Proyek Nyata                 | Frontend | Beginner     | Published |
| `tailwind-design-system`   | Tailwind CSS 4: Design System                 | Frontend | Intermediate | Published |
| `nestjs-api-architecture`  | NestJS: Arsitektur API Produksi               | Backend  | Intermediate | Published |
| `mysql-typeorm`            | MySQL dan TypeORM untuk Product Team          | Backend  | Beginner     | Published |
| `auth-rbac-nestjs`         | Authentication dan RBAC dengan NestJS         | Backend  | Advanced     | Published |
| `docker-deployment`        | Docker dan Deployment untuk Developer         | DevOps   | Intermediate | Published |
| `testing-web-apps`         | Testing Web Apps dengan Vitest dan Playwright | Frontend | Intermediate | Published |
| `data-visualization`       | Data Visualization untuk Dashboard            | Data     | Intermediate | Published |
| `ai-assisted-development`  | AI-Assisted Development Workflow              | Frontend | Beginner     | Draft     |
| `devops-foundations`       | DevOps Foundations: CI/CD dan Observability   | DevOps   | Beginner     | Archived  |

### 6.3 Required content per course

- Title and short description.
- Long description.
- 4–8 learning outcomes.
- 2–5 prerequisites.
- Instructor name and bio.
- Estimated duration.
- Price in IDR.
- Category and difficulty.
- Three sections with four lessons each.
- Lesson type, duration, status, required/optional, preview flag.
- Final-project and certificate flags.
- Published date.

Use one course as a free course. Use one course as featured. Do not add testimonials, ratings, fake enrollment numbers, or fake popularity metrics.

---

## 7. Catalog Functions

File: `apps/web/src/features/courses/catalog.ts`

```ts
export function publishedCourses(courses: Course[]): Course[];
export function featuredCourses(courses: Course[], limit?: number): Course[];
export function courseBySlug(courses: Course[], slug: string): Course | null;
export function filterCourses(courses: Course[], filters: CatalogFilters): Course[];
export function sortCourses(courses: Course[], sort: CatalogFilters["sort"]): Course[];
export function paginateCourses(
  courses: Course[],
  page: number,
  pageSize: number,
): { items: Course[]; page: number; pageCount: number; total: number };
```

Rules:

- Public functions only return `PUBLISHED` courses.
- Search matches title and short description case-insensitively.
- Category filter matches any category.
- Difficulty and language filters are exact.
- Price filter: `free` = price `0`; `paid` = price greater than `0`.
- Featured sort puts featured first, then published date descending.
- Newest sort uses `publishedAt` descending.
- Title sort uses locale-aware title comparison.
- Page size is fixed at 6; invalid page values clamp to `1`.
- Unknown slug returns `null`.

---

## 8. Components

```text
apps/web/src/features/courses/
  types.ts
  fixtures.ts
  catalog.ts
  components/
    course-card.tsx
    course-catalog.tsx
    course-filters.tsx
    course-detail.tsx
    curriculum.tsx
    price-panel.tsx
    instructor-block.tsx
    course-empty-state.tsx
```

### CourseCard

- Editorial row, not a generic card grid.
- Link wraps the title and primary action.
- Shows category, difficulty, duration, lesson count, price.
- Hover: title underline or row background shift, not a lift.
- No fake badges.

### CourseFilters

- Search input.
- Category select.
- Difficulty select.
- Language select.
- Price select.
- Sort select.
- Clear-filters action.
- Desktop: left rail.
- Mobile: custom sheet.
- Updates URL query, not only local state.

### CourseCatalog

- Receives published courses.
- Reads `searchParams`.
- Applies filters, sort, pagination.
- Renders result count, active filter summary, rows, pagination.
- Empty state when no match.

### CourseDetail

- Server-rendered.
- Hero, outcomes, prerequisites, curriculum, instructor, conditions.
- Sticky price panel desktop, inline mobile.
- Published-only.

### Curriculum

- Section heading and lesson list.
- Lesson position, title, duration, preview/required status.
- Preview lessons link to a disabled preview notice until a player exists.
- No fake video player.

### PricePanel

- Current price, discount when present.
- CTA.
- Lifetime access and certificate note.
- No purchase flow yet; CTA links to the future checkout route or shows a clear “checkout belum tersedia” state. Do not create a dead button.

### InstructorBlock

- Name, bio, initials fallback.
- No generated profile photo.

### CourseEmptyState

- Editorial empty state.
- Clear filters action.
- Link back to all courses.

---

## 9. Admin Shell

Route: `/admin`

- Existing permission guard remains.
- Header: “Area admin”.
- Module rows:
  - Konten kursus.
  - Peserta.
  - Transaksi.
  - Proyek.
  - Sertifikat.
- Status column: “Belum tersedia”.
- No fake counts or charts.
- No authoring form yet.

---

## 10. SEO and Metadata

- `/courses` metadata: title, description, canonical.
- `/courses/[slug]` dynamic metadata from course.
- Open Graph title and description.
- No fake review or rating schema.
- Add course routes to sitemap only when published.
- Draft and archived routes are not indexed.

---

## 11. Visual Direction

- Page canvas: white `#FFFFFF`.
- Ink: `#0A0A0A`.
- Muted text: `#52525B`.
- Hairline: `#E4E7EC`.
- Accent: `#2563EB`.
- Price panel: deep black with white text.
- Typography: existing Space Grotesk display + Manrope body.
- Catalog: editorial rows, left filter rail, hairline separation.
- Detail: editorial hero, curriculum rows, sticky price panel.
- No warm paper, orange, lime, or Vyora-like palette.
- No generic card mosaic.
- No fake stats, testimonials, or ratings.

Design dials:

```text
ENERGY 2 / RHYTHM 2 / MOTION 1
```

Reason: public course discovery should feel confident and editorial, but not experimental or motion-heavy.

---

## 12. Testing

### Unit

`apps/web/test/unit/features/courses/catalog.test.ts`

- search title and description
- category filter
- difficulty filter
- language filter
- free/paid filter
- featured/newest/title sort
- pagination count and clamping
- published-only filtering
- slug lookup
- unknown slug returns `null`

`apps/web/test/unit/features/courses/fixtures.test.ts`

- 12 courses
- locale parity
- unique slugs
- unique section positions per course
- unique lesson positions per section
- all published courses have publishedAt
- draft and archived courses excluded from public helpers
- no fixture contains fake ratings or testimonials

### E2E

`apps/web/test/e2e/catalog.spec.ts`

- catalog renders published courses
- search changes URL and results
- category filter changes URL and results
- difficulty/price filter works
- sort works
- pagination works
- clearing filters restores all published courses
- course detail opens from catalog
- draft slug returns 404
- mobile 390 has no horizontal overflow
- keyboard can operate filters

### Accessibility

- Axe serious/critical = 0 on `/courses` and one course detail.
- Search input has visible label.
- Filter selects have accessible names.
- Focus visible on all controls.
- Empty state has heading and action.

---

## 13. Implementation Tasks

### Task 1: Types and fixtures

- Create `types.ts`.
- Create `fixtures.ts` with 12 courses and locale parity.
- Add fixture validation tests.
- Keep all content factual and product-specific.
- Commit: `feat(web): add course catalog fixtures`.

### Task 2: Catalog functions

- Create `catalog.ts`.
- Add pure unit tests first.
- Implement filtering, sorting, pagination, slug lookup.
- Commit: `feat(web): add catalog filtering and sorting`.

### Task 3: Course row and filters

- Create `course-card.tsx`.
- Create `course-filters.tsx`.
- Create `course-catalog.tsx`.
- Use existing Select, Field, Input, Button, Badge.
- Add component tests for empty state and filter updates.
- Commit: `feat(web): add editorial course catalog UI`.

### Task 4: Catalog route

- Create `/courses/page.tsx`.
- Read `searchParams`.
- Pass published fixtures.
- Add metadata.
- Add E2E catalog test.
- Commit: `feat(web): add public course catalog route`.

### Task 5: Course detail

- Create `/courses/[slug]/page.tsx`.
- Create `course-detail.tsx`, `curriculum.tsx`, `price-panel.tsx`, `instructor-block.tsx`.
- Add `notFound()` for non-published slugs.
- Add metadata.
- Add E2E detail test.
- Commit: `feat(web): add public course detail page`.

### Task 6: Admin shell

- Update `/admin` with module rows and status.
- Keep permission guard.
- Add no fake metrics.
- Commit: `feat(web): expand admin course shell`.

### Task 7: SEO and navigation

- Add catalog and detail links to header where relevant.
- Update sitemap.
- Add canonical and Open Graph metadata.
- Ensure no dead nav links.
- Commit: `feat(web): add course SEO and navigation`.

### Task 8: Verification and evidence

- Run all gates.
- Add visual snapshots for catalog and detail.
- Add evidence README.
- Update Phase 4 docs.
- Commit: `test(web): verify public course experience`.

---

## 14. Acceptance Criteria

- 12 complete courses available in Indonesian and English fixtures.
- `/courses` supports search, category, difficulty, language, price, sort, and pagination.
- Filters are URL-driven and reload-safe.
- `/courses/[slug]` shows full course detail for published courses only.
- Draft and archived courses are not publicly accessible.
- Catalog and detail have loading, empty, error, and not-found states.
- Admin shell remains permission guarded.
- No fake testimonials, ratings, or popularity numbers.
- Mobile 390 has no horizontal overflow.
- Keyboard and axe checks pass.
- No dead CTA or nav link.
- All tests, type checks, lint, build, and Storybook pass.

---

## 15. Backend Deferred

This plan does not implement:

- NestJS course/section/lesson endpoints.
- Database migrations.
- Admin create/update/delete.
- Publish workflow.
- Rich-text sanitization server-side.
- YouTube URL validation server-side.
- OpenAPI regeneration for course endpoints.

Those belong to the next backend vertical slice, using the same data contract defined here.

---

## 16. Verification Commands

```bash
pnpm check-types
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm --filter web build-storybook
pnpm exec playwright test apps/web/test/e2e --workers=1
```

Expected:

- Web unit tests pass.
- API tests remain green.
- New catalog/detail E2E pass in Chromium, Firefox, and WebKit.
- Axe serious/critical = 0.
- No horizontal overflow at 390 px.
