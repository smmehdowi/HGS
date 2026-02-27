import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getNews, saveNews } from '@/lib/config-store';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const news = await getNews();
  const idx = news.findIndex((a) => a.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  news[idx] = { ...news[idx], ...body, id };
  await saveNews(news);
  revalidatePath('/', 'layout');
  return NextResponse.json(news[idx]);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const news = await getNews();
  const filtered = news.filter((a) => a.id !== id);
  await saveNews(filtered);
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
