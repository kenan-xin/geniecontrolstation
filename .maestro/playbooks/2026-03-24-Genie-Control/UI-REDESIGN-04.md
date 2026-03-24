# Phase 4: Vary Layouts & Create Visual Rhythm (/arrange)

**Goal:** Break the identical template pattern across pages

**Impact:** Each page gets its own visual identity

---

## Current Pattern (Problem)

Every page has identical structure:
1. PageHeader with gradient icon
2. 4-card status grid (`grid-cols-2 lg:grid-cols-4`)
3. Data table with search
4. Empty state fallback

## Design Varied Layouts Per Page

### Applications Page - Horizontal Metrics Bar

- [ ] Edit `genie-dashboard/src/app/(dashboard)/applications/page.tsx`
  - Replace 4-card grid with horizontal metrics bar
  - Use `flex flex-wrap gap-4` instead of `grid grid-cols-4`
  - Make metrics more compact (use `size="sm"` on StatusStatCard)
  - Consider: metrics bar above table, not as separate section
  - Add visual separation: subtle border below metrics

### News Verification Page - Asymmetric Layout

- [ ] Edit `genie-dashboard/src/app/(dashboard)/news-verification/page.tsx`
  - Keep status cards but use `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` with varied card sizes
  - Make first card (Unverified) larger: `col-span-2` on desktop
  - Add a "quick actions" section between header and cards
  - Vary spacing: use `gap-6` between sections instead of `gap-4`

### Community Manager Page - Dashboard-Style Layout

- [ ] Edit `genie-dashboard/src/app/(dashboard)/community-manager/page.tsx`
  - Use a different composition entirely
  - Consider: left sidebar with segments, right side with content
  - Or: full-width table with inline metrics in header
  - Break the card grid pattern completely

## Create Spacing Rhythm

- [ ] Establish section spacing pattern in shared styles
  - Tight grouping: `gap-3` for related items
  - Section separation: `gap-8` or `gap-10` between major sections
  - Not every section should use the same gap

## Page-Specific Identity Elements

- [ ] Applications Page: Add progress summary section
  - Show overall pipeline progress visually
  - Use a horizontal bar or donut chart

- [ ] News Verification Page: Add activity feed or recent actions
  - Breaks the card-grid-table pattern
  - Shows temporal information

- [ ] Community Manager Page: Highlight engagement metrics
  - Use inline stats instead of separate cards
  - Consider sparklines for trends

## Remove Redundant Card Wrappers

Not everything needs a Card component.

- [ ] Audit all pages for unnecessary Card wrappers
- [ ] Use spacing and borders for visual grouping where appropriate
- [ ] Remove nested cards (card inside card = never)

---

**Verification:**
- [ ] Each page should look distinctly different at a glance
- [ ] No page should have identical 4-card grid + table pattern
- [ ] Squint test: can identify which page you're on without reading text
