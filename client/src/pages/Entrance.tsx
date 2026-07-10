
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


function Entrance() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-screen overflow-hidden">

      <div className="relative z-20 flex h-full flex-col items-center justify-center text-center text-white">
        <p className="text-2xl font-light tracking-wide text-gray-300">
          What if invoices understood themselves?
        </p>

        <h1 className="mt-5 bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-8xl font-black text-transparent">
          InvoiceIQ
        </h1>

        <p className="mt-6 text-lg text-gray-400">
          AI-powered invoice extraction in seconds.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate("/dashboard", { replace: true })}
          className="group mt-16 flex items-center gap-3 text-lg tracking-[0.25em] text-gray-400 transition-colors hover:text-white"
        >
          <motion.span
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="font-semibold"
          >
            {">>"}
          </motion.span>

          <span className="tracking-wider">Let&apos;s Extract</span>

          <motion.span
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="font-semibold"
          >
            {">>"}
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
}

export default Entrance;

