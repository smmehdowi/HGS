import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getHomeLayout, saveHomeLayout } from '@/lib/config-store';
import { HomeSection } from '@/lib/admin-types';

export async function GET(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const layout = await getHomeLayout();
  return NextResponse.json(layout);
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body: HomeSection[] = await request.json();
  await saveHomeLayout(body);
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
