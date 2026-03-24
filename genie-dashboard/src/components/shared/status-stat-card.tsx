"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Generic status config interface - works with both news and application configs
interface StatusConfigBase {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  border: string;
  gradient?: string;
}

interface StatusStatCardProps<T extends StatusConfigBase> {
  config: T;
  count: number;
  size?: "sm" | "default";
  showGradient?: boolean;
}

export function StatusStatCard<T extends StatusConfigBase>({
  config,
  count,
  size = "default",
  showGradient = false,
}: StatusStatCardProps<T>) {
  const Icon = config.icon;
  const isSm = size === "sm";

  return (
    <Card
      size={isSm ? "sm" : undefined}
      className={cn(
        "relative overflow-hidden border-l-[3px] transition-shadow duration-200 hover:shadow-md",
        config.border,
        showGradient && config.gradient && `bg-gradient-to-br ${config.gradient}`
      )}
    >
      {showGradient && config.gradient && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br pointer-events-none",
            config.gradient
          )}
        />
      )}
      <CardContent className="relative flex items-center gap-3">
        <div className={cn("shrink-0 rounded-lg", isSm ? "p-2" : "p-2.5", config.bg)}>
          <Icon className={cn(isSm ? "size-4" : "size-4.5", config.color)} />
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              "font-bold tracking-tight leading-none",
              isSm ? "text-2xl" : "text-3xl",
              config.color
            )}
          >
            {count}
          </p>
          <p className={cn("mt-1 text-muted-foreground truncate", isSm ? "text-[11px]" : "text-xs")}>
            {config.label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
