type Props = {
  hasActiveFilters: boolean;
  clearFilters: () => void;
};

export default function InvoiceEmptyState({
  hasActiveFilters,
  clearFilters,
}: Props) {
  return (
    <div className="py-12 sm:py-16 text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100/70 border border-slate-200/70 flex items-center justify-center">
        <span className="text-2xl">🧾</span>
      </div>

      <p className="mt-4 font-bold text-slate-900">
        No invoices found
      </p>

      <p className="text-sm text-slate-500 mt-1">
        {hasActiveFilters
          ? "Try adjusting search/filter criteria."
          : "Create invoices or adjust your filters to see results."}
      </p>

      {hasActiveFilters && (
        <div className="mt-6">
          <button
            onClick={clearFilters}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800 transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}