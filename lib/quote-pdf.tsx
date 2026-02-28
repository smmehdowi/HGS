import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register Cairo font (includes Arabic + Latin glyphs) for bilingual PDF support
// No version pin — jsDelivr resolves to the latest published @fontsource/cairo
Font.register({
  family: 'Cairo',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/cairo/files/cairo-arabic-400-normal.woff2', fontWeight: 400 },
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/cairo/files/cairo-arabic-700-normal.woff2', fontWeight: 700 },
  ],
});

const GREEN = '#0d5e37';
const SAND = '#e8ddd0';
const GRAY = '#8a8279';
const DARK = '#1a1a1a';
const LIGHT_BG = '#f5f0eb';
const ROW_ALT = '#faf9f7';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: DARK,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: GREEN,
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
  headerCompany: { color: '#fff', fontSize: 18, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
  headerSub: { color: '#ffffff99', fontSize: 9, marginTop: 2 },
  body: { paddingHorizontal: 32, paddingTop: 20 },
  // Title row
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  titleText: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: DARK },
  refBox: { backgroundColor: '#0d5e3720', borderRadius: 12, paddingVertical: 3, paddingHorizontal: 10 },
  refText: { color: GREEN, fontSize: 9, fontFamily: 'Helvetica-Bold' },
  dateText: { color: GRAY, fontSize: 8, marginTop: 3, textAlign: 'right' },
  // Sections
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 9, fontFamily: 'Helvetica-Bold', color: GREEN,
    borderBottomWidth: 1, borderBottomColor: SAND,
    paddingBottom: 3, marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  infoRow: { flexDirection: 'row', marginBottom: 3 },
  infoLabel: { width: 90, color: GRAY, fontSize: 8.5 },
  infoValue: { flex: 1, fontSize: 8.5 },
  // Table
  tableHeader: {
    flexDirection: 'row', backgroundColor: LIGHT_BG,
    paddingVertical: 5, paddingHorizontal: 6,
    borderTopLeftRadius: 4, borderTopRightRadius: 4,
  },
  tableRow: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: '#f0ece8' },
  thText: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#555' },
  tdText: { fontSize: 8.5 },
  tdSub: { fontSize: 7.5, color: GRAY, marginTop: 1 },
  // Column widths
  colNum: { width: 18 },
  colName: { flex: 2 },
  colSpecs: { flex: 2 },
  colQty: { width: 45, textAlign: 'right' },
  colPrice: { width: 60, textAlign: 'right' },
  colTotal: { width: 65, textAlign: 'right' },
  // Totals
  totalsContainer: { alignItems: 'flex-end', marginTop: 8 },
  totalsRow: { flexDirection: 'row', marginBottom: 3 },
  totalsLabel: { width: 90, textAlign: 'right', color: GRAY, fontSize: 8.5, paddingRight: 6 },
  totalsValue: { width: 75, textAlign: 'right', fontSize: 8.5 },
  divider: { width: 165, borderTopWidth: 1, borderTopColor: SAND, marginBottom: 5, marginTop: 3 },
  grandLabel: { fontFamily: 'Helvetica-Bold', color: GREEN, fontSize: 11 },
  grandValue: { fontFamily: 'Helvetica-Bold', color: GREEN, fontSize: 11 },
  // Footer
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: LIGHT_BG, paddingVertical: 10, paddingHorizontal: 32,
    borderTopWidth: 1, borderTopColor: SAND,
  },
  footerText: { color: GRAY, fontSize: 7.5, textAlign: 'center', lineHeight: 1.5 },
  noPriceNote: {
    backgroundColor: '#fff8e1', borderRadius: 4, paddingVertical: 6, paddingHorizontal: 10,
    marginTop: 8, borderLeftWidth: 3, borderLeftColor: '#f0a800',
  },
  noPriceText: { color: '#7a5000', fontSize: 8, lineHeight: 1.5 },
});

// Labels for each locale
const LABELS = {
  en: {
    title: 'Quote Summary',
    customer: 'Customer Information',
    name: 'Name',
    company: 'Company',
    phone: 'Phone',
    email: 'Email',
    project: 'Project Details',
    projectType: 'Project Type',
    city: 'City',
    timeline: 'Timeline',
    products: 'Products Requested',
    product: 'Product',
    specs: 'Specifications',
    qty: 'Qty m\u00B2',
    price: 'Price/m\u00B2',
    total: 'Total',
    pricing: 'Pricing Summary',
    subtotal: 'Subtotal (excl. VAT)',
    vat: 'VAT',
    grandTotal: 'Total (incl. VAT)',
    noPriceNote: 'Pricing: Our team will review your specifications and send a detailed price confirmation within 24 hours.',
    footer: 'This quote is valid for 30 days from the date of issue. Prices are indicative and subject to final confirmation upon review.\nHimalayan Gulf Stones \u00B7 himalayangulfstones.com \u00B7 All prices in Saudi Riyals (SAR) \u00B7 VAT 15% included',
    tbd: 'TBD',
  },
  ar: {
    title: '\u0645\u0644\u062E\u0635 \u0627\u0644\u0639\u0631\u0636',
    customer: '\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0639\u0645\u064A\u0644',
    name: '\u0627\u0644\u0627\u0633\u0645',
    company: '\u0627\u0644\u0634\u0631\u0643\u0629',
    phone: '\u0627\u0644\u0647\u0627\u062A\u0641',
    email: '\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A',
    project: '\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0634\u0631\u0648\u0639',
    projectType: '\u0646\u0648\u0639 \u0627\u0644\u0645\u0634\u0631\u0648\u0639',
    city: '\u0627\u0644\u0645\u062F\u064A\u0646\u0629',
    timeline: '\u0627\u0644\u062C\u062F\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064A',
    products: '\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629',
    product: '\u0627\u0644\u0645\u0646\u062A\u062C',
    specs: '\u0627\u0644\u0645\u0648\u0627\u0635\u0641\u0627\u062A',
    qty: '\u0627\u0644\u0643\u0645\u064A\u0629 \u0645\u00B2',
    price: '\u0627\u0644\u0633\u0639\u0631/\u0645\u00B2',
    total: '\u0627\u0644\u0645\u062C\u0645\u0648\u0639',
    pricing: '\u0645\u0644\u062E\u0635 \u0627\u0644\u062A\u0633\u0639\u064A\u0631',
    subtotal: '\u0627\u0644\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0641\u0631\u0639\u064A (\u0628\u062F\u0648\u0646 \u0636\u0631\u064A\u0628\u0629)',
    vat: '\u0636\u0631\u064A\u0628\u0629 \u0627\u0644\u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u0636\u0627\u0641\u0629',
    grandTotal: '\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A (\u0634\u0627\u0645\u0644 \u0627\u0644\u0636\u0631\u064A\u0628\u0629)',
    noPriceNote: '\u0627\u0644\u062A\u0633\u0639\u064A\u0631: \u0633\u064A\u0631\u0627\u062C\u0639 \u0641\u0631\u064A\u0642\u0646\u0627 \u0645\u0648\u0627\u0635\u0641\u0627\u062A\u0643 \u0648\u064A\u0631\u0633\u0644 \u062A\u0623\u0643\u064A\u062F\u0627\u064B \u062A\u0641\u0635\u064A\u0644\u064A\u0627\u064B \u0644\u0644\u0623\u0633\u0639\u0627\u0631 \u062E\u0644\u0627\u0644 24 \u0633\u0627\u0639\u0629.',
    footer: '\u0647\u0630\u0627 \u0627\u0644\u0639\u0631\u0636 \u0635\u0627\u0644\u062D \u0644\u0645\u062F\u0629 30 \u064A\u0648\u0645\u0627\u064B \u0645\u0646 \u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0625\u0635\u062F\u0627\u0631. \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0627\u0633\u062A\u0631\u0634\u0627\u062F\u064A\u0629 \u0648\u062A\u062E\u0636\u0639 \u0644\u0644\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0646\u0647\u0627\u0626\u064A.\nHimalayan Gulf Stones \u00B7 himalayangulfstones.com \u00B7 \u062C\u0645\u064A\u0639 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0628\u0627\u0644\u0631\u064A\u0627\u0644 \u0627\u0644\u0633\u0639\u0648\u062F\u064A (SAR) \u00B7 \u0636\u0631\u064A\u0628\u0629 \u0627\u0644\u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u0636\u0627\u0641\u0629 15%',
    tbd: '\u064A\u062D\u062F\u062F \u0644\u0627\u062D\u0642\u0627\u064B',
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
  const L = isAr ? LABELS.ar : LABELS.en;

  // Font helpers — Cairo covers both Arabic and Latin characters
  const af = isAr ? { fontFamily: 'Cairo', fontWeight: 400 } : {};
  const afBold = isAr ? { fontFamily: 'Cairo', fontWeight: 700 } : {};

  const lineItems = products.map(p => {
    const qty = parseFloat(p.quantity || '0') || 0;
    const price = p.pricePerM2 || 0;
    const displayName = isAr && p.nameAr ? p.nameAr : p.nameEn;
    return { ...p, qty, price, total: qty * price, displayName };
  });

  // Prices are VAT-inclusive — extract VAT component rather than adding on top
  const grandTotal = lineItems.reduce((s, li) => s + li.total, 0);
  const subtotal   = Math.round(grandTotal / (1 + vatPercent / 100));
  const vat        = grandTotal - subtotal;
  const hasPrice   = lineItems.some(li => li.price > 0);
  const hasTotals  = hasPrice && grandTotal > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header — always in English (brand name) */}
        <View style={styles.header}>
          <Text style={styles.headerCompany}>Himalayan Gulf Stones</Text>
          <Text style={styles.headerSub}>himalayangulfstones.com</Text>
        </View>

        <View style={styles.body}>
          {/* Title + Reference */}
          <View style={styles.titleRow}>
            <Text style={[styles.titleText, afBold]}>{L.title}</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={styles.refBox}>
                <Text style={styles.refText}>{quoteRef}</Text>
              </View>
              <Text style={styles.dateText}>{date}</Text>
            </View>
          </View>

          {/* Customer Information */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, afBold]}>{L.customer}</Text>
            {customer.name    ? <View style={styles.infoRow}><Text style={[styles.infoLabel, af]}>{L.name}</Text><Text style={[styles.infoValue, af]}>{customer.name}</Text></View> : null}
            {customer.company ? <View style={styles.infoRow}><Text style={[styles.infoLabel, af]}>{L.company}</Text><Text style={[styles.infoValue, af]}>{customer.company}</Text></View> : null}
            {customer.phone   ? <View style={styles.infoRow}><Text style={[styles.infoLabel, af]}>{L.phone}</Text><Text style={[styles.infoValue, af]}>{customer.phone}</Text></View> : null}
            {customer.email   ? <View style={styles.infoRow}><Text style={[styles.infoLabel, af]}>{L.email}</Text><Text style={[styles.infoValue, af]}>{customer.email}</Text></View> : null}
          </View>

          {/* Project Details */}
          {(project.type || project.city || project.timeline) ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, afBold]}>{L.project}</Text>
              {project.type     ? <View style={styles.infoRow}><Text style={[styles.infoLabel, af]}>{L.projectType}</Text><Text style={[styles.infoValue, af]}>{project.type}</Text></View> : null}
              {project.city     ? <View style={styles.infoRow}><Text style={[styles.infoLabel, af]}>{L.city}</Text><Text style={[styles.infoValue, af]}>{project.city}</Text></View> : null}
              {project.timeline ? <View style={styles.infoRow}><Text style={[styles.infoLabel, af]}>{L.timeline}</Text><Text style={[styles.infoValue, af]}>{project.timeline}</Text></View> : null}
            </View>
          ) : null}

          {/* Products Table */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, afBold]}>{L.products}</Text>
            {/* Header row */}
            <View style={styles.tableHeader}>
              <Text style={[styles.thText, styles.colNum, af]}>#</Text>
              <Text style={[styles.thText, styles.colName, af]}>{L.product}</Text>
              <Text style={[styles.thText, styles.colSpecs, af]}>{L.specs}</Text>
              <Text style={[styles.thText, styles.colQty, af]}>{L.qty}</Text>
              {hasPrice ? <Text style={[styles.thText, styles.colPrice, af]}>{L.price}</Text> : null}
              {hasPrice ? <Text style={[styles.thText, styles.colTotal, af]}>{L.total}</Text> : null}
            </View>
            {/* Data rows */}
            {lineItems.map((item, i) => {
              const specs = [item.dimensions, item.thickness, item.finish].filter(Boolean).join(' · ');
              return (
                <View key={i} style={[styles.tableRow, i % 2 === 1 ? { backgroundColor: ROW_ALT } : {}]}>
                  <Text style={[styles.tdText, styles.colNum]}>{i + 1}</Text>
                  <View style={styles.colName}>
                    <Text style={[styles.tdText, { fontFamily: isAr ? 'Cairo' : 'Helvetica-Bold', fontWeight: isAr ? 700 : undefined }]}>{item.displayName}</Text>
                    <Text style={[styles.tdSub, af]}>{item.type}</Text>
                  </View>
                  <Text style={[styles.tdText, styles.colSpecs, { color: '#555' }, af]}>{specs || '—'}</Text>
                  <Text style={[styles.tdText, styles.colQty, af]}>{item.qty > 0 ? String(item.qty) : '—'}</Text>
                  {hasPrice ? <Text style={[styles.tdText, styles.colPrice, af]}>{item.price > 0 ? fmt(item.price) : L.tbd}</Text> : null}
                  {hasPrice ? <Text style={[styles.tdText, styles.colTotal, af]}>{item.total > 0 ? fmt(item.total) : L.tbd}</Text> : null}
                </View>
              );
            })}
          </View>

          {/* Pricing Summary */}
          {hasTotals ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, afBold]}>{L.pricing}</Text>
              <View style={styles.totalsContainer}>
                <View style={styles.totalsRow}>
                  <Text style={[styles.totalsLabel, af]}>{L.subtotal}</Text>
                  <Text style={[styles.totalsValue, af]}>{fmt(subtotal)}</Text>
                </View>
                <View style={styles.totalsRow}>
                  <Text style={[styles.totalsLabel, af]}>{L.vat} ({vatPercent}%)</Text>
                  <Text style={[styles.totalsValue, af]}>{fmt(vat)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.totalsRow}>
                  <Text style={[styles.totalsLabel, styles.grandLabel, afBold]}>{L.grandTotal}</Text>
                  <Text style={[styles.totalsValue, styles.grandValue, afBold]}>{fmt(grandTotal)}</Text>
                </View>
              </View>
            </View>
          ) : hasPrice ? null : (
            <View style={styles.noPriceNote}>
              <Text style={[styles.noPriceText, af]}>
                {L.noPriceNote}
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={[styles.footerText, af]}>
            {L.footer}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
