import React from 'react';
import path from 'path';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const _fontsDir = path.join(process.cwd(), 'public', 'fonts');

Font.register({
  family: 'Cairo',
  fonts: [
    { src: path.join(_fontsDir, 'cairo-400.ttf'), fontWeight: 400 },
    { src: path.join(_fontsDir, 'cairo-700.ttf'), fontWeight: 700 },
  ],
});

const GREEN    = '#0d5e37';
const SAND     = '#e8ddd0';
const GRAY     = '#8a8279';
const DARK     = '#1a1a1a';
const LIGHT_BG = '#f5f0eb';
const ROW_ALT  = '#faf9f7';

const styles = StyleSheet.create({
  page:          { fontFamily: 'Helvetica', fontSize: 9, color: DARK, paddingBottom: 40 },
  header:        { backgroundColor: GREEN, paddingVertical: 20, paddingHorizontal: 32 },
  headerCompany: { color: '#fff', fontSize: 18, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
  headerSub:     { color: '#ffffff99', fontSize: 9, marginTop: 2 },
  body:          { paddingHorizontal: 32, paddingTop: 20 },
  titleRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  titleText:     { fontSize: 16, fontFamily: 'Helvetica-Bold', color: DARK },
  refBox:        { backgroundColor: '#0d5e3720', borderRadius: 12, paddingVertical: 3, paddingHorizontal: 10 },
  refText:       { color: GREEN, fontSize: 9, fontFamily: 'Helvetica-Bold' },
  dateText:      { color: GRAY, fontSize: 8, marginTop: 3, textAlign: 'right' },
  section:       { marginBottom: 14 },
  sectionTitle:  {
    fontSize: 9, fontFamily: 'Helvetica-Bold', color: GREEN,
    borderBottomWidth: 1, borderBottomColor: SAND,
    paddingBottom: 3, marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  infoRow:       { flexDirection: 'row', marginBottom: 3 },
  infoLabel:     { width: 110, color: GRAY, fontSize: 8.5 },
  infoValue:     { flex: 1, fontSize: 8.5 },
  tableHeader:   {
    flexDirection: 'row', backgroundColor: LIGHT_BG,
    paddingVertical: 5, paddingHorizontal: 6,
    borderTopLeftRadius: 4, borderTopRightRadius: 4,
  },
  tableRow:      { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: '#f0ece8' },
  thText:        { fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#555' },
  tdText:        { fontSize: 8.5 },
  tdSub:         { fontSize: 7.5, color: GRAY, marginTop: 1 },
  colNum:        { width: 18 },
  colName:       { flex: 2 },
  colSpecs:      { flex: 2 },
  colQty:        { width: 45, textAlign: 'right' },
  colPrice:      { width: 60, textAlign: 'right' },
  colTotal:      { width: 65, textAlign: 'right' },
  totalsBox:     { alignItems: 'flex-end', marginTop: 8 },
  totalsRow:     { flexDirection: 'row', marginBottom: 3 },
  totalsLabel:   { width: 110, textAlign: 'right', color: GRAY, fontSize: 8.5, paddingRight: 6 },
  totalsValue:   { width: 75, textAlign: 'right', fontSize: 8.5 },
  divider:       { width: 185, borderTopWidth: 1, borderTopColor: SAND, marginBottom: 5, marginTop: 3 },
  grandLabel:    { fontFamily: 'Helvetica-Bold', color: GREEN, fontSize: 11 },
  grandValue:    { fontFamily: 'Helvetica-Bold', color: GREEN, fontSize: 11 },
  footer:        {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: LIGHT_BG, paddingVertical: 10, paddingHorizontal: 32,
    borderTopWidth: 1, borderTopColor: SAND,
  },
  footerText:    { color: GRAY, fontSize: 7.5, textAlign: 'center', lineHeight: 1.5 },
  noPriceNote:   {
    backgroundColor: '#fff8e1', borderRadius: 4, paddingVertical: 6, paddingHorizontal: 10,
    marginTop: 8, borderLeftWidth: 3, borderLeftColor: '#f0a800',
  },
  noPriceText:   { color: '#7a5000', fontSize: 8, lineHeight: 1.5 },
});

const LABELS = {
  en: {
    title: 'Quote Summary',
    customer: 'Customer Information',
    name: 'Name', company: 'Company', phone: 'Phone', email: 'Email',
    project: 'Project Details',
    projectType: 'Project Type', city: 'City', timeline: 'Timeline',
    products: 'Products Requested',
    product: 'Product', specs: 'Specifications',
    qty: 'Qty m\u00B2', price: 'Price/m\u00B2', total: 'Total',
    pricing: 'Pricing Summary',
    subtotal: 'Subtotal (excl. VAT)', vat: 'VAT', grandTotal: 'Total (incl. VAT)',
    noPriceNote: 'Pricing: Our team will review your specifications and send a detailed price confirmation within 24 hours.',
    footer: 'This quote is valid for 30 days from the date of issue. Prices are indicative and subject to final confirmation upon review.\nHimalayan Gulf Stones \u00B7 himalayangulfstones.com \u00B7 All prices in Saudi Riyals (SAR) \u00B7 VAT 15% included',
    tbd: 'TBD',
  },
  ar: {
    title: '\u0645\u0644\u062e\u0635 \u0627\u0644\u0639\u0631\u0636',
    customer: '\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0639\u0645\u064a\u0644',
    name: '\u0627\u0644\u0627\u0633\u0645', company: '\u0627\u0644\u0634\u0631\u0643\u0629',
    phone: '\u0627\u0644\u0647\u0627\u062a\u0641', email: '\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a',
    project: '\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0645\u0634\u0631\u0648\u0639',
    projectType: '\u0646\u0648\u0639 \u0627\u0644\u0645\u0634\u0631\u0648\u0639',
    city: '\u0627\u0644\u0645\u062f\u064a\u0646\u0629', timeline: '\u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064a',
    products: '\u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629',
    product: '\u0627\u0644\u0645\u0646\u062a\u062c', specs: '\u0627\u0644\u0645\u0648\u0627\u0635\u0641\u0627\u062a',
    qty: '\u0627\u0644\u0643\u0645\u064a\u0629 \u0645\u00b2', price: '\u0627\u0644\u0633\u0639\u0631/\u0645\u00b2', total: '\u0627\u0644\u0645\u062c\u0645\u0648\u0639',
    pricing: '\u0645\u0644\u062e\u0635 \u0627\u0644\u062a\u0633\u0639\u064a\u0631',
    subtotal: '\u0627\u0644\u0645\u062c\u0645\u0648\u0639 \u0627\u0644\u0641\u0631\u0639\u064a (\u0628\u062f\u0648\u0646 \u0636\u0631\u064a\u0628\u0629)',
    vat: '\u0636\u0631\u064a\u0628\u0629 \u0627\u0644\u0642\u064a\u0645\u0629 \u0627\u0644\u0645\u0636\u0627\u0641\u0629',
    grandTotal: '\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a (\u0634\u0627\u0645\u0644 \u0627\u0644\u0636\u0631\u064a\u0628\u0629)',
    noPriceNote: '\u0627\u0644\u062a\u0633\u0639\u064a\u0631: \u0633\u064a\u0631\u0627\u062c\u0639 \u0641\u0631\u064a\u0642\u0646\u0627 \u0645\u0648\u0627\u0635\u0641\u0627\u062a\u0643 \u0648\u064a\u0631\u0633\u0644 \u062a\u0623\u0643\u064a\u062f\u0627\u064b \u062a\u0641\u0635\u064a\u0644\u064a\u0627\u064b \u0644\u0644\u0623\u0633\u0639\u0627\u0631 \u062e\u0644\u0627\u0644 24 \u0633\u0627\u0639\u0629.',
    footer: '\u0647\u0630\u0627 \u0627\u0644\u0639\u0631\u0636 \u0635\u0627\u0644\u062d \u0644\u0645\u062f\u0629 30 \u064a\u0648\u0645\u0627\u064b \u0645\u0646 \u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0625\u0635\u062f\u0627\u0631. \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0627\u0633\u062a\u0631\u0634\u0627\u062f\u064a\u0629 \u0648\u062a\u062e\u0636\u0639 \u0644\u0644\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0646\u0647\u0627\u0626\u064a.\nHimalayan Gulf Stones \u00b7 himalayangulfstones.com \u00b7 \u062c\u0645\u064a\u0639 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0628\u0627\u0644\u0631\u064a\u0627\u0644 \u0627\u0644\u0633\u0639\u0648\u062f\u064a (SAR) \u00b7 \u0636\u0631\u064a\u0628\u0629 \u0627\u0644\u0642\u064a\u0645\u0629 \u0627\u0644\u0645\u0636\u0627\u0641\u0629 15%',
    tbd: '\u064a\u062d\u062f\u062f \u0644\u0627\u062d\u0642\u0627\u064b',
  },
} as const;

function fmt(n: number): string {
  return `SAR ${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export interface QuotePDFProduct {
  nameEn: string;
  nameAr?: string;
  type: string;
  quantity?: string;
  dimensions?: string;
  thickness?: string;
  finish?: string;
  pricePerM2?: number;
}

export interface QuotePDFProps {
  locale?: string;
  quoteRef: string;
  date: string;
  customer: { name: string; company: string; phone: string; email: string };
  project: { type: string; city: string; timeline: string };
  products: QuotePDFProduct[];
  vatPercent: number;
}

export function QuotePDF({ locale, quoteRef, date, customer, project, products, vatPercent }: QuotePDFProps) {
  const isAr = locale === 'ar';
  const L    = isAr ? LABELS.ar : LABELS.en;

  // Cairo font covers Arabic + Latin; direction:'rtl' ensures correct Arabic letter shaping
  const af     = isAr ? { fontFamily: 'Cairo' as const, fontWeight: 400 as const, direction: 'rtl' as const } : {};
  const afBold = isAr ? { fontFamily: 'Cairo' as const, fontWeight: 700 as const, direction: 'rtl' as const } : {};

  // RTL layout — flip rows and text alignment for Arabic
  const rowDir  = isAr ? { flexDirection: 'row-reverse' as const } : {};
  const rtlText = isAr ? { textAlign: 'right' as const } : {};
  // Number columns: stay right-aligned in LTR; in RTL (row-reverse) they're on the left, align left there
  const numAlign = isAr ? { textAlign: 'left' as const } : {};

  const lineItems = products.map(p => {
    const qty  = parseFloat(p.quantity || '0') || 0;
    const price = p.pricePerM2 || 0;
    const displayName = isAr && p.nameAr ? p.nameAr : p.nameEn;
    return { ...p, qty, price, total: qty * price, displayName };
  });

  const grandTotal = lineItems.reduce((s, li) => s + li.total, 0);
  const subtotal   = Math.round(grandTotal / (1 + vatPercent / 100));
  const vat        = grandTotal - subtotal;
  const hasPrice   = lineItems.some(li => li.price > 0);
  const hasTotals  = hasPrice && grandTotal > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Header ── */}
        <View style={[styles.header, isAr ? { alignItems: 'flex-end' } : {}]}>
          {isAr ? (
            <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'Cairo', fontWeight: 700, direction: 'rtl', textAlign: 'right' }}>
              {'هيمالايان غالف ستونز  |  Himalayan Gulf Stones'}
            </Text>
          ) : (
            <Text style={styles.headerCompany}>Himalayan Gulf Stones</Text>
          )}
          <Text style={[styles.headerSub, rtlText]}>himalayangulfstones.com</Text>
        </View>

        <View style={styles.body}>

          {/* ── Title + Reference ──
              LTR: [Title .................. Ref]
              RTL (row-reverse): [Ref .................. Title]  */}
          <View style={[styles.titleRow, rowDir]}>
            <Text style={[styles.titleText, afBold, rtlText]}>{L.title}</Text>
            <View style={{ alignItems: isAr ? 'flex-start' : 'flex-end' }}>
              <View style={styles.refBox}>
                <Text style={styles.refText}>{quoteRef}</Text>
              </View>
              <Text style={[styles.dateText, isAr ? { textAlign: 'left' } : {}]}>{date}</Text>
            </View>
          </View>

          {/* ── Customer Information ── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, afBold, isAr ? { fontFamily: 'Cairo', direction: 'rtl', textAlign: 'right' } : {}]}>{L.customer}</Text>
            {customer.name    ? <InfoRow label={L.name}    value={customer.name}    isAr={isAr} af={af} rowDir={rowDir} rtlText={rtlText} /> : null}
            {customer.company ? <InfoRow label={L.company} value={customer.company} isAr={isAr} af={af} rowDir={rowDir} rtlText={rtlText} /> : null}
            {customer.phone   ? <InfoRow label={L.phone}   value={customer.phone}   isAr={isAr} af={af} rowDir={rowDir} rtlText={rtlText} /> : null}
            {customer.email   ? <InfoRow label={L.email}   value={customer.email}   isAr={isAr} af={af} rowDir={rowDir} rtlText={rtlText} /> : null}
          </View>

          {/* ── Project Details ── */}
          {(project.type || project.city || project.timeline) ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, afBold, isAr ? { fontFamily: 'Cairo', direction: 'rtl', textAlign: 'right' } : {}]}>{L.project}</Text>
              {project.type     ? <InfoRow label={L.projectType} value={project.type}     isAr={isAr} af={af} rowDir={rowDir} rtlText={rtlText} /> : null}
              {project.city     ? <InfoRow label={L.city}        value={project.city}     isAr={isAr} af={af} rowDir={rowDir} rtlText={rtlText} /> : null}
              {project.timeline ? <InfoRow label={L.timeline}    value={project.timeline} isAr={isAr} af={af} rowDir={rowDir} rtlText={rtlText} /> : null}
            </View>
          ) : null}

          {/* ── Products Table ──
              LTR columns: [#] [Product] [Specs] [Qty] [Price] [Total]
              RTL columns (row-reverse): [Total] [Price] [Qty] [Specs] [Product] [#]
              So reading right-to-left: # | Product | Specs | Qty | Price | Total  ✓ */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, afBold, isAr ? { fontFamily: 'Cairo', direction: 'rtl', textAlign: 'right' } : {}]}>{L.products}</Text>
            <View style={[styles.tableHeader, rowDir]}>
              <Text style={[styles.thText, styles.colNum]}>#</Text>
              <Text style={[styles.thText, styles.colName,  af, rtlText]}>{L.product}</Text>
              <Text style={[styles.thText, styles.colSpecs, af, rtlText]}>{L.specs}</Text>
              <Text style={[styles.thText, styles.colQty,   af, numAlign]}>{L.qty}</Text>
              {hasPrice ? <Text style={[styles.thText, styles.colPrice, af, numAlign]}>{L.price}</Text> : null}
              {hasPrice ? <Text style={[styles.thText, styles.colTotal, af, numAlign]}>{L.total}</Text> : null}
            </View>
            {lineItems.map((item, i) => {
              const specs = [item.dimensions, item.thickness, item.finish].filter(Boolean).join(' · ');
              return (
                <View key={i} style={[styles.tableRow, rowDir, i % 2 === 1 ? { backgroundColor: ROW_ALT } : {}]}>
                  <Text style={[styles.tdText, styles.colNum]}>{i + 1}</Text>
                  <View style={styles.colName}>
                    <Text style={[styles.tdText, af, isAr ? { fontWeight: 700 } : { fontFamily: 'Helvetica-Bold' }, rtlText]}>
                      {item.displayName}
                    </Text>
                    <Text style={[styles.tdSub, af, rtlText]}>{item.type}</Text>
                  </View>
                  <Text style={[styles.tdText, styles.colSpecs, { color: '#555' }, af, rtlText]}>{specs || '—'}</Text>
                  <Text style={[styles.tdText, styles.colQty,   af, numAlign]}>{item.qty > 0 ? String(item.qty) : '—'}</Text>
                  {hasPrice ? <Text style={[styles.tdText, styles.colPrice, af, numAlign]}>{item.price > 0 ? fmt(item.price) : L.tbd}</Text> : null}
                  {hasPrice ? <Text style={[styles.tdText, styles.colTotal, af, numAlign]}>{item.total > 0 ? fmt(item.total) : L.tbd}</Text> : null}
                </View>
              );
            })}
          </View>

          {/* ── Pricing Summary ── */}
          {hasTotals ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, afBold, isAr ? { fontFamily: 'Cairo', direction: 'rtl', textAlign: 'right' } : {}]}>{L.pricing}</Text>
              {/* LTR: aligned to right edge. RTL: aligned to left edge (the visual "end"). */}
              <View style={[styles.totalsBox, isAr ? { alignItems: 'flex-start' } : {}]}>
                <View style={[styles.totalsRow, rowDir]}>
                  <Text style={[styles.totalsLabel, af, isAr ? { textAlign: 'left', paddingRight: 0, paddingLeft: 6 } : {}]}>{L.subtotal}</Text>
                  <Text style={[styles.totalsValue, af, numAlign]}>{fmt(subtotal)}</Text>
                </View>
                <View style={[styles.totalsRow, rowDir]}>
                  <Text style={[styles.totalsLabel, af, isAr ? { textAlign: 'left', paddingRight: 0, paddingLeft: 6 } : {}]}>{L.vat} ({vatPercent}%)</Text>
                  <Text style={[styles.totalsValue, af, numAlign]}>{fmt(vat)}</Text>
                </View>
                <View style={[styles.divider, isAr ? { alignSelf: 'flex-start' } : {}]} />
                <View style={[styles.totalsRow, rowDir]}>
                  <Text style={[styles.totalsLabel, styles.grandLabel, afBold, isAr ? { textAlign: 'left', paddingRight: 0, paddingLeft: 6 } : {}]}>{L.grandTotal}</Text>
                  <Text style={[styles.totalsValue, styles.grandValue, afBold, numAlign]}>{fmt(grandTotal)}</Text>
                </View>
              </View>
            </View>
          ) : hasPrice ? null : (
            <View style={[styles.noPriceNote, isAr ? { borderLeftWidth: 0, borderRightWidth: 3, borderRightColor: '#f0a800' } : {}]}>
              <Text style={[styles.noPriceText, af, rtlText]}>{L.noPriceNote}</Text>
            </View>
          )}

        </View>

        {/* ── Footer ── */}
        <View style={styles.footer} fixed>
          <Text style={[styles.footerText, af]}>{L.footer}</Text>
        </View>

      </Page>
    </Document>
  );
}

// Reusable info row — label on right / value on left in Arabic
function InfoRow({ label, value, isAr, af, rowDir, rtlText }: {
  label: string; value: string; isAr: boolean;
  af: object; rowDir: object; rtlText: object;
}) {
  return (
    <View style={[styles.infoRow, rowDir]}>
      <Text style={[styles.infoLabel, af, rtlText]}>{label}</Text>
      <Text style={[styles.infoValue, af, isAr ? { textAlign: 'right' } : {}]}>{value}</Text>
    </View>
  );
}
