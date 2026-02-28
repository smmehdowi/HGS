import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { sendEmail, buildQuoteEmail, sendCustomerQuoteEmail } from '@/lib/send-email';
import { sendWhatsAppText } from '@/lib/send-whatsapp';
import { QuotePDF } from '@/lib/quote-pdf';

export const runtime = 'nodejs';

function generateQuoteRef(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HGS-${date}-${rand}`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const quoteRef = generateQuoteRef();

  // Build product list for PDF
  const pdfProducts = (
    data.products ?? (data.stoneType ? [{ type: data.stoneType, nameEn: data.variety || data.stoneType }] : [])
  ).map((p: { type: string; nameEn: string; quantity?: string; dimensions?: string; thickness?: string; finish?: string; pricePerM2?: number }) => ({
    nameEn: p.nameEn,
    type: p.type,
    quantity: p.quantity,
    dimensions: p.dimensions,
    thickness: p.thickness,
    finish: p.finish,
    pricePerM2: p.pricePerM2,
  }));

  // Generate PDF buffer
  let pdfBuffer: Buffer | null = null;
  try {
    pdfBuffer = await renderToBuffer(
      React.createElement(QuotePDF, {
        quoteRef,
        date: formatDate(new Date()),
        customer: {
          name: data.name ?? '',
          company: data.company ?? '',
          phone: data.phone ?? '',
          email: data.email ?? '',
        },
        project: {
          type: data.projectType ?? '',
          city: data.city ?? '',
          timeline: data.timeline ?? '',
        },
        products: pdfProducts,
        vatPercent: 15,
      })
    );
  } catch (e) {
    console.error('[quote] PDF generation failed:', e);
  }

  // 1. Admin email — with PDF attached if generated
  const emailOpts = buildQuoteEmail(data);
  const adminEmailOpts = pdfBuffer
    ? { ...emailOpts, attachments: [{ filename: `${quoteRef}.pdf`, content: pdfBuffer }] }
    : emailOpts;
  const adminResult = await sendEmail(adminEmailOpts);
  if (!adminResult.ok && adminResult.error) console.error('[quote] Admin email failed:', adminResult.error);

  // 2. Customer email — if they provided an email and PDF was generated
  if (data.email && pdfBuffer) {
    const customerResult = await sendCustomerQuoteEmail(data.email, data.name ?? 'Customer', quoteRef, pdfBuffer);
    if (!customerResult.ok) console.error('[quote] Customer email failed:', customerResult.error);
  }

  // 3. WhatsApp notification — if customer chose WhatsApp as contact method
  if (data.contactMethod === 'whatsapp' && data.phone) {
    const emailNote = data.email ? ` Your PDF quote has been sent to ${data.email}.` : '';
    const msg = `Dear ${data.name ?? 'Customer'},\n\nThank you for your quote request from Himalayan Gulf Stones.\n\nQuote Reference: ${quoteRef}\n\nOur team will review your requirements and contact you within 24 hours.${emailNote}\n\nHimalayan Gulf Stones\nhimalayangulfstones.com`;
    const waResult = await sendWhatsAppText(data.phone, msg);
    if (!waResult.ok) console.error('[quote] WhatsApp failed:', waResult.error);
  }

  return NextResponse.json({
    ok: true,
    quoteRef,
    pdfBase64: pdfBuffer ? pdfBuffer.toString('base64') : null,
  });
}
