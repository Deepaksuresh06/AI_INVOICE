import type { Invoice } from "../../types/invoice";
import {
  formatDate,
  formatMoney,
} from "../../utils/invoiceHelpers";
import {
  Eye,
  Trash2,
} from "lucide-react";

type Props = {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
};

export default function InvoiceTable({
  invoices,
  onView,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface-glass backdrop-blur shadow-glass">

      {/* Table Header */}

      <div className="hidden sm:grid grid-cols-12 gap-0 px-6 py-4 bg-surface-elevated border-b border-border text-xs font-semibold uppercase tracking-wider text-content-muted">
        <div className="col-span-3">Invoice</div>
        <div className="col-span-3">Supplier</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-2">Buyer</div>
        <div className="col-span-1">Total</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Table Body */}

      <div className="divide-y divide-border">
        {invoices.map((invoice) => (
          <div
            key={invoice._id}
            className="grid grid-cols-12 gap-0 items-center px-4 sm:px-6 py-5 transition-all duration-200 hover:bg-surface-elevated hover:scale-[1.005]"
          >
            {/* Invoice */}

            <div className="col-span-6 sm:col-span-3 min-w-0">
              <p className="truncate font-semibold text-content">
                {invoice.invoice_number ?? "—"}
              </p>

              <p className="mt-1 truncate text-xs text-content-muted sm:hidden">
                {invoice.supplier ?? "—"}
              </p>
            </div>

            {/* Supplier */}

            <div className="hidden sm:block col-span-3 min-w-0">
              <p className="text-sm text-slate-700 truncate">
                {invoice.supplier ?? "—"}
              </p>
            </div>

            {/* Date */}

            <div className="col-span-3 sm:col-span-2">
              <p className="text-sm text-content-muted">
                {formatDate(invoice.date)}
              </p>
            </div>

            {/* Buyer */}

            <div className="hidden sm:block col-span-2">
              <p className="truncate text-sm text-content-muted">
                {invoice.buyer ?? "—"}
              </p>
            </div>

            {/* Total */}

            <div className="col-span-3 sm:col-span-1">
              <p className="text-right text-sm font-bold text-emerald-600 sm:text-left">
                {formatMoney(
                  invoice.total,
                  invoice.currency
                )}
              </p>
            </div>

            {/* Actions */}

            <div className="col-span-6 sm:col-span-1 flex gap-2 justify-end">
              <button
                onClick={() => onView(invoice)}
                className=" rounded-2xl bg-gradient-to-r from-brand-start to-brand-end px-3 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
              <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDelete(invoice._id)}
                className=" hidden sm:inline-flex items-center rounded-2xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-all duration-200 hover:bg-red-100 hover:-translate-y-0.5"
              >
              <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}