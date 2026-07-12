import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import api from "../api/axios";
import InvoiceEditorModal from "../components/InvoiceEditorModal";
import InvoiceHeader from "../components/invoice/InvoiceHeader";
import InvoiceControls from "../components/invoice/InvoiceControls";
import InvoiceCardList from "../components/invoice/InvoiceCardList";
import InvoiceTable from "../components/invoice/InvoiceTable";
import InvoicePagination from "../components/invoice/InvoicePagination";
import InvoiceEmptyState from "../components/invoice/InvoiceEmptyState";
import InvoiceSkeleton from "../components/invoice/InvoiceSkeleton";
import useInvoices from "../hooks/useInvoices";

import type { Invoice, SortState } from "../types/invoice";
import { downloadText, toCSV } from "../utils/invoiceHelpers";

export default function Invoices() {
  const {
    invoices,
    loading,
    error,
    loadInvoices,
  } = useInvoices();

  // Search / Filter

  const [query, setQuery] = useState("");

  const [supplier, setSupplier] =
    useState("all");

  const [currency, setCurrency] =
    useState("all");

  // Pagination

  const [page, setPage] = useState(1);

  const pageSize = 8;

  // Sorting

  const [sort, setSort] =
    useState<SortState>({
      key: "createdAt",
      dir: "desc",
    });

  // View

  const [view, setView] = useState<
    "card" | "table"
  >("card");

  // Details Modal

  const [details, setDetails] =
    useState<Invoice | null>(null);

  // Suppliers

  const suppliers = useMemo(() => {
    const set = new Set<string>();

    invoices.forEach((invoice) => {
      if (invoice.supplier)
        set.add(invoice.supplier);
    });

    return [...set].sort();
  }, [invoices]);

  // Currency

  const currencies = useMemo(() => {
    const set = new Set<string>();

    invoices.forEach((invoice) => {
      if (invoice.currency)
        set.add(invoice.currency);
    });

    return [...set].sort();
  }, [invoices]);

  // Search + Filter + Sort

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();

    let rows = invoices.filter((invoice) => {
      if (
        supplier !== "all" &&
        invoice.supplier !== supplier
      )
        return false;

      if (
        currency !== "all" &&
        invoice.currency !== currency
      )
        return false;

      if (!q) return true;

      const haystack = [
        invoice.invoice_number,
        invoice.supplier,
        invoice.buyer,
        invoice.date,
        invoice.currency,
        invoice.items
          ?.map((item) => item.name)
          .join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });

    const dir =
      sort.dir === "asc" ? 1 : -1;

    rows = rows.sort((a, b) => {
      const getValue = (invoice: Invoice) => {
        switch (sort.key) {
          case "createdAt":
            return invoice.createdAt
              ? new Date(
                  invoice.createdAt
                ).getTime()
              : 0;

          case "date":
            return invoice.date
              ? new Date(
                  invoice.date
                ).getTime()
              : 0;

          case "total":
            return invoice.total ?? 0;

          case "supplier":
            return invoice.supplier ?? "";

          case "buyer":
            return invoice.buyer ?? "";

          default:
            return 0;
        }
      };

      const valA = getValue(a);

      const valB = getValue(b);

      if (
        typeof valA === "number" &&
        typeof valB === "number"
      ) {
        return (valA - valB) * dir;
      }

      return (
        String(valA).localeCompare(
          String(valB)
        ) * dir
      );
    });

    return rows;
  }, [
    invoices,
    query,
    supplier,
    currency,
    sort,
  ]);

  // Pagination

  const pageCount = Math.max(
    1,
    Math.ceil(
      filteredSorted.length / pageSize
    )
  );

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredSorted.slice(
      start,
      start + pageSize
    );
  }, [filteredSorted, page]);

  useEffect(() => {
    setPage((prev) =>
      Math.min(prev, pageCount)
    );
  }, [
    pageCount,
    query,
    supplier,
    currency,
  ]);

  // Delete

  const handleDelete = async (
    id: string
  ) => {
    if (
      !confirm("Delete this invoice?")
    )
      return;

    try {
      await api.delete(`/invoices/${id}`);

      await loadInvoices();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Delete failed"
      );
    }
  };

  // Export JSON

  const exportJSON = () => {
    downloadText(
      `invoices_${new Date()
        .toISOString()
        .slice(0, 10)}.json`,

      JSON.stringify(
        {
          exportedAt:
            new Date().toISOString(),

          count:
            filteredSorted.length,

          data: filteredSorted,
        },
        null,
        2
      )
    );
  };

  // Export CSV

  const exportCSV = () => {
    const rows = filteredSorted.map(
      (invoice) => ({
        _id: invoice._id,
        invoice_number:
          invoice.invoice_number,
        supplier: invoice.supplier,
        buyer: invoice.buyer,
        date: invoice.date,
        subtotal:
          invoice.subtotal,
        tax: invoice.tax,
        total: invoice.total,
        currency:
          invoice.currency,
        createdAt:
          invoice.createdAt,
        items_count:
          invoice.items.length,
      })
    );

    downloadText(
      `invoices_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`,
      toCSV(rows),
      "text/csv"
    );
  };

  const hasActiveFilters =
    query.trim().length > 0 ||
    supplier !== "all" ||
    currency !== "all";

  const clearFilters = () => {
    setQuery("");
    setSupplier("all");
    setCurrency("all");
    setSort({
      key: "createdAt",
      dir: "desc",
    });
    setPage(1);
  };

  return (
        <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8">

        <InvoiceHeader
          view={view}
          setView={setView}
        />

        <InvoiceControls
          query={query}
          setQuery={setQuery}
          supplier={supplier}
          setSupplier={setSupplier}
          currency={currency}
          setCurrency={setCurrency}
          suppliers={suppliers}
          currencies={currencies}
          sort={sort}
          setSort={setSort}
          pagedCount={paged.length}
          filteredCount={filteredSorted.length}
          exportJSON={exportJSON}
          exportCSV={exportCSV}
        />

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-800">
              Failed
            </p>

            <p className="text-sm text-red-700 mt-1">
              {error}
            </p>
          </div>
        )}

        {loading ? (
          <InvoiceSkeleton />
        ) : filteredSorted.length === 0 ? (
          <InvoiceEmptyState
            hasActiveFilters={hasActiveFilters}
            clearFilters={clearFilters}
          />
        ) : (
          <>
            {view === "card" ? (
              <InvoiceCardList
                invoices={paged}
                onView={setDetails}
                onDelete={(id) =>
                  void handleDelete(id)
                }
              />
            ) : (
              <InvoiceTable
                invoices={paged}
                onView={setDetails}
                onDelete={(id) =>
                  void handleDelete(id)
                }
              />
            )}

            <InvoicePagination
              page={page}
              pageCount={pageCount}
              setPage={setPage}
            />
          </>
        )}

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