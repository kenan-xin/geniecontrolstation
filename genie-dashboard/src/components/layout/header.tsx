"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSidebarStore } from "@/store/sidebar-store";

function PathBreadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const segments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/" />}>
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;
          const label = segment
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <span key={href} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={href} />}>
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function Header() {
  const { setMobileOpen } = useSidebarStore();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-4 lg:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden text-muted-foreground"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      {/* Breadcrumbs */}
      <div className="flex-1 min-w-0">
        <PathBreadcrumbs />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="h-8 w-44 pl-8 text-xs bg-muted/50 border-transparent focus-visible:border-border focus-visible:bg-background"
          />
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute top-1 right-1 size-1.5 rounded-full bg-brand" />
        </Button>

        <Avatar size="sm">
          <AvatarFallback className="bg-brand/15 text-brand text-[10px] font-semibold">
            GC
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
