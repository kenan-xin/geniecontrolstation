/**
 * CSV Export Utility
 * Converts array of objects to CSV and triggers browser download
 */

export interface ExportColumn<T> {
  key: keyof T | string;
  header: string;
  format?: (value: unknown, item: T) => string | number;
}

/**
 * Escapes and quotes a CSV field value if needed
 * - Fields with commas, quotes, or newlines must be quoted
 * - Quotes within fields are escaped by doubling them
 */
function escapeCSVField(value: string): string {
  if (value === null || value === undefined) {
    return "";
  }

  const str = String(value);

  // Check if quoting is needed
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    // Escape quotes by doubling them and wrap in quotes
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Converts array of objects to CSV string
 */
function toCSV<T>(data: T[], columns: ExportColumn<T>[]): string {
  if (data.length === 0) {
    return "";
  }

  // Build header row
  const headerRow = columns.map((col) => escapeCSVField(col.header)).join(",");

  // Build data rows
  const dataRows = data.map((item) => {
    return columns
      .map((col) => {
        const value = col.format
          ? col.format((item as Record<string, unknown>)[col.key as string], item)
          : (item as Record<string, unknown>)[col.key as string];
        return escapeCSVField(value == null ? "" : String(value));
      })
      .join(",");
  });

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Triggers browser download of CSV file
 */
function downloadCSV(csvContent: string, filename: string): void {
  // Add BOM for Excel UTF-8 compatibility
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports data to CSV file and triggers browser download
 *
 * @param data - Array of objects to export
 * @param filename - Name of the downloaded file (e.g., "export.csv")
 * @param columns - Column definitions with key and header, optional format function
 *
 * @example
 * exportToCSV(articles, "articles.csv", [
 *   { key: "id", header: "ID" },
 *   { key: "title", header: "Title" },
 *   { key: "submissionDate", header: "Date" },
 *   { key: "status", header: "Status" },
 * ]);
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns: ExportColumn<T>[]
): void {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const csvContent = toCSV(data, columns);
  downloadCSV(csvContent, filename);
}

/**
 * Generates a timestamped filename for exports
 * @param baseName - Base name without extension (e.g., "news_leads")
 * @returns Filename with date suffix (e.g., "news_leads_2026-03-24.csv")
 */
export function generateExportFilename(baseName: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `${baseName}_${date}.csv`;
}
