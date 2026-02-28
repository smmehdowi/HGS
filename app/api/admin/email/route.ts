import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getEmailSettings, saveEmailSettings } from '@/lib/config-store';

export async function GET(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const settings = await getEmailSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const settings = await request.json();
  await saveEmailSettings(settings);
  return NextResponse.json({ ok: true });
}
