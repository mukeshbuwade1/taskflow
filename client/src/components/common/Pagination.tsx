import { JSX } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  total?: number;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

const LIMIT_OPTIONS = [5, 10, 25, 50];

const Pagination = ({ page, totalPages, onChange, total, limit, onLimitChange }: PaginationProps) => {
  if (totalPages <= 1 && !onLimitChange) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  const from = total != null && limit != null ? (page - 1) * limit + 1 : null;
  const to   = total != null && limit != null ? Math.min(page * limit, total) : null;

  const renderPages = (): JSX.Element[] => {
    const result: JSX.Element[] = [];
    let prev: number | null = null;
    for (const p of visible) {
      if (prev !== null && p - prev > 1) {
        result.push(<span key={`gap-${p}`} className="px-2 text-gray-400 select-none">…</span>);
      }
      result.push(
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
            p === page
              ? 'bg-primary-600 text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {p}
        </button>
      );
      prev = p;
    }
    return result;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-sidebar-border">
      {/* Showing X–Y of Z */}
      <p className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
        {total != null && from != null && to != null ? (
          <>
            Showing{' '}
            <span className="font-medium text-gray-700 dark:text-gray-200">{from}–{to}</span>{' '}
            of{' '}
            <span className="font-medium text-gray-700 dark:text-gray-200">{total}</span>
          </>
        ) : (
          <>
            Page{' '}
            <span className="font-medium text-gray-700 dark:text-gray-200">{page}</span>{' '}
            of{' '}
            <span className="font-medium text-gray-700 dark:text-gray-200">{totalPages}</span>
          </>
        )}
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <HiChevronLeft size={20} />
        </button>
        {renderPages()}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <HiChevronRight size={20} />
        </button>
      </div>

      {/* Items per page */}
      {onLimitChange && limit != null && (
        <div className="flex items-center gap-2 order-3">
          <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">Per page</span>
          <select
            value={limit}
            onChange={(e) => { onLimitChange(Number(e.target.value)); onChange(1); }}
            className="text-sm rounded-lg border border-gray-200 dark:border-sidebar-border bg-white dark:bg-sidebar px-2 py-1 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {LIMIT_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;
