'use client';

import { Layers, AlertCircle } from 'lucide-react';
import { useApplications } from '@/hooks/use-applications';
import { StatusStatCard, applicationStatusConfig, applicationStatusOrder, CardGridSkeleton } from '@/components/shared';
import type { ApplicationStatus } from '@/components/shared/application-status-config';

const totalConfig = {
  label: 'Total',
  icon: Layers,
  color: 'text-foreground',
  bg: 'bg-muted',
  border: 'border-l-brand'
};

const pendingApprovalConfig = {
  label: 'Needs Attention',
  icon: AlertCircle,
  color: 'text-amber-600 dark:text-amber-500',
  bg: 'bg-amber-50 dark:bg-amber-950',
  border: 'border-l-amber-500'
};

export function StatusCards() {
  const { data: applications = [], isLoading } = useApplications();

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

  const total = applications.length;
  const needsAttention = statusCounts['Pending Approval'] || 0;

  if (isLoading) {
    return <CardGridSkeleton count={4} columns={4} />;
  }

  return (
    <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-border">
      <StatusStatCard config={totalConfig} count={total} size="sm" />
      {applicationStatusOrder.slice(0, 3).map((status) => (
        <StatusStatCard key={status} config={applicationStatusConfig[status]} count={statusCounts[status] || 0} size="sm" />
      ))}
      {needsAttention > 0 && <StatusStatCard config={pendingApprovalConfig} count={needsAttention} size="sm" />}
    </div>
  );
}
