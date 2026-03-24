# Phase 3: Align with Design Tokens (/normalize)

**Goal:** Replace hard-coded colors with design system tokens

**Impact:** Theme-aware, consistent, maintainable styling

---

## Create Semantic Status Color Tokens

Add status-specific CSS custom properties to globals.css.

- [ ] Edit `genie-dashboard/src/app/globals.css`
  - Add semantic status tokens to `:root` block:
    ```css
    --status-error: oklch(0.577 0.245 27.325);
    --status-error-muted: oklch(0.577 0.245 27.325 / 10%);
    --status-warning: oklch(0.75 0.15 80);
    --status-warning-muted: oklch(0.75 0.15 80 / 10%);
    --status-info: oklch(0.65 0.18 250);
    --status-info-muted: oklch(0.65 0.18 250 / 10%);
    --status-success: oklch(0.70 0.15 160);
    --status-success-muted: oklch(0.70 0.15 160 / 10%);
    --status-neutral: oklch(0.50 0.01 260);
    --status-neutral-muted: oklch(0.50 0.01 260 / 10%);
    ```
  - Add corresponding dark mode values in `.dark` block

- [ ] Edit `genie-dashboard/src/app/globals.css` - @theme section
  - Register the new tokens:
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

- [ ] Edit `genie-dashboard/src/components/shared/news-status-config.ts`
  - Replace hard-coded Tailwind classes with token classes:
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

- [ ] Edit `genie-dashboard/src/components/shared/application-status-config.ts`
  - Same token replacements for all status entries
  - `text-slate-600` → `text-status-neutral`
  - `bg-slate-500/10` → `bg-status-neutral-muted`
  - `border-l-slate-600` → `border-l-status-neutral`

## Fix Chart Hard-Coded Colors

- [ ] Edit `genie-dashboard/src/components/dashboard/application-trends-chart.tsx`
  - Replace `colors: ["#3b82f6"]` with CSS variable approach
  - Create a helper to get CSS variable values for ApexCharts
  - Replace hard-coded label colors `#64748b` → use `getComputedStyle`
  - Replace hard-coded grid color `#e2e8f0` → use design token
  - Replace `theme: "light"` with dynamic theme detection

- [ ] Edit `genie-dashboard/src/components/dashboard/monthly-statistics-chart.tsx`
  - Same hard-coded color replacements

## Create Chart Theme Utility

- [ ] Create `genie-dashboard/src/lib/chart-theme.ts`
  ```typescript
  export function getChartColors() {
    const styles = getComputedStyle(document.documentElement);
    return {
      primary: styles.getPropertyValue('--chart-1').trim(),
      secondary: styles.getPropertyValue('--chart-2').trim(),
      muted: styles.getPropertyValue('--muted-foreground').trim(),
      border: styles.getPropertyValue('--border').trim(),
    };
  }

  export function getChartTheme(): 'light' |dark' {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
  ```

## Update Progress Bar Color Logic

- [ ] Create `genie-dashboard/src/lib/status-colors.ts`
  - Export utility function `getProgressColor(percent: number): string`
  - Return semantic token classes based on threshold

- [ ] Edit `genie-dashboard/src/app/(dashboard)/applications/page.tsx`
  - Import and use `getProgressColor` utility
  - Replace inline color logic (lines 67-69)

- [ ] Edit `genie-dashboard/src/components/applications/sections/application-progress-section.tsx`
  - Same utility usage for progress bar colors

---

**Verification:** After changes:
```bash
# Check for remaining hard-coded hex in charts
grep -r "#[0-9a-fA-F]\{6\}" genie-dashboard/src --include="*.tsx" | grep -v node_modules

# Check Tailwind color classes are replaced with tokens
grep -r "text-red-600\|text-amber-600\|text-blue-600\|text-emerald-600" genie-dashboard/src/components/shared --include="*.ts"
```
