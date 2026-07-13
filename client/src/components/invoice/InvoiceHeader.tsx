import { motion } from "framer-motion";
import { LayoutGrid, Table2 } from "lucide-react";

type Props = {
  view: "card" | "table";
  setView: (view: "card" | "table") => void;
};

export default function InvoiceHeader({ view, setView }: Props) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className=" text-4xl font-black tracking-tight bg-gradient-to-r from-brand-start via-brand-mid to-brand-end bg-clip-text   text-transparent">
                Invoices
            </h1>

          <p className="text-content-muted mt-2">
            Manage every extracted invoice from one unified workspace.
          </p>
        </div>

        <div
            className=" flex items-center rounded-2xl border border-border bg-surface-glass p-1 shadow-glass"
        >
          <button
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              view === "card"
                ? "bg-gradient-to-r from-brand-start via-brand-mid to-brand-end text-white shadow-lg border-transparent"
                : "bg-transparent text-content-muted border-transparent hover:bg-surface-elevated"
            }`}
            onClick={() => setView("card")}
          >
            <span className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                Cards
            </span>
          </button>

          <button
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              view === "table"
                ? "bg-gradient-to-r from-brand-start via-brand-mid to-brand-end text-white shadow-lg border-transparent"
                : "bg-transparent text-content-muted border-transparent hover:bg-surface-elevated"
            }`}
            onClick={() => setView("table")}
          >
            <span className="flex items-center gap-2">
              <Table2 className="w-4 h-4" />
              Table
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}