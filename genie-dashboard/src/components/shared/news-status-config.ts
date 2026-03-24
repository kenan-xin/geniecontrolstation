import { AlertTriangle, Clock, CalendarCheck, CheckCircle2, type LucideIcon } from 'lucide-react';

export type NewsStatus = 'Unverified' | 'Approval' | 'Schedule' | 'Published';

export interface StatusConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  cardBg: string;
}

export const newsStatusConfig: Record<NewsStatus, StatusConfig> = {
  Unverified: {
    label: 'Unverified',
    icon: AlertTriangle,
    color: 'text-status-error',
    bg: 'bg-status-error-muted',
    cardBg: 'bg-status-error-muted/50 dark:bg-status-error-muted/30'
  },
  Approval: {
    label: 'Pending Approval',
    icon: Clock,
    color: 'text-status-warning',
    bg: 'bg-status-warning-muted',
    cardBg: 'bg-status-warning-muted/50 dark:bg-status-warning-muted/30'
  },
  Schedule: {
    label: 'Scheduled',
    icon: CalendarCheck,
    color: 'text-status-info',
    bg: 'bg-status-info-muted',
    cardBg: 'bg-status-info-muted/50 dark:bg-status-info-muted/30'
  },
  Published: {
    label: 'Published',
    icon: CheckCircle2,
    color: 'text-status-success',
    bg: 'bg-status-success-muted',
    cardBg: 'bg-status-success-muted/50 dark:bg-status-success-muted/30'
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
