# Phase 05: Vary Layouts & Create Visual Rhythm (/arrange)

**Goal:** Break the identical template pattern across pages - each page should have its own visual identity.

**Impact:** Reduces template feel, improves information hierarchy.

**Prerequisites:** Phase 01-04 must be complete.

---

## Current Pattern (Problem)

Every page has identical structure:

1. PageHeader with icon
2. 4-card status grid (`grid-cols-2 lg:grid-cols-4`)
3. Data table with search
4. Empty state fallback

This creates a monotonous, AI-generated feel.

## Applications Page - Horizontal Metrics Bar

Transform the 4-card grid into a compact horizontal bar.

- [x] Edit `genie-dashboard/src/app/(dashboard)/applications/page.tsx`
  - Replace 4-card grid with horizontal flex layout:

    ```tsx
    // Before:
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {/* Status cards */}
    </div>

    // After:
    <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-border">
      {/* Compact inline metrics */}
    </div>
    ```

  - Use `size="sm"` on StatusStatCard components
  - Add visual separation below metrics
  - Consider: metrics bar as part of table header area

## News Verification Page - Asymmetric Grid

Create visual interest with varied card sizes.

- [x] Edit `genie-dashboard/src/app/(dashboard)/news-verification/page.tsx`
  - Use asymmetric grid layout:
    ```tsx
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {/* First card spans 2 columns */}
      <div className="col-span-2">
        <StatusStatCard config={unverifiedConfig} count={unverified} />
      </div>
      {/* Remaining cards */}
      <StatusStatCard config={approvedConfig} count={approved} />
      <StatusStatCard config={rejectedConfig} count={rejected} />
    </div>
    ```
  - Make the primary action card (Unverified) larger
  - Add a "quick actions" section between header and cards

## Community Manager Page - Dashboard-Style Layout

Break the card grid pattern entirely.

- [ ] Edit `genie-dashboard/src/app/(dashboard)/community-manager/page.tsx`
  - Consider alternative compositions:
    - Option A: Full-width table with inline metrics in header
    - Option B: Two-column layout with segments list and details
    - Option C: Tabs for different views (Segments, Analytics, Schedule)
  - Remove the standard 4-card grid
  - Use inline stats instead: `12 Segments • 3 Scheduled • 8 Published`

## Dashboard Home - Vary the Grid

- [ ] Edit `genie-dashboard/src/app/(dashboard)/page.tsx`
  - Review current 8/4 column split
  - Consider: Make the layout feel less "templated"
  - Options:
    - Vary card heights
    - Add a "quick actions" sidebar
    - Use masonry-style layout for different content types

## Create Spacing Rhythm

Establish consistent but varied spacing patterns.

- [ ] Review and update spacing across pages:
  - Tight grouping: `gap-3` for related items
  - Section separation: `gap-6` or `gap-8` between major sections
  - Page-level: `space-y-8` for main content areas

- [ ] Add visual breathing room:
  - Not every section should have the same gap
  - Use larger gaps to separate distinct content areas
  - Use smaller gaps for grouped items

## Remove Redundant Card Wrappers

Not everything needs a Card component - use spacing and borders instead.

- [ ] Audit all pages for unnecessary Card wrappers:

  ```bash
  grep -r "<Card" genie-dashboard/src/app --include="*.tsx" | grep -v node_modules
  ```

- [ ] Evaluate each Card usage:
  - Does this need a card background?
  - Could this be a simple div with border?
  - Are there nested cards? (card inside card = never)

- [ ] Replace unnecessary Cards with:
  - Simple `<section>` with border-b
  - `<div>` with appropriate padding
  - Semantic grouping with spacing

## Add Page-Specific Identity Elements

Give each page something unique.

- [ ] Applications Page: Add pipeline progress visualization
  - Horizontal progress bar showing overall pipeline status
  - Or: Donut chart showing distribution

- [ ] News Verification Page: Add activity indicator
  - Recent actions timeline
  - Or: "Last updated: X minutes ago" indicator

- [ ] Community Manager Page: Add engagement preview
  - Mini sparklines for segment performance
  - Or: Inline engagement stats per segment

- [ ] Dashboard Home: Add personalized greeting or summary
  - "Good morning, [User]" with date
  - Or: "X items need your attention" summary

---

**Verification:**

- [ ] Each page looks distinctly different at a glance
- [ ] No page has identical 4-card grid + table pattern
- [ ] Squint test: can identify which page you're on without reading text
- [ ] Spacing feels intentional, not uniform

**Visual Check:**

1. Open each page in browser tabs
2. Switch between tabs quickly
3. Each page should have a unique "shape" or composition
4. No page should feel like a copy of another with different data
