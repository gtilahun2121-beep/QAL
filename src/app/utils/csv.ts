/**
 * CSV Export Utility
 * Generates and downloads a CSV file from tabular data.
 */

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export interface CSVColumn<T> {
  key: keyof T | string;
  label: string;
  value?: (item: T) => unknown;
}

export function toCSV<T>(rows: T[], columns: CSVColumn<T>[]): string {
  const header = columns.map((c) => escapeCell(c.label)).join(',');
  const body = rows.map((row) =>
    columns
      .map((c) => {
        const value = c.value ? c.value(row) : (row as Record<string, unknown>)[c.key as string];
        return escapeCell(value);
      })
      .join(',')
  );
  return [header, ...body].join('\r\n');
}

export function downloadCSV<T>(filename: string, rows: T[], columns: CSVColumn<T>[]): void {
  const csv = toCSV(rows, columns);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const formatDateShort = (iso: string): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
