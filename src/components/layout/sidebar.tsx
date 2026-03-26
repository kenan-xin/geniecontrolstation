'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Newspaper, Radio, PanelLeftClose, PanelLeft, LayoutDashboard, FileStack } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';
import { useSidebarStore } from '@/store/sidebar-store';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard
  },
  {
    label: 'News Verification',
    href: '/news-verification',
    icon: Newspaper
  },
  {
    label: 'Community Manager',
    href: '/community-manager',
    icon: Radio
  },
  {
    label: 'Applications',
    href: '/applications',
    icon: FileStack
  }
];

function NavLink({ item, expanded }: { item: (typeof navItems)[number]; expanded: boolean }) {
  const pathname = usePathname();
  const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        expanded ? 'w-full' : 'w-10 justify-center',
        isActive
          ? 'bg-sidebar-primary/15 text-sidebar-primary'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
      )}
    >
      <Icon
        className={cn(
          'shrink-0 transition-colors duration-200',
          expanded ? 'size-[18px]' : 'size-5',
          isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80'
        )}
      />
      {expanded && <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (!expanded) {
    return (
      <Tooltip>
        <TooltipTrigger render={link} />
        <TooltipContent side="right" sideOffset={12}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

export function Sidebar() {
  const { expanded, toggle } = useSidebarStore();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'hidden lg:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out',
          expanded ? 'w-[260px]' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center h-16 shrink-0 px-4', expanded ? 'gap-3' : 'justify-center')}>
          <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
            <span className="text-sm font-bold text-sidebar-primary-foreground tracking-tight">G</span>
          </div>
          {expanded && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-sidebar-foreground tracking-tight truncate">{APP_NAME}</span>
              <span className="text-[10px] text-sidebar-foreground/40 uppercase tracking-[0.15em]">Station</span>
            </div>
          )}
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {expanded && <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-sidebar-foreground/35">Media</p>}
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} expanded={expanded} />
            ))}
          </div>
        </nav>

        <Separator className="bg-sidebar-border" />

        {/* Collapse toggle */}
        <div className={cn('flex items-center h-12 shrink-0 px-3', expanded ? 'justify-end' : 'justify-center')}>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggle}
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {expanded ? <PanelLeftClose className="size-4" /> : <PanelLeft className="size-4" />}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}

export function MobileSidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 shrink-0 px-4">
        <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
          <span className="text-sm font-bold text-sidebar-primary-foreground tracking-tight">G</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">{APP_NAME}</span>
          <span className="text-[10px] text-sidebar-foreground/40 uppercase tracking-[0.15em]">Station</span>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-sidebar-foreground/35">Media</p>
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary/15 text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'size-[18px] shrink-0 transition-colors duration-200',
                    isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80'
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
