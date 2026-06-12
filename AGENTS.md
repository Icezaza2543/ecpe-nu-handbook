# ECPE NU Handbook Agent Context

This is the single source of truth for AI agents and maintainers working on this repo. Do not recreate scattered AI notes under `docs/`, `design-system/`, or migration files unless the user explicitly asks for a new documentation split.

## Product

- Public name: `ECPE NU Freshman Handbook`
- Short UI name: `ECPE NU Handbook`
- Audience: Thai Computer Engineering students at Naresuan University, especially freshmen.
- Product goal: help students understand the curriculum, prerequisites, career tracks, survival guidance, tools, sources, and portfolio direction through a polished interactive handbook.
- Wording rule: use `Handbook` for product/system wording; avoid old OS-style internal labels.
- Copy rule: Thai-first UI, English only for common technical labels such as `Roadmap`, `Tools`, `FAQ`, or developer terms that students already recognize.

## Current Stack

- React 19, TypeScript, Vite 8, React Router 7.
- Styling is custom vanilla CSS under `src/styles/*`; no UI framework is installed.
- Icons use `lucide-react`.
- Animation uses `framer-motion`.
- Graph/canvas visuals use `@xyflow/react` and custom 2D canvas components.
- Search uses `fuse.js` through `src/utils/courseIndex.ts`.
- Runtime data validation uses `zod` in development only.
- No 3D/WebGL dependency is currently installed. Do not reintroduce a 3D stack unless a real 3D requirement returns.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

Expected validation status as of the latest cleanup:

- `npm run lint` passes.
- `npm run test` passes: 3 files, 12 tests.
- `npm run build` passes.
- Vite still warns that one initial chunk is larger than 500 kB. Treat this as a performance warning, not a build failure. Do not hide it by raising the warning limit unless bundle work is intentionally deferred by the user.

## Deployment

- Primary target: Vercel.
- `vercel.json` uses Vite, builds with `npm run build`, outputs `dist`, enables clean URLs, and rewrites all SPA routes to `/index.html`.
- `vite.config.ts` defaults `base` to `/`.
- For subpath hosting, set `VITE_BASE_PATH` or `BASE_PATH`, for example `VITE_BASE_PATH=/ecpe-nu-handbook/`.
- `src/main.tsx` reads the router basename from `import.meta.env.BASE_URL` through `getRouterBasename()`.
- `index.html` uses `%BASE_URL%` for favicon and Open Graph assets.

## Routing

- Canonical routes:
  - `/`
  - `/visual-maps`
  - `/courses`
  - `/dependency-graph`
  - `/roadmaps`
  - `/survival-guide`
  - `/tools-sources`
  - `/faq`
  - `/senior-tips`
  - `/credits`
- Route aliases and typo tolerance live in `src/utils/routing.ts`.
- Old GitHub Pages style URLs under `/ecpe-nu-handbook/...` are normalized back to canonical root routes.
- Unknown paths fall back to `/` instead of showing a hard error.
- Keep route links centralized through `src/config/navigation.ts` where possible.

## Data Model

- Static data lives under `src/data/*`.
- `src/utils/courseIndex.ts` centralizes course lookup by id, code, slug, `courseId`, legacy ids, Thai name, and English name.
- Components should receive/use the shared `CourseIndex` instead of rebuilding lookup maps.
- `officialPrerequisites.ts` is the official prerequisite source.
- Senior advice and informal planning notes must be labeled separately and not presented as official prerequisite data.
- Development data validation starts in `src/main.tsx` through `validateStaticData(...)`.

## Design Direction

- Core style: developer tool / IDE plus interactive education product.
- Accents: lightweight HUD/FUI, data-informed visuals, clean graph language.
- Tone: product-quality, technical but readable, approachable for freshmen.
- Avoid: generic dashboard templates, dark observability UI, crypto/fintech aesthetics, heavy cyberpunk, excessive pastel glow, English-only labels, decorative clutter, and huge card dumps without hierarchy.
- Icons: prefer `lucide-react`; do not use emoji as primary UI icons.
- Mobile: every main page must be reachable from mobile nav and must avoid horizontal overflow.
- Motion: respect `prefers-reduced-motion`; canvas/animation components need non-disruptive reduced-motion behavior.

## Page Contracts

- Home (`src/pages/HomePage.tsx`): mission-control entry point with clear Handbook value prop, primary CTAs, quick metrics, quick-start cards, and search.
- Visual Maps (`src/pages/VisualMapsPage.tsx`): flagship gallery of map modes. Current modes include 4-year plan, flowchart, prerequisite graph, critical path, year 4 decision, graduation workflow, GenEd, and workload heatmap. Mobile hero canvas uses compact decorative nodes to prevent label overlap.
- Courses (`src/pages/CourseCatalogPage.tsx`): searchable course explorer with filtering and course detail inspection. Mobile should favor cards over cramped tables.
- Dependency Graph (`src/pages/DependencyGraphPage.tsx`): prerequisite explorer with readable mode and interactive graph mode. Avoid exposing terms like `nodes` or `edges` in user-facing copy.
- Career Roadmaps (`src/pages/CareerRoadmapsPage.tsx`): career selector plus skill-tree style detail panel with courses, tools, and portfolio ideas.
- Tools & Sources (`src/pages/BeyondClassroomPage.tsx`): developer toolbox / registry feel with search, categories, top picks, and progressive disclosure for tools, sources, and skills.
- Survival Guide, FAQ, Senior Tips, Credits: supporting resource pages. Keep them useful and scannable rather than marketing-heavy.

## Dependency Rationale

- `react`, `react-dom`: core UI runtime.
- `react-router-dom`: SPA routing, aliases, redirects, and navigation.
- `@xyflow/react`: interactive graph surfaces, especially prerequisite/curriculum graph views.
- `framer-motion`: page and component animation where CSS transitions are not enough.
- `lucide-react`: consistent icon system.
- `fuse.js`: fuzzy search for course lookup and related search experiences.
- `zod`: development-time data validation for static course/curriculum data.
- `typescript`, `vite`, `vitest`, `jsdom`, `@testing-library/react`, `eslint`, `prettier`: development, quality, and validation tooling.

## QA Checklist

Before handing work back:

- Run `npm run lint`, `npm run test`, and `npm run build` for meaningful code or config changes.
- Search for forbidden/stale wording and removed 3D dependency names when relevant.
- For rendered UI changes, verify at least desktop and one mobile viewport.
- Check for horizontal overflow on mobile; `scrollWidth` should not exceed `innerWidth`.
- Check that no Vite/framework overlay appears.
- Check browser console for relevant errors/warnings.
- For route work, smoke test canonical routes, aliases, old `/ecpe-nu-handbook/...` paths, and an unknown path.

## Repository Notes

- `README.md` is the public-facing repo overview, not the AI context source.
- `AGENTS.md` is the only AI/maintainer context file.
- The ignored `.gemini/scratch/*` tree may contain many Markdown files from external skills or experiments. Do not treat those as project docs.
