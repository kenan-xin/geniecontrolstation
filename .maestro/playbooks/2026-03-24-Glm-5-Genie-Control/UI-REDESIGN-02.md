# Phase 02: Remove AI Slop Patterns (/distill)

**Goal:** Strip remaining gradient icons, hero metric templates, and unnecessary visual complexity.

**Impact:** Eliminates AI-generated appearance signals.

**Prerequisites:** Phase 01 (Theme Overhaul) must be complete.

---

## Workflow Stepper Gradient Lines

Replace gradient backgrounds with solid colors.

- [ ] Edit `genie-dashboard/src/components/news-verification/workflow-stepper.tsx`
  - Find gradient background on active/completed steps
  - Replace `bg-gradient-to-r from-emerald-500 to-emerald-400` with solid `bg-primary`
  - Use theme colors instead of hard-coded emerald

- [ ] Edit `genie-dashboard/src/components/applications/workflow-stepper.tsx`
  - Same gradient removal for consistency
  - Use `bg-primary` or `bg-status-success` if available

## Hero Metric Card Simplification

Simplify the "big number + icon + label" template that's a classic AI tell.

- [ ] Edit `genie-dashboard/src/components/shared/status-stat-card.tsx`
  - Consider making the icon smaller or secondary
  - Reduce visual weight of the number (smaller font)
  - Make the card feel more like data, less like a dashboard widget
  - Options:
    - Move icon to right side
    - Use smaller icon
    - Reduce number from `text-3xl` to `text-2xl`

## Remove Social Media Gradient Badges

Instagram gradient is acceptable for brand recognition but should be a token.

- [ ] Search for Instagram gradient patterns:
  ```bash
  grep -r "from-purple-500 via-pink-500 to-orange-500" genie-dashboard/src --include="*.tsx"
  ```

- [ ] If found in these files, extract to a CSS class or keep minimal:
  - `components/community-manager/share-modal.tsx`
  - `components/community-manager/quick-share-popover.tsx`
  - `components/community-manager/segments-table.tsx`

## Audit Remaining Gradient Patterns

- [ ] Run comprehensive gradient search:
  ```bash
  grep -r "from-.*-500 to-.*-500\|bg-gradient-to" genie-dashboard/src --include="*.tsx" | grep -v node_modules
  ```

- [ ] For each result, evaluate:
  - Is this gradient adding information or just decoration?
  - Can it be replaced with a solid color?
  - If it must stay, can it use theme tokens?

## Simplify Logo Treatment

- [ ] Verify sidebar logo is solid color (from Phase 01)
- [ ] Check if any other logos or brand marks use gradients
- [ ] Replace with single-color versions where possible

---

**Verification:** After changes:
```bash
# Count remaining gradient patterns (should be minimal)
grep -c "bg-gradient-to" genie-dashboard/src --include="*.tsx" -r | grep -v ":0$" | grep -v node_modules

# Check for remaining gradient color classes
grep -r "from-.*-500 to-.*-500" genie-dashboard/src --include="*.tsx" | grep -v node_modules
```

**Success Criteria:**
- [ ] No gradient icons in page headers
- [ ] No gradient overlays on status cards
- [ ] Workflow steppers use solid colors
- [ ] Social media gradients are minimal/tokenized
- [ ] Overall visual is "flat" and clean
