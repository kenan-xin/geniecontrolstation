"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { TablePagination } from "./table-pagination";
import { EmptyState } from "./empty-state";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
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
}: PaginatedTableProps<T>) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [selectedIds, setSelectedIds] = React.useState<Set<string | number>>(new Set());

  // Reset page when data or pageSize changes
  React.useEffect(() => {
    setPage(1);
  }, [data.length, pageSize]);

  // Notify parent of selection changes
  React.useEffect(() => {
    onSelectionChange?.(Array.from(selectedIds));
  }, [selectedIds, onSelectionChange]);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

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

  if (data.length === 0) {
    return (
      <div className={className}>
        <EmptyState title={emptyMessage} description={emptyDescription} />
      </div>
    );
  }

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
                  {col.header}
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
        total={data.length}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}
