# Phase 01: Update Status Configs

Replace `border` property with `cardBg` for subtle background fills in both news and application status configurations. This is the foundation for removing the left-border accent anti-pattern.

## Tasks

- [x] Update `genie-dashboard/src/components/shared/news-status-config.ts`:
  - Add `cardBg: string` to `StatusConfig` interface
  - Add subtle fill values using existing status-muted tokens:
    - `Unverified`: `cardBg: 'bg-status-error-muted/50 dark:bg-status-error-muted/30'`
    - `Approval`: `cardBg: 'bg-status-warning-muted/50 dark:bg-status-warning-muted/30'`
    - `Schedule`: `cardBg: 'bg-status-info-muted/50 dark:bg-status-info-muted/30'`
    - `Published`: `cardBg: 'bg-status-success-muted/50 dark:bg-status-success-muted/30'`
  - Keep `border` property for now (will be removed in Phase 04)

- [x] Update `genie-dashboard/src/components/shared/application-status-config.ts`:
  - Add `cardBg: string` to `AppStatusConfig` interface
  - Add subtle fill values:
    - `Document Assessment`: `cardBg: 'bg-status-neutral-muted/50 dark:bg-status-neutral-muted/30'`
    - `Candidate Screening`: `cardBg: 'bg-status-info-muted/50 dark:bg-status-info-muted/30'`
    - `Pending Approval`: `cardBg: 'bg-status-warning-muted/50 dark:bg-status-warning-muted/30'`
    - `Approved`: `cardBg: 'bg-status-success-muted/50 dark:bg-status-success-muted/30'`
  - Keep `border` property for now (will be removed in Phase 04)

- [x] Update inline configs in `genie-dashboard/src/components/dashboard/status-cards.tsx`:
  - Add `cardBg: 'bg-muted/50'` to `totalConfig`
  - Add `cardBg: 'bg-status-warning-muted/50 dark:bg-status-warning-muted/30'` to `pendingApprovalConfig`
  - Keep `border` property for now

- [x] Update `StatusConfigBase` interface in `genie-dashboard/src/components/shared/status-stat-card.tsx`:
  - Add `cardBg: string` property
  - Keep `border: string` for backward compatibility during transition

## Notes

- Most tasks were already complete from previous work
- Fixed `pendingApprovalConfig.cardBg` to use semantic `bg-status-warning-muted/*` tokens instead of hardcoded amber
- Added `border?: string` to `StatusConfigBase` interface for Phase 04 transition
