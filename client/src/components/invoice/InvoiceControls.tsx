import type { SortKey, SortState } from "../../types/invoice";

type Props = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;

  supplier: string;
  setSupplier: React.Dispatch<React.SetStateAction<string>>;

  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;

  suppliers: string[];
  currencies: string[];

  sort: SortState;
  setSort: React.Dispatch<React.SetStateAction<SortState>>;

  pagedCount: number;
  filteredCount: number;

  exportJSON: () => void;
  exportCSV: () => void;
};

export default function InvoiceControls({ query, setQuery, supplier, setSupplier, currency, setCurrency, suppliers, currencies, sort, setSort, pagedCount, filteredCount, exportJSON, exportCSV }: Props) {
  return (
    <div className="bg-white/70 backdrop-blur border border-white/80 rounded-3xl shadow-sm p-4 sm:p-5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}

        <div className="md:col-span-5">
          <label className="text-xs font-semibold text-slate-600">
            Search
          </label>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Invoice #, supplier, buyer, item..."
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </div>

        {/* Supplier */}

        <div className="md:col-span-3">
          <label className="text-xs font-semibold text-slate-600">
            Supplier
          </label>

          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-300"
          >
            <option value="all">All</option>

            {suppliers.map((supplier) => (
              <option
                key={supplier}
                value={supplier}
              >
                {supplier}
              </option>
            ))}
          </select>
        </div>

        {/* Currency */}

        <div className="md:col-span-3">
          <label className="text-xs font-semibold text-slate-600">
            Currency
          </label>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-300"
          >
            <option value="all">All</option>

            {currencies.map((currency) => (
              <option
                key={currency}
                value={currency}
              >
                {currency}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}

        <div className="md:col-span-1 flex items-end">
          <div className="w-full">
            <label className="text-xs font-semibold text-slate-600">
              Sort
            </label>

            <select
              value={`${sort.key}:${sort.dir}`}
              onChange={(e) => {
                const [key, dir] = e.target.value.split(":") as [
                  SortKey,
                  "asc" | "desc"
                ];

                setSort({
                  key,
                  dir,
                });
              }}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-300"
            >
              <option value="createdAt:desc">Newest</option>
              <option value="createdAt:asc">Oldest</option>

              <option value="total:desc">
                Total (high → low)
              </option>

              <option value="total:asc">
                Total (low → high)
              </option>

              <option value="date:desc">
                Date (new → old)
              </option>

              <option value="date:asc">
                Date (old → new)
              </option>

              <option value="supplier:asc">
                Supplier (A→Z)
              </option>

              <option value="supplier:desc">
                Supplier (Z→A)
              </option>

              <option value="buyer:asc">
                Buyer (A→Z)
              </option>

              <option value="buyer:desc">
                Buyer (Z→A)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Bottom */}

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-slate-600">
          Showing{" "}
          <span className="font-semibold">
            {pagedCount}
          </span>{" "}
          of{" "}
          <span className="font-semibold">
            {filteredCount}
          </span>{" "}
          invoices
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportJSON}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 font-semibold text-sm"
          >
            Export JSON
          </button>

          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 font-semibold text-sm"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}