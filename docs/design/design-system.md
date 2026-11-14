# Design System — RumahKodingku Academy

> **Document type:** Design tokens, foundations & component rules  
> **Version:** 1.0.0  
> **Status:** Baseline specification  
> **Primary accent:** `#2563EB`
> **Brand color:** `#406194`  
> **Theme:** Light only  
> **Last updated:** 2026-11-12

---

## 0. Current Implementation — Editorial Academy v2

The implementation source of truth is `apps/web/src/index.css`. The v2 system replaces the original Modern SaaS token baseline:

- Canvas: white `#FFFFFF`, surface `#FBF8F2`, sunken `#EFE9DD`, ink `#141311`, muted `#5C564D`, line `#DCD4C6`.
- Accent: Academy Blue `#2563EB`; dark accent `#7FB0FF`.
- Deep surfaces: `#141311` light, `#0B0A09` dark.
- Type: Space Grotesk display, Manrope body, Geist Mono code.
- Actions: pill buttons with ink fill; blue is reserved for links, focus, active, and selected states.
- Surfaces: 6–8 px radius, hairline borders, minimal shadow.
- Motion: 180–260 ms UI, 600–800 ms editorial reveal, reduced-motion respected.
- No Base UI or other component library. See `docs/refactor/web-ui-overhaul-plan.md`.

## 1. Purpose

Dokumen ini mendefinisikan fondasi visual dan aturan komponen agar implementasi UI RumahKodingku Academy konsisten. Nilai di bawah merupakan baseline desain yang dapat disesuaikan setelah validasi kontras, usability testing, dan implementasi frontend.

**Penting:** warna resmi parent brand dan logo RumahKodingku harus mengikuti aset/panduan resmi. Token parent brand yang belum diberikan tidak boleh ditebak. Academy Blue `#2563EB` adalah aksen Academy, bukan pengganti seluruh palet brand induk.

## 2. Design Principles

1. Consistency: token dan komponen digunakan lintas halaman.
2. Semantic first: komponen menggunakan token semantik, bukan hard-coded color.
3. Accessible: kontras, fokus, ukuran target, dan state harus dapat diuji.
4. Theme-aware: setiap komponen memiliki nilai Light dan Dark.
5. Scalable: token memiliki primitive dan semantic layer.
6. Intentional: tidak membuat token atau varian baru tanpa kebutuhan.

## 3. Token Architecture

Gunakan tiga lapisan:

- **Primitive tokens:** nilai mentah seperti warna, spacing, radius.
- **Semantic tokens:** makna UI seperti `color.text.primary` dan `color.surface.page`.
- **Component tokens:** override khusus komponen jika semantic token belum cukup.

Komponen harus menggunakan semantic tokens. Hindari penggunaan primitive langsung di komponen kecuali pada token definition.

## 4. Color Tokens

### 4.1 Brand

| Token               |     Value | Usage                  |
| ------------------- | --------: | ---------------------- |
| `brand.academy.500` | `#2563EB` | Academy primary accent |
| `brand.academy.600` | `#1D4ED8` | Hover/strong emphasis  |
| `brand.academy.700` | `#1E40AF` | Active/deep emphasis   |
| `brand.academy.100` | `#DBEAFE` | Light tint             |
| `brand.academy.50`  | `#EFF6FF` | Subtle tint            |

Periksa kontras pada kombinasi teks dan background aktual. Jangan mengasumsikan semua shade cocok untuk teks kecil.

### 4.2 Neutral palette

| Token         |     Value | Intended use                     |
| ------------- | --------: | -------------------------------- |
| `neutral.0`   | `#FFFFFF` | White                            |
| `neutral.50`  | `#F8FAFC` | Very light surface               |
| `neutral.100` | `#F1F5F9` | Subtle surface                   |
| `neutral.200` | `#E2E8F0` | Light border                     |
| `neutral.300` | `#CBD5E1` | Stronger border                  |
| `neutral.400` | `#94A3B8` | Muted icon/text (check contrast) |
| `neutral.500` | `#64748B` | Secondary text candidate         |
| `neutral.600` | `#475569` | Body/secondary text              |
| `neutral.700` | `#334155` | Strong text                      |
| `neutral.800` | `#1E293B` | Dark surface                     |
| `neutral.900` | `#0F172A` | Deep surface                     |
| `neutral.950` | `#020617` | Deepest neutral                  |

### 4.3 Semantic colors

| Semantic                | Light value | Dark value | Usage                           |
| ----------------------- | ----------- | ---------- | ------------------------------- |
| `text.primary`          | `#0F172A`   | `#F8FAFC`  | Main text                       |
| `text.secondary`        | `#475569`   | `#CBD5E1`  | Supporting text                 |
| `text.muted`            | `#64748B`   | `#94A3B8`  | Muted metadata; verify contrast |
| `text.inverse`          | `#FFFFFF`   | `#0F172A`  | Text on inverse surfaces        |
| `surface.page`          | `#FFFFFF`   | `#0B1220`  | App/page background             |
| `surface.subtle`        | `#F8FAFC`   | `#111B2E`  | Subtle section                  |
| `surface.default`       | `#FFFFFF`   | `#172338`  | Cards/panels                    |
| `surface.elevated`      | `#FFFFFF`   | `#1E2B42`  | Popover/modal                   |
| `surface.sunken`        | `#F1F5F9`   | `#080E19`  | Input wells/embedded areas      |
| `border.default`        | `#E2E8F0`   | `#2B3A52`  | Standard border                 |
| `border.strong`         | `#CBD5E1`   | `#40516B`  | Emphasized border               |
| `border.focus`          | `#2563EB`   | `#60A5FA`  | Focus indicator                 |
| `action.primary`        | `#2563EB`   | `#3B82F6`  | Primary action                  |
| `action.primary.hover`  | `#1D4ED8`   | `#60A5FA`  | Hover                           |
| `action.primary.active` | `#1E40AF`   | `#2563EB`  | Active                          |
| `action.primary.text`   | `#FFFFFF`   | `#FFFFFF`  | Text on primary                 |
| `action.secondary`      | `#F1F5F9`   | `#24334A`  | Secondary action                |
| `action.secondary.text` | `#0F172A`   | `#F8FAFC`  | Secondary action text           |
| `status.success`        | `#15803D`   | `#4ADE80`  | Success                         |
| `status.warning`        | `#A16207`   | `#FACC15`  | Warning                         |
| `status.danger`         | `#B91C1C`   | `#F87171`  | Error/destructive               |
| `status.info`           | `#0369A1`   | `#38BDF8`  | Informational                   |

Values are starting points. Run contrast tests for every actual foreground/background pairing, including disabled and hover states. Do not use color as the only status indicator.

### 4.4 Theme implementation rules

- Define theme variables at the root theme boundary.
- Use semantic variables in all components.
- Prevent theme flash during initial render.
- Ensure embedded content, charts, code blocks, dialogs, and third-party UI have deliberate theme treatment.

## 5. Typography

### 5.1 Font roles

Recommended baseline:

- UI and body: modern sans-serif system stack or approved project font.
- Code: monospace stack.
- Final font family must be checked for Indonesian glyph coverage, loading performance, and licensing.

### 5.2 Type scale

| Token     |  Size | Line height | Weight | Usage                              |
| --------- | ----: | ----------: | -----: | ---------------------------------- |
| `display` | 56 px |        1.08 |    700 | Large marketing hero, desktop only |
| `h1`      | 40 px |        1.15 |    700 | Page title                         |
| `h2`      | 32 px |         1.2 |    700 | Major section                      |
| `h3`      | 24 px |        1.25 |    600 | Subsection                         |
| `h4`      | 20 px |         1.3 |    600 | Card/section title                 |
| `title`   | 18 px |         1.4 |    600 | Component title                    |
| `body-lg` | 18 px |         1.6 |    400 | Intro/lead                         |
| `body`    | 16 px |         1.6 |    400 | Default reading                    |
| `body-sm` | 14 px |         1.5 |    400 | Supporting copy                    |
| `caption` | 12 px |        1.45 |    500 | Dense metadata only                |
| `code`    | 14 px |         1.6 |    400 | Code and commands                  |

Responsive adjustment:

- On small screens, display may reduce to 36–40 px.
- H1 may reduce to 30–32 px.
- Body text should remain comfortably readable; do not shrink body text merely to fit.
- Long-form lesson content should use a readable line length, typically around 60–80 characters.

## 6. Spacing

Use a 4 px base scale.

| Token      | Value |
| ---------- | ----: |
| `space.0`  |  0 px |
| `space.1`  |  4 px |
| `space.2`  |  8 px |
| `space.3`  | 12 px |
| `space.4`  | 16 px |
| `space.5`  | 20 px |
| `space.6`  | 24 px |
| `space.8`  | 32 px |
| `space.10` | 40 px |
| `space.12` | 48 px |
| `space.16` | 64 px |
| `space.20` | 80 px |
| `space.24` | 96 px |

Guidance:

- 8–12 px: tight inline grouping.
- 16–24 px: related controls and card content.
- 32–48 px: section separation.
- 64–96 px: major marketing section spacing.
- Keep spacing consistent across similar page patterns.

## 7. Layout and Grid

Recommended responsive baseline:

| Viewport     | Columns | Side margin | Gutter |
| ------------ | ------: | ----------: | -----: |
| Small mobile |       4 |       16 px |  16 px |
| Large mobile |       4 |       20 px |  16 px |
| Tablet       |       8 |       24 px |  20 px |
| Desktop      |      12 |       32 px |  24 px |
| Wide desktop |      12 |       48 px |  24 px |

- Suggested content max width: 1200–1280 px for general pages.
- Long-form reading width: 680–760 px.
- Dashboard and ADMIN may use wider content areas.
- Breakpoints are implementation baselines and should be aligned with the frontend framework and actual content.
- Avoid horizontal page overflow.

## 8. Radius

| Token         |   Value | Usage                    |
| ------------- | ------: | ------------------------ |
| `radius.none` |    0 px | Special flush edge       |
| `radius.sm`   |    4 px | Small control detail     |
| `radius.md`   |    8 px | Inputs, compact controls |
| `radius.lg`   |   12 px | Cards, buttons           |
| `radius.xl`   |   16 px | Large cards/panels       |
| `radius.2xl`  |   24 px | Hero/feature surfaces    |
| `radius.full` | 9999 px | Pills, avatars           |

Use a limited set. Do not assign arbitrary radii per component.

## 9. Elevation and Shadows

Elevation must communicate layering, not decoration.

| Token      | Light baseline                   | Dark baseline                 |
| ---------- | -------------------------------- | ----------------------------- |
| `shadow.0` | none                             | none                          |
| `shadow.1` | `0 1px 2px rgba(15,23,42,.06)`   | `0 1px 2px rgba(0,0,0,.22)`   |
| `shadow.2` | `0 4px 12px rgba(15,23,42,.08)`  | `0 6px 16px rgba(0,0,0,.28)`  |
| `shadow.3` | `0 12px 32px rgba(15,23,42,.12)` | `0 12px 32px rgba(0,0,0,.36)` |

Use border and surface contrast as the primary separation mechanism. Avoid shadows that create muddy dark surfaces.

## 10. Component Specifications

### 10.1 Buttons

Variants:

- Primary: main action.
- Secondary: alternative action.
- Tertiary/Ghost: low-emphasis action.
- Destructive: irreversible or harmful action.
- Link: navigation-like text action.

Sizes:

- Small: compact utility actions.
- Medium: default.
- Large: prominent CTA.

States:

- Default, hover, focus-visible, active, disabled, loading.
- Loading state must prevent duplicate submission where appropriate.
- Disabled state must remain legible and must not be the only explanation for unavailable action.

Rules:

- Use verb-led labels such as “Mulai belajar”, “Kirim proyek”, “Simpan perubahan”.
- Avoid multiple primary buttons competing in the same visual region.
- Destructive actions require confirmation when impact is significant.

### 10.2 Form controls

Includes text input, textarea, select, checkbox, radio, switch, date input, file input.

Required states:

- Default, hover, focus, filled, disabled, read-only, invalid, valid, loading.
- Every control has a visible label.
- Helper text and error text are associated with the control.
- Placeholder is not a substitute for label.
- Error copy explains how to fix the issue.
- Do not clear user-entered data after recoverable errors.

### 10.3 Cards

Card types:

- Course card.
- Roadmap step.
- Dashboard summary.
- Project submission.
- Discussion thread.
- Admin data summary.

Rules:

- Use cards to group related information.
- Make the click target clear; do not make a card appear interactive if it is not.
- Avoid nesting cards inside cards without a strong information architecture reason.
- Keep metadata hierarchy consistent.

### 10.4 Navigation

- Public navigation: brand, key destinations, primary CTA, account entry.
- USER navigation: dashboard, courses, roadmaps, certificates, orders/profile as appropriate.
- ADMIN navigation: operational modules grouped by task.
- Active state must be visible and accessible.
- Mobile navigation must expose all critical destinations.

### 10.5 Tabs

- Use tabs for sibling content within the same context.
- Do not use tabs as a replacement for primary navigation.
- Active tab must be programmatically and visually identifiable.
- Keyboard behavior should follow accessible tab pattern.

### 10.6 Dialogs and drawers

- Use for focused tasks or contextual detail.
- Include title and clear close action.
- Manage focus when opened and closed.
- Prevent background interaction when modal.
- On mobile, consider a full-height sheet/drawer where appropriate.
- Do not put an entire complex multi-step workflow into a tiny dialog.

### 10.7 Badges and status labels

Status labels should include text, not color alone.

Recommended labels:

- `Draft`
- `Published`
- `Pending`
- `Paid`
- `Failed`
- `Refund requested`
- `Refund approved`
- `Refund rejected`
- `In progress`
- `Submitted`
- `Under review`
- `Needs revision`
- `Approved`
- `Completed`

Use only statuses supported by backend/product state definitions. Do not conflate payment, enrollment, learning, and project-review states.

### 10.8 Progress indicators

- Always provide context: progress of what?
- Use text or accessible value alongside visual bar.
- Do not imply course completion if only some lessons are completed.
- Define whether progress is lesson-based, section-based, or requirement-based.

### 10.9 Tables

- Use for comparison and admin data.
- Provide column labels, sort state, filter state, and pagination context.
- Keep actions predictable.
- On mobile, use responsive transformation or controlled horizontal scroll.
- Do not truncate critical values without a way to inspect them.

### 10.10 Toasts and inline feedback

- Use toast for brief, non-blocking confirmation.
- Use inline feedback for field-level or context-specific errors.
- Important payment/project outcomes must remain visible in page state or history; do not rely only on a toast.

### 10.11 Empty, loading, and error states

Every major data-driven component needs:

- Loading/skeleton.
- Empty state with next action.
- Error state with recovery path.
- Permission-denied state where applicable.
- Partial data state if the product can return incomplete results.

## 11. Iconography and Assets

- Use one icon library or approved icon set.
- Maintain consistent stroke weight and optical size.
- Provide text labels for non-obvious icons.
- Avoid mixing emoji and line icons as equivalent functional controls.
- Store assets with descriptive names and document source/licensing.
- Use real course/project assets only when permitted.

## 12. Motion

Suggested durations:

- Micro feedback: 100–160 ms.
- Standard transitions: 160–240 ms.
- Larger panel transitions: 200–300 ms.

These are starting points. Respect `prefers-reduced-motion`. Motion must not delay essential actions or communicate information unavailable in static form.

## 13. Accessibility Requirements

Target WCAG 2.2 AA:

- Text contrast at least 4.5:1 for normal text and 3:1 for large text, subject to applicable WCAG definitions.
- Non-text UI component contrast and focus indicators must be checked.
- Keyboard access for all interactive controls.
- Visible focus state.
- Accessible names and semantic structure.
- Form labels and actionable errors.
- Minimum target size should aim for 44×44 CSS px; exceptions must be reviewed against WCAG 2.2 criteria.
- Reflow and zoom support.
- Captions/transcripts where available and appropriate for learning media.
- Reduced-motion support.

## 14. Suggested CSS Custom Properties

```css
:root,
[data-theme="light"] {
  color-scheme: light;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #64748b;
  --color-surface-page: #ffffff;
  --color-surface-subtle: #f8fafc;
  --color-surface-default: #ffffff;
  --color-surface-elevated: #ffffff;
  --color-border-default: #e2e8f0;
  --color-border-strong: #cbd5e1;
  --color-action-primary: #2563eb;
  --color-action-primary-hover: #1d4ed8;
  --color-action-primary-text: #ffffff;
}

[data-theme="dark"] {
  color-scheme: dark;
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-text-muted: #94a3b8;
  --color-surface-page: #0b1220;
  --color-surface-subtle: #111b2e;
  --color-surface-default: #172338;
  --color-surface-elevated: #1e2b42;
  --color-border-default: #2b3a52;
  --color-border-strong: #40516b;
  --color-action-primary: #3b82f6;
  --color-action-primary-hover: #60a5fa;
  --color-action-primary-text: #ffffff;
}
```

This is a starter token excerpt, not a complete production stylesheet. Extend it with status, focus, disabled, overlay, chart, and component-specific tokens after validation.

## 15. Governance

- New tokens require a documented use case.
- Do not introduce one-off colors in page code.
- Component variants must be documented.
- Changes to global tokens require review across both themes.
- Deprecated tokens should be migrated before removal.
- Design and frontend implementations should be reviewed together.
- Accessibility regression checks are required for token changes.

## 16. Related Documents

- `design-brief.md`
- `design-direction.md`
- `ui-ux-guidelines.md`
