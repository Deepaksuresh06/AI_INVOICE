import { motion } from "framer-motion";

function Header() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning ☀️"
      : hour < 18
      ? "Good Afternoon 🌤️"
      : "Good Evening 🌙";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="flex flex-col gap-3"
    >
      <span className="text-sm font-medium text-content-muted tracking-wide">
        {greeting}
      </span>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-brand-start via-brand-mid to-brand-end bg-clip-text text-transparent">
              Invoice Intelligence
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-base md:text-lg text-content-muted leading-relaxed">
            Upload invoices, extract structured data using AI, monitor
            financial documents, and manage everything from one intelligent
            workspace.
          </p>
        </div>

        <div className="self-start lg:self-end rounded-2xl border border-border bg-surface-glass backdrop-blur px-5 py-3 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-content-muted">
            Today
          </p>

          <p className="mt-1 font-semibold text-content">
            {today}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Header;