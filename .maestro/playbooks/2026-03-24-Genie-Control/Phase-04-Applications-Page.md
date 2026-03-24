# Phase 04: Applications Page

This phase creates the complete Applications page with status cards, data table with progress bars, search/filter/sort functionality, and export capabilities. Also creates the individual status-based detail pages (Document Assessment, Candidate Screening, Pending Approval, Approved). This brings feature parity with the original Mantis application.

## Tasks

- [ ] Create the Applications main page:
  - Create `/genie-dashboard/src/app/(dashboard)/applications/page.tsx`
  - Include PageHeader with appropriate icon (ClipboardList or Layers)
    - Include status cards row (4 cards using StatusStatCard)
    - Include data table toolbar (search/filter/sort)
    - Use PaginatedTable component from Phase 03
    - Include Export button in the table header area
- Define table columns:
  - Columns: Application ID, Candidate Name, Submission Date, Overall Progress, Current Status, Training Provider, Assigned To
  - Actions column: View button that navigates based on status

The </div>  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        icon={ClipboardList}
        title="Applications"
        description="Manage candidate applications through the 4-stage approval workflow"
        gradient={{ from: "from-violet-500", to: "to-purple-500", shadow: "shadow-violet-500/20" }}
        actions={
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={!visibleApplications.length}
          >
            <Download className="size-4 mr-2" />
            Export
          </Button>
        }
      />

      {/* Loading State */}
      {isLoading && <CardGridSkeleton count={4} columns={4} />}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Failed to load applications"
          message={error?.message ?? "An error occurred while loading applications. Please try again."}
          onRetry={() => refetch()}
        />
      />

      {/* Content - only show when not loading and no error */}
      {!isLoading && !isError && (
        <>
          {/* Status Summary Cards */}
          <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {applicationStatusOrder.map((status) => (
              <StatusStatCard
                key={status}
                config={applicationStatusConfig[status]}
                count={statusCounts[status]}
                showGradient
              />
            ))}
          </section>

          {/* Applications List */}
          {visibleApplications.length === 0 && !searchValue ? (
            <EmptyState
              title="No applications yet"
              description="Applications will appear here once submitted. They will progress through Document Assessment, Candidate Screening, Pending Approval, and Approved stages."
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">All Applications</h2>
              </div>
              <DataTableToolbar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="Search by name, ID, provider, or assignee..."
              />
              {visibleApplications.length === 0 ? (
                <EmptyState
                  title="No results found"
                  description={`No applications match "${searchValue}". Try a different search term.`}
                />
              ) : (
                <PaginatedTable
                  columns={columns}
                  data={visibleApplications}
                  sort={sort}
                  onSortChange={setSort}
                  pageSize={10}
                  actions={(app) => (
                    <Link href={getApplicationPath(app)}>
                      <Button size="sm" variant="outline">
                        <Eye className="size-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}


- [ ] Define applications table columns:
  - Columns: Application ID, Candidate Name, Submission Date, Overall Progress, Current Status, Training Provider, Assigned To, Actions
  - Progress column: Show Progress bar component with percentage text
  - Status column: Use StatusBadge with dot indicator
  - Actions column: View button that navigates based on status

- [ ] Create application status navigation helper:
  - Add `getApplicationRoute(status, id)` function to `/genie-dashboard/src/lib/utils.ts` or a new helper file
  - Map status to routes:
    - "Document Assessment" → `/applications/document-assessment/[id]`
    - "Candidate Screening" → `/applications/candidate-screening/[id]`
    - "Pending Approval" → `/applications/pending-approval/[id]`
    - "Approved" → `/applications/approved/[id]`

- [ ] Create application detail page layout:
  - Create `/genie-dashboard/src/app/(dashboard)/applications/[status]/[id]/page.tsx`
  - Use the same pattern as news verification detail pages
  - Include workflow stepper showing the 4 stages
  - Display application information in organized sections
  - Include action buttons based on current status (Advance, Reject, etc.)

- [ ] Create application detail sections:
  - Create `/genie-dashboard/src/components/applications/sections/` directory
  - Create `candidate-info-section.tsx`: Display candidate name, email, phone, training provider
  - Create `application-progress-section.tsx`: Show progress bar and current stage
  - Create `assignment-section.tsx`: Show assigned officer, notes
  - Create `timeline-section.tsx`: Show application history/notes
  - Create `index.ts` to export all sections

- [ ] Create application detail views for each status:
  - Create `/genie-dashboard/src/components/applications/stages/document-assessment-view.tsx`
  - Create `/genie-dashboard/src/components/applications/stages/candidate-screening-view.tsx`
  - Create `/genie-dashboard/src/components/applications/stages/pending-approval-view.tsx`
  - Create `/genie-dashboard/src/components/applications/stages/approved-view.tsx`
  - Each view shows relevant fields and action buttons for that stage
  - Follow the pattern from news verification stage views

- [ ] Implement application status transitions:
  - Add PUT endpoint to `/genie-dashboard/src/app/api/applications/[id]/route.ts`
  - Accept status updates in the request body
  - Update the application's currentStatus and overallProgress
  - Progress mapping: Document Assessment=25%, Candidate Screening=50%, Pending Approval=75%, Approved=100%

- [ ] Add sidebar navigation for Applications:
  - Update `/genie-dashboard/src/components/layout/sidebar.tsx`
  - Add "Applications" nav item with icon (ClipboardList)
  - Add nested items under a "Process" section:
    - Applications (main page)
    - Document Assessment
    - Candidate Screening
    - Pending Approval
  - Consider grouping with collapsible section

- [ ] Create dedicated status list pages (optional but recommended):
  - Create `/genie-dashboard/src/app/(dashboard)/applications/document-assessment/page.tsx`
  - Create `/genie-dashboard/src/app/(dashboard)/applications/candidate-screening/page.tsx`
  - Create `/genie-dashboard/src/app/(dashboard)/applications/pending-approval/page.tsx`
  - Create `/genie-dashboard/src/app/(dashboard)/applications/approved/page.tsx`
  - Each page shows only applications in that status
  - Reuse the same data table component

- [ ] Verify the Applications page works:
  - Ensure the dev server is running
  - Navigate to `/applications`
  - Verify status cards show correct counts
  - Test search/filter functionality
  - Test sorting by different columns
  - Test pagination
  - Click View button on an application, verify it navigates to the correct detail page
  - On detail page, verify all sections display correctly
  - Test status transition (advance to next stage)
  - Verify sidebar navigation includes Applications section
  - Test CSV export
