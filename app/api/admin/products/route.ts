import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getProducts, saveProducts } from '@/lib/config-store';
import { StoneProduct } from '@/lib/admin-types';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(await getProducts());
}

export async function POST(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const products = await getProducts();
  const product: StoneProduct = {
    id: body.id || randomUUID(),
    nameEn: body.nameEn ?? '',
    nameAr: body.nameAr ?? '',
    descriptionEn: body.descriptionEn ?? '',
    descriptionAr: body.descriptionAr ?? '',
    category: body.category ?? 'slate',
    colors: body.colors ?? [],
    finishes: body.finishes ?? [],
    applications: body.applications ?? [],
    origin: body.origin ?? '',
    sizes: body.sizes ?? [],
    thickness: body.thickness ?? [],
    image: body.image ?? '',
    visible: body.visible ?? true,
  };
  products.push(product);
  await saveProducts(products);
  revalidatePath('/', 'layout');
  return NextResponse.json(product, { status: 201 });
}
