import { FileSearch, RotateCcw } from "lucide-react";

type Props = {
  hasActiveFilters: boolean;
  clearFilters: () => void;
};

export default function InvoiceEmptyState({
  hasActiveFilters,
  clearFilters,
}: Props) {
  return (

    <div className="py-14 sm:py-20 text-center">
      <div className="mx-auto mt-3 h-px w-20 bg-gradient-to-r from-transparent via-brand-start/40 to-transparent" />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-start/10 border border-brand-start/20">
        <span className="text-2xl"><FileSearch className="h-8 w-8 text-brand-start" /></span>
      </div>

      <p className="mt-5 text-xl font-bold text-content">
        No invoices found
      </p>

      <p className="mt-2 text-sm leading-6 text-content-muted">
        {hasActiveFilters
          ? "Try adjusting search/filter criteria."
          : "Create invoices or adjust your filters to see results."}
      </p>

      {hasActiveFilters && (
        <div className="mt-6">
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-start to-brand-end px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <>
                <RotateCcw className="w-4 h-4" />
                Clear Filters
                </>
          </button>
        </div>
      )}
    </div>
  );
}