export type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};

export type Invoice = {
  _id: string;
  invoice_number: string | null;
  date: string |null;
  supplier: string | null;
  buyer: string | null;
  items: InvoiceItem[];
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  currency: "INR" | "USD" | "EUR" | "GBP" | null;
  createdAt?: string;
};

export type SortKey =
  | "createdAt"
  | "total"
  | "date"
  | "supplier"
  | "buyer";

export type SortState = {
  key: SortKey;
  dir: "asc" | "desc";
};