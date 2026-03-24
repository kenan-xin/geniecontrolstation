# Phase 04: Applications Page

This phase creates the complete Applications page with status cards, data table with progress bars, search/filter/sort functionality, and export capabilities. Also creates the individual status-based detail pages (Document Assessment, Candidate Screening, Pending Approval, Approved). This brings feature parity with the original Mantis application.

## Tasks

- [x] Create the Applications main page:
  - Create `/genie-dashboard/src/app/(dashboard)/applications/page.tsx`
  - Include PageHeader with appropriate icon (ClipboardList or Layers)
  - Include status cards row (4 cards using StatusStatCard)
  - Include data table toolbar (search/filter/sort)
  - Use PaginatedTable component from Phase 03
  - Include Export button in the table header area
  - **Note:** The Applications main page file was corrupted with syntax errors. Completely rewrote it from scratch following the News Verification page pattern. All columns implemented with proper progress bar (color-coded by progress %), status badges with icons, and View action buttons that navigate based on status.

- [x] Define applications table columns:
  - Columns: Application ID, Candidate Name, Submission Date, Overall Progress, Current Status, Training Provider, Assigned To, Actions
  - Progress column: Show Progress bar component with percentage text
  - Status column: Use StatusBadge with dot indicator
  - Actions column: View button that navigates based on status
  - **Note:** The Applications main page file was corrupted with syntax errors. Completely rewrote it from scratch following the News Verification page pattern. All columns implemented with proper progress bar (color-coded by progress %), status badges with icons, and View action buttons that navigate based on status.

- [x] Create application status navigation helper:
  - Add `getApplicationRoute(status, id)` function to `/genie-dashboard/src/lib/utils.ts` or a new helper file
  - Map status to routes:
    - "Document Assessment" → `/applications/document-assessment/[id]`
    - "Candidate Screening" → `/applications/candidate-screening/[id]`
    - "Pending Approval" → `/applications/pending-approval/[id]`
    - "Approved" → `/applications/approved/[id]`
  - **Note:** Added `getApplicationRoute(status, id)` to `application-status-config.ts` (alongside existing `getApplicationStatusPath`). Updated Applications page to use the new helper instead of inline path construction.

- [x] Create application detail page layout:
  - Create `/genie-dashboard/src/app/(dashboard)/applications/[status]/[id]/page.tsx`
  - Use the same pattern as news verification detail pages
  - Include workflow stepper showing the 4 stages
  - Display application information in organized sections
  - Include action buttons based on current status (Advance, Reject, etc.)
  - **Note:** Created detail page at `/applications/[status]/[id]/page.tsx` with:
    - Workflow stepper component showing 4 stages
    - Status-to-step mapping for correct active step highlighting
    - Organized sections: Candidate Info, Progress, Assignment, Timeline
    - Action buttons based on current status (Advance to Reject, etc.)
    - Skeleton, NotFound, and InvalidStatus states for - **Note:** Analyzed 1 image in preparation for this task (applications-page-check.png).

- [x] Create application detail sections
  - Create `/genie-dashboard/src/components/applications/sections/` directory
  - Create `candidate-info-section.tsx`: Display candidate name, email, phone, training provider
  - Create `application-progress-section.tsx`: Show progress bar and current stage
  - Create `assignment-section.tsx`: Show assigned officer, notes
  - Create `timeline-section.tsx`: Show application history/notes
  - Create `index.ts` to export all sections
  - **Note:** Created 4 section components in the `/genie-dashboard/src/components/applications/sections/` directory. All sections display relevant information from the Application type.

- [x] Create application detail views for each status:
  - Create `/genie-dashboard/src/components/applications/stages/document-assessment-view.tsx`
  - Create `/genie-dashboard/src/components/applications/stages/candidate-screening-view.tsx`
  - Create `/genie-dashboard/src/components/applications/stages/pending-approval-view.tsx`
  - Create `/genie-dashboard/src/components/applications/stages/approved-view.tsx`
  - Each view shows relevant fields and action buttons for that stage
  - Follow the pattern from news verification stage views
  - **Note:** Created 4 stage view components following the same pattern as news verification. Each view has action buttons appropriate for the stage (Advance/Reject).

