import { motion } from "framer-motion";
import CountUp from "react-countup";

type InvoiceStats = {
  totalInvoices: number;
  totalAmount: number;
  averageAmount: number;
  vendors: number;
};
type DashboardStatsProps = {
    loadingStats: boolean;
    invoiceStats: InvoiceStats | null;
};

function formatINR(amount: number) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  } 
  catch {
    return `₹ ${amount}`;
  }
}

function DashboardStats({ loadingStats, invoiceStats }: DashboardStatsProps) {

    const statsSkeleton = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
            { label: "Total Invoices", h: 14 },
            { label: "Total Amount", h: 14 },
            { label: "Average Amount", h: 14 },
            { label: "Vendors", h: 14 },
        ].map((s) => (
            <motion.div
                key={s.label}
                className="bg-surface-glass backdrop-blur border border-border rounded-2xl shadow-glass p-6 transition-all"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                >
                <div className="h-4 w-36 bg-border animate-pulse rounded animate-pulse" />
                <div className="mt-3 h-4 w-24 bg-border animate-pulse rounded animate-pulse" />
                <div className="mt-3 h-14 w-20 rounded bg-border animate-pulse animate-pulse" />
            </motion.div>
        ))}
        </div>
    );


    return (
        <section aria-label="Invoice statistics">
            {loadingStats && !invoiceStats
            ? statsSkeleton
            : invoiceStats && (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {[
                    {
                        label: "Total Invoices",
                        value: invoiceStats.totalInvoices,
                    },
                    {
                        label: "Total Amount",
                        value: formatINR(invoiceStats.totalAmount),
                        accent: "bg-emerald-50 text-emerald-700",
                    },
                    {
                        label: "Average Amount",
                        value: formatINR(invoiceStats.averageAmount),
                        accent: "bg-blue-50 text-blue-700",
                    },
                    {
                        label: "Vendors",
                        value: invoiceStats.vendors,
                        accent: "bg-violet-50 text-violet-700",
                    },
                    ].map((card) => (
                    <motion.div
                        key={card.label}
                        className="relative overflow-hidden bg-surface-glass backdrop-blur border border-border rounded-2xl shadow-glass p-6 transition-all duration-300"
                        whileHover={{ y: -6, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        whileTap={{
                            scale:0.98
                        }}
                    >
                        <div
                            className="absolute top-0 left-0 right-0 h-1
                            bg-gradient-to-r
                            from-brand-start
                            via-brand-mid
                            to-brand-end"
                        />
                        <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-content-muted text-sm font-medium">{card.label}</p>
                            {/* <p className="mt-3 text-3xl
                                sm:text-4xl
                                font-black
                                tracking-tight
                                text-content
                                mt-3 font-black tracking-tight text-content">
                            {typeof card.value === "number" ? (
                                <CountUp
                                    end={card.value}
                                    duration={1.5}
                                />
                            ) : (
                                card.value
                            )}

                            </p> */}

                            <p
                            className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-content"
                            >
                            {typeof card.value === "number"
                                ? card.value
                                : card.value}
                            </p>
                        </div>

                        </div>
                    </motion.div>
                    ))}
                </motion.div>
                )}
        </section>
    );
}

export default DashboardStats;