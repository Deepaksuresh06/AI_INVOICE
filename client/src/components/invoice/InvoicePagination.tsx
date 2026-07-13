import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

type Props = {
  page: number;
  pageCount: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function InvoicePagination({
  page,
  pageCount,
  setPage,
}: Props) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"> 
      <div className="inline-flex items-center gap-2 rounded-xl bg-surface-elevated px-3 py-2 text-sm text-content-muted">
        <span>Page</span>

        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-gradient-to-r from-brand-start to-brand-end px-2 text-white font-bold">
          {page}
        </span>

        <span>of</span>

        <span className="font-semibold text-content">
          {pageCount}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          className=" px-4 py-2.5 rounded-2xl bg-surface-glass border border-border text-content font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          onClick={() => setPage(1)}
          disabled={page === 1}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          className=" px-4 py-2.5 rounded-2xl bg-surface-glass border border-border text-content font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          className=" px-4 py-2.5 rounded-2xl bg-surface-glass border border-border text-content font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={page === pageCount}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          className="px-4 py-2.5 rounded-2xl bg-surface-glass border border-border text-content font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          onClick={() => setPage(pageCount)}
          disabled={page === pageCount}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}