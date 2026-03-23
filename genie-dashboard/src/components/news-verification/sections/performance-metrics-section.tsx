"use client";

import {
  TrendingUp,
  Eye,
  ThumbsUp,
  Share2,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PerformanceMetrics } from "@/types";

interface PerformanceMetricsSectionProps {
  metrics: PerformanceMetrics | null;
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

function StatCard({ icon: Icon, label, value, trend, trendValue }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border">
      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="size-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-foreground tracking-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">{label}</span>
          {trend && trendValue && (
            <span
              className={`text-xs font-medium ${
                trend === "up"
                  ? "text-emerald-500"
                  : trend === "down"
                    ? "text-red-500"
                    : "text-muted-foreground"
              }`}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : ""} {trendValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function PerformanceMetricsSection({
  metrics,
}: PerformanceMetricsSectionProps) {
  if (!metrics) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="size-14 rounded-full bg-muted flex items-center justify-center mb-3">
              <TrendingUp className="size-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">
              Metrics will be available once the article has been live
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={Eye}
            label="Views"
            value={metrics.views}
            trend="up"
            trendValue="12%"
          />
          <StatCard
            icon={ThumbsUp}
            label="Likes"
            value={metrics.likes}
            trend="up"
            trendValue="8%"
          />
          <StatCard
            icon={Share2}
            label="Shares"
            value={metrics.shares}
            trend="up"
            trendValue="24%"
          />
          <StatCard
            icon={MessageSquare}
            label="Comments"
            value={metrics.comments}
            trend="neutral"
          />
          <StatCard
            icon={TrendingUp}
            label="Engagement Rate"
            value={`${metrics.engagementRate.toFixed(1)}%`}
            trend="up"
            trendValue="3.2%"
          />
        </div>
      </CardContent>
    </Card>
  );
}
