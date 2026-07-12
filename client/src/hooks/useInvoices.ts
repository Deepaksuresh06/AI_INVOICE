import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import type { Invoice } from "../types/invoice";

export default function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/invoices");

      const backendInvoices = res.data?.data ?? [];

      const mapped: Invoice[] = backendInvoices.map(
        (inv: any) => ({
          _id: inv._id,
          invoice_number: inv.invoice_number ?? null,
          date: inv.date ?? null,
          supplier: inv.supplier ?? null,
          buyer: inv.buyer ?? null,
          items: inv.items ?? [],
          subtotal: inv.subtotal ?? null,
          tax: inv.tax ?? null,
          total: inv.total ?? null,
          currency: inv.currency ?? null,
          createdAt: inv.createdAt,
        })
      );

      setInvoices(mapped);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to load invoices"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInvoices();
  }, [loadInvoices]);

  return {
    invoices,
    setInvoices,
    loading,
    error,
    loadInvoices,
  };
}