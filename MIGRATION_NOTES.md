# Migration Notes

## Scope

This is a parallel migration. The V2 app was created under `react-vite/` and does not rewrite or delete the legacy Vanilla JS application.

## Migrated Data Modules

- `courses`
- `curriculumStructure`
- `studyPlan`
- `officialPrerequisites`
- `dependencies`
- `roadmaps`
- `careerOutcomes`
- `year4Tracks`
- `faqs`
- `seniorTips`
- `survivalGuide`
- `sourceMetadata`
- `programOverview`
- `electiveTracks`
- `placeholders`

The generated data modules preserve the legacy fields as JSON exports. Important fields such as `legacyIds`, `sourceConfidence`, `sourcePage`, `sourceRef`, `sourceNote`, `seniorTips`, `careerPaths`, `dangerousToFail`, and `whyItMatters` were kept.

## Source Separation

- `officialPrerequisites.ts` is used for the Official Prerequisite Graph.
- `dependencies.ts` is used for Senior Advice Dependency Graph and planning aids.

The UI labels senior advice separately so it is not presented as official MKO2 data.

## Course Index

`src/utils/courseIndex.ts` centralizes lookup for:

- course id
- course code
- slug
- `courseId`
- legacy ids
- Thai course name
- English course name

Course chips, modal launchers, catalog search, visual maps, and command search should use the shared index.

## Visual Maps Implemented

- Curriculum Structure Flowchart
- 4-Year Study Plan Timeline
- Official Prerequisite Graph
- Senior Advice Dependency Graph
- Critical Course Path Map
- Career Mind Map
- Year 4 Track Decision Workflow
- Graduation Requirement Workflow
- Course Galaxy 3D
- GenEd Explorer
- Workload Heatmap

## Fallbacks

- Course Galaxy uses WebGL when available.
- If WebGL is unavailable or `prefers-reduced-motion` is enabled, it renders a 2D course-chip fallback.
- Global CSS disables animation and transitions under `prefers-reduced-motion: reduce`.
- Routes are lazy loaded through `React.lazy` and `Suspense`.

## Known Limitations

- The visual maps are functional V2 foundations, not a final production polish pass.
- Course Galaxy 3D uses a simplified subset of important/elective courses for performance.
- Some advanced requested interactions, such as deep camera focus per cluster and full graph category filtering, should be expanded in a later phase.
- Build currently emits Vite chunk-size warnings because Three.js and React Flow are intentionally included.
