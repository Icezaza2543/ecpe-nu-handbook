# Dependency Decisions

This document outlines the rationale for every dependency in this project, answering what it does, where it is used, why it is necessary, and its fallback status.

## Core React Ecosystem

### `react` & `react-dom`
- **What it does:** Core library for building UI components.
- **Where it's used:** Everywhere.
- **Why it's necessary:** The foundation of the project.
- **Fallback:** N/A.

### `react-router-dom`
- **What it does:** Client-side routing.
- **Where it's used:** App setup (`main.tsx`, `App.tsx`) and navigation links.
- **Why it's necessary:** Essential for navigating between pages (Course Catalog, Visual Maps, Career Roadmaps) without reloading the app.
- **Fallback:** Native `window.location` (but breaks SPA UX, so no fallback needed).

## Data Visualization

### `@xyflow/react` (React Flow)
- **What it does:** Node-based diagramming and flowcharting.
- **Where it's used:** `OfficialPrerequisiteGraph` and the interactive curriculum graph components.
- **Why it's necessary:** Building interactive, draggable, and zoomable relationship graphs from complex prerequisite data is extremely difficult from scratch.
- **Fallback:** `CurriculumGridDiagram` (Poster mode) serves as a static, non-interactive alternative for viewing curriculum flow.

## UI, Animation & Styling

### `framer-motion`
- **What it does:** Powerful declarative animation library.
- **Where it's used:** Component reveals, route transitions, modal pop-ins (`MotionCard.tsx`, page transitions).
- **Why it's necessary:** Adds professional polish to micro-interactions and transitions, significantly improving perceived UX.
- **Fallback:** Native CSS transitions for simple hover states; Framer Motion is used for complex orchestrations.

### `lucide-react`
- **What it does:** SVG icon library.
- **Where it's used:** Across all UI components for iconography.
- **Why it's necessary:** Lightweight, scalable, consistent, and cleanly integrated with React.
- **Fallback:** Text labels or standard HTML entities.

## Search & Data Integrity

### `zod`
- **What it does:** TypeScript-first schema declaration and runtime validation.
- **Where it's used:** Data initializers and dev-mode validators (`src/schemas/*`).
- **Why it's necessary:** Ensures that static data files (courses, plans) adhere to the expected shapes, catching data entry errors early without crashing production.
- **Fallback:** TypeScript static types (only works at compile-time).

### `fuse.js`
- **What it does:** Lightweight fuzzy-search library.
- **Where it's used:** `src/utils/courseIndex.ts`, which powers course search in the catalog and home search flows.
- **Why it's necessary:** Simple string `includes()` fails on typos or imperfect queries. Fuse provides robust relevance-based search matching.
- **Fallback:** Standard `String.prototype.includes`.

## Development & Quality (devDependencies)

### `typescript`
- **What it does:** Static type checking.
- **Why it's necessary:** Prevents massive classes of runtime errors during development.

### `vite` & `@vitejs/plugin-react`
- **What it does:** Build tool and dev server.
- **Why it's necessary:** Provides extremely fast Hot Module Replacement (HMR) and optimized production bundles.

### `vitest`, `jsdom`, `@testing-library/react`
- **What it does:** Unit and component testing framework.
- **Why it's necessary:** Ensures data integrity functions (`courseIndex`) and complex logic continue to work correctly during refactoring.

### `eslint`, `prettier`
- **What it does:** Code linting and formatting.
- **Why it's necessary:** Maintains professional code consistency and catches potential code smells.

---

*Note: We have deliberately not installed bloated UI frameworks (like Material-UI or Chakra) to keep bundle size minimal, opting for vanilla CSS/CSS modules + structural utility components.*
