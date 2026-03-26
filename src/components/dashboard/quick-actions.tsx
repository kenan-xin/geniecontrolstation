'use client';

import Link from 'next/link';
import { Layers, FileSearch, Users } from 'lucide-react';

const actions = [
  {
    label: 'View All Applications',
    href: '/applications',
    icon: Layers
  },
  {
    label: 'Document Assessment',
    href: '/applications/document-assessment',
    icon: FileSearch
  },
  {
    label: 'Candidate Screening',
    href: '/applications/candidate-screening',
    icon: Users
  }
];

export function QuickActions() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 h-8 gap-1 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 justify-start gap-2"
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
