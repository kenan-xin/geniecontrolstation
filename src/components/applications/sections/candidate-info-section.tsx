"use client";

import { Mail, Phone, Building2, Calendar, Hash } from "lucide-react";
import type { Application } from "@/types";

interface CandidateInfoSectionProps {
  application: Application;
}

export function CandidateInfoSection({ application }: CandidateInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-base font-semibold mb-4">Candidate Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-muted/50 shrink-0">
              <Hash className="size-4 text-muted-foreground" />
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-sm text-muted-foreground">Application ID</p>
              <p className="text-sm font-mono">{application.applicationId || `#${application.id}`}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-muted/50 shrink-0">
              <Building2 className="size-4 text-muted-foreground" />
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-sm text-muted-foreground">Training Provider</p>
              <p className="text-sm">{application.trainingProvider || "—"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-muted/50 shrink-0">
              <Calendar className="size-4 text-muted-foreground" />
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-sm text-muted-foreground">Submission Date</p>
              <p className="text-sm">{application.submissionDate || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-base font-semibold mb-4">Contact Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-muted/50 shrink-0">
              <Mail className="size-4 text-muted-foreground" />
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm truncate">{application.email || "—"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-muted/50 shrink-0">
              <Phone className="size-4 text-muted-foreground" />
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-sm">{application.phone || "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
