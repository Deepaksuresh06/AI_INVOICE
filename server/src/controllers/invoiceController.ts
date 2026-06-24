import { Request, Response } from 'express';
import { processInvoice } from '../services/geminiService'

export const uploadInvoice = async(req: Request, res: Response) => {

    try {
        const file = req.file;
        if(!file) {
            return res.status(404).json({message : "File not Found"});
        }
        const invoice = processInvoice(file.path, file.mimetype);

        return res.status(200).json({ success: true, invoice});
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({success: false, messege: "error in invoice processing"});
    }
}