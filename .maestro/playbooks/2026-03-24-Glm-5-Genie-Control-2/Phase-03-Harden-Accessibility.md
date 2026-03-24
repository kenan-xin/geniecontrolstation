# Phase 03: Harden - Edge Cases & Accessibility

Apply `/harden` principles to make cards robust and production-ready. Handle edge cases, improve accessibility, and add number formatting.

## Tasks

- [x] Add accessibility attributes to `genie-dashboard/src/components/shared/status-stat-card.tsx`:
  - Add `role="status"` to Card for screen reader live regions
  - Add `aria-label` describing the card content: `{count} {config.label}`
  - Example: `<Card role="status" aria-label={`${count} ${config.label}`}>`
  - **Note:** Already implemented in previous run. Fixed aria-label to use raw count instead of formatted.

- [x] Add large number formatting helper:
  - Create `formatCount(count: number): string` function in the same file
  - Format: `1000` → `1K`, `1500000` → `1.5M`, `999` → `999`
  - Use `Intl.NumberFormat` for i18n compatibility:
    ```tsx
    function formatCount(count: number): string {
      if (count >= 1_000_000) {
        return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(count);
      }
      if (count >= 1_000) {
        return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(count);
      }
      return count.toString();
    }
    ```
  - **Note:** Already implemented using simplified `Intl.NumberFormat` approach.

- [x] Apply `formatCount` to the displayed count:
  - Update `{count}` to `{formatCount(count)}`
  - Keep `aria-label` using raw count for accuracy: `aria-label={`${count} ${config.label}`}`
  - **Note:** Fixed - aria-label now correctly uses raw count for screen reader accuracy.

- [x] Verify overflow handling (should already be present from existing code):
  - Card has `overflow-hidden`
  - Label container has `min-w-0`
  - Label has `truncate`
  - If missing, add them
  - **Note:** Verified all present.

- [x] Handle edge cases:
  - Zero count: Should display normally (no special handling needed)
  - Very long labels: Already truncates via `truncate` class
  - Missing config: TypeScript ensures config is always provided, no runtime fallback needed
  - **Note:** Verified all edge cases handled correctly.
