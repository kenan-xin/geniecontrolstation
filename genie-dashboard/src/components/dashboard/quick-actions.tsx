"use client";

import Link from "next/link";
import { Layers, FileSearch, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  {
    label: "View All Applications",
    href: "/applications",
    icon: Layers,
  },
  {
    label: "Document Assessment",
    href: "/applications/document-assessment",
    icon: FileSearch,
  },
  {
    label: "Candidate Screening",
    href: "/applications/candidate-screening",
    icon: Users,
  },
];

export function QuickActions() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {actions.map((action) => (
          <Button
            key={action.href}
            variant="outline"
            className="justify-start gap-2"
            asChild
          >
            <Link href={action.href}>
              <action.icon className="h-4 w-4" />
              {action.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
