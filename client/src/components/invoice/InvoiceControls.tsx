import type { SortKey, SortState } from "../../types/invoice";
import { Search, Filter, ArrowDownUp, Download} from "lucide-react";

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
    <div className=" relative overflow-hidden bg-surface-glass backdrop-blur border border-border rounded-3xl shadow-glass p-5 sm:p-6 mb-8">
        <div
            className=" absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-start via-brand-mid to-brand-end"/>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}

        <div className="md:col-span-5">
          <label className="text-xs font-semibold text-content-muted">
            <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search
            </span>
          </label>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Invoice #, supplier, buyer, item..."
            className=" mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-content outline-none transition-all focus:border-brand-start focus:ring-2 focus:ring-brand-start/20"
          />
        </div>

        {/* Supplier */}

        <div className="md:col-span-3">
          <label className="text-xs font-semibold text-slate-600">
           <span className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Supplier
            </span>
          </label>

          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className=" mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-content outline-none transition-all focus:border-brand-start focus:ring-2 focus:ring-brand-start/20"
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
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Currency
            </span>
          </label>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className=" mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-content outline-none transition-all focus:border-brand-start focus:ring-2 focus:ring-brand-start/20"
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
              <span className="flex items-center gap-2">
                <ArrowDownUp className="w-4 h-4" />
                    Sort
                </span>
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
              className=" mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-content outline-none transition-all focus:border-brand-start focus:ring-2 focus:ring-brand-start/20"
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
        <div className="text-sm text-content-muted">
          Showing{" "}
          <span className="font-bold text-content">
            {pagedCount}
          </span>{" "}
          of{" "}
          <span className="font-bold text-content">
            {filteredCount}
          </span>{" "}
          invoices
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportJSON}
            className=" px-4 py-2.5 rounded-2xl bg-surface-glass border border-border text-content font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-surface-elevated"
          >
            <span className="flex items-center gap-2">
                <Download className="w-4 h-4"/>
                JSON
            </span>
          </button>

          <button
            onClick={exportCSV}
            className=" px-4 py-2.5 rounded-2xl bg-surface-glass border border-border text-content font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-surface-elevated"
          >
            <span className="flex items-center gap-2">
                <Download className="w-4 h-4"/>
                CSV
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}