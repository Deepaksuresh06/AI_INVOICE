import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

type Invoice = {
  _id: string;
  vendor: string;
  amount: number;
  invoiceNumber: string;
};

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

function DashBoard() {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stage, setStage] = useState<"idle" | "uploading" | "processing" | "success">("idle");


  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceStats, setInvoiceStats] = useState<InvoiceStats | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const canUpload = !!file && !uploading;

  const supportsPreview = useMemo(() => file?.type?.startsWith("image/"), [file]);

  const handleFile = (selectedFile: File) => {
    setUploadError(null);
    setFile(selectedFile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const uploadFile = async (fileToUpload: File) => {
    const formData = new FormData();
    formData.append("invoice", fileToUpload);

    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    setStage("uploading");

    // Fake progress until we know backend response (API doesn’t provide upload progress)
    const start = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(92, Math.round((elapsed / 2200) * 92));
      setUploadProgress((p) => (pct > p ? pct : p));
    }, 100);

    try {
      const response = await api.post(`/upload`, formData);
      console.log(response);
      alert("File uploaded successfully");

      window.clearInterval(timer);
      setUploadProgress(100);
      setStage("processing");

      // backend already processed + saved when we return
      await fetchInvoiceStats();
      await fetchInvoices();

      setStage("success");
      await new Promise((r) => setTimeout(r, 500));

      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (error: any) {
      console.error("Error uploading file:", error);

      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Upload failed";

      window.clearInterval(timer);
      setStage("idle");
      setUploadProgress(0);

      setUploadError(backendMessage);
      alert(`Upload failed: ${backendMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    if (!canUpload) return;
    void uploadFile(file);
  };

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

  const fetchInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const response = await api.get("/invoices");
      const backendInvoices = response.data.data;
      const mappedInvoices: Invoice[] = (backendInvoices ?? []).map((inv: any) => ({
        _id: inv._id,
        vendor: inv.supplier ?? "",
        amount: inv.total ?? 0,
        invoiceNumber: inv.invoice_number ?? "",
      }));
      setInvoices(mappedInvoices);
    } catch (error) {
      alert("Error in fetching invoices. Check console for details.");
      console.error("Error fetching invoices:", error);
    } finally {
      setLoadingInvoices(false);
    }
  };

  useEffect(() => {
    void fetchInvoiceStats();
    void fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-2">Upload invoices and track extracted totals in seconds.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white border border-slate-200 px-3 py-2 shadow-sm">
              <p className="text-xs text-slate-600">
                Backend: <span className="font-semibold">{uploading ? "Processing" : "Ready"}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
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
                      <div className={`h-10 w-10 rounded-xl ${card.accent} flex items-center justify-center`}> 
                        <div className="text-lg">✨</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent invoices */}
          <motion.div
            className="bg-white/80 backdrop-blur border border-white/70 rounded-2xl shadow-sm p-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recent Invoices</h2>
                <p className="text-slate-500 text-sm mt-1">Latest extracted totals</p>
              </div>
              <button
                className="text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-xl hover:bg-slate-100"
                onClick={() => (window.location.href = "/invoices")}
              >
                View All
              </button>
            </div>

            <AnimatePresence mode="wait">
              {loadingInvoices && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="h-3 w-48 bg-slate-200/70 rounded animate-pulse" />
                      <div className="mt-3 h-3 w-28 bg-slate-200/50 rounded animate-pulse" />
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
                  <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <span className="text-2xl">🧾</span>
                  </div>
                  <p className="mt-4 font-semibold text-slate-800">No invoices yet</p>
                  <p className="text-slate-500 text-sm mt-1">Upload your first invoice to see extracted totals.</p>
                </motion.div>
              )}

              {!loadingInvoices && invoices.length > 0 && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {invoices.slice(0, 5).map((invoice, idx) => (
                    <motion.div
                      key={invoice._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 hover:shadow-sm hover:bg-slate-50 transition"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{invoice.invoiceNumber || "—"}</p>
                        <p className="text-slate-500 text-sm truncate">{invoice.vendor || "Unknown vendor"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 text-xs">Amount</p>
                        <p className="font-extrabold text-emerald-600">{formatINR(invoice.amount)}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Upload */}
          <motion.div
            className="bg-white/80 backdrop-blur border border-white/70 rounded-2xl shadow-sm p-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Upload Invoice</h2>
                <p className="text-slate-500 text-sm mt-1">PDF, PNG, JPG up to 5MB</p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <span className="text-lg">📤</span>
              </div>
            </div>

            <div
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition
                ${canUpload ? "border-cyan-200 bg-cyan-50/20 hover:bg-cyan-50/40" : "border-slate-200 bg-slate-50"}`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={handleChange}
                disabled={uploading}
              />

              <motion.div
                className="mx-auto mb-3 h-14 w-14 rounded-2xl bg-white/80 border border-slate-100 flex items-center justify-center"
                animate={uploading ? { rotate: 360 } : undefined}
                transition={{ duration: 0.6, ease: "linear", repeat: uploading ? Infinity : 0 }}
              >
                <span className="text-3xl">🧠</span>
              </motion.div>

              <p className="text-base sm:text-lg font-semibold text-slate-900">
                Drag & Drop or Click to Browse
              </p>
              <p className="text-slate-500 text-sm mt-2">
                We’ll extract vendor, totals, and line items.
              </p>
            </div>

            <AnimatePresence>
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-center gap-4">
                    {supportsPreview ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center">
                        <span className="text-3xl">📄</span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{file.name}</p>
                      <p className="text-slate-500 text-sm">
                        {((file.size || 0) / 1024).toFixed(2)} KB
                      </p>
                    </div>

                    <button
                      onClick={() => setFile(null)}
                      disabled={uploading}
                      className="px-3 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {uploadError && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm font-semibold text-red-800">Upload failed</p>
                <p className="text-sm text-red-700 mt-1">{uploadError}</p>
              </motion.div>
            )}

            <AnimatePresence>
              {uploading && (
                <motion.div
                  key="ai-processing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-5 rounded-3xl border border-slate-100 bg-gradient-to-b from-white/70 to-slate-50 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">AI Processing</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {stage === "uploading" && "Uploading file..."}
                        {stage === "processing" && "Running extraction pipeline..."}
                        {stage === "success" && "Completed"}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                      <span className="text-lg">⚡</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="space-y-3">
                      {[
                        { key: "uploading", label: "Uploading..." },
                        { key: "reading", label: "Reading Invoice..." },
                        { key: "extracting", label: "Extracting Text..." },
                        { key: "layout", label: "Understanding Layout..." },
                        { key: "validating", label: "Validating JSON..." },
                        { key: "preview", label: "Preparing Preview..." },
                      ].map((step, idx) => {
                        const progressStep = Math.round((uploadProgress / 100) * 6);
                        const done = idx < progressStep;
                        const current = idx === progressStep;

                        return (
                          <motion.div
                            key={step.key}
                            className="flex items-center gap-3"
                            initial={false}
                            animate={{ opacity: 1 }}
                          >
                            <div
                              className={
                                done
                                  ? "h-8 w-8 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100"
                                  : current
                                    ? "h-8 w-8 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-100"
                                    : "h-8 w-8 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-100"
                              }
                            >
                              {done ? (
                                <span>✓</span>
                              ) : current ? (
                                <motion.span
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  ⟳
                                </motion.span>
                              ) : (
                                <span>•</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p
                                className={
                                  done
                                    ? "text-sm font-semibold text-slate-900"
                                    : current
                                      ? "text-sm font-semibold text-slate-900"
                                      : "text-sm text-slate-500"
                                }
                              >
                                {step.label}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-slate-600">Progress</p>
                        <p className="text-xs text-slate-500">{uploadProgress}%</p>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200/70 overflow-hidden">
                        <motion.div
                          className="h-full bg-cyan-500"
                          style={{ width: `${uploadProgress}%` }}
                          initial={{ width: "0%" }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>


            <div className="mt-6">
              <motion.button
                whileHover={canUpload ? { scale: 1.01 } : undefined}
                whileTap={canUpload ? { scale: 0.99 } : undefined}
                onClick={handleUpload}
                disabled={!canUpload}
                className="w-full rounded-2xl bg-slate-900 text-white py-3.5 font-semibold shadow-sm hover:bg-slate-800 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {uploading ? (
                    <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <span>✨</span>
                  )}
                  {uploading ? "Processing..." : "Upload Invoice"}
                </span>
              </motion.button>

              <p className="text-center text-xs text-slate-500 mt-3">
                Tip: use a clear PDF/image for best extraction.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;

