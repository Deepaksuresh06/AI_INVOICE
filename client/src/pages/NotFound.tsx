
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="w-full max-w-2xl"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_0_60px_-20px_rgba(139,92,246,0.35)]">
          <h1 className="text-3xl font-black text-white">Page not found</h1>
          <p className="mt-3 text-gray-300">
            The route you requested doesn’t exist in InvoiceIQ.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_15px_50px_-15px_rgba(99,102,241,0.55)] transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

