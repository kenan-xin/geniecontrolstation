'use client';

import Link from 'next/link';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  StatusCards,
  ApplicationTrendsChart,
  MonthlyStatisticsChart,
  RecentApplicationsTable,
  ProcessMetrics,
  QuickActions
} from '@/components/dashboard';
import { useApplications } from '@/hooks/use-applications';

export default function HomePage() {
  const { data: applications = [] } = useApplications();

  const pendingApproval = applications.filter((a) => a.currentStatus === 'Pending Approval').length;
  const needsAttention = pendingApproval > 0;

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Personalized Header with Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{greeting}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
        </div>
        <Link
          href="/applications"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 gap-2 bg-primary text-primary-foreground h-8 px-2.5 hover:bg-primary/80"
        >
          View All Applications
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Attention Summary Banner */}
      {needsAttention && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="size-5 text-amber-600 dark:text-amber-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="font-medium text-amber-900 dark:text-amber-100">
              {pendingApproval} application{pendingApproval !== 1 ? 's' : ''} pending approval
            </span>
            <span className="text-amber-700 dark:text-amber-300 ml-2">Review and take action</span>
          </div>
          <Link href="/applications?status=Pending%20Approval">
            <Button
              size="sm"
              variant="outline"
              className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50"
            >
              Review
            </Button>
          </Link>
        </div>
      )}

      {/* Horizontal Metrics Bar */}
      <StatusCards />

      {/* Main Content Grid - Asymmetric Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column - Wider for primary content */}
        <div className="lg:col-span-8 space-y-6">
          <ApplicationTrendsChart />
          <RecentApplicationsTable />
        </div>

        {/* Right Column - Narrower for secondary info */}
        <div className="lg:col-span-4 space-y-6">
          <ProcessMetrics />
          <MonthlyStatisticsChart />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
