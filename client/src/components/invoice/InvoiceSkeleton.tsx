export default function InvoiceSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-24 rounded-3xl border border-border bg-surface-glass backdrop-blur shadow-glass p-5"
        >
          <div className="h-4 w-52 rounded-full bg-border animate-pulse" />

          <div className="mt-4 h-3 w-72 rounded-full bg-border animate-pulse" />
        </div>
      ))}
    </div>
  );
}