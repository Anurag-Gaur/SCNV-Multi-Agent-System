import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * OFI DataTable — dark themed, sortable headers, row hover, loading skeleton.
 *
 * @param {Array<{key: string, label: string, sortable?: boolean, render?: Function}>} columns
 * @param {Array<Object>} data - row objects keyed by column.key
 * @param {boolean} loading
 * @param {string} [emptyMessage]
 */
export function DataTable({ columns, data, loading = false, emptyMessage = 'No data found.' }) {
  const [sortKey, setSortKey]   = useState(null);
  const [sortDir, setSortDir]   = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  return (
    <div className="w-full overflow-x-auto rounded-ofi-md border border-ofi-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ofi-border bg-ofi-surface-2">
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={cn(
                  'px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ofi-text-muted select-none',
                  col.sortable && 'cursor-pointer hover:text-ofi-gold transition-colors',
                )}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    sortKey === col.key
                      ? sortDir === 'asc'
                        ? <ChevronUp size={12} className="text-ofi-gold" />
                        : <ChevronDown size={12} className="text-ofi-gold" />
                      : <ChevronsUpDown size={12} className="opacity-30" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-ofi-border">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 rounded bg-ofi-surface-2 animate-pulse" style={{ width: `${50 + Math.random() * 40}%` }} />
                  </td>
                ))}
              </tr>
            ))
          ) : sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-ofi-text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr
                key={i}
                className="border-b border-ofi-border last:border-0 hover:bg-ofi-surface-2 transition-colors"
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-ofi-text-sec">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
