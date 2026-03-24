import { FileText, UserSearch, Clock, CheckCircle2, type LucideIcon } from 'lucide-react';

export type ApplicationStatus = 'Document Assessment' | 'Candidate Screening' | 'Pending Approval' | 'Approved';

export interface AppStatusConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
}

export const applicationStatusConfig: Record<ApplicationStatus, AppStatusConfig> = {
  'Document Assessment': {
    label: 'Document Assessment',
    icon: FileText,
    color: 'text-status-neutral',
    bg: 'bg-status-neutral-muted',
    border: 'border-l-status-neutral'
  },
  'Candidate Screening': {
    label: 'Candidate Screening',
    icon: UserSearch,
    color: 'text-status-info',
    bg: 'bg-status-info-muted',
    border: 'border-l-status-info'
  },
  'Pending Approval': {
    label: 'Pending Approval',
    icon: Clock,
    color: 'text-status-warning',
    bg: 'bg-status-warning-muted',
    border: 'border-l-status-warning'
  },
  Approved: {
    label: 'Approved',
    icon: CheckCircle2,
    color: 'text-status-success',
    bg: 'bg-status-success-muted',
    border: 'border-l-status-success'
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
