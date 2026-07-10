import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};

type Currency = "INR" | "USD" | "EUR" | "GBP" | null;

type Invoice = {
  _id: string;
  invoice_number: string | null;
  date: string | null;
  supplier: string | null;
  buyer: string | null;
  items: InvoiceItem[];
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  currency: Currency;
};

type Props = {
  details: Invoice;
  onClose: () => void;
  onUpdated: () => void;
};

function normalizeNullableString(v: string) {
  const t = v.trim();
  return t.length ? t : null;
}

function toISODateOrNull(v: string) {
  const t = v.trim();
  if (!t) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  return null;
}

function safeParseNumber(v: string): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function formatNumberForUI(n: number | null | undefined) {
  if (n === null || n === undefined) return "";
  if (typeof n !== "number" || !Number.isFinite(n)) return "";
  return String(n);
}

// Totals derived from items in the UI.
// Backend will also recompute totals.
function computeSubtotal(items: InvoiceItem[]) {
  return items.reduce((s, it) => s + (Number(it.total) || 0), 0);
}

function clampItems(items: InvoiceItem[], minLen = 1): InvoiceItem[] {
  if (!Array.isArray(items) || items.length === 0) {
    return [
      {
        name: "",
        quantity: 1,
        price: 0,
        total: 0,
      },
    ];
  }

  const safe = items.filter((it) => it != null);
  if (safe.length >= minLen) return safe;

  return [
    ...safe,
    {
      name: "",
      quantity: 1,
      price: 0,
      total: 0,
    },
  ].slice(0, minLen);
}


export default function InvoiceEditorModal({ details, onClose, onUpdated }: Props) {
  const [form, setForm] = useState<{
    invoice_number: string;
    date: string;
    supplier: string;
    buyer: string;
    currency: Exclude<Currency, null> | "";
    subtotal: string;
    tax: string;
    total: string;
    items: InvoiceItem[];
  }>(() => ({
    invoice_number: details.invoice_number ?? "",
    date: details.date ?? "",
    supplier: details.supplier ?? "",
    buyer: details.buyer ?? "",
    currency: (details.currency ?? "INR") as any,
    subtotal: formatNumberForUI(details.subtotal),
    tax: formatNumberForUI(details.tax),
    total: formatNumberForUI(details.total),
    items: clampItems(
      (details.items ?? []).map((it) => ({
        name: it?.name ?? "",
        quantity: Number(it?.quantity) || 0,
        price: Number(it?.price) || 0,
        total: Number(it?.total) || (Number(it?.quantity) || 0) * (Number(it?.price) || 0),
      }))
    ),
  }));

  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm({
      invoice_number: details.invoice_number ?? "",
      date: details.date ?? "",
      supplier: details.supplier ?? "",
      buyer: details.buyer ?? "",
      currency: (details.currency ?? "INR") as any,
      subtotal: formatNumberForUI(details.subtotal),
      tax: formatNumberForUI(details.tax),
      total: formatNumberForUI(details.total),
      items: clampItems(
        (details.items ?? []).map((it) => ({
          name: it?.name ?? "",
          quantity: Number(it?.quantity) || 0,
          price: Number(it?.price) || 0,
          total: Number(it?.total) || (Number(it?.quantity) || 0) * (Number(it?.price) || 0),
        }))
      ),
    });
    setDirty(false);
    setSaveError(null);
    setFieldErrors({});
  }, [details]);

  // Browser unload warning for unsaved changes.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty || saving) return;
      e.preventDefault();
      e.returnValue = "You have unsaved changes.";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, saving]);

  const derived = useMemo(() => {
    const computedItems = form.items.map((it) => {
      const qty = Number(it.quantity) || 0;
      const price = Number(it.price) || 0;
      const total = qty * price;
      return { ...it, quantity: qty, price, total };
    });
    const subtotalFromItems = computeSubtotal(computedItems);

    const tax = safeParseNumber(form.tax);
    const totalFromFields = (tax ?? 0) + (safeParseNumber(form.subtotal) ?? 0);
    const totalFromItems = subtotalFromItems + (tax ?? 0);

    return {
      computedItems,
      subtotalFromItems,
      tax: tax ?? null,
      totalFromItems,
      totalFromFields,
    };
  }, [form.items, form.tax, form.subtotal]);

  const closeWithWarning = () => {
    if (dirty && !saving) {
      const ok = confirm("You have unsaved changes. Discard?");
      if (!ok) return;
    }
    onClose();
  };

  const showToast = (next: { type: "success" | "error"; message: string }) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToast(next);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2200);
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!form.invoice_number.trim()) errors.invoice_number = "Invoice Number is required.";

    const iso = toISODateOrNull(form.date);
    if (!iso) errors.date = "Date must be in YYYY-MM-DD format.";

    if (!form.supplier.trim()) errors.supplier = "Supplier is required.";
    if (!form.buyer.trim()) errors.buyer = "Buyer is required.";
    if (!form.currency) errors.currency = "Currency is required.";

    if (form.items.length < 1) errors.items = "At least 1 line item is required.";

    for (let i = 0; i < form.items.length; i++) {
      const it = form.items[i];
      if (!it.name.trim()) errors[`item_${i}_name`] = "Item name is required.";

      const qty = Number(it.quantity);
      if (!Number.isFinite(qty) || qty <= 0) errors[`item_${i}_quantity`] = "Quantity must be > 0.";

      const price = Number(it.price);
      if (!Number.isFinite(price) || price < 0) errors[`item_${i}_price`] = "Price must be >= 0.";
    }

    // Subtotal/tax/total are editable, so validate numeric form.
    const subtotalN = safeParseNumber(form.subtotal);
    const taxN = safeParseNumber(form.tax);
    const totalN = safeParseNumber(form.total);

    if (subtotalN === null) errors.subtotal = "Subtotal must be a number.";
    if (taxN === null) errors.tax = "Tax must be a number.";
    if (totalN === null) errors.total = "Total must be a number.";

    // Keep totals consistent with derived values (small tolerance), but do not hard-block if user is editing.
    // We'll still block on significant mismatch at save time.
    const tol = 0.01;
    if (subtotalN !== null && Math.abs(subtotalN - derived.subtotalFromItems) > tol) {
      errors.subtotal = "Subtotal must equal the sum of item totals.";
    }

    if (totalN !== null) {
      const expectedTotal = derived.subtotalFromItems + (taxN ?? 0);
      if (Math.abs(totalN - expectedTotal) > tol) errors.total = "Total must equal subtotal + tax.";
    }

    return errors;
  };

  const setField = (patch: Partial<typeof form>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setDirty(true);
    setSaveError(null);
  };

  const save = async () => {
    const errors = validate();
    setFieldErrors(errors);
    setSaveError(null);

    if (Object.keys(errors).length) {
      const first = Object.values(errors)[0];
      showToast({ type: "error", message: first || "Please fix validation errors." });
      return;
    }

    setSaving(true);

    const payload = {
      invoice_number: normalizeNullableString(form.invoice_number),
      date: toISODateOrNull(form.date),
      supplier: normalizeNullableString(form.supplier),
      buyer: normalizeNullableString(form.buyer),
      currency: form.currency === "" ? undefined : (form.currency as any),
      items: derived.computedItems.map((it) => ({
        name: normalizeNullableString(it.name) as string,
        quantity: Number(it.quantity),
        price: Number(it.price),
        total: Number(it.total),
      })),
      subtotal: safeParseNumber(form.subtotal),
      tax: safeParseNumber(form.tax),
      total: safeParseNumber(form.total),
    };

    try {
      await api.put(`/invoices/${details._id}`, payload);
      showToast({ type: "success", message: "Invoice saved successfully." });
      setDirty(false);
      setSaving(false);
      setFieldErrors({});
      onUpdated();
      onClose();
    } catch (e: any) {
      setSaving(false);
      const msg = e?.response?.data?.message || e?.message || "Save failed";
      setSaveError(msg);
      showToast({ type: "error", message: msg });
    }
  };



  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur" onClick={closeWithWarning} />

      <motion.div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-600">Edit Invoice</p>
            <h3 className="text-2xl font-bold text-slate-900 truncate">{form.invoice_number || "—"}</h3>
            <p className="text-xs text-slate-500 mt-1">Edit all invoice fields and save to persist changes.</p>
          </div>

          <div className="flex items-center gap-2">
            {dirty && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                Unsaved
              </span>
            )}

            <button
              onClick={closeWithWarning}
              disabled={saving}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto max-h-[70vh]">
          <AnimatePresence>
            {toast && (
              <motion.div
                key="toast"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={
                  toast.type === "success"
                    ? "mb-4 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-emerald-800 font-semibold"
                    : "mb-4 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-red-800 font-semibold"
                }
              >
                {toast.message}
              </motion.div>
            )}
          </AnimatePresence>

          {saveError && (
            <div className="mb-4 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-red-800 font-semibold">
              {saveError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Invoice Number" required error={fieldErrors.invoice_number}>
              <input
                value={form.invoice_number}
                onChange={(e) => setField({ invoice_number: e.target.value })}
                className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300 ${
                  fieldErrors.invoice_number ? "border-red-200" : "border-slate-200"
                }`}
              />
            </Field>

            <Field label="Date" required error={fieldErrors.date}>
              <input
                value={form.date}
                onChange={(e) => setField({ date: e.target.value })}
                placeholder="YYYY-MM-DD"
                className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300 ${
                  fieldErrors.date ? "border-red-200" : "border-slate-200"
                }`}
              />
            </Field>

            <Field label="Supplier" required error={fieldErrors.supplier}>
              <input
                value={form.supplier}
                onChange={(e) => setField({ supplier: e.target.value })}
                className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300 ${
                  fieldErrors.supplier ? "border-red-200" : "border-slate-200"
                }`}
              />
            </Field>

            <Field label="Buyer" required error={fieldErrors.buyer}>
              <input
                value={form.buyer}
                onChange={(e) => setField({ buyer: e.target.value })}
                className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300 ${
                  fieldErrors.buyer ? "border-red-200" : "border-slate-200"
                }`}
              />
            </Field>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Currency" required error={fieldErrors.currency}>
              <select
                value={form.currency}
                onChange={(e) => setField({ currency: e.target.value as any })}
                className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300 ${
                  fieldErrors.currency ? "border-red-200" : "border-slate-200"
                }`}
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </Field>

            <Field label="Subtotal" required error={fieldErrors.subtotal}>
              <input
                value={form.subtotal}
                onChange={(e) => setField({ subtotal: e.target.value })}
                className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300 ${
                  fieldErrors.subtotal ? "border-red-200" : "border-slate-200"
                }`}
              />
              <div className="mt-1 text-xs text-slate-500">Auto from items: {derived.subtotalFromItems}</div>
            </Field>

            <Field label="Tax" required error={fieldErrors.tax}>
              <input
                value={form.tax}
                onChange={(e) => setField({ tax: e.target.value })}
                className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300 ${
                  fieldErrors.tax ? "border-red-200" : "border-slate-200"
                }`}
              />
            </Field>

            <Field label="Total" required error={fieldErrors.total}>
              <input
                value={form.total}
                onChange={(e) => setField({ total: e.target.value })}
                className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300 ${
                  fieldErrors.total ? "border-red-200" : "border-slate-200"
                }`}
              />
              <div className="mt-1 text-xs text-slate-500">Auto: {derived.totalFromItems}</div>
            </Field>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Items</p>
                <p className="text-xs text-slate-500 mt-1">Edit line item name, quantity, and price. Total is quantity × price.</p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setField({
                    items: clampItems([...form.items, { name: "", quantity: 1, price: 0, total: 0 }], 1),
                  });
                }}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 font-semibold text-sm"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-3">
              {form.items.map((it, idx) => {
                const nameKey = `item_${idx}_name`;
                const qtyKey = `item_${idx}_quantity`;
                const priceKey = `item_${idx}_price`;

                return (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <Field label={`Item ${idx + 1} Name`} error={fieldErrors[nameKey]}>
                      <input
                        value={it.name}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((prev) => {
                            const next = [...prev.items];
                            const curr = next[idx] ?? { name: "", quantity: 1, price: 0, total: 0 };
                            next[idx] = { ...curr, name: v };
                            return { ...prev, items: next };
                          });
                          setDirty(true);
                          setSaveError(null);
                        }}
                        className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300 ${
                          fieldErrors[nameKey] ? "border-red-200" : "border-slate-200"
                        }`}
                      />
                    </Field>

                    <Field label="Qty" error={fieldErrors[qtyKey]}>
                      <input
                        value={String(it.quantity)}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setForm((prev) => {
                            const next = [...prev.items];
                            const curr = next[idx] ?? { name: "", quantity: 1, price: 0, total: 0 };
                            const quantity = Number.isFinite(v) ? v : 0;
                            const total = quantity * (Number(curr.price) || 0);
                            next[idx] = { ...curr, quantity, total };
                            return { ...prev, items: next };
                          });
                          setDirty(true);
                          setSaveError(null);
                        }}
                        type="number"
                        step="1"
                        min="0"
                        className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300 ${
                          fieldErrors[qtyKey] ? "border-red-200" : "border-slate-200"
                        }`}
                      />
                    </Field>

                    <Field label="Price" error={fieldErrors[priceKey]}>
                      <input
                        value={String(it.price)}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setForm((prev) => {
                            const next = [...prev.items];
                            const curr = next[idx] ?? { name: "", quantity: 1, price: 0, total: 0 };
                            const price = Number.isFinite(v) ? v : 0;
                            const total = (Number(curr.quantity) || 0) * price;
                            next[idx] = { ...curr, price, total };
                            return { ...prev, items: next };
                          });
                          setDirty(true);
                          setSaveError(null);
                        }}
                        type="number"
                        step="0.01"
                        min="0"
                        className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300 ${
                          fieldErrors[priceKey] ? "border-red-200" : "border-slate-200"
                        }`}
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <div className="text-xs font-semibold text-slate-500">Total</div>
                        <div className="text-sm font-bold text-emerald-700">{(Number(it.quantity) || 0) * (Number(it.price) || 0)}</div>
                      </div>
                    </div>

                    <div className="sm:col-span-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (form.items.length <= 1) return;
                          setField({
                            items: form.items.filter((_, i) => i !== idx),
                          });
                        }}
                        disabled={saving || form.items.length <= 1}
                        className="hidden sm:inline-flex px-3 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 border-t border-slate-100 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                Saving...
              </span>
            ) : (
              <>
                Press <span className="font-semibold">Save</span> to update the invoice.
              </>
            )}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeWithWarning}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 font-semibold disabled:opacity-60"
            >
              Cancel
            </button>

            <motion.button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="sm:col-span-5">
      <div className="text-xs font-semibold text-slate-600">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </div>
      <div className="mt-1">{children}</div>
      {error ? <div className="mt-1 text-xs text-red-600 font-semibold">{error}</div> : null}
    </div>
  );
}

