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

function formatDate(d: Date, locale: string): string {
  const lang = locale === 'ar' ? 'ar-SA' : 'en-GB';
  const datePart = d.toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' });
  const timePart = d.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
  return `${datePart}  ·  ${timePart}`;
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
    const pdfElement = React.createElement(QuotePDF, {
      locale,
      quoteRef,
      date: formatDate(new Date(), locale),
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
