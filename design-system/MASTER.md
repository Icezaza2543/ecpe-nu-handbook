# ECPE NU Handbook - Design System (MASTER)

## 1. Product Identity
- **External Name**: ECPE NU Handbook
- **Internal Direction**: Curriculum OS
- **Audience**: Thai ECPE students, especially freshmen.

## 2. Visual Language
- **Core Style**: Developer Tool / IDE + Interactive Education Product
- **Accents**: Lightweight HUD / Sci-Fi FUI
- **Vibe**: Product-quality, technical but readable, data-informed, interactive.
- **Strictly Avoid**: Enterprise analytics dashboards, dark observability UI, crypto/fintech landing pages, card grid templates, heavy cyberpunk, or excessive pastel glows (AI template look).

## 3. Color Tokens
- `primary`: Core interactive element color.
- `cyan`: Accent for highlights and specific tech elements.
- `violet`: Secondary accent for depth and HUD feel.
- `orange`: `#FF9E57` - used for specific highlights or warnings.
- `success`: Green for completed/passed status.
- `warning`: Yellow/Orange for cautions or missing prerequisites.
- `danger`: Red for critical paths or fail states.
- `surface`: Card and module backgrounds.
- `glass`: Translucent backgrounds for floating elements (blur/backdrop).
- `border`: Subtle dividers.
- `text`: Primary readable content.
- `muted text`: Secondary descriptions and metadata.

## 4. Typography Scale
- **Hero title**: 800 weight, highly impactful.
- **Page title**: 700 weight, clean and professional.
- **Section title**: 700 weight.
- **Card title**: 600 weight.
- **Body**: 400 weight, readable.
- **Caption / Badge**: Small, uppercase, letter-spacing (0.05em).

## 5. Spacing Scale
- `xs` (4px), `sm` (8px), `md` (16px), `lg` (24px), `xl` (32px), `2xl` (48px), `3xl` (64px)

## 6. Radius / Elevation
- **Card**: 16px to 24px with subtle border.
- **Modal / Drawer**: 24px top radius for bottom sheets.
- **Chip / Node**: Fully rounded (999px) or subtle soft squares.
- **Inspector Panel**: Clean flat or subtle shadow (`0 8px 32px rgba(0,0,0,0.05)`).

## 7. Motion System
- **150ms**: Fast interactions (hover, active).
- **250ms**: Normal state changes (modals, drawers).
- **350ms**: Section reveals and page transitions.
- **Accessibility**: Respect `prefers-reduced-motion` to disable complex animations.

## 8. Graph / Node Style
- **Course node**: Clean chip, colored by category/status.
- **Prerequisite edge**: Solid or dashed lines, `rgba` transparency.
- **Selected edge**: High opacity, thickened stroke.
- **Warning path**: Danger color (`var(--danger)`).
- **Grouped node**: Surrounded by subtle bounding boxes.
- **Inspector drawer**: Slides from right (desktop) or bottom (mobile).

## 9. Anti-Patterns
- Card grid dump without hierarchy.
- Pastel glow overload.
- English-only labels (use Thai-first).
- Emoji as primary icons (use `lucide-react` instead).
- Dashboard taking over the screen without context.
- Technical/internal wording leaking into the UI.
- Horizontal overflow on mobile.
- Hidden mobile pages (nav must be fully reachable).

## 10. QA Checklist
- [ ] Contrast meets WCAG AA standards.
- [ ] Focus states are clearly visible for keyboard nav.
- [ ] Interactive elements have clear hover states.
- [ ] Touch targets are at least 44px.
- [ ] Responsive across 375px, 768px, 1024px, 1440px.
- [ ] Reduced motion is respected.
- [ ] NO horizontal scroll issues.
- [ ] NO console errors.
- [ ] NO internal wording (e.g., "prerequisite edges").
- [ ] Build / lint / test pass successfully.
