import { Request } from 'express';
import { FileFilterCallback } from 'multer';

export const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
): void => {
    const allowedMimeTypes = [
        'application/msword', // Microsoft Word
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word (docx)
        'application/vnd.ms-excel', // Microsoft Excel
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (xlsx)
        'application/pdf' // PDF
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(null, false);
    }
};
