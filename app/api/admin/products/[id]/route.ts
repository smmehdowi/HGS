import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getProducts, saveProducts } from '@/lib/config-store';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  products[idx] = { ...products[idx], ...body, id };
  await saveProducts(products);
  revalidatePath('/', 'layout');
  return NextResponse.json(products[idx]);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const products = await getProducts();
  await saveProducts(products.filter((p) => p.id !== id));
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
