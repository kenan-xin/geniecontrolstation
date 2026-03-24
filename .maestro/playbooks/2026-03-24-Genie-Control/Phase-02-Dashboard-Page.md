# Phase 02: Dashboard Page

This phase transforms the current landing page into a proper dashboard with real metrics, charts, and actionable information. The dashboard will display application statistics, trends charts (using ApexCharts), recent applications table, process metrics, and quick action buttons. This provides users with an at-a-glance view of system activity.

## Tasks

- [x] Install ApexCharts dependency:
  - Run `npm install react-apexcharts apexcharts` in the genie-dashboard directory
  - Create TypeScript declaration file if needed at `/genie-dashboard/src/types/apexcharts.d.ts`
  - Note: TypeScript definitions are included with both packages, no custom declaration needed

- [x] Create dashboard status cards component:
  - Create `/genie-dashboard/src/components/dashboard/status-cards.tsx`
  - Use the existing `StatusStatCard` component from shared components
  - Display 4 cards: Total Applications, Document Assessment, Candidate Screening, Pending Approval
  - Use the `applicationStatusConfig` from Phase 01
  - Fetch data using `useApplications` hook
  - Show loading skeleton while fetching
  - **Completion Notes:**
    - Updated `StatusStatCard` to accept generic config type (works with both news and application configs)
    - Exported `applicationStatusConfig` from shared/index.ts
    - Created status-cards.tsx with 4 cards: Total (Layers icon), Document Assessment, Candidate Screening, Pending Approval
    - Uses `CardGridSkeleton` for loading state

- [ ] Create application trends chart (area chart):
  - Create `/genie-dashboard/src/components/dashboard/application-trends-chart.tsx`
  - Use ApexCharts with a clean area chart design
  - Show application submissions over the last 7 days
  - Use muted corporate colors matching the brand palette
  - Include chart title "Application Trends"
  - Make the chart responsive

- [ ] Create monthly statistics chart (bar chart):
  - Create `/genie-dashboard/src/components/dashboard/monthly-statistics-chart.tsx`
  - Use ApexCharts with a bar chart design
  - Show monthly application counts for the current year
  - Use a single muted color (e.g., blue-600 or brand color)
  - Include "This Month Statistics" title with total count above the chart

- [ ] Create recent applications table component:
  - Create `/genie-dashboard/src/components/dashboard/recent-applications-table.tsx`
  - Use the existing Table components from `/genie-dashboard/src/components/ui/table.tsx`
  - Columns: Application ID, Candidate Name, Progress (with progress bar), Status, Action
  - Progress bar: Use the Progress component from shadcn/ui
  - Status: Use Badge component with dot indicator (create a StatusBadge component if needed)
  - Show only the 5 most recent applications
  - "View" button navigates to the appropriate detail page based on status
  - Include an overflow menu (three dots) with "Export as CSV" option

- [ ] Create process metrics panel:
  - Create `/genie-dashboard/src/components/dashboard/process-metrics.tsx`
  - Display 3 metrics with progress bars:
    - Average Processing Time (e.g., "3.5 days", 70% progress)
    - Approval Rate (e.g., "85%", 85% progress, green)
    - AI Match Accuracy (e.g., "92%", 92% progress, blue)
  - Use the Progress component for visual bars
  - Calculate these metrics from application data (or use placeholder values if calculation is complex)

- [ ] Create quick actions panel:
  - Create `/genie-dashboard/src/components/dashboard/quick-actions.tsx`
  - Include buttons:
    - "View All Applications" → links to `/applications`
    - "Document Assessment" → links to `/applications/document-assessment`
    - "Candidate Screening" → links to `/applications/candidate-screening`
  - Use outlined Button variant with icons
  - Stack buttons vertically with consistent spacing

- [ ] Create a StatusBadge component with dot indicator:
  - Create `/genie-dashboard/src/components/shared/status-badge.tsx`
  - Use Badge component with a colored dot indicator on the left
  - Props: status (string), variant (outline by default)
  - Map status to color using application status config
  - Export from `/genie-dashboard/src/components/shared/index.ts`

- [ ] Refactor the home page to be a proper dashboard:
  - Replace the current landing page content in `/genie-dashboard/src/app/(dashboard)/page.tsx`
  - Layout structure:
    - Header row with "Application Dashboard" title and "View All Applications" button
    - Status cards row (4 cards)
    - Two-column layout below:
      - Left (8 columns): Application Trends chart + Recent Applications table
      - Right (4 columns): Monthly Statistics chart + Process Metrics + Quick Actions
  - Use CSS Grid for responsive layout (stack on mobile)
  - Remove the current hero section and feature cards
  - Keep the news verification stats section but move it below the dashboard or integrate it

- [ ] Create the dashboard components index:
  - Create `/genie-dashboard/src/components/dashboard/index.ts` to export all dashboard components
  - Export: StatusCards, ApplicationTrendsChart, MonthlyStatisticsChart, RecentApplicationsTable, ProcessMetrics, QuickActions

- [ ] Verify the dashboard works:
  - Ensure the dev server is running
  - Navigate to the home page `/`
  - Confirm all dashboard sections render correctly
  - Verify charts display properly (even with mock/seed data)
  - Test responsive layout on different screen sizes
  - Verify navigation links work
