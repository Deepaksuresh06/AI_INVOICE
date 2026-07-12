import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useMemo } from "react";
import { toast } from "react-hot-toast";
import { UploadCloud, Sparkles } from "lucide-react";
import api from "../../api/axios";

type UploadCardProps = {
  onUploadSuccess: () => Promise<void> | void;
};

function UploadCard( {onUploadSuccess}: UploadCardProps) {

    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    const canUpload = !!file && !uploading;
    const supportsPreview = 
        useMemo(() => 
            file?.type?.startsWith("image/"), 
        [file]);

    const [stage, setStage] = 
        useState<"idle" | "uploading" | "processing" | "success">("idle");

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
            await api.post(`/upload`, formData)

            window.clearInterval(timer);
            setUploadProgress(100);
            setStage("processing");

            await onUploadSuccess();

            setStage("success");
            await new Promise((r) => setTimeout(r, 500));

            setFile(null);
            if (inputRef.current) inputRef.current.value = "";
        } 
        catch (error: any) {
            console.error("Error uploading file:", error);

            const backendMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Upload failed";

            window.clearInterval(timer);
            setStage("idle");
            setUploadProgress(0);

            setUploadError(backendMessage);
            toast.error(backendMessage);
        } 
        finally {
            setUploading(false);
        }
    };
    
    const handleFile = (selectedFile: File) => {
        setUploadError(null);
        setFile(selectedFile);
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };
    const handleUpload = () => {
        if (!file) return;
        if (!canUpload) return;
        void uploadFile(file);
    };

    return (
        <motion.div
            className="
            relative overflow-hidden bg-surface-glass backdrop-blur border
            border-border rounded-3xl shadow-glass p-7
            transition-all duration-300"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <div className="
            absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-start via-brand-mid to-brand-end"
            />
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-2xl font-bold text-content">Upload Invoice</h2>
                <p className="text-content-muted">PDF, PNG, JPG up to 5MB</p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <span className="text-lg"><UploadCloud className="w-6 h-6 text-brand-start" /></span>
              </div>
            </div>

            <div
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition
                ${canUpload ? "border-brand-start bg-brand-start/5 hover:bg-brand-start/10" : "border-border bg-surface-elevated"}`}
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
                className="mx-auto mb-3 h-14 w-14 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center"
                animate={uploading ? { rotate: 360 } : undefined}
                transition={{ duration: 0.6, ease: "linear", repeat: uploading ? Infinity : 0 }}
              >
                <span className="text-3xl"><Sparkles className="w-8 h-8 text-brand-start"/></span>
              </motion.div>

              <p className="text-base sm:text-lg font-semibold text-content">
                Drag & Drop or Click to Browse
              </p>
              <p className="text-content-muted text-sm mt-2">
                We’ll extract vendor, totals, and line items.
              </p>
            </div>

            <AnimatePresence>
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-6 rounded-2xl border border-border bg-surface-elevated p-4"
                >
                  <div className="flex items-center gap-4">
                    {supportsPreview ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center">
                        <span className="text-3xl">📄</span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-cover truncate">{file.name}</p>
                      <p className="text-cover-muted text-sm">
                        {((file.size || 0) / 1024).toFixed(2)} KB
                      </p>
                    </div>

                    <button
                      onClick={() => setFile(null)}
                      disabled={uploading}
                      className="px-3 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition disabled:opacity-60"
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
                className=" w-full rounded-2xl bg-gradient-to-r from-brand-start via-brand-mid to-brand-end text-white py-3.5 font-semibold shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
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

              <p className="text-center text-xs text-content-muted mt-3">
                Tip: use a clear PDF/image for best extraction.
              </p>
            </div>
          </motion.div>
    );
}

export default UploadCard;