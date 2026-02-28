import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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

function fmt(n: number): string {
  return `SAR ${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export interface QuotePDFProduct {
  nameEn: string;
  type: string;
  quantity?: string;
  dimensions?: string;
  thickness?: string;
  finish?: string;
  pricePerM2?: number;
}

export interface QuotePDFProps {
  quoteRef: string;
  date: string;
  customer: { name: string; company: string; phone: string; email: string };
  project: { type: string; city: string; timeline: string };
  products: QuotePDFProduct[];
  vatPercent: number;
}

export function QuotePDF({ quoteRef, date, customer, project, products, vatPercent }: QuotePDFProps) {
  const lineItems = products.map(p => {
    const qty = parseFloat(p.quantity || '0') || 0;
    const price = p.pricePerM2 || 0;
    return { ...p, qty, price, total: qty * price };
  });

  const subtotal = lineItems.reduce((s, li) => s + li.total, 0);
  const vat = Math.round(subtotal * vatPercent / 100);
  const grandTotal = subtotal + vat;
  const hasPrice = lineItems.some(li => li.price > 0);
  const hasTotals = hasPrice && subtotal > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerCompany}>Himalayan Gulf Stones</Text>
          <Text style={styles.headerSub}>himalayangulfstones.com</Text>
        </View>

        <View style={styles.body}>
          {/* Title + Reference */}
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>Quote Summary</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={styles.refBox}>
                <Text style={styles.refText}>{quoteRef}</Text>
              </View>
              <Text style={styles.dateText}>{date}</Text>
            </View>
          </View>

          {/* Customer Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            {customer.name    ? <View style={styles.infoRow}><Text style={styles.infoLabel}>Name</Text><Text style={styles.infoValue}>{customer.name}</Text></View> : null}
            {customer.company ? <View style={styles.infoRow}><Text style={styles.infoLabel}>Company</Text><Text style={styles.infoValue}>{customer.company}</Text></View> : null}
            {customer.phone   ? <View style={styles.infoRow}><Text style={styles.infoLabel}>Phone</Text><Text style={styles.infoValue}>{customer.phone}</Text></View> : null}
            {customer.email   ? <View style={styles.infoRow}><Text style={styles.infoLabel}>Email</Text><Text style={styles.infoValue}>{customer.email}</Text></View> : null}
          </View>

          {/* Project Details */}
          {(project.type || project.city || project.timeline) ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Project Details</Text>
              {project.type     ? <View style={styles.infoRow}><Text style={styles.infoLabel}>Project Type</Text><Text style={styles.infoValue}>{project.type}</Text></View> : null}
              {project.city     ? <View style={styles.infoRow}><Text style={styles.infoLabel}>City</Text><Text style={styles.infoValue}>{project.city}</Text></View> : null}
              {project.timeline ? <View style={styles.infoRow}><Text style={styles.infoLabel}>Timeline</Text><Text style={styles.infoValue}>{project.timeline}</Text></View> : null}
            </View>
          ) : null}

          {/* Products Table */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Products Requested</Text>
            {/* Header row */}
            <View style={styles.tableHeader}>
              <Text style={[styles.thText, styles.colNum]}>#</Text>
              <Text style={[styles.thText, styles.colName]}>Product</Text>
              <Text style={[styles.thText, styles.colSpecs]}>Specifications</Text>
              <Text style={[styles.thText, styles.colQty]}>Qty m²</Text>
              {hasPrice ? <Text style={[styles.thText, styles.colPrice]}>Price/m²</Text> : null}
              {hasPrice ? <Text style={[styles.thText, styles.colTotal]}>Total</Text> : null}
            </View>
            {/* Data rows */}
            {lineItems.map((item, i) => {
              const specs = [item.dimensions, item.thickness, item.finish].filter(Boolean).join(' · ');
              return (
                <View key={i} style={[styles.tableRow, i % 2 === 1 ? { backgroundColor: ROW_ALT } : {}]}>
                  <Text style={[styles.tdText, styles.colNum]}>{i + 1}</Text>
                  <View style={styles.colName}>
                    <Text style={[styles.tdText, { fontFamily: 'Helvetica-Bold' }]}>{item.nameEn}</Text>
                    <Text style={styles.tdSub}>{item.type}</Text>
                  </View>
                  <Text style={[styles.tdText, styles.colSpecs, { color: '#555' }]}>{specs || '—'}</Text>
                  <Text style={[styles.tdText, styles.colQty]}>{item.qty > 0 ? String(item.qty) : '—'}</Text>
                  {hasPrice ? <Text style={[styles.tdText, styles.colPrice]}>{item.price > 0 ? fmt(item.price) : 'TBD'}</Text> : null}
                  {hasPrice ? <Text style={[styles.tdText, styles.colTotal]}>{item.total > 0 ? fmt(item.total) : 'TBD'}</Text> : null}
                </View>
              );
            })}
          </View>

          {/* Pricing Summary */}
          {hasTotals ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pricing Summary</Text>
              <View style={styles.totalsContainer}>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>Subtotal (excl. VAT)</Text>
                  <Text style={styles.totalsValue}>{fmt(subtotal)}</Text>
                </View>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>VAT ({vatPercent}%)</Text>
                  <Text style={styles.totalsValue}>{fmt(vat)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.totalsRow}>
                  <Text style={[styles.totalsLabel, styles.grandLabel]}>Total (incl. VAT)</Text>
                  <Text style={[styles.totalsValue, styles.grandValue]}>{fmt(grandTotal)}</Text>
                </View>
              </View>
            </View>
          ) : hasPrice ? null : (
            <View style={styles.noPriceNote}>
              <Text style={styles.noPriceText}>
                Pricing: Our team will review your specifications and send a detailed price confirmation within 24 hours.
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            This quote is valid for 30 days from the date of issue. Prices are indicative and subject to final confirmation upon review.{'\n'}
            Himalayan Gulf Stones · himalayangulfstones.com · All prices in Saudi Riyals (SAR) · VAT 15% included
          </Text>
        </View>
      </Page>
    </Document>
  );
}
