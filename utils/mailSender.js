import { Resend } from "resend";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getFromAddress = () => process.env.EMAIL_FROM || "programmerjahid162@gmail.com";
const getAdminAddress = () => process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || "programmerjahid162@gmail.com";

const buildOrderRows = (cartItems = []) =>
  cartItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${escapeHtml(item.name || "Product")}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.qty || 0}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">€${Number(item.price || 0).toFixed(2)}</td>
        </tr>`
    )
    .join("");

const buildOrderSummaryHtml = (order) => {
  const totals = order?.totals || {};
  const cartItems = order?.cartItems || [];

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">New order received</h2>
      <p style="margin: 0 0 16px;">A new order has been placed on your store.</p>
      <p style="margin: 0 0 8px;"><strong>Customer:</strong> ${escapeHtml(order?.firstName || "") + " " + escapeHtml(order?.lastName || "")}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(order?.email || "")}</p>
      <p style="margin: 0 0 8px;"><strong>Tracking ID:</strong> ${escapeHtml(order?.trackingId || "")}</p>
      <p style="margin: 0 0 16px;"><strong>Payment status:</strong> ${order?.paid ? "Paid" : "Pending"}</p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <thead>
          <tr style="background: #f3f4f6; text-align: left;">
            <th style="padding: 8px 0;">Item</th>
            <th style="padding: 8px 0;">Qty</th>
            <th style="padding: 8px 0; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>${buildOrderRows(cartItems)}</tbody>
      </table>

      <p style="margin: 0 0 4px;"><strong>Subtotal:</strong> €${Number(totals.subtotal || 0).toFixed(2)}</p>
      <p style="margin: 0 0 4px;"><strong>Discount:</strong> €${Number(totals.discount || 0).toFixed(2)}</p>
      <p style="margin: 0 0 4px;"><strong>Shipping:</strong> €${Number(totals.shipping || 0).toFixed(2)}</p>
      <p style="margin: 0 0 4px;"><strong>Tax:</strong> €${Number(totals.tax || 0).toFixed(2)}</p>
      <p style="margin: 0 0 8px;"><strong>Grand total:</strong> €${Number(totals.grandTotal || 0).toFixed(2)}</p>
      <p style="margin: 0;">Please review the order in the admin dashboard.</p>
    </div>`;
};

const buildCustomerConfirmationHtml = (order) => {
  const totals = order?.totals || {};
  const cartItems = order?.cartItems || [];

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">Thank you for your order</h2>
      <p style="margin: 0 0 16px;">We have received your order and it is currently being processed.</p>
      <p style="margin: 0 0 8px;"><strong>Order ID:</strong> ${escapeHtml(order?.trackingId || "")}</p>
      <p style="margin: 0 0 16px;"><strong>Delivery address:</strong> ${escapeHtml(order?.streetAddress || "")}, ${escapeHtml(order?.city || "")}, ${escapeHtml(order?.zip || "")}</p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <thead>
          <tr style="background: #f3f4f6; text-align: left;">
            <th style="padding: 8px 0;">Item</th>
            <th style="padding: 8px 0;">Qty</th>
            <th style="padding: 8px 0; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>${buildOrderRows(cartItems)}</tbody>
      </table>

      <p style="margin: 0 0 4px;"><strong>Subtotal:</strong> €${Number(totals.subtotal || 0).toFixed(2)}</p>
      <p style="margin: 0 0 4px;"><strong>Shipping:</strong> €${Number(totals.shipping || 0).toFixed(2)}</p>
      <p style="margin: 0 0 4px;"><strong>Tax:</strong> €${Number(totals.tax || 0).toFixed(2)}</p>
      <p style="margin: 0 0 8px;"><strong>Grand total:</strong> €${Number(totals.grandTotal || 0).toFixed(2)}</p>
      <p style="margin: 0;">We will contact you if we need any additional information.</p>
    </div>`;
};

export const sendEmailWithPDF = async (customerEmail, pdfBytes) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    console.warn("Email notifications skipped: missing Resend configuration.");
    return;
  }

  const attachments = [
    {
      filename: "order-confirmation.pdf",
      content: Buffer.isBuffer(pdfBytes) ? pdfBytes.toString("base64") : pdfBytes,
      contentType: "application/pdf",
      disposition: "attachment",
    },
  ];

  const response = await resend.emails.send({
    from: getFromAddress(),
    to: customerEmail,
    subject: "Your Order Confirmation",
    text: "Thank you for your order! Please find the attached order confirmation PDF.",
    html: "<p>Thank you for your order! Please find the attached order confirmation PDF.</p>",
    attachments,
  });

  if (response.error) {
    throw new Error(response.error.message || "Failed to send email");
  }
};

export const sendNewOrderNotifications = async (order) => {
  if (!order?.email) {
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    console.warn("Email notifications skipped: missing Resend configuration.");
    return;
  }

  const adminEmail = getAdminAddress();
  const customerEmail = order.email;

  const adminPayload = {
    from: getFromAddress(),
    to: adminEmail,
    subject: `New order received - ${order.trackingId || "N/A"}`,
    text: `A new order has been placed by ${order.firstName || ""} ${order.lastName || ""}. Tracking ID: ${order.trackingId || "N/A"}`,
    html: buildOrderSummaryHtml(order),
  };

  const customerPayload = {
    from: getFromAddress(),
    to: customerEmail,
    subject: "Your order has been received",
    text: `Thank you for your order ${order.firstName || ""}. Your order ID is ${order.trackingId || "N/A"}.`,
    html: buildCustomerConfirmationHtml(order),
  };

  const results = await Promise.allSettled([
    resend.emails.send(adminPayload),
    resend.emails.send(customerPayload),
  ]);

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(`Order email notification ${index === 0 ? "to admin" : "to customer"} failed:`, result.reason);
    }
  });
};

export const mailSender = {
  sendEmailWithPDF,
  sendNewOrderNotifications,
};
