import {Request, Response} from 'express';

export const uploadInvoice = async(req: Request, res: Response) => {

    const file = req.file;
    if(!file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    return res.status(200).json({ success: true, filePath: file.path });

}