import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table';
import type { Company } from '../types';

interface ResultsTableProps {
  data: Company[];
  onDeleteSelected: (ids: string[]) => void;
  onCopyEmails: (emails: string[]) => void;
  isDeleting?: boolean;
}

export default function ResultsTable({
  data,
  onDeleteSelected,
  onCopyEmails,
  isDeleting,
}: ResultsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useMemo<ColumnDef<Company>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
        ),
        size: 40,
      },
      {
        accessorKey: 'name',
        header: 'Company',
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-indigo-100 text-xs font-bold text-brand-700 dark:from-brand-900/50 dark:to-indigo-900/50 dark:text-brand-300">
              {(info.getValue() as string).charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-surface-900 dark:text-white">
              {info.getValue() as string}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => {
          const email = info.getValue() as string;
          return email === 'Not Available' ? (
            <span className="badge-muted italic">Not Available</span>
          ) : (
            <span className="font-medium text-brand-600 dark:text-brand-400">{email}</span>
          );
        },
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: (info) => (
          <span className="text-slate-600 dark:text-slate-400">
            {(info.getValue() as string) || '—'}
          </span>
        ),
      },
      {
        accessorKey: 'website',
        header: 'Website',
        cell: (info) => {
          const url = info.getValue() as string;
          if (!url) return <span className="text-slate-400">—</span>;
          return (
            <a
              href={url.startsWith('http') ? url : `https://${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              <span className="max-w-[120px] truncate">
                {url.replace(/^https?:\/\//, '').slice(0, 28)}
              </span>
              <ExternalIcon />
            </a>
          );
        },
      },
      {
        accessorKey: 'address',
        header: 'Address',
        cell: (info) => (
          <span className="block max-w-[180px] truncate text-slate-600 dark:text-slate-400" title={info.getValue() as string}>
            {(info.getValue() as string) || '—'}
          </span>
        ),
      },
      { accessorKey: 'city', header: 'City' },
      { accessorKey: 'country', header: 'Country' },
      {
        accessorKey: 'googleMapsUrl',
        header: 'Maps',
        cell: (info) => {
          const url = info.getValue() as string;
          if (!url) return '—';
          return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="badge-brand hover:opacity-80">
              View Map
            </a>
          );
        },
      },
      {
        accessorKey: 'googleRating',
        header: 'Rating',
        cell: (info) => {
          const rating = info.getValue() as number | null;
          if (!rating) return <span className="text-slate-400">—</span>;
          return (
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 text-sm font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
              <span>★</span> {rating.toFixed(1)}
            </span>
          );
        },
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: (info) => <span className="badge-brand">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: () => <span className="badge-success">Active</span>,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, rowSelection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map((r) => r.original.id);
  const selectedEmails = selectedRows
    .map((r) => r.original.email)
    .filter((e) => e && e !== 'Not Available');
  const allEmails = data.map((c) => c.email).filter((e) => e && e !== 'Not Available');

  return (
    <div className="card !p-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-surface-200/80 px-6 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="section-title">Lead Results</h2>
          <p className="section-subtitle">
            {data.length} companies
            {table.getFilteredRowModel().rows.length !== data.length &&
              ` · ${table.getFilteredRowModel().rows.length} filtered`}
          </p>
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search results..."
            className="input-field !pl-10 !py-2 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="table-header cursor-pointer select-none whitespace-nowrap px-4 py-3.5 first:pl-6 last:pr-6"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-surface-200/80 dark:divide-slate-800/80">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                      <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p className="font-medium text-slate-600 dark:text-slate-300">No leads yet</p>
                    <p className="text-sm text-slate-400">Run a search to discover travel companies</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-brand-50/30 dark:hover:bg-brand-950/10"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-4 py-3.5 text-sm first:pl-6 last:pr-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 border-t border-surface-200/80 px-6 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="input-field !w-auto !py-1.5 !text-xs"
          >
            {[10, 20, 50].map((s) => (
              <option key={s} value={s}>Show {s}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="btn-secondary !rounded-lg !py-2 !text-xs">
            Previous
          </button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="btn-secondary !rounded-lg !py-2 !text-xs">
            Next
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      {(selectedIds.length > 0 || allEmails.length > 0) && (
        <div className="flex flex-wrap gap-2 border-t border-surface-200/80 bg-slate-50/50 px-6 py-3 dark:border-slate-800 dark:bg-slate-800/30">
          {selectedIds.length > 0 && (
            <>
              <button onClick={() => onCopyEmails(selectedEmails)} disabled={!selectedEmails.length} className="btn-secondary !rounded-lg !py-2 !text-xs">
                Copy Selected ({selectedEmails.length})
              </button>
              <button onClick={() => onDeleteSelected(selectedIds)} disabled={isDeleting} className="btn-danger !rounded-lg !py-2 !text-xs">
                Delete ({selectedIds.length})
              </button>
            </>
          )}
          {allEmails.length > 0 && selectedIds.length === 0 && (
            <button onClick={() => onCopyEmails(allEmails)} className="btn-secondary !rounded-lg !py-2 !text-xs">
              Copy All Emails ({allEmails.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ExternalIcon() {
  return (
    <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}
