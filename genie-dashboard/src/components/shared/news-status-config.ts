import {
  AlertTriangle,
  Clock,
  CalendarCheck,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

export type NewsStatus = "Unverified" | "Approval" | "Schedule" | "Published";

export interface StatusConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  gradient?: string;
}

export const newsStatusConfig: Record<NewsStatus, StatusConfig> = {
  Unverified: {
    label: "Unverified",
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-l-red-500",
    gradient: "from-red-500/8 to-transparent",
  },
  Approval: {
    label: "Pending Approval",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-l-amber-500",
    gradient: "from-amber-500/8 to-transparent",
  },
  Schedule: {
    label: "Scheduled",
    icon: CalendarCheck,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-l-blue-500",
    gradient: "from-blue-500/8 to-transparent",
  },
  Published: {
    label: "Published",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-l-emerald-500",
    gradient: "from-emerald-500/8 to-transparent",
  },
} as const;

export const newsStatusOrder: NewsStatus[] = ["Unverified", "Approval", "Schedule", "Published"];

export function getStatusPath(status: string): string {
  switch (status) {
    case "Approval":
      return "approval";
    case "Schedule":
      return "schedule";
    case "Published":
      return "published";
    default:
      return "unverified";
  }
}
