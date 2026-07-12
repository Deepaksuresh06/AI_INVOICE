import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "../../api/axios";

type Invoice = {
  _id: string;
  vendor: string;
  amount: number;
  invoiceNumber: string;
};

function formatINR(amount: number) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `₹ ${amount}`;
  }
}

function RecentInvoices() {
    
    const [loadingInvoices, setLoadingInvoices] = useState(false);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    const fetchInvoices = async () => {
        setLoadingInvoices(true);
        try {
        const response = await api.get("/invoices");
        const backendInvoices = response.data.data;
        const mappedInvoices: Invoice[] = (backendInvoices ?? []).map((inv: any) => ({
            _id: inv._id,
            vendor: inv.supplier ?? "",
            amount: inv.total ?? 0,
            invoiceNumber: inv.invoice_number ?? "",
        }));
        setInvoices(mappedInvoices);
        } catch (error) {
        alert("Error in fetching invoices. Check console for details.");
        console.error("Error fetching invoices:", error);
        } finally {
        setLoadingInvoices(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    return (
        <motion.div
            className="bg-white/80 backdrop-blur border border-white/70 rounded-2xl shadow-sm p-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recent Invoices</h2>
                <p className="text-slate-500 text-sm mt-1">Latest extracted totals</p>
              </div>
              <button
                className="text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-xl hover:bg-slate-100"
                onClick={() => (window.location.href = "/invoices")}
              >
                View All
              </button>
            </div>

            <AnimatePresence mode="wait">
              {loadingInvoices && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="h-3 w-48 bg-slate-200/70 rounded animate-pulse" />
                      <div className="mt-3 h-3 w-28 bg-slate-200/50 rounded animate-pulse" />
                    </div>
                  ))}
                </motion.div>
              )}

              {!loadingInvoices && invoices.length === 0 && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="py-10 text-center"
                >
                  <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <span className="text-2xl">🧾</span>
                  </div>
                  <p className="mt-4 font-semibold text-slate-800">No invoices yet</p>
                  <p className="text-slate-500 text-sm mt-1">Upload your first invoice to see extracted totals.</p>
                </motion.div>
              )}

              {!loadingInvoices && invoices.length > 0 && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {invoices.slice(0, 4).map((invoice, idx) => (

                    <motion.div
                      key={invoice._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 hover:shadow-sm hover:bg-slate-50 transition"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{invoice.invoiceNumber || "—"}</p>
                        <p className="text-slate-500 text-sm truncate">{invoice.vendor || "Unknown vendor"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 text-xs">Amount</p>
                        <p className="font-extrabold text-emerald-600">{formatINR(invoice.amount)}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
    );
}

export default RecentInvoices;