import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getSections, saveSections } from '@/lib/config-store';
import { CustomSection } from '@/lib/admin-types';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const sections = await getSections();
  return NextResponse.json(sections);
}

export async function POST(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const sections = await getSections();
  const maxOrder = sections.length > 0 ? Math.max(...sections.map((s) => s.order)) : 0;
  const section: CustomSection = {
    id: randomUUID(),
    titleEn: body.titleEn ?? '',
    titleAr: body.titleAr ?? '',
    contentEn: body.contentEn ?? '',
    contentAr: body.contentAr ?? '',
    imageUrl: body.imageUrl ?? '',
    ctaTextEn: body.ctaTextEn ?? '',
    ctaTextAr: body.ctaTextAr ?? '',
    ctaUrl: body.ctaUrl ?? '',
    order: body.order ?? maxOrder + 1,
    visible: body.visible ?? true,
  };
  sections.push(section);
  sections.sort((a, b) => a.order - b.order);
  await saveSections(sections);
  revalidatePath('/', 'layout');
  return NextResponse.json(section, { status: 201 });
}
