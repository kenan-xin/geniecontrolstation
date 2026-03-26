# Phase 03: Reduce Visual Intensity (/quieter)

**Goal:** Remove colored shadows, glassmorphism, and dated visual effects.

**Impact:** More refined, sophisticated corporate aesthetic.

**Prerequisites:** Phase 01 and 02 must be complete.

---

## Remove Colored Shadows

Replace `shadow-*-500/20` patterns with neutral shadows or subtle rings.

- [x] Edit `genie-dashboard/src/components/news-verification/workflow-stepper.tsx`
  - Find any colored shadow patterns like `shadow-md shadow-emerald-500/30`
  - Replace with neutral `shadow-sm` or remove entirely
  - Alternative: use `ring-2 ring-primary/20` for subtle emphasis

- [x] Edit `genie-dashboard/src/components/applications/workflow-stepper.tsx`
  - Same colored shadow removal

- [x] Search and fix remaining colored shadows:

  ```bash
  grep -r "shadow-.*-500/" genie-dashboard/src --include="*.tsx" | grep -v node_modules
  ```

- [x] For each file found, replace with:
  - `shadow-sm` for subtle depth
  - `shadow` for standard depth
  - Or remove shadow entirely if not needed

## Remove Glassmorphism

Replace `backdrop-blur` with solid backgrounds and subtle borders.

- [x] Edit `genie-dashboard/src/components/layout/header.tsx`
  - Find any `bg-background/80 backdrop-blur-md` patterns
  - Replace with solid `bg-background border-b border-border`

- [x] Edit `genie-dashboard/src/components/news-verification/detail-layout.tsx`
  - Find and remove `backdrop-blur` usage
  - Replace with solid background

- [x] Edit `genie-dashboard/src/components/applications/application-detail-layout.tsx`
  - Same glassmorphism removal

- [x] Search for remaining backdrop-blur:
  ```bash
  grep -r "backdrop-blur" genie-dashboard/src --include="*.tsx" | grep -v "dialog\|sheet\|node_modules"
  ```

## Keep Functional Backdrop-Blur

These locations are acceptable (modals/dialogs need backdrop for focus):

- [x] Verify `genie-dashboard/src/components/ui/dialog.tsx` - keep backdrop-blur on overlay
- [x] Verify `genie-dashboard/src/components/ui/sheet.tsx` - keep backdrop-blur on overlay
- [x] Verify `genie-dashboard/src/components/ui/popover.tsx` - keep if used for modal-like behavior

## Reduce Shadow Intensity

- [x] Audit shadow usage across components:

  ```bash
  grep -r "shadow-" genie-dashboard/src/components --include="*.tsx" | grep -v "shadow-sm\|shadow-xs\|node_modules"
  ```

- [x] Replace heavy shadows with lighter alternatives:
  - `shadow-lg` → `shadow` or `shadow-sm`
  - `shadow-xl` → `shadow` or `shadow-md`
  - `shadow-2xl` → `shadow-lg` (rare cases only)

## Simplify Card Shadows

- [x] Edit `genie-dashboard/src/components/ui/card.tsx`
  - Ensure default shadow is subtle (`shadow-sm` or none)
  - Cards should feel light, not heavy

- [x] Check card shadow hover states:
  - `hover:shadow-md` is acceptable
  - `hover:shadow-lg` should be `hover:shadow`

## Remove Colored Ring Emphasis

- [x] Search for colored rings:

  ```bash
  grep -r "ring-.*-500" genie-dashboard/src --include="*.tsx" | grep -v node_modules
  ```

- [x] Replace with neutral or primary rings:
  - `ring-blue-500` → `ring-primary`
  - `ring-emerald-500` → `ring-primary`
  - Keep only if semantically meaningful (e.g., success states)

---

**Verification:** After changes:

```bash
# Check for remaining colored shadows
grep -r "shadow-.*-500/" genie-dashboard/src --include="*.tsx" | grep -v node_modules

# Check for remaining glassmorphism (excluding dialogs/sheets)
grep -r "backdrop-blur" genie-dashboard/src --include="*.tsx" | grep -v "dialog\|sheet\|node_modules"

# Check for heavy shadows
grep -r "shadow-xl\|shadow-2xl" genie-dashboard/src --include="*.tsx" | grep -v node_modules
```

**Success Criteria:**

- [x] No colored shadows anywhere
- [x] No glassmorphism except in modals/dialogs
- [x] Shadows are subtle and neutral
- [x] UI feels clean and professional
