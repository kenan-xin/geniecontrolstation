"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Newspaper, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNewsArticles } from "@/hooks/use-news-articles";
import {
  PageHeader,
  CardGridSkeleton,
  ErrorState,
  EmptyState,
  newsStatusConfig,
  newsStatusOrder,
  getStatusPath,
  StatusStatCard,
} from "@/components/shared";
import type { NewsArticle } from "@/types";

export default function NewsVerificationPage() {
  const { data: articles, isLoading, isError, error, refetch } = useNewsArticles();

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
    return articles.filter((a) => a.currentStatus !== "Rejected");
  }, [articles]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        icon={Newspaper}
        title="News Verification"
        description="AI-powered editorial workflow for verifying and publishing news stories"
        gradient={{ from: "from-amber-500", to: "to-orange-500", shadow: "shadow-amber-500/20" }}
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
          {visibleArticles.length === 0 ? (
            <EmptyState
              title="No news articles yet"
              description="Data will appear once the database is connected. Articles will flow through the 4-stage verification pipeline automatically."
            />
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">All Articles</h2>
              <div className="grid gap-4">
                {visibleArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ArticleCard({ article }: { article: NewsArticle }) {
  const config = newsStatusConfig[article.currentStatus as keyof typeof newsStatusConfig] || newsStatusConfig.Unverified;
  const statusPath = getStatusPath(article.currentStatus);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${config.color} border-current`}>
                {config.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {article.storyCategory}
              </span>
              {article.storyUrgency === "Critical" && (
                <Badge variant="destructive" className="text-xs">
                  Critical
                </Badge>
              )}
            </div>
            <h3 className="font-medium text-foreground line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {article.storyDescription}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Submitted: {article.submissionDate}</span>
              <span>Source: {article.sources}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/news-verification/${statusPath}/${article.id}`}>
              <Button size="sm" variant="outline">
                <Eye className="size-4 mr-1" />
                View
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
