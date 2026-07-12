export default function InvoiceSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-20 rounded-2xl border border-slate-100 bg-white/50 p-4"
        >
          <div className="h-3 w-56 rounded bg-slate-200 animate-pulse" />

          <div className="mt-3 h-3 w-64 rounded bg-slate-200 animate-pulse" />
        </div>
      ))}
    </div>
  );
}