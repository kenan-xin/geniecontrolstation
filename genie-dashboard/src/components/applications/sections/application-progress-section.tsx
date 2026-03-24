"use client";

import { CheckCircle2 } from "lucide-react";
import type { Application } from "@/types";
import { applicationStatusConfig, applicationStatusOrder } from "@/components/shared/application-status-config";
import { statusToStep } from "@/components/applications/workflow-stepper";
import { cn } from "@/lib/utils";

interface ApplicationProgressSectionProps {
  application: Application;
}

export function ApplicationProgressSection({ application }: ApplicationProgressSectionProps) {
  const currentStep = statusToStep[application.currentStatus] ?? 0;
  const progress = application.overallProgress ?? 0;

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-emerald-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-amber-500";
  };

  const currentConfig = applicationStatusConfig[application.currentStatus as keyof typeof applicationStatusConfig];
  const CurrentIcon = currentConfig?.icon || CheckCircle2;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">Progress</h3>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", getProgressColor(progress))}
            style={{ width: String(Math.min(100, Math.max(0, progress))) + "%" }}
          />
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-3">Current Stage</p>
          <div className="flex items-center gap-2">
            <div className={cn("flex size-8 items-center justify-center rounded-md", currentConfig?.bg)}>
              <CurrentIcon className={cn("size-4", currentConfig?.color)} />
            </div>
            <span className={cn("text-sm font-medium", currentConfig?.color)}>
              {currentConfig?.label || application.currentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-base font-semibold mb-4">Workflow Stages</h3>
        <div className="space-y-3">
          {applicationStatusOrder.map((status, index) => {
            const config = applicationStatusConfig[status];
            const Icon = config.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={status} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full shrink-0",
                    isCompleted && "bg-emerald-500/10 text-emerald-600",
                    isCurrent && "bg-primary/10 text-primary",
                    !isCompleted && !isCurrent && "bg-muted/50 text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent && "text-primary",
                      !isCompleted && !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {config.label}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-muted-foreground">In progress</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
