"use client";

import { User } from "lucide-react";
import type { Application } from "@/types";

interface AssignmentSectionProps {
  application: Application;
}

export function AssignmentSection({ application }: AssignmentSectionProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-base font-semibold mb-4">Assignment</h3>
      <div className="flex items-start gap-3">
        <div className="flex size-8 items-center justify-center rounded-md bg-muted/50 shrink-0">
          <User className="size-4 text-muted-foreground" />
        </div>
        <div className="space-y-1 min-w-0">
          <p className="text-sm text-muted-foreground">Assigned Officer</p>
          <p className="text-sm">{application.assignedTo || "Unassigned"}</p>
        </div>
      </div>

      {application.notes && (
        <div className="pt-4 border-t">
          <div className="flex items-start gap-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-muted/50 shrink-0">
              <User className="size-4 text-muted-foreground" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-sm whitespace-pre-wrap">{application.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
