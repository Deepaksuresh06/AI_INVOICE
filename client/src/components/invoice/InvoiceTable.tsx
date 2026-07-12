import type { Invoice } from "../../types/invoice";
import {
  formatDate,
  formatMoney,
} from "../../utils/invoiceHelpers";

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
    <div className="bg-white/70 backdrop-blur border border-white/80 rounded-3xl shadow-sm overflow-hidden">

      {/* Table Header */}

      <div className="hidden sm:grid grid-cols-12 gap-0 px-6 py-3 bg-slate-50 text-xs font-semibold text-slate-600">
        <div className="col-span-3">Invoice</div>
        <div className="col-span-3">Supplier</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-2">Buyer</div>
        <div className="col-span-1">Total</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Table Body */}

      <div className="divide-y divide-slate-100">
        {invoices.map((invoice) => (
          <div
            key={invoice._id}
            className="grid grid-cols-12 gap-0 px-4 sm:px-6 py-4 items-center"
          >
            {/* Invoice */}

            <div className="col-span-6 sm:col-span-3 min-w-0">
              <p className="font-semibold text-slate-900 truncate">
                {invoice.invoice_number ?? "—"}
              </p>

              <p className="text-xs text-slate-500 truncate mt-1 sm:hidden">
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
              <p className="text-sm text-slate-600">
                {formatDate(invoice.date)}
              </p>
            </div>

            {/* Buyer */}

            <div className="hidden sm:block col-span-2">
              <p className="text-sm text-slate-600 truncate">
                {invoice.buyer ?? "—"}
              </p>
            </div>

            {/* Total */}

            <div className="col-span-3 sm:col-span-1">
              <p className="text-sm font-extrabold text-emerald-600 text-right sm:text-left">
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
                className="px-2.5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
              >
                View
              </button>

              <button
                onClick={() => onDelete(invoice._id)}
                className="hidden sm:inline-flex px-2.5 py-2 rounded-xl bg-red-50 text-red-700 font-semibold text-xs hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}