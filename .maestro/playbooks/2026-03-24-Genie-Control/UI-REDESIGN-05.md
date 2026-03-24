# Phase 5: Verification & Final Polish

**Goal:** Ensure all changes work correctly and UI is cohesive

---

## Build & Type Check

- [ ] Run `cd genie-dashboard && npm run build`
  - Fix any TypeScript errors from interface changes
  - Ensure all imports resolve correctly

## Visual Verification

- [ ] Start dev server: `cd genie-dashboard && npm run dev`
- [ ] Check Applications page
  - No gradient icons
  - No colored shadows
  - Status colors use tokens
  - Layout is distinct from other pages

- [ ] Check News Verification page
  - Same criteria as above
  - Asymmetric layout visible

- [ ] Check Community Manager page
  - Same criteria as above
  - Different composition from other pages

## Theme Verification

- [ ] Toggle to dark mode
- [ ] Verify all status colors adapt properly
- [ ] Verify charts render in dark mode
- [ ] Check contrast ratios are acceptable

## Accessibility Quick Check

- [ ] Run Lighthouse accessibility audit
- [ ] Verify focus states are visible
- [ ] Check color contrast for status text

## Clean Up

- [ ] Remove any unused gradient-related props/interfaces
- [ ] Remove unused `showGradient` references
- [ ] Ensure no dead code from removed features

## Final grep Verification

Run all verification commands from previous phases:

```bash
# No gradient patterns in page headers
grep -r "from-.*-500 to-.*-500" genie-dashboard/src --include="*.tsx" | grep -v node_modules

# No colored shadows (except intentional brand moments)
grep -r "shadow-.*-500/" genie-dashboard/src --include="*.tsx" | grep -v node_modules

# No hard-coded hex in charts
grep -r "#[0-9a-fA-F]\{6\}" genie-dashboard/src --include="*.tsx" | grep -v node_modules

# Status configs use tokens
grep -r "text-red-600\|text-amber-600\|text-blue-600\|text-emerald-600" genie-dashboard/src/components/shared --include="*.ts"
```

---

**Success Criteria:**
- [ ] Build passes with no errors
- [ ] All 4 design skill objectives achieved
- [ ] No AI-slop tells remain (gradient icons, hero metrics, identical grids)
- [ ] Each page has distinct visual identity
- [ ] Theme switching works correctly
- [ ] No regressions in functionality
