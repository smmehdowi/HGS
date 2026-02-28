import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getWhatsAppSettings, saveWhatsAppSettings } from '@/lib/config-store';

export async function GET(request: NextRequest) {
  const authError = await verifyAdminRequest(request);
  if (authError) return authError;
  const settings = await getWhatsAppSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const authError = await verifyAdminRequest(request);
  if (authError) return authError;
  const settings = await request.json();
  await saveWhatsAppSettings(settings);
  return NextResponse.json({ ok: true });
}
