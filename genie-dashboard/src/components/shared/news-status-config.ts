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
    color: 'text-red-600',
    bg: 'bg-red-500/10',
    border: 'border-l-red-600'
  },
  Approval: {
    label: 'Pending Approval',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-500/10',
    border: 'border-l-amber-600'
  },
  Schedule: {
    label: 'Scheduled',
    icon: CalendarCheck,
    color: 'text-blue-600',
    bg: 'bg-blue-500/10',
    border: 'border-l-blue-600'
  },
  Published: {
    label: 'Published',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
    border: 'border-l-emerald-600'
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
