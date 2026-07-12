import { motion } from "framer-motion";

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
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Invoices
          </h1>

          <p className="text-slate-500 mt-2">
            Search, sort, filter, export, delete, and view details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className={`px-3 py-2 rounded-xl text-sm font-semibold border transition ${
              view === "card"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
            onClick={() => setView("card")}
          >
            Cards
          </button>

          <button
            className={`px-3 py-2 rounded-xl text-sm font-semibold border transition ${
              view === "table"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
            onClick={() => setView("table")}
          >
            Table
          </button>
        </div>
      </div>
    </motion.div>
  );
}