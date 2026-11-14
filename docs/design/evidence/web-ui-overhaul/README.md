# Web UI Overhaul Evidence

**Date:** 2026-11-14  
**Scope:** Editorial custom UI for every active route in `apps/web`.

## Visual snapshots

Chromium baselines live at:

`apps/web/test/e2e/visual.spec.ts-snapshots/`

Coverage: home, login, register, and forbidden at 390, 768, 1024, and 1440 px in light mode (16 snapshots).

The light canvas is white `#FFFFFF`. Warm `surface` and `surface-sunken` tokens remain for editorial panels, ticker, and input wells.

## Automated verification

| Check                                  | Result                                                  |
| -------------------------------------- | ------------------------------------------------------- |
| Web unit/component tests               | 91 passed                                               |
| API unit tests                         | 60 passed                                               |
| Playwright (Chromium, Firefox, WebKit) | 119 passed, 64 skipped (Chromium-only visual baselines) |
| Axe accessibility (serious/critical)   | 0 violations                                            |
| `pnpm format:check`                    | passed                                                  |
| `pnpm lint`                            | passed                                                  |
| `pnpm check-types`                     | passed                                                  |
| `pnpm build`                           | passed                                                  |
| Storybook build                        | passed                                                  |

## Route coverage

- Marketing: `/`
- Auth: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`
- Account: `/me`
- Learner: `/learn`
- Admin: `/admin`
- System: `/forbidden`, 404, error, loading

Protected routes are covered by Playwright flow and axe tests rather than separate screenshot files.

## Browser matrix

- Chromium: full visual baseline + interaction suite
- Firefox: interaction and layout suite
- WebKit: interaction and layout suite

## Known limitations

- The Strapi application does not exist in this repository yet. Editorial fields are defined in the TypeScript contract, fixtures, and `docs/architecture/strapi-content-model.md`.
- Visual baselines are Chromium-only because font rasterization differs by engine.
- The first production deploy still needs a live Strapi smoke check and CI verification.
