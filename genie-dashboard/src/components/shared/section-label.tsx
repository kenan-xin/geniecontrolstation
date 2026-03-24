"use client";

import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <h2
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/60",
        className
      )}
    >
      {children}
    </h2>
  );
}
