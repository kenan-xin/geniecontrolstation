'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Newspaper, Eye, Plus, Download, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNewsArticles } from '@/hooks/use-news-articles';
import { exportToCSV, generateExportFilename, type ExportColumn } from '@/lib/export-utils';
import { CreateNewsLeadDialog } from '@/components/news-verification/create-news-lead-dialog';
import {
  PageHeader,
  CardGridSkeleton,
  ErrorState,
  EmptyState,
  newsStatusConfig,
  newsStatusOrder,
  getStatusPath,
  StatusStatCard,
  DataTableToolbar,
  PaginatedTable,
  type Column,
  type SortState
} from '@/components/shared';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import type { NewsArticle } from '@/types';

export default function NewsVerificationPage() {
  const { data: articles, isLoading, isError, error, refetch } = useNewsArticles();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [now] = useState(() => Date.now());
  const [searchValue, setSearchValue] = useState('');
  const [sort, setSort] = useState<SortState>({ column: 'submissionDate', direction: 'desc' });

  // Export columns definition
  const exportColumns: ExportColumn<NewsArticle>[] = useMemo(
    () => [
      { key: 'id', header: 'ID' },
      { key: 'title', header: 'Title' },
      { key: 'storyDescription', header: 'Description' },
      { key: 'submissionDate', header: 'Submission Date' },
      {
        key: 'currentStatus',
        header: 'Status',
        format: (_, article) => {
          const config = newsStatusConfig[article.currentStatus as keyof typeof newsStatusConfig];
          return config?.label ?? article.currentStatus;
        }
      },
      { key: 'sources', header: 'Source' },
      { key: 'assignedTo', header: 'Assigned To' },
      { key: 'storyCategory', header: 'Category' },
      { key: 'storyUrgency', header: 'Urgency' },
      { key: 'storyEstimatedImpact', header: 'Impact' },
      { key: 'submitterFullName', header: 'Submitter Name' },
      { key: 'submitterEmail', header: 'Submitter Email' },
      { key: 'submitterPhone', header: 'Submitter Phone' }
    ],
    []
  );

  // Handle CSV export
  const handleExport = () => {
    if (!visibleArticles.length) return;
    const filename = generateExportFilename('news_leads');
    exportToCSV(visibleArticles, filename, exportColumns);
  };

  // Define table columns
  const columns: Column<NewsArticle>[] = useMemo(
    () => [
      {
        key: 'id',
        header: 'ID',
        width: '80px',
        sortable: true,
        getSortValue: (a) => a.id,
        render: (article) => <span className="font-mono text-sm text-muted-foreground">#{article.id}</span>
      },
      {
        key: 'title',
        header: 'Title',
        width: '200px',
        sortable: true,
        getSortValue: (a) => a.title ?? '',
        render: (article) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <div className="min-w-0 cursor-default">
                    <div className="font-medium text-foreground truncate">{article.title}</div>
                    <div className="text-sm text-muted-foreground truncate">{article.storyDescription}</div>
                  </div>
                }
              />
              <TooltipContent side="top" align="start" className="max-w-md">
                <div className="font-medium">{article.title}</div>
                {article.storyDescription && <div className="text-muted-foreground mt-1">{article.storyDescription}</div>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
      {
        key: 'submissionDate',
        header: 'Submitted',
        width: '140px',
        sortable: true,
        getSortValue: (a) => a.submissionDate,
        render: (article) => <span className="text-sm text-muted-foreground">{article.submissionDate}</span>
      },
      {
        key: 'currentStatus',
        header: 'Status',
        width: '120px',
        sortable: true,
        getSortValue: (a) => a.currentStatus,
        render: (article) => {
          const config = newsStatusConfig[article.currentStatus as keyof typeof newsStatusConfig] || newsStatusConfig.Unverified;
          return (
            <Badge variant="outline" className={`${config.color} border-current`}>
              {config.label}
            </Badge>
          );
        }
      },
      {
        key: 'sources',
        header: 'Source',
        width: '120px',
        sortable: true,
        getSortValue: (a) => a.sources ?? '',
        render: (article) => <span className="text-sm text-muted-foreground">{article.sources}</span>
      },
      {
        key: 'assignedTo',
        header: 'Assigned To',
        width: '120px',
        sortable: true,
        getSortValue: (a) => a.assignedTo ?? '',
        render: (article) => <span className="text-sm text-muted-foreground">{article.assignedTo || '—'}</span>
      }
    ],
    []
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Unverified: 0,
      Approval: 0,
      Schedule: 0,
      Published: 0
    };
    if (articles) {
      for (const article of articles) {
        if (counts[article.currentStatus] !== undefined) {
          counts[article.currentStatus]++;
        }
      }
    }
    return counts;
  }, [articles]);

  const visibleArticles = useMemo(() => {
    if (!articles) return [];
    let filtered = articles.filter((a) => a.currentStatus !== 'Rejected');

    // Apply search filter
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase().trim();
      filtered = filtered.filter((a) => {
        const titleMatch = a.title?.toLowerCase().includes(searchLower);
        const sourcesMatch = a.sources?.toLowerCase().includes(searchLower);
        const assignedToMatch = a.assignedTo?.toLowerCase().includes(searchLower);
        return titleMatch || sourcesMatch || assignedToMatch;
      });
    }

    return filtered;
  }, [articles, searchValue]);

  // Get status path for navigation
  const getArticlePath = (article: NewsArticle) => {
    const statusPath = getStatusPath(article.currentStatus);
    return `/news-verification/${statusPath}/${article.id}`;
  };

  // Calculate last updated timestamp for activity indicator
  const lastUpdated = useMemo(() => {
    if (!articles || articles.length === 0) return null;
    const mostRecent = articles.reduce(
      (latest, article) => {
        const articleDate = new Date(article.updatedAt || article.createdAt || 0).getTime();
        const latestDate = latest ? new Date(latest.updatedAt || latest.createdAt || 0).getTime() : 0;
        return articleDate > latestDate ? article : latest;
      },
      null as NewsArticle | null
    );
    if (!mostRecent) return null;
    const updatedDate = new Date(mostRecent.updatedAt || mostRecent.createdAt || 0).getTime();
    const diffMs = now - updatedDate;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }, [articles, now]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        icon={Newspaper}
        title="News Verification"
        description="AI-powered editorial workflow for verifying and publishing news stories"
      />

      {/* Loading State */}
      {isLoading && <CardGridSkeleton count={4} columns={4} />}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Failed to load articles"
          message={error?.message ?? 'An error occurred while loading articles. Please try again.'}
          onRetry={() => refetch()}
        />
      )}

      {/* Content - only show when not loading and no error */}
      {!isLoading && !isError && (
        <>
          {/* Quick Actions Bar */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Quick Actions:</span>
              <Button size="sm" variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="size-3.5 mr-1.5" />
                New Lead
              </Button>
              <Button size="sm" variant="outline" onClick={handleExport} disabled={!visibleArticles.length}>
                <Download className="size-3.5 mr-1.5" />
                Export
              </Button>
            </div>
            {lastUpdated && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3" />
                <span>Last updated: {lastUpdated}</span>
              </div>
            )}
          </div>

          {/* Status Summary Cards - Asymmetric Grid */}
          <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {/* Unverified spans 2 columns as primary action */}
            <div className="col-span-2">
              <StatusStatCard config={newsStatusConfig['Unverified']} count={statusCounts['Unverified']} />
            </div>
            {newsStatusOrder
              .filter((s) => s !== 'Unverified')
              .map((status) => (
                <StatusStatCard key={status} config={newsStatusConfig[status]} count={statusCounts[status]} />
              ))}
          </section>

          {/* Articles List */}
          {visibleArticles.length === 0 && !searchValue ? (
            <EmptyState
              title="No news articles yet"
              description="Data will appear once the database is connected. Articles will flow through the 4-stage verification pipeline automatically."
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">All Articles</h2>
              </div>
              <DataTableToolbar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="Search by title, source, or assignee..."
              />
              {visibleArticles.length === 0 ? (
                <EmptyState title="No results found" description={`No articles match "${searchValue}". Try a different search term.`} />
              ) : (
                <PaginatedTable
                  columns={columns}
                  data={visibleArticles}
                  sort={sort}
                  onSortChange={setSort}
                  pageSize={10}
                  actions={(article) => (
                    <Link href={getArticlePath(article)}>
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

      {/* Create News Lead Dialog */}
      <CreateNewsLeadDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  );
}
