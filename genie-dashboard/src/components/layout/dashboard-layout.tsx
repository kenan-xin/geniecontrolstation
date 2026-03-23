"use client";

import { Sidebar, MobileSidebarContent } from "./sidebar";
import { Header } from "./header";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSidebarStore } from "@/store/sidebar-store";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { mobileOpen, setMobileOpen } = useSidebarStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton={true}
          className="w-[280px] p-0 border-sidebar-border [&>[data-slot=sheet-close]]:text-sidebar-foreground/50"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <MobileSidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <ScrollArea className="flex-1">
          <main className="p-4 lg:p-6">{children}</main>
        </ScrollArea>
      </div>
    </div>
  );
}
