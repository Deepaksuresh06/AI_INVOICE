import { motion } from "framer-motion";
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

export default function InvoiceCardList({
  invoices,
  onView,
  onDelete,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {invoices.map((invoice) => (
        <motion.div
          key={invoice._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white/80 border border-slate-100 rounded-3xl p-4 hover:shadow-sm transition"
        >
          {/* Top */}

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-slate-500">
                Invoice
              </p>

              <p className="font-bold text-slate-900 truncate">
                {invoice.invoice_number ?? "—"}
              </p>

              <p className="text-sm text-slate-500 truncate mt-1">
                {invoice.supplier ??
                  "Unknown supplier"}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                {formatDate(invoice.date)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">
                Total
              </p>

              <p className="font-extrabold text-emerald-600">
                {formatMoney(
                  invoice.total,
                  invoice.currency
                )}
              </p>
            </div>
          </div>

          {/* Tags */}

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs font-semibold px-2 py-1 rounded-xl bg-slate-100 text-slate-700">
              Buyer: {invoice.buyer ?? "—"}
            </span>

            <span className="text-xs font-semibold px-2 py-1 rounded-xl bg-slate-100 text-slate-700">
              Items: {invoice.items?.length ?? 0}
            </span>
          </div>

          {/* Actions */}

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onView(invoice)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition"
            >
              View Details
            </button>

            <button
              onClick={() => onDelete(invoice._id)}
              className="px-3 py-2 rounded-xl bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 transition"
            >
              Delete
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}