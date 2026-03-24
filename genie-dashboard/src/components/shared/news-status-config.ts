import { AlertTriangle, Clock, CalendarCheck, CheckCircle2, type LucideIcon } from 'lucide-react';

export type NewsStatus = 'Unverified' | 'Approval' | 'Schedule' | 'Published';

export interface StatusConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
}

export const newsStatusConfig: Record<NewsStatus, StatusConfig> = {
  Unverified: {
    label: 'Unverified',
    icon: AlertTriangle,
    color: 'text-status-error',
    bg: 'bg-status-error-muted',
    border: 'border-l-status-error'
  },
  Approval: {
    label: 'Pending Approval',
    icon: Clock,
    color: 'text-status-warning',
    bg: 'bg-status-warning-muted',
    border: 'border-l-status-warning'
  },
  Schedule: {
    label: 'Scheduled',
    icon: CalendarCheck,
    color: 'text-status-info',
    bg: 'bg-status-info-muted',
    border: 'border-l-status-info'
  },
  Published: {
    label: 'Published',
    icon: CheckCircle2,
    color: 'text-status-success',
    bg: 'bg-status-success-muted',
    border: 'border-l-status-success'
  }
} as const;

export const newsStatusOrder: NewsStatus[] = ['Unverified', 'Approval', 'Schedule', 'Published'];

export function getStatusPath(status: string): string {
  switch (status) {
    case 'Approval':
      return 'approval';
    case 'Schedule':
      return 'schedule';
    case 'Published':
      return 'published';
    default:
      return 'unverified';
  }
}
