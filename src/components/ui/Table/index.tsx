import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDownIcon } from '@/components/ui/icons';

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  align?: 'left' | 'center' | 'right';
  render: (row: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  width?: number | string;
}

export interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleRow?: (id: string) => void;
  onToggleAll?: (checked: boolean) => void;
  onRowClick?: (row: T) => void;
  pagination?: TablePaginationProps;
  emptyMessage?: ReactNode;
  className?: string;
}

const alignClasses: Record<NonNullable<TableColumn<unknown>['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const getWidthStyle = (width?: number | string) => {
  if (width === undefined) return undefined;
  const value = typeof width === 'number' ? `${width}px` : width;
  return { width: value, minWidth: value, maxWidth: value };
};

const TablePagination = ({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
}: TablePaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between gap-sm border-t border-border px-3 py-2.5 text-xs text-muted">
      <span>
        Showing {start} to {end} of {totalItems} items
      </span>

      <div className="flex items-center gap-md">
        <label className="flex items-center gap-xs">
          Rows Per Page
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
            className="rounded border border-border bg-background px-2 py-1 text-xs text-slate-900"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-xs">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="rounded p-1 text-muted transition-colors hover:bg-surface hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronDownIcon className="h-4 w-4 rotate-90" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="rounded p-1 text-muted transition-colors hover:bg-surface hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronDownIcon className="h-4 w-4 -rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};

function Table<T>({
  columns,
  data,
  getRowKey,
  selectable = false,
  selectedIds,
  onToggleRow,
  onToggleAll,
  onRowClick,
  pagination,
  emptyMessage = 'No results found.',
  className,
}: TableProps<T>) {
  const allSelected = selectable && data.length > 0 && data.every((row) => selectedIds?.has(getRowKey(row)));

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col overflow-hidden rounded-t-[6px] rounded-b-lg border border-border bg-background',
        className,
      )}
    >
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#F8FAFC]">
              {selectable && (
                <th className="sticky top-0 z-10 w-10 bg-[#F8FAFC] px-3 py-2.5 shadow-[inset_0_-1px_0_0_#35383914]">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(event) => onToggleAll?.(event.target.checked)}
                    aria-label="Select all rows"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={getWidthStyle(column.width)}
                  className={cn(
                    'sticky top-0 z-10 whitespace-nowrap bg-[#F8FAFC] px-3 py-2.5 text-sm font-semibold text-[#353839] shadow-[inset_0_-1px_0_0_#35383914]',
                    alignClasses[column.align ?? 'left'],
                    column.headerClassName,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-3 py-10 text-center text-sm text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const rowKey = getRowKey(row);
                const isSelected = selectedIds?.has(rowKey) ?? false;
                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      'border-x-0 border-y border-solid border-[#35383914] first:border-t-0 hover:bg-surface/60',
                      onRowClick && 'cursor-pointer',
                    )}
                  >
                    {selectable && (
                      <td className="px-3 py-3 align-middle" onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleRow?.(rowKey)}
                          aria-label="Select row"
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        style={getWidthStyle(column.width)}
                        className={cn(
                          'px-3 py-3 align-middle',
                          alignClasses[column.align ?? 'left'],
                          column.cellClassName,
                        )}
                      >
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && data.length > 0 && (
        <div className="shrink-0">
          <TablePagination {...pagination} />
        </div>
      )}
    </div>
  );
}

export default Table;
