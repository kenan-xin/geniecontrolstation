# Phase 01: Theme Overhaul - Light Corporate Slate Blue

**Goal:** Transform the entire color palette from gold/black to a clean, light corporate theme with muted slate blue accents.

**Impact:** Immediate visual transformation - biggest impact on user perception.

**Target Aesthetic:**

- Light gray/white background throughout
- Light sidebar (not dark)
- Muted slate blue brand color (subtle, not attention-grabbing)
- White cards with neutral shadows
- Minimal color, mostly grayscale with strategic blue accents
- No gradients, no bold colors

---

## Update Core Theme Variables

Replace the gold/amber brand with muted slate blue. Change dark sidebar to light.

- [ ] Edit `genie-dashboard/src/app/globals.css` - Replace entire `:root` block:

  ```css
  :root {
    /* Base */
    --background: oklch(0.985 0.002 250);
    --foreground: oklch(0.2 0.02 250);

    /* Cards & Popovers - White */
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.2 0.02 250);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.2 0.02 250);

    /* Primary - Muted Slate Blue */
    --primary: oklch(0.45 0.08 250);
    --primary-foreground: oklch(0.98 0.002 250);

    /* Secondary & Muted */
    --secondary: oklch(0.96 0.005 250);
    --secondary-foreground: oklch(0.25 0.02 250);
    --muted: oklch(0.96 0.005 250);
    --muted-foreground: oklch(0.5 0.02 250);

    /* Accent */
    --accent: oklch(0.94 0.008 250);
    --accent-foreground: oklch(0.25 0.02 250);

    /* Destructive */
    --destructive: oklch(0.55 0.2 25);

    /* Borders & Inputs */
    --border: oklch(0.9 0.005 250);
    --input: oklch(0.9 0.005 250);
    --ring: oklch(0.45 0.08 250);

    /* Brand - Muted Slate Blue (low chroma) */
    --brand: oklch(0.45 0.08 250);
    --brand-foreground: oklch(0.98 0.002 250);
    --brand-muted: oklch(0.45 0.08 250 / 8%);

    /* Charts - Muted palette */
    --chart-1: oklch(0.45 0.08 250);
    --chart-2: oklch(0.55 0.06 250);
    --chart-3: oklch(0.6 0.05 200);
    --chart-4: oklch(0.5 0.04 30);
    --chart-5: oklch(0.55 0.05 300);

    --radius: 0.5rem;

    /* Sidebar - LIGHT theme */
    --sidebar: oklch(0.98 0.002 250);
    --sidebar-foreground: oklch(0.25 0.02 250);
    --sidebar-primary: oklch(0.45 0.08 250);
    --sidebar-primary-foreground: oklch(0.98 0.002 250);
    --sidebar-accent: oklch(0.94 0.008 250);
    --sidebar-accent-foreground: oklch(0.25 0.02 250);
    --sidebar-border: oklch(0.9 0.005 250);
    --sidebar-ring: oklch(0.45 0.08 250);
  }
  ```

- [ ] Edit `genie-dashboard/src/app/globals.css` - Update `.dark` block:

  ```css
  .dark {
    /* Base */
    --background: oklch(0.12 0.015 250);
    --foreground: oklch(0.92 0.005 250);

    /* Cards & Popovers */
    --card: oklch(0.16 0.015 250);
    --card-foreground: oklch(0.92 0.005 250);
    --popover: oklch(0.16 0.015 250);
    --popover-foreground: oklch(0.92 0.005 250);

    /* Primary - Slightly lighter in dark mode */
    --primary: oklch(0.55 0.1 250);
    --primary-foreground: oklch(0.12 0.015 250);

    /* Secondary & Muted */
    --secondary: oklch(0.22 0.015 250);
    --secondary-foreground: oklch(0.92 0.005 250);
    --muted: oklch(0.22 0.015 250);
    --muted-foreground: oklch(0.6 0.02 250);

    /* Accent */
    --accent: oklch(0.25 0.02 250);
    --accent-foreground: oklch(0.92 0.005 250);

    /* Destructive */
    --destructive: oklch(0.65 0.18 25);

    /* Borders & Inputs */
    --border: oklch(0.28 0.015 250);
    --input: oklch(0.28 0.015 250);
    --ring: oklch(0.55 0.1 250);

    /* Brand */
    --brand: oklch(0.55 0.1 250);
    --brand-foreground: oklch(0.12 0.015 250);
    --brand-muted: oklch(0.55 0.1 250 / 12%);

    /* Charts */
    --chart-1: oklch(0.55 0.1 250);
    --chart-2: oklch(0.6 0.08 250);
    --chart-3: oklch(0.65 0.06 200);
    --chart-4: oklch(0.55 0.05 30);
    --chart-5: oklch(0.6 0.06 300);

    /* Sidebar - Darker in dark mode but not black */
    --sidebar: oklch(0.14 0.015 250);
    --sidebar-foreground: oklch(0.88 0.005 250);
    --sidebar-primary: oklch(0.55 0.1 250);
    --sidebar-primary-foreground: oklch(0.12 0.015 250);
    --sidebar-accent: oklch(0.22 0.02 250);
    --sidebar-accent-foreground: oklch(0.92 0.005 250);
    --sidebar-border: oklch(0.25 0.015 250);
    --sidebar-ring: oklch(0.55 0.1 250);
  }
  ```

## Update Sidebar Component - Remove Gradient Logo

- [ ] Edit `genie-dashboard/src/components/layout/sidebar.tsx`
  - Remove gradient from logo box (line 90):

    ```tsx
    // Before:
    <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 shadow-md shadow-sidebar-primary/20">

    // After:
    <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
    ```

  - Same change for mobile sidebar logo (line 138)
  - Remove colored shadow, use solid background

## Update Page Header - Remove Gradients

- [ ] Edit `genie-dashboard/src/components/shared/page-header.tsx`
  - Remove `gradient` prop from interface (lines 11-15)
  - Replace gradient icon box with simple muted background:

    ```tsx
    // Before:
    <div className={cn("flex size-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-md", gradient.from, gradient.to, gradient.shadow)}>
      <Icon className="size-5 text-white" />
    </div>

    // After:
    <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
      <Icon className="size-5" />
    </div>
    ```

  - Icon should use muted-foreground color, not white

## Update Status Stat Card - Remove Gradient

- [ ] Edit `genie-dashboard/src/components/shared/status-stat-card.tsx`
  - Remove `showGradient` prop from interface (line 20)
  - Remove gradient rendering logic (lines 38, 41-48)
  - Card should use solid white background only

## Update Status Configs - Remove Gradient Property

- [x] Edit `genie-dashboard/src/components/shared/news-status-config.ts`
  - Remove `gradient` property from `StatusConfig` interface
  - Remove `gradient` values from all status entries

- [x] Edit `genie-dashboard/src/components/shared/application-status-config.ts`
  - Remove `gradient` property from `AppStatusConfig` interface
  - Remove `gradient` values from all status entries

## Update Chart Colors

- [ ] Edit `genie-dashboard/src/components/dashboard/application-trends-chart.tsx`
  - Replace hard-coded `#3b82f6` with CSS variable approach
  - Use muted chart colors from theme

- [ ] Edit `genie-dashboard/src/components/dashboard/monthly-statistics-chart.tsx`
  - Same hard-coded color replacements

## Update Page-Level Components

- [ ] Edit `genie-dashboard/src/app/(dashboard)/news-verification/page.tsx`
  - Remove `gradient` prop from PageHeader component call

- [ ] Edit `genie-dashboard/src/app/(dashboard)/applications/page.tsx`
  - Remove `gradient` prop from PageHeader component call

- [ ] Edit `genie-dashboard/src/app/(dashboard)/community-manager/page.tsx`
  - Remove `gradient` prop from PageHeader component call

---

**Verification:** After changes:

```bash
# Start dev server
cd genie-dashboard && npm run dev

# Check for remaining gold/amber colors
grep -r "oklch.*0.78.*0.145.*65\|amber-500\|orange-500" genie-dashboard/src --include="*.tsx" --include="*.css" | grep -v node_modules

# Check for remaining dark sidebar reference
grep -r "oklch(0.14" genie-dashboard/src/app/globals.css
```

**Visual Check:**

- [ ] Sidebar is light gray, not dark
- [ ] Brand color is muted slate blue, not gold
- [ ] No gradient icons anywhere
- [ ] Cards are white with neutral shadows
- [ ] Overall look is clean, corporate, low-profile
