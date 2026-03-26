import { FileText, UserSearch, Clock, CheckCircle2, type LucideIcon } from 'lucide-react';

export type ApplicationStatus = 'Document Assessment' | 'Candidate Screening' | 'Pending Approval' | 'Approved';

export interface AppStatusConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  cardBg: string;
}

export const applicationStatusConfig: Record<ApplicationStatus, AppStatusConfig> = {
  'Document Assessment': {
    label: 'Document Assessment',
    icon: FileText,
    color: 'text-status-neutral',
    bg: 'bg-status-neutral-muted',
    cardBg: 'bg-status-neutral-muted/50 dark:bg-status-neutral-muted/30'
  },
  'Candidate Screening': {
    label: 'Candidate Screening',
    icon: UserSearch,
    color: 'text-status-info',
    bg: 'bg-status-info-muted',
    cardBg: 'bg-status-info-muted/50 dark:bg-status-info-muted/30'
  },
  'Pending Approval': {
    label: 'Pending Approval',
    icon: Clock,
    color: 'text-status-warning',
    bg: 'bg-status-warning-muted',
    cardBg: 'bg-status-warning-muted/50 dark:bg-status-warning-muted/30'
  },
  Approved: {
    label: 'Approved',
    icon: CheckCircle2,
    color: 'text-status-success',
    bg: 'bg-status-success-muted',
    cardBg: 'bg-status-success-muted/50 dark:bg-status-success-muted/30'
  }
} as const;

export const applicationStatusOrder: ApplicationStatus[] = ['Document Assessment', 'Candidate Screening', 'Pending Approval', 'Approved'];

export function getApplicationStatusPath(status: string): string {
  switch (status) {
    case 'Document Assessment':
      return 'document-assessment';
    case 'Candidate Screening':
      return 'candidate-screening';
    case 'Pending Approval':
      return 'pending-approval';
    case 'Approved':
      return 'approved';
    default:
      return 'document-assessment';
  }
}

export function getApplicationRoute(status: string, id: string | number): string {
  const statusPath = getApplicationStatusPath(status);
  return `/applications/${statusPath}/${id}`;
}
