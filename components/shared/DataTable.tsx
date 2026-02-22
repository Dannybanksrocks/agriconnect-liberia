'use client'

import { useState, useMemo, useCallback } from 'react'
import { Search, ChevronUp, ChevronDown, Download } from 'lucide-react'
import type { ColumnDef } from '@/lib/types'
import EmptyState from './EmptyState'
import { Skeleton } from './LoadingSkeleton'

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  getRowKey?: (row: T, index: number) => string | number
  searchable?: boolean
  searchPlaceholder?: string
  paginated?: boolean
  pageSize?: number
  exportable?: boolean
  onRowClick?: (row: T) => void
  emptyMessage?: string
  loading?: boolean
}


export default function DataTable<T extends object>({
  columns,
  data,
  getRowKey = (_row, i) => i,
  searchable = false,
  searchPlaceholder = 'Search...',
  paginated = true,
  pageSize = 20,
  exportable = false,
  onRowClick,
  emptyMessage = 'No data found',
  loading = false,
}: Readonly<DataTableProps<T>>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)

  const filtered = useMemo(() => {
    if (!search) return data
    const q = search.toLowerCase()
    return data.filter((row) =>
      columns.some((col) => {
        const val = row[col.key as keyof T]
        return val != null && String(val).toLowerCase().includes(q)
      })
    )
  }, [data, search, columns])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey as keyof T]
      const bVal = b[sortKey as keyof T]
      if (aVal == null || bVal == null) return 0
      let cmp = 0
      if (aVal < bVal) cmp = -1
      else if (aVal > bVal) cmp = 1
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = paginated ? Math.ceil(sorted.length / currentPageSize) : 1
  const paged = paginated
    ? sorted.slice((page - 1) * currentPageSize, page * currentPageSize)
    : sorted

  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortKey(key)
        setSortDir('asc')
      }
      setPage(1)
    },
    [sortKey]
  )

  const handleExport = useCallback(() => {
    const headers = columns.map((c) => c.header).join(',')
    const rows = sorted.map((row) =>
      columns
        .map((col) => {
          const val = row[col.key as keyof T]
          return `"${String(val ?? '').replaceAll('"', '""')}"`
        })
        .join(',')
    )
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [sorted, columns])

  if (loading) {
    return (
      <div className="space-y-3 rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card">
        {(['sk0', 'sk1', 'sk2', 'sk3', 'sk4'] as const).map((rowKey) => (
          <div key={rowKey} className="flex gap-4">
            {columns.map((col) => (
              <Skeleton key={String(col.key)} className="h-5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-agri-border bg-white dark:border-border dark:bg-card">
      {(searchable || exportable) && (
        <div className="flex flex-wrap items-center gap-3 border-b border-agri-border p-4 dark:border-border">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-agri-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-agri-border bg-agri-bg py-2 pl-9 pr-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border dark:bg-background dark:text-foreground"
              />
            </div>
          )}
          {exportable && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-lg border border-agri-border px-3 py-2 text-sm font-medium text-agri-muted transition-colors hover:border-primary hover:text-primary dark:border-border dark:text-muted-foreground"
              aria-label="Export data as CSV"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-agri-border dark:border-border">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-4 py-3 text-left font-medium text-agri-muted dark:text-muted-foreground ${
                    col.sortable ? 'cursor-pointer select-none hover:text-agri-text dark:hover:text-foreground' : ''
                  } ${col.className ?? ''}`}
                  onClick={col.sortable ? () => handleSort(String(col.key)) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === String(col.key) && (
                      sortDir === 'asc' ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyMessage} />
                </td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <tr
                  key={getRowKey(row, i)}
                  className={`border-b border-agri-border/50 transition-colors dark:border-border/50 ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-agri-hover dark:hover:bg-muted'
                      : ''
                  }`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`px-4 py-3 text-agri-text dark:text-foreground ${col.className ?? ''}`}
                    >
                      {col.render
                        ? col.render(row[col.key as keyof T], row)
                        : String(row[col.key as keyof T] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginated && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-agri-border px-4 py-3 dark:border-border">
          <div className="flex items-center gap-2 text-sm text-agri-muted dark:text-muted-foreground">
            <span>
              Showing {(page - 1) * currentPageSize + 1}–
              {Math.min(page * currentPageSize, sorted.length)} of{' '}
              {sorted.length}
            </span>
            <select
              value={currentPageSize}
              onChange={(e) => {
                setCurrentPageSize(Number(e.target.value))
                setPage(1)
              }}
              className="rounded border border-agri-border bg-white px-2 py-1 text-xs dark:border-border dark:bg-card"
              aria-label="Rows per page"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-agri-hover disabled:opacity-40 dark:hover:bg-muted"
              aria-label="Previous page"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                    page === pageNum
                      ? 'bg-primary text-white'
                      : 'hover:bg-agri-hover dark:hover:bg-muted'
                  }`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={page === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-agri-hover disabled:opacity-40 dark:hover:bg-muted"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
