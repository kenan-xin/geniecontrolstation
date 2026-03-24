# UI/UX Redesign Playbook

**Goal:** Transform Genie Control Station from gold/black theme to clean, light corporate design with muted slate blue accents.

**Target Aesthetic:** Light gray/white backgrounds, light sidebar, muted slate blue brand, white cards with neutral shadows, minimal color.

---

## Phase Overview

| Phase | Focus | Effort |
|-------|-------|--------|
| [01](UI-REDESIGN-01.md) | Theme Overhaul - Light corporate slate blue | 2.5h |
| [02](UI-REDESIGN-02.md) | Remove AI Slop Patterns (/distill) | 1.5h |
| [03](UI-REDESIGN-03.md) | Reduce Visual Intensity (/quieter) | 1h |
| [04](UI-REDESIGN-04.md) | Align with Design Tokens (/normalize) | 2h |
| [05](UI-REDESIGN-05.md) | Vary Layouts (/arrange) | 3h |
| [06](UI-REDESIGN-06.md) | Verification & Final Polish | 1h |

**Total Estimated Effort:** ~11 hours

---

## Key Changes

### Theme Transformation

| Element | Before | After |
|---------|--------|-------|
| Brand Color | Gold/Amber `oklch(0.78 0.145 65)` | Muted Slate Blue `oklch(0.45 0.08 250)` |
| Sidebar | Dark `oklch(0.14 ...)` | Light `oklch(0.98 ...)` |
| Background | Light but with dark accents | Light gray/white throughout |
| Charts | High chroma colors | Muted, low chroma palette |
| Shadows | Colored (`shadow-*-500/20`) | Neutral (`shadow-sm`) |

### Anti-Patterns Being Fixed

| Anti-Pattern | Before | After |
|--------------|--------|-------|
| Gradient icons | `from-amber-500 to-orange-500` | `bg-muted text-muted-foreground` |
| Colored shadows | `shadow-emerald-500/30` | Removed or neutral |
| Glassmorphism | `bg-background/80 backdrop-blur-md` | `bg-background border-b` |
| Hard-coded hex | `#3b82f6` | CSS variables |
| Tailwind colors | `text-red-600` | `text-status-error` |
| Identical grids | `grid-cols-4` everywhere | Varied per page |

---

## Key Files Modified

### Styles (Phase 01)
- `app/globals.css` - Complete theme overhaul, new status tokens

### Components
- `components/layout/sidebar.tsx` - Light theme, remove gradient logo
- `components/shared/page-header.tsx` - Remove gradient icons
- `components/shared/status-stat-card.tsx` - Remove gradient overlays
- `components/shared/news-status-config.ts` - Use semantic tokens
- `components/shared/application-status-config.ts` - Use semantic tokens
- `components/news-verification/workflow-stepper.tsx` - Remove colored shadows
- `components/applications/workflow-stepper.tsx` - Remove colored shadows
- `components/layout/header.tsx` - Remove glassmorphism
- `components/dashboard/application-trends-chart.tsx` - Use design tokens
- `components/dashboard/monthly-statistics-chart.tsx` - Use design tokens

### Pages
- `app/(dashboard)/applications/page.tsx` - Horizontal metrics bar
- `app/(dashboard)/news-verification/page.tsx` - Asymmetric grid
- `app/(dashboard)/community-manager/page.tsx` - Dashboard-style layout

### New Utilities
- `lib/chart-theme.ts` - Theme-aware chart colors
- `lib/status-colors.ts` - Progress bar color utility

---

## Execution Order

1. **Phase 01 first** - Theme overhaul, biggest visual impact
2. **Phase 02 second** - Remove remaining AI slop patterns
3. **Phase 03 third** - Reduce visual intensity
4. **Phase 04 fourth** - Align with design tokens
5. **Phase 05 fifth** - Vary layouts per page
6. **Phase 06 last** - Verify everything works

---

## Expected Outcome

After all phases:
- Light corporate theme with muted slate blue accents
- Light sidebar (not dark)
- No gradient icon headers
- No colored shadow blobs
- No glassmorphism on navigation
- All colors use design tokens
- Charts are theme-aware
- Each page has distinct layout
- Overall: clean, professional, corporate, low-profile
