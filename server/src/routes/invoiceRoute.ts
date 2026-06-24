import { uploadInvoice } from "../controllers/invoiceController";
import { upload } from "../middleware/uploadMiddleware";

import express from "express";
const router = express.Router();

router.post('/upload', upload.single('invoice'), uploadInvoice);
export default router;