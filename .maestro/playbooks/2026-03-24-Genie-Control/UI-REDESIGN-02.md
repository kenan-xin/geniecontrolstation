# Phase 2: Reduce Visual Intensity (/quieter)

**Goal:** Remove colored shadows, glassmorphism, and dated visual effects

**Impact:** More refined, sophisticated aesthetic

---

## Remove Colored Shadows

Replace `shadow-*-500/20` patterns with neutral shadows or rings.

- [ ] Edit `genie-dashboard/src/components/news-verification/workflow-stepper.tsx`
  - Find `shadow-md shadow-emerald-500/30` (around line 41-42)
  - Replace with `ring-2 ring-emerald-500/30` or remove entirely

- [ ] Edit `genie-dashboard/src/components/applications/workflow-stepper.tsx`
  - Find `shadow-md shadow-*-500/30` patterns (around line 49-50)
  - Same replacement: use ring or remove

- [ ] Edit `genie-dashboard/src/app/(dashboard)/news-verification/page.tsx`
  - Find any colored shadow on status cards or headers
  - Replace with neutral `shadow-sm` or remove

- [ ] Edit `genie-dashboard/src/app/(dashboard)/applications/page.tsx`
  - Same colored shadow removal

- [ ] Edit `genie-dashboard/src/app/(dashboard)/community-manager/page.tsx`
  - Same colored shadow removal

- [ ] Edit `genie-dashboard/src/components/community-manager/media-player.tsx`
  - Find and remove colored shadow patterns

## Remove Glassmorphism

Replace `backdrop-blur` with solid backgrounds and subtle borders.

- [ ] Edit `genie-dashboard/src/components/layout/header.tsx`
  - Find `bg-background/80 backdrop-blur-md` (around line 76)
  - Replace with solid `bg-background border-b`

- [ ] Edit `genie-dashboard/src/components/news-verification/detail-layout.tsx`
  - Find `backdrop-blur` usage (around line 33)
  - Replace with solid background

- [ ] Edit `genie-dashboard/src/components/applications/application-detail-layout.tsx`
  - Same glassmorphism removal

- [ ] Edit `genie-dashboard/src/components/applications/detail-layout.tsx`
  - Same glassmorphism removal

## Keep Backdrop-Blur Only Where Functional

These locations are acceptable (modals/dialogs need backdrop for focus):

- [ ] Verify `genie-dashboard/src/components/ui/dialog.tsx` - keep backdrop-blur on overlay
- [ ] Verify `genie-dashboard/src/components/ui/sheet.tsx` - keep backdrop-blur on overlay

## Gradient Overlays on Status Cards

Already addressed in Phase 1, but verify:

- [ ] Confirm `status-stat-card.tsx` has no gradient overlay rendering
- [ ] Confirm no `showGradient` prop usage remains anywhere

---

**Verification:** After changes, run:
```bash
# Check for remaining colored shadows
grep -r "shadow-.*-500/" genie-dashboard/src --include="*.tsx" | grep -v node_modules

# Check for remaining glassmorphism (excluding dialogs/sheets)
grep -r "backdrop-blur" genie-dashboard/src --include="*.tsx" | grep -v "dialog\|sheet\|node_modules"
```
