import nodemailer from "nodemailer";
import { envVars } from "../config/env";

export const transporter = nodemailer.createTransport({
  host: envVars.SMTP_HOST,
  port: Number(envVars.SMTP_PORT),
  service: "gmail",
  secure: true,
  auth: {
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASSWORD,
  },
});

export interface ISendEmail {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    contentType: string;
    content: Buffer | string;
  }[];
}
