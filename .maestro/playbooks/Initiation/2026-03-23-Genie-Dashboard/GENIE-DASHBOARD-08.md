# Phase 08: Polish, Responsive Design & Vercel Deployment

This phase adds the finishing touches that make the dashboard production-ready: responsive design for all screen sizes, consistent loading/error/empty states throughout, and Vercel deployment configuration. The result is a polished, deployable application that looks great on any device.

## Context

- **Project location:** `/home/kenan/work/geniecontrolstation/genie-dashboard/`
- **Previous phases:** Phase 01-07 built both features completely with all functionality.
- **Deployment target:** Vercel — Turso env vars already configured via Vercel integration
- **Turso environment variables** needed in Vercel: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `NEXT_PUBLIC_API_BASE_URL`
- **Design direction:** Professional, modern, responsive. All breakpoints should feel intentional, not broken.

## Tasks

- [ ] Implement responsive design across all pages and components. Review each page at mobile (375px), tablet (768px), laptop (1024px), and desktop (1440px+) breakpoints and fix layout issues:
  - **Dashboard layout (sidebar + header)**:
    - Desktop (>=1024px): Sidebar is visible and collapsible (260px expanded, 64px collapsed). Main content adjusts width.
    - Tablet/Mobile (<1024px): Sidebar hidden by default. Header shows hamburger menu icon. Clicking opens sidebar as a Sheet overlay (slides in from left). Clicking outside or a nav link closes it.
  - **Home page**: Feature cards stack vertically on mobile (`grid-cols-1`), side-by-side on tablet+ (`grid-cols-2`). Stat cards: 2x2 grid on mobile, 4 across on desktop.
  - **News Verification dashboard**: Status cards wrap to 2x2 on tablet, stack on mobile. Table scrolls horizontally with `overflow-x-auto`. Toolbar wraps: search takes full width on mobile, buttons stack below.
  - **News Verification detail pages**:
    - Desktop: 2-column layout (1/3 section nav + 2/3 content)
    - Mobile (<768px): Section nav becomes a horizontal scrollable tab bar or a Select dropdown above the content (single column). Stepper shows compact mode (icons only, no labels).
    - AI Insights drawer: full width on mobile instead of 450px
    - Action buttons: full width on mobile, stack vertically
  - **Community Manager**:
    - Station cards: horizontal scroll works on all sizes (already)
    - Media player: horizontal layout on desktop, vertical stack on mobile (logo above controls)
    - Segments table: horizontal scroll with `overflow-x-auto`. On mobile, consider hiding less critical columns (Category, Post) and showing them in an expandable row detail.
    - Modals: full width on mobile (`max-w-full sm:max-w-lg`)
  - Test each breakpoint in browser DevTools. Ensure no horizontal overflow on any page at any size.

- [ ] Add consistent loading states, error handling, and empty states throughout the application:
  - **Create reusable components** in `src/components/shared/`:
    - `loading-skeleton.tsx` — Configurable skeleton layouts:
      - `CardGridSkeleton` — 4 skeleton cards in a row (for status cards, station cards)
      - `TableSkeleton` — 5 skeleton rows with columns (for data tables)
      - `DetailPageSkeleton` — stepper skeleton + 2-column layout skeleton
    - `error-state.tsx` — Error display component:
      - Props: `title?: string`, `message: string`, `onRetry?: () => void`
      - Shows AlertCircle icon, title, message, optional "Try Again" button
      - Used when API calls fail
    - `empty-state.tsx` — Empty state display:
      - Props: `icon: LucideIcon`, `title: string`, `description: string`, `action?: { label: string, onClick: () => void }`
      - Shows large muted icon, title, description, optional action button
      - Used when: no articles, no segments, no search results, no stations
  - **Apply loading states** across all pages:
    - News Verification dashboard: show `CardGridSkeleton` + `TableSkeleton` while `useNewsArticles` is loading
    - News Verification detail: show `DetailPageSkeleton` while `useNewsArticle` is loading
    - Community Manager: show skeleton station cards + skeleton player while `useStations` is loading
    - Segments table: show `TableSkeleton` while `useSegments` is loading
  - **Apply error states**: When any `useQuery` hook returns `isError`, show `ErrorState` with the error message and a retry button that calls `refetch()`
  - **Apply empty states**:
    - No articles found (with or without filters): "No articles found" with appropriate icon. If filtered: "No articles match your search" with "Clear filters" action.
    - No segments for a station: "No segments recorded yet. Start recording to capture audio segments."
    - No stations: "No stations configured. Add a station to get started."
  - **Toast notifications** — ensure all mutations use Sonner toasts:
    - Success: article created/updated/deleted, segment shared/edited, station CRUD operations
    - Error: API failures with useful error messages
    - Info: CSV exported, recording started/stopped

- [ ] Configure the project for Vercel deployment:
  - Review and update `next.config.ts` (or `next.config.mjs`):
    - Ensure no issues with server-side Turso access in API routes
    - Add any necessary configuration for production build
    - If using `lamejs` in browser only, ensure it's not bundled server-side (it's client-only for MP3 encoding)
  - Create `.env.example` in the project root with all required env vars (no actual values):
    ```
    TURSO_DATABASE_URL=
    TURSO_AUTH_TOKEN=
    NEXT_PUBLIC_API_BASE_URL=https://dev-genie.001.gs/smart-api
    ```
  - Ensure `.env.local` is in `.gitignore` (verify)
  - Review `package.json` scripts — ensure `build` and `start` work correctly
  - Run `npm run build` — fix any build errors:
    - Common issues: missing `"use client"` directives, server/client component boundary errors, missing type imports
    - Ensure all dynamic routes generate correctly
    - Ensure API routes compile without errors
  - Run `npm start` to test the production build locally:
    - Verify home page loads
    - Verify both feature pages work
    - Verify API routes respond correctly (test a few GET endpoints)
  - Create a `vercel.json` in `genie-dashboard/` if needed for any custom configuration (likely not needed for a standard Next.js project)

- [ ] Final comprehensive verification using browser automation. Invoke the `agent-browser` skill:
  - Start with `npm run dev` (or `npm start` for production build)
  - **Home page test** (`/`):
    - Navigate to `http://localhost:3000/`
    - Verify page loads with feature cards ("News Verification" and "Community Manager")
    - Verify stat cards show real counts from database (use text extraction to confirm non-zero values)
    - Click "Open News Verification", verify navigation
    - Navigate back, click "Open Community Manager", verify navigation
    - Take screenshot of home page
  - **News Verification — full workflow test**:
    - Navigate to `/news-verification`
    - Verify dashboard shows correct status counts matching seed data (extract and verify numbers)
    - Verify table displays all 11 seeded articles
    - Test search: type "IRS" in search, verify filtering
    - Test status filter: click "Unverified" card, verify table filters
    - Test Add News Lead: click button, fill form, submit, verify new article appears
    - Test Export CSV: click button, verify file download
    - Navigate to an Unverified article detail page
    - Wait for AI fact-check to complete (up to 120s)
    - Click AI FAB, verify drawer opens with all 4 sections populated
    - Click "Proceed to Approval", verify notes pre-filled, confirm
    - Verify navigation to Approval page
    - On Approval page: click "Approve", verify notes pre-filled, confirm
    - Verify navigation to Schedule page
    - On Schedule page: set date/time, select channels, click "Publish", confirm
    - Verify navigation to Published page
    - Verify Published page shows: performance metrics, full editorial trail, all sections read-only
    - Navigate to dashboard, verify status counts updated
    - Test Reject workflow on an Unverified article
  - **Community Manager — full workflow test**:
    - Navigate to `/community-manager`
    - Verify 4 stations load from database
    - Select station with valid URL, click Play, verify audio streams
    - Test Record (if permissions allow): verify recording indicator, wait for segment, verify processing -> populated
    - Stop recording
    - Click Edit on segment, modify text, save, verify persistence
    - Click Regenerate on segment, verify API call and data update
    - Select 2+ segments via checkboxes, click "Share Selected", select platforms, share
    - Verify shared icons appear in Shared column
    - Delete a segment, verify removal
    - Add new station via Add Station dialog, verify appearance
    - Edit station, verify changes
    - Delete station, verify removal
    - Play a clip from table, verify audio plays
  - **Responsive design test**:
    - Resize viewport to mobile width (375px)
    - Navigate through both features, verify no broken layouts
    - Verify sidebar becomes overlay/sheet on mobile
    - Verify tables scroll horizontally
    - Verify modals are full-width on mobile
    - Resize to tablet (768px), verify layouts adapt
    - Take screenshots at each breakpoint
  - **Console check**:
    - Verify no unexpected errors in browser console
    - Note: CORS warnings from radio streams are expected
  - **Production build test**:
    - Run `npm run build`, verify no build errors
    - Run `npm start`, repeat key workflows to verify production build works
  - Fix any remaining issues found during comprehensive verification
