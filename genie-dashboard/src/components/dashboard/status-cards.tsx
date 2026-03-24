"use client";

import { Layers } from "lucide-react";
import { useApplications } from "@/hooks/use-applications";
import {
  StatusStatCard,
  applicationStatusConfig,
  applicationStatusOrder,
  CardGridSkeleton,
} from "@/components/shared";
import type { ApplicationStatus } from "@/components/shared/application-status-config";

// Total applications config (not a status, but uses same structure)
const totalConfig = {
  label: "Total Applications",
  icon: Layers,
  color: "text-foreground",
  bg: "bg-muted",
  border: "border-l-brand",
};

export function StatusCards() {
  const { data: applications = [], isLoading } = useApplications();

  // Count applications by status
  const statusCounts = applications.reduce(
    (acc, app) => {
      const status = app.currentStatus as ApplicationStatus;
      if (status && applicationStatusConfig[status]) {
        acc[status] = (acc[status] || 0) + 1;
      }
      return acc;
    },
    {} as Record<ApplicationStatus, number>
  );

  // Calculate total
  const total = applications.length;

  if (isLoading) {
    return <CardGridSkeleton count={4} columns={4} />;
  }

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {/* Total Applications Card */}
      <StatusStatCard config={totalConfig} count={total} size="sm" />

      {/* Status-specific cards: Document Assessment, Candidate Screening, Pending Approval */}
      {applicationStatusOrder.slice(0, 3).map((status) => (
        <StatusStatCard
          key={status}
          config={applicationStatusConfig[status]}
          count={statusCounts[status] || 0}
          size="sm"
        />
      ))}
    </div>
  );
}
