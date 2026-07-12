import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Entrance() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-screen overflow-hidden items-center justify-center">
      <div className="relative z-20 flex max-w-5xl flex-col items-center px-6 text-center">
        {/* AI Badge */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 backdrop-blur-xl"
        >
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-medium tracking-wide text-gray-300">
            AI Powered Invoice Extraction
          </span>
        </motion.div>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-2xl font-light tracking-wide text-gray-300 md:text-3xl"
        >
          What if invoices understood themselves?
        </motion.p>

        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-7xl font-black md:text-8xl lg:text-9xl"
        >
          <span className="text-white">Invoice</span>

          <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
            IQ
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-8 max-w-2xl text-lg leading-8 text-gray-400 md:text-xl"
        >
          Extract structured invoice data from PDFs and images using Google
          Gemini AI in seconds.
        </motion.p>

        {/* CTA */}
        <motion.button
          whileHover={{
            scale: 1.04,
            y: -2,
          }}
          whileTap={{
            scale: 0.98,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigate("/dashboard")}
          className="group mt-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-10 py-5 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:shadow-cyan-500/30"
        >
          <span className="flex items-center gap-3">
            Let's Start

            <motion.span
              animate={{ x: [0, 6, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
              }}
            >
              →
            </motion.span>
          </span>
        </motion.button>

        {/* Bottom Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          transition={{ delay: 1 }}
          className="mt-14 text-sm tracking-[0.35em] uppercase text-gray-500"
        >
          Intelligent • Fast • Reliable
        </motion.p>
      </div>
    </div>
  );
}

export default Entrance;