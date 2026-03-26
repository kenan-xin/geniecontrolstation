# Phase 03: NewsVerification — Dashboard & Listing Page

This phase builds the News Verification main dashboard page with live data from the Turso database. It includes reactive status summary cards, a searchable and filterable data table with pagination, CSV export, and the ability to add new news leads — making it the central command hub for the editorial workflow.

## Context

- **Project location:** `/home/kenan/work/geniecontrolstation/genie-dashboard/`
- **Previous phases:** Phase 01 built the layout/navigation. Phase 02 created the database schema, API routes, seed data, and TanStack Query hooks.
- **Data source:** All article data comes from `/api/news-articles` API routes via the `useNewsArticles()` and related TanStack Query hooks in `src/hooks/use-news-articles.ts`
- **Design direction:** Professional, modern, corporate-ready. Use the `frontend-design` skill when building UI components.
- **Key reference:** The original app's dashboard is at `src/pages/media/news-verification.jsx` in the parent repo — use it as a reference for layout and features, but redesign with shadcn/ui + Tailwind.

## Tasks

- [x] Create the News Verification Zustand store for UI-only state at `src/store/news-verification-store.ts`:
  - State fields:
    - `selectedIds: number[]` — IDs of selected table rows
    - `searchQuery: string` — current search text
    - `statusFilter: string | null` — active status filter (null = show all)
    - `page: number` — current pagination page (0-indexed)
    - `rowsPerPage: number` — rows per page, default 10
  - Actions:
    - `setSelectedIds(ids: number[])` — set selected rows
    - `toggleSelected(id: number)` — toggle a single row selection
    - `selectAll(ids: number[])` — select all visible rows
    - `clearSelection()` — clear all selections
    - `setSearchQuery(query: string)` — update search, reset page to 0
    - `setStatusFilter(status: string | null)` — update filter, reset page to 0
    - `setPage(page: number)` — set current page
    - `setRowsPerPage(rows: number)` — update rows per page, reset page to 0
  - Keep this store focused on UI state only — article data comes from TanStack Query hooks

  **Completed (2026-03-23):** Created store at `src/store/news-verification-store.ts` following the existing `sidebar-store.ts` pattern. Includes all required state fields (selectedIds, searchQuery, statusFilter, page, rowsPerPage) and actions with proper page reset behavior for search/filter changes.

- [x] Build the full News Verification dashboard page. Invoke the `frontend-design` skill for high-quality design. Replace the placeholder in `src/app/(dashboard)/news-verification/page.tsx` with a `"use client"` component containing:
  - **Status summary cards** — 4 cards in a responsive grid row (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`):
    - **Unverified** (Newspaper icon, red/destructive accent) — count of articles with status 'Unverified'
    - **Approval** (ShieldCheck icon, amber/warning accent) — count of 'Approval' articles
    - **Schedule** (Clock icon, blue accent) — count of 'Schedule' articles
    - **Published** (CheckCircle icon, green/success accent) — count of 'Published' articles
    - Each card: icon with colored background circle, status label, count number (large font)
    - Cards are clickable — clicking sets `statusFilter` in Zustand store to filter the table
    - Active filter card gets a subtle ring/border highlight
    - Clicking the already-active card clears the filter (shows all)
    - Counts derived from `useNewsArticles()` data by filtering client-side
  - **Toolbar** between cards and table — a flex row with:
    - Search input (SearchIcon, placeholder "Search by title...", debounced, updates `searchQuery` in store)
    - Status dropdown filter (using shadcn Select: All, Unverified, Approval, Schedule, Published, Rejected)
    - Spacer
    - "Add News Lead" button (Plus icon, primary variant) — opens add dialog
    - "Export CSV" button (Download icon, outline variant)
  - **Data table** using shadcn Table (with `<Table>`, `<TableHeader>`, `<TableBody>`, `<TableRow>`, `<TableCell>`):
    - Columns: Checkbox, ID, Title, Submission Date, Status, Sources, Assigned To, Actions
    - **Checkbox column**: Header checkbox for select-all (of visible page), row checkboxes for individual selection
    - **Status column**: Colored Badge component — red for Unverified, amber for Approval, blue for Schedule, green for Published, gray for Rejected. Include a small colored dot before the text.
    - **Actions column**: "View" button (Eye icon, navigates to `/news-verification/${status.toLowerCase()}/${id}`) and "Reject" button (X icon, only shown for non-Rejected/non-Published articles, opens confirmation)
    - Client-side filtering: filter by `searchQuery` (case-insensitive title match) and `statusFilter`
    - Client-side pagination using `page` and `rowsPerPage` from store
    - Table rows show subtle hover background
  - **Pagination** below the table:
    - Shows "Showing X-Y of Z results"
    - Page navigation (previous/next buttons)
    - Rows per page selector (5, 10, 25)

- [x] Implement the Add News Lead dialog and CSV export:
  - **Add News Lead dialog** (using shadcn Dialog):
    - Trigger: the "Add News Lead" button in the toolbar
    - Form fields:
      - Title (text input, required)
      - Sources (shadcn Select dropdown: Social Media, Blog News, Reporter, Other Media Outlet, TikTok)
      - Assigned To (text input)
      - Submitter section: Full Name, Email, Phone (text inputs)
      - Story section: Description (textarea, 4 rows), Category (Select: Finance, Demographics, Weather, Community, Health, Politics, Business, Sports), Urgency (Select: Low, Medium, High, Critical)
    - "Cancel" and "Create Article" buttons
    - On submit: call `useCreateNewsArticle()` mutation with the form data
    - On success: close dialog, show success toast ("News lead created successfully"), table auto-refreshes via query invalidation
    - On error: show error toast
  - **CSV Export**:
    - Exports the currently filtered/visible rows (respects search and status filter, but exports ALL matching rows regardless of pagination)
    - CSV columns: ID, Title, Submission Date, Status, Sources, Assigned To
    - Quote fields containing commas
    - Generate Blob with CSV content, create download link, trigger download with filename `news-verification-export-YYYY-MM-DD.csv`
    - Show toast on export: "Exported X articles to CSV"
  - **Reject action**:
    - Confirmation dialog: "Are you sure you want to reject '{title}'? This action can be undone."
    - On confirm: call `useUpdateNewsArticle()` with `{ currentStatus: 'Rejected', statusColor: 'default' }`
    - Show success toast, table refreshes automatically



  **Completed (2026-03-23):** All features were already implemented in `page.tsx`:
  - Add News Lead dialog with all required fields (Title, Sources, Assigned To, Submitter info, Story details)
  - CSV export functionality that exports filtered rows with proper quoting
  - Reject action with confirmation dialog and status update
  - All mutations trigger proper query invalidation for auto-refresh

  **Verified via browser automation (2026-03-23):**
  - Status cards show correct counts (3 Unverified, 2 Approval, 2 Schedule, 2 Published)
  - Status card filtering works (click to filter, click again to clear)
  - Search functionality filters by title in real-time
  - Status dropdown filter syncs with card highlighting
  - Table has all required columns with correct status badge colors
  - View button navigates to `/news-verification/{status}/{id}`
  - Reject workflow: confirmation dialog → status update → success toast → counts update
  - Add News Lead: dialog opens → form submission → new article appears → success toast
  - CSV export triggers file download
  - Pagination controls work correctly
  - No console errors

- [x] Verify the News Verification dashboard works end-to-end using browser automation. Invoke the `agent-browser` skill:
  - Ensure the seed data is loaded (if not, make a POST request to `/api/seed` via browser or curl)
  - Start the dev server and use `agent-browser` to navigate to `http://localhost:3000/news-verification`
  - Verify status cards show correct counts (3 Unverified, 2 Approval, 2 Schedule, 2 Published) by extracting text
  - Test status card filtering:
    - Click on "Unverified" card, verify table filters to show only Unverified articles
    - Take screenshot to confirm filter is active
    - Click the active card again, verify filter clears and all articles show
  - Test search functionality:
    - Type "IRS" in the search input, verify table filters in real-time
    - Clear search, verify all articles return
  - Test status dropdown filter:
    - Select "Approval" from dropdown, verify table filters
    - Verify card highlighting syncs with dropdown selection
  - Verify table structure:
    - Check all columns are present (Checkbox, ID, Title, Submission Date, Status, Sources, Assigned To, Actions)
    - Verify status badges have correct colors (red for Unverified, amber for Approval, etc.)
  - Test navigation:
    - Click "View" button on an article row, verify navigation to detail page URL
    - Navigate back to dashboard
  - Test reject workflow:
    - Click "Reject" button on an article, verify confirmation dialog appears
    - Confirm rejection, verify article status updates
    - Check dashboard counts update accordingly
  - Test Add News Lead:
    - Click "Add News Lead" button, verify dialog opens
    - Fill in required fields (Title, Sources, etc.)
    - Submit form, verify new article appears in table
    - Verify success toast appears
  - Test CSV export:
    - Click "Export CSV" button, verify file downloads
  - Test pagination:
    - If more than 10 articles, verify pagination controls work
    - Change rows per page, verify table updates
  - Test select-all:
    - Click header checkbox, verify all rows on current page are selected
  - Check browser console for errors
  - Fix any issues found during verification
