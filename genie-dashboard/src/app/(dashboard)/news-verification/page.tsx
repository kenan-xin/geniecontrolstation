"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Newspaper, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNewsArticles } from "@/hooks/use-news-articles";
import { CreateNewsLeadDialog } from "@/components/news-verification/create-news-lead-dialog";
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
  type SortState,
} from "@/components/shared";
import type { NewsArticle } from "@/types";

export default function NewsVerificationPage() {
  const { data: articles, isLoading, isError, error, refetch } = useNewsArticles();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<SortState>({ column: "submissionDate", direction: "desc" });

  // Define table columns
  const columns: Column<NewsArticle>[] = useMemo(
    () => [
      {
        key: "id",
        header: "ID",
        width: "80px",
        sortable: true,
        getSortValue: (a) => a.id,
        render: (article) => (
          <span className="font-mono text-sm text-muted-foreground">#{article.id}</span>
        ),
      },
      {
        key: "title",
        header: "Title",
        sortable: true,
        getSortValue: (a) => a.title ?? "",
        render: (article) => (
          <div className="min-w-0">
            <div className="font-medium text-foreground line-clamp-1">{article.title}</div>
            <div className="text-sm text-muted-foreground line-clamp-1">
              {article.storyDescription}
            </div>
          </div>
        ),
      },
      {
        key: "submissionDate",
        header: "Submitted",
        width: "140px",
        sortable: true,
        getSortValue: (a) => a.submissionDate,
        render: (article) => (
          <span className="text-sm text-muted-foreground">{article.submissionDate}</span>
        ),
      },
      {
        key: "currentStatus",
        header: "Status",
        width: "120px",
        sortable: true,
        getSortValue: (a) => a.currentStatus,
        render: (article) => {
          const config = newsStatusConfig[article.currentStatus as keyof typeof newsStatusConfig] || newsStatusConfig.Unverified;
          return (
            <Badge variant="outline" className={`${config.color} border-current`}>
              {config.label}
            </Badge>
          );
        },
      },
      {
        key: "sources",
        header: "Source",
        width: "120px",
        sortable: true,
        getSortValue: (a) => a.sources ?? "",
        render: (article) => (
          <span className="text-sm text-muted-foreground">{article.sources}</span>
        ),
      },
      {
        key: "assignedTo",
        header: "Assigned To",
        width: "120px",
        sortable: true,
        getSortValue: (a) => a.assignedTo ?? "",
        render: (article) => (
          <span className="text-sm text-muted-foreground">{article.assignedTo || "—"}</span>
        ),
      },
    ],
    []
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Unverified: 0,
      Approval: 0,
      Schedule: 0,
      Published: 0,
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
    let filtered = articles.filter((a) => a.currentStatus !== "Rejected");

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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        icon={Newspaper}
        title="News Verification"
        description="AI-powered editorial workflow for verifying and publishing news stories"
        gradient={{ from: "from-amber-500", to: "to-orange-500", shadow: "shadow-amber-500/20" }}
        actions={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="size-4 mr-2" />
            News Lead
          </Button>
        }
      />

      {/* Loading State */}
      {isLoading && <CardGridSkeleton count={4} columns={4} />}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Failed to load articles"
          message={error?.message ?? "An error occurred while loading articles. Please try again."}
          onRetry={() => refetch()}
        />
      )}

      {/* Content - only show when not loading and no error */}
      {!isLoading && !isError && (
        <>
          {/* Status Summary Cards */}
          <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {newsStatusOrder.map((status) => (
              <StatusStatCard
                key={status}
                config={newsStatusConfig[status]}
                count={statusCounts[status]}
                showGradient
              />
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
                <EmptyState
                  title="No results found"
                  description={`No articles match "${searchValue}". Try a different search term.`}
                />
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
      <CreateNewsLeadDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
