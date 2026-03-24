# Phase 04: Cleanup Unused Properties

Remove `border` property from interfaces and configs since it's no longer used. Also remove `bg` property if icon badge no longer uses it.

## Tasks

- [ ] Remove `border` property from `news-status-config.ts`:
  - Delete `border: string` from `StatusConfig` interface
  - Delete `border: 'border-l-status-*'` entries from all 4 status configs

- [ ] Remove `border` property from `application-status-config.ts`:
  - Delete `border: string` from `AppStatusConfig` interface
  - Delete `border: 'border-l-status-*'` entries from all 4 status configs

- [ ] Remove `border` property from inline configs in `status-cards.tsx`:
  - Delete `border: 'border-l-brand'` from `totalConfig`
  - Delete `border: 'border-l-amber-500'` from `pendingApprovalConfig`

- [ ] Update `StatusConfigBase` interface in `status-stat-card.tsx`:
  - Remove `border: string` property
  - Keep `cardBg: string` (new primary property)

- [ ] Consider removing `bg` property:
  - Since icon wrapper now uses `bg-background/50`, the `bg` property is unused
  - Remove `bg: string` from all interfaces if confirmed unused
  - Or keep if other components still use it (check `status-badge.tsx` and other consumers)

- [ ] Search for any other references to `border` property in status configs:
  - Use Grep to find: `config\.border` or `border-l-`
  - Ensure no other files reference the removed properties
