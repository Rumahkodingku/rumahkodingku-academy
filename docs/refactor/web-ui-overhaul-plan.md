# Custom UI Overhaul — `apps/web` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Base UI and the current generic SaaS visual language with a custom, editorial, Academy-first UI system across every active route in `apps/web`.

**Architecture:** Native-first React primitives (`<dialog>`, `<button>`, `<input>`, Popover API) with small internal hooks for positioning, dismissal, focus, and typeahead. No component/UI library. Tailwind utilities, Lucide icons, `cva`, `tailwind-merge`, TanStack Query, and Motion remain. Visual language is warm paper/ink with Academy Blue as the only accent, Space Grotesk display type, Manrope body type, pill actions, 6–8 px surfaces, and hairline composition.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Motion, Vitest, Testing Library, Playwright, Storybook 10, Strapi contract + fixtures.

**Spec:** This document plus `docs/design/design-brief.md`, `docs/design/design-direction.md`, `docs/design/design-system.md`, and `docs/design/ui-ux-guidelines.md`. Where this plan conflicts with the old “Modern SaaS” direction, this plan wins.

---

## 1. Locked Decisions

| Area                | Decision                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| Brand direction     | Academy-first: paper/ink neutrals, Academy Blue `#2563EB` as the only accent                            |
| Typography          | Space Grotesk for display/headings, Manrope for body/UI, Geist Mono for code                            |
| Shape language      | Editorial flat: pill buttons, 6–8 px surfaces, hairline borders, minimal shadow                         |
| UI libraries        | None. Remove Base UI, Sonner, Uppy, and TanStack Table                                                  |
| Allowed utilities   | Tailwind CSS, Lucide, `class-variance-authority`, `tailwind-merge`, TanStack Query, `next-themes`       |
| Select and menu     | Fully custom, no native `<select>`                                                                      |
| Behavior foundation | Native HTML + Popover API + internal hooks                                                              |
| Motion              | `motion` with `LazyMotion` and reduced-motion support                                                   |
| Scope               | Every active route: marketing, auth, profile, learn, admin, system states                               |
| Auth layout         | 1:1 editorial split                                                                                     |
| Strapi              | Extend TypeScript contract, fixtures, and docs; do not create a Strapi app                              |
| Migration           | Incremental vertical slices. New component API is used immediately; no permanent compatibility wrappers |
| Storybook           | Keep and update every story                                                                             |

---

## 2. Current State

### Active routes

- `apps/web/src/app/[locale]/(marketing)/page.tsx`
- `apps/web/src/app/[locale]/(auth)/login|register|forgot-password|reset-password|verify-email`
- `apps/web/src/app/[locale]/(account)/me/page.tsx`
- `apps/web/src/app/[locale]/(learn)/learn/page.tsx`
- `apps/web/src/app/[locale]/(admin)/admin/page.tsx`
- `apps/web/src/app/[locale]/forbidden/page.tsx`
- `apps/web/src/app/[locale]/error.tsx`
- `apps/web/src/app/[locale]/not-found.tsx`
- `apps/web/src/app/[locale]/loading.tsx`
- `apps/web/src/app/global-not-found.tsx`

### Current UI dependencies

- `@base-ui/react`: used by 12 files in `apps/web/src/components/ui/`.
- `sonner`: used only by `apps/web/src/components/ui/sonner.tsx` and `providers.tsx`.
- `@uppy/*`: no production usage.
- `@tanstack/react-table`: no production usage.
- `tw-animate-css`: imported by `index.css`.
- Tests: 25 web unit/component files, 59 tests; 4 Playwright specs, 51 tests across three browsers.

### Current visual problems to remove

- Uniform white cards with 12–16 px radius.
- Large blue button fills on every screen.
- Blue used as decoration instead of a signal.
- Gradient hero backgrounds and glassy backdrop blur.
- Too many boxed surfaces, too little typographic hierarchy.
- Generic uppercase captions and icon-in-a-box patterns.
- Layouts that look like a dashboard template instead of an editorial academy.

---

## 3. Target Visual System

### 3.1 Color tokens

Light:

| Token              | Value                  | Usage                             |
| ------------------ | ---------------------- | --------------------------------- |
| `--canvas`         | `#F6F1E7`              | Page background                   |
| `--surface`        | `#FBF8F2`              | Raised quiet surface              |
| `--surface-sunken` | `#EFE9DD`              | Input wells, quiet sections       |
| `--ink`            | `#141311`              | Primary text, primary button fill |
| `--ink-muted`      | `#5C564D`              | Secondary text                    |
| `--line`           | `#DCD4C6`              | Hairline                          |
| `--line-strong`    | `#C4BAAB`              | Strong divider                    |
| `--accent`         | `#2563EB`              | Links, eyebrow, active, focus     |
| `--accent-strong`  | `#1D4ED8`              | Hover/pressed accent              |
| `--accent-soft`    | `#E7EEFF`              | Selected background               |
| `--success`        | `#2F6B4F`              | Success                           |
| `--warning`        | `#8A6412`              | Warning                           |
| `--danger`         | `#A33A2B`              | Error/destructive                 |
| `--info`           | `#2563EB`              | Info                              |
| `--overlay`        | `rgb(20 19 17 / 0.55)` | Dialog backdrop                   |

Dark:

| Token              | Value               |
| ------------------ | ------------------- |
| `--canvas`         | `#11100E`           |
| `--surface`        | `#191713`           |
| `--surface-sunken` | `#0B0A09`           |
| `--ink`            | `#F4EEE3`           |
| `--ink-muted`      | `#B9B1A4`           |
| `--line`           | `#2E2A24`           |
| `--line-strong`    | `#453F36`           |
| `--accent`         | `#7FB0FF`           |
| `--accent-strong`  | `#A9C8FF`           |
| `--accent-soft`    | `#17294A`           |
| `--success`        | `#7BC49B`           |
| `--warning`        | `#E0B85A`           |
| `--danger`         | `#F09A88`           |
| `--info`           | `#7FB0FF`           |
| `--overlay`        | `rgb(0 0 0 / 0.72)` |

Rules:

- Primary buttons use `ink` fill and `canvas` text, not blue.
- Blue is reserved for links, eyebrow labels, active navigation, focus rings, selected controls, and one full-bleed marketing CTA band.
- No decorative gradients.
- No glassmorphism.
- Shadow only on floating overlays.
- Every foreground/background pair must pass WCAG 2.2 AA contrast.

### 3.2 Typography

| Role       | Value                                                                             |
| ---------- | --------------------------------------------------------------------------------- |
| Display    | `clamp(3rem, 7vw, 7.25rem)`, line-height `0.94`, weight `600`, tracking `-0.06em` |
| H1         | `clamp(2.5rem, 4.5vw, 4.5rem)`, line-height `1`, tracking `-0.045em`              |
| H2         | `clamp(2rem, 3.4vw, 3.5rem)`, line-height `1.05`, tracking `-0.035em`             |
| H3         | `clamp(1.5rem, 2vw, 2rem)`, line-height `1.15`                                    |
| H4         | `1.25rem`, line-height `1.3`, weight `600`                                        |
| Body large | `1.125rem`, line-height `1.7`                                                     |
| Body       | `1rem`, line-height `1.65`                                                        |
| Small      | `0.875rem`, line-height `1.5`                                                     |
| Eyebrow    | `0.6875rem`, uppercase, tracking `0.16em`, weight `600`                           |
| Code       | Geist Mono, `0.875rem`, line-height `1.6`                                         |

Font loading:

- `Space_Grotesk` and `Manrope` from `next/font/google` in `apps/web/src/app/[locale]/layout.tsx`.
- Expose CSS variables `--font-display` and `--font-sans`.
- Keep `Geist_Mono` as `--font-mono`.
- Subset `latin`; use `display: "swap"`.

### 3.3 Layout and shape

- Container max width `1280px`.
- Gutters: `20px` mobile, `28px` tablet, `40px` desktop.
- 12-column grid on desktop, 8 on tablet, 4 on mobile.
- Section padding: `80px` mobile, `112px` tablet, `144px` desktop.
- Button: full pill.
- Card/panel: `6px`.
- Media: `8px`.
- Input: `6px`.
- Hairline border: `1px solid var(--line)`.
- No nested cards. Prefer sections, rows, and definition lists.

### 3.4 Motion

- Durations: `180ms` UI, `260ms` overlays, `600–800ms` marketing reveal.
- Easing: `cubic-bezier(.22,1,.36,1)`.
- Animate only `opacity` and `transform`.
- Marketing reveal and stagger use Motion.
- Component state changes use CSS transitions.
- Respect `prefers-reduced-motion`.
- Use `LazyMotion` with `domAnimation` to avoid loading the full Motion bundle.

---

## 4. Target Component Architecture

### 4.1 Folder structure

```text
apps/web/src/components/ui/
  alert.tsx
  alert-dialog.tsx
  badge.tsx
  button.tsx
  button-link.tsx
  card.tsx
  checkbox.tsx
  dialog.tsx
  empty-state.tsx
  error-state.tsx
  field.tsx
  forbidden-state.tsx
  input.tsx
  menu.tsx
  radio-group.tsx
  select.tsx
  skeleton.tsx
  switch.tsx
  table.tsx
  tabs.tsx
  textarea.tsx

apps/web/src/lib/ui/
  use-anchored-position.ts
  use-controllable-state.ts
  use-dismissable-layer.ts
  use-isomorphic-layout-effect.ts
  use-lock-scroll.ts
  use-typeahead.ts

apps/web/src/components/motion/
  motion-provider.tsx
  reveal.tsx
```

Delete:

- `apps/web/src/components/ui/dropdown-menu.tsx` (replaced by `menu.tsx`)
- `apps/web/src/components/ui/label.tsx` (folded into `field.tsx`)
- `apps/web/src/components/ui/sonner.tsx`
- old `components/ui/*` internals that reference Base UI
- `tw-animate-css` import after migration

### 4.2 Component APIs

| Component        | Public API                                                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`         | `variant: "primary" \| "secondary" \| "ghost" \| "link" \| "danger"`, `size: "sm" \| "md" \| "lg" \| "icon" \| "icon-sm"`, native button props, `loading?: boolean` |
| `ButtonLink`     | Next `Link` props plus the same visual variants and sizes                                                                                                           |
| `Badge`          | `tone: "neutral" \| "accent" \| "success" \| "warning" \| "danger"`                                                                                                 |
| `Card`           | Plain `div` wrapper with `padded?: boolean`; keep `CardHeader`, `CardContent`, `CardTitle`, `CardDescription`, `CardFooter` as plain semantic wrappers              |
| `Alert`          | `tone`, `title`, optional action, `role="alert"` for error tone                                                                                                     |
| `Field`          | Context wrapper with `FieldLabel`, `FieldControl`, `FieldDescription`, `FieldError`; generates ids and `aria-describedby`                                           |
| `Input`          | Native input props, `invalid?: boolean`                                                                                                                             |
| `Textarea`       | Native textarea props, `invalid?: boolean`                                                                                                                          |
| `Checkbox`       | Native checkbox plus label slot                                                                                                                                     |
| `RadioGroup`     | Native radio group with `options`                                                                                                                                   |
| `Switch`         | Native checkbox with `role="switch"` behavior via `aria-checked`                                                                                                    |
| `Select`         | `value`, `onValueChange`, `options`, `placeholder`, `aria-label`, `disabled`, `variant?: "popover" \| "sheet"`; custom listbox                                      |
| `Dialog`         | `open`, `defaultOpen`, `onOpenChange`, `DialogTrigger`, `DialogContent`, `DialogTitle`, `DialogDescription`, `DialogClose`                                          |
| `AlertDialog`    | Same structure with `role="alertdialog"` and no backdrop dismissal                                                                                                  |
| `Menu`           | `MenuTrigger`, `MenuContent`, `MenuItem`, `MenuSeparator`, `MenuLabel`; item supports `href` or `onSelect`                                                          |
| `Tabs`           | `value`, `defaultValue`, `onValueChange`, `TabsList`, `TabsTrigger`, `TabsPanel`                                                                                    |
| `Table`          | Semantic `table`, `thead`, `tbody`, `tr`, `th`, `td`, caption                                                                                                       |
| `Skeleton`       | Native `div` with `aria-hidden` by default                                                                                                                          |
| `EmptyState`     | `icon`, `title`, `description`, `action`                                                                                                                            |
| `ErrorState`     | `title`, `description`, `action`, optional `code`                                                                                                                   |
| `ForbiddenState` | Same as `ErrorState`, fixed 403 semantics                                                                                                                           |

### 4.3 Internal hooks

| Hook                        | Contract                                                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `useControllableState<T>`   | `{ value?, defaultValue, onChange? }` → `[T, (next: T \| ((prev: T) => T)) => void]`                       |
| `useAnchoredPosition`       | Trigger/content refs, `side`, `align`, `offset` → `{ style: CSSProperties, placement: "top" \| "bottom" }` |
| `useDismissableLayer`       | `open`, `onDismiss`, refs → attaches outside pointer, Escape, and focus-out handling                       |
| `useTypeahead`              | Items, label getter, timeout → `(key: string) => number \| null`                                           |
| `useLockScroll`             | `locked: boolean` → locks body scroll and restores on unmount                                              |
| `useIsomorphicLayoutEffect` | SSR-safe layout effect alias                                                                               |

### 4.4 Native-first behavior rules

- `Dialog` and `AlertDialog` MUST use native `<dialog>` and `showModal()`.
- `Menu` and `Select` MUST render inside the browser top layer with the Popover API.
- Toast is deferred until the first product feature needs it. Do not build an unused toast system in this refactor.
- Position floating content with `useAnchoredPosition`; no positioning library.
- Do not use native `<select>`.
- Do not create a generic headless “system” package. Hooks live in `src/lib/ui`.
- No polymorphic `asChild` API. Use explicit components (`ButtonLink`) or an `href` prop.
- No context provider unless multiple siblings need shared state (`Field`, `Tabs`, `Menu`, `Select`).
- All interactive elements must have a visible `focus-visible` state and a 44 px minimum touch target.

### 4.5 Overlay behavior requirements

`Dialog`:

- Focus moves into the dialog when opened.
- Escape closes unless `dismissible={false}`.
- Focus returns to the trigger.
- Background is inert via native modal behavior.
- Backdrop click closes only for regular dialogs.
- Title and description are wired with `aria-labelledby` and `aria-describedby`.

`Menu`:

- `role="menu"` and `role="menuitem"`.
- ArrowUp/ArrowDown cycle items.
- Home/End jump to first/last.
- Enter/Space activate.
- Escape closes and returns focus.
- Typeahead selects by visible label.
- Outside pointerdown closes.

`Select`:

- Trigger is a `button` with `aria-haspopup="listbox"` and `aria-expanded`.
- Listbox uses `role="listbox"`, options use `role="option"` and `aria-selected`.
- Focus remains on the trigger; active option uses `aria-activedescendant`.
- ArrowUp/ArrowDown/Home/End/Enter/Space/Escape/typeahead supported.
- Disabled options are skipped.
- Mobile renders a bottom-sheet listbox with the same keyboard contract.

`Tabs`:

- `role="tablist"`, `role="tab"`, `role="tabpanel"`.
- Roving tabindex.
- ArrowLeft/ArrowRight/Home/End.
- `aria-controls` and `aria-labelledby` wired.

---

## 5. File Structure

### Create

```text
apps/web/src/lib/ui/*.ts
apps/web/src/components/motion/motion-provider.tsx
apps/web/src/components/motion/reveal.tsx
apps/web/src/components/ui/menu.tsx
apps/web/src/components/marketing/*.tsx
apps/web/test/unit/lib/ui/*.test.ts
apps/web/test/unit/components/ui/menu.test.tsx
apps/web/test/e2e/theme.spec.ts
apps/web/test/e2e/accessibility.spec.ts
apps/web/test/e2e/visual.spec.ts
docs/refactor/web-ui-overhaul-plan.md
```

### Modify

```text
apps/web/src/index.css
apps/web/src/app/[locale]/layout.tsx
apps/web/src/components/providers.tsx
apps/web/src/components/ui/*.tsx
apps/web/src/components/layout/*.tsx
apps/web/src/components/account-menu.tsx
apps/web/src/components/language-switch.tsx
apps/web/src/components/mode-toggle.tsx
apps/web/src/features/auth/components/*.tsx
apps/web/src/features/auth/validation.ts (only if error keys change)
apps/web/src/strapi/content-types.ts
apps/web/src/strapi/fixtures.ts
apps/web/src/stories/*.stories.tsx
apps/web/.storybook/preview.tsx
apps/web/test/unit/components/ui/*.test.tsx
apps/web/test/unit/components/layout/public-header.test.tsx
apps/web/test/unit/strapi/content.test.ts
apps/web/test/e2e/auth-layout.spec.ts
apps/web/test/e2e/public-shell.spec.ts
apps/web/package.json
docs/design/design-system.md
docs/design/design-direction.md
docs/design/ui-ux-guidelines.md
docs/architecture/nextjs-architecture.md
docs/architecture/strapi-content-model.md
docs/development/development-roadmap.md
```

### Delete

```text
apps/web/src/components/ui/dropdown-menu.tsx
apps/web/src/components/ui/label.tsx
apps/web/src/components/ui/sonner.tsx
```

---

## 6. Global Constraints

- Use `pnpm` only.
- All web tests live under `apps/web/test/`; unit tests in `test/unit/`, E2E in `test/e2e/`, helpers in `test/helpers/`.
- No `@base-ui/react`, `sonner`, `@uppy/*`, or `@tanstack/react-table` at completion.
- No new UI/component library. Allowed additions: `motion` and `@axe-core/playwright` (dev only).
- Use semantic tokens only in components. No raw hex values outside `index.css` and Storybook preview.
- Light and dark themes are equal-quality citizens.
- WCAG 2.2 AA, full keyboard access, visible focus, 44 px touch targets.
- Modern evergreen browsers only: latest Chrome, Edge, Firefox, Safari; Playwright covers Chromium, Firefox, WebKit.
- No fake testimonials, ratings, student outcomes, stock photography, or invented numbers.
- UI copy is Indonesian by default; English locale must remain complete.
- Auth tokens never enter JavaScript-readable storage.
- Authorization uses `AuthUser.permissions`, never role-name comparisons.
- Keep the API contract, auth behavior, RBAC, and database untouched.
- Keep `apps/web/src/strapi` server-only boundary intact.
- Run `pnpm format` before commit; Husky runs commitlint.
- Commit style: Conventional Commits, one commit per task unless noted.

---

## 7. Review Focus

1. **Keyboard and screen-reader use of custom Select/Menu.** A person must be able to open, navigate, select, close, and return focus without a mouse. Tests: Task 2, Task 11.
2. **Dialog behavior in WebKit.** Escape, focus return, backdrop, scroll lock, and mobile viewport must match Chromium and Firefox. Tests: Task 5, Task 10.
3. **Theme flash and dark contrast.** First paint must not flash light theme, and every token pair must remain readable in dark mode. Tests: Task 1, Task 6, Task 14.
4. **Strapi optional-field fallback and mobile overflow.** Missing new fields must not break the landing page; 390 px layouts must never overflow. Tests: Task 7, Task 8, Task 14.
5. **Motion cost and reduced motion.** Marketing animation must not block first render or ignore `prefers-reduced-motion`. Tests: Task 1, Task 8, Task 14.

---

## 8. Implementation Tasks

### Task 0: Baseline and branch guardrails

**Files:**

- Create: `docs/refactor/web-ui-overhaul-plan.md` (this file)
- Create: `docs/design/evidence/web-ui-overhaul-baseline/`
- Read: `apps/web/package.json`, `apps/web/src/components/ui/`, `apps/web/src/app/[locale]/`

**Interfaces:**

- Consumes: current application state.
- Produces: baseline evidence and dependency inventory used by every later task.

- [ ] **Step 1: Create the working branch**

```bash
git switch -c feat/web-ui-overhaul
```

Expected: branch created from the current default branch with a clean worktree.

- [ ] **Step 2: Capture baseline screenshots**

Run the existing app and capture `/`, `/login`, `/register`, `/me`, `/learn`, `/admin` at 390, 768, 1024, and 1440 px in light and dark mode. Save under `docs/design/evidence/web-ui-overhaul-baseline/`.

Expected: 48 images, named `<route>-<theme>-<width>.jpg`.

- [ ] **Step 3: Record baseline verification**

```bash
pnpm --filter web test
pnpm exec playwright test apps/web/test/e2e --workers=1
```

Expected: 59 web tests and 51 Playwright tests pass. Record exact output in the task commit message or PR description.

- [ ] **Step 4: Inventory every UI dependency**

```bash
rg -n "@base-ui/react|sonner|@uppy|@tanstack/react-table" apps/web/src apps/web/package.json
```

Expected: Base UI appears in 12 files, Sonner in 2, Uppy/table in package only. Save the list in the task notes.

- [ ] **Step 5: Commit**

```bash
git add docs/refactor docs/design/evidence/web-ui-overhaul-baseline
git commit -m "docs(web): record UI overhaul baseline"
```

---

### Task 1: Design foundations

**Files:**

- Modify: `apps/web/src/index.css`
- Modify: `apps/web/src/app/[locale]/layout.tsx`
- Modify: `apps/web/src/components/providers.tsx`
- Create: `apps/web/src/components/motion/motion-provider.tsx`
- Create: `apps/web/src/components/motion/reveal.tsx`
- Modify: `apps/web/.storybook/preview.tsx`
- Modify: `apps/web/package.json`

**Interfaces:**

- Consumes: nothing.
- Produces: tokens `--canvas`, `--surface`, `--surface-sunken`, `--ink`, `--ink-muted`, `--line`, `--line-strong`, `--accent`, `--accent-strong`, `--accent-soft`, status tokens, font variables `--font-display`, `--font-sans`, `--font-mono`, and `<Reveal>` / `<MotionProvider>` APIs.

- [ ] **Step 1: Add Motion dependency**

```bash
pnpm --filter web add motion
```

Expected: `motion` appears in `apps/web/package.json` and the lockfile.

- [ ] **Step 2: Write the theme regression test**

Create `apps/web/test/e2e/theme.spec.ts` with assertions that:

- `/` in light mode has `html` without `dark` and body background `rgb(246, 241, 231)`.
- `/` in dark mode has `html.dark` and body background `rgb(17, 16, 14)`.
- `prefers-color-scheme: dark` with stored light preference stays light.
- No visible flash occurs after reload: capture body background immediately after DOMContentLoaded and after hydration; both must match.

Run:

```bash
pnpm exec playwright test apps/web/test/e2e/theme.spec.ts --project=chromium
```

Expected: FAIL because the new tokens are not installed.

- [ ] **Step 3: Replace tokens in `index.css`**

Replace the old primitive/semantic token block with the palette from Section 3.1. Keep Tailwind 4 `@theme inline` mapping. Add:

- `--font-display`, `--font-sans`, `--font-mono`
- `--radius-control: 6px`
- `--radius-surface: 6px`
- `--radius-media: 8px`
- `--duration-ui: 180ms`
- `--duration-overlay: 260ms`
- `--ease-out-expo: cubic-bezier(.22,1,.36,1)`

Keep legacy aliases (`--background`, `--foreground`, `--border`, `--primary`, `--surface-*`, `--text-*`) mapped to the new tokens until Task 14, so unmigrated components do not break. Remove `tw-animate-css` import only after all old animation classes are gone; for this task leave it if old components still use it.

- [ ] **Step 4: Install fonts**

In `apps/web/src/app/[locale]/layout.tsx`:

- Replace `Geist` with `Space_Grotesk` and `Manrope`.
- Keep `Geist_Mono`.
- Apply all three variable classes to `<body>`.
- Update Storybook preview wrapper to `bg-canvas text-ink`.

- [ ] **Step 5: Add Motion provider**

Create `motion-provider.tsx`:

```ts
export function MotionProvider({ children }: { children: ReactNode }): ReactNode;
```

Implementation requirements:

- Client component.
- `LazyMotion` with `domAnimation`.
- `MotionConfig reducedMotion="user"`.

Create `reveal.tsx`:

```ts
export function Reveal({
  children,
  delay,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}): ReactNode;
```

Rules: opacity + translateY only, 600–800 ms, respects reduced motion.

- [ ] **Step 6: Wire provider**

Wrap the app in `Providers` with `MotionProvider` outside `PostHogProvider` so marketing reveals work.

- [ ] **Step 7: Run the failing test again**

```bash
pnpm exec playwright test apps/web/test/e2e/theme.spec.ts --project=chromium
```

Expected: PASS.

- [ ] **Step 8: Verify typecheck and build**

```bash
pnpm --filter web check-types
pnpm --filter web build
pnpm --filter web build-storybook
```

Expected: all pass.

- [ ] **Step 9: Commit**

```bash
git add apps/web/src/index.css apps/web/src/app apps/web/src/components/providers.tsx apps/web/src/components/motion apps/web/.storybook apps/web/package.json pnpm-lock.yaml apps/web/test/e2e/theme.spec.ts
git commit -m "feat(web): add editorial design foundations"
```

---

### Task 2: Internal UI hooks

**Files:**

- Create: `apps/web/src/lib/ui/use-controllable-state.ts`
- Create: `apps/web/src/lib/ui/use-anchored-position.ts`
- Create: `apps/web/src/lib/ui/use-dismissable-layer.ts`
- Create: `apps/web/src/lib/ui/use-typeahead.ts`
- Create: `apps/web/src/lib/ui/use-lock-scroll.ts`
- Create: `apps/web/src/lib/ui/use-isomorphic-layout-effect.ts`
- Create: `apps/web/test/unit/lib/ui/*.test.ts`

**Interfaces:**

- Consumes: React 19.
- Produces: hooks defined in Section 4.3.

- [ ] **Step 1: Write failing hook tests**

Each test file must cover:

- `useControllableState`: uncontrolled default, controlled value, updater function.
- `useAnchoredPosition`: below placement, flip above near viewport bottom, horizontal clamp.
- `useDismissableLayer`: outside pointerdown, Escape, inside click does not dismiss.
- `useTypeahead`: single-character match, repeated characters cycle, timeout reset.
- `useLockScroll`: body overflow hidden while locked, restored after unlock.

Run:

```bash
pnpm --filter web test -- test/unit/lib/ui
```

Expected: FAIL with missing modules.

- [ ] **Step 2: Implement `useControllableState`**

Signature:

```ts
export function useControllableState<T>(options: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (next: T | ((prev: T) => T)) => void];
```

- [ ] **Step 3: Implement `useIsomorphicLayoutEffect` and `useLockScroll`**

`useLockScroll` must preserve the previous `document.body.style.overflow` and restore it on cleanup.

- [ ] **Step 4: Implement `useAnchoredPosition`**

Requirements:

- Reads trigger and content rects.
- Supports `side: "top" | "bottom"` and `align: "start" | "center" | "end"`.
- Flips when the preferred side lacks space.
- Clamps horizontally to an 8 px viewport margin.
- Recalculates on resize and scroll while open.
- Returns fixed-position `top`/`left` styles.

- [ ] **Step 5: Implement `useDismissableLayer` and `useTypeahead`**

`useDismissableLayer` attaches listeners only while open and removes them on cleanup. `useTypeahead` is a pure function factory so it can be unit tested without DOM.

- [ ] **Step 6: Run hook tests**

```bash
pnpm --filter web test -- test/unit/lib/ui
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/lib/ui apps/web/test/unit/lib/ui
git commit -m "feat(web): add native UI behavior hooks"
```

---

### Task 3: Core actions and identity primitives

**Files:**

- Modify: `apps/web/src/components/ui/button.tsx`
- Modify: `apps/web/src/components/ui/button-link.tsx`
- Modify: `apps/web/src/components/ui/badge.tsx`
- Modify: `apps/web/test/unit/components/ui/button.test.tsx`
- Modify: `apps/web/test/unit/components/ui/button-link.test.tsx`
- Modify: `apps/web/test/unit/components/ui/badge.test.tsx`
- Modify: `apps/web/src/stories/Button.stories.tsx`
- Modify: `apps/web/src/stories/Badge.stories.tsx`

**Interfaces:**

- Consumes: tokens from Task 1.
- Produces: `Button`, `ButtonLink`, `Badge` APIs from Section 4.2.

- [ ] **Step 1: Write failing tests**

Assertions:

- `Button` renders a native `<button>`.
- `loading` sets `disabled` and `aria-busy="true"`.
- Loading spinner is `aria-hidden`.
- `variant="primary"` uses ink fill, not blue.
- `ButtonLink` renders an anchor and preserves `href`.
- `Badge` renders text with tone classes and no hardcoded hex.

Run:

```bash
pnpm --filter web test -- test/unit/components/ui/button.test.tsx test/unit/components/ui/button-link.test.tsx test/unit/components/ui/badge.test.tsx
```

Expected: FAIL against old API/styles.

- [ ] **Step 2: Implement Button and ButtonLink**

Requirements:

- No Base UI import.
- Native `button` and Next `Link`.
- `cva` variants: primary, secondary, ghost, link, danger.
- Sizes: sm, md, lg, icon.
- Primary = ink fill/canvas text; secondary = transparent with hairline; ghost = no border; link = accent text.
- Minimum height: sm 36 px, md 44 px, lg 52 px, icon 44 px.
- Icon-only buttons require `aria-label`; TypeScript cannot enforce this, so tests cover examples.

- [ ] **Step 3: Implement Badge**

Tone mapping uses semantic tokens only. Radius is pill. No icon-in-box pattern.

- [ ] **Step 4: Update consumers of Button, ButtonLink, and Badge**

Run:

```bash
rg -l "components/ui/(button|button-link|badge)" apps/web/src
```

Apply the rename map everywhere:

- `variant="default"` → no variant or `variant="primary"`
- `variant="outline"` → `variant="secondary"`
- `variant="destructive"` → `variant="danger"`
- `size="default"` → no size or `size="md"`
- Badge `variant` → `tone`

Keep visual redesign for later tasks, but the app must compile and all existing tests must pass after this step.

- [ ] **Step 5: Run tests and typecheck**

```bash
pnpm --filter web test -- test/unit/components/ui
pnpm --filter web check-types
```

Expected: PASS. If old consumers break, fix them in this task rather than adding compatibility wrappers.

- [ ] **Step 6: Update Storybook stories**

Stories: Primary, Secondary, Ghost, Link, Danger, Loading, Disabled, Icon, Sizes, Badge tones.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/components/ui apps/web/src/stories apps/web/test/unit/components/ui
git commit -m "feat(web): replace action primitives with custom editorial UI"
```

---

### Task 4: Surfaces, feedback, and layout primitives

**Files:**

- Modify: `apps/web/src/components/ui/card.tsx`
- Modify: `apps/web/src/components/ui/alert.tsx`
- Modify: `apps/web/src/components/ui/skeleton.tsx`
- Modify: `apps/web/src/components/ui/empty-state.tsx`
- Modify: `apps/web/src/components/ui/error-state.tsx`
- Modify: `apps/web/src/components/ui/forbidden-state.tsx`
- Modify: `apps/web/src/components/layout/container.tsx`
- Modify: `apps/web/src/components/layout/section.tsx`
- Modify: `apps/web/test/unit/components/ui/*.test.tsx`
- Modify: `apps/web/src/stories/*.stories.tsx`

**Interfaces:**

- Consumes: tokens and Button.
- Produces: surface/feedback APIs from Section 4.2.

- [ ] **Step 1: Write failing tests**

Assertions:

- Card uses `rounded-[6px]`, hairline border, no shadow.
- Alert error tone has `role="alert"`; success tone has `role="status"`.
- Skeleton has `aria-hidden="true"` by default and accepts `aria-label`.
- EmptyState renders a heading, description, and one action.
- ErrorState and ForbiddenState render the correct status code.
- Container applies max width and gutters; Section applies responsive vertical rhythm.

Run:

```bash
pnpm --filter web test -- test/unit/components/ui/alert.test.tsx test/unit/components/ui/empty-state.test.tsx
```

Expected: FAIL against old styles/APIs.

- [ ] **Step 2: Implement Card and Alert**

Card is a simple bordered surface with optional padding. Alert is a text-forward block with a hairline accent; no icon-in-colored-box unless the icon carries meaning.

- [ ] **Step 3: Implement Skeleton and state components**

EmptyState, ErrorState, and ForbiddenState use editorial typography: eyebrow/status code, large title, short body, one or two actions.

- [ ] **Step 4: Implement Container and Section**

Container max width `1280px`; gutters 20/28/40. Section padding 80/112/144. Both accept `className` and native props.

- [ ] **Step 4b: Update Alert consumers**

Run:

```bash
rg -l "components/ui/alert" apps/web/src
```

Rename `variant` to `tone` and map old values exactly:

- `danger` → `danger`
- `success` → `success`
- `warning` → `warning`
- `info` → `info`

- [ ] **Step 5: Run tests and update stories**

```bash
pnpm --filter web test -- test/unit/components/ui
pnpm --filter web check-types
```

Update stories for all variants and light/dark.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/ui apps/web/src/components/layout apps/web/src/stories apps/web/test/unit/components/ui
git commit -m "feat(web): add editorial surfaces and feedback primitives"
```

---

### Task 5: Dialog, AlertDialog, Menu, and shell menus

**Files:**

- Modify: `apps/web/src/components/ui/dialog.tsx`
- Modify: `apps/web/src/components/ui/alert-dialog.tsx`
- Create: `apps/web/src/components/ui/menu.tsx`
- Modify: `apps/web/src/components/layout/public-header.tsx`
- Modify: `apps/web/src/components/account-menu.tsx`
- Modify: `apps/web/src/components/language-switch.tsx`
- Modify: `apps/web/src/components/mode-toggle.tsx`
- Modify: `apps/web/src/components/providers.tsx`
- Delete: `apps/web/src/components/ui/dropdown-menu.tsx`
- Delete: `apps/web/src/components/ui/sonner.tsx`
- Modify: `apps/web/test/unit/components/ui/dialog.test.tsx`
- Create: `apps/web/test/unit/components/ui/menu.test.tsx`
- Modify: `apps/web/src/stories/Dialog.stories.tsx`
- Modify: `apps/web/test/unit/components/layout/public-header.test.tsx`

**Interfaces:**

- Consumes: hooks from Task 2, tokens, Button.
- Produces: Dialog/Menu APIs from Section 4.2. Header, language, theme, and account menus use them.

- [ ] **Step 1: Write failing tests**

Dialog tests:

- opens with `showModal`.
- Escape closes and returns focus.
- backdrop click closes when `dismissible`.
- alert dialog does not close on backdrop click.

Menu tests:

- opens on click.
- ArrowDown focuses next item.
- Home/End behavior.
- Enter activates `onSelect`.
- Escape closes and returns focus.
- outside pointerdown closes.
- typeahead selects by label.

Add jsdom-safe mocks in `apps/web/vitest.setup.ts` for `HTMLDialogElement.prototype.showModal/close` and `HTMLElement.prototype.showPopover/hidePopover` if the environment does not implement them. Tests must still assert the native methods were called.

Run:

```bash
pnpm --filter web test -- test/unit/components/ui/dialog.test.tsx test/unit/components/ui/menu.test.tsx
```

Expected: FAIL.

- [ ] **Step 2: Implement Dialog**

Requirements:

- Native `<dialog>`.
- `showModal()` on open, `close()` on close.
- `onClose` maps to `onOpenChange(false)`.
- Focus returns to the previously focused element.
- Title/description ids wired automatically.
- `size: "sm" | "md" | "lg" | "full"`.
- `variant: "center" | "sheet"` for mobile menu.

- [ ] **Step 3: Implement AlertDialog**

Reuse Dialog internals with `role="alertdialog"`, `dismissible={false}`, and explicit cancel/confirm actions.

- [ ] **Step 4: Implement Menu**

Use a button trigger plus Popover API content. Use `useAnchoredPosition`, `useDismissableLayer`, `useTypeahead`. Focus moves into the menu on open.

- [ ] **Step 5: Migrate shell menus**

- `account-menu.tsx`: profile, admin, logout. Use `MenuItem href` for links and `onSelect` for logout.
- `language-switch.tsx`: locale switching.
- `mode-toggle.tsx`: light/dark/system.
- `public-header.tsx`: mobile navigation uses `Dialog variant="sheet"`; remove Sonner/Toaster from providers.

- [ ] **Step 6: Update Dialog stories and remove Base UI/Sonner from touched files**

Update `Dialog.stories.tsx` to the new `DialogTrigger` and `DialogContent` API before running typecheck.

```bash
rg -n "@base-ui/react|sonner" apps/web/src/components apps/web/src/components/providers.tsx
```

Expected: no matches in migrated files. Remaining old files may still exist until their task.

- [ ] **Step 7: Run tests and keyboard E2E**

```bash
pnpm --filter web test -- test/unit/components/ui test/unit/components/layout
pnpm exec playwright test apps/web/test/e2e/public-shell.spec.ts --project=chromium
pnpm exec playwright test apps/web/test/e2e/public-shell.spec.ts --project=firefox
pnpm exec playwright test apps/web/test/e2e/public-shell.spec.ts --project=webkit
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/components apps/web/test/unit/components apps/web/test/e2e
git commit -m "feat(web): replace overlays and shell menus with native-first UI"
```

---

### Task 6: Public shell redesign

**Files:**

- Modify: `apps/web/src/components/layout/public-header.tsx`
- Modify: `apps/web/src/components/layout/public-footer.tsx`
- Modify: `apps/web/src/components/layout/app-shell.tsx`
- Modify: `apps/web/src/components/layout/container.tsx`
- Modify: `apps/web/src/components/layout/section.tsx`
- Modify: `apps/web/src/components/brand/brand-logo.tsx`
- Modify: `apps/web/test/unit/components/layout/public-header.test.tsx`
- Modify: `apps/web/test/e2e/public-shell.spec.ts`

**Interfaces:**

- Consumes: Button, Badge, Menu, Dialog, Container, Section.
- Produces: final public chrome used by all pages.

- [ ] **Step 1: Write failing shell tests**

Assertions:

- Header is sticky with a hairline bottom border and no backdrop blur.
- Brand link has accessible name `RumahKodingku Academy`.
- Desktop nav uses text links, not pill boxes.
- Mobile menu opens as a full-height sheet.
- Mobile guest menu includes sign-in and register.
- Footer uses ink background and paper text.
- No horizontal overflow at 390 px.

Run:

```bash
pnpm --filter web test -- test/unit/components/layout/public-header.test.tsx
pnpm exec playwright test apps/web/test/e2e/public-shell.spec.ts --project=chromium
```

Expected: FAIL against old visual structure.

- [ ] **Step 2: Redesign header**

- Height 72 px.
- Solid `canvas` background; dark mode `canvas`.
- Brand left, nav center-left, controls right.
- Nav links: Manrope 14 px, muted, active accent underline or dot.
- Icon buttons: 44 px circular ghost buttons.
- Mobile menu: full-height sheet with large nav type, account actions, and theme/language.

- [ ] **Step 3: Redesign footer**

- Ink background, paper text.
- Large statement headline.
- Three columns: brand/description, navigation, account/legal.
- Hairline separators.
- Tagline as small eyebrow, not decorative track.

- [ ] **Step 4: Update BrandLogo**

Keep official mark. Use wordmark hierarchy. Do not recolor the mark. Adjust sizes for header/footer only.

- [ ] **Step 5: Run tests**

```bash
pnpm --filter web test -- test/unit/components/layout
pnpm exec playwright test apps/web/test/e2e/public-shell.spec.ts --workers=1
```

Expected: PASS in all three browsers.

- [ ] **Step 6: Capture shell screenshots**

Save 390/768/1024/1440 light/dark under `docs/design/evidence/web-ui-overhaul/shell/`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/components apps/web/test/unit/components/layout apps/web/test/e2e/public-shell.spec.ts docs/design/evidence/web-ui-overhaul
git commit -m "feat(web): rebuild public shell with editorial navigation"
```

---

### Task 7: Strapi contract extension

**Files:**

- Modify: `apps/web/src/strapi/content-types.ts`
- Modify: `apps/web/src/strapi/fixtures.ts`
- Modify: `apps/web/test/unit/strapi/content.test.ts`
- Modify: `docs/architecture/strapi-content-model.md`

**Interfaces:**

- Consumes: existing `HomepageContent`, `MarketingLink`, `MarketingFeature`, `MarketingStep`, `StrapiMedia`.
- Produces: optional `statement`, `proof`, `cta`, `hero.artifact`, and `hero.note` fields from Section 5 of the plan discussion.

- [ ] **Step 1: Write failing contract tests**

Assertions:

- `homepageFixtures.id` and `homepageFixtures.en` include `statement`, `proof`, and `cta`.
- `hero.artifact` is optional and accepts `{ media, caption? }`.
- Existing required fields remain valid.
- A fixture missing optional fields still satisfies `HomepageContent`.

Run:

```bash
pnpm --filter web test -- test/unit/strapi/content.test.ts
```

Expected: FAIL because the fields do not exist.

- [ ] **Step 2: Extend `HomepageContent`**

Add the optional fields exactly as defined in Section 5 of the plan discussion. Keep `features` and `steps` required for backward compatibility.

- [ ] **Step 3: Update fixtures**

Add Indonesian and English content for:

- `statement`: editorial “why Academy exists” copy.
- `proof`: certificate and project proof explanation; no fake numbers.
- `cta`: course/program CTA.
- `hero.note`: small factual note.
- `hero.artifact`: omit media until real screenshot assets exist; use typographic fallback.

- [ ] **Step 4: Update docs**

Add the new fields to `docs/architecture/strapi-content-model.md` with type, required/optional, and locale rules.

- [ ] **Step 5: Run tests**

```bash
pnpm --filter web test -- test/unit/strapi/content.test.ts
pnpm --filter web check-types
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/strapi apps/web/test/unit/strapi docs/architecture/strapi-content-model.md
git commit -m "feat(web): extend marketing content contract"
```

---

### Task 8: Marketing page and system states

**Files:**

- Modify: `apps/web/src/app/[locale]/(marketing)/page.tsx`
- Modify: `playwright.config.ts`
- Create: `apps/web/src/components/marketing/hero.tsx`
- Create: `apps/web/src/components/marketing/statement.tsx`
- Create: `apps/web/src/components/marketing/program-list.tsx`
- Create: `apps/web/src/components/marketing/learning-steps.tsx`
- Create: `apps/web/src/components/marketing/proof-section.tsx`
- Create: `apps/web/src/components/marketing/cta-band.tsx`
- Create: `apps/web/src/components/marketing/ticker.tsx`
- Modify: `apps/web/src/app/[locale]/loading.tsx`
- Modify: `apps/web/src/app/[locale]/error.tsx`
- Modify: `apps/web/src/app/[locale]/not-found.tsx`
- Modify: `apps/web/src/app/[locale]/forbidden/page.tsx`
- Modify: `apps/web/src/app/global-not-found.tsx`
- Modify: `apps/web/test/e2e/public-shell.spec.ts`
- Create: `apps/web/test/e2e/visual.spec.ts`

**Interfaces:**

- Consumes: Task 7 content, Task 3/4 primitives, Task 6 shell, Motion.
- Produces: final marketing surface and system states.

- [ ] **Step 1: Write failing visual and content tests**

Assertions:

- Home renders the hero title from `getHomepage(locale)`.
- Ticker contains `COURSE`, `PROJECT`, `CERTIFICATE`.
- Program section uses rows with headings, not a three-card grid.
- Missing `statement`, `proof`, and `cta` does not crash.
- `/404` and `/forbidden` use the new status typography.
- No horizontal overflow at 390 px.
- Reduced-motion disables reveal transforms.

Run:

```bash
pnpm exec playwright test apps/web/test/e2e/public-shell.spec.ts apps/web/test/e2e/visual.spec.ts --project=chromium
```

Expected: FAIL.

- [ ] **Step 2: Build marketing sections**

Hero:

- Left: eyebrow, display headline with one accent word, description, two pill CTAs, factual note.
- Right: artifact panel. If `hero.artifact.media` exists, render the image. Otherwise render a typographic “learning artifact” block using real copy/code, not a fake screenshot.

Statement:

- Large two-column text block with eyebrow and hairline.

Program list:

- Numbered rows with title, description, and arrow. No cards.

Learning steps:

- Three large numbered rows with hairline separators.

Proof:

- Dark section with certificate verification explanation and a document-like artifact.

CTA band:

- Accent background, paper text, large headline, ink pill action.

Ticker:

- Thin accent line with uppercase program words. No lime.

- [ ] **Step 3: Redesign system states**

- Loading: editorial skeleton matching hero typography, not generic card blocks.
- Error: large `500`-style code, short message, one retry.
- Not found: large `404`, one home action.
- Forbidden: large `403`, one home/profile action.

- [ ] **Step 4: Add visual tests**

`visual.spec.ts` captures home at 390/768/1024/1440 light/dark. Use `toHaveScreenshot` only for Chromium; other browsers use layout assertions and manual evidence. Configure `expect.toHaveScreenshot` in `playwright.config.ts` with `animations: "disabled"`, `caret: "hide"`, and a small max-diff ratio. Wait for fonts with `document.fonts.ready` before capture.

- [ ] **Step 5: Run tests**

```bash
pnpm --filter web test
pnpm exec playwright test apps/web/test/e2e/public-shell.spec.ts apps/web/test/e2e/visual.spec.ts --project=chromium --workers=1
```

Expected: PASS.

- [ ] **Step 6: Capture evidence**

Save home screenshots under `docs/design/evidence/web-ui-overhaul/marketing/`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/app apps/web/src/components/marketing apps/web/test docs/design/evidence/web-ui-overhaul
git commit -m "feat(web): redesign marketing page with editorial composition"
```

---

### Task 9: Form primitives

**Files:**

- Modify: `apps/web/src/components/ui/field.tsx`
- Modify: `apps/web/src/components/ui/input.tsx`
- Modify: `apps/web/src/components/ui/textarea.tsx`
- Modify: `apps/web/src/components/ui/checkbox.tsx`
- Modify: `apps/web/src/components/ui/radio-group.tsx`
- Modify: `apps/web/src/components/ui/switch.tsx`
- Modify: `apps/web/test/unit/components/ui/field.test.tsx`
- Modify: `apps/web/test/unit/components/ui/switch.test.tsx`
- Modify: `apps/web/src/stories/Fields.stories.tsx`

**Interfaces:**

- Consumes: tokens and `useControllableState`.
- Produces: Field/Input/Textarea/Checkbox/RadioGroup/Switch APIs from Section 4.2.

- [ ] **Step 1: Write failing form tests**

Assertions:

- Field generates a label id and links control, description, and error.
- Invalid field sets `aria-invalid="true"`.
- Error has `role="alert"`.
- Input and textarea render native controls.
- Switch toggles with Space, exposes `role="switch"` and `aria-checked`. Enter must not toggle it.
- Checkbox uses native checked state.
- RadioGroup supports arrow keys through native radios.
- Disabled styles prevent interaction.

Run:

```bash
pnpm --filter web test -- test/unit/components/ui/field.test.tsx test/unit/components/ui/switch.test.tsx
```

Expected: FAIL.

- [ ] **Step 2: Implement Field**

Use React context and `useId`. API:

```tsx
<Field invalid={Boolean(error)}>
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <Input />
  </FieldControl>
  <FieldDescription>...</FieldDescription>
  <FieldError>...</FieldError>
</Field>
```

If no `FieldControl` is used, `Field` must still pass ids through context.

- [ ] **Step 3: Implement native form controls**

Input/Textarea: 48 px control height, 6 px radius, hairline border, accent focus ring, invalid border. No Base UI.

Checkbox/Radio: real inputs with custom indicator via CSS.

Switch: native checkbox visually hidden, custom track/thumb, `role="switch"` and `aria-checked`.

- [ ] **Step 4: Update stories**

Stories: Default, With description, Error, Disabled, Checkbox, Radio, Switch, Light/Dark.

- [ ] **Step 5: Run tests and typecheck**

```bash
pnpm --filter web test -- test/unit/components/ui
pnpm --filter web check-types
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/ui apps/web/src/stories apps/web/test/unit/components/ui
git commit -m "feat(web): replace form primitives with native controls"
```

---

### Task 10: Auth screens

**Files:**

- Modify: `apps/web/src/app/[locale]/(auth)/layout.tsx`
- Modify: `apps/web/src/features/auth/components/auth-split-layout.tsx`
- Modify: `apps/web/src/features/auth/components/auth-brand-panel.tsx`
- Modify: `apps/web/src/features/auth/components/auth-form-panel.tsx`
- Modify: `apps/web/src/features/auth/components/login-form.tsx`
- Modify: `apps/web/src/features/auth/components/register-form.tsx`
- Modify: `apps/web/src/features/auth/components/forgot-password-form.tsx`
- Modify: `apps/web/src/features/auth/components/reset-password-form.tsx`
- Modify: `apps/web/src/features/auth/components/verify-email-panel.tsx`
- Modify: `apps/web/src/features/auth/components/password-field.tsx`
- Modify: `apps/web/src/features/auth/components/form-error.tsx`
- Modify: `apps/web/src/features/auth/components/verification-banner.tsx`
- Modify: `apps/web/test/e2e/auth-layout.spec.ts`
- Modify: `apps/web/test/e2e/auth.spec.ts`
- Modify: `apps/web/test/unit/features/auth/components/password-field.test.tsx`
- Modify: `apps/web/test/unit/features/auth/components/form-error.test.tsx`

**Interfaces:**

- Consumes: Field/Input/Alert/Button, Motion, shell tokens.
- Produces: 1:1 editorial auth experience.

- [ ] **Step 1: Update failing layout tests**

Change the expected auth grid to 1:1 at ≥1024 px, stacked below 1024. Assert no horizontal overflow at 390/768/1024/1440.

Run:

```bash
pnpm exec playwright test apps/web/test/e2e/auth-layout.spec.ts --project=chromium
```

Expected: FAIL against 7:3/6:4.

- [ ] **Step 2: Rebuild auth layout**

- 1:1 grid at ≥1024: `grid-cols-[minmax(0,1fr)_minmax(0,1fr)]`.
- Left panel: paper background, logo, eyebrow, display statement, one factual proof line, artifact.
- Right panel: form column max width 420 px, no card container.
- Top-right controls: language/theme.
- Mobile: compact brand strip, then form.
- Remove grid pattern, radial glow, rounded card, and uppercase pill badge.

- [ ] **Step 3: Restyle forms**

- Labels 12 px uppercase or 14 px medium; choose one system and use consistently.
- Inputs 48 px.
- Submit button ink pill, full width.
- Link actions accent.
- Alert uses flat hairline, not colored box.
- Password visibility uses a 44 px icon button.
- Error and loading states keep existing behavior.

- [ ] **Step 4: Update auth E2E**

Keep all existing auth scenarios. Update only selectors and layout assertions. Do not weaken auth, refresh, logout, unverified, or forbidden coverage.

- [ ] **Step 5: Run tests**

```bash
pnpm --filter web test -- test/unit/features/auth
pnpm exec playwright test apps/web/test/e2e/auth-layout.spec.ts apps/web/test/e2e/auth.spec.ts apps/web/test/e2e/auth-proxy.spec.ts --workers=1
```

Expected: PASS in Chromium, Firefox, WebKit.

- [ ] **Step 6: Capture evidence**

Save login/register at 390/768/1024/1440 light/dark under `docs/design/evidence/web-ui-overhaul/auth/`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/app apps/web/src/features/auth apps/web/test docs/design/evidence/web-ui-overhaul
git commit -m "feat(web): redesign auth screens with editorial split"
```

---

### Task 11: Custom Select and profile page

**Files:**

- Modify: `apps/web/src/components/ui/select.tsx`
- Create: `apps/web/test/unit/components/ui/select.test.tsx` (replace old test)
- Modify: `apps/web/src/features/auth/components/profile-form.tsx`
- Modify: `apps/web/src/features/auth/components/avatar-upload.tsx`
- Modify: `apps/web/src/app/[locale]/(account)/me/page.tsx`
- Modify: `apps/web/test/e2e/auth.spec.ts`
- Modify: `apps/web/src/stories/Select.stories.tsx`

**Interfaces:**

- Consumes: hooks, Field, Button, tokens.
- Produces: custom Select and editorial profile layout.

- [ ] **Step 1: Write failing Select tests**

Assertions:

- Trigger has `aria-haspopup="listbox"`, `aria-expanded`.
- Opening shows `role="listbox"`.
- ArrowDown changes `aria-activedescendant`.
- Enter selects and closes.
- Escape closes and restores focus.
- Disabled options are skipped.
- Typeahead matches labels.
- Outside click closes.

Run:

```bash
pnpm --filter web test -- test/unit/components/ui/select.test.tsx
```

Expected: FAIL.

- [ ] **Step 2: Implement Select**

- Trigger button, full-width.
- Popover API top layer.
- `useAnchoredPosition` for fixed placement.
- Listbox with `aria-activedescendant`; focus stays on trigger.
- Mobile bottom sheet via `variant="sheet"` when viewport < 768.
- Selected option uses accent text and check icon, not a filled blue row.

- [ ] **Step 3: Redesign profile page**

- Header: eyebrow, large name/title, short description, avatar.
- Sections separated by hairline: identity, about, contact, links, preferences.
- Two-column field grid on desktop; single column mobile.
- Side aside: account status as definition list.
- Remove card grid and permission string as raw text; show “Learner” unless admin permission exists.

- [ ] **Step 4: Update avatar upload**

- 96 px avatar, 8 px radius.
- Buttons: ink primary, ghost remove.
- Keep type/size validation and owner-only behavior.
- Keep `?v=` cache bust.

- [ ] **Step 5: Run tests**

```bash
pnpm --filter web test -- test/unit/components/ui/select.test.tsx test/unit/features/auth
pnpm exec playwright test apps/web/test/e2e/auth.spec.ts --workers=1
```

Expected: PASS.

- [ ] **Step 6: Capture evidence**

Save `/me` 390/768/1024/1440 light/dark under `docs/design/evidence/web-ui-overhaul/profile/`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/components/ui/select.tsx apps/web/src/features/auth apps/web/src/app apps/web/test docs/design/evidence/web-ui-overhaul
git commit -m "feat(web): add custom select and editorial profile"
```

---

### Task 12: Learn, admin, Tabs, and Table

**Files:**

- Modify: `apps/web/src/app/[locale]/(learn)/learn/page.tsx`
- Modify: `apps/web/src/app/[locale]/(admin)/admin/page.tsx`
- Modify: `apps/web/src/components/ui/tabs.tsx`
- Modify: `apps/web/src/components/ui/table.tsx`
- Modify: `apps/web/test/unit/components/ui/tabs.test.tsx`
- Modify: `apps/web/test/unit/components/ui/table.test.tsx`
- Modify: `apps/web/src/stories/Tabs.stories.tsx`
- Modify: `apps/web/src/stories/Table.stories.tsx`

**Interfaces:**

- Consumes: all primitives.
- Produces: final placeholder routes and remaining primitives.

- [ ] **Step 1: Write failing Tabs/Table tests**

Tabs:

- ArrowRight/ArrowLeft move active tab.
- Home/End jump.
- `aria-selected`, `aria-controls`, `aria-labelledby` correct.
- Panels hide when inactive.

Table:

- Semantic table structure.
- Caption and header cells.
- Responsive wrapper allows horizontal scroll without page overflow.

Run:

```bash
pnpm --filter web test -- test/unit/components/ui/tabs.test.tsx test/unit/components/ui/table.test.tsx
```

Expected: FAIL.

- [ ] **Step 2: Implement Tabs and Table**

Tabs use roving tabindex and semantic roles. Table is plain semantic markup with editorial borders.

- [ ] **Step 3: Redesign /learn**

- Large greeting with display type.
- Two-column spread: “Mulai dari katalog” and “Lengkapi profil” as text rows, not cards.
- Empty state for active courses with a clear catalog action.
- No fake progress, course count, or certificate data.

- [ ] **Step 4: Redesign /admin**

- Editorial admin header with permission badge.
- Module list as rows/table: Konten kursus, Proyek peserta, Akses dan peran.
- Status column shows “Belum tersedia”.
- No fake metrics.

- [ ] **Step 5: Run tests**

```bash
pnpm --filter web test -- test/unit/components/ui
pnpm exec playwright test apps/web/test/e2e --project=chromium --workers=1
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/app apps/web/src/components/ui apps/web/src/stories apps/web/test
git commit -m "feat(web): redesign learner and admin placeholders"
```

---

### Task 13: Storybook refresh

**Files:**

- Modify: `apps/web/.storybook/preview.tsx`
- Modify: every `apps/web/src/stories/*.stories.tsx`
- Delete: stories for removed components.
- Create: `apps/web/src/stories/Menu.stories.tsx`
- Create: `apps/web/src/stories/ProfilePreview.stories.tsx` if needed for composition review.

**Interfaces:**

- Consumes: all final components.
- Produces: a complete component workshop.

- [ ] **Step 1: Update preview**

- Background `bg-canvas`.
- Text `text-ink`.
- Theme toolbar remains.
- Add viewport presets: mobile 390, tablet 768, desktop 1440.
- Add `parameters.layout = "fullscreen"`.

- [ ] **Step 2: Update stories**

Every component gets:

- Default
- All variants/sizes
- Disabled/loading/error where relevant
- Light and dark via toolbar

Interaction states must be visible in stories, not only in tests.

- [ ] **Step 3: Build Storybook**

```bash
pnpm --filter web build-storybook
```

Expected: PASS with no missing imports.

- [ ] **Step 4: Commit**

```bash
git add apps/web/.storybook apps/web/src/stories
git commit -m "docs(web): refresh Storybook for custom UI system"
```

---

### Task 14: Dependency cleanup and documentation

**Files:**

- Modify: `apps/web/package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `apps/web/src/index.css`
- Modify: `apps/web/src/components/providers.tsx`
- Modify: `docs/design/design-system.md`
- Modify: `docs/design/design-direction.md`
- Modify: `docs/design/ui-ux-guidelines.md`
- Modify: `docs/architecture/nextjs-architecture.md`
- Modify: `docs/development/development-roadmap.md`
- Modify: `AGENTS.md` if commands or architecture change

**Interfaces:**

- Consumes: all migrated components.
- Produces: clean dependency graph and final docs.

- [ ] **Step 1: Remove dependencies**

```bash
pnpm --filter web remove @base-ui/react sonner @uppy/core @uppy/dashboard @uppy/drag-drop @uppy/progress-bar @uppy/react @uppy/tus @uppy/xhr-upload @tanstack/react-table
```

If `tw-animate-css` has no remaining class usage, remove it and its import:

```bash
rg -n "animate-in|animate-out|fade-in|fade-out|zoom-in|zoom-out|slide-in|slide-out" apps/web/src
pnpm --filter web remove tw-animate-css
```

- [ ] **Step 2: Verify zero stale references**

```bash
rg -n "@base-ui/react|sonner|@uppy|@tanstack/react-table|dropdown-menu|ui/label" apps/web/src apps/web/package.json
```

Expected: no matches.

- [ ] **Step 3: Remove dead files**

Delete `dropdown-menu.tsx`, `label.tsx`, `sonner.tsx`, and any unused old token/keyframe blocks. Run `rg` for every deleted export before removing it.

- [ ] **Step 4: Update design docs**

- `design-direction.md`: replace “Modern SaaS Learning Platform + Expressive Character” with “Editorial Academy: paper/ink, Academy Blue signal, Space Grotesk/Manrope”.
- `design-system.md`: replace token tables, type scale, radius, shadow, motion, and component rules.
- `ui-ux-guidelines.md`: update auth layout to 1:1, public shell, profile, empty states, and overlay keyboard rules.
- `nextjs-architecture.md`: record no-UI-library decision and native-first primitives.
- `development-roadmap.md`: add UI overhaul completion status and evidence.

- [ ] **Step 5: Update `AGENTS.md`**

Only if commands, folders, or architectural rules changed. Keep it accurate and short.

- [ ] **Step 6: Run full checks**

```bash
pnpm format
pnpm format:check
pnpm lint
pnpm check-types
pnpm test
pnpm build
pnpm --filter web build-storybook
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add apps/web/package.json pnpm-lock.yaml apps/web/src docs AGENTS.md
git commit -m "chore(web): remove UI libraries and document custom system"
```

---

### Task 15: Accessibility, visual regression, and final verification

**Files:**

- Modify: `apps/web/test/e2e/accessibility.spec.ts`
- Modify: `apps/web/test/e2e/visual.spec.ts`
- Modify: `apps/web/test/e2e/auth-layout.spec.ts`
- Modify: `apps/web/test/e2e/auth.spec.ts`
- Modify: `apps/web/test/e2e/public-shell.spec.ts`
- Create: `docs/design/evidence/web-ui-overhaul/README.md`

**Interfaces:**

- Consumes: final app.
- Produces: release evidence and final green gate.

- [ ] **Step 1: Add axe checks**

```bash
pnpm --filter web add -D @axe-core/playwright
```

Test `/`, `/login`, `/register`, `/me`, `/learn`, `/admin` in light and dark. Fail on `serious` or `critical` violations.

Run:

```bash
pnpm exec playwright test apps/web/test/e2e/accessibility.spec.ts --project=chromium
```

Expected: PASS.

- [ ] **Step 2: Add visual baselines**

Generate Chromium baselines for home, login, profile, learn, admin at 390/768/1024/1440 light/dark:

```bash
pnpm exec playwright test apps/web/test/e2e/visual.spec.ts --project=chromium --update-snapshots
```

Review every baseline manually before committing. Delete and regenerate any baseline that shows broken layout.

- [ ] **Step 3: Run full E2E across browsers**

```bash
pnpm exec playwright test apps/web/test/e2e --workers=1
```

Expected: PASS in Chromium, Firefox, WebKit.

- [ ] **Step 4: Verify keyboard matrix manually**

For Select, Menu, Dialog, Tabs, theme, language, account, and mobile navigation:

- Tab to control.
- Open with Enter/Space.
- Navigate with arrow keys/Home/End.
- Activate with Enter/Space.
- Close with Escape.
- Confirm focus returns to trigger.

Record the result in `docs/design/evidence/web-ui-overhaul/README.md`.

- [ ] **Step 5: Verify no token in JavaScript storage**

Use Playwright to log in, then assert `localStorage` and `sessionStorage` do not contain access/refresh token values. Existing auth tests already cover this; keep the assertion.

- [ ] **Step 6: Verify bundle hygiene**

```bash
rg -n "@base-ui|sonner|@uppy|react-table" apps/web/.next/static
```

Expected: no matches.

- [ ] **Step 7: Final evidence**

Capture final screenshots for every route at 390/768/1024/1440 light/dark. Update `docs/design/evidence/web-ui-overhaul/README.md` with:

- route list
- viewport list
- test commands
- test counts
- browser matrix
- known limitations

- [ ] **Step 8: Final full gate**

```bash
pnpm format:check
pnpm lint
pnpm check-types
pnpm test
pnpm build
pnpm --filter web build-storybook
pnpm exec playwright test apps/web/test/e2e --workers=1
```

Expected: all pass.

- [ ] **Step 9: Commit**

```bash
git add apps/web/test docs/design/evidence/web-ui-overhaul
git commit -m "test(web): verify custom UI across routes and browsers"
```

---

## 9. Acceptance Checklist

- [ ] `@base-ui/react` is removed from `apps/web/package.json`, source, and lockfile.
- [ ] `sonner`, `@uppy/*`, and `@tanstack/react-table` are removed.
- [ ] No UI/component library remains in `apps/web`.
- [ ] Every active route uses the new tokens and primitives.
- [ ] Every overlay uses native `<dialog>` or Popover API.
- [ ] Select, Menu, Dialog, Tabs, theme, language, and account are keyboard operable.
- [ ] Focus is visible and returns correctly after overlays close.
- [ ] Light and dark themes pass contrast checks.
- [ ] No horizontal overflow at 390 px on any route.
- [ ] Auth flow, refresh, logout, unverified, and forbidden behavior still pass.
- [ ] Profile update, avatar upload/remove, and private avatar behavior still pass.
- [ ] Strapi optional fields do not break rendering when absent.
- [ ] Storybook builds and every component story renders.
- [ ] Unit, Playwright, axe, build, and lint pass.
- [ ] Visual baseline and screenshot evidence are committed.
- [ ] Design, architecture, Strapi, and roadmap docs are updated.
- [ ] No fake testimonials, ratings, stock photos, or invented metrics.

---

## 10. Out of Scope

- New backend endpoints or database changes.
- New Strapi application inside this repository.
- Full catalog, course detail, checkout, player, quiz, project review, certificate UI.
- Admin CRUD dashboards beyond the current placeholder.
- Social login, testimonials, ratings, or stock photography.
- Native mobile applications.
- Changes to auth, RBAC, CSRF, cookies, or API contracts.

---

## 11. Execution Handoff

After the plan is approved, execute tasks in order. Each task ends with a green local gate and a Conventional Commit. Do not start a later task while an earlier task’s tests fail.

When a task changes a shared primitive, update every consumer in the same task. Do not add a permanent compatibility wrapper around Base UI or the old visual API.

If a task reveals a conflict with this plan, stop and update the plan before continuing.
