"use client";

import { Badge } from "@/components/ui/badge";
import {
  applicationStatusConfig,
  type ApplicationStatus,
} from "./application-status-config";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const dotVariants = cva("size-2 rounded-full shrink-0", {
  variants: {
    status: {
      "Document Assessment": "bg-slate-500",
      "Candidate Screening": "bg-blue-500",
      "Pending Approval": "bg-amber-500",
      Approved: "bg-emerald-500",
    },
  },
  defaultVariants: {
    status: "Document Assessment",
  },
});

interface StatusBadgeProps {
  status: ApplicationStatus | string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
}

export function StatusBadge({
  status,
  variant = "outline",
  className,
}: StatusBadgeProps) {
  const config = applicationStatusConfig[status as ApplicationStatus];
  const isValidStatus = status in applicationStatusConfig;

  return (
    <Badge variant={variant} className={cn("gap-1.5", className)}>
      <span
        className={cn(
          "size-2 rounded-full shrink-0",
          isValidStatus
            ? config.bg.replace("/10", "")
            : "bg-muted-foreground"
        )}
      />
      {status}
    </Badge>
  );
}
