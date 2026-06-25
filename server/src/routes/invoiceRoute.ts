import { getInvoices, getInvoiceStats, getInvoice, uploadInvoice, updateInvoice, delInvoice, exportInvoiceJSON} from "../controllers/invoiceController";
import { upload } from "../middleware/uploadMiddleware";

import express from "express";
const router = express.Router();

router.get('/invoices', getInvoices);
router.get('/invoices/stats', getInvoiceStats);
router.get('/invoices/:id', getInvoice)
router.put('/invoices/:id', updateInvoice);
router.post('/upload', upload.single('invoice'), uploadInvoice);
router.delete('/invoices/:id', delInvoice);
router.get('/invoices/:id/export', exportInvoiceJSON);
export default router;