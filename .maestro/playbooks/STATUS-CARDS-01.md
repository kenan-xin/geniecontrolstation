# Status Cards: Subtle Fill + Typeset + Harden

**Goal:** Transform status stat cards from AI-slop to production-grade:
1. Remove left-border accent → subtle background fill
2. Fix typography hierarchy & consistency
3. Harden against edge cases & improve accessibility

**Files affected:**
- `genie-dashboard/src/components/shared/status-stat-card.tsx`
- `genie-dashboard/src/components/shared/news-status-config.ts`
- `genie-dashboard/src/components/shared/application-status-config.ts`
- `genie-dashboard/src/components/dashboard/status-cards.tsx`

---

## Phase 1: Update Status Configs - Replace Border with Card Fill

- [x] **1.1** Update `news-status-config.ts`:
  - Remove `border` property from `StatusConfig` interface
  - Add `cardBg` property for subtle fill: `bg-status-error-muted/50 dark:bg-status-error-muted/30`
  - Update all status configs (Unverified, Approval, Schedule, Published)
  - Remove `border: 'border-l-status-*'` entries

- [x] **1.2** Update `application-status-config.ts`:
  - Remove `border` property from `AppStatusConfig` interface
  - Add `cardBg` property matching pattern above
  - Update all status configs (Document Assessment, Candidate Screening, Pending Approval, Approved)
  - Remove `border: 'border-l-status-*'` entries

- [x] **1.3** Update inline configs in `status-cards.tsx`:
  - `totalConfig`: Replace `border: 'border-l-brand'` with `cardBg: 'bg-muted/50'`
  - `pendingApprovalConfig`: Replace `border` with `cardBg: 'bg-amber-500/10 dark:bg-amber-500/5'`

---

## Phase 2: Refactor Card Component - Subtle Fill + Typography

- [x] **2.1** Update `StatusConfigBase` interface in `status-stat-card.tsx`:
  - Remove `border: string`
  - Add `cardBg: string`

- [x] **2.2** Remove left-border accent:
  - Delete `border-l-[3px]` from Card className
  - Delete `config.border` reference

- [x] **2.3** Apply subtle background fill:
  - Add `config.cardBg` to Card className
  - Add `transition-colors duration-200` for smooth hover states

- [x] **2.4** Fix typography hierarchy (Typeset):
  - Count: Use `font-semibold tabular-nums` for number alignment
  - Label: Use consistent size - `text-sm` for default, `text-xs` for sm
  - Remove `text-[11px]` - non-standard, use `text-xs` instead
  - Add `tracking-tight` to count for tighter numbers

- [x] **2.5** Simplify icon badge:
  - Remove colored background (`config.bg`) from icon wrapper
  - Use subtle background: `bg-background/50` or remove entirely
  - Keep icon colored via `config.color`

**Expected result:**
```tsx
<Card className={cn(
  'relative overflow-hidden transition-colors duration-200 hover:bg-accent/50',
  config.cardBg
)}>
  <CardContent className="flex items-center justify-between gap-3">
    <div className="min-w-0">
      <p className={cn(
        'font-semibold tabular-nums tracking-tight',
        isSm ? 'text-xl' : 'text-2xl',
        config.color
      )}>
        {count}
      </p>
      <p className={cn(
        'mt-1 text-muted-foreground truncate',
        isSm ? 'text-xs' : 'text-sm'
      )}>
        {config.label}
      </p>
    </div>
    <div className="shrink-0 rounded-lg bg-background/50 p-2">
      <Icon className={cn('size-4', config.color)} />
    </div>
  </CardContent>
</Card>
```

---

## Phase 3: Harden - Edge Cases & Accessibility

- [x] **3.1** Add text overflow handling:
  - Ensure label has `truncate` (already present, verify) ✓
  - Add `min-w-0` to label container (already present, verify) ✓
  - Add `overflow-hidden` to Card ✓

- [x] **3.2** Handle large numbers (Harden):
  - Add `tabular-nums` for alignment (done in 2.4) ✓
  - Consider formatting for large counts: `formatCount(count)` helper ✓
  - Example: `1000` → `1K`, `1500000` → `1.5M` ✓
  - Used `Intl.NumberFormat` with compact notation for i18n support

- [x] **3.3** Add accessibility attributes:
  - Add `aria-label` to Card: `${count} ${config.label}` ✓
  - Consider `role="status"` for live updates ✓
  - Ensure sufficient color contrast (verify with existing status colors) ✓

- [x] **3.4** Handle edge cases:
  - Zero count: Should still display (not hidden) ✓
  - Very long labels: Truncate with tooltip on hover ✓
  - Missing config: Graceful fallback (component requires config prop)

- [x] **3.5** i18n considerations:
  - Labels use semantic tokens, ready for translation ✓
  - Number formatting should use `Intl.NumberFormat` in formatCount helper ✓

---

## Phase 4: Clean Up Unused Properties

- [ ] **4.1** Remove `border` property from all configs (done in Phase 1)

- [ ] **4.2** Consider removing or repurposing `bg` property:
  - Currently used for icon badge background
  - If simplified to `bg-background/50`, `bg` becomes unused
  - Remove from interface and configs if unused

- [ ] **4.3** Update any TypeScript errors from interface changes

---

## Phase 5: Verification

- [ ] **5.1** Run `npm run build` in genie-dashboard - no TypeScript errors

- [ ] **5.2** Run `npm run lint` - no lint errors

- [ ] **5.3** Visual verification:
  - Cards have subtle background fill (no left border)
  - Dark mode: fills are visible but not harsh
  - Typography: clear hierarchy between count and label
  - Hover state: smooth transition

- [ ] **5.4** Edge case testing:
  - Set count to 0 - displays correctly
  - Set count to 9999999 - doesn't overflow
  - Very long label text - truncates properly
  - Keyboard navigation - cards are accessible

---

## Summary of Changes

| Aspect | Before | After |
|--------|--------|-------|
| **Accent** | `border-l-[3px]` left border | Subtle `cardBg` fill |
| **Icon badge** | Colored `config.bg` | `bg-background/50` subtle |
| **Count size** | `text-2xl` / `text-xl` | Same + `tabular-nums tracking-tight` |
| **Label size** | `text-xs` / `text-[11px]` | `text-sm` / `text-xs` (standard) |
| **Accessibility** | None | `aria-label`, `role="status"` |
| **Large numbers** | Raw display | Formatted (1K, 1.5M) |
| **Overflow** | Basic truncate | Full overflow handling |

---

## Optional: formatCount Helper

If implementing large number formatting:

```tsx
function formatCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return count.toString();
}
```
