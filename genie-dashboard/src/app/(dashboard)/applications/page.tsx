'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApplications } from '@/hooks/use-applications';
import { exportToCSV, generateExportFilename, type ExportColumn } from '@/lib/export-utils';
import {
  PageHeader,
  CardGridSkeleton,
  ErrorState,
  EmptyState,
  applicationStatusConfig,
  applicationStatusOrder,
  getApplicationStatusPath,
  StatusStatCard,
  DataTableToolbar,
  PaginatedTable,
  type Column,
  type SortState
} from '@/components/shared';
import type { Application } from '@/types';

export default function ApplicationsPage() {
  const { data: applications, isLoading, isError, error, refetch } = useApplications();
  const [searchValue, setSearchValue] = useState('');
  const [sort, setSort] = useState<SortState>({ column: 'submissionDate', direction: 'desc' });

  // Export columns definition
  const exportColumns: ExportColumn<Application>[] = useMemo(
    () => [
      { key: 'applicationId', header: 'Application ID' },
      { key: 'candidateName', header: 'Candidate Name' },
      { key: 'email', header: 'Email' },
      { key: 'phone', header: 'Phone' },
      { key: 'submissionDate', header: 'Submission Date' },
      {
        key: 'overallProgress',
        header: 'Progress',
        format: (val) => `${val}%`
      },
      {
        key: 'currentStatus',
        header: 'Status',
        format: (_, app) => {
          const config = applicationStatusConfig[app.currentStatus as keyof typeof applicationStatusConfig];
          return config?.label ?? app.currentStatus;
        }
      },
      { key: 'trainingProvider', header: 'Training Provider' },
      { key: 'assignedTo', header: 'Assigned To' }
    ],
    []
  );

  // Handle CSV export
  const handleExport = () => {
    if (!visibleApplications.length) return;
    const filename = generateExportFilename('applications');
    exportToCSV(visibleApplications, filename, exportColumns);
  };

  // Progress bar color helper
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  // Define table columns
  const columns: Column<Application>[] = useMemo(
    () => [
      {
        key: 'applicationId',
        header: 'Application ID',
        width: '120px',
        sortable: true,
        getSortValue: (a) => a.applicationId ?? '',
        render: (app) => (
          <span className="font-mono text-sm text-muted-foreground">
            {app.applicationId || `#${app.id}`}
          </span>
        )
      },
      {
        key: 'candidateName',
        header: 'Candidate Name',
        sortable: true,
        getSortValue: (a) => a.candidateName ?? '',
        render: (app) => (
          <div className="min-w-0">
            <div className="font-medium text-foreground truncate">{app.candidateName}</div>
            <div className="text-sm text-muted-foreground truncate">{app.email}</div>
          </div>
        )
      },
      {
        key: 'submissionDate',
        header: 'Submitted',
        width: '120px',
        sortable: true,
        getSortValue: (a) => a.submissionDate,
        render: (app) => (
          <span className="text-sm text-muted-foreground">{app.submissionDate}</span>
        )
      },
      {
        key: 'overallProgress',
        header: 'Progress',
        width: '150px',
        sortable: true,
        getSortValue: (a) => a.overallProgress ?? 0,
        render: (app) => {
          const progress = app.overallProgress ?? 0;
          return (
            <div className="flex items-center gap-2 min-w-[100px]">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getProgressColor(progress)}`}
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground tabular-nums w-10 text-right">{progress}%</span>
            </div>
          );
        }
      },
      {
        key: 'currentStatus',
        header: 'Status',
        width: '160px',
        sortable: true,
        getSortValue: (a) => a.currentStatus,
        render: (app) => {
          const config = applicationStatusConfig[app.currentStatus as keyof typeof applicationStatusConfig];
          if (!config) return <span className="text-sm">{app.currentStatus}</span>;
          const Icon = config.icon;
          return (
            <Badge variant="outline" className={`${config.color} ${config.bg} border-current gap-1.5`}>
              <Icon className="size-3" />
              {config.label}
            </Badge>
          );
        }
      },
      {
        key: 'trainingProvider',
        header: 'Training Provider',
        width: '140px',
        sortable: true,
        getSortValue: (a) => a.trainingProvider ?? '',
        render: (app) => (
          <span className="text-sm text-muted-foreground">{app.trainingProvider || '—'}</span>
        )
      },
      {
        key: 'assignedTo',
        header: 'Assigned To',
        width: '120px',
        sortable: true,
        getSortValue: (a) => a.assignedTo ?? '',
        render: (app) => (
          <span className="text-sm text-muted-foreground">{app.assignedTo || '—'}</span>
        )
      }
    ],
    []
  );

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Document Assessment': 0,
      'Candidate Screening': 0,
      'Pending Approval': 0,
      'Approved': 0
    };
    if (applications) {
      for (const app of applications) {
        if (counts[app.currentStatus] !== undefined) {
          counts[app.currentStatus]++;
        }
      }
    }
    return counts;
  }, [applications]);

  // Filter and search applications
  const visibleApplications = useMemo(() => {
    if (!applications) return [];
    let filtered = applications;

    // Apply search filter
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase().trim();
      filtered = filtered.filter((a) => {
        const nameMatch = a.candidateName?.toLowerCase().includes(searchLower);
        const idMatch = a.applicationId?.toLowerCase().includes(searchLower);
        const providerMatch = a.trainingProvider?.toLowerCase().includes(searchLower);
        const assignedToMatch = a.assignedTo?.toLowerCase().includes(searchLower);
        return nameMatch || idMatch || providerMatch || assignedToMatch;
      });
    }

    return filtered;
  }, [applications, searchValue]);

  // Get status path for navigation
  const getApplicationPath = (app: Application) => {
    const statusPath = getApplicationStatusPath(app.currentStatus);
    return `/applications/${statusPath}/${app.id}`;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        icon={ClipboardList}
        title="Applications"
        description="Manage candidate applications through the 4-stage approval workflow"
        gradient={{ from: 'from-violet-500', to: 'to-purple-500', shadow: 'shadow-violet-500/20' }}
        actions={
          <Button variant="outline" onClick={handleExport} disabled={!visibleApplications.length}>
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
          message={error?.message ?? 'An error occurred while loading applications. Please try again.'}
          onRetry={() => refetch()}
        />
      )}

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
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
