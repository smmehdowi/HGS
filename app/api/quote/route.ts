import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import type { DocumentProps } from '@react-pdf/renderer';
import { sendEmail, buildQuoteEmail, sendCustomerQuoteEmail } from '@/lib/send-email';
import { QuotePDF } from '@/lib/quote-pdf';
import { getDaftraSettings } from '@/lib/config-store';
import { submitQuoteToDaftra } from '@/lib/daftra';

export const runtime = 'nodejs';

function generateQuoteRef(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HGS-${date}-${rand}`;
}

// Manual date formatter — avoids relying on ar-SA ICU locale which is absent
// in Railway's default Node.js (small-icu) build and renders as symbols.
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

function formatDate(d: Date, locale: string): { date: string; time: string } {
  // Asia/Riyadh is UTC+3, no DST — add 3 h to UTC to get local time
  const riyadhMs = d.getTime() + 3 * 60 * 60 * 1000;
  const r   = new Date(riyadhMs);
  const day = r.getUTCDate();
  const hh  = String(r.getUTCHours()).padStart(2, '0');
  const mm  = String(r.getUTCMinutes()).padStart(2, '0');
  const months = locale === 'ar' ? MONTHS_AR : MONTHS_EN;
  return {
    date: `${day} ${months[r.getUTCMonth()]} ${r.getUTCFullYear()}`,
    time: `${hh}:${mm}`,
  };
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const quoteRef = generateQuoteRef();
  const locale: string = data.locale ?? 'en';

  // Build normalised product list (shared by Daftra + PDF paths)
  type RawProduct = { id?: string; type: string; nameEn: string; nameAr?: string; quantity?: string; dimensions?: string; thickness?: string; finish?: string; pricePerM2?: number };
  const rawProducts: RawProduct[] = data.products
    ?? (data.stoneType ? [{ type: data.stoneType, nameEn: data.variety || data.stoneType, nameAr: data.variety || data.stoneType }] : []);

  const products = rawProducts.map(p => ({
    id:          p.id ?? p.nameEn,
    nameEn:      p.nameEn,
    nameAr:      p.nameAr,
    type:        p.type,
    quantity:    p.quantity,
    dimensions:  p.dimensions,
    thickness:   p.thickness,
    finish:      p.finish,
    pricePerM2:  p.pricePerM2,
  }));

  // ── Daftra path ────────────────────────────────────────────────────────────
  let daftraError: string | undefined;
  const daftra = await getDaftraSettings();
  if (daftra.enabled && daftra.apiKey && daftra.subdomain) {
    const daftraResult = await submitQuoteToDaftra(
      daftra,
      {
        name:    data.name    ?? '',
        email:   data.email   ?? '',
        phone:   data.phone   ?? '',
        company: data.company ?? '',
      },
      {
        type:     data.projectType ?? '',
        city:     data.city        ?? '',
        timeline: data.timeline    ?? '',
      },
      products,
      quoteRef,
    );

    if (daftraResult.ok) {
      // Admin email — no PDF attachment in Daftra mode
      const adminResult = await sendEmail(buildQuoteEmail(data));
      if (!adminResult.ok && adminResult.error) console.error('[quote] Admin email failed:', adminResult.error);

      // Customer confirmation email (no PDF — Daftra manages the quote document)
      if (data.email) {
        const customerResult = await sendCustomerQuoteEmail(data.email, data.name ?? 'Customer', quoteRef);
        if (!customerResult.ok) console.error('[quote] Customer email failed:', customerResult.error);
      }

      return NextResponse.json({ ok: true, quoteRef, pdfBase64: null });
    }

    // Daftra failed — log and fall through to PDF fallback
    daftraError = daftraResult.error;
    console.error('[quote] Daftra submission failed, falling back to PDF:', daftraError);
  }

  // ── PDF fallback path ──────────────────────────────────────────────────────
  let pdfBuffer: Buffer | null = null;
  try {
    // QuotePDF returns <Document> at its root; cast required due to @react-pdf/renderer type constraints
    const { date: dateStr, time: timeStr } = formatDate(new Date(), locale);
    const pdfElement = React.createElement(QuotePDF, {
      locale,
      quoteRef,
      date: dateStr,
      time: timeStr,
      customer: {
        name:    data.name    ?? '',
        company: data.company ?? '',
        phone:   data.phone   ?? '',
        email:   data.email   ?? '',
      },
      project: {
        type:     data.projectType ?? '',
        city:     data.city        ?? '',
        timeline: data.timeline    ?? '',
      },
      products,
      vatPercent: 15,
    }) as React.ReactElement<DocumentProps>;
    pdfBuffer = await renderToBuffer(pdfElement);
  } catch (e) {
    console.error('[quote] PDF generation failed:', e);
  }

  // Admin email — with PDF attached if generated
  const emailOpts     = buildQuoteEmail(data);
  const adminEmailOpts = pdfBuffer
    ? { ...emailOpts, attachments: [{ filename: `${quoteRef}.pdf`, content: pdfBuffer }] }
    : emailOpts;
  const adminResult = await sendEmail(adminEmailOpts);
  if (!adminResult.ok && adminResult.error) console.error('[quote] Admin email failed:', adminResult.error);

  // Customer email — send whenever they provide an email; attach PDF only if generated
  if (data.email) {
    const customerResult = await sendCustomerQuoteEmail(
      data.email,
      data.name ?? 'Customer',
      quoteRef,
      pdfBuffer ?? undefined,
    );
    if (!customerResult.ok) console.error('[quote] Customer email failed:', customerResult.error);
  }

  return NextResponse.json({
    ok: true,
    quoteRef,
    pdfBase64: pdfBuffer ? pdfBuffer.toString('base64') : null,
    ...(daftraError ? { daftraError } : {}),
  });
}
