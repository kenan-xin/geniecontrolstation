"use client";

import { type LucideIcon, Plus, Search, FileSearch, ListMusic, Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon = FileSearch, title, description, action }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="items-center text-center pb-2">
        <div className="mb-3 flex size-16 items-center justify-center rounded-2xl bg-muted">
          <Icon className="size-8 text-muted-foreground/60" />
        </div>
        <CardTitle className="text-lg font-semibold text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground/80 max-w-sm mx-auto mb-4">
          {description}
        </p>
        {action && (
          <Button onClick={action.onClick} variant="outline">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Pre-configured empty states for common scenarios
export function NoArticlesEmpty({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyState
      icon={FileSearch}
      title="No articles found"
      description="No articles match your current filters. Try adjusting your search or filters."
      action={onClearFilters ? { label: "Clear filters", onClick: onClearFilters } : undefined}
    />
  );
}

export function NoSegmentsEmpty() {
  return (
    <EmptyState
      icon={ListMusic}
      title="No segments recorded yet"
      description="Start recording to capture audio segments. Transcriptions and social media sharing options will appear here."
    />
  );
}

export function NoStationsEmpty({ onAddStation }: { onAddStation?: () => void }) {
  return (
    <EmptyState
      icon={Radio}
      title="No stations configured"
      description="Add a station to get started with live streaming and recording."
      action={onAddStation ? { label: "Add Station", onClick: onAddStation } : undefined}
    />
  );
}

export function NoSearchResultsEmpty({ searchTerm, onClear }: { searchTerm?: string; onClear?: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={searchTerm
        ? `No results found for "${searchTerm}". Try a different search term.`
        : "No results found. Try a different search."
      }
      action={onClear ? { label: "Clear search", onClick: onClear } : undefined}
    />
  );
}
