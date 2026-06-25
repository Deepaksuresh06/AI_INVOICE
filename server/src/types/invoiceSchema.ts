import { z } from "zod";

export const InvoiceSchema = z.object({

  invoice_number: z.string().nullable(),
  date: z.string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Invalid date format"
  ).nullable(),
  
  supplier: z.string().nullable(),
  buyer: z.string().nullable(),

  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.coerce.number(),
      price: z.coerce.number(),
      total: z.coerce.number()
    })
  ),

  subtotal: z.coerce.number().nullable(),
  tax: z.coerce.number().nullable(),
  total: z.coerce.number().nullable(),
  currency: z.enum([
    "INR",
    "USD",
    "EUR",
    "GBP"
  ]).nullable()
});

export const UpdateInvoiceSchema = z.object({
  invoice_number: z.string().optional(),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),

  supplier: z.string().optional(),
  buyer: z.string().optional(),

  items: z
    .array(
      z.object({
        name: z.string().optional(),
        quantity: z.coerce.number().optional(),
        price: z.coerce.number().optional(),
        total: z.coerce.number().optional()
      })
    )
    .optional(),

  subtotal: z.coerce.number().optional(),
  tax: z.coerce.number().optional(),
  total: z.coerce.number().optional(),

  currency: z.enum(["INR", "USD", "EUR", "GBP"]).optional()
});

export type InvoiceData =
  z.infer<typeof InvoiceSchema>;