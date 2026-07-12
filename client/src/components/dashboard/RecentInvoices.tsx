import { AnimatePresence, motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Invoice = {
  _id: string;
  vendor: string;
  amount: number;
  invoiceNumber: string;
};

type RecentInvoicesProps = {
  invoices: Invoice[];
  loading: boolean;
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

function RecentInvoices({ invoices, loading: loadingInvoices }: RecentInvoicesProps) {

    const navigate = useNavigate();

    return (
        <motion.div
            className="relative overflow-hidden bg-surface-glass backdrop-blur border border-border rounded-2xl shadow-glass p-6 transition-all duration-300"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-bold text-content">Recent Invoices</h2>
                <p className="text-content-muted text-sm mt-1">Latest extracted totals</p>
              </div>
              <button
                className="
                text-content-muted hover:text-content transition-all duration-300 px-3 py-2 rounded-xl
                hover:bg-surface-elevated
                "
                onClick={(() => navigate("/invoices"))}
              >
                View All
              </button>
            </div>

            <AnimatePresence mode="wait">
              {loadingInvoices && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-xl border border-border bg-surface-elevated p-4">
                      <div className="h-3 w-48 bg-border rounded animate-pulse" />
                      <div className="mt-3 h-3 w-28 bg-border rounded animate-pulse" />
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
                  <div className="mx-auto h-12 w-12 rounded-2xl bg-surface-elevated flex items-center justify-center">
                    <span className="text-2xl"><FileText className="w-8 h-8 text-content-muted"/></span>
                  </div>
                  <p className="mt-4 font-semibold text-content">No invoices yet</p>
                  <p className="text-content-muted text-sm mt-1">Upload your first invoice to see extracted totals.</p>
                </motion.div>
              )}

              {!loadingInvoices && invoices.length > 0 && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                    <div
                    className="
                    absolute top-0
                    left-0 right-0 h-1 bg-gradient-to-r from-brand-start
                    via-brand-mid
                    to-brand-end
                    "/>
                  {invoices.slice(0, 4).map((invoice, idx) => (

                    <motion.div
                      key={invoice._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay:idx*0.05,
                        type:"spring",
                        stiffness:250,
                        damping:18
                      }}
                      className="
                        relative overflow-hidden flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface-elevated p-4 transition-all duration-300"
                      whileHover={{ y:-4, scale:1.01 }}
                      whileTap={{ scale:0.98 }}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-content truncate">{invoice.invoiceNumber || "—"}</p>
                        <p className="text-content-muted text-sm truncate">{invoice.vendor || "Unknown vendor"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-content-muted text-xs">Amount</p>
                        <p className="font-extrabold text-brand-start font-black">{formatINR(invoice.amount)}</p>
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