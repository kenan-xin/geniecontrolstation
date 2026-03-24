"use client";

import { Clock } from "lucide-react";
import type { Application } from "@/types";

interface TimelineSectionProps {
  application: Application;
}

export function TimelineSection({ application }: TimelineSectionProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-base font-semibold mb-4">Application Timeline</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-muted/50 shrink-0">
            <Clock className="size-4 text-muted-foreground" />
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="text-sm">{application.createdAt || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-muted/50 shrink-0">
            <Clock className="size-4 text-muted-foreground" />
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="text-sm">{application.updatedAt || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 shrink-0">
            <Clock className="size-4 text-emerald-600" />
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-sm text-muted-foreground">Current Status</p>
            <p className="text-sm font-medium">{application.currentStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
