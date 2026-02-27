import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getSections, saveSections } from '@/lib/config-store';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const sections = await getSections();
  const idx = sections.findIndex((s) => s.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  sections[idx] = { ...sections[idx], ...body, id };
  sections.sort((a, b) => a.order - b.order);
  await saveSections(sections);
  revalidatePath('/', 'layout');
  return NextResponse.json(sections[idx]);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const sections = await getSections();
  const filtered = sections.filter((s) => s.id !== id);
  await saveSections(filtered);
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
