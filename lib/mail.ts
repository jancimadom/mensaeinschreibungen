import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async (to: string, subject: string, text: string, html: string, attachments?: any[]) => {
  if (!process.env.SMTP_USER) {
    console.log("Mocking email send (no SMTP_USER configured):", { to, subject, hasAttachments: !!attachments?.length });
    return true;
  }
  return await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Mensa Bruneck" <noreply@sspbruneck1.it>',
    to,
    subject,
    text,
    html,
    attachments,
  });
};
