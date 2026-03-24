import {
  FileText,
  UserSearch,
  Clock,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

export type ApplicationStatus =
  | "Document Assessment"
  | "Candidate Screening"
  | "Pending Approval"
  | "Approved";

export interface AppStatusConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  gradient?: string;
}

export const applicationStatusConfig: Record<ApplicationStatus, AppStatusConfig> = {
  "Document Assessment": {
    label: "Document Assessment",
    icon: FileText,
    color: "text-slate-600",
    bg: "bg-slate-500/10",
    border: "border-l-slate-600",
    gradient: "from-slate-600/5 to-transparent",
  },
  "Candidate Screening": {
    label: "Candidate Screening",
    icon: UserSearch,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    border: "border-l-blue-600",
    gradient: "from-blue-600/5 to-transparent",
  },
  "Pending Approval": {
    label: "Pending Approval",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    border: "border-l-amber-600",
    gradient: "from-amber-600/5 to-transparent",
  },
  Approved: {
    label: "Approved",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    border: "border-l-emerald-600",
    gradient: "from-emerald-600/5 to-transparent",
  },
} as const;

export const applicationStatusOrder: ApplicationStatus[] = [
  "Document Assessment",
  "Candidate Screening",
  "Pending Approval",
  "Approved",
];

export function getApplicationStatusPath(status: string): string {
  switch (status) {
    case "Document Assessment":
      return "document-assessment";
    case "Candidate Screening":
      return "candidate-screening";
    case "Pending Approval":
      return "pending-approval";
    case "Approved":
      return "approved";
    default:
      return "document-assessment";
  }
}

export function getApplicationRoute(status: string, id: string | number): string {
  const statusPath = getApplicationStatusPath(status);
  return `/applications/${statusPath}/${id}`;
}
