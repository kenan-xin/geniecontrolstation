"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  TrendingUp,
  FileCheck,
  BookOpen,
  RefreshCw,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FactCheckResponse, FactCheckItem, Reference } from "@/types/fact-check";

interface AiInsightsDrawerProps {
  factCheckData: FactCheckResponse | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  onRegenerate: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function LoadingSkeletons() {
  return (
    <div className="p-4 space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: Error | null; onRetry: () => void }) {
  return (
    <div className="p-6 flex flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <div>
        <p className="font-medium">Failed to load analysis</p>
        <p className="text-sm text-muted-foreground mt-1">
          {error?.message || "An error occurred while fetching fact-check data."}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </Button>
    </div>
  );
}

function StatusIcon({ status }: { status: FactCheckItem["status"] }) {
  if (status === "ok") {
    return <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />;
  }
  if (status === "warning") {
    return <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />;
  }
  return <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />;
}

function ConfidenceBadge({ confidence }: { confidence: Reference["confidence"] }) {
  const variants = {
    High: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    Low: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <Badge variant="secondary" className={cn("text-xs font-medium", variants[confidence])}>
      {confidence}
    </Badge>
  );
}

function getScoreColor(score: number): string {
  if (score < 4) return "bg-red-500";
  if (score <= 6) return "bg-amber-500";
  return "bg-green-500";
}

export function AiInsightsDrawer({
  factCheckData,
  isLoading,
  isFetching,
  isError,
  error,
  onRegenerate,
  open,
  onOpenChange,
}: AiInsightsDrawerProps) {
  const showLoading = isLoading || isFetching;
  const warningCount = useMemo(() => {
    if (!factCheckData) return 0;
    const items = [
      ...factCheckData.factualAccuracy.items,
      ...factCheckData.contentIntegrity.items,
    ];
    return items.filter((item) => item.status === "error" || item.status === "warning").length;
  }, [factCheckData]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[450px] p-0 flex flex-col"
      >
        <SheetHeader className="border-b px-4 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-violet-600" />
              <span>AI Newsworthy Insights</span>
              {warningCount > 0 && !showLoading && (
                <Badge variant="destructive" className="ml-2">
                  {warningCount} issues
                </Badge>
              )}
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              disabled={showLoading}
              className="gap-1"
            >
              <RefreshCw className={cn("h-4 w-4", showLoading && "animate-spin")} />
              <span className="hidden sm:inline">Regenerate</span>
            </Button>
          </div>
          <SheetDescription className="sr-only">
            AI-powered fact-checking analysis and editorial recommendations
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {showLoading ? (
            <LoadingSkeletons />
          ) : isError ? (
            <ErrorState error={error} onRetry={onRegenerate} />
          ) : factCheckData ? (
            <div className="p-4">
              <Accordion defaultValue={["factual", "relevance", "integrity", "references"]} className="space-y-3">
                {/* Factual Accuracy */}
                <AccordionItem value="factual" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-violet-600" />
                      <span className="font-medium">Factual Accuracy</span>
                      <span className="text-xs text-muted-foreground">
                        ({factCheckData.factualAccuracy.items.length})
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {factCheckData.factualAccuracy.items.map((item) => (
                        <div key={item.key} className="flex items-start gap-2 py-1.5 border-b last:border-b-0">
                          <StatusIcon status={item.status} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{item.key}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Newsworthy Relevance */}
                <AccordionItem value="relevance" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-violet-600" />
                      <span className="font-medium">Newsworthy Relevance</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold">
                          {factCheckData.newsworthyRelevance.overallScore}
                        </span>
                        <span className="text-sm text-muted-foreground">/ 10</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn("h-full transition-all", getScoreColor(factCheckData.newsworthyRelevance.overallScore))}
                            style={{ width: `${(factCheckData.newsworthyRelevance.overallScore / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {factCheckData.newsworthyRelevance.items.map((item) => (
                          <div key={item.key} className="flex items-start gap-2 py-1">
                            <span className="font-medium text-sm flex-1">{item.key}</span>
                            <Badge variant="secondary" className="text-xs">
                              {item.score}
                            </Badge>
                            <p className="text-xs text-muted-foreground flex-[2]">{item.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Content Integrity */}
                <AccordionItem value="integrity" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-violet-600" />
                      <span className="font-medium">Content Integrity</span>
                      <span className="text-xs text-muted-foreground">
                        ({factCheckData.contentIntegrity.items.length})
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {factCheckData.contentIntegrity.items.map((item) => (
                        <div key={item.key} className="flex items-start gap-2 py-1.5 border-b last:border-b-0">
                          <StatusIcon status={item.status} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{item.key}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* References */}
                <AccordionItem value="references" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-violet-600" />
                      <span className="font-medium">References & Sources</span>
                      <span className="text-xs text-muted-foreground">
                        ({factCheckData.references.length})
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {factCheckData.references.map((ref, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-3">
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-sm text-primary hover:underline line-clamp-1"
                            >
                              {ref.title}
                            </a>
                            <div className="flex items-center gap-2 mt-1.5">
                              <ConfidenceBadge confidence={ref.confidence} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5">{ref.reason}</p>
                            <p className="text-xs text-muted-foreground italic mt-1 line-clamp-2">
                              &ldquo;{ref.snippet}&rdquo;
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// FAB Component
interface AiInsightsFabProps {
  warningCount: number;
  isLoading: boolean;
  isFetching: boolean;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
}

export function AiInsightsFab({
  warningCount,
  isLoading,
  isFetching,
  onClick,
  disabled = false,
  tooltip = "AI Newsworthy Insights",
}: AiInsightsFabProps) {
  const showSpinner = isLoading || isFetching;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all",
          "bg-gradient-to-br from-violet-600 to-purple-600 text-white",
          "hover:scale-110 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        )}
        title={tooltip}
      >
        <Sparkles className="h-6 w-6" />

        {/* Loading spinner */}
        {showSpinner && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4">
            <span className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin" />
          </span>
        )}

        {/* Warning/error badge */}
        {warningCount > 0 && !showSpinner && (
          <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {warningCount > 9 ? "9+" : warningCount}
          </span>
        )}
      </button>
    </div>
  );
}
