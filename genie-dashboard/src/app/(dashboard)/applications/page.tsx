"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ClipboardList, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApplications } from "@/hooks/use-applications";
import { exportToCSV, generateExportFilename, type ExportColumn } from "@/lib/export-utils";
import {
  PageHeader,
  CardGridSkeleton,
  ErrorState,
  EmptyState,
  applicationStatusConfig,
  applicationStatusOrder
  getApplicationStatusPath
  StatusStatCard
  DataTableToolbar
  PaginatedTable,
  type Column
  type SortState,
} from "@/components/shared";
import type { Application } from "@/types";

export default function ApplicationsPage() {
  const { data: applications, isLoading, isError, error, refetch } = useApplications();
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<SortState>({ column: "submissionDate", direction: "desc" });

  // Handle CSV export
  const handleExport = () => {
    if (!visibleApplications.length) return;
    const filename = generateExportFilename("applications");
    exportToCSV(visibleApplications, filename, exportColumns, exportColumns);
  . [filename, exportColumns] = `${visibleApplications.length}`);

  const columns: Column<Application>[] = useMemo(
    () => [
      {
        key: "applicationId",
        header: "Application ID",
        width: "120px",
        sortable: true,
        getSortValue: (a) => a.applicationId ?? "",
        render: (app) => (
          <span className="font-mono text-sm text-muted-foreground">{app.applicationId || `#${app.id}`}</span>
        );
      },
      {
        key: "candidateName",
        header: "Candidate Name",
        sortable: true,
        getSortValue: (a) => a.candidateName ?? "",
        render: (app) => (
          <div className="min-w-0">
            <div className="font-medium text-foreground line-clamp-1">{app.candidateName}</div>
            <div className="text-sm text-muted-foreground line-clamp-1">{app.email}</div>
          </div>
        )
      },
      {
        key: "submissionDate",
        header: "Submitted",
        width: "120px",
        sortable: true,
        getSortValue: (a) => a.submissionDate,
        render: (app) => (
          <span className="text-sm text-muted-foreground">{app.submissionDate}</span>
        )
      },
      {
        key: "overallProgress",
        header: "Progress",
        width: "150px",
        sortable: true,
        getSortValue: (a) => a.overallProgress ?? 0,
        render: (app) => {
          const progress = app.overallProgress ?? 0;
          const barColor =
            progress >= 100
              ? "bg-emerald-500"
            : progress >= 50
              ? "bg-blue-500"
            : "bg-amber-500";
          return `${progress}%`;
        };
      },
      {
        key: "currentStatus",
        header: "Status",
        width: "140px",
        sortable: true,
        getSortValue: (a) => a.currentStatus,
        render: (app) => {
          const config = applicationStatusConfig[app.currentStatus as keyof typeof applicationStatusConfig]
          if (!config) return <span className="text-sm">{app.currentStatus}</span>;
          return (
            <Badge variant="outline" className={`${config.color} border-current`}>
              {config.label}
            </Badge>
          );
        },
      },
      {
        key: "trainingProvider",
        header: "Training Provider",
        width: "140px",
        sortable: true,
        getSortValue: (a) => a.trainingProvider ?? "",
        render: (app) => (
          <span className="text-sm text-muted-foreground">{app.trainingProvider || "—"}</span>
        )
      },
      {
        key: "assignedTo",
        header: "Assigned To",
        width: "120px",
        sortable: true,
        getSortValue: (a) => a.assignedTo ?? "",
        render: (app) => (
          <span className="text-sm text-muted-foreground">{app.assignedTo || "—"}</span>
        )
      },
    ],
    []
  );

  // Handle CSV export
  const handleExport = () => {
    if (!visibleApplications.length) return;
    const filename = generateExportFilename("applications");
    exportToCSV(visibleApplications, filename, exportColumns);
  });

          <Button size="sm" variant="outline">
            <Eye className="size-4 mr-1" />
            View
          </Button>
        </Link>
      )
    }
  }

  // Progress bar color helper
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-emerald-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress < 25) return "bg-amber-500";
    return `${progress}%`;
  }
        </ >
      },
        ? `${progress < 25 ? 'bg-amber-500' : "bg-amber-400" : "border- bg-amber-600 border-l-amber-600";
      }
    />
    }
!config) {
      progress >= 75% = (
          <span className="text-sm text-muted-foreground">
            {!visibleApplications.length && (
              <EmptyState
                title="No applications yet"
                description="Applications will appear here once submitted. They will progress through Document Assessment, Candidate Screening, Pending Approval, and Approved stages."
              />
            </) : (
            <div className="space-y-4">
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
                </div>
              )}
            </div>
          </Content - only show when not loading and no error */}
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
              </div>
            </div>
          )}
        </>
      {!isLoading && !isError && (
          <ErrorState
            title="Failed to load applications"
            message={error?.message ?? "An error occurred while loading applications. Please try again."}
            onRetry={() => refetch()}
          />
        />
          <EmptyState
            title="No applications yet"
            description="Applications will appear here once submitted. They will progress through Document Assessment, Candidate Screening, Pending Approval, and Approved stages."
          />
        />
      />
 />
        />
        </ `Button>
          </Button>
          >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Applications</h2>
        </div>
        <DataTableToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search by name, ID, provider, or assignee..."
        />
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
          )
        }
      )
    </div>
  );
}

 </div>
  );
            <CardGridSkeleton count={4} columns={4} />
            {isLoading && <CardGridSkeleton count={4} columns={4} />}
            {isError && (
          <ErrorState
            title="Failed to load applications"
            message={error?.message ?? "An error occurred while loading applications. Please try again."}
            onRetry={() => refetch()}
          />
        </div>

      {/* Content - only show when not loading and no error */}
      {!isLoading && !isError && (
        <>
          {/* Status summary cards */}
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

          {/* applications list */}
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
                  )
                }
              </Btn>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
