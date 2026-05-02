// utils/emailSender.js
import { Resend } from 'resend';

export const sendEmailWithPDF = async (customerEmail, pdfBytes) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const attachments = [
    {
      filename: 'order-confirmation.pdf',
      content: pdfBytes.toString('base64'),
      contentType: 'application/pdf',
      disposition: 'attachment',
    },
  ];

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: 'Your Order Confirmation',
    text: 'Thank you for your order! Please find the attached order confirmation PDF.',
    attachments,
  };

  await resend.sendEmail(mailOptions);
};
