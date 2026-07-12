import { useEffect, useMemo, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import InvoiceEditorModal from "../components/InvoiceEditorModal";


type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};

type Invoice = {
  _id: string;
  invoice_number: string | null;
  date: string | null;
  supplier: string | null;
  buyer: string | null;
  items: InvoiceItem[];
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  currency: "INR" | "USD" | "EUR" | "GBP" | null;
  createdAt?: string;
};

type SortKey = "createdAt" | "total" | "date" | "supplier" | "buyer";

type SortState = {
  key: SortKey;
  dir: "asc" | "desc";
};

function formatMoney(value: number | null | undefined, currency: string | null | undefined) {
  const amount = typeof value === "number" && Number.isFinite(value) ? value : 0;
  const cur = currency ?? "INR";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${cur} ${amount}`;
  }
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  // Expecting yyyy-mm-dd
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString();
  } catch {
    return value;
  }
}

function downloadText(filename: string, text: string, mime = "application/json") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function toCSV(rows: Record<string, any>[]) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    const s = v === null || v === undefined ? "" : String(v);
    if (/[\n\r,\"]/g.test(s)) return `"${s.replaceAll('"', '""')}"`;
    return s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => escape(r[h])).join(","));
  }
  return lines.join("\n");
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // search/filter
  const [query, setQuery] = useState("");
  const [supplier, setSupplier] = useState<string>("all");
  const [currency, setCurrency] = useState<string>("all");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // sorting
  const [sort, setSort] = useState<SortState>({ key: "createdAt", dir: "desc" });

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/invoices");
      const backendInvoices = res.data?.data ?? [];

      // Map backend fields to our UI model
      const mapped: Invoice[] = (backendInvoices ?? []).map((inv: any) => ({
        _id: inv._id,
        invoice_number: inv.invoice_number ?? null,
        date: inv.date ?? null,
        supplier: inv.supplier ?? null,
        buyer: inv.buyer ?? null,
        items: inv.items ?? [],
        subtotal: inv.subtotal ?? null,
        tax: inv.tax ?? null,
        total: inv.total ?? null,
        currency: inv.currency ?? null,
        createdAt: inv.createdAt,
      }));

      setInvoices(mapped);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const suppliers = useMemo(() => {
    const s = new Set<string>();
    for (const inv of invoices) if (inv.supplier) s.add(inv.supplier);
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [invoices]);

  const currencies = useMemo(() => {
    const c = new Set<string>();
    for (const inv of invoices) if (inv.currency) c.add(inv.currency);
    return Array.from(c).sort((a, b) => a.localeCompare(b));
  }, [invoices]);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();

    let rows = invoices.filter((inv) => {
      if (supplier !== "all" && inv.supplier !== supplier) return false;
      if (currency !== "all" && inv.currency !== currency) return false;

      if (!q) return true;
      const haystack = [
        inv.invoice_number,
        inv.supplier,
        inv.buyer,
        inv.date,
        inv.currency,
        inv.items?.map((it) => it.name).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });

    const dir = sort.dir === "asc" ? 1 : -1;
    rows = rows.sort((a, b) => {
      const valA: any = (() => {
        switch (sort.key) {
          case "createdAt":
            return a.createdAt ? new Date(a.createdAt).getTime() : 0;
          case "total":
            return a.total ?? 0;
          case "date":
            return a.date ? new Date(a.date).getTime() : 0;
          case "supplier":
            return a.supplier ?? "";
          case "buyer":
            return a.buyer ?? "";
          default:
            return 0;
        }
      })();

      const valB: any = (() => {
        switch (sort.key) {
          case "createdAt":
            return b.createdAt ? new Date(b.createdAt).getTime() : 0;
          case "total":
            return b.total ?? 0;
          case "date":
            return b.date ? new Date(b.date).getTime() : 0;
          case "supplier":
            return b.supplier ?? "";
          case "buyer":
            return b.buyer ?? "";
          default:
            return 0;
        }
      })();

      if (typeof valA === "number" && typeof valB === "number") return (valA - valB) * dir;
      return String(valA).localeCompare(String(valB)) * dir;
    });

    return rows;
  }, [currency, invoices, page, query, sort.dir, sort.key, supplier]);

  const pageCount = Math.max(1, Math.ceil(filteredSorted.length / pageSize));

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, page]);

  useEffect(() => {
    // If filters change and current page is out of range, go to last page
    setPage((p) => Math.min(p, pageCount));
  }, [pageCount, query, supplier, currency]);

  // views
  const [view, setView] = useState<"card" | "table">("card");

  // details modal
  const [details, setDetails] = useState<Invoice | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this invoice?")) return;
    try {
      await api.delete(`/invoices/${id}`);
      await loadInvoices();
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Delete failed");
    }
  };

  const exportJSON = () => {
    const rows = filteredSorted;
    downloadText(
      `invoices_${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          count: rows.length,
          data: rows,
        },
        null,
        2
      )
    );
  };

  const exportCSV = () => {
    const rows = filteredSorted.map((inv) => ({
      _id: inv._id,
      invoice_number: inv.invoice_number,
      date: inv.date,
      supplier: inv.supplier,
      buyer: inv.buyer,
      subtotal: inv.subtotal,
      tax: inv.tax,
      total: inv.total,
      currency: inv.currency,
      items_count: inv.items?.length ?? 0,
      createdAt: inv.createdAt,
    }));
    const csv = toCSV(rows);
    downloadText(`invoices_${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv");
  };

  const hasActiveFilters = query.trim().length > 0 || supplier !== "all" || currency !== "all";

  const emptyState = (
    <div className="py-12 sm:py-16 text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 flex items-center justify-center">
        <span className="text-2xl">🧾</span>
      </div>

      <p className="mt-4 font-bold text-slate-900 dark:text-slate-100">No invoices found</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        {hasActiveFilters ? "Try adjusting search/filter criteria." : "Create invoices or adjust your filters to see results."}
      </p>

      {hasActiveFilters && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSupplier("all");
              setCurrency("all");
              setSort({ key: "createdAt", dir: "desc" });
              setPage(1);
            }}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );


  const skeleton = (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-20 rounded-2xl border border-slate-100 bg-white/50 p-4">
          <div className="h-3 w-56 bg-slate-200/70 rounded animate-pulse" />
          <div className="mt-3 h-3 w-64 bg-slate-200/50 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Invoices</h1>
              <p className="text-slate-500 mt-2">Search, sort, filter, export, delete, and view details.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className={`px-3 py-2 rounded-xl text-sm font-semibold border transition ${
                  view === "card" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => setView("card")}
              >
                Cards
              </button>
              <button
                className={`px-3 py-2 rounded-xl text-sm font-semibold border transition ${
                  view === "table" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => setView("table")}
              >
                Table
              </button>
            </div>
          </div>
        </motion.div>

        {/* controls */}
        <div className="bg-white/70 backdrop-blur border border-white/80 rounded-3xl shadow-sm p-4 sm:p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5">
              <label className="text-xs font-semibold text-slate-600">Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Invoice #, supplier, buyer, item..."
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-300"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-semibold text-slate-600">Supplier</label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-300"
              >
                <option value="all">All</option>
                {suppliers.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-semibold text-slate-600">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-300"
              >
                <option value="all">All</option>
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1 flex items-end">
              <div className="w-full">
                <label className="text-xs font-semibold text-slate-600">Sort</label>
                <select
                  value={`${sort.key}:${sort.dir}`}
                  onChange={(e) => {
                    const [key, dir] = e.target.value.split(":") as [SortKey, "asc" | "desc"];
                    setSort({ key, dir });
                  }}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-300"
                >
                  <option value="createdAt:desc">Newest</option>
                  <option value="createdAt:asc">Oldest</option>
                  <option value="total:desc">Total (high → low)</option>
                  <option value="total:asc">Total (low → high)</option>
                  <option value="date:desc">Date (new → old)</option>
                  <option value="date:asc">Date (old → new)</option>
                  <option value="supplier:asc">Supplier (A→Z)</option>
                  <option value="supplier:desc">Supplier (Z→A)</option>
                  <option value="buyer:asc">Buyer (A→Z)</option>
                  <option value="buyer:desc">Buyer (Z→A)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-slate-600">
              Showing <span className="font-semibold">{paged.length}</span> of{" "}
              <span className="font-semibold">{filteredSorted.length}</span> invoices
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

        {/* list */}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-800">Failed</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        )}

        {loading ? (
          skeleton
        ) : filteredSorted.length === 0 ? (
          emptyState
        ) : (
          <>
            {view === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paged.map((inv) => (
                  <motion.div
                    key={inv._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 border border-slate-100 rounded-3xl p-4 hover:shadow-sm transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-slate-500">Invoice</p>
                        <p className="font-bold text-slate-900 truncate">
                          {inv.invoice_number ?? "—"}
                        </p>
                        <p className="text-sm text-slate-500 truncate mt-1">{inv.supplier ?? "Unknown supplier"}</p>
                        <p className="text-xs text-slate-400 mt-1">{formatDate(inv.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Total</p>
                        <p className="font-extrabold text-emerald-600">
                          {formatMoney(inv.total, inv.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-xs font-semibold px-2 py-1 rounded-xl bg-slate-100 text-slate-700">
                        Buyer: {inv.buyer ?? "—"}
                      </span>
                      <span className="text-xs font-semibold px-2 py-1 rounded-xl bg-slate-100 text-slate-700">
                        Items: {inv.items?.length ?? 0}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800"
                        onClick={() => setDetails(inv)}
                      >
                        View Details
                      </button>
                      <button
                        className="px-3 py-2 rounded-xl bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100"
                        onClick={() => void handleDelete(inv._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white/70 backdrop-blur border border-white/80 rounded-3xl shadow-sm overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-0 px-6 py-3 bg-slate-50 text-xs font-semibold text-slate-600">
                  <div className="col-span-3">Invoice</div>
                  <div className="col-span-3">Supplier</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Buyer</div>
                  <div className="col-span-1">Total</div>
                  <div className="col-span-1">Actions</div>
                </div>

                <div className="divide-y divide-slate-100">
                  {paged.map((inv) => (
                    <div key={inv._id} className="grid grid-cols-12 gap-0 px-4 sm:px-6 py-4 items-center">
                      <div className="col-span-6 sm:col-span-3 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{inv.invoice_number ?? "—"}</p>
                        <p className="text-xs text-slate-500 truncate mt-1 sm:hidden">{inv.supplier ?? "—"}</p>
                      </div>
                      <div className="hidden sm:block col-span-3 min-w-0">
                        <p className="text-sm text-slate-700 truncate">{inv.supplier ?? "—"}</p>
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <p className="text-sm text-slate-600">{formatDate(inv.date)}</p>
                      </div>
                      <div className="hidden sm:block col-span-2">
                        <p className="text-sm text-slate-600 truncate">{inv.buyer ?? "—"}</p>
                      </div>
                      <div className="col-span-3 sm:col-span-1">
                        <p className="text-sm font-extrabold text-emerald-600 text-right sm:text-left">
                          {formatMoney(inv.total, inv.currency)}
                        </p>
                      </div>
                      <div className="col-span-6 sm:col-span-1 flex gap-2 justify-end">
                        <button
                          className="px-2.5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
                          onClick={() => setDetails(inv)}
                        >
                          View
                        </button>
                        <button
                          className="hidden sm:inline-flex px-2.5 py-2 rounded-xl bg-red-50 text-red-700 font-semibold text-xs hover:bg-red-100"
                          onClick={() => void handleDelete(inv._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* pagination */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <div className="text-sm text-slate-600">
                Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{pageCount}</span>
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
          </>
        )}

        {/* Details modal (editable) */}
        <AnimatePresence>
          {details && (
            <InvoiceEditorModal

              details={details}
              onClose={() => setDetails(null)}
              onUpdated={async () => {
                await loadInvoices();
              }}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

