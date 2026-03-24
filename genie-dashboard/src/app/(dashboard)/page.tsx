"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  StatusCards,
  ApplicationTrendsChart,
  MonthlyStatisticsChart,
  RecentApplicationsTable,
  ProcessMetrics,
  QuickActions,
} from "@/components/dashboard";

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Application Dashboard</h1>
        <Button asChild>
          <Link href="/applications" className="gap-2">
            View All Applications
            <ArrowRight className="size-4" />
          </Link>
        </Button>
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
