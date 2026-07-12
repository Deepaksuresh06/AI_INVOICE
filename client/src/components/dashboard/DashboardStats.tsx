import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "../../api/axios";

type InvoiceStats = {
  totalInvoices: number;
  totalAmount: number;
  averageAmount: number;
  vendors: number;
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

function DashboardStats() {
    const [loadingStats, setLoadingStats] = useState(false);
    const [invoiceStats, setInvoiceStats] = useState<InvoiceStats | null>(null);

    const fetchInvoiceStats = async () => {
        setLoadingStats(true);
        try {
        const response = await api.get("/invoices/stats");
        const data = response.data;
        setInvoiceStats(data.data);
        } catch (error) {
        alert("Error fetching invoice stats. Check console for details.");
        console.error("Error fetching invoice stats:", error);
        } finally {
        setLoadingStats(false);
        }
    };

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
            className="bg-white/70 backdrop-blur border border-white/60 rounded-2xl shadow-sm p-6"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            >
            <div className="h-4 w-36 bg-slate-200/60 rounded animate-pulse" />
            <div className="mt-3 h-4 w-24 bg-slate-200/60 rounded animate-pulse" />
            <div className={`mt-3 h-${s.h} w-20 bg-slate-200/60 rounded animate-pulse`} />
            </motion.div>
        ))}
        </div>
    );

    useEffect(() => {
        void fetchInvoiceStats();
    }, []);

    return (
        <div>
            {loadingStats && !invoiceStats
            ? statsSkeleton
            : invoiceStats && (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {[
                    {
                        label: "Total Invoices",
                        value: invoiceStats.totalInvoices,
                        accent: "bg-cyan-50 text-cyan-700",
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
                        className="bg-white/80 backdrop-blur border border-white/70 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
                        whileHover={{ y: -2 }}
                    >
                        <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-slate-500 text-sm">{card.label}</p>
                            <p className="text-3xl font-extrabold tracking-tight mt-2">
                            {card.value}
                            </p>
                        </div>

                        </div>
                    </motion.div>
                    ))}
                </motion.div>
                )}
        </div>
    );
}

export default DashboardStats;