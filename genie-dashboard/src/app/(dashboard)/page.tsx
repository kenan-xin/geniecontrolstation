"use client";

import Link from "next/link";
import {
  Newspaper,
  Radio,
  AlertTriangle,
  Clock,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewsArticles } from "@/hooks/use-news-articles";

export default function HomePage() {
  // Fetch news articles by status
  const { data: unverifiedArticles = [], isLoading: loadingUnverified } = useNewsArticles("unverified");
  const { data: pendingArticles = [], isLoading: loadingPending } = useNewsArticles("pending_approval");
  const { data: scheduledArticles = [], isLoading: loadingScheduled } = useNewsArticles("scheduled");
  const { data: publishedArticles = [], isLoading: loadingPublished } = useNewsArticles("published");

  const isLoading = loadingUnverified || loadingPending || loadingScheduled || loadingPublished;

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/30 px-8 py-10 lg:px-12 lg:py-14">
        {/* Subtle dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.5 0 0 / 0.08) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand mb-5">
            <Sparkles className="size-3" />
            AI-Powered Platform
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-[1.15]">
            Genie Control Station
          </h1>
          <p className="mt-3 text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl">
            AI-Powered Media Management Platform — streamline your editorial
            workflows and broadcast operations from a single command center.
          </p>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-brand/8 blur-[80px] pointer-events-none" />
        <div className="absolute right-1/3 -bottom-32 size-64 rounded-full bg-blue-500/6 blur-[60px] pointer-events-none" />
      </section>

      {/* Feature Cards */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* News Verification */}
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/12 via-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <CardHeader className="relative pb-2">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
              <Newspaper className="size-7 text-white" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              News Verification
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              AI-powered editorial workflow for verifying and publishing news
              stories through a 4-stage pipeline
            </CardDescription>
          </CardHeader>
          <CardContent className="relative pt-2">
            <Button
              render={<Link href="/news-verification" />}
              nativeButton={false}
              className="gap-2"
            >
              Open News Verification
              <ArrowRight
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                data-icon="inline-end"
              />
            </Button>
          </CardContent>
        </Card>

        {/* Community Manager */}
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/12 via-indigo-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <CardHeader className="relative pb-2">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/25">
              <Radio className="size-7 text-white" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              Community Manager
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Radio station management with live streaming, recording, AI
              transcription, and social media sharing
            </CardDescription>
          </CardHeader>
          <CardContent className="relative pt-2">
            <Button
              render={<Link href="/community-manager" />}
              nativeButton={false}
              className="gap-2"
            >
              Open Community Manager
              <ArrowRight
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                data-icon="inline-end"
              />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Quick Stats - News Verification */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 mb-3">
          News Verification Stats
        </h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} size="sm" className="border-l-[3px] border-l-muted">
                <CardContent className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            (
              [
                {
                  label: "Unverified",
                  count: unverifiedArticles.length,
                  icon: AlertTriangle,
                  color: "text-red-500",
                  bg: "bg-red-500/10",
                  border: "border-l-red-500",
                },
                {
                  label: "Pending Approval",
                  count: pendingArticles.length,
                  icon: Clock,
                  color: "text-amber-500",
                  bg: "bg-amber-500/10",
                  border: "border-l-amber-500",
                },
                {
                  label: "Scheduled",
                  count: scheduledArticles.length,
                  icon: CalendarCheck,
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                  border: "border-l-blue-500",
                },
                {
                  label: "Published",
                  count: publishedArticles.length,
                  icon: CheckCircle2,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10",
                  border: "border-l-emerald-500",
                },
              ] as const
            ).map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  size="sm"
                  className={`border-l-[3px] ${stat.border}`}
                >
                  <CardContent className="flex items-center gap-3">
                    <div className={`shrink-0 rounded-lg p-2 ${stat.bg}`}>
                      <Icon className={`size-4 ${stat.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-2xl font-bold tracking-tight leading-none ${stat.color}`}
                      >
                        {stat.count}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground truncate">
                        {stat.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </section>

    </div>
  );
}
