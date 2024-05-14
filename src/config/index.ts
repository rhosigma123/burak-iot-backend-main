import dotenv from 'dotenv';
dotenv.config();
import { SmtpCredentials } from '../types/smtp';


export const JWTSECRET = process.env.JWT_SECRET || 'fgsuildtguisdhguihsduasdfiwusdighksdfhgjksdf'
export const PORT = process.env.PORT || 4000
export const LOGLEVEL = process.env.LOG_LEVEL || "info"
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"

export const SMTP_CRED: SmtpCredentials = {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10), // Convert to number
    secure: process.env.SMTP_SECURE === 'true', // Convert to boolean
};
