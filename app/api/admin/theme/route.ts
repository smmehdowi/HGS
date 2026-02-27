import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getTheme, saveTheme } from '@/lib/config-store';

export async function GET(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const theme = await getTheme();
  return NextResponse.json(theme);
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const theme = await request.json();
  await saveTheme(theme);
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
