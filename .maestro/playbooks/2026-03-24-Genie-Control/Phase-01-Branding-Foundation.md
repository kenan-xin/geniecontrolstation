# Phase 01: Branding & Foundation

This phase establishes the "Genie Ops" brand identity and creates the data foundation (applications schema, API routes, seed data) needed for the dashboard and applications pages. By the end of this phase, the app will show updated branding and have working API endpoints for both news articles and applications.

## Tasks

- [x] Update branding to "Genie Ops":
  - Change `APP_NAME` in `/genie-dashboard/src/lib/constants.ts` from "Genie Control" to "Genie Ops"
  - Update sidebar logo text in `/genie-dashboard/src/components/layout/sidebar.tsx` to show "Genie Ops" (the subtitle "Station" can remain)
  - Update the home page hero title in `/genie-dashboard/src/app/(dashboard)/page.tsx` from "Genie Control Station" to "Genie Ops"
  - Update header avatar fallback initials from "GC" to "GO" in `/genie-dashboard/src/components/layout/header.tsx`

- [x] Tone down the color palette for corporate feel:
  - Review `newsStatusConfig` in `/genie-dashboard/src/components/shared/news-status-config.ts`
  - Reduce color intensity: replace vibrant colors with muted corporate equivalents:
    - Unverified: `text-red-500` → `text-red-600`, reduce gradient opacity from `/8` to `/5`
    - Approval: `text-amber-500` → `text-amber-600`, reduce gradient opacity
    - Schedule: `text-blue-500` → `text-blue-600`, reduce gradient opacity
    - Published: `text-emerald-500` → `text-emerald-600`, reduce gradient opacity
  - Review the home page hero section in `/genie-dashboard/src/app/(dashboard)/page.tsx` and reduce gradient orb opacity for subtler effect

- [x] Create applications database schema:
  - Add `applications` table to `/genie-dashboard/src/lib/schema.ts` with fields:
    - id (integer, primary key, auto-increment)
    - applicationId (text, e.g., "APP-2024-001")
    - candidateName (text, not null)
    - submissionDate (text, not null)
    - overallProgress (integer, 0-100, default 0)
    - currentStatus (text, not null, default "Document Assessment")
    - statusColor (text, default "warning")
    - assignedTo (text)
    - trainingProvider (text)
    - email (text)
    - phone (text)
    - notes (text)
    - createdAt, updatedAt timestamps
  - Export types: `ApplicationSelect`, `ApplicationInsert`

- [x] Create applications API routes:
  - Create `/genie-dashboard/src/app/api/applications/route.ts` with GET (list all) and POST (create) handlers
  - Create `/genie-dashboard/src/app/api/applications/[id]/route.ts` with GET, PUT, DELETE handlers
  - Follow the existing pattern from `/genie-dashboard/src/app/api/news-articles/route.ts`
  - Use the db instance from `/genie-dashboard/src/lib/db.ts`
  - Added Application types to `/genie-dashboard/src/types/index.ts`

- [x] Create useApplications hook:
  - Create `/genie-dashboard/src/hooks/use-applications.ts`
  - Follow the pattern from `/genie-dashboard/src/hooks/use-news-articles.ts`
  - Export `useApplications()` for fetching all applications
  - Export `useApplication(id)` for fetching a single application
  - Include status filtering capability

- [x] Add seed data for applications:
  - Update `/genie-dashboard/src/app/api/seed/route.ts` to include sample applications data
  - Add 8-10 sample applications with varied statuses:
    - 2 in "Document Assessment" status
    - 2 in "Candidate Screening" status
    - 2 in "Pending Approval" status
    - 2 in "Approved" status
  - Use realistic candidate names, training providers, and dates

- [ ] Create application status configuration:
  - Create `/genie-dashboard/src/components/shared/application-status-config.ts`
  - Follow the pattern from `news-status-config.ts`
  - Define statuses: Document Assessment, Candidate Screening, Pending Approval, Approved
  - Use icons: FileText, UserSearch, Clock, CheckCircle2 (from lucide-react)
  - Use muted corporate colors matching the toned-down palette

- [ ] Run database migration and seed:
  - Run `npx drizzle-kit push` to apply the new schema
  - Call the seed API endpoint to populate initial data
  - Verify applications API returns data by testing the endpoint

- [ ] Verify the changes work:
  - Start the dev server with `npm run dev` in the genie-dashboard directory
  - Confirm "Genie Ops" branding appears in sidebar and home page
  - Confirm the color palette appears more muted/corporate
  - Test that `/api/applications` returns seeded data
