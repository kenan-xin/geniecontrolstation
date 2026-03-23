# Phase 01: Foundation & Working Prototype

This phase bootstraps the `genie-dashboard/` Next.js 15 project inside the current repository with Tailwind CSS v4, shadcn/ui, and all core dependencies. By the end, you'll have a running, navigable dashboard with a professional layout, sidebar navigation, and placeholder pages for both News Verification and Community Manager — a tangible prototype demonstrating the full stack works end-to-end.

## Context

- **Parent repo:** `/home/kenan/work/geniecontrolstation/`
- **New project location:** `/home/kenan/work/geniecontrolstation/genie-dashboard/`
- **Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Zustand v5, TanStack Query v5, Drizzle ORM + Turso (libSQL), lamejs
- **API base URL:** `https://dev-genie.001.gs/smart-api`
- **Design direction:** Professional, modern, corporate-ready but visually engaging — not boring or generic. Use the `frontend-design` skill when building UI.
- **This phase is fully autonomous — no user input required.**

## Tasks

- [x] Create the Next.js 15 project and install all dependencies:
  - `cd /home/kenan/work/geniecontrolstation`
  - Run `npx create-next-app@latest genie-dashboard --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm` (accept all defaults / answer yes to prompts)
  - `cd genie-dashboard`
  - Install runtime dependencies: `npm install zustand @tanstack/react-query @libsql/client drizzle-orm lamejs date-fns lucide-react`
  - Install dev dependencies: `npm install -D drizzle-kit @types/node`
  - Verify `npm run dev` starts successfully (check for no errors, then stop the dev server)

- [x] Initialize shadcn/ui and add essential components:
  - `cd /home/kenan/work/geniecontrolstation/genie-dashboard`
  - Run `npx shadcn@latest init` — accept defaults (New York style, Zinc base color, CSS variables enabled)
  - Add components in batches:
    - `npx shadcn@latest add button card input table dialog dropdown-menu badge tabs sheet separator tooltip avatar scroll-area select checkbox label textarea popover accordion alert skeleton sonner breadcrumb progress`
  - Verify components exist in `src/components/ui/` directory

- [x] Set up the project folder structure and configuration files:
  - Create directories inside `src/`:
    - `lib/` (DB connection, utilities, constants)
    - `store/` (Zustand stores)
    - `hooks/` (custom hooks, TanStack Query hooks)
    - `types/` (TypeScript interfaces)
    - `components/layout/` (dashboard layout)
    - `components/shared/` (reusable components)
    - `components/news-verification/` (feature components, empty for now)
    - `components/community-manager/` (feature components, empty for now)
  - Create `src/lib/constants.ts`:
    ```typescript
    export const APP_NAME = "Genie Control";
    export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://dev-genie.001.gs/smart-api";
    ```
  - Create `.env.local` in `genie-dashboard/`:
    ```
    TURSO_DATABASE_URL=libsql://database-apricot-compass-vercel-icfg-a7hbwxnzt7qx0nl0pl81bezi.aws-us-east-1.turso.io
    TURSO_AUTH_TOKEN=SET_YOUR_TURSO_AUTH_TOKEN_HERE
    NEXT_PUBLIC_API_BASE_URL=https://dev-genie.001.gs/smart-api
    ```
  - Ensure `.env.local` is in `.gitignore` (should be by default in Next.js)
  - Create `src/providers/query-provider.tsx` — a `"use client"` component wrapping children in TanStack `QueryClientProvider` with these defaults:
    - `staleTime: 1000 * 60 * 5` (5 minutes)
    - `gcTime: 1000 * 60 * 10` (10 minutes)
    - `retry: 1`
    - `refetchOnWindowFocus: false`

- [x] Build the main dashboard layout with sidebar and header. Invoke the `frontend-design` skill before implementing to ensure high design quality. Create a professional, modern corporate dashboard layout that is visually engaging (not boring). Build these components:
  - `src/components/layout/sidebar.tsx` — Collapsible sidebar (`"use client"` component):
    - App logo/name "Genie Control" at top — use a clean wordmark with a subtle accent color or gradient icon
    - Navigation section titled "Media" with two nav items:
      - "News Verification" (Newspaper icon from lucide-react) linking to `/news-verification`
      - "Community Manager" (Radio icon from lucide-react) linking to `/community-manager`
    - Active link state: highlighted background with accent color text, using `usePathname()` from `next/navigation`
    - Collapse/expand toggle button at the bottom of the sidebar
    - Collapsed state shows only icons, expanded shows icons + labels
    - Smooth width transition animation (expanded: 260px, collapsed: 64px)
    - Clean borders, subtle background color
  - `src/components/layout/header.tsx` — Top header bar (`"use client"` component):
    - Left: Menu/hamburger icon button to toggle sidebar on mobile
    - Center-left: Breadcrumb navigation (use shadcn Breadcrumb, derive from pathname)
    - Right: Search input (small, placeholder), Bell icon (notification placeholder), User avatar (circular, placeholder initials)
  - `src/components/layout/dashboard-layout.tsx` — Layout wrapper combining sidebar + header + scrollable main content area:
    - Sidebar fixed on the left
    - Header fixed at the top (to the right of sidebar)
    - Main content area fills remaining space with proper padding and scroll
    - Responsive: sidebar overlays as a Sheet on screens < 1024px
  - Update `src/app/layout.tsx`:
    - Wrap the app in QueryProvider
    - Use Inter or Geist font from `next/font`
    - Include `<Toaster />` from sonner for toast notifications
  - Create a `src/app/(dashboard)/layout.tsx` route group layout that wraps child pages in `DashboardLayout`
  - Move all page routes under `(dashboard)/` route group so they share the layout

- [x] Create the home/landing page visible at the base URL (`/`). Invoke the `frontend-design` skill. Build `src/app/(dashboard)/page.tsx`:
  - Welcome section: "Genie Control Station" as the main heading, with a subtitle like "AI-Powered Media Management Platform"
  - Two prominent feature cards in a responsive 2-column grid (stack on mobile):
    1. **News Verification** card:
      - Newspaper icon (large, with accent color)
      - "News Verification" heading
      - Description: "AI-powered editorial workflow for verifying and publishing news stories through a 4-stage pipeline"
      - "Open News Verification" button (as a Next.js `<Link>`) pointing to `/news-verification`
    2. **Community Manager** card:
      - Radio icon (large, with different accent color)
      - "Community Manager" heading
      - Description: "Radio station management with live streaming, recording, AI transcription, and social media sharing"
      - "Open Community Manager" button (as a Next.js `<Link>`) pointing to `/community-manager`
  - Quick stats row below with 4 small stat cards (hardcoded placeholder values for now):
    - "12 Unverified" (red/destructive accent)
    - "5 Pending Approval" (amber/warning accent)
    - "3 Scheduled" (blue/info accent)
    - "8 Published" (green/success accent)
  - Use shadcn Card, Button, Badge components
  - Make it visually impressive — this is the first thing users see

- [ ] Create placeholder pages for both features:
  - `src/app/(dashboard)/news-verification/page.tsx`:
    - Page title "News Verification" with brief description text
    - Row of 4 status summary cards (Unverified, Approval, Schedule, Published) with zero counts and matching color accents (red, amber, blue, green)
    - Each card has an icon, label, and count
    - Below cards: a placeholder empty state — a Card or bordered area with an icon and text: "No news articles yet. Data will appear once the database is connected."
    - Use shadcn Card and Badge components
  - `src/app/(dashboard)/news-verification/[status]/[id]/page.tsx`:
    - Dynamic route for article detail view
    - Extract `status` and `id` from params
    - Show a breadcrumb: News Verification > {status (capitalized)} > #{id}
    - Display a horizontal stepper showing the 4 workflow stages (Unverified, Approval, Schedule, Published) with the current stage highlighted based on the `status` param
    - Below stepper: placeholder Card with text "Detail view for article #{id} — coming in Phase 4"
    - "Back to News Verification" link
  - `src/app/(dashboard)/community-manager/page.tsx`:
    - Page title "Community Manager" with description
    - Row of 4 placeholder station cards showing: "Kiss 92", "98.3 FM", "91.3 FM", "Money FM 89.3" with radio icons and a "+" add card
    - Placeholder media player area: a Card showing a large radio icon, "Select a station to begin", and disabled Play/Record buttons
    - Placeholder table area: "No segments recorded yet. Start recording to capture audio segments."
  - All pages should use consistent spacing, typography, and look polished even as placeholders

- [ ] Verify the complete prototype works end-to-end:
  - `cd /home/kenan/work/geniecontrolstation/genie-dashboard`
  - Run `npm run dev`
  - Verify:
    - Home page loads at `http://localhost:3000` with both feature cards and stat cards
    - Clicking "Open News Verification" navigates to `/news-verification` showing status cards and empty state
    - Clicking "Open Community Manager" navigates to `/community-manager` showing station cards and placeholder player
    - Visiting `/news-verification/unverified/1` loads the detail placeholder with stepper
    - Sidebar highlights the correct active link when navigating
    - Sidebar collapses and expands with animation
    - On mobile viewport (< 1024px), sidebar becomes an overlay/sheet
    - No TypeScript errors in the terminal
    - No console errors in the browser
  - Run `npm run build` and confirm the project builds without errors
  - Fix any issues found during verification
