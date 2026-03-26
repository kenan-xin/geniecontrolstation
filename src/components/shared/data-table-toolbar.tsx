"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterButton {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}

interface DataTableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterButtons?: FilterButton[];
  className?: string;
}

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterButtons,
  className,
}: DataTableToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter Buttons */}
      {filterButtons && filterButtons.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((button, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={button.onClick}
              className={cn(button.active && "bg-muted")}
            >
              {button.icon}
              {button.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
