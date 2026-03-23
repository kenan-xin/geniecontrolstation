"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { WorkflowStepper } from "./workflow-stepper";
import { SectionNav, type SectionItem } from "./section-nav";

interface DetailLayoutProps {
  title: string;
  activeStep: number;
  sections: SectionItem[];
  activeSection: number;
  onSectionChange: (id: number) => void;
  actionButtons?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DetailLayout({
  title,
  activeStep,
  sections,
  activeSection,
  onSectionChange,
  actionButtons,
  children,
  className,
}: DetailLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/news-verification"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline text-sm font-medium">
                Back to News Verification
              </span>
              <span className="sm:hidden text-sm font-medium">Back</span>
            </Link>
            <div className="h-5 w-px bg-border hidden sm:block" />
            <h1 className="text-sm sm:text-base font-semibold text-foreground truncate">
              {title}
            </h1>
          </div>
          {actionButtons && (
            <div className="flex items-center gap-2 shrink-0">{actionButtons}</div>
          )}
        </div>

        {/* Workflow stepper */}
        <div className="px-4 sm:px-6 py-4 border-t bg-muted/20">
          <WorkflowStepper activeStep={activeStep} />
        </div>
      </header>

      {/* Mobile: Horizontal tabs */}
      <div className="lg:hidden border-b px-4 py-2 bg-background sticky top-[117px] z-20">
        <SectionNav
          sections={sections}
          activeSection={activeSection}
          onSelect={onSectionChange}
          variant="tabs"
        />
      </div>

      {/* Main content */}
      <div className="flex">
        {/* Desktop: Sidebar nav */}
        <aside className="hidden lg:block w-72 shrink-0 border-r bg-muted/10">
          <div className="sticky top-[133px] p-4">
            <SectionNav
              sections={sections}
              activeSection={activeSection}
              onSelect={onSectionChange}
              variant="sidebar"
            />
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
