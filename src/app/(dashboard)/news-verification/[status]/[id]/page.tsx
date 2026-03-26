'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useNewsArticle } from '@/hooks/use-news-articles';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { UnverifiedView } from '@/components/news-verification/stages/unverified-view';
import { ApprovalView } from '@/components/news-verification/stages/approval-view';
import { ScheduleView } from '@/components/news-verification/stages/schedule-view';
import { PublishedView } from '@/components/news-verification/stages/published-view';

// Status to URL mapping
const statusToUrl: Record<string, string> = {
  Unverified: 'unverified',
  Approval: 'approval',
  Schedule: 'schedule',
  Published: 'published',
  Rejected: 'rejected'
};

// URL to status mapping
const urlToStatus: Record<string, string> = {
  unverified: 'Unverified',
  approval: 'Approval',
  schedule: 'Schedule',
  published: 'Published'
};

function ArticleDetailSkeleton() {
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

function NotFoundState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button render={<Link href="/news-verification" />} className="gap-2">
          <ArrowLeft className="size-4" />
          Back to News Verification
        </Button>
      </div>
    </div>
  );
}

function InvalidStatusState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">Invalid Status</h1>
        <p className="text-muted-foreground mb-6">The URL contains an invalid status. Please navigate from the dashboard.</p>
        <Button render={<Link href="/news-verification" />} className="gap-2">
          <ArrowLeft className="size-4" />
          Back to News Verification
        </Button>
      </div>
    </div>
  );
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const status = params.status as string;
  const id = Number(params.id);

  const { data: article, isLoading, error } = useNewsArticle(id);

  // Check if status is valid
  const isValidStatus = Object.keys(urlToStatus).includes(status);

  // Handle status mismatch - redirect to correct URL
  useEffect(() => {
    if (article && isValidStatus) {
      const expectedStatus = article.currentStatus;
      const expectedUrl = statusToUrl[expectedStatus];

      if (expectedUrl && status !== expectedUrl) {
        // Redirect to correct URL
        router.replace(`/news-verification/${expectedUrl}/${id}`);
      }
    }
  }, [article, status, id, router, isValidStatus]);

  // Loading state
  if (isLoading) {
    return <ArticleDetailSkeleton />;
  }

  // Error or not found state
  if (error || !article) {
    return <NotFoundState />;
  }

  // Invalid status
  if (!isValidStatus) {
    return <InvalidStatusState />;
  }

  // Map status to view component
  const renderView = () => {
    switch (article.currentStatus) {
      case 'Unverified':
        return <UnverifiedView article={article} />;
      case 'Approval':
        return <ApprovalView article={article} />;
      case 'Schedule':
        return <ScheduleView article={article} />;
      case 'Published':
        return <PublishedView article={article} />;
      case 'Rejected':
        // Rejected articles show the last known view
        // They could be in any stage before rejection
        return <UnverifiedView article={article} />;
      default:
        return <InvalidStatusState />;
    }
  };

  return renderView();
}
