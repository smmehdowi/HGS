import { Resend } from 'resend';
import { getEmailSettings } from './config-store';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOptions {
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(opts: SendOptions): Promise<{ ok: boolean; error?: string }> {
  const settings = await getEmailSettings();

  if (!settings.enabled) return { ok: true }; // silently skip if disabled
  if (!settings.toEmail) return { ok: false, error: 'No recipient email configured' };
  if (!process.env.RESEND_API_KEY) return { ok: false, error: 'RESEND_API_KEY not set' };

  const to = [settings.toEmail];
  if (settings.ccEmail) to.push(settings.ccEmail);

  const { error } = await resend.emails.send({
    from: `${settings.fromName} <onboarding@resend.dev>`,
    to,
    replyTo: opts.replyTo,
    subject: opts.subject,
    html: opts.html,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

function row(label: string, value: string) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:8px 12px;font-weight:600;color:#555;white-space:nowrap;border-bottom:1px solid #f0ece8;">${label}</td>
      <td style="padding:8px 12px;color:#1a1a1a;border-bottom:1px solid #f0ece8;">${value}</td>
    </tr>`;
}

function emailWrapper(title: string, badge: string, tableRows: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
    <!-- Header -->
    <div style="background:#0d5e37;padding:28px 32px;">
      <div style="color:#fff;font-size:20px;font-weight:700;letter-spacing:.5px;">Himalayan Gulf Stones</div>
      <div style="color:#ffffff99;font-size:13px;margin-top:2px;">himalayangulfstones.com</div>
    </div>
    <!-- Badge + title -->
    <div style="padding:24px 32px 0;">
      <span style="background:#0d5e3715;color:#0d5e37;font-size:12px;font-weight:700;letter-spacing:1px;padding:4px 10px;border-radius:20px;text-transform:uppercase;">${badge}</span>
      <h2 style="margin:12px 0 0;font-size:22px;color:#1a1a1a;">${title}</h2>
    </div>
    <!-- Table -->
    <div style="padding:20px 32px 28px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #f0ece8;border-radius:8px;overflow:hidden;">
        ${tableRows}
      </table>
    </div>
    <!-- Footer -->
    <div style="background:#f5f0eb;padding:16px 32px;font-size:12px;color:#8a8279;border-top:1px solid #e8ddd0;">
      This message was sent via the website contact form at himalayangulfstones.com
    </div>
  </div>
</body>
</html>`;
}

export function buildQuoteEmail(data: {
  products?: Array<{ type: string; nameEn: string }>;
  // legacy single-product fields (kept for backwards compat)
  stoneType?: string; variety?: string;
  quantity: string; dimensions: string;
  thickness: string; finish: string; projectType: string; city: string;
  timeline: string; name: string; company: string; phone: string;
  email: string; contactMethod: string;
}) {
  // Build products section
  const productList = data.products && data.products.length > 0
    ? data.products
    : data.stoneType
      ? [{ type: data.stoneType, nameEn: data.variety || data.stoneType }]
      : [];

  const productsHtml = productList.length > 1
    ? `<tr>
        <td style="padding:8px 12px;font-weight:600;color:#555;vertical-align:top;border-bottom:1px solid #f0ece8;">Products Requested</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0ece8;">
          ${productList.map((p, i) => `<div style="margin-bottom:4px;">${i + 1}. <strong>${p.nameEn}</strong> <span style="color:#8a8279;font-size:12px;text-transform:capitalize;">(${p.type})</span></div>`).join('')}
        </td>
      </tr>`
    : row('Product', productList[0] ? `${productList[0].nameEn} (${productList[0].type})` : '');

  const rows =
    productsHtml +
    row('Quantity (m²)', data.quantity) +
    row('Dimensions', data.dimensions) +
    row('Thickness', data.thickness) +
    row('Finish', data.finish) +
    row('Project Type', data.projectType) +
    row('City', data.city) +
    row('Timeline', data.timeline) +
    '<tr><td colspan="2" style="padding:4px;"></td></tr>' +
    row('Name', data.name) +
    row('Company', data.company) +
    row('Phone', data.phone) +
    row('Email', data.email) +
    row('Preferred Contact', data.contactMethod);

  const productSummary = productList.length > 1
    ? `${productList.length} Products`
    : productList[0]?.nameEn || 'Stone';

  return {
    subject: `New Quote Request — ${productSummary} — ${data.name}`,
    html: emailWrapper('New Quote Request', 'Quote', rows),
    replyTo: data.email || undefined,
  };
}

export function buildContactEmail(data: {
  name: string; email: string; phone: string;
  company: string; city: string; message: string;
}) {
  const rows =
    row('Name', data.name) +
    row('Email', data.email) +
    row('Phone', data.phone) +
    row('Company', data.company) +
    row('City', data.city) +
    `<tr>
      <td style="padding:8px 12px;font-weight:600;color:#555;vertical-align:top;border-bottom:1px solid #f0ece8;">Message</td>
      <td style="padding:8px 12px;color:#1a1a1a;border-bottom:1px solid #f0ece8;white-space:pre-wrap;">${data.message}</td>
    </tr>`;

  return {
    subject: `New Contact Message — ${data.name}`,
    html: emailWrapper('New Contact Message', 'Contact', rows),
    replyTo: data.email || undefined,
  };
}
