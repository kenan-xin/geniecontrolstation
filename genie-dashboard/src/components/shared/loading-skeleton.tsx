'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface CardGridSkeletonProps {
  count?: number;
  columns?: number;
}

export function CardGridSkeleton({ count = 4, columns = 4 }: CardGridSkeletonProps) {
  const gridCols =
    {
      2: 'grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-2 lg:grid-cols-4'
    }[columns] ?? 'grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid gap-4 ${gridCols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="flex items-center gap-3 p-4">
            <Skeleton className="size-10 rounded-lg shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-7 w-10" />
              <Skeleton className="h-3 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
  return (
    <div className="overflow-x-auto">
      <div className="border rounded-lg">
        {/* Header */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 border-b">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1 min-w-[60px]" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-3 p-3 border-b last:border-b-0">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 flex-1 min-w-[60px]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar skeleton */}
      <header className="sticky top-0 z-30 bg-background border-b">
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-px hidden sm:block" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        {/* Stepper skeleton */}
        <div className="px-4 sm:px-6 py-4 border-t bg-muted/20">
          <div className="flex items-center justify-between">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <Skeleton className="size-9 rounded-full" />
                <Skeleton className="ml-2.5 h-4 w-20 hidden sm:block" />
                {i < 3 && <Skeleton className="flex-1 mx-2 h-0.5" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2-column skeleton */}
      <div className="flex">
        <aside className="hidden lg:block w-72 shrink-0 border-r bg-muted/10">
          <div className="sticky top-[133px] p-4 space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </aside>
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </main>
      </div>
    </div>
  );
}

export function StationCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="shrink-0 w-[120px] animate-pulse">
          <CardContent className="flex flex-col items-center gap-2 py-4">
            <Skeleton className="size-12 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MediaPlayerSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="py-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <Skeleton className="size-24 rounded-xl mx-auto sm:mx-0" />
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
