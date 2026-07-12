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
    <div className="mt-6 flex items-center justify-between gap-3">
      <div className="text-sm text-slate-600">
        Page <span className="font-semibold">{page}</span> of{" "}
        <span className="font-semibold">{pageCount}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
          onClick={() => setPage(1)}
          disabled={page === 1}
        >
          First
        </button>

        <button
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        <button
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={page === pageCount}
        >
          Next
        </button>

        <button
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
          onClick={() => setPage(pageCount)}
          disabled={page === pageCount}
        >
          Last
        </button>
      </div>
    </div>
  );
}