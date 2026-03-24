"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { TablePagination } from "./table-pagination";
import { EmptyState } from "./empty-state";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc";

export interface SortState {
  column: string;
  direction: SortDirection;
}

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  getSortValue?: (item: T) => string | number | Date | null | undefined;
}

export interface PaginatedTableProps<T extends { id: string | number }> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
}

export function PaginatedTable<T extends { id: string | number }>({
  columns,
  data,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 25],
  onRowClick,
  selectable = false,
  onSelectionChange,
  actions,
  emptyMessage = "No data found",
  emptyDescription = "There are no items to display.",
  className,
  sort,
  onSortChange,
}: PaginatedTableProps<T>) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [selectedIds, setSelectedIds] = React.useState<Set<string | number>>(new Set());

  // Sort data if sorting is enabled
  const sortedData = React.useMemo(() => {
    if (!sort) return data;

    const column = columns.find((col) => col.key === sort.column);
    if (!column?.getSortValue) return data;

    return [...data].sort((a, b) => {
      const aVal = column.getSortValue!(a);
      const bVal = column.getSortValue!(b);

      // Handle null/undefined
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sort.direction === "asc" ? 1 : -1;
      if (bVal == null) return sort.direction === "asc" ? -1 : 1;

      let comparison = 0;
      if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime();
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sort, columns]);

  // Reset page when data or pageSize changes
  React.useEffect(() => {
    setPage(1);
  }, [sortedData.length, pageSize]);

  // Notify parent of selection changes
  React.useEffect(() => {
    onSelectionChange?.(Array.from(selectedIds));
  }, [selectedIds, onSelectionChange]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const allSelectedOnPage = React.useMemo(() => {
    if (paginatedData.length === 0) return false;
    return paginatedData.every((item) => selectedIds.has(item.id));
  }, [paginatedData, selectedIds]);

  const someSelectedOnPage = React.useMemo(() => {
    return paginatedData.some((item) => selectedIds.has(item.id));
  }, [paginatedData, selectedIds]);

  const toggleSelectAll = () => {
    if (allSelectedOnPage) {
      // Deselect all on current page
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedData.forEach((item) => next.delete(item.id));
        return next;
      });
    } else {
      // Select all on current page
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedData.forEach((item) => next.add(item.id));
        return next;
      });
    }
  };

  const toggleRow = (id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setSelectedIds(new Set());
  };

  if (sortedData.length === 0) {
    return (
      <div className={className}>
        <EmptyState title={emptyMessage} description={emptyDescription} />
      </div>
    );
  }

  const handleSort = (columnKey: string) => {
    if (!onSortChange) return;

    if (sort?.column === columnKey) {
      // Toggle direction
      onSortChange({
        column: columnKey,
        direction: sort.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // New column, default to asc
      onSortChange({
        column: columnKey,
        direction: "asc",
      });
    }
  };

  const renderSortIcon = (columnKey: string) => {
    if (sort?.column !== columnKey) {
      return <ArrowUpDown className="size-4 ml-1 opacity-40" />;
    }
    return sort.direction === "asc" ? (
      <ArrowUp className="size-4 ml-1" />
    ) : (
      <ArrowDown className="size-4 ml-1" />
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelectedOnPage}
                    indeterminate={someSelectedOnPage && !allSelectedOnPage}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead key={col.key} style={{ width: col.width }}>
                  {col.sortable && onSortChange ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.header}
                      {renderSortIcon(col.key)}
                    </Button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
              {actions && <TableHead className="w-24">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow
                key={item.id}
                className={cn(onRowClick && "cursor-pointer")}
                onClick={() => onRowClick?.(item)}
              >
                {selectable && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={() => toggleRow(item.id)}
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.render(item)}</TableCell>
                ))}
                {actions && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {actions(item)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={page}
        pageSize={pageSize}
        total={sortedData.length}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}
