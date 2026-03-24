'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  StatusCards,
  ApplicationTrendsChart,
  MonthlyStatisticsChart,
  RecentApplicationsTable,
  ProcessMetrics,
  QuickActions
} from '@/components/dashboard';

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Application Dashboard</h1>
        <Link
          href="/applications"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 gap-2 bg-primary text-primary-foreground h-8 px-2.5 hover:bg-primary/80"
        >
          View All Applications
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Status Cards Row */}
      <StatusCards />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column - 8 cols */}
        <div className="lg:col-span-8 space-y-6">
          <ApplicationTrendsChart />
          <RecentApplicationsTable />
        </div>

        {/* Right Column - 4 cols */}
        <div className="lg:col-span-4 space-y-6">
          <MonthlyStatisticsChart />
          <ProcessMetrics />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
