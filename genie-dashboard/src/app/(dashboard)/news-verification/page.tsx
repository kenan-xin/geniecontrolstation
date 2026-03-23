"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  CalendarCheck,
  CheckCircle2,
  Newspaper,
  FileSearch,
  Eye,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNewsArticles } from "@/hooks/use-news-articles";
import type { NewsArticle } from "@/types";

const statusConfig = {
  Unverified: {
    label: "Unverified",
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-l-red-500",
    gradient: "from-red-500/8 to-transparent",
  },
  Approval: {
    label: "Pending Approval",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-l-amber-500",
    gradient: "from-amber-500/8 to-transparent",
  },
  Schedule: {
    label: "Scheduled",
    icon: CalendarCheck,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-l-blue-500",
    gradient: "from-blue-500/8 to-transparent",
  },
  Published: {
    label: "Published",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-l-emerald-500",
    gradient: "from-emerald-500/8 to-transparent",
  },
} as const;

const statusOrder = ["Unverified", "Approval", "Schedule", "Published"] as const;

function getStatusPath(status: string): string {
  switch (status) {
    case "Approval":
      return "approval";
    case "Schedule":
      return "schedule";
    case "Published":
      return "published";
    default:
      return "unverified";
  }
}

export default function NewsVerificationPage() {
  const { data: articles, isLoading, error } = useNewsArticles();

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

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-md shadow-amber-500/20">
            <Newspaper className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              News Verification
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-powered editorial workflow for verifying and publishing news
              stories
            </p>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-12 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-md shadow-amber-500/20">
            <Newspaper className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              News Verification
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-powered editorial workflow for verifying and publishing news
              stories
            </p>
          </div>
        </div>
        <Card className="border-destructive">
          <CardContent className="p-4 text-destructive">
            Error loading articles. Please try again.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-md shadow-amber-500/20">
            <Newspaper className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              News Verification
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-powered editorial workflow for verifying and publishing news
              stories
            </p>
          </div>
        </div>
      </div>

      {/* Status Summary Cards */}
      <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statusOrder.map((status) => {
          const config = statusConfig[status];
          const Icon = config.icon;
          return (
            <Card
              key={status}
              className={`relative overflow-hidden border-l-[3px] ${config.border} transition-shadow duration-200 hover:shadow-md`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none`}
              />
              <CardContent className="relative flex items-center gap-3">
                <div className={`shrink-0 rounded-lg p-2.5 ${config.bg}`}>
                  <Icon className={`size-4.5 ${config.color}`} />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-3xl font-bold tracking-tight leading-none ${config.color}`}
                  >
                    {statusCounts[status]}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground truncate">
                    {config.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Articles List */}
      {visibleArticles.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="items-center text-center pb-2">
            <div className="mb-3 flex size-16 items-center justify-center rounded-2xl bg-muted">
              <FileSearch className="size-8 text-muted-foreground/60" />
            </div>
            <CardTitle className="text-lg font-semibold text-muted-foreground">
              No news articles yet
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground/80 max-w-sm mx-auto">
              Data will appear once the database is connected. Articles will
              flow through the 4-stage verification pipeline automatically.
            </p>
          </CardContent>
        </Card>
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
    </div>
  );
}

function ArticleCard({ article }: { article: NewsArticle }) {
  const config = statusConfig[article.currentStatus as keyof typeof statusConfig] || statusConfig.Unverified;
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
