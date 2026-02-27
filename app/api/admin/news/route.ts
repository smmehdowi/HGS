import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getNews, saveNews } from '@/lib/config-store';
import { NewsArticle } from '@/lib/admin-types';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const news = await getNews();
  return NextResponse.json(news);
}

export async function POST(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const news = await getNews();
  const article: NewsArticle = {
    id: randomUUID(),
    titleEn: body.titleEn ?? '',
    titleAr: body.titleAr ?? '',
    summaryEn: body.summaryEn ?? '',
    summaryAr: body.summaryAr ?? '',
    contentEn: body.contentEn ?? '',
    contentAr: body.contentAr ?? '',
    imageUrl: body.imageUrl ?? '',
    publishedAt: new Date().toISOString(),
    visible: body.visible ?? true,
  };
  news.unshift(article);
  await saveNews(news);
  revalidatePath('/', 'layout');
  return NextResponse.json(article, { status: 201 });
}
