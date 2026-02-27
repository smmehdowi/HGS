import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getContent, saveContent } from '@/lib/config-store';

export async function GET(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const locale = request.nextUrl.searchParams.get('locale') ?? 'en';
  const content = await getContent(locale);
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const locale = request.nextUrl.searchParams.get('locale') ?? 'en';
  const content = await request.json();
  await saveContent(locale, content);
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
