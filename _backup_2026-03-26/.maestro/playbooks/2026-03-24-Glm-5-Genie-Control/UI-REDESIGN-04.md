# Phase 04: Align with Design Tokens (/normalize)

**Goal:** Replace hard-coded colors with design system tokens for consistent theming.

**Impact:** Theme-aware, maintainable, professional color system.

**Prerequisites:** Phase 01, 02, and 03 must be complete.

---

## Add Semantic Status Color Tokens

Create status-specific CSS custom properties for consistent theming.

- [x] Edit `genie-dashboard/src/app/globals.css` - Add to `:root` block after chart colors:

  ```css
  /* Semantic Status Colors - Muted Corporate Palette */
  --status-error: oklch(0.5 0.15 25);
  --status-error-muted: oklch(0.5 0.15 25 / 10%);
  --status-warning: oklch(0.65 0.1 80);
  --status-warning-muted: oklch(0.65 0.1 80 / 10%);
  --status-info: oklch(0.5 0.08 250);
  --status-info-muted: oklch(0.5 0.08 250 / 10%);
  --status-success: oklch(0.55 0.1 160);
  --status-success-muted: oklch(0.55 0.1 160 / 10%);
  --status-neutral: oklch(0.45 0.02 250);
  --status-neutral-muted: oklch(0.45 0.02 250 / 10%);
  ```

- [x] Edit `genie-dashboard/src/app/globals.css` - Add to `.dark` block:

  ```css
  /* Semantic Status Colors - Dark Mode */
  --status-error: oklch(0.6 0.18 25);
  --status-error-muted: oklch(0.6 0.18 25 / 15%);
  --status-warning: oklch(0.72 0.12 80);
  --status-warning-muted: oklch(0.72 0.12 80 / 15%);
  --status-info: oklch(0.6 0.1 250);
  --status-info-muted: oklch(0.6 0.1 250 / 15%);
  --status-success: oklch(0.62 0.12 160);
  --status-success-muted: oklch(0.62 0.12 160 / 15%);
  --status-neutral: oklch(0.55 0.02 250);
  --status-neutral-muted: oklch(0.55 0.02 250 / 15%);
  ```

- [x] Edit `genie-dashboard/src/app/globals.css` - Register tokens in `@theme inline`:
  ```css
  --color-status-error: var(--status-error);
  --color-status-error-muted: var(--status-error-muted);
  --color-status-warning: var(--status-warning);
  --color-status-warning-muted: var(--status-warning-muted);
  --color-status-info: var(--status-info);
  --color-status-info-muted: var(--status-info-muted);
  --color-status-success: var(--status-success);
  --color-status-success-muted: var(--status-success-muted);
  --color-status-neutral: var(--status-neutral);
  --color-status-neutral-muted: var(--status-neutral-muted);
  ```

## Update Status Configs to Use Tokens

Replace hard-coded Tailwind classes with semantic token classes.

- [x] Edit `genie-dashboard/src/components/shared/news-status-config.ts`
  - Replace color classes:
    - `text-red-600` → `text-status-error`
    - `bg-red-500/10` → `bg-status-error-muted`
    - `border-l-red-600` → `border-l-status-error`
    - `text-amber-600` → `text-status-warning`
    - `bg-amber-500/10` → `bg-status-warning-muted`
    - `border-l-amber-600` → `border-l-status-warning`
    - `text-blue-600` → `text-status-info`
    - `bg-blue-500/10` → `bg-status-info-muted`
    - `border-l-blue-600` → `border-l-status-info`
    - `text-emerald-600` → `text-status-success`
    - `bg-emerald-500/10` → `bg-status-success-muted`
    - `border-l-emerald-600` → `border-l-status-success`

- [x] Edit `genie-dashboard/src/components/shared/application-status-config.ts`
  - Same token replacements
  - `text-slate-600` → `text-status-neutral`
  - `bg-slate-500/10` → `bg-status-neutral-muted`
  - `border-l-slate-600` → `border-l-status-neutral`

## Fix Chart Hard-Coded Colors

Create a utility for theme-aware chart colors.

- [x] Create `genie-dashboard/src/lib/chart-theme.ts`:

  ```typescript
  export function getChartColors() {
    if (typeof document === 'undefined') {
      return {
        primary: 'oklch(0.45 0.08 250)',
        secondary: 'oklch(0.55 0.06 250)',
        muted: 'oklch(0.50 0.02 250)',
        border: 'oklch(0.90 0.005 250)',
        background: 'oklch(0.985 0.002 250)'
      };
    }
    const styles = getComputedStyle(document.documentElement);
    return {
      primary: styles.getPropertyValue('--chart-1').trim() || 'oklch(0.45 0.08 250)',
      secondary: styles.getPropertyValue('--chart-2').trim() || 'oklch(0.55 0.06 250)',
      muted: styles.getPropertyValue('--muted-foreground').trim() || 'oklch(0.50 0.02 250)',
      border: styles.getPropertyValue('--border').trim() || 'oklch(0.90 0.005 250)',
      background: styles.getPropertyValue('--background').trim() || 'oklch(0.985 0.002 250)'
    };
  }

  export function getChartTheme(): 'light' | 'dark' {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
  ```

- [x] Edit `genie-dashboard/src/components/dashboard/application-trends-chart.tsx`
  - Import `getChartColors` and `getChartTheme` from `@/lib/chart-theme`
  - Replace `colors: ["#3b82f6"]` with `colors: [chartColors.primary]`
  - Replace hard-coded label colors with `chartColors.muted`
  - Replace hard-coded grid color with `chartColors.border`
  - Replace `theme: "light"` with `theme: getChartTheme()`

- [x] Edit `genie-dashboard/src/components/dashboard/monthly-statistics-chart.tsx`
  - Same hard-coded color replacements

## Create Progress Color Utility

Centralize progress bar color logic.

- [x] Create `genie-dashboard/src/lib/status-colors.ts`:

  ```typescript
  export function getProgressColor(percent: number): string {
    if (percent >= 80) return 'bg-status-success';
    if (percent >= 50) return 'bg-status-info';
    if (percent >= 25) return 'bg-status-warning';
    return 'bg-status-error';
  }
  ```

- [x] Edit `genie-dashboard/src/app/(dashboard)/applications/page.tsx`
  - Import and use `getProgressColor` utility
  - Replace inline color logic

- [x] Edit `genie-dashboard/src/components/applications/sections/application-progress-section.tsx`
  - Same utility usage for progress bar colors

## Audit Remaining Hard-Coded Colors

- [x] Search for remaining hard-coded colors:

  ```bash
  grep -r "#[0-9a-fA-F]\{6\}" genie-dashboard/src --include="*.tsx" | grep -v node_modules
  ```

- [x] Search for remaining Tailwind color classes in components:

  ```bash
  grep -r "text-red-\|text-amber-\|text-blue-\|text-emerald-\|text-green-\|text-purple-\|text-orange-" genie-dashboard/src/components --include="*.tsx" | grep -v node_modules
  ```

---

**Verification:** After changes:

```bash
# Check for remaining hard-coded hex in charts
grep -r "#[0-9a-fA-F]\{6\}" genie-dashboard/src --include="*.tsx" | grep -v node_modules

# Check Tailwind color classes are replaced with tokens
grep -r "text-red-600\|text-amber-600\|text-blue-600\|text-emerald-600" genie-dashboard/src/components/shared --include="*.ts"

# Verify status tokens are registered
grep "status-error\|status-warning\|status-info\|status-success" genie-dashboard/src/app/globals.css
```

**Success Criteria:**

- [x] All status colors use semantic tokens
- [x] Charts use theme-aware colors
- [x] Progress bars use centralized utility
- [x] No hard-coded hex colors in components (note: channel-display-section.tsx has intentional Telegram-style colors)
- [x] Theme switching works correctly for all colors

---

**Completed:** 2026-03-24

**Notes:**

- Status tokens added for light/dark modes in globals.css
- chart-theme.ts utility created for theme-aware chart colors
- status-colors.ts utility created for centralized progress bar colors
- Application and news status configs updated to use semantic tokens
- Remaining hex colors in channel-display-section.tsx are intentional (Telegram channel styling)
