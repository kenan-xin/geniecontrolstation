# Phase 1: Remove AI Slop Patterns (/distill)

**Goal:** Strip gradient icons, hero metric templates, and unnecessary visual complexity

**Impact:** Biggest reduction in AI-generated appearance

---

## Page Header Icons

Replace gradient icon backgrounds with subtle, brand-aligned treatment.

- [x] Edit `genie-dashboard/src/components/shared/page-header.tsx`
  - Remove `gradient` prop from interface (lines 11-15)
  - Replace gradient icon box with `bg-brand-muted text-brand` treatment
  - Remove `shadow-md` and gradient classes (lines 32-38)
  - Target: Icon box should be `bg-brand/10 text-brand rounded-xl`

## Status Stat Cards

Remove gradient overlays and simplify the hero metric template.

- [ ] Edit `genie-dashboard/src/components/shared/status-stat-card.tsx`
  - Remove `showGradient` prop and all gradient rendering logic (lines 20-21, 27-28, 38, 41-48)
  - Keep the card but remove visual noise
  - Card should use solid background only

## Status Configs - Remove Gradient Properties

- [ ] Edit `genie-dashboard/src/components/shared/news-status-config.ts`
  - Remove `gradient` property from `StatusConfig` interface (line 17)
  - Remove `gradient` values from all status entries (lines 27, 35, 43, 51)

- [ ] Edit `genie-dashboard/src/components/shared/application-status-config.ts`
  - Remove `gradient` property from `AppStatusConfig` interface (line 21)
  - Remove `gradient` values from all status entries (lines 31, 39, 47, 55)

## Remove Gradient Lines in Workflow Steppers

- [ ] Edit `genie-dashboard/src/components/news-verification/workflow-stepper.tsx`
  - Find gradient background on active/completed steps (around line 73)
  - Replace `bg-gradient-to-r from-emerald-500 to-emerald-400` with solid `bg-emerald-500`

- [ ] Edit `genie-dashboard/src/components/applications/workflow-stepper.tsx`
  - Same gradient removal for consistency

## Remove Page-Level Gradient Passes

- [x] Edit `genie-dashboard/src/app/(dashboard)/news-verification/page.tsx`
  - Remove gradient props from PageHeader component call

- [x] Edit `genie-dashboard/src/app/(dashboard)/applications/page.tsx`
  - Remove gradient props from PageHeader component call

- [x] Edit `genie-dashboard/src/app/(dashboard)/community-manager/page.tsx`
  - Remove gradient props from PageHeader component call

---

**Verification:** After changes, no `from-*-500 to-*-500` patterns should remain in page headers or status cards. Run:

```bash
grep -r "from-.*-500 to-.*-500" genie-dashboard/src --include="*.tsx" | grep -v node_modules
```
