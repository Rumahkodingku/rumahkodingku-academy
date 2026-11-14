# Imagery Manifest

All runtime imagery is stored under `apps/web/public/`. No runtime request depends on an external image host.

## Licensed photography

| File                                         | Source                                                                                                       | License                                                         | Usage              |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ------------------ |
| `public/imagery/home/learning-workspace.jpg` | Unsplash photo `1498050108023-c5249f4df085` (`https://images.unsplash.com/photo-1498050108023-c5249f4df085`) | Unsplash License, free commercial use, attribution not required | Home hero artifact |
| `public/imagery/auth/architecture.jpg`       | Unsplash photo `1487958449943-2429e8be8625` (`https://images.unsplash.com/photo-1487958449943-2429e8be8625`) | Unsplash License, free commercial use, attribution not required | Auth brand panel   |

The source URLs are kept for provenance. No public attribution line is shown because the license does not require it.

The existing design direction preferred real artifacts over generic stock. This pass uses two licensed editorial photographs for atmosphere, chosen because they show a workspace and a calm architectural surface rather than people or invented outcomes. Course content stays diagrammatic.

## Original diagrams

| File                                           | Purpose                                                                     |
| ---------------------------------------------- | --------------------------------------------------------------------------- |
| `public/illustrations/categories/frontend.svg` | Frontend category diagram for the catalog, detail hero, and related courses |
| `public/illustrations/categories/backend.svg`  | Backend category diagram                                                    |
| `public/illustrations/categories/devops.svg`   | DevOps category diagram                                                     |
| `public/illustrations/categories/data.svg`     | Data category diagram                                                       |

These diagrams are original project artwork. They show the category's actual structure: browser layout, server and database, deployment pipeline, and dashboard data.

## Reasons

- The home image shows a real workspace with a code editor. It makes the learning environment tangible without inventing student results.
- The auth image is a calm architectural photograph. It adds texture to the brand panel without faces, fake identities, or testimonial signals.
- Category diagrams are informational. They show what each category is about instead of using generic stock photography.
- All images are local, sized, and rendered through `next/image` so they stay stable and fast.
