import nodemailer from 'nodemailer';

export type SendEmailInput = {
  to: string;
  subject: string;
  body: string;
};

export async function sendEmail(input: SendEmailInput): Promise<{ sent: boolean; info?: any; reason?: string }>{
  const host = process.env.SMTP_HOST || '';
  const port = Number(process.env.SMTP_PORT || '0');
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const secure = (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
  const from = process.env.FROM_EMAIL || user || 'no-reply@example.com';

  if (!host || !port || !user || !pass) {
    return { sent: false, reason: 'SMTP not configured (set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)' };
  }

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  const info = await transporter.sendMail({ from, to: input.to, subject: input.subject, text: input.body });
  return { sent: true, info };
}
