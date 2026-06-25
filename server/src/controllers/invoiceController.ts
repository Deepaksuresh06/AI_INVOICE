import { Request, Response } from 'express';
import { processInvoice } from '../services/geminiService';
import { Invoice } from '../models/invoiceJSONModel'
import mongoose from 'mongoose';
import { UpdateInvoiceSchema } from '../types/invoiceSchema';

export const uploadInvoice = async(req: Request, res: Response) => {

    try {
        const file = req.file;
        if(!file) {
            return res.status(404).json({message : "File not Found"});
        }
        const invoice = await processInvoice(file.path, file.mimetype);

        return res.status(200).json({ success: true, invoice});
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({success: false, messege: "error in invoice processing"});
    }
}

export const getInvoices = async (req: Request, res: Response) => {
    try {
        const invoices = await Invoice.find();

        return res.status(200).json({
        success: true,
        count: invoices.length,
        data: invoices,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
        success: false,
        message: "Error getting invoices",
        });
    }
};

export const getInvoiceStats = async (req: Request, res: Response) => {
    try {
        const invoices = await Invoice.find().lean();
        const totalInvoices = invoices.length;
        const totalAmount = invoices.reduce((sum, invoice: any) => sum + (invoice.total || 0), 0);
        const averageAmount = (totalInvoices > 0) ? totalAmount / totalInvoices : 0;

        const vendors = new Set(invoices.map((invoice: any) => invoice.supplier)).size;

        return res.status(200).json({
        success: true,
        data: {
            totalInvoices,
            totalAmount,
            averageAmount,
            vendors,
        },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error getting invoice stats",
            });
    }
};

export const getInvoice = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid invoice id",
            });
        }
        const invoice = await Invoice.findById(id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: invoice,
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error getting invoice",
            });
    }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Validate input
    const parsed = UpdateInvoiceSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid update payload",
        errors: parsed.error.flatten()
      });
    }

    const updateData = parsed.data;

    // 2. Find existing invoice
    const existingInvoice = await Invoice.findById(id);

    if (!existingInvoice) {
      return res.status(404).json({
        message: "Invoice not found"
      });
    }

    // 3. Merge safely (important for partial updates)
    const mergedInvoice = {
      ...existingInvoice.toObject(),
      ...updateData
    };

    // 4. Maintain sum
    if (updateData.items) {
      mergedInvoice.total = updateData.items.reduce(
        (sum, item) => sum + (item.total || 0),
        0
      );
    }

    // 5. Save updated invoice
    const updated = await Invoice.findByIdAndUpdate(
      id,
      { $set: mergedInvoice },
      { new: true }
    );

    return res.json({
      message: "Invoice updated successfully",
      invoice: updated
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err
    });
  }
};

export const delInvoice = async(req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await Invoice.findByIdAndDelete(id);
        return res.status(200).send({success: true, message: "invoice deleted"});
    }
    catch(error) {
        return res.status(500).json({
            message: "Server error",
            error: error
        });
    }
};

export const exportInvoiceJSON = async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.setHeader("Content-Disposition", "attachment; filename=invoice.json");
    res.setHeader("Content-Type", "application/json");

    return res.send(JSON.stringify(invoice, null, 2));
  } catch (err) {
    return res.status(500).json({ message: "Export failed", error: err });
  }
};