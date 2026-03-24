# UI/UX Redesign Playbook

**Goal:** Transform Genie Control Station from AI-generated appearance to refined, distinctive design

**Skills Applied:** `/distill` + `/quieter` + `/normalize` + `/arrange`

---

## Phase Overview

| Phase | Skill | Focus | Effort |
|-------|-------|-------|--------|
| [01](UI-REDESIGN-01.md) | `/distill` | Remove gradients, hero metrics | 2h |
| [02](UI-REDESIGN-02.md) | `/quieter` | Remove colored shadows, glassmorphism | 1.5h |
| [03](UI-REDESIGN-03.md) | `/normalize` | Align with design tokens | 2.5h |
| [04](UI-REDESIGN-04.md) | `/arrange` | Vary layouts per page | 3h |
| [05](UI-REDESIGN-05.md) | Verification | Build, test, polish | 1h |

**Total Estimated Effort:** ~10 hours

---

## Key Files Modified

### Components
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
- `app/(dashboard)/applications/page.tsx` - Vary layout, token alignment
- `app/(dashboard)/news-verification/page.tsx` - Vary layout, token alignment
- `app/(dashboard)/community-manager/page.tsx` - Vary layout, token alignment

### Styles
- `app/globals.css` - Add semantic status tokens

### New Utilities
- `lib/chart-theme.ts` - Theme-aware chart colors
- `lib/status-colors.ts` - Progress bar color utility

---

## Anti-Patterns Being Fixed

| Anti-Pattern | Before | After |
|--------------|--------|-------|
| Gradient icons | `from-amber-500 to-orange-500` | `bg-brand/10 text-brand` |
| Colored shadows | `shadow-emerald-500/30` | `ring-2 ring-emerald-500/30` or removed |
| Glassmorphism | `bg-background/80 backdrop-blur-md` | `bg-background border-b` |
| Hard-coded hex | `#3b82f6` | `hsl(var(--chart-1))` |
| Tailwind colors | `text-red-600` | `text-status-error` |
| Identical grids | `grid-cols-4` everywhere | Varied per page |

---

## Execution Order

1. **Phase 01 first** - Biggest visual impact, removes AI slop tells
2. **Phase 02 second** - Refines the aesthetic
3. **Phase 03 third** - Establishes maintainability
4. **Phase 04 fourth** - Creates page identity
5. **Phase 05 last** - Verify everything works

---

## Expected Outcome

After all phases:
- No gradient icon headers
- No colored shadow blobs
- No glassmorphism on navigation
- All colors use design tokens
- Charts are theme-aware
- Each page has distinct layout
- Overall: refined, sophisticated, not AI-generated
