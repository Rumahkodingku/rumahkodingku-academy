# Phase 4 — Verification Evidence

**Branch:** `feat/phase-4-public-catalog`  
**Date:** 2026-11-14  
**Scope:** public catalog, course detail, admin shell, fixtures, SEO, and navigation.

## Gates

| Gate              | Command                                        | Result                                                      |
| ----------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| Format            | `pnpm format:check`                            | Pass                                                        |
| Lint              | `pnpm lint`                                    | Pass                                                        |
| Types             | `pnpm check-types`                             | Pass                                                        |
| Unit tests        | `pnpm test`                                    | Web 104 passed, API 60 passed                               |
| Build             | `pnpm build`                                   | Pass                                                        |
| E2E, Chromium     | `pnpm exec playwright test --project=chromium` | 54 passed                                                   |
| E2E, all browsers | `pnpm exec playwright test`                    | 114 passed, 48 skipped (visual baselines are Chromium-only) |

## Accessibility

- Axe serious/critical violations: 0 on `/courses`, `/courses/nextjs-app-router`, and the existing public/auth routes.
- Catalog search has a visible label.
- Filter selects have accessible names.
- The mobile filter dialog is keyboard operable; focus enters the first filter and Escape closes it.
- Draft and archived detail routes return HTTP 404 with the localized not-found page.

## Visual checks

Catalog and course detail snapshots exist at 390, 768, 1024, and 1440 px. The reviewed layouts have no horizontal overflow at any of those widths. The mobile price panel follows the detail hero. The desktop price panel sticks in the content column.

## Notes

- The homepage loading skeleton moved under `(marketing)/(home)` so dynamic catalog 404s can return a real 404 status instead of a streamed 200 soft 404.
- The catalog uses typed fixtures until the course API lands. Checkout remains disabled with a visible note.
- New shared behavior: `Select` now uses `useId` for stable listbox IDs and can render its listbox inside a dialog with `portal={false}`.
