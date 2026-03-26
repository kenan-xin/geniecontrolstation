"use client";

import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ScrollArea,
  ScrollBar,
} from "@/components/ui/scroll-area";

export interface SectionItem {
  id: number;
  name: string;
  icon: LucideIcon;
  confirmed?: boolean;
}

interface SectionNavProps {
  sections: SectionItem[];
  activeSection: number;
  onSelect: (id: number) => void;
  className?: string;
  variant?: "sidebar" | "tabs";
}

export function SectionNav({
  sections,
  activeSection,
  onSelect,
  className,
  variant = "sidebar",
}: SectionNavProps) {
  if (variant === "tabs") {
    return (
      <ScrollArea className={cn("w-full whitespace-nowrap", className)}>
        <div className="flex gap-1 pb-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = section.id === activeSection;

            return (
              <Button
                key={section.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onSelect(section.id)}
                className={cn(
                  "gap-2 shrink-0 relative",
                  isActive && "shadow-sm"
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{section.name}</span>
                {section.confirmed && (
                  <span className="absolute -top-1 -right-1 size-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="size-2.5 text-white" />
                  </span>
                )}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }

  return (
    <nav className={cn("space-y-1", className)} aria-label="Section navigation">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = section.id === activeSection;

        return (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
              "hover:bg-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isActive && "bg-accent text-accent-foreground font-medium shadow-sm",
              !isActive && "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-md shrink-0 transition-colors",
                isActive ? "bg-primary/10 text-primary" : "bg-muted/50"
              )}
            >
              <Icon className="size-4" />
            </div>
            <span className="flex-1 text-sm">{section.name}</span>
            {section.confirmed && (
              <span className="size-5 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <Check className="size-3 text-emerald-500" />
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
