# Phase 06: Verification & Final Polish

**Goal:** Ensure all changes work correctly, UI is cohesive, and the new corporate theme is complete.

**Prerequisites:** Phase 01-05 must be complete.

---

## Build & Type Check

- [ ] Run build to catch any TypeScript errors:
  ```bash
  cd genie-dashboard && npm run build
  ```
  - Fix any TypeScript errors from interface changes
  - Ensure all imports resolve correctly
  - Check for unused variable warnings

## Visual Verification - Light Theme

- [ ] Start dev server:
  ```bash
  cd genie-dashboard && npm run dev
  ```

- [ ] Check Dashboard Home page:
  - Light gray background
  - White cards with subtle shadows
  - Muted slate blue accents
  - No gradient icons
  - No colored shadows
  - Layout is distinct

- [ ] Check Applications page:
  - Same theme criteria
  - Horizontal metrics bar (not 4-card grid)
  - Status colors use semantic tokens

- [ ] Check News Verification page:
  - Same theme criteria
  - Asymmetric grid layout
  - No AI-slop patterns

- [ ] Check Community Manager page:
  - Same theme criteria
  - Different composition from other pages
  - Clean, corporate feel

## Visual Verification - Dark Theme

- [ ] Toggle to dark mode
- [ ] Verify sidebar is darker but not black
- [ ] Verify all status colors adapt properly
- [ ] Verify charts render in dark mode
- [ ] Check contrast ratios are acceptable
- [ ] Ensure text is readable in all states

## Sidebar Verification

- [ ] Desktop sidebar:
  - Light gray background (not dark)
  - Muted slate blue active state
  - No gradient logo
  - Clean, minimal design

- [ ] Mobile sidebar:
  - Same treatment as desktop
  - Proper close button
  - No visual glitches

## Chart Verification

- [ ] Application Trends chart:
  - Uses theme colors
  - Responsive to dark/light mode
  - No hard-coded hex colors visible

- [ ] Monthly Statistics chart:
  - Same criteria as above

## Accessibility Quick Check

- [ ] Run Lighthouse accessibility audit:
  ```bash
  # In Chrome DevTools > Lighthouse > Accessibility
  ```

- [ ] Verify focus states are visible:
  - Tab through all interactive elements
  - Focus ring should be visible
  - No invisible focus states

- [ ] Check color contrast:
  - Status text on backgrounds
  - Muted text on cards
  - Primary button text

## Comprehensive Grep Verification

Run all verification commands to ensure no regressions:

- [ ] No gold/amber brand colors:
  ```bash
  grep -r "oklch.*0.78.*0.145.*65\|amber-500\|orange-500" genie-dashboard/src --include="*.tsx" --include="*.css" | grep -v node_modules
  ```

- [ ] No dark sidebar in light mode:
  ```bash
  grep "sidebar: oklch(0.14" genie-dashboard/src/app/globals.css
  # Should NOT be in :root block
  ```

- [ ] No gradient patterns in page headers:
  ```bash
  grep -r "from-.*-500 to-.*-500" genie-dashboard/src --include="*.tsx" | grep -v node_modules
  ```

- [ ] No colored shadows:
  ```bash
  grep -r "shadow-.*-500/" genie-dashboard/src --include="*.tsx" | grep -v node_modules
  ```

- [ ] No hard-coded hex in charts:
  ```bash
  grep -r "#[0-9a-fA-F]\{6\}" genie-dashboard/src --include="*.tsx" | grep -v node_modules
  ```

- [ ] Status configs use tokens:
  ```bash
  grep -r "text-red-600\|text-amber-600\|text-blue-600\|text-emerald-600" genie-dashboard/src/components/shared --include="*.ts"
  ```

- [ ] No glassmorphism (except dialogs/sheets):
  ```bash
  grep -r "backdrop-blur" genie-dashboard/src --include="*.tsx" | grep -v "dialog\|sheet\|node_modules"
  ```

## Clean Up

- [ ] Remove any unused props/interfaces from components
- [ ] Remove unused imports
- [ ] Ensure no dead code from removed features
- [ ] Check for console.log statements to remove

## Final Screenshot Comparison

- [ ] Take screenshot of each page in light mode
- [ ] Take screenshot of each page in dark mode
- [ ] Compare to reference screenshot for aesthetic alignment
- [ ] Verify corporate, low-profile feel is achieved

---

**Success Criteria:**
- [ ] Build passes with no errors
- [ ] Theme is light corporate slate blue
- [ ] Sidebar is light (not dark)
- [ ] No AI-slop tells remain
- [ ] Each page has distinct visual identity
- [ ] Theme switching works correctly
- [ ] No regressions in functionality
- [ ] Accessibility score is acceptable (80+)
- [ ] UI matches the corporate, low-profile aesthetic requested

**Final Output:**
A clean, professional corporate dashboard with:
- Light theme as default
- Muted slate blue brand color
- Minimal gradients and visual noise
- Consistent design tokens
- Varied page layouts
- Accessible and responsive
