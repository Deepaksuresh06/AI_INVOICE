import { motion } from "framer-motion";

function Header() {
    return (<motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-2">Upload invoices and track extracted totals in seconds.</p>
          </div>

        </motion.div>
    );
}

export default Header;