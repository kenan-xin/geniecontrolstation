# UI/UX Design Audit Report

> **For agentic workers:** This is an audit document identifying design issues. Use the suggested commands at the end of each section to fix issues systematically.

**Goal:** Comprehensive audit of Genie Control Station dashboard UI/UX quality

**Date:** 2026-03-24

**Scope:** genie-dashboard/src - All pages, components, and styles

---

## Anti-Patterns Verdict

**PASS/FAIL: FAIL - Strong AI-generated appearance**

This interface would immediately be recognized as AI-generated. Key tells:

| Anti-Pattern | Locations | Severity |
|-------------|-----------|----------|
| Gradient icons in page headers | `page-header.tsx`, all 4 main pages | Critical |
| Hero metric cards (big number + label + gradient) | `status-stat-card.tsx`, `status-cards.tsx` | Critical |
| Identical card grids everywhere | All list pages | High |
| `from-*-500 to-*-500` gradient patterns | 20+ locations | High |
| Shadow with color tint (`shadow-*-500/20`) | 10+ locations | Medium |
| Glassmorphism (backdrop-blur) | Headers, detail layouts | Medium |
| Hard-coded hex colors in charts | `application-trends-chart.tsx`, `monthly-statistics-chart.tsx` | High |

### Specific AI Slop Tells

1. **Page Header Gradients** (`components/shared/page-header.tsx:34-37`):
   ```tsx
   // Every page has the same template:
   // from-amber-500 to-orange-500 (News)
   // from-violet-500 to-purple-500 (Applications)
   // from-blue-500 to-indigo-500 (Community)
   ```

2. **Status Card Template** (`components/shared/status-stat-card.tsx`):
   - Big number (text-3xl)
   - Small label below
   - Icon in colored box
   - Optional gradient background
   - Left border accent

3. **Workflow Stepper Gradients** (`components/news-verification/workflow-stepper.tsx:73`):
   ```tsx
   "bg-gradient-to-r from-emerald-500 to-emerald-400"
   ```

---

## Executive Summary

| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Anti-Patterns | 3 | 4 | 2 | 1 |
| Theming | 1 | 5 | 3 | 2 |
| Accessibility | 0 | 2 | 4 | 3 |
| Performance | 0 | 1 | 2 | 1 |
| Responsive | 0 | 1 | 2 | 2 |
| **TOTAL** | **4** | **13** | **13** | **9** |

**Overall Quality Score:** 4/10 - Functional but generic, lacks visual identity

**Top 5 Critical Issues:**
1. AI-generated appearance - gradient icons, hero metrics, card grids
2. Hard-coded colors bypass design tokens (charts, status configs)
3. No visual differentiation between pages - same template everywhere
4. Color contrast issues with colored text on transparent backgrounds
5. Monotonous layouts - no visual rhythm or hierarchy variation

---

## Detailed Findings

### Critical Issues

#### CRIT-1: AI Slop - Gradient Icon Headers
**Location:** `components/shared/page-header.tsx:34-37`
**Category:** Anti-Patterns
**Description:** Every page uses identical gradient icon in header with shadow tint
**Impact:** Immediately identifiable as AI-generated; no brand identity
**Recommendation:** Replace with subtle, consistent icon treatment. Use brand color only, no gradients.
**Suggested command:** `/distill`

```tsx
// Current (AI slop):
className="bg-gradient-to-br from-amber-500 to-orange-500 shadow-md shadow-amber-500/20"

// Better:
className="bg-brand/10 text-brand"
```

#### CRIT-2: Hero Metric Card Template
**Location:** `components/shared/status-stat-card.tsx:49-66`
**Category:** Anti-Patterns
**Description:** Big number + small label + icon + gradient background = classic AI tell
**Impact:** Generic, forgettable, no visual hierarchy
**Recommendation:** Vary the layout. Some cards could be list-style, others could use sparklines, others could be minimal.
**Suggested command:** `/distill`, `/arrange`

#### CRIT-3: Hard-Coded Chart Colors
**Location:**
- `components/dashboard/application-trends-chart.tsx:87,95,109,116`
- `components/dashboard/monthly-statistics-chart.tsx:72,80,94,101`

**Category:** Theming
**Description:** Charts use hex codes (`#3b82f6`, `#64748b`, `#e2e8f0`) instead of design tokens
**Impact:** Charts don't respond to theme changes; inconsistent with rest of UI
**Recommendation:** Use CSS custom properties or design tokens
**Suggested command:** `/normalize`

```tsx
// Current:
colors: ["#3b82f6"]

// Better:
colors: ["hsl(var(--chart-1))"]
```

#### CRIT-4: Monotonous Card Grids
**Location:** All list pages (applications, news-verification)
**Category:** Anti-Patterns
**Description:** Every page uses `grid gap-4 grid-cols-2 lg:grid-cols-4` for status cards
**Impact:** No visual variety; feels like a template
**Recommendation:** Vary layouts per page. Use different compositions.
**Suggested command:** `/arrange`

---

### High-Severity Issues

#### HIGH-1: Tailwind Color Classes Instead of Tokens
**Location:**
- `components/shared/news-status-config.ts:27-51`
- `components/shared/application-status-config.ts:29-55`
- `components/shared/status-badge.tsx:14-17`

**Category:** Theming
**Description:** Status configs use `bg-amber-500/10`, `text-blue-600` instead of semantic tokens
**Impact:** Inconsistent theming; hard to maintain brand identity
**Recommendation:** Map status colors to design tokens (e.g., `bg-status-warning`, `text-status-success`)
**Suggested command:** `/normalize`

#### HIGH-2: Progress Bar Color Logic Hard-Coded
**Location:**
- `app/(dashboard)/applications/page.tsx:67-69`
- `components/applications/sections/application-progress-section.tsx:18-20`

**Category:** Theming
**Description:** Color logic uses Tailwind classes directly: `bg-emerald-500`, `bg-blue-500`, `bg-amber-500`
**Impact:** Duplicated logic; not theme-aware
**Recommendation:** Create a shared utility that returns design token classes
**Suggested command:** `/extract`

#### HIGH-3: Gradient Background Overlays
**Location:** `components/shared/status-stat-card.tsx:38-46`
**Category:** Anti-Patterns
**Description:** Optional gradient overlays on cards using `showGradient` prop
**Impact:** Visual noise; gradients don't add information
**Recommendation:** Remove gradient overlays; use solid colors with better contrast
**Suggested command:** `/quieter`

#### HIGH-4: Workflow Stepper Shadow Blobs
**Location:**
- `components/news-verification/workflow-stepper.tsx:41-42`
- `components/applications/workflow-stepper.tsx:49-50`

**Category:** Anti-Patterns
**Description:** Active/completed steps use colored shadows: `shadow-md shadow-emerald-500/30`
**Impact:** Dated aesthetic; visual clutter
**Recommendation:** Use ring or border for emphasis instead of colored shadows
**Suggested command:** `/quieter`

#### HIGH-5: No Typography Hierarchy
**Location:** Throughout codebase
**Category:** Accessibility
**Description:** All headings use similar weights/sizes; no clear hierarchy
**Impact:** Poor scanability; users can't quickly parse content
**Recommendation:** Establish clear type scale with distinct sizes for H1, H2, H3
**Suggested command:** `/typeset`

---

### Medium-Severity Issues

#### MED-1: Glassmorphism on Headers
**Location:**
- `components/layout/header.tsx:76`
- `components/news-verification/detail-layout.tsx:33`
- `components/applications/application-detail-layout.tsx:33`

**Category:** Anti-Patterns
**Description:** `bg-background/80 backdrop-blur-md` on sticky headers
**Impact:** Can look dated; performance cost on low-end devices
**Recommendation:** Use solid background with subtle border instead
**Suggested command:** `/quieter`

#### MED-2: Color Contrast - Muted Text
**Location:** Throughout - `text-muted-foreground` usage
**Category:** Accessibility
**Description:** Muted text may not meet 4.5:1 contrast ratio on all backgrounds
**Impact:** WCAG AA violation potential
**Recommendation:** Audit contrast ratios; adjust muted-foreground token if needed
**Suggested command:** `/harden`

#### MED-3: Tooltip Theme Hard-Coded
**Location:**
- `components/dashboard/application-trends-chart.tsx:124`
- `components/dashboard/monthly-statistics-chart.tsx:109`

**Category:** Theming
**Description:** `theme: "light"` hard-coded in chart tooltips
**Impact:** Tooltips don't adapt to dark mode
**Recommendation:** Detect theme and pass appropriate value
**Suggested command:** `/harden`

#### MED-4: Touch Target Sizes
**Location:** `components/ui/button.tsx`, icon buttons
**Category:** Accessibility
**Description:** Some icon buttons may be < 44x44px touch targets
**Impact:** Difficult to use on mobile; WCAG 2.1 violation
**Recommendation:** Ensure minimum 44x44px for all interactive elements
**Suggested command:** `/adapt`

#### MED-5: Redundant Section Labels
**Location:** Various pages
**Category:** UX Writing
**Description:** Section labels repeat information visible elsewhere
**Impact:** Visual noise; doesn't add value
**Recommendation:** Remove redundant labels; trust the content
**Suggested command:** `/clarify`

---

### Low-Severity Issues

#### LOW-1: Animation Timing
**Location:** `components/news-verification/workflow-stepper.tsx:47`
**Category:** Performance
**Description:** `transition-all duration-300` on stepper items
**Impact:** Minor performance cost; could use more specific property
**Recommendation:** Use `transition-colors` or `transition-[background-color,box-shadow]`
**Suggested command:** `/optimize`

#### LOW-2: Missing Focus Ring on Custom Elements
**Location:** Various custom interactive components
**Category:** Accessibility
**Description:** Some clickable elements may lack visible focus indicators
**Impact:** Keyboard navigation unclear
**Recommendation:** Ensure all interactive elements have focus-visible styles
**Suggested command:** `/harden`

#### LOW-3: Hard-Coded Instagram Gradient
**Location:**
- `components/community-manager/share-modal.tsx:26`
- `components/community-manager/quick-share-popover.tsx:24`
- `components/community-manager/segments-table.tsx:64`

**Category:** Theming
**Description:** `bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500` for Instagram
**Impact:** Acceptable for brand color, but should be a token
**Recommendation:** Extract to a brand color token
**Suggested command:** `/normalize`

---

## Patterns & Systemic Issues

### 1. Design Token Bypass
**Files affected:** 15+ components
The codebase has a good design token system in `globals.css` but components frequently bypass it with hard-coded Tailwind colors (`bg-blue-500`, `text-emerald-600`). This undermines theming and creates inconsistency.

### 2. Same Template, Different Data
Every list page follows identical structure:
1. PageHeader with gradient icon
2. 4-card status grid
3. Data table with search
4. Empty state fallback

No page has visual identity of its own.

### 3. Gradient Overuse
Gradients appear in:
- Page header icons
- Status card backgrounds
- Workflow stepper lines
- Social media badges
- Logo background

This is the #1 AI slop tell.

### 4. Shadow Tinting
Colored shadows (`shadow-*-500/20`) appear throughout. This is a dated 2020-2022 trend that ages poorly.

---

## Positive Findings

### What's Working Well

1. **Design Token Foundation** - `globals.css` has well-structured OKLCH color tokens
2. **Responsive Layout** - Good use of responsive grid patterns
3. **Loading States** - Proper skeleton components for async content
4. **Error Handling** - Dedicated error states with retry actions
5. **Accessibility Labels** - Workflow steppers have `aria-label`
6. **Semantic Structure** - Good use of `header`, `nav`, `main`, `aside`

### Exemplary Implementations

1. **Sidebar Component** - Clean, functional, good collapse animation
2. **Paginated Table** - Reusable, well-structured
3. **Empty States** - Helpful, descriptive copy

---

## Recommendations by Priority

### Immediate (This Sprint)

| # | Issue | Command | Effort |
|---|-------|---------|--------|
| 1 | Remove gradient icons from page headers | `/distill` | 1h |
| 2 | Fix chart colors to use design tokens | `/normalize` | 2h |
| 3 | Remove gradient overlays from status cards | `/quieter` | 30m |
| 4 | Replace colored shadows with rings | `/quieter` | 1h |

### Short-Term (Next Sprint)

| # | Issue | Command | Effort |
|---|-------|---------|--------|
| 5 | Create semantic status color tokens | `/extract` | 2h |
| 6 | Vary page layouts (break template) | `/arrange` | 4h |
| 7 | Audit and fix contrast ratios | `/harden` | 2h |
| 8 | Add proper focus indicators | `/harden` | 2h |

### Medium-Term (Next 2 Sprints)

| # | Issue | Command | Effort |
|---|-------|---------|--------|
| 9 | Establish typography hierarchy | `/typeset` | 3h |
| 10 | Make charts theme-aware | `/harden` | 2h |
| 11 | Improve mobile touch targets | `/adapt` | 2h |
| 12 | Remove redundant copy | `/clarify` | 1h |

### Long-Term (Nice-to-Have)

| # | Issue | Command | Effort |
|---|-------|---------|--------|
| 13 | Add meaningful micro-interactions | `/animate` | 4h |
| 14 | Create distinctive visual identity | `/bolder` | 8h |
| 15 | Improve empty state designs | `/delight` | 2h |

---

## Suggested Commands Summary

| Command | Issues Addressed |
|---------|------------------|
| `/distill` | Gradient icons, hero metrics template |
| `/quieter` | Gradient overlays, colored shadows, glassmorphism |
| `/normalize` | Hard-coded colors, design token alignment |
| `/arrange` | Monotonous layouts, card grids |
| `/harden` | Contrast, focus indicators, theme awareness |
| `/typeset` | Typography hierarchy |
| `/adapt` | Mobile touch targets |
| `/clarify` | Redundant copy |

---

## Next Steps

1. **Choose a priority** - Start with Immediate items for quick wins
2. **Run suggested commands** - Each command is designed to fix specific issues
3. **Review after each command** - Don't batch too many changes at once
4. **Iterate** - Design improvement is iterative, not one-shot

**Recommended starting point:** `/distill` to remove the gradient icon headers - this single change will dramatically reduce the AI-generated appearance.
