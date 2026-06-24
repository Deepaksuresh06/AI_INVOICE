import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    invoice_number: { type: String, default: null },
    date: { type: String, default: null },
    supplier: { type: String, default: null },
    buyer: { type: String, default: null },

    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
        total: Number,
      },
    ],

    subtotal: { type: Number, default: null },
    tax: { type: Number, default: null },
    total: { type: Number, default: null },
    currency: { type: String, default: null },
  },
  { timestamps: true }
);

export const Invoice = mongoose.model("Invoice", InvoiceSchema);