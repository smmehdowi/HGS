import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getDaftraSettings, saveDaftraSettings } from '@/lib/config-store';
import { testDaftraConnection } from '@/lib/daftra';

export async function GET(request: NextRequest) {
  if (!verifyAdminRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const settings = await getDaftraSettings();
  return NextResponse.json(settings);
}

// Strip full domain if user accidentally pastes "mycompany.daftra.com" instead of "mycompany"
function sanitizeSubdomain(raw: string): string {
  return raw.trim().replace(/\.daftra\.com.*$/i, '');
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  await saveDaftraSettings({
    enabled:      Boolean(body.enabled),
    subdomain:    sanitizeSubdomain(String(body.subdomain   ?? '')),
    apiKey:       String(body.apiKey      ?? '').trim(),
    storeId:      Number(body.storeId     ?? 1),
    currencyCode: String(body.currencyCode ?? 'SAR').trim() || 'SAR',
  });
  return NextResponse.json({ ok: true });
}

// POST /api/admin/daftra — test credentials without saving
export async function POST(request: NextRequest) {
  if (!verifyAdminRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { subdomain, apiKey } = await request.json();
  if (!subdomain || !apiKey) return NextResponse.json({ ok: false, error: 'subdomain and apiKey required' });
  const result = await testDaftraConnection(sanitizeSubdomain(String(subdomain)), String(apiKey).trim());
  return NextResponse.json(result);
}
